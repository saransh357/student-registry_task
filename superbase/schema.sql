-- ============================================================
--  Student Registry · Supabase Schema
--  Run this in: Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Create the students table
CREATE TABLE IF NOT EXISTS public.students (
  id         BIGINT       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name       TEXT         NOT NULL,
  email      TEXT         NOT NULL UNIQUE,
  age        INTEGER      NOT NULL CHECK (age >= 1 AND age <= 120),
  created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
CREATE POLICY "Allow public read"
  ON public.students FOR SELECT USING (true);

CREATE POLICY "Allow public insert"
  ON public.students FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update"
  ON public.students FOR UPDATE USING (true);

CREATE POLICY "Allow public delete"
  ON public.students FOR DELETE USING (true);

-- 4. Index on email
CREATE INDEX IF NOT EXISTS students_email_idx ON public.students (email);

-- 5. Seed demo data
INSERT INTO public.students (name, email, age)
VALUES
  ('Marcus ', 'm.williams@university.edu',    23),
  ('Priya Sharma',    'priya.s@university.edu',       20),
  ('riya d',     'd.riya@university.edu',       24),
  (' pj ',   'lpj@university.edu',   19)
ON CONFLICT (email) DO NOTHING;
