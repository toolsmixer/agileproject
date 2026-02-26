# Agile Scrum Master Toolkit (React)

A lightweight React-based toolkit designed to be hosted for free on GitHub Pages.

## How to use

1. Push this folder to a GitHub repository.
2. In the repository settings, enable GitHub Pages and select the root directory on the default branch.
3. Visit the GitHub Pages URL and share it with your team.

## Supabase setup (no build step)

1. Create a Supabase project.
2. In the SQL editor, run the schema below.
3. Enable Realtime for the `rooms` and `votes` tables in the Realtime tab.
4. Copy your project URL + anon key into the app when prompted (or edit `backend.js`).

```sql
create extension if not exists "pgcrypto";

create table public.rooms (
  id text primary key,
  name text not null,
  deck jsonb not null,
  story text,
  revealed boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.votes (
  id uuid primary key default gen_random_uuid(),
  room_id text not null references public.rooms(id) on delete cascade,
  user_id text not null,
  user_name text,
  vote_value text,
  updated_at timestamptz not null default now(),
  unique (room_id, user_id)
);

alter table public.rooms enable row level security;
alter table public.votes enable row level security;

create policy "rooms read" on public.rooms for select using (true);
create policy "rooms insert" on public.rooms for insert with check (true);
create policy "rooms update" on public.rooms for update using (true);

create policy "votes read" on public.votes for select using (true);
create policy "votes insert" on public.votes for insert with check (true);
create policy "votes update" on public.votes for update using (true);
create policy "votes delete" on public.votes for delete using (true);
```

Security note: the policies above are open to keep the demo simple. For production, lock these down.

## Notes

- This project uses React via CDN, so no build step is required.
- Add new tiles by editing the `tiles` array in `app.js`.
- Backend logic is isolated in `backend.js` so you can swap Supabase for another provider later.
