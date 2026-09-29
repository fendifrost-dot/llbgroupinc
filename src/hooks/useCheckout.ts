import { useState } from "react";
import { toast } from "sonner";
import { callFunction, isBackendConfigured } from "@/integrations/supabase/client";
import { PRICES_APPROVED } from "@/content/catalog";

/**
 * Starts a Stripe Checkout session and hands the browser to Stripe.
 *
 * The client sends a product slug and nothing else — no price, no price id.
 * create-checkout reprices from the products table, so this call cannot be
 * tampered into a discount.
 */
export function useCheckout() {
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);

  async function startCheckout(productSlug: string) {
    // Unapproved prices never reach checkout. create-checkout enforces the
    // same rule server-side for live Stripe keys.
    if (!isBackendConfigured || !PRICES_APPROVED) {
      toast.error("Enrollment is not open yet. Please check back shortly.");
      return;
    }

    setPendingSlug(productSlug);
    try {
      const { url } = await callFunction<{ url: string }>("create-checkout", {
        productSlug,
        successUrl: "/checkout/success",
        cancelUrl: "/checkout/cancelled",
      });
      if (!url) throw new Error("No checkout URL returned");
      window.location.href = url;
    } catch (error) {
      console.error("checkout failed", error);
      toast.error(
        "We could not open checkout. Please try again, or reach us through livinglifebalancedllb.com/book.",
      );
      setPendingSlug(null);
    }
  }

  return { startCheckout, pendingSlug, isPending: (slug: string) => pendingSlug === slug };
}
