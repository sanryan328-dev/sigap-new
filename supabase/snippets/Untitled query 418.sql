-- Hapus atau abaikan indeks yang error sebelumnya, lalu jalankan yang sudah diperbaiki ini:
CREATE INDEX IF NOT EXISTS idx_student_attendances_tjournal_id 
ON public.student_attendances(teaching_journal_id);