-- Toggle Wars teammate finder: posts table.
-- Run once in Supabase: SQL Editor -> New query -> paste -> Run.

create table if not exists public.posts (
  id            uuid primary key default gen_random_uuid(),
  name          text not null check (char_length(name)    between 1 and 60),
  idea          text not null check (char_length(idea)    between 1 and 200),
  bio           text not null check (char_length(bio)     between 1 and 300),
  skills_needed text[] not null default '{}' check (cardinality(skills_needed) <= 8),
  contact       text not null check (char_length(contact) between 1 and 100),
  created_at    timestamptz not null default now()
);

-- Anyone can read posts and add a post; nobody can edit or delete through the public key.
alter table public.posts enable row level security;

drop policy if exists "Anyone can read posts" on public.posts;
create policy "Anyone can read posts"
  on public.posts for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone can add a post" on public.posts;
create policy "Anyone can add a post"
  on public.posts for insert
  to anon, authenticated
  with check (true);

grant select, insert on public.posts to anon, authenticated;
