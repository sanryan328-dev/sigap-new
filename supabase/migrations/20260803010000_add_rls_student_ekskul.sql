-- =============================================================
-- SIGAP: Add RLS on student_ekskul for extracurricular access control
-- =============================================================

-- Enable RLS on student_ekskul
ALTER TABLE public.student_ekskul ENABLE ROW LEVEL SECURITY;

-- Coaches can read members of their assigned ekskul
DROP POLICY IF EXISTS "Coaches can read ekskul members" ON public.student_ekskul;
CREATE POLICY "Coaches can read ekskul members"
  ON public.student_ekskul
  FOR SELECT
  TO authenticated
  USING (
    ekskul_id IS NULL
    OR EXISTS (
      SELECT 1 FROM public.extracurricular_coaches ec
      WHERE ec.ekskul_id = student_ekskul.ekskul_id
        AND ec.user_id::text = auth.uid()::text
        AND ec.active = true
    )
    OR EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id::text = auth.uid()::text
        AND users.role IN ('admin', 'kurikulum')
    )
  );

-- Coaches can insert members for their assigned ekskul
DROP POLICY IF EXISTS "Coaches can insert ekskul members" ON public.student_ekskul;
CREATE POLICY "Coaches can insert ekskul members"
  ON public.student_ekskul
  FOR INSERT
  TO authenticated
  WITH CHECK (
    ekskul_id IS NULL
    OR EXISTS (
      SELECT 1 FROM public.extracurricular_coaches ec
      WHERE ec.ekskul_id = student_ekskul.ekskul_id
        AND ec.user_id::text = auth.uid()::text
        AND ec.active = true
    )
    OR EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id::text = auth.uid()::text
        AND users.role IN ('admin', 'kurikulum')
    )
  );

-- Coaches can update members of their assigned ekskul
DROP POLICY IF EXISTS "Coaches can update ekskul members" ON public.student_ekskul;
CREATE POLICY "Coaches can update ekskul members"
  ON public.student_ekskul
  FOR UPDATE
  TO authenticated
  USING (
    ekskul_id IS NULL
    OR EXISTS (
      SELECT 1 FROM public.extracurricular_coaches ec
      WHERE ec.ekskul_id = student_ekskul.ekskul_id
        AND ec.user_id::text = auth.uid()::text
        AND ec.active = true
    )
    OR EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id::text = auth.uid()::text
        AND users.role IN ('admin', 'kurikulum')
    )
  );

-- Coaches can delete members of their assigned ekskul
DROP POLICY IF EXISTS "Coaches can delete ekskul members" ON public.student_ekskul;
CREATE POLICY "Coaches can delete ekskul members"
  ON public.student_ekskul
  FOR DELETE
  TO authenticated
  USING (
    ekskul_id IS NULL
    OR EXISTS (
      SELECT 1 FROM public.extracurricular_coaches ec
      WHERE ec.ekskul_id = student_ekskul.ekskul_id
        AND ec.user_id::text = auth.uid()::text
        AND ec.active = true
    )
    OR EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id::text = auth.uid()::text
        AND users.role IN ('admin', 'kurikulum')
    )
  );

-- =============================================================
-- Also add unique constraint on (student_id, ekskul_id) for data integrity
-- =============================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'uq_student_ekskul_student_ekskul'
  ) THEN
    ALTER TABLE public.student_ekskul
      ADD CONSTRAINT uq_student_ekskul_student_ekskul
      UNIQUE (student_id, ekskul_id);
  END IF;
END $$;
