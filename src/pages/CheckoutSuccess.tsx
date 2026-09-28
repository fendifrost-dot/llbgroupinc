import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

/**
 * Handoff §4.3. Entitlements are granted by the webhook, not here — this page
 * only reports and invalidates the cached entitlement list so a signed-in
 * buyer sees their new program without a hard refresh.
 */
const CheckoutSuccess = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;
    // Stripe redirects the buyer back at roughly the same moment it delivers
    // the webhook, so refetch once immediately and once after a short delay.
    const invalidate = () =>
      queryClient.invalidateQueries({ queryKey: ["entitlements", user.id] });
    invalidate();
    const timer = window.setTimeout(invalidate, 4000);
    return () => window.clearTimeout(timer);
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
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                  Check Your Email
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We have created an account for the address you used at
                  checkout, and sent you a link to set your password. Follow it
                  to open your program.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                  If the email does not arrive within a few minutes, check your
                  spam folder, or write to info@llbgroup.com and we will help.
                </p>
                <Button variant="hero-outline" asChild>
                  <Link to="/signin">Sign In</Link>
                </Button>
              </>
            )}

            <p className="mt-12 pt-8 border-t border-border text-xs text-muted-foreground leading-relaxed">
              A receipt has been sent by our payment processor. For questions
              about your enrollment, contact info@llbgroup.com.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CheckoutSuccess;
