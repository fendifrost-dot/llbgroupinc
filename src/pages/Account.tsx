import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { requireSupabase } from "@/integrations/supabase/client";
import { useEntitlements } from "@/hooks/useEntitlements";
import { useProducts } from "@/hooks/useCatalog";
import { formatPrice } from "@/content/catalog";

const Account = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: entitlements } = useEntitlements();
  const { data: products } = useProducts();

  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const owned = (entitlements ?? [])
    .map((row) => products?.find((product) => product.id === row.product_id))
    .filter(Boolean);

  async function updatePassword(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      const { error } = await requireSupabase().auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated.");
      setPassword("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update password.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout>
      <PageHeader overline="Account" title="Your Account" description={user?.email ?? undefined} />

      <section className="py-20 lg:py-28">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                Set a Password
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                If you enrolled through checkout, set a password here so you can
                sign in directly next time.
              </p>
              <form onSubmit={updatePassword} className="space-y-6 max-w-sm">
                <div>
                  <label htmlFor="new-password" className="block text-sm text-foreground mb-2">
                    New Password *
                  </label>
                  <Input
                    id="new-password"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="bg-card border-border"
                  />
                </div>
                <Button type="submit" variant="hero" disabled={saving}>
                  {saving ? "Saving…" : "Update Password"}
                </Button>
              </form>

              <div className="mt-12 pt-8 border-t border-border">
                <Button
                  variant="minimal"
                  onClick={async () => {
                    await signOut();
                    navigate("/");
                  }}
                >
                  Sign out
                </Button>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                Your Enrollments
              </h2>
              {owned.length === 0 ? (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  No enrollments yet.{" "}
                  <Link to="/courses" className="text-primary link-underline">
                    Browse programs
                  </Link>
                  .
                </p>
              ) : (
                <ul className="space-y-3">
                  {owned.map((product) => (
                    <li
                      key={product!.id}
                      className="p-6 bg-card border border-border rounded-sm flex items-center justify-between gap-4"
                    >
                      <div>
                        <p className="text-foreground">{product!.title}</p>
                        {product!.subtitle && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {product!.subtitle}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {formatPrice(product!.price_cents)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Account;
