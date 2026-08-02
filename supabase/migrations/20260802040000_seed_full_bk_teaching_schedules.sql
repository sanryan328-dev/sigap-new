-- Lengkapi jadwal mengajar Guru BK (user_id 4) menjadi 8 kelas binaan:
-- VIII A - VIII H (kelas binaan penuh). Idempotent per (user_id, kelas).

INSERT INTO public.teaching_schedules (user_id, mata_pelajaran, kelas, hari, jam_mulai, durasi_jam)
SELECT 4, 'Bimbingan Konseling', k.kelas, k.hari, k.jam_mulai, 1
FROM (
    SELECT 'VIII A' AS kelas, 'Senin' AS hari, 1 AS jam_mulai
    UNION SELECT 'VIII B', 'Senin', 2
    UNION SELECT 'VIII C', 'Senin', 3
    UNION SELECT 'VIII D', 'Senin', 4
    UNION SELECT 'VIII E', 'Selasa', 1
    UNION SELECT 'VIII F', 'Selasa', 2
    UNION SELECT 'VIII G', 'Selasa', 3
    UNION SELECT 'VIII H', 'Selasa', 4
) k
WHERE NOT EXISTS (
    SELECT 1 FROM public.teaching_schedules ts
    WHERE ts.user_id = 4 AND ts.kelas = k.kelas
);
