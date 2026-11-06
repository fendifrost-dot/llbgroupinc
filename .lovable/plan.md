# Lovable Payments (Stripe) — Integration Reference for GitHub

This is a reference document, not a code change. Nothing in the project, catalog or settings changes when you approve it. Code below is what Lovable would write for this project.

## 0. Facts specific to this project

- Provider: Lovable built-in Payments (Stripe), **test mode**. Lovable manages the Stripe account; there is no `STRIPE_SECRET_KEY`.
- Secrets in the edge-function store (Lovable sets these; never put them in the repo):
  - `STRIPE_SANDBOX_API_KEY`: gateway connection key for test mode. **This is not a real `sk_` key.**
  - `PAYMENTS_SANDBOX_WEBHOOK_SECRET`: `whsec_...` used to verify test webhooks
  - `LOVABLE_API_KEY`: authenticates calls to the gateway
  - After go-live, Lovable adds: `STRIPE_LIVE_API_KEY`, `PAYMENTS_LIVE_WEBHOOK_SECRET`
  - Always present: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- Browser token: `.env.development` contains `VITE_PAYMENTS_CLIENT_TOKEN="pk_test_..."`. Lovable writes `.env.production` with `pk_live_...` at go-live.
- **What breaks in the current repo:** `supabase/functions/create-checkout` and `supabase/functions/stripe-webhook` call `new Stripe(Deno.env.get("STRIPE_SECRET_KEY"))` and use `STRIPE_WEBHOOK_SECRET`. Neither secret exists, so both functions return 503. Calls must go through the gateway client in section 1a. Redirect checkout (`session.url`, `success_url`, `cancel_url`) also gets replaced by Embedded Checkout.
- Price IDs are **lookup keys**: Stripe's real ID is `price_...`, which differs between test and live. Code always resolves by lookup key: `balanced_living_blueprint_onetime`, `justice_advocacy_onetime`, `faith_based_transformation_onetime`, `llb_complete_onetime`, `ebook_7_principles_onetime`, `llb_membership_monthly`, `llb_membership_yearly`.

---

## 1. Starting a checkout (one-time price)

**Mode: embedded, not redirect.** The checkout form renders inside an iframe on your page. Stripe then navigates the browser to `return_url`. Embedded Checkout has no `cancel_url`; the user cancels by closing your dialog or leaving the page.

### 1a. Shared gateway client: `supabase/functions/_shared/stripe.ts` (copy verbatim)

```ts
import { encode } from "https://deno.land/std@0.168.0/encoding/hex.ts";
import Stripe from "https://esm.sh/stripe@22.0.2";
const getEnv = (key: string): string => {
  const value = Deno.env.get(key);
  if (!value) throw new Error(`${key} is not configured`);
  return value;
};

export type StripeEnv = 'sandbox' | 'live';

const GATEWAY_STRIPE_BASE = 'https://connector-gateway.lovable.dev/stripe';

export function getConnectionApiKey(env: StripeEnv): string {
  return env === 'sandbox'
    ? getEnv('STRIPE_SANDBOX_API_KEY')
    : getEnv('STRIPE_LIVE_API_KEY');
}

export function createStripeClient(env: StripeEnv): Stripe {
  const connectionApiKey = getConnectionApiKey(env);
  const lovableApiKey = getEnv('LOVABLE_API_KEY');

  return new Stripe(connectionApiKey, {
    apiVersion: '2026-03-25.dahlia',
    httpClient: Stripe.createFetchHttpClient((input, init) => {
      const stripeUrl = input instanceof Request ? input.url : input.toString();
      const gatewayUrl = stripeUrl.replace('https://api.stripe.com', GATEWAY_STRIPE_BASE);
      return fetch(gatewayUrl, {
        ...init,
        headers: {
          ...Object.fromEntries(
            new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined)).entries(),
          ),
          'X-Connection-Api-Key': connectionApiKey,
          'Lovable-API-Key': lovableApiKey,
        },
      });
    }),
  });
}

export async function verifyWebhook(req: Request, env: StripeEnv): Promise<{ type: string; data: { object: any } }> {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();
  const secret = env === 'sandbox'
    ? getEnv('PAYMENTS_SANDBOX_WEBHOOK_SECRET')
    : getEnv('PAYMENTS_LIVE_WEBHOOK_SECRET');
  if (!signature || !body) throw new Error("Missing signature or body");

  let timestamp: string | undefined;
  const v1Signatures: string[] = [];
  for (const part of signature.split(",")) {
    const [key, value] = part.split("=", 2);
    if (key === "t") timestamp = value;
    if (key === "v1") v1Signatures.push(value);
  }
  if (!timestamp || v1Signatures.length === 0) throw new Error("Invalid signature format");
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) throw new Error("Webhook timestamp too old");

  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signed = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${body}`));
  const expected = new TextDecoder().decode(encode(new Uint8Array(signed)));
  if (!v1Signatures.includes(expected)) throw new Error("Invalid webhook signature");
  return JSON.parse(body);
}
```

### 1b. Packages (browser)

```bash
bun add @stripe/stripe-js@9.2.0 @stripe/react-stripe-js@6.2.0
```

### 1c. `src/lib/stripe.ts`: how `VITE_PAYMENTS_CLIENT_TOKEN` is used

The token is Stripe's publishable key. It does two jobs: it loads Stripe.js, and its prefix tells the server which environment to use.

```ts
import { loadStripe, Stripe } from "@stripe/stripe-js";
type StripeEnv = 'sandbox' | 'live';
const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN;

