// Stripe through Lovable Payments.
//
// This project does not hold its own Stripe secret key. Lovable manages the
// Stripe account and exposes it through its connector gateway: every Stripe
// API call goes to connector-gateway.lovable.dev with a per-environment
// connection key plus the project's Lovable API key, all set by Lovable in the
// edge-function secret store (never in the repo):
//
//   STRIPE_SANDBOX_API_KEY           test-mode connection key
//   PAYMENTS_SANDBOX_WEBHOOK_SECRET  whsec_... for test-mode webhooks
//   STRIPE_LIVE_API_KEY              added by Lovable at go-live
//   PAYMENTS_LIVE_WEBHOOK_SECRET     added by Lovable at go-live
//   LOVABLE_API_KEY                  authenticates the gateway call
//
// The browser decides which environment it is in from the prefix of
// VITE_PAYMENTS_CLIENT_TOKEN (pk_test_ or pk_live_) and sends it along.

import { encode } from "https://deno.land/std@0.168.0/encoding/hex.ts";
import Stripe from "https://esm.sh/stripe@22.0.2";

export type StripeEnv = "sandbox" | "live";

const GATEWAY_STRIPE_BASE = "https://connector-gateway.lovable.dev/stripe";

const getEnv = (key: string): string => {
  const value = Deno.env.get(key);
  if (!value) throw new Error(`${key} is not configured`);
  return value;
};

export function isStripeEnv(value: unknown): value is StripeEnv {
  return value === "sandbox" || value === "live";
}

export function getConnectionApiKey(env: StripeEnv): string {
  return env === "sandbox" ? getEnv("STRIPE_SANDBOX_API_KEY") : getEnv("STRIPE_LIVE_API_KEY");
}

export function createStripeClient(env: StripeEnv): Stripe {
  const connectionApiKey = getConnectionApiKey(env);
  const lovableApiKey = getEnv("LOVABLE_API_KEY");

  return new Stripe(connectionApiKey, {
    apiVersion: "2026-03-25.dahlia",
    httpClient: Stripe.createFetchHttpClient((input, init) => {
      const stripeUrl = input instanceof Request ? input.url : input.toString();
      const gatewayUrl = stripeUrl.replace("https://api.stripe.com", GATEWAY_STRIPE_BASE);
      return fetch(gatewayUrl, {
        ...init,
        headers: {
          ...Object.fromEntries(
            new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined)).entries(),
          ),
          "X-Connection-Api-Key": connectionApiKey,
          "Lovable-API-Key": lovableApiKey,
        },
      });
    }),
  });
}

export interface WebhookEvent {
  id?: string;
  type: string;
  livemode?: boolean;
  // deno-lint-ignore no-explicit-any
  data: { object: any };
}

/**
 * Verify a Stripe webhook signature against the environment's signing secret
 * and return the parsed event. Throws on any mismatch, so callers answer 400.
 */
export async function verifyWebhook(req: Request, env: StripeEnv): Promise<WebhookEvent> {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();
  const secret = env === "sandbox"
    ? getEnv("PAYMENTS_SANDBOX_WEBHOOK_SECRET")
    : getEnv("PAYMENTS_LIVE_WEBHOOK_SECRET");
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

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signed = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${body}`));
  const expected = new TextDecoder().decode(encode(new Uint8Array(signed)));
  if (!v1Signatures.includes(expected)) throw new Error("Invalid webhook signature");
  return JSON.parse(body) as WebhookEvent;
}
