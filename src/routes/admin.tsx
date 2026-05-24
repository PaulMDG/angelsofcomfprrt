import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "CMS — Angels of Comfort" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"checking" | "ready" | "denied">("checking");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const check = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
      if (!session) {
        if (active) navigate({ to: "/login" });
        return;
      }
      // Attempt claim (no-op if admins already exist)
      await supabase.rpc("claim_admin_if_none");
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin");
      if (!active) return;
      if (roles && roles.length > 0) {
        setEmail(session.user.email ?? null);
        setStatus("ready");
      } else {
        setStatus("denied");
      }
    };

    check();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate({ to: "/login" });
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  if (status === "checking") {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-[13px] tracking-[0.2em] uppercase"
        style={{ background: "var(--cream)", color: "var(--gold-muted)" }}
      >
        Loading the editorial desk…
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6 text-center"
        style={{ background: "var(--cream)" }}
      >
        <div className="max-w-md">
          <div className="text-[10px] tracking-[0.28em] uppercase text-[var(--gold-muted)]">
            Access restricted
          </div>
          <h1 className="font-serif text-3xl text-[var(--navy-deep)] mt-3">
            This area is for editors.
          </h1>
          <p className="mt-4 text-[14px] text-[var(--warm-gray)]">
            Your account doesn't have CMS access. If you should be an editor, ask the site
            administrator to grant you the admin role.
          </p>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/login" });
            }}
            className="btn-outline mt-8"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return <AdminShell email={email} />;
}