function paymentsEnvironment(): StripeEnv {
  if (clientToken?.startsWith('pk_test_')) return 'sandbox';
  if (clientToken?.startsWith('pk_live_')) return 'live';
  throw new Error("Stripe payments are not configured for this build. Complete Stripe go-live in your Lovable project to enable production checkout.");
}

let stripePromise: Promise<Stripe | null> | null = null;
export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) { paymentsEnvironment(); stripePromise = loadStripe(clientToken as string); }
  return stripePromise;
}
export function getStripeEnvironment(): StripeEnv { return paymentsEnvironment(); }
```

### 1d. Edge function `supabase/functions/create-checkout/index.ts`

The browser sends `{ priceId, returnUrl, environment }`. The server takes the user from the JWT, never from the request body. It resolves or creates a Stripe Customer tagged with `metadata.userId` and creates an embedded session.

```ts
import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@22.0.2";
import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

const ALLOWED = new Set([
  "balanced_living_blueprint_onetime", "justice_advocacy_onetime",
  "faith_based_transformation_onetime", "llb_complete_onetime",
  "ebook_7_principles_onetime", "llb_membership_monthly", "llb_membership_yearly",
]);

async function resolveOrCreateCustomer(stripe: ReturnType<typeof createStripeClient>,
  o: { email?: string; userId?: string }): Promise<string> {
  if (o.userId && !/^[a-zA-Z0-9_-]+$/.test(o.userId)) throw new Error("Invalid userId");
  if (o.userId) {
    const found = await stripe.customers.search({ query: `metadata['userId']:'${o.userId}'`, limit: 1 });
    if (found.data.length) return found.data[0].id;
  }
  if (o.email) {
    const existing = await stripe.customers.list({ email: o.email, limit: 1 });
    if (existing.data.length) {
      const c = existing.data[0];
      if (o.userId && c.metadata?.userId !== o.userId)
        await stripe.customers.update(c.id, { metadata: { ...c.metadata, userId: o.userId } });
      return c.id;
    }
  }
  const created = await stripe.customers.create({
    ...(o.email && { email: o.email }), ...(o.userId && { metadata: { userId: o.userId } }),
  });
  return created.id;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const { priceId, returnUrl, environment } = await req.json();
    if (environment !== "sandbox" && environment !== "live") return json({ error: "Invalid environment" }, 400);
    if (typeof priceId !== "string" || !ALLOWED.has(priceId)) return json({ error: "Invalid priceId" }, 400);

    // Signed-in user is REQUIRED for course purchases (entitlement needs a user id).
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    const { data: { user } } = await admin.auth.getUser(token);
    if (!user) return json({ error: "Sign in required" }, 401);

    const stripe = createStripeClient(environment as StripeEnv);
    const prices = await stripe.prices.list({ lookup_keys: [priceId], expand: ["data.product"] });
    if (!prices.data.length) return json({ error: "Price not found" }, 404);
    const price = prices.data[0];
    const isRecurring = price.type === "recurring";
    const product = price.product as Stripe.Product;

    const customerId = await resolveOrCreateCustomer(stripe, { email: user.email ?? undefined, userId: user.id });

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: price.id, quantity: 1 }],
      mode: isRecurring ? "subscription" : "payment",
      ui_mode: "embedded_page",
      return_url: returnUrl,
      customer: customerId,
      managed_payments: { enabled: true },
      metadata: { userId: user.id, priceId, managed_payments: "true" },
      ...(!isRecurring && { payment_intent_data: { description: product.name, metadata: { userId: user.id, priceId } } }),
      ...(isRecurring && { subscription_data: { metadata: { userId: user.id, priceId } } }),
    } as Stripe.Checkout.SessionCreateParams);

    return json({ clientSecret: session.client_secret });
  } catch (e) {
    console.error("create-checkout", e);
    return json({ error: e instanceof Error ? e.message : "Checkout failed" }, 500);
  }
});
```

`supabase/config.toml` needs this for every payment function. The function still checks the JWT itself.

```toml
[functions.create-checkout]
verify_jwt = false
[functions.payments-webhook]
verify_jwt = false
```

Tax handling: `managed_payments: { enabled: true }` is the full-compliance path. It adds 3.5% per transaction, and statements read `LINK.COM*`. When it is on, do **not** also pass `automatic_tax`, `payment_method_types`, `allow_promotion_codes`-adjacent invoice/customer_update options, or `customer_email`. For calculation-only handling, use `automatic_tax: { enabled: true }` instead.

### 1e. Browser component `src/components/StripeEmbeddedCheckout.tsx`

`supabase.functions.invoke` attaches the signed-in user's access token automatically. That is how the user gets linked to the purchase.

```tsx
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";

