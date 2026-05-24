import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/components/pages/AboutPage";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Angels of Comfort — Our Story & Promise" },
      {
        name: "description",
        content:
          "A Maryland family business built on dignity, warmth, trust, and devotion. Meet the team behind Angels of Comfort in-home care.",
      },
      { property: "og:title", content: "About Angels of Comfort" },
      {
        property: "og:description",
        content: "Built on trust. Devoted to families.",
      },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});