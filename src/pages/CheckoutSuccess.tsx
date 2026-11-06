import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

/**
 * Stripe Embedded Checkout returns here with ?session_id=... Entitlements are
 * granted by payments-webhook, not here; this page only reports and refetches
 * the cached entitlement list so a signed-in buyer sees their new program
 * without a hard refresh.
 */
const CheckoutSuccess = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;
    // Stripe returns the buyer at roughly the same moment it delivers the
    // webhook that grants access, so refetch every two seconds for a while.
    const invalidate = () =>
      queryClient.invalidateQueries({ queryKey: ["entitlements", user.id] });
    invalidate();
    const interval = window.setInterval(invalidate, 2000);
    const stop = window.setTimeout(() => window.clearInterval(interval), 30000);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(stop);
    };
  }, [user, queryClient]);

  return (
    <Layout>
      <PageHeader
        overline="Enrollment Confirmed"
        title="Thank You"
        description="Your payment was received and your program is being unlocked."
      />

      <section className="py-20 lg:py-28">
        <div className="section-container">
          <div className="max-w-2xl">
            {user ? (
              <>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Your program is now available in your learning dashboard. If it
                  does not appear immediately, refresh the page in a moment — the
                  confirmation from our payment processor can take a few seconds.
                </p>
                <Button variant="hero" asChild>
                  <Link to="/learn">
                    Go to Your Programs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
                  Check Your Email
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We have created your account with the email address you used
                  at checkout and sent you an invitation. It arrives within a
                  few minutes with the subject line "You have been invited".
                  Open it and choose "Accept the invite": that brings you back
                  here to set your password, and then your program opens.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                  Already have an account with that address? Then there is no new
                  email; sign in and your program is waiting in My Learning. If
                  nothing arrives, check your spam folder, or reach us through
                  livinglifebalancedllb.com/book and we will help.
                </p>
                <Button variant="hero-outline" asChild>
                  <Link to="/signin">Sign In</Link>
                </Button>
              </>
            )}

            <p className="mt-12 pt-8 border-t border-border text-xs text-muted-foreground leading-relaxed">
              A receipt has been sent by our payment processor. For questions
              about your enrollment, reach us through livinglifebalancedllb.com/book.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CheckoutSuccess;
