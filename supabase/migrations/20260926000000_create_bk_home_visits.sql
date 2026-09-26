-- Tabel catatan Home Visit Guru BK
-- Menyimpan riwayat kunjungan rumah siswa: tanggal, kelas, nama siswa, alamat, hasil kunjungan, tindak lanjut.

CREATE TABLE public.bk_home_visits (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    student_id bigint NOT NULL,
    kelas character varying(255) NOT NULL,
    tanggal date DEFAULT CURRENT_DATE NOT NULL,
    alamat text,
    catatan text NOT NULL,
    tindak_lanjut text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

ALTER TABLE public.bk_home_visits OWNER TO postgres;

CREATE SEQUENCE public.bk_home_visits_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.bk_home_visits_id_seq OWNER TO postgres;

ALTER SEQUENCE public.bk_home_visits_id_seq OWNED BY public.bk_home_visits.id;

ALTER TABLE ONLY public.bk_home_visits ALTER COLUMN id SET DEFAULT nextval('public.bk_home_visits_id_seq'::regclass);

ALTER TABLE ONLY public.bk_home_visits
    ADD CONSTRAINT bk_home_visits_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.bk_home_visits
    ADD CONSTRAINT bk_home_visits_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.bk_home_visits
    ADD CONSTRAINT bk_home_visits_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

CREATE INDEX idx_bk_home_visits_kelas ON public.bk_home_visits (kelas);
CREATE INDEX idx_bk_home_visits_student ON public.bk_home_visits (student_id);
CREATE INDEX idx_bk_home_visits_tanggal ON public.bk_home_visits (tanggal DESC);

GRANT ALL ON TABLE public.bk_home_visits TO anon;
GRANT ALL ON TABLE public.bk_home_visits TO authenticated;
GRANT ALL ON TABLE public.bk_home_visits TO service_role;

GRANT ALL ON SEQUENCE public.bk_home_visits_id_seq TO anon;
GRANT ALL ON SEQUENCE public.bk_home_visits_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.bk_home_visits_id_seq TO service_role;
