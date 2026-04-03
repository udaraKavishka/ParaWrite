create table if not exists public.extraction_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null references auth.users(id) on delete set null,
  file_name text not null,
  file_type text not null,
  method text not null,
  retry_mode text not null,
  error_reason text not null default '',
  text_length integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.extraction_jobs enable row level security;

create policy "Users can read own extraction jobs"
  on public.extraction_jobs
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own extraction jobs"
  on public.extraction_jobs
  for insert
  with check (auth.uid() = user_id);

create policy "Anon insert extraction jobs"
  on public.extraction_jobs
  for insert
  to anon
  with check (user_id is null);

create policy "Service role can write extraction jobs"
  on public.extraction_jobs
  for insert
  with check (true);
