-- =====================================================
-- Migration: teaching_schedules — jam_ke → jam_mulai + durasi_jam
-- =====================================================

-- 1. Hapus kolom jam_ke lama (varchar) — aman dengan IF EXISTS
ALTER TABLE IF EXISTS public.teaching_schedules
  DROP COLUMN IF EXISTS jam_ke;

-- 2. Tambah kolom integer baru — aman dengan IF NOT EXISTS
ALTER TABLE IF EXISTS public.teaching_schedules
  ADD COLUMN IF NOT EXISTS jam_mulai integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS durasi_jam integer NOT NULL DEFAULT 1;

-- 3. Hapus constraint FK lama jika ada, lalu tambah yang baru
ALTER TABLE IF EXISTS public.teaching_schedules
  DROP CONSTRAINT IF EXISTS fk_teaching_schedules_user_id;

ALTER TABLE IF EXISTS public.teaching_schedules
  ADD CONSTRAINT fk_teaching_schedules_user_id
  FOREIGN KEY (user_id)
  REFERENCES public.users (id)
  ON DELETE CASCADE;