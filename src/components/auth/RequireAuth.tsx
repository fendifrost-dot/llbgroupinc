import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/layout/Layout";

/**
 * Route gate for /learn. Redirects signed-out visitors to /signin, preserving
 * where they were headed so they land back there after signing in.
 *
 * This is navigation, not security — the data behind these routes is protected
 * by RLS and by the media edge function's server-side entitlement check.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading, backendReady } = useAuth();
  const location = useLocation();

  if (!backendReady) {
    return (
      <Layout>
        <section className="py-32">
          <div className="section-container max-w-xl">
            <h1 className="font-serif text-3xl font-medium text-foreground mb-4">
              Not Yet Available
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Student accounts are being prepared. Please check back shortly.
            </p>
          </div>
        </section>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <section className="py-32">
          <div className="section-container">
            <p className="text-sm text-muted-foreground">Loading…</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
