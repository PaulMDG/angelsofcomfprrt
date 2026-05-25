-- Add nav assignment fields to services
ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS show_in_nav boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS nav_label text,
  ADD COLUMN IF NOT EXISTS nav_sort integer NOT NULL DEFAULT 0;

-- Navigation items table (Navigation Manager)
CREATE TABLE IF NOT EXISTS public.nav_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_key text NOT NULL DEFAULT 'header',
  parent_id uuid REFERENCES public.nav_items(id) ON DELETE CASCADE,
  label text NOT NULL,
  url text NOT NULL,
  link_type text NOT NULL DEFAULT 'internal',
  open_in_new_tab boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_nav_items_menu_key ON public.nav_items(menu_key);
CREATE INDEX IF NOT EXISTS idx_nav_items_parent ON public.nav_items(parent_id);

ALTER TABLE public.nav_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Nav items public read"
  ON public.nav_items FOR SELECT
  TO public
  USING (published = true);

CREATE POLICY "Admins view all nav items"
  ON public.nav_items FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage nav items"
  ON public.nav_items FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER set_nav_items_updated_at
  BEFORE UPDATE ON public.nav_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
