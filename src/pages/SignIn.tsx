import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

type Mode = "signin" | "signup" | "magic";

/**
 * Minimal chrome, matching the Book/Contact form styling (Handoff §4.4).
 */
const SignIn = () => {
  const { user, loading, backendReady, signInWithPassword, signUpWithPassword, signInWithMagicLink } =
    useAuth();
  const location = useLocation();
  const destination = (location.state as { from?: string } | null)?.from ?? "/learn";

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [magicSent, setMagicSent] = useState(false);

  if (!loading && user) return <Navigate to={destination} replace />;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "magic") {
        await signInWithMagicLink(email);
        setMagicSent(true);
      } else if (mode === "signup") {
        await signUpWithPassword(email, password, fullName || undefined);
        toast.success("Account created. Check your email to confirm the address.");
      } else {
        await signInWithPassword(email, password);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sign in failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout>
      <PageHeader
        overline="Student Access"
        title="Sign In"
        description="Access your enrolled programs. If you purchased a program, use the email address you checked out with."
      />

      <section className="py-20 lg:py-28">
        <div className="section-container">
          <div className="max-w-md">
            {!backendReady ? (
              <p className="text-muted-foreground leading-relaxed">
                Student accounts are being prepared. Please check back shortly.
              </p>
            ) : magicSent ? (
              <div className="p-8 bg-card border border-border rounded-sm">
                <h2 className="font-serif text-xl font-bold text-foreground mb-3">
                  Check Your Email
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We sent a sign-in link to {email}. The link opens your programs
                  directly — no password required.
                </p>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {mode === "signup" && (
                    <div>
                      <label htmlFor="full-name" className="block text-sm text-foreground mb-2">
                        Name
                      </label>
                      <Input
                        id="full-name"
                        autoComplete="name"
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        className="bg-card border-border"
                      />
                    </div>
                  )}

                  <div>
                    <label htmlFor="email" className="block text-sm text-foreground mb-2">
                      Email *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="bg-card border-border"
                    />
                  </div>

                  {mode !== "magic" && (
                    <div>
                      <label htmlFor="password" className="block text-sm text-foreground mb-2">
                        Password *
                      </label>
                      <Input
                        id="password"
                        type="password"
                        required
                        minLength={8}
                        autoComplete={mode === "signup" ? "new-password" : "current-password"}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="bg-card border-border"
                      />
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="hero"
                    disabled={submitting}
                    className="w-full sm:w-auto"
                  >
                    {submitting
                      ? "Please wait…"
                      : mode === "signup"
                        ? "Create Account"
                        : mode === "magic"
                          ? "Send Sign-In Link"
                          : "Sign In"}
                  </Button>
                </form>

                <div className="mt-8 pt-8 border-t border-border space-y-3">
                  {mode !== "magic" && (
                    <button
                      type="button"
                      onClick={() => setMode("magic")}
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Email me a sign-in link instead
                    </button>
                  )}
                  {mode !== "signin" && (
                    <button
                      type="button"
                      onClick={() => setMode("signin")}
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Sign in with a password
                    </button>
                  )}
                  {mode !== "signup" && (
                    <button
                      type="button"
                      onClick={() => setMode("signup")}
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Create an account
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SignIn;