export function StripeEmbeddedCheckout({ priceId, returnUrl }: { priceId: string; returnUrl: string }) {
  const fetchClientSecret = async (): Promise<string> => {
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: { priceId, returnUrl, environment: getStripeEnvironment() },
    });
    if (error || !data?.clientSecret) throw new Error(error?.message || "Failed to create checkout session");
    return data.clientSecret;
  };
  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
```

Usage, for example inside a shadcn `Dialog` opened by `EnrollButton`. Send signed-out users to `/signin` first.

```tsx
<StripeEmbeddedCheckout
  priceId="balanced_living_blueprint_onetime"
  returnUrl={`${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`}
/>
```

`{CHECKOUT_SESSION_ID}` is a literal Stripe placeholder; Stripe fills in the session ID. Render the element directly. Never return a component factory from a hook, or the provider throws "You cannot change the client secret after creation".

**Success:** `/checkout/success` reads `session_id`. The webhook may arrive a few seconds after the redirect, so poll `entitlements` (section 2) or invalidate `["entitlements", userId]` every 2s for about 20s. **Cancel:** closing the dialog unmounts the component. `/checkout/cancelled` is no longer reached by Stripe; keep it only as a link target. **Failure:** card errors appear inside the iframe and never redirect.

**Test-mode banner:** add `src/components/PaymentTestModeBanner.tsx` at the top of the layout. It shows a notice when the token starts with `pk_test_`, and a "go-live required" notice when the token is missing.

---

## 2. Recording a completed payment

**What Lovable provides:** two webhook *endpoints* registered in Stripe for test mode, with the same pair added for live at go-live:
- `https://<project>.supabase.co/functions/v1/payments-webhook?env=sandbox`. **This one is yours.** Lovable registers the URL, but the code is not provided; you must write `supabase/functions/payments-webhook/index.ts`. Until it exists, deliveries get a 404.
- `https://api.lovable.dev/projects/<id>/payments-webhook/sandbox`. This feeds the Payments tab analytics only and never reaches your code. Do not delete either one.

