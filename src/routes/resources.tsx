import { createFileRoute } from "@tanstack/react-router";
import { ResourcesPage } from "@/components/pages/ResourcesPage";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Journal — Thoughtful Care Resources | Angels of Comfort" },
      {
        name: "description",
        content:
          "Honest, gentle guidance for families navigating dementia, caregiver burnout, hospital transitions, and the conversations that come with caring for someone you love.",
      },
      { property: "og:title", content: "Journal — Angels of Comfort" },
      {
        property: "og:description",
        content: "Resources, written with care, for the families we serve.",
      },
    ],
    links: [{ rel: "canonical", href: "/resources" }],
  }),
  component: ResourcesPage,
});