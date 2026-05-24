import { createFileRoute } from "@tanstack/react-router";
import { BotanicalSprig } from "@/components/site/Botanical";
export const Route = createFileRoute("/consultation")({
  head: () => ({ meta: [{ title: "Schedule a Consultation — Angels of Comfort" }, { name: "description", content: "Let's talk about care for your loved one." }], links: [{ rel: "canonical", href: "/consultation" }] }),
  component: () => (
    <div className="bg-[var(--ivory)] pt-40 pb-32 min-h-screen">
      <div className="container-editorial text-center max-w-2xl mx-auto">
        <div className="eyebrow eyebrow-center justify-center">Schedule a Conversation</div>
        <h1 className="mt-6 font-serif text-5xl md:text-6xl text-[var(--navy-deep)] leading-[1.05]">Let's talk about care for your <span className="gold-italic">loved one.</span></h1>
        <BotanicalSprig className="w-32 h-10 text-[var(--gold)] mx-auto mt-8" />
        <p className="editorial-body mt-6">The full consultation form is coming soon. For now, please call us.</p>
        <a href="tel:2404263304" className="btn-primary mt-10 inline-flex">Call (240) 426-3304</a>
      </div>
    </div>
  ),
});