--
-- PostgreSQL database dump
--

CREATE TYPE public.izin_enum AS ENUM (
    'sakit',
    'izin_keperluan',
    'tugas_dinas'
);

ALTER TYPE public.izin_enum OWNER TO postgres;

--
-- Name: jk_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.jk_enum AS ENUM (
    'L',
    'P'
);

ALTER TYPE public.jk_enum OWNER TO postgres;

--
-- Name: kejadian_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.kejadian_enum AS ENUM (
    'apresiasi',
    'pelanggaran'
);

ALTER TYPE public.kejadian_enum OWNER TO postgres;

--
-- Name: kualitatif_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.kualitatif_enum AS ENUM (
    'Sangat Baik',
    'Baik',
    'Cukup',
    'Kurang'
);

ALTER TYPE public.kualitatif_enum OWNER TO postgres;

--
-- Name: role_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.role_enum AS ENUM (
    'admin',
    'guru_mapel',
    'guru_piket',
    'wali_kelas',
    'guru_bk',
    'pembina_ekskul',
    'pks_kesiswaan',
    'kepala_sekolah',
    'kurikulum'
);

ALTER TYPE public.role_enum OWNER TO postgres;

--
-- Name: verifikasi_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.verifikasi_enum AS ENUM (
    'pending',
    'diverifikasi_piket'
);

ALTER TYPE public.verifikasi_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bk_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bk_records (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    student_id bigint NOT NULL,
    kelas character varying(255) NOT NULL,
    kategori_kasus character varying(255) NOT NULL,
    detail_kasus text NOT NULL,
    tindakan_penanganan text NOT NULL,
    status character varying(255) DEFAULT 'Sedang Dibina'::character varying NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);

ALTER TABLE public.bk_records OWNER TO postgres;

--
-- Name: bk_records_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bk_records_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.bk_records_id_seq OWNER TO postgres;

--
-- Name: bk_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bk_records_id_seq OWNED BY public.bk_records.id;

--
-- Name: bk_sesi_lanjutan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bk_sesi_lanjutan (
    id bigint NOT NULL,
    bk_record_id bigint NOT NULL,
    catatan_sesi text NOT NULL,
    tindak_lanjut character varying(255) NOT NULL,
    status character varying(255) NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);

ALTER TABLE public.bk_sesi_lanjutan OWNER TO postgres;

--
-- Name: bk_sesi_lanjutan_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bk_sesi_lanjutan_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.bk_sesi_lanjutan_id_seq OWNER TO postgres;

--
-- Name: bk_sesi_lanjutan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bk_sesi_lanjutan_id_seq OWNED BY public.bk_sesi_lanjutan.id;

--
-- Name: extracurricular_journals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.extracurricular_journals (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    nama_ekskul character varying(255) NOT NULL,
    tanggal date NOT NULL,
    aktivitas_kegiatan text NOT NULL,
    jumlah_hadir integer DEFAULT 0 NOT NULL,
    jumlah_sakit integer DEFAULT 0 NOT NULL,
    jumlah_izin integer DEFAULT 0 NOT NULL,
    jumlah_alfa integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);

ALTER TABLE public.extracurricular_journals OWNER TO postgres;

--
-- Name: extracurricular_journals_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.extracurricular_journals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.extracurricular_journals_id_seq OWNER TO postgres;

--
-- Name: extracurricular_journals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.extracurricular_journals_id_seq OWNED BY public.extracurricular_journals.id;

