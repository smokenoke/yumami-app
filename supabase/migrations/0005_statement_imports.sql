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

create index if not exists statement_imports_household_id_idx on public.statement_imports(household_id);
create index if not exists statement_imports_archived_at_idx on public.statement_imports(archived_at);
create index if not exists statement_imports_statement_month_idx on public.statement_imports(statement_month);
