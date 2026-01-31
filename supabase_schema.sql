-- Create the players table
create table public.players (
  id uuid not null default gen_random_uuid (),
  name text not null,
  email text not null,
  phone text not null,
  category text not null,
  rating_id text null,
  status text not null default 'pending',
  registered_at timestamptz not null default now(),
  constraint players_pkey primary key (id)
);

-- Enable Row Level Security (RLS)
alter table public.players enable row level security;

-- Policy: Allow anonymous read access (Public Roster)
create policy "Allow public read access"
on public.players
for select
to anon
using (true);

-- Policy: Allow anonymous insert access (Registration)
create policy "Allow public insert access"
on public.players
for insert
to anon
with check (true);

-- Policy: Allow anonymous update access (Admin Actions via App)
-- Note: In a production app with real auth, you would restrict this to authenticated users.
create policy "Allow public update access"
on public.players
for update
to anon
using (true);

-- Policy: Allow anonymous delete access (Admin Actions via App)
create policy "Allow public delete access"
on public.players
for delete
to anon
using (true);