--
-- Name: extracurricular_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.extracurricular_members (
    id integer NOT NULL,
    nama_ekskul character varying(50) NOT NULL,
    student_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.extracurricular_members OWNER TO postgres;

--
-- Name: extracurricular_members_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.extracurricular_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.extracurricular_members_id_seq OWNER TO postgres;

--
-- Name: extracurricular_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.extracurricular_members_id_seq OWNED BY public.extracurricular_members.id;

--
-- Name: extracurricular_scores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.extracurricular_scores (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    student_id bigint NOT NULL,
    nama_ekskul character varying(255) NOT NULL,
    nilai_kualitatif public.kualitatif_enum DEFAULT 'Baik'::public.kualitatif_enum NOT NULL,
    catatan_pembinaan text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);

ALTER TABLE public.extracurricular_scores OWNER TO postgres;

--
-- Name: extracurricular_scores_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.extracurricular_scores_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.extracurricular_scores_id_seq OWNER TO postgres;

--
-- Name: extracurricular_scores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.extracurricular_scores_id_seq OWNED BY public.extracurricular_scores.id;

--
-- Name: journal_student_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.journal_student_logs (
    id bigint NOT NULL,
    teaching_journal_id bigint NOT NULL,
    student_id bigint NOT NULL,
    jenis_kejadian public.kejadian_enum NOT NULL,
    catatan_kejadian text NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);

ALTER TABLE public.journal_student_logs OWNER TO postgres;

--
-- Name: journal_student_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.journal_student_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.journal_student_logs_id_seq OWNER TO postgres;

--
-- Name: journal_student_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.journal_student_logs_id_seq OWNED BY public.journal_student_logs.id;

--
-- Name: master_pelanggarans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.master_pelanggarans (
    id integer NOT NULL,
    kategori character varying(100) NOT NULL,
    jenis_kasus character varying(255) NOT NULL,
    bobot integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.master_pelanggarans OWNER TO postgres;

--
-- Name: master_pelanggarans_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.master_pelanggarans_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.master_pelanggarans_id_seq OWNER TO postgres;

--
-- Name: master_pelanggarans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.master_pelanggarans_id_seq OWNED BY public.master_pelanggarans.id;

--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profiles (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    nama_lengkap character varying(255) NOT NULL,
    foto_profil character varying(255) DEFAULT NULL::character varying,
    mata_pelajaran json,
    is_wali_kelas boolean DEFAULT false NOT NULL,
    kelas_wali character varying(255) DEFAULT NULL::character varying,
    is_guru_piket boolean DEFAULT false NOT NULL,
    nama_ekstrakurikuler character varying(255) DEFAULT NULL::character varying,
    mapel character varying(255) DEFAULT NULL::character varying,
    hari_piket text DEFAULT NULL::text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);

ALTER TABLE public.profiles OWNER TO postgres;

--
-- Name: profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.profiles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.profiles_id_seq OWNER TO postgres;

--
-- Name: profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.profiles_id_seq OWNED BY public.profiles.id;

--
-- Name: student_attendances; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_attendances (
    id bigint NOT NULL,
    teaching_journal_id bigint NOT NULL,
    student_id bigint NOT NULL,
    status character varying(10) DEFAULT NULL::character varying,
    status_verifikasi character varying(50) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);

ALTER TABLE public.student_attendances OWNER TO postgres;

--
-- Name: student_attendances_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.student_attendances_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.student_attendances_id_seq OWNER TO postgres;

--
-- Name: student_attendances_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.student_attendances_id_seq OWNED BY public.student_attendances.id;

--
-- Name: student_scores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_scores (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    student_id bigint NOT NULL,
    kelas character varying(255) NOT NULL,
    mapel character varying(255) NOT NULL,
    jenis_penilaian character varying(255) NOT NULL,
    nilai numeric(5,2) NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);

ALTER TABLE public.student_scores OWNER TO postgres;

--
-- Name: student_scores_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.student_scores_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.student_scores_id_seq OWNER TO postgres;

--
-- Name: student_scores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.student_scores_id_seq OWNED BY public.student_scores.id;

--
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students (
    id bigint NOT NULL,
    nisn character varying(255) NOT NULL,
    nama_siswa character varying(255) NOT NULL,
    jenis_kelamin public.jk_enum NOT NULL,
    kelas character varying(255) NOT NULL,
    kelas_wali character varying(255) DEFAULT NULL::character varying,
    kelas_belajar character varying(255) DEFAULT NULL::character varying,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);

ALTER TABLE public.students OWNER TO postgres;

--
-- Name: students_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.students_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.students_id_seq OWNER TO postgres;

--
-- Name: students_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.students_id_seq OWNED BY public.students.id;

--
-- Name: student_ekskul; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_ekskul (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    student_id bigint,
    nama_ekskul text NOT NULL,
    nilai_kualitatif character varying(2) DEFAULT 'B'::character varying,
    deskripsi_kemajuan text DEFAULT 'Menunjukkan perkembangan baik.'::text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.student_ekskul OWNER TO postgres;

--
-- Name: teacher_absences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teacher_absences (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    tanggal_absen date NOT NULL,
    status_izin public.izin_enum NOT NULL,
    alasan_detail text NOT NULL,
    file_surat_keterangan character varying(255) DEFAULT NULL::character varying,
    titipan_tugas_kelas text,
    tugas_attachment_url text DEFAULT NULL::text,
    status_verifikasi public.verifikasi_enum DEFAULT 'pending'::public.verifikasi_enum NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);

ALTER TABLE public.teacher_absences OWNER TO postgres;

--
-- Name: teacher_absences_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.teacher_absences_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.teacher_absences_id_seq OWNER TO postgres;

--
-- Name: teacher_absences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.teacher_absences_id_seq OWNED BY public.teacher_absences.id;

--
-- Name: teaching_journals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teaching_journals (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    kelas character varying(255) NOT NULL,
    mata_pelajaran character varying(255) NOT NULL,
    jam_ke character varying(255) NOT NULL,
    materi_pembelajaran text NOT NULL,
    catatan_kelas text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);

ALTER TABLE public.teaching_journals OWNER TO postgres;

--
-- Name: teaching_journals_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.teaching_journals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.teaching_journals_id_seq OWNER TO postgres;

--
-- Name: teaching_journals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.teaching_journals_id_seq OWNED BY public.teaching_journals.id;

--
-- Name: teaching_schedules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teaching_schedules (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    mata_pelajaran character varying(255) NOT NULL,
    kelas character varying(255) NOT NULL,
    hari character varying(255) NOT NULL,
    jam_mulai integer DEFAULT 1 NOT NULL,
    durasi_jam integer DEFAULT 1 NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);

ALTER TABLE public.teaching_schedules OWNER TO postgres;

--
-- Name: teaching_schedules_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.teaching_schedules_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.teaching_schedules_id_seq OWNER TO postgres;

--
-- Name: teaching_schedules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.teaching_schedules_id_seq OWNED BY public.teaching_schedules.id;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role public.role_enum DEFAULT 'guru_mapel'::public.role_enum NOT NULL,
    remember_token character varying(100) DEFAULT NULL::character varying,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);

ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;

--
-- Name: bk_records id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bk_records ALTER COLUMN id SET DEFAULT nextval('public.bk_records_id_seq'::regclass);

--
-- Name: bk_sesi_lanjutan id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bk_sesi_lanjutan ALTER COLUMN id SET DEFAULT nextval('public.bk_sesi_lanjutan_id_seq'::regclass);

--
-- Name: extracurricular_journals id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.extracurricular_journals ALTER COLUMN id SET DEFAULT nextval('public.extracurricular_journals_id_seq'::regclass);

--
-- Name: extracurricular_members id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.extracurricular_members ALTER COLUMN id SET DEFAULT nextval('public.extracurricular_members_id_seq'::regclass);

--
-- Name: extracurricular_scores id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.extracurricular_scores ALTER COLUMN id SET DEFAULT nextval('public.extracurricular_scores_id_seq'::regclass);

--
-- Name: journal_student_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journal_student_logs ALTER COLUMN id SET DEFAULT nextval('public.journal_student_logs_id_seq'::regclass);

--
-- Name: master_pelanggarans id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.master_pelanggarans ALTER COLUMN id SET DEFAULT nextval('public.master_pelanggarans_id_seq'::regclass);

--
-- Name: profiles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles ALTER COLUMN id SET DEFAULT nextval('public.profiles_id_seq'::regclass);

--
-- Name: student_attendances id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_attendances ALTER COLUMN id SET DEFAULT nextval('public.student_attendances_id_seq'::regclass);

--
-- Name: student_scores id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_scores ALTER COLUMN id SET DEFAULT nextval('public.student_scores_id_seq'::regclass);

--
-- Name: students id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students ALTER COLUMN id SET DEFAULT nextval('public.students_id_seq'::regclass);

--
-- Name: teacher_absences id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher_absences ALTER COLUMN id SET DEFAULT nextval('public.teacher_absences_id_seq'::regclass);

--
-- Name: teaching_journals id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teaching_journals ALTER COLUMN id SET DEFAULT nextval('public.teaching_journals_id_seq'::regclass);

--
-- Name: teaching_schedules id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teaching_schedules ALTER COLUMN id SET DEFAULT nextval('public.teaching_schedules_id_seq'::regclass);

--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);

--
-- Name: bk_records bk_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bk_records
    ADD CONSTRAINT bk_records_pkey PRIMARY KEY (id);

--
-- Name: bk_sesi_lanjutan bk_sesi_lanjutan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bk_sesi_lanjutan
    ADD CONSTRAINT bk_sesi_lanjutan_pkey PRIMARY KEY (id);

--
-- Name: extracurricular_journals extracurricular_journals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.extracurricular_journals
    ADD CONSTRAINT extracurricular_journals_pkey PRIMARY KEY (id);

--
-- Name: extracurricular_members extracurricular_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.extracurricular_members
    ADD CONSTRAINT extracurricular_members_pkey PRIMARY KEY (id);

--
-- Name: extracurricular_scores extracurricular_scores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.extracurricular_scores
    ADD CONSTRAINT extracurricular_scores_pkey PRIMARY KEY (id);

--
-- Name: journal_student_logs journal_student_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journal_student_logs
    ADD CONSTRAINT journal_student_logs_pkey PRIMARY KEY (id);

--
-- Name: master_pelanggarans master_pelanggarans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.master_pelanggarans
    ADD CONSTRAINT master_pelanggarans_pkey PRIMARY KEY (id);

--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);

