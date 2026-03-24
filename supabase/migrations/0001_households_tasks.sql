create extension if not exists pgcrypto;

create table if not exists public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.household_members (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid not null,
  role text not null default 'member' check (role in ('owner', 'member')),
  display_name text,
  created_at timestamptz not null default timezone('utc', now()),
  unique (household_id, user_id)
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  created_by_user_id uuid not null,
  assigned_to_user_id uuid,
  title text not null,
  notes text,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
  due_at timestamptz,
  completed_at timestamptz,
  archived_at timestamptz,
  archived_reason text check (archived_reason in ('completed', 'dismissed', 'cancelled', 'duplicate', 'other')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

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

create table if not exists public.statement_imports (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  created_by_user_id uuid not null,
  institution_label text not null,
  statement_month date not null,
  source_file_name text not null,
  mime_type text,
  parser_status text not null default 'queued' check (parser_status in ('queued', 'parsed', 'manual_review', 'failed')),
  transaction_count integer not null default 0,
  review_needed_count integer not null default 0,
  notes text,
  archived_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists tasks_household_id_idx on public.tasks(household_id);
create index if not exists tasks_assigned_to_user_id_idx on public.tasks(assigned_to_user_id);
create index if not exists tasks_due_at_idx on public.tasks(due_at);
create index if not exists tasks_completed_at_idx on public.tasks(completed_at);
create index if not exists tasks_archived_at_idx on public.tasks(archived_at);
create index if not exists tasks_archived_reason_idx on public.tasks(archived_reason);
create index if not exists file_links_household_id_idx on public.file_links(household_id);
create index if not exists file_links_archived_at_idx on public.file_links(archived_at);
create index if not exists statement_imports_household_id_idx on public.statement_imports(household_id);
create index if not exists statement_imports_archived_at_idx on public.statement_imports(archived_at);
create index if not exists statement_imports_statement_month_idx on public.statement_imports(statement_month);
