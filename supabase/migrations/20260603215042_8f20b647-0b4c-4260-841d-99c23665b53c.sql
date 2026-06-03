DROP POLICY IF EXISTS "Authenticated users can receive broadcasts" ON realtime.messages;
DROP POLICY IF EXISTS "Allow authenticated to read messages" ON realtime.messages;
DROP POLICY IF EXISTS "Authenticated can read realtime messages" ON realtime.messages;

CREATE POLICY "Restrict realtime topics to known channels"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  (realtime.topic() = 'nav-services')
  OR (realtime.topic() LIKE 'pages-home-%')
);