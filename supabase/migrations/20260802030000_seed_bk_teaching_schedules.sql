-- Seed jadwal mengajar Guru BK (user_id 4) agar dropdown kelas binaan BK
-- sinkron dengan teaching_schedules. Hanya diisi bila Guru BK belum punya jadwal.

INSERT INTO public.teaching_schedules (user_id, mata_pelajaran, kelas, hari, jam_mulai, durasi_jam)
SELECT 4, 'Bimbingan Konseling', k.kelas, k.hari, k.jam_mulai, 1
FROM (
    SELECT 'IX A' AS kelas, 'Senin' AS hari, 1 AS jam_mulai
    UNION SELECT 'IX B', 'Senin', 2
    UNION SELECT 'IX C', 'Senin', 3
    UNION SELECT 'IX A', 'Kamis', 4
    UNION SELECT 'IX B', 'Kamis', 5
    UNION SELECT 'IX C', 'Kamis', 6
) k
WHERE NOT EXISTS (SELECT 1 FROM public.teaching_schedules WHERE user_id = 4);
