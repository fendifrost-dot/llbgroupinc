import { useState } from "react";
import { toast } from "sonner";
import { isBackendConfigured } from "@/lib/supabase-app";
import { isCheckoutConfigured } from "@/lib/stripe";
import { PRICES_APPROVED } from "@/content/catalog";
import { MAIN_SITE_BOOK } from "@/content/site";

/**
 * Opens Stripe Embedded Checkout for a product (CheckoutDialog). The client
 * names a product slug and nothing else: create-checkout reprices from the
 * products table, so this cannot be tampered into a discount.
 */
export function useCheckout() {
  const [checkoutSlug, setCheckoutSlug] = useState<string | null>(null);

  function startCheckout(productSlug: string) {
    if (!isBackendConfigured || !PRICES_APPROVED) {
      toast.error("Enrollment is not open yet. Please check back shortly.");
      return;
    }
    if (!isCheckoutConfigured) {
      // A build without VITE_PAYMENTS_CLIENT_TOKEN: the published site before
      // Stripe go-live in Lovable.
      toast.error(
        `Checkout is not available on this site yet. Please reach us through ${MAIN_SITE_BOOK.replace("https://", "")}.`,
      );
      return;
    }
    setCheckoutSlug(productSlug);
  }

  return {
    startCheckout,
    checkoutSlug,
    closeCheckout: () => setCheckoutSlug(null),
    isPending: (slug: string) => checkoutSlug === slug,
  };
}
