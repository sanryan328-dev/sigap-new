-- Kelas binaan Guru BK (user_id 4) harus tepat 8 kelas: VIII A - VIII H.
-- Hapus jadwal di luar set tersebut (IX A/B/C dari seed sebelumnya) agar
-- dropdown kelas binaan BK menampilkan persis 8 kelas.

DELETE FROM public.teaching_schedules
WHERE user_id = 4
  AND mata_pelajaran = 'Bimbingan Konseling'
  AND kelas NOT IN ('VIII A', 'VIII B', 'VIII C', 'VIII D', 'VIII E', 'VIII F', 'VIII G', 'VIII H');
