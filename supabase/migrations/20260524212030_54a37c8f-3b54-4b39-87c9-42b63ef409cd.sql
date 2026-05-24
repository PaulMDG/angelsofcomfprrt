-- Roles
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Generic updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Services
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  tagline text,
  description text,
  includes text[] NOT NULL DEFAULT '{}',
  body_html text,
  cover_image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published services are public"
  ON public.services FOR SELECT
  TO anon, authenticated
  USING (published = true);

CREATE POLICY "Admins can view all services"
  ON public.services FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert services"
  ON public.services FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update services"
  ON public.services FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete services"
  ON public.services FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('cms-media', 'cms-media', true);

CREATE POLICY "CMS media is publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'cms-media');

CREATE POLICY "Admins can upload CMS media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'cms-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update CMS media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'cms-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete CMS media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'cms-media' AND public.has_role(auth.uid(), 'admin'));

-- Seed
INSERT INTO public.services (slug, name, tagline, description, includes, sort_order) VALUES
('dementia-memory-care', 'Dementia & Memory Care', 'Familiarity is medicine.',
 'For families navigating Alzheimer''s and other memory-related conditions, our caregivers bring patience, structure, and deep respect. We focus on what your loved one can still do — and we protect what they cherish.',
 ARRAY['Specialized memory training','Safe-at-home assessments','Sundowning support','Family education'], 10),
('companion-care', 'Companion Care', 'Loneliness is its own illness.',
 'Conversation. A shared meal. A drive to a favorite place. Companion care brings warmth and presence into the day — gently easing isolation and restoring small, ordinary joys.',
 ARRAY['Meaningful conversation','Hobbies & games','Light meal preparation','Outings & errands'], 20),
('personal-care', 'Personal Care', 'Dignity, in every small moment.',
 'Help with bathing, dressing, mobility, and grooming — delivered with the kind of quiet respect that makes a difficult moment easier. Independence is preserved wherever possible.',
 ARRAY['Bathing & grooming','Dressing assistance','Mobility support','Medication reminders'], 30),
('respite-care', 'Respite Care', 'You deserve to rest, too.',
 'Family caregivers carry a quiet weight. Respite care gives you back hours, days, or weeks — knowing your loved one is safe, supported, and genuinely cared for in your absence.',
 ARRAY['Hourly or overnight relief','Vacation coverage','Family-event support','Recurring respite plans'], 40),
('live-in-care', 'Live-In Care', 'Around-the-clock, at home.',
 'When your loved one needs continuous support, our live-in caregivers become a calm, consistent presence in the home — preserving routine, comfort, and connection.',
 ARRAY['24/7 in-home presence','Overnight monitoring','Daily routine management','Consistent caregiver team'], 50),
('hospital-discharge-support', 'Hospital Discharge Support', 'The first 30 days matter most.',
 'We bridge hospital to home with a coordinated plan — medication reminders, transportation, follow-up support, and gentle daily care during the most vulnerable stretch of recovery.',
 ARRAY['Discharge coordination','Medication management','Follow-up transportation','Recovery monitoring'], 60),
('recovery-post-surgical-care', 'Recovery & Post-Surgical Care', 'Healing happens at home.',
 'After surgery, illness, or injury, the body and the spirit both need rest. We provide attentive, focused care so your loved one can heal in the place that feels safest.',
 ARRAY['Mobility & wound watch','Nutrition support','Therapy reminders','Comfort & companionship'], 70);