**Lovable provides no tables or views.** Purchases and access live in your own tables. The repo's migrations already define `products`, `purchases`, `entitlements` and `bundle_items` (not yet applied). Default events cover `checkout.session.completed`, `checkout.session.async_payment_succeeded/failed`, `customer.subscription.created/updated/deleted` and `invoice.paid`. Extra events such as `charge.refunded` are added by Lovable through its webhook-edit tool, not in the Stripe dashboard.

### Suggested mapping (adapts the existing `stripe-webhook` logic)

`supabase/functions/payments-webhook/index.ts`:

```ts
import { createClient } from "npm:@supabase/supabase-js@2";
import { type StripeEnv, verifyWebhook } from "../_shared/stripe.ts";

const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

// lookup key -> products.slug in your own table
const PRICE_TO_SLUG: Record<string, string> = {
  balanced_living_blueprint_onetime: "balanced-living-blueprint",
  justice_advocacy_onetime: "justice-advocacy",
  faith_based_transformation_onetime: "faith-based-transformation",
  llb_complete_onetime: "llb-complete",
  ebook_7_principles_onetime: "ebook-7-principles",
};

async function fulfill(session: any, env: StripeEnv) {
  const userId = session.metadata?.userId;
  const priceId = session.metadata?.priceId;
  if (!userId || !priceId || !PRICE_TO_SLUG[priceId]) return;
  const { data: product } = await admin.from("products").select("id").eq("slug", PRICE_TO_SLUG[priceId]).single();
  if (!product) throw new Error(`no product for ${priceId}`);

  const { data: purchase, error } = await admin.from("purchases").upsert({
    user_id: userId,
    email: session.customer_details?.email ?? null,
    product_id: product.id,
    stripe_session_id: session.id,
    stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null,
    status: "paid",
    amount_cents: session.amount_total,
    currency: session.currency ?? "usd",
    livemode: env === "live",
  }, { onConflict: "stripe_session_id" }).select("id").single();
  if (error) throw error;

  const { data: kids } = await admin.from("bundle_items").select("child_product_id").eq("bundle_product_id", product.id);
  const grants = kids?.length ? kids.map((k) => k.child_product_id) : [product.id];
  const { error: e2 } = await admin.from("entitlements").upsert(
    grants.map((pid) => ({ user_id: userId, product_id: pid, source_purchase: purchase.id })),
    { onConflict: "user_id,product_id", ignoreDuplicates: true });
  if (e2) throw e2;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const env = new URL(req.url).searchParams.get("env");
  if (env !== "sandbox" && env !== "live") return Response.json({ received: true, ignored: "invalid env" });
  try {
    const event = await verifyWebhook(req, env);
    const s = event.data.object;
    switch (event.type) {
      case "checkout.session.completed":
        if (s.mode === "payment" && s.payment_status !== "unpaid") await fulfill(s, env);
        break;
      case "checkout.session.async_payment_succeeded":
        await fulfill(s, env); break;
      case "checkout.session.async_payment_failed":
        await admin.from("purchases").update({ status: "failed" }).eq("stripe_session_id", s.id); break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        // upsert into public.subscriptions (schema below)
        break;
      default: console.log("Unhandled event:", event.type);
    }
    return Response.json({ received: true });
  } catch (e) {
    console.error("Webhook error:", e);
    return new Response("Webhook error", { status: 400 });
  }
});
```

### Membership table (Lovable's standard schema)

```sql
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  stripe_subscription_id text not null unique,
  stripe_customer_id text not null,
  product_id text not null,          -- Stripe prod_..., differs test vs live
  price_id text not null,            -- lookup key: llb_membership_monthly / _yearly
  status text not null default 'active',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  environment text not null default 'sandbox',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.subscriptions enable row level security;
create policy "Users can view own subscription" on public.subscriptions for select using (auth.uid() = user_id);
grant select on public.subscriptions to authenticated;
grant all on public.subscriptions to service_role;
```

In the handler: `price_id = item.price.lookup_key ?? item.price.metadata.lovable_external_id ?? item.price.id`. Period fields come from `item.current_period_start/end`, falling back to the subscription. Use `userId` from `subscription.metadata.userId`. Upsert `onConflict: "stripe_subscription_id"`. Key access off `price_id`, never `product_id`.

### "Has this user paid for product X?"

