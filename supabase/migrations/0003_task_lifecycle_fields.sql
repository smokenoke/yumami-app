alter table public.tasks
add column if not exists completed_at timestamptz,
add column if not exists archived_reason text;

alter table public.tasks
  drop constraint if exists tasks_archived_reason_check;

alter table public.tasks
  add constraint tasks_archived_reason_check
  check (archived_reason in ('completed', 'dismissed', 'cancelled', 'duplicate', 'other'));

create index if not exists tasks_completed_at_idx on public.tasks(completed_at);
create index if not exists tasks_archived_reason_idx on public.tasks(archived_reason);
