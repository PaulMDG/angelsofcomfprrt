import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];
export type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];
export type Faq = Database["public"]["Tables"]["faqs"]["Row"];
export type Subscriber = Database["public"]["Tables"]["subscribers"]["Row"];
export type Consultation = Database["public"]["Tables"]["consultations"]["Row"];
export type MediaAsset = Database["public"]["Tables"]["media_assets"]["Row"];
export type SeoSetting = Database["public"]["Tables"]["seo_settings"]["Row"];
export type ServiceArea = Database["public"]["Tables"]["service_areas"]["Row"];
export type StaffMember = Database["public"]["Tables"]["staff"]["Row"];
export type SiteSetting = Database["public"]["Tables"]["site_settings"]["Row"];
export type PageRow = Database["public"]["Tables"]["pages"]["Row"];

export function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

// ---------- Public fetchers ----------
export async function fetchPublishedBlog(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts").select("*").eq("published", true).order("published_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
export async function fetchBlogBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).eq("published", true).maybeSingle();
  if (error) throw error;
  return data;
}
export async function fetchPublishedTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase.from("testimonials").select("*").eq("published", true).order("sort_order");
  if (error) throw error;
  return data ?? [];
}
export async function fetchPublishedFaqs(): Promise<Faq[]> {
  const { data, error } = await supabase.from("faqs").select("*").eq("published", true).order("sort_order");
  if (error) throw error;
  return data ?? [];
}
export async function fetchPublishedAreas(): Promise<ServiceArea[]> {
  const { data, error } = await supabase.from("service_areas").select("*").eq("published", true).order("sort_order");
  if (error) throw error;
  return data ?? [];
}
export async function fetchPublishedStaff(): Promise<StaffMember[]> {
  const { data, error } = await supabase.from("staff").select("*").eq("published", true).order("sort_order");
  if (error) throw error;
  return data ?? [];
}
export async function fetchSiteSettings(): Promise<Record<string, any>> {
  const { data, error } = await supabase.from("site_settings").select("*");
  if (error) throw error;
  const map: Record<string, any> = {};
  (data ?? []).forEach((r) => (map[r.key] = r.value));
  return map;
}

// ---------- Admin fetchers (return all) ----------
export async function fetchAll<T extends keyof Database["public"]["Tables"]>(
  table: T,
  orderBy: { col: string; asc?: boolean } = { col: "created_at", asc: false }
): Promise<any[]> {
  const { data, error } = await supabase
    .from(table as any)
    .select("*")
    .order(orderBy.col, { ascending: orderBy.asc ?? false });
  if (error) throw error;
  return data ?? [];
}

// ---------- Storage helpers ----------
export async function uploadMedia(file: File, folder = "uploads"): Promise<{ path: string; url: string }> {
  const ext = file.name.split(".").pop() || "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("cms-media").upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from("cms-media").getPublicUrl(path);
  return { path, url: data.publicUrl };
}

/**
 * Responsive variant widths uploaded alongside each cropped image.
 * The largest URL is what we persist; ResponsiveImage derives the smaller
 * sibling URLs from the recognized path pattern `/responsive/{uuid}/w{N}.jpg`.
 */
export const RESPONSIVE_WIDTHS = [480, 768, 1200] as const;

export type ResponsiveUpload = {
  /** The largest variant URL — store this in content. */
  url: string;
  /** Storage path of the largest variant (for media_assets bookkeeping). */
  path: string;
  /** Every uploaded variant (sorted ascending). */
  variants: { width: number; url: string; path: string; bytes: number }[];
};

/**
 * Uploads a cropped image at multiple widths to a shared folder
 * `${folder}/responsive/${uuid}/w{width}.jpg` and returns the largest URL.
 */
export async function uploadResponsiveVariants(
  sourceCanvas: HTMLCanvasElement,
  folder = "uploads",
): Promise<ResponsiveUpload> {
  const id = crypto.randomUUID();
  const maxSourceW = sourceCanvas.width;
  // Always include at least the source width, capped by our widest preset.
  const targets = Array.from(
    new Set(
      RESPONSIVE_WIDTHS.filter((w) => w <= maxSourceW).concat(
        maxSourceW < RESPONSIVE_WIDTHS[0] ? [maxSourceW] : [],
      ),
    ),
  ).sort((a, b) => a - b);

  const variants: ResponsiveUpload["variants"] = [];
  for (const width of targets) {
    const canvas = resizeCanvas(sourceCanvas, width);
    const blob = await canvasToBlob(canvas, "image/jpeg", 0.86);
    const path = `${folder}/responsive/${id}/w${width}.jpg`;
    const { error } = await supabase.storage
      .from("cms-media")
      .upload(path, blob, { cacheControl: "31536000", upsert: false, contentType: "image/jpeg" });
    if (error) throw error;
    const { data } = supabase.storage.from("cms-media").getPublicUrl(path);
    variants.push({ width, url: data.publicUrl, path, bytes: blob.size });
  }

  const largest = variants[variants.length - 1];
  return { url: largest.url, path: largest.path, variants };
}

function resizeCanvas(src: HTMLCanvasElement, targetW: number): HTMLCanvasElement {
  if (targetW >= src.width) return src;
  const ratio = targetW / src.width;
  const out = document.createElement("canvas");
  out.width = targetW;
  out.height = Math.max(1, Math.round(src.height * ratio));
  const ctx = out.getContext("2d");
  if (!ctx) throw new Error("Canvas not available");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(src, 0, 0, out.width, out.height);
  return out;
}

function canvasToBlob(canvas: HTMLCanvasElement, mime = "image/jpeg", quality = 0.9): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Failed to encode image"))),
      mime,
      quality,
    );
  });
}