// create-checkout
//
// Creates a Stripe Embedded Checkout session for one product through Lovable
// Payments and returns its client secret; the browser renders the form in a
// dialog (src/components/course/CheckoutDialog.tsx).
//
// Trust model: the client sends only a product SLUG, a return path and the
// environment name. Price and Stripe lookup key are read server-side from the
// products table, and Stripe charges its own price for that key, so a
// tampered request cannot buy a $550 bundle for $19.99.
//
// Buyers may be signed out. A signed-in buyer is attached to a Stripe
// Customer tagged with their user id; a guest is resolved by email in
// payments-webhook, which provisions the account and sends the set-password
// email the success page describes.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import type Stripe from "https://esm.sh/stripe@22.0.2";
import { corsHeaders, fail, json } from "../_shared/cors.ts";
import { createStripeClient, isStripeEnv } from "../_shared/stripe.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

/** Lookup key convention for the Lovable Payments catalog. */
const lookupKeyFor = (slug: string) => `${slug.replace(/-/g, "_")}_onetime`;

/** Cover shown beside the price in Stripe Checkout. Must be a public https URL. */
function coverUrl(origin: string, product: { slug: string; type: string }): string | null {
  if (!origin.startsWith("https://")) return null;
  const path = product.type === "download"
    ? "/images/ebook/living-life-balanced.jpg"
    : `/images/courses/${product.slug}.jpg`;
  return `${origin}${path}`;
}

async function resolveOrCreateCustomer(
  stripe: Stripe,
  user: { id: string; email?: string },
): Promise<string> {
  if (!/^[a-zA-Z0-9_-]+$/.test(user.id)) throw new Error("Invalid user id");
  const found = await stripe.customers.search({ query: `metadata['userId']:'${user.id}'`, limit: 1 });
  if (found.data.length) return found.data[0].id;
  if (user.email) {
    const existing = await stripe.customers.list({ email: user.email, limit: 1 });
    if (existing.data.length) {
      const customer = existing.data[0];
      if (customer.metadata?.userId !== user.id) {
        await stripe.customers.update(customer.id, { metadata: { ...customer.metadata, userId: user.id } });
      }
      return customer.id;
    }
  }
  const created = await stripe.customers.create({
    ...(user.email ? { email: user.email } : {}),
    metadata: { userId: user.id },
  });
  return created.id;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const { productSlug, returnPath, environment } = await req.json();
    if (typeof productSlug !== "string" || !productSlug) {
      return json({ error: "productSlug is required" }, 400);
    }
    if (!isStripeEnv(environment)) return json({ error: "Invalid environment" }, 400);

    const origin = req.headers.get("origin") ?? "";
    // Only ever return the buyer to the caller's own origin, never to a URL
    // the request body supplies verbatim.
    const safePath = typeof returnPath === "string" && returnPath.startsWith("/")
      ? returnPath
      : "/checkout/success";
    const returnUrl = `${origin}${safePath}?session_id={CHECKOUT_SESSION_ID}`;

    const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

    const { data: product, error: productError } = await admin
      .from("products")
      .select("id, slug, title, subtitle, type, price_cents, stripe_price_id, active")
      .eq("slug", productSlug)
      .maybeSingle();
    if (productError) throw productError;
    if (!product || !product.active) return json({ error: "Product not available" }, 404);

    let user: { id: string; email?: string } | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const { data } = await admin.auth.getUser(authHeader.replace("Bearer ", ""));
      if (data.user) user = { id: data.user.id, email: data.user.email ?? undefined };
    }

    const stripe = createStripeClient(environment);
    const lookupKey = product.stripe_price_id || lookupKeyFor(product.slug);
    const prices = await stripe.prices.list({
      lookup_keys: [lookupKey],
      active: true,
      expand: ["data.product"],
    });
    if (!prices.data.length) {
      console.error(`[create-checkout] no ${environment} price for lookup key ${lookupKey}`);
      return json({ error: "Price not found", code: "price_not_found" }, 404);
    }
    const price = prices.data[0];
    if (price.type === "recurring") return json({ error: "Product not available" }, 400);
    const stripeProduct = price.product as Stripe.Product;

    // The Lovable Payments products were created without artwork. Attach the
    // site's own cover the first time each product is bought in an
    // environment, so the checkout form shows it from then on.
    const cover = coverUrl(origin, product);
    if (cover && !(stripeProduct.images?.length)) {
      try {
        await stripe.products.update(stripeProduct.id, { images: [cover] });
      } catch (error) {
        console.warn("[create-checkout] could not set product image", error);
      }
    }

    const customerId = user ? await resolveOrCreateCustomer(stripe, user) : undefined;
    const metadata = {
      userId: user?.id ?? "",
      priceId: lookupKey,
      product_id: product.id,
      product_slug: product.slug,
      managed_payments: "true",
    };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: price.id, quantity: 1 }],
      ui_mode: "embedded_page",
      return_url: returnUrl,
      ...(customerId ? { customer: customerId } : {}),
      // Lovable's full-compliance tax path: Stripe calculates, collects and
      // files. Do not combine with automatic_tax or customer_email.
      managed_payments: { enabled: true },
      metadata,
      payment_intent_data: {
        description: product.title,
        metadata: { userId: metadata.userId, priceId: lookupKey, product_slug: product.slug },
      },
    } as Stripe.Checkout.SessionCreateParams);

    return json({ clientSecret: session.client_secret, sessionId: session.id });
  } catch (error) {
    return fail("create-checkout", error);
  }
});
