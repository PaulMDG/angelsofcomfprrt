import { useState } from "react";
import { Reveal, Eyebrow } from "@/components/site/Reveal";
import { BotanicalSprig } from "@/components/site/Botanical";
import { Link } from "@tanstack/react-router";
import { PageHeader } from "./PageHeader";
import featured from "@/assets/resources-featured.jpg";
import journal from "@/assets/testimonials-journal.jpg";
import faqImg from "@/assets/faq-books.jpg";
import { useQuery } from "@tanstack/react-query";
import { fetchPublishedBlog } from "@/lib/cms";
import { supabase } from "@/integrations/supabase/client";

const fallbackImages = [featured, journal, faqImg];

export function ResourcesPage() {
  const { data: posts = [] } = useQuery({
    queryKey: ["public", "blog"],
    queryFn: fetchPublishedBlog,
  });
  const articles = posts.slice(0, 3).map((p, i) => ({
    img: p.cover_image_url || fallbackImages[i % fallbackImages.length],
    cat: p.tags?.[0] || "Journal",
    title: p.title,
    excerpt: p.excerpt || "",
    read: p.read_minutes ? `${p.read_minutes} min read` : "",
  }));
  const more = posts.slice(3).map((p) => [p.tags?.[0] || "Journal", p.title] as const);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    const { error } = await supabase.from("subscribers").insert({ email, source: "resources" });
    setStatus(error ? "error" : "ok");
    if (!error) setEmail("");
  }

  if (!articles.length) {
    return (
      <PageHeader
        eyebrow="Our Journal"
        title="Thoughtful resources for"
        italic="difficult moments."
        intro="Written by our caregivers and clinical leads, for the families navigating questions that don't have easy answers."
      />
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Our Journal"
        title="Thoughtful resources for"
        italic="difficult moments."
        intro="Written by our caregivers and clinical leads, for the families navigating questions that don't have easy answers."
      />

      <section className="bg-[var(--cream)]">
        <div className="container-editorial section-pad">
          <Reveal>
            <Eyebrow>Featured Reading</Eyebrow>
          </Reveal>
          <Reveal delay={0.1}>
            <article className="mt-10 grid lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 overflow-hidden rounded-[6px]">
                <img
                  src={articles[0].img}
                  alt={articles[0].title}
                  loading="lazy"
                  className="w-full h-[520px] object-cover"
                />
              </div>
              <div className="lg:col-span-5">
                <div className="text-[11px] tracking-[0.22em] uppercase text-[var(--gold)]">
                  {articles[0].cat} · {articles[0].read}
                </div>
                <h2
                  className="mt-5 font-serif font-medium text-[var(--navy-deep)] leading-[1.1]"
                  style={{ fontSize: "clamp(30px, 3vw, 44px)" }}
                >
                  {articles[0].title}
                </h2>
                <BotanicalSprig className="w-20 h-6 text-[var(--gold)] mt-5" />
                <p className="editorial-body mt-5 max-w-md">{articles[0].excerpt}</p>
                <Link to="/resources" className="link-gold mt-8 inline-flex">
                  Read the essay →
                </Link>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      <section className="bg-[var(--ivory)]">
        <div className="container-editorial section-pad">
          <Reveal className="max-w-2xl">
            <Eyebrow>From the Journal</Eyebrow>
            <h2
              className="mt-6 font-serif font-medium text-[var(--navy-deep)] leading-[1.14] sm:leading-[1.06] tracking-[-0.015em] [text-wrap:balance]"
              style={{ fontSize: "clamp(32px, 3.5vw, 48px)" }}
            >
              Honest writing, gently <span className="gold-italic">offered.</span>
            </h2>
          </Reveal>

          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {articles.map((a, i) => (
              <Reveal key={a.title} delay={i * 0.08}>
                <article className="group cursor-pointer">
                  <div className="overflow-hidden rounded-[6px]">
                    <img
                      src={a.img}
                      alt={a.title}
                      loading="lazy"
                      className="w-full h-[280px] object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="mt-5 text-[11px] tracking-[0.22em] uppercase text-[var(--gold)]">
                    {a.cat} · {a.read}
                  </div>
                  <h3 className="mt-3 font-serif text-[24px] text-[var(--navy-deep)] leading-[1.2] group-hover:text-[var(--gold-muted)] transition-colors">
                    {a.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-[1.7] text-[var(--warm-gray)]">
                    {a.excerpt}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-24 pt-16 border-t border-[var(--gold)]/30">
              <Eyebrow>More Topics</Eyebrow>
              <ul className="mt-8 grid md:grid-cols-2 divide-y divide-[var(--gold)]/20 md:divide-y-0">
                {more.map(([cat, title]) => (
                  <li key={title} className="py-5 md:py-6 md:px-6 md:border-b md:border-[var(--gold)]/20 hover:bg-[var(--champagne)]/40 transition-colors -mx-6 px-6">
                    <div className="text-[10px] tracking-[0.22em] uppercase text-[var(--gold)]">
                      {cat}
                    </div>
                    <p className="mt-2 font-serif text-[20px] text-[var(--navy-deep)] leading-[1.3]">
                      {title}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[var(--navy-deep)] text-[var(--ivory)]">
        <div className="container-editorial section-pad text-center max-w-xl mx-auto">
          <Reveal>
            <Eyebrow className="justify-center">Stay in Touch</Eyebrow>
            <h2
              className="mt-6 font-serif font-medium leading-[1.14] sm:leading-[1.06] tracking-[-0.015em] [text-wrap:balance]"
              style={{ fontSize: "clamp(30px, 3.5vw, 44px)" }}
            >
              A monthly letter, written with <span className="gold-italic">care.</span>
            </h2>
            <p className="mt-6 text-[var(--cream)]/80 font-light leading-[1.8]">
              One thoughtful piece per month. No marketing, no noise. Unsubscribe whenever you like.
            </p>
            <form onSubmit={subscribe} className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-transparent border border-[var(--gold-light)]/40 px-5 py-3 text-[var(--ivory)] placeholder:text-[var(--cream)]/40 focus:outline-none focus:border-[var(--gold-light)] rounded-[2px]"
              />
              <button type="submit" disabled={status === "loading"} className="btn-outline btn-outline-light">
                {status === "loading" ? "…" : "Subscribe"}
              </button>
            </form>
            {status === "ok" && (
              <p className="mt-4 text-[13px] text-[var(--gold-light)]">Thank you — we'll be in touch.</p>
            )}
            {status === "error" && (
              <p className="mt-4 text-[13px] text-[var(--cream)]/70">Something went wrong. Please try again.</p>
            )}
          </Reveal>
        </div>
      </section>
    </>
  );
}