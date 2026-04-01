alter table public.tasks
  add column if not exists priority text not null default 'medium'
    check (priority in ('low', 'medium', 'high'));

create index if not exists tasks_priority_idx on public.tasks(priority);
