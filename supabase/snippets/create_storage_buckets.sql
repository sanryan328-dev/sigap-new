/* ─────────────────────────────────────────────────────────────
   Buat storage bucket untuk upload surat izin & tugas titipan
   Jalankan di Supabase SQL Editor (Dashboard → SQL Editor)
   ───────────────────────────────────────────────────────────── */

-- 1. Bucket surat-izin (surat keterangan sakit/izin/dinas)
INSERT INTO storage.buckets (id, name, public)
VALUES ('surat-izin', 'surat-izin', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Bucket tugas-titipan (tugas/soal titipan guru yang izin)
INSERT INTO storage.buckets (id, name, public)
VALUES ('tugas-titipan', 'tugas-titipan', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Policy: izinkan anon/authenticated membaca file di kedua bucket
CREATE POLICY "Public read surat-izin"
ON storage.objects FOR SELECT
USING (bucket_id = 'surat-izin');

CREATE POLICY "Public read tugas-titipan"
ON storage.objects FOR SELECT
USING (bucket_id = 'tugas-titipan');

-- 4. Policy: izinkan authenticated upload ke surat-izin
CREATE POLICY "Authenticated upload surat-izin"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'surat-izin');

-- 5. Policy: izinkan authenticated upload ke tugas-titipan
CREATE POLICY "Authenticated upload tugas-titipan"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'tugas-titipan');
