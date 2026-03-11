-- ============================================================
--  Student Registry · Supabase Schema
--  Run this in your Supabase project:
--  Dashboard → SQL Editor → New Query → paste & run
-- ============================================================

-- 1. Create the students table
create table if not exists public.students (
  id          bigint        generated always as identity primary key,
  name        text          not null,
  email       text          not null unique,
  age         integer       not null check (age >= 1 and age <= 120),
  created_at  timestamptz   not null default now()
);

-- 2. Enable Row Level Security
alter table public.students enable row level security;

-- 3. Allow anonymous reads (for public display)
create policy "Allow public read"
  on public.students
  for select
  using (true);

-- 4. Allow anonymous insert/update/delete
--    (for a production app, use auth tokens instead)
create policy "Allow public insert"
  on public.students
  for insert
  with check (true);

create policy "Allow public update"
  on public.students
  for update
  using (true);

create policy "Allow public delete"
  on public.students
  for delete
  using (true);

-- 5. Add a helpful index on email
create index if not exists students_email_idx on public.students (email);

-- 6. Optional: seed some demo data
insert into public.students (name, email, age) values
  ('raj ',   'raj@university.edu',  21),
  ('sara ', 'msara@university.edu',      23),
  ('Priya Sharma',    'priya.s@university.edu',         20),
  
on conflict (email) do nothing;
