create table if not exists public.household_calendars (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  created_by_user_id uuid not null,
  label text not null,
  provider text not null check (provider in ('icloud', 'google', 'outlook', 'other')),
  url text,
  color_token text,
  archived_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists household_calendars_household_id_idx
  on public.household_calendars(household_id);

create index if not exists household_calendars_archived_at_idx
  on public.household_calendars(archived_at);

create table if not exists public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  household_calendar_id uuid references public.household_calendars(id) on delete set null,
  created_by_user_id uuid not null,
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  notes text,
  source_kind text not null default 'manual' check (source_kind in ('manual', 'linked')),
  archived_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists calendar_events_household_id_idx
  on public.calendar_events(household_id);

create index if not exists calendar_events_calendar_id_idx
  on public.calendar_events(household_calendar_id);

create index if not exists calendar_events_starts_at_idx
  on public.calendar_events(starts_at);

create index if not exists calendar_events_archived_at_idx
  on public.calendar_events(archived_at);
