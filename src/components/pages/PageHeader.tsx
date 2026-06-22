import type { ReactNode } from "react";
import { Reveal } from "@/components/site/Reveal";

export function PageHeader({
  eyebrow,
  title,
  italic,
  intro,
  tone = "ivory",
}: {
  eyebrow: string;
  title: ReactNode;
  italic: string;
  intro?: string;
  tone?: "ivory" | "navy";
}) {
  const isDark = tone === "navy";
  return (
    <section
      className="pt-40 pb-24 relative overflow-hidden"
      style={{
        background: isDark ? "var(--navy-deep)" : "var(--ivory)",
        color: isDark ? "var(--ivory)" : "var(--navy-deep)",
      }}
    >
      <div className="container-editorial text-center max-w-3xl mx-auto">
        <Reveal>
          <div
            className="eyebrow eyebrow-center justify-center"
            style={{ color: isDark ? "var(--gold-light)" : "var(--gold)" }}
          >
            {eyebrow}
          </div>
          <h1
            className="mt-8 font-serif font-medium leading-[1.14] sm:leading-[1.06] tracking-[-0.015em] [text-wrap:balance]"
            style={{
              fontSize: "clamp(42px, 5.5vw, 80px)",
              color: isDark ? "var(--ivory)" : "var(--navy-deep)",
            }}
          >
            {title} <span className="gold-italic">{italic}</span>
          </h1>
          {intro ? (
            <p
              className="mt-8 text-[18px] leading-[1.8] font-light max-w-xl mx-auto"
              style={{ color: isDark ? "rgba(245,240,232,0.85)" : "var(--text-body)" }}
            >
              {intro}
            </p>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}