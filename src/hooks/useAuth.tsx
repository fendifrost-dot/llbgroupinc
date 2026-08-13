import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { isBackendConfigured, supabase } from "@/integrations/supabase/client";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  /** True until the initial session restore settles — gate redirects on this. */
  loading: boolean;
  backendReady: boolean;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signUpWithPassword: (email: string, password: string, fullName?: string) => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(isBackendConfigured);

  useEffect(() => {
    if (!supabase) return;

    // Subscribe before the initial getSession call so a token refresh landing
    // mid-restore is not missed.
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const client = () => {
      if (!supabase) throw new Error("Accounts are not available yet.");
      return supabase;
    };

    return {
      session,
      user: session?.user ?? null,
      loading,
      backendReady: isBackendConfigured,
      async signInWithPassword(email, password) {
        const { error } = await client().auth.signInWithPassword({ email, password });
        if (error) throw error;
      },
      async signUpWithPassword(email, password, fullName) {
        const { error } = await client().auth.signUp({
          email,
          password,
          options: {
            data: fullName ? { full_name: fullName } : undefined,
            emailRedirectTo: `${window.location.origin}/account`,
          },
        });
        if (error) throw error;
      },
      async signInWithMagicLink(email) {
        const { error } = await client().auth.signInWithOtp({
          email,
          options: { emailRedirectTo: `${window.location.origin}/learn` },
        });
        if (error) throw error;
      },
      async signOut() {
        await client().auth.signOut();
      },
    };
  }, [session, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside an AuthProvider");
  return context;
}
