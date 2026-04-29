alter table if exists public.statement_transactions
  add column if not exists suggested_category_name text,
  add column if not exists suggested_category_kind text check (suggested_category_kind in ('income', 'expense'));

create table if not exists public.merchant_category_rules (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  finance_category_id uuid not null references public.finance_categories(id) on delete cascade,
  normalized_merchant text not null,
  created_by_user_id uuid not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists merchant_category_rules_household_merchant_idx
  on public.merchant_category_rules(household_id, normalized_merchant);

create index if not exists merchant_category_rules_category_id_idx
  on public.merchant_category_rules(finance_category_id);
