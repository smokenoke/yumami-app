create table if not exists public.file_links (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  created_by_user_id uuid not null,
  label text not null,
  url text not null,
  description text,
  category text,
  archived_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists file_links_household_id_idx on public.file_links(household_id);
create index if not exists file_links_archived_at_idx on public.file_links(archived_at);
