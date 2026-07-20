-- Menambahkan value 'kepala_sekolah' ke dalam tipe enum public.role_enum secara aman
ALTER TYPE public.role_enum ADD VALUE IF NOT EXISTS 'kepala_sekolah';