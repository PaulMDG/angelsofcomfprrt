import { createFileRoute, Link } from "@tanstack/react-router";
export const Route = createFileRoute("/services")({
  head: () => ({ meta: [{ title: "Care Services — Angels of Comfort" }, { name: "description", content: "Personalized in-home care services across Maryland." }], links: [{ rel: "canonical", href: "/services" }] }),
  component: () => (
    <div className="bg-[var(--ivory)] pt-40 pb-32 min-h-screen">
      <div className="container-editorial text-center max-w-2xl mx-auto">
        <div className="eyebrow eyebrow-center justify-center">Our Care Services</div>
        <h1 className="mt-6 font-serif text-5xl md:text-6xl text-[var(--navy-deep)]">Care for every stage of the <span className="gold-italic">journey.</span></h1>
        <p className="editorial-body mt-6">Detailed service pages are coming soon.</p>
        <Link to="/consultation" className="btn-primary mt-10 inline-flex">Schedule a Consultation</Link>
      </div>
    </div>
  ),
});