- Course or e-book: `select 1 from entitlements where user_id = auth.uid() and product_id = :id`. RLS scopes this to the owner. The existing `useHasEntitlement(productId)` hook already does this, and `get-media-url` re-checks it on the server.
- Membership: `status in ('active','trialing') and (current_period_end is null or current_period_end > now())`, filtered by `environment` (`'sandbox'` in preview, `'live'` in production).

---

## 3. Querying the catalog

The catalog has no table or REST endpoint inside the app. It is readable **only from an edge function** through `createStripeClient`. The browser cannot read it because the publishable key cannot list prices.

```ts
// supabase/functions/list-prices/index.ts  (verify_jwt = false; public data)
import { createStripeClient } from "../_shared/stripe.ts";
const { environment } = await req.json();          // 'sandbox' | 'live'
const stripe = createStripeClient(environment);
const prices = await stripe.prices.list({
  lookup_keys: ["balanced_living_blueprint_onetime", "justice_advocacy_onetime",
    "faith_based_transformation_onetime", "llb_complete_onetime",
    "ebook_7_principles_onetime", "llb_membership_monthly", "llb_membership_yearly"],
  active: true, expand: ["data.product"], limit: 100,
});
return prices.data.map((p) => ({
  priceId: p.lookup_key,                 // human-readable id
  stripePriceId: p.id,                   // env-specific, don't store
  productId: (p.product as any).metadata?.lovable_external_id,  // e.g. "llb_complete"
  productName: (p.product as any).name,
  amount: p.unit_amount,                 // cents: 20000, 55000, 1999, 3900, 39000
  currency: p.currency,
  interval: p.recurring?.interval ?? null,
}));
```

Recommendation: keep `src/content/catalog.ts` and the `products` table as the display source. Make sure their `price_cents` match Stripe: 20000 / 55000 / 1999. Checkout always charges the Stripe price, never a client-side amount.

---

## 4. Test mode to live mode

Steps in **Payments tab → Live**:
1. **Claim the Stripe account.** Create a Stripe login or link an existing one.
2. **Activate in Stripe:** business details, payout bank account, two-step login. When asked "what to copy", copy everything, including the Lovable app.
3. **Install the Lovable app on the live account**, if it wasn't copied in step 2.
4. **Automatic:** Lovable creates the live keys and live webhooks (`?env=live`), stores the live secrets, and writes `.env.production` with `VITE_PAYMENTS_CLIENT_TOKEN=pk_live_...`.
5. **Readiness check** (automatic).
6. **Publish.** Products and prices sync to live by ID on publish.

**Code changes: none,** as long as the code follows the patterns above. The environment comes from the token prefix, the server picks `STRIPE_LIVE_API_KEY` by environment, and lookup keys are identical in both environments. Repo-specific notes:
- Update the `PRICES_APPROVED` flag in `catalog.ts` to reflect the real prices. Remove the `sk_live_`/`PRICES_APPROVED` gate in `create-checkout`, because keys no longer start with `sk_live_`.
- `.env.production` is written by Lovable. A GitHub-only build without it has no token and should show the go-live notice.
- Preview always stays in test mode; only the published site charges real cards.

---

## 5. Product images

Lovable's product-creation tools accept no image, and products don't have one today. Two ways to add one:
- **Stripe dashboard (test mode):** Product catalog → product → Edit → Image. Lovable says name and description edits sync to live on publish. I haven't confirmed that images sync too, so check after go-live and re-upload in live if they're missing.
- **API, one-time from an edge function:** `await createStripeClient(env).products.update(prodId, { images: ["https://livinlifebalanced.com/images/courses/llb-complete.jpg"] })`. Up to 8 public HTTPS URLs. Run it once per environment.

The image appears in the Embedded Checkout summary. Your site's own course images in `public/images/courses/` are separate and stay the display source.

---

## Open decisions (yours)
- Apply the repo migrations (tables do not exist yet).
- Require sign-in before checkout (assumed above), or keep the guest-purchase-then-invite flow by passing no `customer` and resolving the user by email in the webhook.
- Keep full tax compliance (+3.5%) or switch to calculation only (+0.5%).
