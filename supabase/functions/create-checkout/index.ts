// create-checkout — Handoff §4.3
//
// Creates a Stripe Checkout Session for one product. TEST MODE while
// STRIPE_SECRET_KEY is a sk_test_... key; nothing here needs to change at
// launch except swapping that secret and the price ids in the products table.
//
// Trust model: the client sends only a product SLUG. Price, currency and the
// Stripe price id are read server-side from the products table, so a tampered
// request cannot buy a $267 bundle for $19.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { corsHeaders, fail, json } from "../_shared/cors.ts";

const stripeKey = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  if (!stripeKey) {
    return json(
      { error: "Payments are not configured yet.", code: "stripe_not_configured" },
      503,
    );
  }

  try {
    const { productSlug, successUrl, cancelUrl } = await req.json();
    if (typeof productSlug !== "string" || !productSlug) {
      return json({ error: "productSlug is required" }, 400);
    }

    const origin = req.headers.get("origin") ?? "";
    // Only ever redirect back to the caller's own origin — never to a URL the
    // request body supplies verbatim.
    const safePath = (value: unknown, fallback: string) =>
      typeof value === "string" && value.startsWith("/") ? value : fallback;
    const success = `${origin}${safePath(successUrl, "/checkout/success")}` +
      "?session_id={CHECKOUT_SESSION_ID}";
    const cancel = `${origin}${safePath(cancelUrl, "/checkout/cancelled")}`;

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const { data: product, error: productError } = await admin
      .from("products")
      .select("id, slug, title, subtitle, type, price_cents, stripe_price_id, active")
      .eq("slug", productSlug)
      .maybeSingle();

    if (productError) throw productError;
    if (!product || !product.active) return json({ error: "Product not available" }, 404);

    // If the caller is signed in, tie the session to their user id up front so
    // the webhook does not have to match on email.
    let userId: string | null = null;
    let userEmail: string | undefined;
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const { data } = await admin.auth.getUser(authHeader.replace("Bearer ", ""));
      if (data.user) {
        userId = data.user.id;
        userEmail = data.user.email ?? undefined;
      }
    }

    // Prefer a real Stripe price id once Fendi has created them; fall back to
    // inline price_data so test-mode checkout works before that happens.
    const lineItem = product.stripe_price_id
      ? { price: product.stripe_price_id, quantity: 1 }
      : {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: product.price_cents,
          product_data: {
            name: product.title,
            description: product.subtitle ?? undefined,
          },
        },
      };

    const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" });
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [lineItem],
      success_url: success,
      cancel_url: cancel,
      client_reference_id: userId ?? undefined,
      customer_email: userEmail,
      // Collected for the signed-out path: the webhook provisions an account
      // from this address.
      customer_creation: userId ? undefined : "always",
      allow_promotion_codes: true,
      metadata: {
        product_id: product.id,
        product_slug: product.slug,
        user_id: userId ?? "",
      },
    });

    return json({ url: session.url, sessionId: session.id });
  } catch (error) {
    return fail("create-checkout", error);
  }
});
