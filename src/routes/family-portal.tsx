import { createFileRoute, Link } from "@tanstack/react-router";
export const Route = createFileRoute("/family-portal")({
  head: () => ({ meta: [{ title: "Family Portal — Angels of Comfort" }, { name: "description", content: "Stay connected to your loved one's care." }], links: [{ rel: "canonical", href: "/family-portal" }] }),
  component: () => (
    <div className="bg-[var(--navy-deep)] text-[var(--ivory)] pt-40 pb-32 min-h-screen">
      <div className="container-editorial text-center max-w-2xl mx-auto">
        <div className="eyebrow eyebrow-center justify-center">Family Portal</div>
        <h1 className="mt-6 font-serif text-5xl md:text-6xl text-[var(--ivory)]">Modern care with <span className="gold-italic">human warmth.</span></h1>
        <p className="mt-6 text-[var(--cream)] opacity-90 text-lg leading-relaxed">The full secure portal is coming soon.</p>
        <Link to="/consultation" className="btn-outline btn-outline-light mt-10 inline-flex">Request Access</Link>
      </div>
    </div>
  ),
});