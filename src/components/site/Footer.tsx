import { Link } from "@tanstack/react-router";
import { MonogramAC, BotanicalSprig } from "./Botanical";

const services: [string, string][] = [
  ["Dementia Care", "/services/dementia-care"],
  ["Companion Care", "/services/companion-care"],
  ["Personal Care", "/services/personal-care"],
  ["Respite Care", "/services/respite-care"],
  ["Live-In Care", "/services/live-in-care"],
];
const resources: [string, string][] = [
  ["Caregiver Burnout", "/resources"],
  ["Signs Your Parent Needs Help", "/resources"],
  ["Dementia Support", "/resources"],
  ["Recovery at Home", "/resources"],
  ["VA Benefits & Aid", "/resources"],
];
const areas: [string, string][] = [
  ["Baltimore County", "/service-areas"],
  ["Towson", "/service-areas"],
  ["Columbia", "/service-areas"],
  ["Pikesville", "/service-areas"],
  ["Ellicott City", "/service-areas"],
];

export function Footer() {
  return (
    <footer style={{ background: "var(--navy-deep)" }} className="text-[var(--ivory)]">
      <div className="container-editorial py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-4">
              <MonogramAC className="w-14 h-14 text-[var(--gold-light)]" />
              <div>
                <div className="font-serif text-2xl">Angels of Comfort</div>
                <div className="text-[10px] tracking-[0.28em] uppercase text-[var(--gold-light)]">
                  Home Care
                </div>
              </div>
            </div>
            <div className="divider-gold" />
            <p className="font-serif italic text-lg text-[var(--gold-light)]">
              Compassionate care. Trusted by families.
            </p>
            <p className="text-sm leading-relaxed text-[var(--cream)] opacity-80 max-w-xs">
              We provide personalized non-medical home care that helps your loved ones live safely
              and comfortably at home. You're not alone. We're here for you.
            </p>
          </div>

          <FooterColumn title="Services" links={services} />
          <FooterColumn title="Resources" links={resources} />
          <FooterColumn title="Service Areas" links={areas} />

          <div className="lg:col-span-2 space-y-4">
            <FooterHeading>Contact</FooterHeading>
            <ul className="space-y-3 text-sm text-[var(--cream)] opacity-90">
              <li>(240) 426-3304</li>
              <li>hello@angelsofcomfort.com</li>
              <li>Mon–Fri: 8am – 6pm</li>
              <li className="opacity-80">
                10400 Little Patuxent Pkwy<br />Suite 300, Columbia, MD 21044
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center gap-4">
          <BotanicalSprig className="w-32 h-10 text-[var(--gold)] opacity-60" />
          <p className="font-serif italic text-lg text-[var(--gold-light)]">
            Thoughtful care begins with understanding.
          </p>
        </div>
      </div>

      <div style={{ background: "#080F1B" }} className="border-t border-[var(--gold)]/15">
        <div className="container-editorial py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--cream)] opacity-70">
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
            <Link to="/about">About Us</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-of-use">Terms of Use</Link>
            <Link to="/accessibility">Accessibility</Link>
            <Link to="/sitemap">Sitemap</Link>
          </div>
          <div>© 2026 Angels of Comfort Home Care. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] tracking-[0.22em] uppercase text-[var(--gold-light)] mb-2">
        {children}
      </div>
      <div className="divider-gold" />
    </div>
  );
}

function FooterColumn({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div className="lg:col-span-2 space-y-4">
      <FooterHeading>{title}</FooterHeading>
      <ul className="space-y-2.5 text-sm text-[var(--cream)] opacity-90">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link to={href} className="hover:text-[var(--gold-light)] transition-colors">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}