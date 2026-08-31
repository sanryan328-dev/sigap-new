-- =============================================================
-- SIGAP: Extracurricular Architecture Refactor
-- Strategy: EXPAND → MIGRATE → VERIFY (no destructive changes)
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. CREATE MASTER TABLE: extracurriculars
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.extracurriculars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kode_ekskul text NOT NULL,
  nama_ekskul text NOT NULL,
  deskripsi text,
  aktif boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_extracurriculars_nama_lower ON public.extracurriculars (lower(nama_ekskul));
CREATE UNIQUE INDEX IF NOT EXISTS idx_extracurriculars_kode ON public.extracurriculars (kode_ekskul);

COMMENT ON TABLE public.extracurriculars IS 'Canonical master table for extracurriculars. One row per unique ekskul.';

-- ─────────────────────────────────────────────────────────────
-- 2. CREATE JUNCTION TABLE: extracurricular_coaches
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.extracurricular_coaches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ekskul_id uuid NOT NULL REFERENCES public.extracurriculars(id) ON DELETE CASCADE,
  user_id bigint NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  is_primary boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_coaches_ekskul_user UNIQUE (ekskul_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_coaches_ekskul_id ON public.extracurricular_coaches (ekskul_id);
CREATE INDEX IF NOT EXISTS idx_coaches_user_id ON public.extracurricular_coaches (user_id);
CREATE INDEX IF NOT EXISTS idx_coaches_active ON public.extracurricular_coaches (active) WHERE active = true;

COMMENT ON TABLE public.extracurricular_coaches IS 'Junction: which users are coaches of which extracurriculars. Multi-coach supported.';

-- ─────────────────────────────────────────────────────────────
-- 3. ADD ekskul_id TO student_ekskul (nullable for backward compat)
-- ─────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'student_ekskul' AND column_name = 'ekskul_id'
  ) THEN
    ALTER TABLE public.student_ekskul ADD COLUMN ekskul_id uuid REFERENCES public.extracurriculars(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_student_ekskul_ekskul_id ON public.student_ekskul (ekskul_id);

-- ─────────────────────────────────────────────────────────────
-- 4. ADD ekskul_id TO teaching_journals (nullable for backward compat)
-- ─────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'teaching_journals' AND column_name = 'ekskul_id'
  ) THEN
    ALTER TABLE public.teaching_journals ADD COLUMN ekskul_id uuid REFERENCES public.extracurriculars(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_teaching_journals_ekskul_id ON public.teaching_journals (ekskul_id) WHERE ekskul_id IS NOT NULL;

-- ─────────────────────────────────────────────────────────────
-- 5. MIGRATE DATA: Create canonical extracurriculars from profiles.nama_ekstrakurikuler
-- ─────────────────────────────────────────────────────────────
-- Insert unique extracurriculars from profiles
INSERT INTO public.extracurriculars (kode_ekskul, nama_ekskul)
SELECT
  upper(regexp_replace(trim(nama_ekstrakurikuler), '[^a-zA-Z0-9]+', '_', 'g')) AS kode_ekskul,
  trim(nama_ekstrakurikuler) AS nama_ekskul
FROM public.profiles
WHERE nama_ekstrakurikuler IS NOT NULL
  AND trim(nama_ekstrakurikuler) != ''
GROUP BY lower(trim(nama_ekstrakurikuler)), trim(nama_ekstrakurikuler)
ON CONFLICT (kode_ekskul) DO NOTHING;

-- Also migrate from student_ekskul.nama_ekskul (in case there are ekskul not in profiles)
INSERT INTO public.extracurriculars (kode_ekskul, nama_ekskul)
SELECT
  upper(regexp_replace(trim(nama_ekskul), '[^a-zA-Z0-9]+', '_', 'g')) AS kode_ekskul,
  trim(nama_ekskul) AS nama_ekskul
FROM public.student_ekskul
WHERE nama_ekskul IS NOT NULL
  AND trim(nama_ekskul) != ''
GROUP BY lower(trim(nama_ekskul)), trim(nama_ekskul)
ON CONFLICT (kode_ekskul) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- 6. MIGRATE DATA: Create coach assignments from profiles
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.extracurricular_coaches (ekskul_id, user_id, is_primary, active)
SELECT
  e.id AS ekskul_id,
  p.user_id,
  true AS is_primary,
  true AS active
FROM public.profiles p
JOIN public.extracurriculars e ON lower(e.nama_ekskul) = lower(trim(p.nama_ekstrakurikuler))
WHERE p.nama_ekstrakurikuler IS NOT NULL
  AND trim(p.nama_ekstrakurikuler) != ''
ON CONFLICT (ekskul_id, user_id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- 7. BACKFILL: Set ekskul_id on student_ekskul
-- ─────────────────────────────────────────────────────────────
UPDATE public.student_ekskul se
SET ekskul_id = e.id
FROM public.extracurriculars e
WHERE lower(e.nama_ekskul) = lower(trim(se.nama_ekskul))
  AND se.ekskul_id IS NULL;

-- ─────────────────────────────────────────────────────────────
-- 8. BACKFILL: Set ekskul_id on teaching_journals for ekskul journals
-- ─────────────────────────────────────────────────────────────
UPDATE public.teaching_journals tj
SET ekskul_id = e.id
FROM public.extracurriculars e
WHERE tj.mata_pelajaran ILIKE 'Ekskul %'
  AND lower(e.nama_ekskul) = lower(trim(replace(tj.mata_pelajaran, 'Ekskul ', '')))
  AND tj.ekskul_id IS NULL;

-- ─────────────────────────────────────────────────────────────
-- 9. ENABLE ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.extracurriculars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extracurricular_coaches ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────
-- 10. RLS POLICIES: extracurriculars (read for all auth, admin manages)
-- ─────────────────────────────────────────────────────────────
-- Anyone authenticated can read extracurriculars (for dropdowns, etc.)
DROP POLICY IF EXISTS "Authenticated users can read extracurriculars" ON public.extracurriculars;
CREATE POLICY "Authenticated users can read extracurriculars"
  ON public.extracurriculars
  FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can modify extracurriculars
DROP POLICY IF EXISTS "Admins can manage extracurriculars" ON public.extracurriculars;
CREATE POLICY "Admins can manage extracurriculars"
  ON public.extracurriculars
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id::text = auth.uid()::text
        AND users.role = 'admin'
    )
  );