--
-- Name: student_attendances student_attendances_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_attendances
    ADD CONSTRAINT student_attendances_pkey PRIMARY KEY (id);

--
-- Name: student_scores student_scores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_scores
    ADD CONSTRAINT student_scores_pkey PRIMARY KEY (id);

--
-- Name: students students_nisn_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_nisn_key UNIQUE (nisn);

--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);

--
-- Name: student_ekskul student_ekskul_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_ekskul
    ADD CONSTRAINT student_ekskul_pkey PRIMARY KEY (id);

--
-- Name: student_ekskul unique_student_ekskul; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_ekskul
    ADD CONSTRAINT unique_student_ekskul UNIQUE (student_id, nama_ekskul);

--
-- Name: student_ekskul fk_student_ekskul_student; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_ekskul
    ADD CONSTRAINT student_ekskul_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;

--
-- Name: teacher_absences teacher_absences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher_absences
    ADD CONSTRAINT teacher_absences_pkey PRIMARY KEY (id);

--
-- Name: teaching_journals teaching_journals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teaching_journals
    ADD CONSTRAINT teaching_journals_pkey PRIMARY KEY (id);

--
-- Name: student_attendances fk_student_attendances_journal; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_attendances
    ADD CONSTRAINT student_attendances_teaching_journal_id_fkey FOREIGN KEY (teaching_journal_id) REFERENCES public.teaching_journals(id) ON DELETE CASCADE;

