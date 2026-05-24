import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MonogramAC } from "@/components/site/Botanical";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Angels of Comfort" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        // Auto-claim admin role if none exists yet
        await supabase.rpc("claim_admin_if_none");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await supabase.rpc("claim_admin_if_none");
      }
      navigate({ to: "/admin" });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16"
      style={{ background: "var(--cream)" }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <MonogramAC className="w-12 h-12 mx-auto text-[var(--gold)]" />
          <div className="text-[10px] tracking-[0.28em] uppercase text-[var(--gold-muted)] mt-6">
            Editorial Desk
          </div>
          <h1 className="font-serif text-4xl text-[var(--navy-deep)] mt-3">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h1>
        </div>
        <form onSubmit={submit} className="bg-white border border-[var(--gold)]/20 rounded-[4px] p-8 space-y-5">
          <div>
            <label className="text-[11px] tracking-[0.2em] uppercase text-[var(--gold-muted)]">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input mt-2 w-full"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="text-[11px] tracking-[0.2em] uppercase text-[var(--gold-muted)]">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input mt-2 w-full"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
            />
          </div>
          {error && (
            <div className="text-[13px] text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </div>
          )}
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode(mode === "signup" ? "signin" : "signup");
              setError(null);
            }}
            className="text-[13px] text-[var(--gold-muted)] hover:text-[var(--navy-deep)] w-full text-center"
          >
            {mode === "signup" ? "Already have an account? Sign in" : "First time? Create your admin account"}
          </button>
        </form>
        <div className="text-center mt-6">
          <Link to="/" className="text-[12px] tracking-[0.18em] uppercase text-[var(--gold-muted)] hover:text-[var(--navy-deep)]">
            ← Return to site
          </Link>
        </div>
      </div>
    </div>
  );
}