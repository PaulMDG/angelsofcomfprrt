
-- Tighten public read on site_settings to known safe keys only
DROP POLICY IF EXISTS "Settings public read" ON public.site_settings;
CREATE POLICY "Settings public read"
ON public.site_settings
FOR SELECT
TO anon, authenticated
USING (key IN ('contact', 'social', 'logo', 'Logo'));

-- Add RLS policy on realtime.messages restricting subscriptions.
-- Only the public 'services' table is published to realtime; allow
-- authenticated users to subscribe, deny anonymous.
DROP POLICY IF EXISTS "Authenticated can receive realtime messages" ON realtime.messages;
CREATE POLICY "Authenticated can receive realtime messages"
ON realtime.messages
FOR SELECT
TO authenticated
USING (true);
