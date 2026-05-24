import { createFileRoute } from "@tanstack/react-router";
import { ConsultationPage } from "@/components/pages/ConsultationPage";

export const Route = createFileRoute("/consultation")({
  head: () => ({
    meta: [
      { title: "Schedule a Free Consultation — Angels of Comfort" },
      {
        name: "description",
        content:
          "Begin with a free, no-obligation conversation about in-home care for your loved one. A Maryland care advisor will respond within one business day.",
      },
      { property: "og:title", content: "Schedule a Free Consultation — Angels of Comfort" },
      {
        property: "og:description",
        content: "Tell us about your loved one. We'll listen, then guide you.",
      },
    ],
    links: [{ rel: "canonical", href: "/consultation" }],
  }),
  component: ConsultationPage,
});