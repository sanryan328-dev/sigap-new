-- 1. Set nilai default kolom created_at ke timestamp saat ini (NOW)
ALTER TABLE teaching_journals 
ALTER COLUMN created_at SET DEFAULT NOW();

-- 2. Update data lama yang nilai created_at-nya masih NULL agar terisi waktu sekarang
UPDATE teaching_journals 
SET created_at = NOW() 
WHERE created_at IS NULL;

-- 3. Kunci kolom agar bernilai NOT NULL di masa mendatang
ALTER TABLE teaching_journals 
ALTER COLUMN created_at SET NOT NULL;