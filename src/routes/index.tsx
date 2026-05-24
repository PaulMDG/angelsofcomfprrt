import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { Reassurance } from "@/components/home/Reassurance";
import { Services } from "@/components/home/Services";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Angels of Comfort — Compassionate In-Home Care in Maryland" },
      { name: "description", content: "Licensed Maryland in-home care for families. Dementia, companion, personal, respite, and live-in care delivered with dignity and warmth." },
      { property: "og:title", content: "Angels of Comfort — In-Home Care in Maryland" },
      { property: "og:description", content: "Compassionate in-home care for Maryland families. Care that feels like home." },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <Reassurance />
      <Services />
    </>
  );
}
