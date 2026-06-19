import { Reveal, Eyebrow } from "@/components/site/Reveal";
import { Link } from "@tanstack/react-router";
import featured from "@/assets/resources-featured.jpg";
import { useQuery } from "@tanstack/react-query";
import { fetchPublishedBlog } from "@/lib/cms";
import { useHomeSection } from "@/lib/homepage-content";

export function Resources() {
  const s = useHomeSection("resources");
  const { data: posts = [] } = useQuery({
    queryKey: ["public", "blog"],
    queryFn: fetchPublishedBlog,
  });
  const featuredPost = posts[0];
  const sidePosts = posts.slice(1, 4);
  return (
    <section className="bg-[var(--ivory)]">
      <div className="container-editorial section-pad">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-16">
          <Reveal>
            <Eyebrow>{s.eyebrow}</Eyebrow>
            <h2 className="mt-6 font-serif font-medium leading-[1.14] sm:leading-[1.06] tracking-[-0.015em] [text-wrap:balance] text-[var(--navy-deep)]"
              style={{ fontSize: "clamp(36px, 4vw, 56px)" }}>
              {s.heading} <span className="gold-italic">{s.italic_word}</span>
            </h2>
          </Reveal>
          <Reveal>
            <Link to="/resources" className="link-gold">{s.link_label}</Link>
          </Reveal>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          <Reveal className="lg:col-span-7">
            <Link to="/resources" className="group block">
              <div className="overflow-hidden rounded-[6px]">
                <img src={featuredPost?.cover_image_url || featured} alt={featuredPost?.title || "Editorial still life with notebook and tea"}
                  className="w-full h-[480px] object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
              </div>
              <div className="mt-6">
                <span className="text-[11px] tracking-[0.2em] uppercase text-[var(--gold)] font-medium">
                  Featured{featuredPost?.tags?.[0] ? ` · ${featuredPost.tags[0]}` : ""}
                </span>
                <h3 className="mt-3 font-serif text-[var(--navy-deep)] group-hover:text-[var(--gold-muted)] transition-colors"
                  style={{ fontSize: "clamp(28px, 3vw, 40px)" }}>
                  {featuredPost?.title ?? "The quiet strength of asking for help."}
                </h3>
                <p className="mt-3 editorial-body max-w-xl">
                  {featuredPost?.excerpt ?? "A reflection for family caregivers — and a reminder that needing support is not a weakness, but an act of love."}
                </p>
              </div>
            </Link>
          </Reveal>
          <div className="lg:col-span-5 space-y-8">
            {sidePosts.map((a, i) => (
              <Reveal key={a.id} delay={i * 0.08}>
                <Link to="/resources" className="group block border-b border-[var(--gold)]/25 pb-8">
                  <span className="text-[11px] tracking-[0.2em] uppercase text-[var(--gold)] font-medium">
                    {a.tags?.[0] ?? "Journal"}
                  </span>
                  <h4 className="mt-3 font-serif text-2xl text-[var(--navy-deep)] group-hover:text-[var(--gold-muted)] transition-colors">
                    {a.title}
                  </h4>
                  {a.read_minutes && (
                    <span className="mt-3 inline-block text-[12px] text-[var(--warm-gray)] tracking-wide">{a.read_minutes} min read</span>
                  )}
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}