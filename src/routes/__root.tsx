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
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Angels of Comfort" },
      { name: "description", content: "Angels of Comfort offers premium in-home care services with a focus on dignity, trust, and compassion." },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Angels of Comfort" },
      { property: "og:description", content: "Angels of Comfort offers premium in-home care services with a focus on dignity, trust, and compassion." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Angels of Comfort" },
      { name: "twitter:description", content: "Angels of Comfort offers premium in-home care services with a focus on dignity, trust, and compassion." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/G4nk8Ki590hArMdSGQqxXa6F5LF2/social-images/social-1779632121975-logo.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/G4nk8Ki590hArMdSGQqxXa6F5LF2/social-images/social-1779632121975-logo.webp" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
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
      {isChrome && <Navigation overHero={overHero} />}
      <main className="min-h-screen">
        <Outlet />
      </main>
      {isChrome && <Footer />}
    </QueryClientProvider>
  );
}
