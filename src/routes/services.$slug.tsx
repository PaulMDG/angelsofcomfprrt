import { createFileRoute } from "@tanstack/react-router";
import { ServiceDetailPage } from "@/components/pages/ServiceDetailPage";
import { queryOptions } from "@tanstack/react-query";
import { fetchServiceBySlug } from "@/lib/cms-services";

const serviceQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["public", "service", slug],
    queryFn: () => fetchServiceBySlug(slug),
  });

const SITE = "https://angelsofcomfprrt.lovable.app";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params, context }) =>
    context.queryClient.ensureQueryData(serviceQueryOptions(params.slug)),
  head: ({ params, loaderData }) => {
    const s = loaderData as Awaited<ReturnType<typeof fetchServiceBySlug>> | undefined;
    const name = s?.name ?? params.slug.replace(/-/g, " ");
    const title = `${name} — Angels of Comfort`;
    const description =
      s?.description?.slice(0, 160) ??
      s?.tagline ??
      "Personalized in-home care designed around your family's rhythms and preferences.";
    const url = `${SITE}/services/${params.slug}`;
    const image = s?.cover_image_url ?? undefined;

    const meta: Array<Record<string, string>> = [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: url },
      { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ];
    if (image) {
      meta.push({ property: "og:image", content: image });
      meta.push({ name: "twitter:image", content: image });
    }

    const scripts = s
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              name: s.name,
              description: s.description ?? s.tagline ?? undefined,
              image: s.cover_image_url ?? undefined,
              url,
              provider: {
                "@type": "Organization",
                name: "Angels of Comfort",
                url: SITE,
              },
            }),
          },
        ]
      : undefined;

    return {
      meta,
      links: [{ rel: "canonical", href: url }],
      ...(scripts ? { scripts } : {}),
    };
  },
  component: ServiceSlugPage,
});

function ServiceSlugPage() {
  const { slug } = Route.useParams();
  return <ServiceDetailPage slug={slug} />;
}