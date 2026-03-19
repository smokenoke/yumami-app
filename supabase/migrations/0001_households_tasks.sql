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
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists tasks_household_id_idx on public.tasks(household_id);
create index if not exists tasks_assigned_to_user_id_idx on public.tasks(assigned_to_user_id);
create index if not exists tasks_due_at_idx on public.tasks(due_at);
