-- Migration: Add status_verifikasi column to student_attendances
-- Enables draft → verified workflow:
--   'pending'              = Guru Mapel draft input (default)
--   'verified_wali_kelas'  = Wali Kelas has reviewed and locked
--   'diverifikasi_piket'   = (future) verified by piket

ALTER TABLE IF EXISTS public.student_attendances
  ADD COLUMN IF NOT EXISTS status_verifikasi VARCHAR(50)
  DEFAULT 'pending';

-- Index opsional untuk query cepat
CREATE INDEX IF NOT EXISTS idx_student_attendances_status_verifikasi
  ON public.student_attendances (status_verifikasi);