--
-- Name: student_attendances fk_student_attendances_student; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_attendances
    ADD CONSTRAINT student_attendances_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;

--
-- Name: teaching_schedules teaching_schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teaching_schedules
    ADD CONSTRAINT teaching_schedules_pkey PRIMARY KEY (id);

--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);

--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;

--
-- Name: TABLE bk_records; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.bk_records TO anon;
GRANT ALL ON TABLE public.bk_records TO authenticated;
GRANT ALL ON TABLE public.bk_records TO service_role;

--
-- Name: SEQUENCE bk_records_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.bk_records_id_seq TO anon;
GRANT ALL ON SEQUENCE public.bk_records_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.bk_records_id_seq TO service_role;

--
-- Name: TABLE bk_sesi_lanjutan; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.bk_sesi_lanjutan TO anon;
GRANT ALL ON TABLE public.bk_sesi_lanjutan TO authenticated;
GRANT ALL ON TABLE public.bk_sesi_lanjutan TO service_role;

--
-- Name: SEQUENCE bk_sesi_lanjutan_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.bk_sesi_lanjutan_id_seq TO anon;
GRANT ALL ON SEQUENCE public.bk_sesi_lanjutan_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.bk_sesi_lanjutan_id_seq TO service_role;

--
-- Name: TABLE extracurricular_journals; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.extracurricular_journals TO anon;
GRANT ALL ON TABLE public.extracurricular_journals TO authenticated;
GRANT ALL ON TABLE public.extracurricular_journals TO service_role;

--
-- Name: SEQUENCE extracurricular_journals_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.extracurricular_journals_id_seq TO anon;
GRANT ALL ON SEQUENCE public.extracurricular_journals_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.extracurricular_journals_id_seq TO service_role;

--
-- Name: TABLE extracurricular_members; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.extracurricular_members TO anon;
GRANT ALL ON TABLE public.extracurricular_members TO authenticated;
GRANT ALL ON TABLE public.extracurricular_members TO service_role;

--
-- Name: SEQUENCE extracurricular_members_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.extracurricular_members_id_seq TO anon;
GRANT ALL ON SEQUENCE public.extracurricular_members_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.extracurricular_members_id_seq TO service_role;

--
-- Name: TABLE extracurricular_scores; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.extracurricular_scores TO anon;
GRANT ALL ON TABLE public.extracurricular_scores TO authenticated;
GRANT ALL ON TABLE public.extracurricular_scores TO service_role;

