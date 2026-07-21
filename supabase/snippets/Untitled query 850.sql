ALTER TABLE public.student_attendances 
  ADD COLUMN IF NOT EXISTS status_verifikasi VARCHAR(50) DEFAULT 'pending';
CREATE INDEX IF NOT EXISTS idx_student_attendances_status_verifikasi
  ON public.student_attendances (status_verifikasi);