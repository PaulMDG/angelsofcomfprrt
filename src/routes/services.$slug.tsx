import { createFileRoute } from "@tanstack/react-router";
import { ServiceDetailPage } from "@/components/pages/ServiceDetailPage";

export const Route = createFileRoute("/services/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — Angels of Comfort` },
      {
        name: "description",
        content: "Personalized in-home care designed around your family's rhythms and preferences.",
      },
    ],
    links: [{ rel: "canonical", href: `/services/${params.slug}` }],
  }),
  component: ServiceSlugPage,
});

function ServiceSlugPage() {
  const { slug } = Route.useParams();
  return <ServiceDetailPage slug={slug} />;
}