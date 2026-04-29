create table if not exists public.household_invites (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  invited_by_user_id uuid not null,
  invited_email text not null,
  role text not null default 'member' check (role in ('owner', 'member')),
  token text not null unique,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked', 'expired')),
  expires_at timestamptz not null,
  accepted_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists household_invites_household_id_idx on public.household_invites(household_id);
create index if not exists household_invites_invited_email_idx on public.household_invites(invited_email);
create index if not exists household_invites_status_idx on public.household_invites(status);
create index if not exists household_invites_token_idx on public.household_invites(token);
