import { Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { MonogramAC } from "@/components/site/Botanical";

type NavItem = { to: string; label: string; exact?: boolean };
const navItems: NavItem[] = [
  { to: "/admin", label: "Dashboard", exact: true },
  { to: "/admin/pages", label: "Pages" },
  { to: "/admin/services", label: "Services" },
  { to: "/admin/blog", label: "Blog" },
  { to: "/admin/testimonials", label: "Testimonials" },
  { to: "/admin/faqs", label: "FAQs" },
  { to: "/admin/consultations", label: "Consultations" },
  { to: "/admin/subscribers", label: "Subscribers" },
  { to: "/admin/media", label: "Media" },
  { to: "/admin/seo", label: "SEO" },
  { to: "/admin/service-areas", label: "Service Areas" },
  { to: "/admin/staff", label: "Staff" },
  { to: "/admin/settings", label: "Settings" },
];

export function AdminShell({ email }: { email: string | null }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--cream)" }}>
      <aside className="w-64 shrink-0 bg-[var(--navy-deep)] text-[var(--ivory)] flex flex-col">
        <Link to="/" className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
          <MonogramAC className="w-8 h-8 text-[var(--gold-light)]" />
          <div className="leading-tight">
            <div className="font-serif text-[16px]">Angels of Comfort</div>
            <div className="text-[9px] tracking-[0.28em] uppercase text-[var(--gold-light)]">
              CMS
            </div>
          </div>
        </Link>
        <nav className="flex-1 px-3 py-6 space-y-0.5 overflow-y-auto">
          {navItems.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`block px-4 py-2.5 rounded text-[13px] tracking-[0.08em] transition-colors ${
                  active
                    ? "bg-[var(--gold)]/20 text-[var(--gold-light)]"
                    : "text-[var(--ivory)]/80 hover:bg-white/5 hover:text-[var(--ivory)]"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-6 py-5 border-t border-white/10 text-[12px]">
          <div className="text-[var(--ivory)]/60 truncate">{email}</div>
          <button
            onClick={signOut}
            className="mt-2 text-[var(--gold-light)] hover:text-[var(--ivory)] text-[11px] tracking-[0.18em] uppercase"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}