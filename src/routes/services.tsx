import { createFileRoute } from "@tanstack/react-router";
import { ServicesPage } from "@/components/pages/ServicesPage";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Care Services — Angels of Comfort" },
      {
        name: "description",
        content:
          "Dementia, companion, personal, respite, live-in, hospital-discharge, and recovery care across Maryland — delivered with dignity and warmth.",
      },
      { property: "og:title", content: "Care Services — Angels of Comfort" },
      {
        property: "og:description",
        content: "Personalized in-home care for every stage of the journey.",
      },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});