ALTER TABLE public.student_scores
  DROP CONSTRAINT IF EXISTS unique_student_score_assessment;

ALTER TABLE public.student_scores
ADD CONSTRAINT unique_student_score_assessment
UNIQUE (student_id, jenis_penilaian, user_id);
