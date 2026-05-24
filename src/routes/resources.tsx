import { createFileRoute, Link } from "@tanstack/react-router";
export const Route = createFileRoute("/resources")({
  head: () => ({ meta: [{ title: "Journal — Angels of Comfort" }, { name: "description", content: "Thoughtful resources for families navigating care." }], links: [{ rel: "canonical", href: "/resources" }] }),
  component: () => (
    <div className="bg-[var(--ivory)] pt-40 pb-32 min-h-screen">
      <div className="container-editorial text-center max-w-2xl mx-auto">
        <div className="eyebrow eyebrow-center justify-center">Our Journal</div>
        <h1 className="mt-6 font-serif text-5xl md:text-6xl text-[var(--navy-deep)]">Thoughtful resources for <span className="gold-italic">difficult moments.</span></h1>
        <p className="editorial-body mt-6">Articles coming soon.</p>
        <Link to="/" className="link-gold mt-10 inline-flex">← Back home</Link>
      </div>
    </div>
  ),
});