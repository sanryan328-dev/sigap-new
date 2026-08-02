-- Cek daftar kelas milik Guru BK yang sedang diuji
SELECT DISTINCT kelas 
FROM public.teaching_schedules 
WHERE user_id = '4';