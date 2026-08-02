-- 1. Aktifkan kembali RLS pada tabel profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Buat kebijakan agar semua user terautentikasi bisa membaca profil
CREATE POLICY "Izinkan baca semua profil untuk user login"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- 3. Buat kebijakan agar user hanya bisa mengubah profil miliknya sendiri
CREATE POLICY "Izinkan update profil sendiri"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id);