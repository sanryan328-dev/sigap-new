-- Fix FK teacher_absences.user_id agar mengarah ke public.users(id)
-- (app memakai custom auth via tabel public.users, bukan auth.users)
ALTER TABLE public.teacher_absences
  DROP CONSTRAINT IF EXISTS fk_teacher_absences_profile;

ALTER TABLE public.teacher_absences
  ADD CONSTRAINT fk_teacher_absences_profile
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
