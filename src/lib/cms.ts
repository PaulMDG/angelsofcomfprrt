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