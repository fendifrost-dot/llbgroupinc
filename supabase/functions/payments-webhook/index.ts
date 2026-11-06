// payments-webhook
//
// The ONLY writer of purchases and entitlements. Lovable Payments registered
// this endpoint in Stripe as
//   https://<project-ref>.supabase.co/functions/v1/payments-webhook?env=sandbox
// (and ?env=live after go-live). The signature is verified against that
// environment's signing secret, then:
//   checkout.session.completed / async_payment_succeeded (paid) ->
//     resolve or provision the user -> record the purchase ->
//     grant the entitlement, fanning a bundle out to its child products.
//
// Idempotent on stripe_session_id: Stripe retries deliveries, and a duplicate
// must never double-grant or error the delivery into a retry loop.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { isStripeEnv, type StripeEnv, verifyWebhook } from "../_shared/stripe.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const siteUrl = Deno.env.get("SITE_URL") ?? "";

const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

// deno-lint-ignore no-explicit-any
type CheckoutSession = Record<string, any>;

/** Find the existing account for an email, or provision one and invite them. */
async function resolveUser(email: string): Promise<string | null> {
  const { data: existing, error } = await admin.rpc("user_id_for_email", { p_email: email });
  if (error) console.error("[payments-webhook] user lookup failed", error);
  if (existing) return existing as string;

  // New buyer. inviteUserByEmail creates the account AND sends the
  // set-your-password email the success page tells them to look for.
  const redirectTo = siteUrl ? `${siteUrl}/account` : undefined;
  const invited = await admin.auth.admin.inviteUserByEmail(email, { redirectTo });
  if (!invited.error && invited.data.user) return invited.data.user.id;

  // Invite can fail if SMTP is not configured. Still create the account so
  // the entitlement lands; the email can be triggered separately.
  console.error("[payments-webhook] invite failed, creating user directly", invited.error);
  const created = await admin.auth.admin.createUser({ email, email_confirm: true });
  if (created.error) {
    console.error("[payments-webhook] user creation failed", created.error);
    return null;
  }
  return created.data.user?.id ?? null;
}

/** The product row for a session: by id from metadata, else by lookup key. */
async function resolveProduct(session: CheckoutSession): Promise<{ id: string } | null> {
  const productId = session.metadata?.product_id;
  if (productId) {
    const { data } = await admin.from("products").select("id").eq("id", productId).maybeSingle();
    if (data) return data;
  }
  const lookupKey = session.metadata?.priceId;
  if (lookupKey) {
    const { data } = await admin.from("products").select("id").eq("stripe_price_id", lookupKey).maybeSingle();
    if (data) return data;
  }
  return null;
}

/** A bundle grants its children; anything else grants itself. */
async function productsToGrant(productId: string): Promise<string[]> {
  const { data, error } = await admin
    .from("bundle_items")
    .select("child_product_id")
    .eq("bundle_product_id", productId);
  if (error) throw error;
  if (!data?.length) return [productId];
  return data.map((row) => row.child_product_id as string);
}

async function handleCompletedSession(session: CheckoutSession, env: StripeEnv) {
  if (session.mode !== "payment") {
    console.log(`[payments-webhook] session ${session.id} is ${session.mode}, not a one-time purchase; ignoring`);
    return;
  }
  if (session.payment_status !== "paid") {
    console.log(`[payments-webhook] session ${session.id} not paid yet, ignoring`);
    return;
  }

  // Idempotency gate: if we already recorded this session as paid, stop.
  const { data: existingPurchase } = await admin
    .from("purchases")
    .select("id, status")
    .eq("stripe_session_id", session.id)
    .maybeSingle();
  if (existingPurchase?.status === "paid") {
    console.log(`[payments-webhook] session ${session.id} already processed`);
    return;
  }

  const product = await resolveProduct(session);
  if (!product) throw new Error(`session ${session.id}: no matching product`);

  const email: string | null = session.customer_details?.email ?? session.customer_email ?? null;
  let userId: string | null = session.metadata?.userId || session.client_reference_id || null;
  if (!userId && email) userId = await resolveUser(email);
  if (!userId) throw new Error(`session ${session.id}: could not resolve a user`);

  const { data: purchase, error: purchaseError } = await admin
    .from("purchases")
    .upsert({
      user_id: userId,
      email,
      product_id: product.id,
      stripe_session_id: session.id,
      stripe_payment_intent_id: typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null,
      status: "paid",
      amount_cents: session.amount_total,
      currency: session.currency ?? "usd",
      livemode: env === "live",
    }, { onConflict: "stripe_session_id" })
    .select("id")
    .single();
  if (purchaseError) throw purchaseError;

  const grants = await productsToGrant(product.id);
  const { error: entitlementError } = await admin
    .from("entitlements")
    .upsert(
      grants.map((id) => ({ user_id: userId, product_id: id, source_purchase: purchase.id })),
      { onConflict: "user_id,product_id", ignoreDuplicates: true },
    );
  if (entitlementError) throw entitlementError;

  console.log(`[payments-webhook] granted ${grants.length} entitlement(s) to ${userId} from ${session.id}`);
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const env = new URL(req.url).searchParams.get("env");
  if (!isStripeEnv(env)) return new Response("Unknown environment", { status: 400 });

  let event;
  try {
    event = await verifyWebhook(req, env);
  } catch (error) {
    console.error("[payments-webhook] signature verification failed", error);
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    const object = event.data.object;
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        await handleCompletedSession(object, env);
        break;
      case "checkout.session.async_payment_failed":
        await admin.from("purchases").update({ status: "failed" }).eq("stripe_session_id", object.id);
        break;
      case "charge.refunded":
        // Only delivered if Lovable adds the event to the endpoint. Entitlement
        // revocation on refund stays a manual step (docs/COURSE_PLATFORM_SETUP.md).
        if (object.payment_intent) {
          await admin.from("purchases")
            .update({ status: "refunded" })
            .eq("stripe_payment_intent_id", object.payment_intent as string);
        }
        break;
      default:
        // Subscription and invoice events arrive for the membership product,
        // which the site does not sell yet; nothing to record.
        console.log(`[payments-webhook] ignoring ${event.type}`);
    }
  } catch (error) {
    console.error(`[payments-webhook] handler failed for ${event.type}`, error);
    // 500 tells Stripe to retry, which is correct because the handler is idempotent.
    return new Response("Handler error", { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
