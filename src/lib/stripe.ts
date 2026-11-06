/**
 * Browser side of Lovable Payments.
 *
 * VITE_PAYMENTS_CLIENT_TOKEN is Stripe's publishable key for this project.
 * Lovable writes the test key (pk_test_) into .env.development and the live
 * key (pk_live_) into .env.production at go-live, so the preview always
 * charges test cards and only the published site, after go-live, charges real
 * ones. The prefix also tells create-checkout which environment to use.
 */
// The "pure" entry does not inject Stripe.js at import time, so the script
// is only loaded when checkout actually opens.
import { loadStripe } from "@stripe/stripe-js/pure";
import type { Stripe } from "@stripe/stripe-js";

export type StripeEnv = "sandbox" | "live";

const clientToken: string | undefined = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN;

export function paymentsEnvironment(): StripeEnv | null {
  if (clientToken?.startsWith("pk_test_")) return "sandbox";
  if (clientToken?.startsWith("pk_live_")) return "live";
  return null;
}

/** False on a build without a token, e.g. the published site before go-live. */
export const isCheckoutConfigured = paymentsEnvironment() !== null;

let stripePromise: Promise<Stripe | null> | null = null;

export function getStripe(): Promise<Stripe | null> {
  if (!clientToken || !paymentsEnvironment()) {
    return Promise.reject(
      new Error("Payments are not configured for this build. Complete Stripe go-live in Lovable."),
    );
  }
  if (!stripePromise) stripePromise = loadStripe(clientToken);
  return stripePromise;
}
