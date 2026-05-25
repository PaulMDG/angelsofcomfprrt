import { supabase } from "@/integrations/supabase/client";

export type NavItem = {
  id: string;
  menu_key: string;
  parent_id: string | null;
  label: string;
  url: string;
  link_type: string;
  open_in_new_tab: boolean;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export async function fetchNavItems(menu_key: string): Promise<NavItem[]> {
  const { data, error } = await supabase
    .from("nav_items")
    .select("*")
    .eq("menu_key", menu_key)
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as NavItem[];
}

export async function fetchAllNavItems(menu_key?: string): Promise<NavItem[]> {
  let q = supabase.from("nav_items").select("*").order("sort_order", { ascending: true });
  if (menu_key) q = q.eq("menu_key", menu_key);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as NavItem[];
}