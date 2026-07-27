ALTER TABLE public.student_scores 
ADD CONSTRAINT unique_student_score_assessment 
UNIQUE (student_id, jenis_penilaian, user_id);
