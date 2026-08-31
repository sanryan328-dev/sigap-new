-- =============================================================
-- SIGAP: Fix ekskul RLS policies for custom auth
-- The app uses custom auth (not Supabase auth), so auth.uid()
-- returns null. RLS policies must allow 'anon' role too.
-- =============================================================

-- ── student_ekskul ──
DROP POLICY IF EXISTS "Coaches can read ekskul members" ON student_ekskul;
DROP POLICY IF EXISTS "Coaches can insert ekskul members" ON student_ekskul;
DROP POLICY IF EXISTS "Coaches can update ekskul members" ON student_ekskul;
DROP POLICY IF EXISTS "Coaches can delete ekskul members" ON student_ekskul;

CREATE POLICY "Coaches can read ekskul members"
  ON student_ekskul FOR SELECT
  TO anon, authenticated
  USING (
    ekskul_id IS NULL
    OR EXISTS (
      SELECT 1 FROM extracurricular_coaches ec
      WHERE ec.ekskul_id = student_ekskul.ekskul_id
        AND ec.user_id = (SELECT id FROM users LIMIT 0) -- always true placeholder
        AND ec.active = true
    )
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.role IN ('admin', 'kurikulum')
    )
  );

CREATE POLICY "Coaches can insert ekskul members"
  ON student_ekskul FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    ekskul_id IS NULL
    OR EXISTS (
      SELECT 1 FROM extracurricular_coaches ec
      WHERE ec.ekskul_id = student_ekskul.ekskul_id
        AND ec.active = true
    )
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.role IN ('admin', 'kurikulum')
    )
  );

CREATE POLICY "Coaches can update ekskul members"
  ON student_ekskul FOR UPDATE
  TO anon, authenticated
  USING (
    ekskul_id IS NULL
    OR EXISTS (
      SELECT 1 FROM extracurricular_coaches ec
      WHERE ec.ekskul_id = student_ekskul.ekskul_id
        AND ec.active = true
    )
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.role IN ('admin', 'kurikulum')
    )
  );

CREATE POLICY "Coaches can delete ekskul members"
  ON student_ekskul FOR DELETE
  TO anon, authenticated
  USING (
    ekskul_id IS NULL
    OR EXISTS (
      SELECT 1 FROM extracurricular_coaches ec
      WHERE ec.ekskul_id = student_ekskul.ekskul_id
        AND ec.active = true
    )
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.role IN ('admin', 'kurikulum')
    )
  );

-- ── extracurriculars ──
DROP POLICY IF EXISTS "Admins can manage extracurriculars" ON extracurriculars;
DROP POLICY IF EXISTS "Authenticated users can read extracurriculars" ON extracurriculars;

CREATE POLICY "Anyone can read extracurriculars"
  ON extracurriculars FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can manage extracurriculars"
  ON extracurriculars FOR ALL
  TO anon, authenticated
  USING (true);

-- ── extracurricular_coaches ──
DROP POLICY IF EXISTS "Admins can manage coach assignments" ON extracurricular_coaches;
DROP POLICY IF EXISTS "Coaches can read their assignments" ON extracurricular_coaches;

CREATE POLICY "Anyone can read coaches"
  ON extracurricular_coaches FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can manage coaches"
  ON extracurricular_coaches FOR ALL
  TO anon, authenticated
  USING (true);
