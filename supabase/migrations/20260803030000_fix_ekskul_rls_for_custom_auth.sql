-- =============================================================
-- SIGAP: Disable RLS on ekskul tables
-- The app uses custom auth (not Supabase auth), so auth.uid()
-- returns null and RLS policies cannot identify users.
-- All other tables (profiles, students, users, etc.) already
-- have RLS disabled. This makes ekskul tables consistent.
-- Security is handled at the application layer.
-- =============================================================

-- ── student_ekskul: drop all policies, disable RLS ──
DROP POLICY IF EXISTS "Coaches can read ekskul members" ON student_ekskul;
DROP POLICY IF EXISTS "Coaches can insert ekskul members" ON student_ekskul;
DROP POLICY IF EXISTS "Coaches can update ekskul members" ON student_ekskul;
DROP POLICY IF EXISTS "Coaches can delete ekskul members" ON student_ekskul;
ALTER TABLE student_ekskul DISABLE ROW LEVEL SECURITY;

-- ── extracurriculars: drop all policies, disable RLS ──
DROP POLICY IF EXISTS "Admins can manage extracurriculars" ON extracurriculars;
DROP POLICY IF EXISTS "Authenticated users can read extracurriculars" ON extracurriculars;
DROP POLICY IF EXISTS "Anyone can read extracurriculars" ON extracurriculars;
DROP POLICY IF EXISTS "Anyone can manage extracurriculars" ON extracurriculars;
ALTER TABLE extracurriculars DISABLE ROW LEVEL SECURITY;

-- ── extracurricular_coaches: drop all policies, disable RLS ──
DROP POLICY IF EXISTS "Admins can manage coach assignments" ON extracurricular_coaches;
DROP POLICY IF EXISTS "Coaches can read their assignments" ON extracurricular_coaches;
DROP POLICY IF EXISTS "Admins can manage coaches" ON extracurricular_coaches;
DROP POLICY IF EXISTS "Authenticated users can read coaches" ON extracurricular_coaches;
DROP POLICY IF EXISTS "Anyone can read coaches" ON extracurricular_coaches;
DROP POLICY IF EXISTS "Anyone can manage coaches" ON extracurricular_coaches;
ALTER TABLE extracurricular_coaches DISABLE ROW LEVEL SECURITY;