-- ─────────────────────────────────────────────────────────────
-- 11. RLS POLICIES: extracurricular_coaches
-- ─────────────────────────────────────────────────────────────
-- Coaches can read their own assignments
DROP POLICY IF EXISTS "Coaches can read their assignments" ON public.extracurricular_coaches;
CREATE POLICY "Coaches can read their assignments"
  ON public.extracurricular_coaches
  FOR SELECT
  TO authenticated
  USING (
    user_id::text = auth.uid()::text
    OR EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id::text = auth.uid()::text
        AND users.role IN ('admin', 'kurikulum')
    )
  );

-- Admins and kurikulum can manage coach assignments
DROP POLICY IF EXISTS "Admins can manage coach assignments" ON public.extracurricular_coaches;
CREATE POLICY "Admins can manage coach assignments"
  ON public.extracurricular_coaches
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id::text = auth.uid()::text
        AND users.role IN ('admin', 'kurikulum')
    )
  );

-- ─────────────────────────────────────────────────────────────
-- 12. HELPER FUNCTION: Get user's assigned ekskul IDs
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_user_ekskul_ids(p_user_id bigint)
RETURNS SETOF uuid
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT ec.ekskul_id
  FROM public.extracurricular_coaches ec
  WHERE ec.user_id = p_user_id
    AND ec.active = true;
$$;

COMMENT ON FUNCTION public.get_user_ekskul_ids IS 'Returns extracurricular IDs that a user is assigned to as an active coach.';

-- ─────────────────────────────────────────────────────────────
-- 13. UPDATED_AT TRIGGER
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON public.extracurriculars;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.extracurriculars
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.extracurricular_coaches;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.extracurricular_coaches
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================
-- VERIFICATION QUERIES (run manually after migration)
-- =============================================================
-- SELECT * FROM extracurriculars;
-- SELECT * FROM extracurricular_coaches;
-- SELECT se.id, se.nama_ekskul, se.ekskul_id, e.nama_ekskul FROM student_ekskul se LEFT JOIN extracurriculars e ON se.ekskul_id = e.id LIMIT 10;
-- SELECT tj.id, tj.mata_pelajaran, tj.ekskul_id, e.nama_ekskul FROM teaching_journals tj LEFT JOIN extracurriculars e ON tj.ekskul_id = e.id WHERE tj.mata_pelajaran ILIKE 'Ekskul%';
