import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import heroAsset from "@/assets/comfort-link.jpeg.asset.json";

const indexRoute = getRouteApi("/");


export type CtaLink = { label: string; url: string };

export type HomeContent = {
  hero: {
    eyebrow: string;
    headline_line1: string;
    headline_line2: string;
    headline_italic: string;
    body: string;
    image_url: string;
    primary_cta: CtaLink;
    secondary_cta: CtaLink;
    trust_items: { label: string; icon: string }[];
  };
  reassurance: {
    eyebrow: string;
    heading: string;
    italic_word: string;
    body: string;
    image_url: string;
    primary_cta: CtaLink;
    secondary_cta: CtaLink;
    banner_line1: string;
    banner_line2: string;
  };
  promise: {
    eyebrow: string;
    heading: string;
    italic_word: string;
    body: string;
    image_url: string;
    values: { n: string; t: string; d: string }[];
  };
  portal: {
    eyebrow: string;
    heading: string;
    italic_word: string;
    body: string;
    features: string[];
    image_url: string;
    cta: CtaLink;
  };
  resources: {
    eyebrow: string;
    heading: string;
    italic_word: string;
    link_label: string;
  };
  cta: {
    eyebrow: string;
    heading: string;
    italic_word: string;
    body: string;
    primary_cta: CtaLink;
    secondary_cta: CtaLink;
    footnote: string;
    background_image_url: string;
  };
};

export const HOME_DEFAULTS: HomeContent = {
  hero: {
    eyebrow: "Maryland Licensed In-Home Care",
    headline_line1: "Care that",
    headline_line2: "feels like",
    headline_italic: "home.",
    body:
      "Compassionate in-home care for Maryland families. Support your loved one with dignity, understanding, and a familiar face — every day.",
    image_url: heroAsset.url,
    primary_cta: { label: "Schedule Consultation", url: "/consultation" },
    secondary_cta: { label: "Explore Care Services", url: "/services" },
    trust_items: [
      { label: "Maryland RSA Licensed", icon: "shield" },
      { label: "BACKGROUND-CHECKED CAREGIVERS", icon: "people" },
      { label: "Personalized Care Plans", icon: "heart" },
      { label: "Serving Maryland Families", icon: "pin" },
    ],
  },
  reassurance: {
    eyebrow: "You Don't Have To",
    heading: "Carry this",
    italic_word: "alone.",
    body:
      "Caregiving is an act of love — but it can also be exhausting. We see you. We're here to bring relief, clarity, and compassionate support to your family.",
    image_url: "",
    primary_cta: { label: "Schedule a Consultation", url: "/consultation" },
    secondary_cta: { label: "Explore Our Services", url: "/services" },
    banner_line1: "You've done so much for your loved one.",
    banner_line2: "Now let us help.",
  },
  promise: {
    eyebrow: "Our Promise",
    heading: "Built on values that",
    italic_word: "last.",
    body:
      "Angels of Comfort was founded on a simple belief: that everyone deserves to age with grace, surrounded by people who truly see them. These values guide every visit, every conversation, every act of care.",
    image_url: "",
    values: [
      { n: "01", t: "Dignity", d: "We honor every person's story, choices, and pace — care is given on their terms." },
      { n: "02", t: "Warmth", d: "A familiar face, a steady presence, a home that feels lived-in and loved." },
      { n: "03", t: "Trust", d: "Licensed, background-checked caregivers and transparent communication with families." },
      { n: "04", t: "Devotion", d: "We treat your loved one as we would our own — with patience, attention, and heart." },
    ],
  },
  portal: {
    eyebrow: "Family Portal",
    heading: "Stay close,",
    italic_word: "always.",
    body:
      "For families across the country, our secure family portal brings peace of mind home. See how your loved one is doing, in real time — from anywhere.",
    features: [
      "Real-time visit notes from caregivers",
      "Daily wellbeing & mood check-ins",
      "Medication reminders & confirmations",
      "Secure messaging with the care team",
      "Photo updates from meaningful moments",
    ],
    image_url: "",
    cta: { label: "Explore the Portal", url: "/family-portal" },
  },
  resources: {
    eyebrow: "From Our Journal",
    heading: "Guidance for the",
    italic_word: "journey.",
    link_label: "Visit the Journal →",
  },
  cta: {
    eyebrow: "Begin When You're Ready",
    heading: "Let's bring comfort",
    italic_word: "home.",
    body:
      "Schedule a free, no-obligation consultation. We'll listen to your family's story and help you understand what care could look like — at your pace, on your terms.",
    primary_cta: { label: "Schedule a Consultation", url: "/consultation" },
    secondary_cta: { label: "Call (240) 426-3304", url: "tel:2404263304" },
    footnote: "Available 24 / 7 · Maryland RSA Licensed",
    background_image_url: "",
  },
};

function deepMerge<T>(base: T, override: any): T {
  if (override == null || typeof override !== "object" || Array.isArray(override)) {
    return (override ?? base) as T;
  }
  const out: any = Array.isArray(base) ? [...(base as any)] : { ...(base as any) };
  for (const k of Object.keys(override)) {
    const bv = (base as any)?.[k];
    const ov = override[k];
    if (ov && typeof ov === "object" && !Array.isArray(ov) && bv && typeof bv === "object" && !Array.isArray(bv)) {
      out[k] = deepMerge(bv, ov);
    } else if (ov !== undefined) {
      out[k] = ov;
    }
  }
  return out as T;
}

export async function fetchHomeSections(): Promise<Record<string, any>> {
  const { data } = await supabase
    .from("pages")
    .select("sections")
    .eq("page_key", "home")
    .maybeSingle();
  return (data?.sections as Record<string, any>) ?? {};
}

export function useHomepageContent(): HomeContent {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["public", "pages", "home"],
    queryFn: fetchHomeSections,
    staleTime: 30_000,
  });

  useEffect(() => {
    const ch = supabase
      .channel(`pages-home-${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pages", filter: "page_key=eq.home" },
        () => qc.invalidateQueries({ queryKey: ["public", "pages", "home"] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);

  return deepMerge(HOME_DEFAULTS, data ?? {});
}

export function useHomeSection<K extends keyof HomeContent>(key: K): HomeContent[K] {
  return useHomepageContent()[key];
}