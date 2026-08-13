// stripe-webhook — Handoff §4.3 and §6.3
//
// The ONLY writer of entitlements. Verifies the Stripe signature, then:
//   checkout.session.completed (paid) →
//     resolve or provision the user → record the purchase →
//     grant the entitlement, fanning a bundle out to its child products.
//
// Idempotent on stripe_session_id: Stripe retries deliveries, and a duplicate
// must never double-grant or error the delivery into a retry loop.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const stripeKey = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const siteUrl = Deno.env.get("SITE_URL") ?? "";

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

/** Find the existing account for an email, or provision one and invite them. */
async function resolveUser(email: string): Promise<string | null> {
  const { data: existing, error } = await admin.rpc("user_id_for_email", {
    p_email: email,
  });
  if (error) console.error("[stripe-webhook] user lookup failed", error);
  if (existing) return existing as string;

  // New buyer. inviteUserByEmail creates the account AND sends the
  // set-your-password email the success page tells them to look for.
  const redirectTo = siteUrl ? `${siteUrl}/account` : undefined;
  const invited = await admin.auth.admin.inviteUserByEmail(email, { redirectTo });
  if (!invited.error && invited.data.user) return invited.data.user.id;

  // Invite can fail if SMTP is not configured yet. Still create the account so
  // the entitlement lands; Fendi can trigger the email separately.
  console.error("[stripe-webhook] invite failed, creating user directly", invited.error);
  const created = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
  });
  if (created.error) {
    console.error("[stripe-webhook] user creation failed", created.error);
    return null;
  }
  return created.data.user?.id ?? null;
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

async function handleCompletedSession(session: Stripe.Checkout.Session, livemode: boolean) {
  if (session.payment_status !== "paid") {
    console.log(`[stripe-webhook] session ${session.id} not paid yet, ignoring`);
    return;
  }

  // Idempotency gate: if we already recorded this session as paid, stop.
  const { data: existingPurchase } = await admin
    .from("purchases")
    .select("id, status")
    .eq("stripe_session_id", session.id)
    .maybeSingle();
  if (existingPurchase?.status === "paid") {
    console.log(`[stripe-webhook] session ${session.id} already processed`);
    return;
  }

  const productId = session.metadata?.product_id;
  if (!productId) throw new Error(`session ${session.id} has no product_id metadata`);

  const email = session.customer_details?.email ?? session.customer_email ?? null;
  let userId = session.client_reference_id || session.metadata?.user_id || null;
  if (!userId && email) userId = await resolveUser(email);
  if (!userId) throw new Error(`session ${session.id}: could not resolve a user`);

  const { data: purchase, error: purchaseError } = await admin
    .from("purchases")
    .upsert({
      user_id: userId,
      email,
      product_id: productId,
      stripe_session_id: session.id,
      stripe_payment_intent_id: typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null,
      status: "paid",
      amount_cents: session.amount_total,
      currency: session.currency ?? "usd",
      livemode,
    }, { onConflict: "stripe_session_id" })
    .select("id")
    .single();
  if (purchaseError) throw purchaseError;

  const grants = await productsToGrant(productId);
  const { error: entitlementError } = await admin
    .from("entitlements")
    .upsert(
      grants.map((id) => ({
        user_id: userId,
        product_id: id,
        source_purchase: purchase.id,
      })),
      { onConflict: "user_id,product_id", ignoreDuplicates: true },
    );
  if (entitlementError) throw entitlementError;

  console.log(
    `[stripe-webhook] granted ${grants.length} entitlement(s) to ${userId} from ${session.id}`,
  );
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  if (!stripeKey || !webhookSecret) {
    console.error("[stripe-webhook] STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET not set");
    return new Response("Not configured", { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });

  const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" });
  const body = await req.text();

  let event: Stripe.Event;
  try {
    // Async variant: Deno's crypto is promise-based.
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (error) {
    console.error("[stripe-webhook] signature verification failed", error);
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        await handleCompletedSession(
          event.data.object as Stripe.Checkout.Session,
          event.livemode,
        );
        break;
      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await admin.from("purchases")
          .update({ status: "failed" })
          .eq("stripe_session_id", session.id);
        break;
      }
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        if (charge.payment_intent) {
          await admin.from("purchases")
            .update({ status: "refunded" })
            .eq("stripe_payment_intent_id", charge.payment_intent as string);
        }
        // Entitlement revocation on refund is a deliberate manual step for now
        // — flagged in docs/COURSE_PLATFORM_SETUP.md.
        break;
      }
      default:
        console.log(`[stripe-webhook] ignoring ${event.type}`);
    }
  } catch (error) {
    console.error(`[stripe-webhook] handler failed for ${event.type}`, error);
    // 500 tells Stripe to retry — correct, because the handler is idempotent.
    return new Response("Handler error", { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
