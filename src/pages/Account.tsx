import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Download } from "lucide-react";
import { toast } from "sonner";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { requireSupabase } from "@/lib/supabase-app";
import { clearAuthLanding, getAuthLanding } from "@/lib/authLanding";
import { requestMediaUrl, useEntitlements } from "@/hooks/useEntitlements";
import { useCourses, useProducts } from "@/hooks/useCatalog";
import { formatPrice } from "@/content/catalog";

/**
 * Two faces of one page.
 *
 * A buyer who arrives from the invite email (or a password-reset email) has
 * an account but no password yet. They see one job: set a password, then go
 * to their programs. Everyone else sees the regular account page: change
 * password, enrollments (each a link into the player), sign out.
 *
 * "No password yet" is known two ways: the auth link's type recorded at
 * landing (src/lib/authLanding.ts), and the `password_set` flag written into
 * the user's metadata when a password is saved here. An invited user without
 * that flag is treated as still setting up, whichever tab they open.
 */
const Account = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: entitlements } = useEntitlements();
  const { data: products } = useProducts();
  const { data: courses } = useCourses();

  const landing = getAuthLanding();
  const invitedWithoutPassword = Boolean(user?.invited_at) && !user?.user_metadata?.password_set;
  const settingUp = landing === "invite" || landing === "recovery" || invitedWithoutPassword;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const owned = (entitlements ?? [])
    .map((row) => products?.find((product) => product.id === row.product_id))
    .filter(Boolean)
    .map((product) => ({
      product: product!,
      course: courses?.find((course) => course.product_id === product!.id),
    }));

  async function savePassword(event: React.FormEvent) {
    event.preventDefault();
    if (password !== confirm) {
      toast.error("The two passwords do not match.");
      return;
    }
    setSaving(true);
    try {
      const { error } = await requireSupabase().auth.updateUser({
        password,
        data: { password_set: true },
      });
      if (error) throw error;
      clearAuthLanding();
      setPassword("");
      setConfirm("");
      setSaved(true);
      if (settingUp) {
        toast.success("Your password is set. Welcome.");
        navigate("/learn", { replace: true });
      } else {
        toast.success("Password updated.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update password.");
    } finally {
      setSaving(false);
    }
  }

  async function downloadEbook() {
    try {
      const url = await requestMediaUrl({ kind: "ebook" });
      if (!url) {
        toast.info("The e-book is being prepared. It will appear here shortly.");
        return;
      }
      window.open(url, "_blank", "noopener");
    } catch {
      toast.error("We could not open that download. Please try again.");
    }
  }

  const passwordFields = (
    <>
      <div>
        <label htmlFor="new-password" className="block text-sm text-foreground mb-2">
          {settingUp ? "Choose a password *" : "New password *"}
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
        <p className="mt-2 text-xs text-muted-foreground">At least 8 characters.</p>
      </div>
      <div>
        <label htmlFor="confirm-password" className="block text-sm text-foreground mb-2">
          Confirm password *
        </label>
        <Input
          id="confirm-password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          className="bg-card border-border"
        />
      </div>
    </>
  );

  if (settingUp) {
    return (
      <Layout>
        <PageHeader
          overline={landing === "recovery" ? "Reset Password" : "Welcome"}
          title={landing === "recovery" ? "Choose a New Password" : "Finish Creating Your Account"}
          description={
            landing === "recovery"
              ? `Set a new password for ${user?.email ?? "your account"} to sign in again.`
              : `Your account for ${user?.email ?? "this address"} is ready. Set a password to finish, then open your programs.`
          }
        />
        <section className="py-20 lg:py-28">
          <div className="section-container">
            <form onSubmit={savePassword} className="space-y-6 max-w-sm">
              {passwordFields}
              <Button type="submit" variant="hero" disabled={saving} className="w-full sm:w-auto">
                {saving ? "Saving…" : "Set Password and Continue"}
                {!saving && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>
            <p className="mt-8 text-sm text-muted-foreground leading-relaxed max-w-sm">
              You will use this email address and password to sign in from now on.
            </p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader overline="Account" title="Your Account" description={user?.email ?? undefined} />

      <section className="py-20 lg:py-28">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
                Change Password
              </h2>
              {saved ? (
                <div className="p-6 bg-card border border-border rounded-sm max-w-sm">
                  <p className="text-foreground mb-2">Your password has been updated.</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    Use it the next time you sign in.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="hero" asChild>
                      <Link to="/learn">
                        Go to My Learning
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="hero-outline" onClick={() => setSaved(false)}>
                      Change it again
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={savePassword} className="space-y-6 max-w-sm">
                  {passwordFields}
                  <Button type="submit" variant="hero" disabled={saving}>
                    {saving ? "Saving…" : "Update Password"}
                  </Button>
                </form>
              )}

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
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
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
                  {owned.map(({ product, course }) => {
                    const body = (
                      <>
                        <div>
                          <p className="text-foreground">{product.title}</p>
                          {product.subtitle && (
                            <p className="text-sm text-muted-foreground mt-1">{product.subtitle}</p>
                          )}
                        </div>
                        <span className="inline-flex items-center gap-3 shrink-0 text-xs text-muted-foreground">
                          {formatPrice(product.price_cents)}
                          {product.type === "download" ? (
                            <Download className="h-4 w-4 text-primary" aria-hidden="true" />
                          ) : (
                            <ArrowRight className="h-4 w-4 text-primary transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                          )}
                        </span>
                      </>
                    );
                    const className =
                      "group w-full p-6 bg-card border border-border rounded-sm flex items-center justify-between gap-4 text-left transition-colors hover:border-foreground/25 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

                    return (
                      <li key={product.id}>
                        {product.type === "download" ? (
                          <button type="button" onClick={downloadEbook} className={className} aria-label={`Download ${product.title}`}>
                            {body}
                          </button>
                        ) : (
                          <Link
                            to={course ? `/learn/${course.slug}` : "/learn"}
                            className={className}
                            aria-label={`Open ${product.title}`}
                          >
                            {body}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
              <p className="mt-6 text-xs text-muted-foreground">
                Open a program from here, or from{" "}
                <Link to="/learn" className="text-primary link-underline">
                  My Learning
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Account;
