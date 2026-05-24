import { createFileRoute, Link } from "@tanstack/react-router";
export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — Angels of Comfort" }, { name: "description", content: "Our story and mission — dignity and warmth in Maryland in-home care." }], links: [{ rel: "canonical", href: "/about" }] }),
  component: () => (
    <div className="bg-[var(--ivory)] pt-40 pb-32 min-h-screen">
      <div className="container-editorial text-center max-w-2xl mx-auto">
        <div className="eyebrow eyebrow-center justify-center">About Us</div>
        <h1 className="mt-6 font-serif text-5xl md:text-6xl text-[var(--navy-deep)]">Built on <span className="gold-italic">trust.</span></h1>
        <p className="editorial-body mt-6">Our story page is coming soon.</p>
        <Link to="/consultation" className="btn-primary mt-10 inline-flex">Talk With Our Care Team</Link>
      </div>
    </div>
  ),
});