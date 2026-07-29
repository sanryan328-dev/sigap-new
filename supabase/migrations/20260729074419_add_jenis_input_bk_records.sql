ALTER TABLE public.bk_records
  ADD COLUMN IF NOT EXISTS jenis_input character varying(50) DEFAULT 'pelanggaran' NOT NULL,
  ADD COLUMN IF NOT EXISTS kategori_layanan character varying(50);