--
-- Name: SEQUENCE extracurricular_scores_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.extracurricular_scores_id_seq TO anon;
GRANT ALL ON SEQUENCE public.extracurricular_scores_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.extracurricular_scores_id_seq TO service_role;

--
-- Name: TABLE journal_student_logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.journal_student_logs TO anon;
GRANT ALL ON TABLE public.journal_student_logs TO authenticated;
GRANT ALL ON TABLE public.journal_student_logs TO service_role;

--
-- Name: SEQUENCE journal_student_logs_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.journal_student_logs_id_seq TO anon;
GRANT ALL ON SEQUENCE public.journal_student_logs_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.journal_student_logs_id_seq TO service_role;

--
-- Name: TABLE master_pelanggarans; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.master_pelanggarans TO anon;
GRANT ALL ON TABLE public.master_pelanggarans TO authenticated;
GRANT ALL ON TABLE public.master_pelanggarans TO service_role;

--
-- Name: SEQUENCE master_pelanggarans_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.master_pelanggarans_id_seq TO anon;
GRANT ALL ON SEQUENCE public.master_pelanggarans_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.master_pelanggarans_id_seq TO service_role;

--
-- Name: TABLE profiles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profiles TO anon;
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;

--
-- Name: SEQUENCE profiles_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.profiles_id_seq TO anon;
GRANT ALL ON SEQUENCE public.profiles_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.profiles_id_seq TO service_role;

--
-- Name: TABLE student_attendances; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.student_attendances TO anon;
GRANT ALL ON TABLE public.student_attendances TO authenticated;
GRANT ALL ON TABLE public.student_attendances TO service_role;

--
-- Name: SEQUENCE student_attendances_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.student_attendances_id_seq TO anon;
GRANT ALL ON SEQUENCE public.student_attendances_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.student_attendances_id_seq TO service_role;

--
-- Name: TABLE student_scores; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.student_scores TO anon;
GRANT ALL ON TABLE public.student_scores TO authenticated;
GRANT ALL ON TABLE public.student_scores TO service_role;

--
-- Name: SEQUENCE student_scores_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.student_scores_id_seq TO anon;
GRANT ALL ON SEQUENCE public.student_scores_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.student_scores_id_seq TO service_role;

--
-- Name: TABLE students; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.students TO anon;
GRANT ALL ON TABLE public.students TO authenticated;
GRANT ALL ON TABLE public.students TO service_role;

--
-- Name: SEQUENCE students_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.students_id_seq TO anon;
GRANT ALL ON SEQUENCE public.students_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.students_id_seq TO service_role;

--
-- Name: TABLE student_ekskul; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.student_ekskul TO anon;
GRANT ALL ON TABLE public.student_ekskul TO authenticated;
GRANT ALL ON TABLE public.student_ekskul TO service_role;

--
-- Name: TABLE teacher_absences; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.teacher_absences TO anon;
GRANT ALL ON TABLE public.teacher_absences TO authenticated;
GRANT ALL ON TABLE public.teacher_absences TO service_role;

--
-- Name: SEQUENCE teacher_absences_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.teacher_absences_id_seq TO anon;
GRANT ALL ON SEQUENCE public.teacher_absences_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.teacher_absences_id_seq TO service_role;

--
-- Name: TABLE teaching_journals; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.teaching_journals TO anon;
GRANT ALL ON TABLE public.teaching_journals TO authenticated;
GRANT ALL ON TABLE public.teaching_journals TO service_role;

--
-- Name: SEQUENCE teaching_journals_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.teaching_journals_id_seq TO anon;
GRANT ALL ON SEQUENCE public.teaching_journals_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.teaching_journals_id_seq TO service_role;

--
-- Name: TABLE teaching_schedules; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.teaching_schedules TO anon;
GRANT ALL ON TABLE public.teaching_schedules TO authenticated;
GRANT ALL ON TABLE public.teaching_schedules TO service_role;

--
-- Name: SEQUENCE teaching_schedules_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.teaching_schedules_id_seq TO anon;
GRANT ALL ON SEQUENCE public.teaching_schedules_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.teaching_schedules_id_seq TO service_role;

--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.users TO anon;
GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO service_role;

--
-- Name: SEQUENCE users_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.users_id_seq TO anon;
GRANT ALL ON SEQUENCE public.users_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.users_id_seq TO service_role;

--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;

--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--



--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;

--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--



--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;

--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--



--
-- PostgreSQL database dump complete
--



