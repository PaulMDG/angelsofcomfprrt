import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader, AdminCard } from "@/components/admin/AdminHeader";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

async function fetchCounts() {
  const tables = [
    "services","blog_posts","testimonials","faqs","consultations","subscribers","service_areas","staff","media_assets","pages","seo_settings"
  ] as const;
  const results: Record<string, number> = {};
  await Promise.all(tables.map(async (t) => {
    const { count } = await supabase.from(t).select("*", { count: "exact", head: true });
    results[t] = count ?? 0;
  }));
  return results;
}

const tiles: { key: string; label: string; to: string }[] = [
  { key: "services", label: "Services", to: "/admin/services" },
  { key: "blog_posts", label: "Blog posts", to: "/admin/blog" },
  { key: "testimonials", label: "Testimonials", to: "/admin/testimonials" },
  { key: "faqs", label: "FAQs", to: "/admin/faqs" },
  { key: "consultations", label: "Consultations", to: "/admin/consultations" },
  { key: "subscribers", label: "Subscribers", to: "/admin/subscribers" },
  { key: "service_areas", label: "Service areas", to: "/admin/service-areas" },
  { key: "staff", label: "Staff", to: "/admin/staff" },
  { key: "media_assets", label: "Media", to: "/admin/media" },
  { key: "pages", label: "Pages", to: "/admin/pages" },
  { key: "seo_settings", label: "SEO entries", to: "/admin/seo" },
];

function Dashboard() {
  const { data, isLoading } = useQuery({ queryKey: ["admin","counts"], queryFn: fetchCounts });
  return (
    <div className="px-10 py-12 max-w-6xl">
      <AdminHeader eyebrow="Editorial Desk" title="Dashboard" subtitle="A quiet overview of everything you steward across the site." />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tiles.map((t) => (
          <Link key={t.key} to={t.to as any} className="group">
            <AdminCard className="px-5 py-6 hover:border-[var(--gold)] transition-colors">
              <div className="text-[10px] tracking-[0.22em] uppercase text-[var(--gold-muted)]">{t.label}</div>
              <div className="font-serif text-4xl text-[var(--navy-deep)] mt-2">
                {isLoading ? "—" : (data?.[t.key] ?? 0)}
              </div>
              <div className="mt-3 text-[11px] tracking-[0.16em] uppercase text-[var(--gold-muted)] group-hover:text-[var(--navy-deep)]">
                Manage →
              </div>
            </AdminCard>
          </Link>
        ))}
      </div>
    </div>
  );
}