import { useEffect, useMemo, useState } from "react";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { callFunction } from "@/lib/supabase-app";
import { getStripe, paymentsEnvironment } from "@/lib/stripe";
import { BUNDLE, COURSES, EBOOK, formatPrice } from "@/content/catalog";
import { MAIN_SITE_BOOK } from "@/content/site";
import { useAuth } from "@/hooks/useAuth";

interface CheckoutDialogProps {
  productSlug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function productFor(slug: string) {
  if (slug === BUNDLE.productSlug) return { title: BUNDLE.title, priceCents: BUNDLE.priceCents };
  if (slug === EBOOK.productSlug) return { title: EBOOK.title, priceCents: EBOOK.priceCents };
  const course = COURSES.find((entry) => entry.productSlug === slug);
  return course ? { title: course.title, priceCents: course.priceCents } : { title: "Program", priceCents: 0 };
}

/**
 * Stripe Embedded Checkout in a dialog. The client secret comes from
 * create-checkout, which reprices from the products table and charges
 * Stripe's own price for the product's lookup key. Closing the dialog is the
 * cancel path; Stripe returns the buyer to /checkout/success after payment.
 */
export function CheckoutDialog({ productSlug, open, onOpenChange }: CheckoutDialogProps) {
  const product = productFor(productSlug);
  const environment = paymentsEnvironment();
  const { user } = useAuth();
  const [loadError, setLoadError] = useState<string | null>(null);

  // Stripe.js is loaded once per page. If it cannot load (offline, blocked),
  // say so instead of leaving an empty frame.
  const stripe = useMemo(() => getStripe().catch((error: Error) => {
    setLoadError(error.message);
    return null;
  }), []);
  useEffect(() => setLoadError(null), [productSlug]);

  // One options object per product per mount: the provider refuses a changed
  // client secret, and the dialog unmounts its content when it closes.
  const options = useMemo(
    () => ({
      fetchClientSecret: async () => {
        const { clientSecret } = await callFunction<{ clientSecret: string }>("create-checkout", {
          productSlug,
          returnPath: "/checkout/success",
          environment,
        });
        if (!clientSecret) throw new Error("No checkout session returned");
        return clientSecret;
      },
    }),
    [productSlug, environment],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border text-left">
          <DialogTitle className="font-serif text-xl">Enroll in {product.title}</DialogTitle>
          <DialogDescription>
            One-time payment of {formatPrice(product.priceCents)}. Lifetime access.
            <span className="block mt-2 text-foreground/80">
              {user?.email
                ? `Enrolling as ${user.email}. Your program unlocks in My Learning as soon as payment clears.`
                : "No account yet? None needed. We will create one with the email you enter at checkout and send you a link to set your password."}
            </span>
            {environment === "sandbox" && (
              <span className="block mt-1 text-xs uppercase tracking-widest text-primary">
                Test mode: no real card is charged
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[75vh] min-h-[12rem] overflow-y-auto bg-white p-2 sm:p-4" key={productSlug}>
          {loadError ? (
            <p className="p-4 text-sm text-muted-foreground leading-relaxed">
              The payment form could not be loaded. Please try again, or reach us through{" "}
              <a href={MAIN_SITE_BOOK} className="underline underline-offset-4 text-foreground">
                {MAIN_SITE_BOOK.replace("https://", "")}
              </a>
              .
            </p>
          ) : (
            <EmbeddedCheckoutProvider stripe={stripe} options={options}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
