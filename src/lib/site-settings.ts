import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type LogoValue = {
  url?: string | null;
  alt?: string | null;
  wordmark?: string | null;
  tagline?: string | null;
};

export async function fetchSetting<T = any>(key: string): Promise<T | null> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (error) throw error;
  return (data?.value as T) ?? null;
}

export function useLogo() {
  return useQuery({
    queryKey: ["public", "site_settings", "logo"],
    queryFn: () => fetchSetting<LogoValue>("logo"),
    staleTime: 60_000,
  });
}