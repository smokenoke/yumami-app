create table if not exists public.finance_categories (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  created_by_user_id uuid not null,
  name text not null,
  kind text not null check (kind in ('income', 'expense')),
  archived_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists finance_categories_household_name_active_idx
  on public.finance_categories(household_id, lower(name))
  where archived_at is null;

create index if not exists finance_categories_household_id_idx
  on public.finance_categories(household_id);

create index if not exists finance_categories_archived_at_idx
  on public.finance_categories(archived_at);

create table if not exists public.statement_transactions (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  statement_import_id uuid not null references public.statement_imports(id) on delete cascade,
  finance_category_id uuid references public.finance_categories(id) on delete set null,
  transaction_date date not null,
  booking_date date,
  counterparty text,
  description text not null,
  amount numeric(12, 2) not null,
  currency text not null default 'EUR',
  direction text not null check (direction in ('debit', 'credit')),
  review_status text not null default 'pending' check (review_status in ('pending', 'categorized', 'needs_review')),
  confidence_score numeric(5, 2),
  source_row_key text,
  notes text,
  archived_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists statement_transactions_household_id_idx
  on public.statement_transactions(household_id);

create index if not exists statement_transactions_import_id_idx
  on public.statement_transactions(statement_import_id);

create index if not exists statement_transactions_category_id_idx
  on public.statement_transactions(finance_category_id);

create index if not exists statement_transactions_review_status_idx
  on public.statement_transactions(review_status);

create index if not exists statement_transactions_archived_at_idx
  on public.statement_transactions(archived_at);
