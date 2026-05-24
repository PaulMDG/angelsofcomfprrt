import { createFileRoute } from "@tanstack/react-router";
import { FamilyPortalPage } from "@/components/pages/FamilyPortalPage";

export const Route = createFileRoute("/family-portal")({
  head: () => ({
    meta: [
      { title: "Family Portal — Stay Close to Your Loved One | Angels of Comfort" },
      {
        name: "description",
        content:
          "Real-time visit notes, wellbeing check-ins, photos, and secure messaging. Our family portal brings peace of mind to families across the country.",
      },
      { property: "og:title", content: "Family Portal — Angels of Comfort" },
      {
        property: "og:description",
        content: "Modern care with human warmth — accessible from anywhere.",
      },
    ],
    links: [{ rel: "canonical", href: "/family-portal" }],
  }),
  component: FamilyPortalPage,
});