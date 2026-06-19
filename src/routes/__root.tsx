import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import { useRouterState } from "@tanstack/react-router";
import { BotanicalSprig, MonogramAC } from "@/components/site/Botanical";
import { supabase } from "@/integrations/supabase/client";
import { InlineEditProvider } from "@/components/site/InlineEdit";

const FALLBACK_OG_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/G4nk8Ki590hArMdSGQqxXa6F5LF2/social-images/social-1779632121975-logo.webp";

async function fetchLogoForHead(): Promise<{ url: string; alt: string; wordmark: string }> {
  try {
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "logo")
      .maybeSingle();
    const v = (data?.value as { url?: string; alt?: string; wordmark?: string } | null) ?? null;
    return {
      url: v?.url || FALLBACK_OG_IMAGE,
      alt: v?.alt || v?.wordmark || "Angels of Comfort",
      wordmark: v?.wordmark || "Angels of Comfort",
    };
  } catch {
    return { url: FALLBACK_OG_IMAGE, alt: "Angels of Comfort", wordmark: "Angels of Comfort" };
  }
}

function NotFoundComponent() {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: "var(--navy-deep)", color: "var(--ivory)" }}
    >
      <div className="max-w-lg text-center">
        <MonogramAC className="w-12 h-12 mx-auto text-[var(--gold-light)] opacity-60" />
        <h1
          className="mt-8 font-serif font-medium"
          style={{ fontSize: "clamp(48px, 6vw, 96px)", color: "var(--ivory)" }}
        >
          404
        </h1>
        <div className="divider-gold mx-auto mt-6" />
        <h2 className="mt-6 font-serif text-2xl" style={{ color: "var(--ivory)" }}>
          This page has moved on
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed opacity-80 max-w-sm mx-auto">
          Like the seasons, things change. The page you're looking for isn't here anymore, but our care for your family never wavers.
        </p>
        <div className="mt-10">
          <Link to="/" className="btn-outline btn-outline-light">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: "var(--cream)", color: "var(--navy-deep)" }}
    >
      <div className="max-w-lg text-center">
        <BotanicalSprig className="w-16 h-6 mx-auto text-[var(--gold)]" />
        <h1 className="mt-8 font-serif text-3xl" style={{ color: "var(--navy-deep)" }}>
          Something went wrong
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed opacity-80 max-w-sm mx-auto">
          We're sorry — this page didn't load properly. Please try again, or return home and we'll make sure everything is ready for you.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-primary"
          >
            Try Again
          </button>
          <a href="/" className="btn-outline">
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["public", "site_settings", "logo"],
      queryFn: fetchLogoForHead,
    }),
  head: ({ loaderData }) => {
    const logo = (loaderData as { url: string; alt: string; wordmark: string } | undefined) ?? {
      url: FALLBACK_OG_IMAGE,
      alt: "Angels of Comfort",
      wordmark: "Angels of Comfort",
    };
    return ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Angels of Comfort" },
      { name: "description", content: "Angels of Comfort offers premium in-home care services with a focus on dignity, trust, and compassion." },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Angels of Comfort" },
      { property: "og:description", content: "Angels of Comfort offers premium in-home care services with a focus on dignity, trust, and compassion." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: logo.wordmark },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Angels of Comfort" },
      { name: "twitter:description", content: "Angels of Comfort offers premium in-home care services with a focus on dignity, trust, and compassion." },
      { property: "og:image", content: logo.url },
      { property: "og:image:alt", content: logo.alt },
      { name: "twitter:image", content: logo.url },
      { name: "twitter:image:alt", content: logo.alt },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
    });
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const overHero = pathname === "/";
  const isChrome = !(pathname.startsWith("/admin") || pathname === "/login");

  return (
    <QueryClientProvider client={queryClient}>
      {isChrome ? (
        <InlineEditProvider>
          <Navigation overHero={overHero} />
          <main className="min-h-screen">
            <Outlet />
          </main>
          <Footer />
        </InlineEditProvider>
      ) : (
        <main className="min-h-screen">
          <Outlet />
        </main>
      )}
    </QueryClientProvider>
  );
}
