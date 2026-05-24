
create table public.consultations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  relationship text,
  care_for text,
  care_types text[],
  timeline text,
  zip text,
  message text,
  created_at timestamptz not null default now()
);

alter table public.consultations enable row level security;

-- Anyone (anonymous website visitor) can submit a consultation request
create policy "Anyone can insert consultations"
  on public.consultations
  for insert
  to anon, authenticated
  with check (true);

-- No public reads — only service role (admin) can view submissions
