--
-- PostgreSQL database dump
--

\restrict 7yD04fYfcBHZPAjIaOyFQJznu9Aw4MUrtxMgsjimYU7wdoNJqQFhgzK7Q9ncUAP

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.10 (Ubuntu 17.10-1.pgdg24.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.teaching_schedules DROP CONSTRAINT IF EXISTS teaching_schedules_pkey;
ALTER TABLE IF EXISTS ONLY public.teaching_journals DROP CONSTRAINT IF EXISTS teaching_journals_pkey;
ALTER TABLE IF EXISTS ONLY public.teacher_absences DROP CONSTRAINT IF EXISTS teacher_absences_pkey;
ALTER TABLE IF EXISTS ONLY public.students DROP CONSTRAINT IF EXISTS students_pkey;
ALTER TABLE IF EXISTS ONLY public.students DROP CONSTRAINT IF EXISTS students_nisn_key;
ALTER TABLE IF EXISTS ONLY public.student_scores DROP CONSTRAINT IF EXISTS student_scores_pkey;
ALTER TABLE IF EXISTS ONLY public.student_attendances DROP CONSTRAINT IF EXISTS student_attendances_pkey;
ALTER TABLE IF EXISTS ONLY public.profiles DROP CONSTRAINT IF EXISTS profiles_pkey;
ALTER TABLE IF EXISTS ONLY public.master_pelanggarans DROP CONSTRAINT IF EXISTS master_pelanggarans_pkey;
ALTER TABLE IF EXISTS ONLY public.journal_student_logs DROP CONSTRAINT IF EXISTS journal_student_logs_pkey;
ALTER TABLE IF EXISTS ONLY public.extracurricular_scores DROP CONSTRAINT IF EXISTS extracurricular_scores_pkey;
ALTER TABLE IF EXISTS ONLY public.extracurricular_members DROP CONSTRAINT IF EXISTS extracurricular_members_pkey;
ALTER TABLE IF EXISTS ONLY public.extracurricular_journals DROP CONSTRAINT IF EXISTS extracurricular_journals_pkey;
ALTER TABLE IF EXISTS ONLY public.bk_sesi_lanjutan DROP CONSTRAINT IF EXISTS bk_sesi_lanjutan_pkey;
ALTER TABLE IF EXISTS ONLY public.bk_records DROP CONSTRAINT IF EXISTS bk_records_pkey;
ALTER TABLE IF EXISTS public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.teaching_schedules ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.teaching_journals ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.teacher_absences ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.students ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.student_scores ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.student_attendances ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.profiles ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.master_pelanggarans ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.journal_student_logs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.extracurricular_scores ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.extracurricular_members ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.extracurricular_journals ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.bk_sesi_lanjutan ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.bk_records ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.users_id_seq;
DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.teaching_schedules_id_seq;
DROP TABLE IF EXISTS public.teaching_schedules;
DROP SEQUENCE IF EXISTS public.teaching_journals_id_seq;
DROP TABLE IF EXISTS public.teaching_journals;
DROP SEQUENCE IF EXISTS public.teacher_absences_id_seq;
DROP TABLE IF EXISTS public.teacher_absences;
DROP SEQUENCE IF EXISTS public.students_id_seq;
DROP TABLE IF EXISTS public.students;
DROP SEQUENCE IF EXISTS public.student_scores_id_seq;
DROP TABLE IF EXISTS public.student_scores;
DROP SEQUENCE IF EXISTS public.student_attendances_id_seq;
DROP TABLE IF EXISTS public.student_attendances;
DROP SEQUENCE IF EXISTS public.profiles_id_seq;
DROP TABLE IF EXISTS public.profiles;
DROP SEQUENCE IF EXISTS public.master_pelanggarans_id_seq;
DROP TABLE IF EXISTS public.master_pelanggarans;
DROP SEQUENCE IF EXISTS public.journal_student_logs_id_seq;
DROP TABLE IF EXISTS public.journal_student_logs;
DROP SEQUENCE IF EXISTS public.extracurricular_scores_id_seq;
DROP TABLE IF EXISTS public.extracurricular_scores;
DROP SEQUENCE IF EXISTS public.extracurricular_members_id_seq;
DROP TABLE IF EXISTS public.extracurricular_members;
DROP SEQUENCE IF EXISTS public.extracurricular_journals_id_seq;
DROP TABLE IF EXISTS public.extracurricular_journals;
DROP SEQUENCE IF EXISTS public.bk_sesi_lanjutan_id_seq;
DROP TABLE IF EXISTS public.bk_sesi_lanjutan;
DROP SEQUENCE IF EXISTS public.bk_records_id_seq;
DROP TABLE IF EXISTS public.bk_records;
DROP TYPE IF EXISTS public.verifikasi_enum;
DROP TYPE IF EXISTS public.role_enum;
DROP TYPE IF EXISTS public.kualitatif_enum;
DROP TYPE IF EXISTS public.kejadian_enum;
DROP TYPE IF EXISTS public.jk_enum;
DROP TYPE IF EXISTS public.izin_enum;
DROP SCHEMA IF EXISTS public;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: izin_enum; Type: TYPE; Schema: public; Owner: postgres
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
    'pks_kesiswaan'
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
    jam_ke character varying(255) NOT NULL,
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
-- Data for Name: bk_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bk_records (id, user_id, student_id, kelas, kategori_kasus, detail_kasus, tindakan_penanganan, status, created_at, updated_at) FROM stdin;
1	4	74	VIII A	Bersikap pasif/tidak memperhatikan pelajaran	di kelas waktu itu	teguran	Diproses	2026-07-07 10:57:18	2026-07-07 10:57:18
\.


--
-- Data for Name: bk_sesi_lanjutan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bk_sesi_lanjutan (id, bk_record_id, catatan_sesi, tindak_lanjut, status, created_at, updated_at) FROM stdin;
1	1	alhamdu	lillah	Tuntas	2026-07-07 11:47:01	\N
\.


--
-- Data for Name: extracurricular_journals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.extracurricular_journals (id, user_id, nama_ekskul, tanggal, aktivitas_kegiatan, jumlah_hadir, jumlah_sakit, jumlah_izin, jumlah_alfa, created_at, updated_at) FROM stdin;
1	2	Hortikultura	2026-07-07	jms	0	0	0	0	2026-07-07 08:29:19	2026-07-07 08:29:19
\.


--
-- Data for Name: extracurricular_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.extracurricular_members (id, nama_ekskul, student_id, created_at, updated_at) FROM stdin;
1	Hortikultura	80	2026-07-07 08:33:45	2026-07-07 15:33:45
\.


--
-- Data for Name: extracurricular_scores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.extracurricular_scores (id, user_id, student_id, nama_ekskul, nilai_kualitatif, catatan_pembinaan, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: journal_student_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.journal_student_logs (id, teaching_journal_id, student_id, jenis_kejadian, catatan_kejadian, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: master_pelanggarans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) FROM stdin;
173	sangat berat	Membawa senjata tajam/senjata api	100	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
174	sangat berat	Terlibat perkelahian massal (tawuran)	100	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
175	sangat berat	Menjadi provokator kerusuhan	100	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
176	sangat berat	Menggunakan, menyimpan, mengedarkan narkoba/miras	100	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
177	sangat berat	Melakukan pencurian besar	100	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
178	sangat berat	Melakukan kekerasan fisik yang membahayakan	100	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
179	sangat berat	Melakukan tindakan asusila (persetubuhan/perkosaan)	100	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
180	sangat berat	Mengandung, menghamili	100	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
181	sangat berat	Membuat atau menyebar konten pornografi	100	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
182	sangat berat	Membully secara sistematis (fisik/psikis/siber) berat	100	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
183	berat	Membawa rokok/vape ke sekolah	90	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
184	berat	Menghisap rokok/vape di lingkungan sekolah	90	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
185	berat	Menyebar ujaran kebencian atau fitnah	90	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
186	berat	Menyebarkan hoaks yang merugikan sekolah/guru	90	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
187	berat	Menghina atau mengancam guru/karyawan	90	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
188	berat	Melakukan perundungan berat (fisik/psikis)	85	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
189	berat	Membobol akun media sosial orang lain	85	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
190	berat	Merusak properti sekolah secara sengaja	80	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
191	berat	Membawa bahan peledak/petasan	80	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
192	berat	Membawa/menggunakan kartu judi	80	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
193	berat	Membawa alat atau barang ilegal	80	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
194	berat	Keluar dari lingkungan sekolah tanpa izin	70	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
195	berat	Membolos lebih dari 3 hari berturut-turut	70	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
196	berat	Menyebarkan video tidak senonoh	70	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
197	berat	Menghina suku, ras, agama (SARA)	70	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
198	sedang	Membully secara verbal/social	25	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
199	sedang	Mengendarai sepeda motor	25	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
200	sedang	Berkata kasar pada guru/karyawan	25	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
201	sedang	Menerobos pagar sekolah	25	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
202	sedang	Terlambat datang lebih dari 3x dalam seminggu	25	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
203	sedang	Membolos 1–2 hari	25	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
204	sedang	Berduaan dengan lawan jenis di tempat sepi (Berpacaran)	25	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
205	sedang	Menonton/membuka situs pornografi	25	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
206	sedang	Membawa HP tanpa izin	25	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
207	sedang	Bermain game saat pelajaran berlangsung	25	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
208	sedang	Melakukan pemalakan uang/makanan terhadap teman	25	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
209	sedang	Tidur di kelas berulang kali	20	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
210	sedang	Meludah/membuang sampah sembarangan	20	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
211	sedang	Tidak melaksanakan salat zuhur di sekolah	20	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
212	sedang	Tidak mengikuti kegiatan upacara	20	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
213	sedang	Tidak masuk tanpa keterangan (1 hari)	20	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
214	sedang	Menggunakan media sosial untuk menghina teman	20	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
215	ringan	Terlambat datang ke sekolah (1–2 kali)	15	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
216	ringan	Tidak mengenakan atribut lengkap seragam	15	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
217	ringan	Tidak membawa perlengkapan sekolah	15	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
218	ringan	Merusak/menghilangkan fasilitas kelas	15	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
219	ringan	Membuat gaduh di kelas	15	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
220	ringan	Tidak menjaga kebersihan kelas	15	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
221	ringan	Memotong rambut tidak sesuai aturan	15	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
222	ringan	Tidak mengikuti kegiatan kebersihan	15	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
223	ringan	Membawa barang tidak sesuai ketentuan	15	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
224	ringan	Meminjam barang tanpa izin	15	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
225	ringan	Menyontek saat ulangan	15	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
226	ringan	Makan di kelas tanpa izin	15	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
227	ringan	Duduk tidak sopan di kelas	15	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
228	ringan	Tidak mengerjakan PR	15	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
229	ringan	Berjalan di lorong saat pelajaran	15	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
230	ringan	Keluar masuk kelas tanpa izin	15	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
231	ringan	Membuat keributan saat istirahat	10	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
232	ringan	Mengobrol saat guru menjelaskan	10	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
233	ringan	Tidak menyapa guru/karyawan	10	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
234	ringan	Tidak masuk sekolah tanpa keterangan	10	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
235	ringan	Bermain saat pelajaran berlangsung	10	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
236	ringan	Membawa mainan ke sekolah	10	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
237	ringan	Membuat coretan di meja/kursi	10	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
238	ringan	Membawa kosmetik	10	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
239	ringan	Tidak masuk saat ekstrakurikuler	10	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
240	ringan	Tidur di kelas (1x)	10	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
241	ringan	Duduk di kursi / meja guru	10	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
242	ringan	Makan/minum saat pelajaran tanpa izin	10	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
243	ringan	Menaruh kaki di kursi	5	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
244	ringan	Bersikap pasif/tidak memperhatikan pelajaran	5	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
245	ringan	Menjawab guru dengan nada tinggi	5	2026-07-09 14:47:29.900279	2026-07-09 14:47:29.900279
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profiles (id, user_id, nama_lengkap, foto_profil, mata_pelajaran, is_wali_kelas, kelas_wali, is_guru_piket, nama_ekstrakurikuler, mapel, created_at, updated_at) FROM stdin;
1	2	Muhamad Sidik Heryana	\N	\N	f	VIII F	f	Hortikultura	Informatika	2026-06-29 10:42:43	2026-07-01 10:35:38
2	3	Dodoh, S.Ag	\N	\N	f	-	f	\N	Pendidikan Agama Islam	2026-07-02 20:06:54	2026-07-02 20:06:54
10	4	Lestari Indra Sumantri, S.Pd.Gr	\N	\N	f	\N	f	\N	Bimbingan Konseling	2026-07-10 01:44:55	2026-07-10 01:44:58
\.


--
-- Data for Name: student_attendances; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.student_attendances (id, teaching_journal_id, student_id, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: student_scores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.student_scores (id, user_id, student_id, kelas, mapel, jenis_penilaian, nilai, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) FROM stdin;
371	3139831611	ADI HERMAWAN	L	VIII A	\N	\N	\N
372	3126470544	ADNAN DINURHIYANTO	L	VIII A	\N	\N	\N
373	3134697369	AHSAN POETRA NUR AHMAD	L	VIII A	\N	\N	\N
374	3133412576	ANA MARDHIYYAH	P	VIII A	\N	\N	\N
375	3132697150	AZKIYA ZAHROTUN NAFITSA	P	VIII A	\N	\N	\N
376	3132996167	DIMAS ADRIAN PRAYOGA	L	VIII A	\N	\N	\N
377	3134917380	DISI APRILIANI PUTRI	P	VIII A	\N	\N	\N
378	3123747441	FAJRI NURFAUJAN	L	VIII A	\N	\N	\N
379	0124690698	HAMZA IZZATUL HAQQ	L	VIII A	\N	\N	\N
380	0133419142	INAYA RAFA APRILIA	P	VIII A	\N	\N	\N
381	3135994500	JULFAN NURFADILAH	L	VIII A	\N	\N	\N
382	3124550110	KAYLA AZ-ZAHRA DESIREE	P	VIII A	\N	\N	\N
383	3129637864	LILIS ALISA	P	VIII A	\N	\N	\N
384	0126295852	M SYAFIL KAAFIY ABDILLAH	L	VIII A	\N	\N	\N
385	3122891830	MUHAMAD AZKA FAEYZA	L	VIII A	\N	\N	\N
386	3133344959	MUHAMAD BASORI	L	VIII A	\N	\N	\N
387	3121218982	MUHAMAD RIPAL SURYA NURPADILAH	L	VIII A	\N	\N	\N
388	0124721650	MUHAMMAD ARFA ASHARI	L	VIII A	\N	\N	\N
389	3138720057	MUHAMMAD RIFAI	L	VIII A	\N	\N	\N
390	0139480918	MUHAMMAD RISWAN MAULANA	L	VIII A	\N	\N	\N
391	0128656981	NAILA KAIKO	P	VIII A	\N	\N	\N
392	0138339868	NANDA FEBRIAN	L	VIII A	\N	\N	\N
393	3128277278	NAZWA NAILA RAMADHANI	P	VIII A	\N	\N	\N
394	0129528211	NUNUNG RAHMAWATI	P	VIII A	\N	\N	\N
395	3124874317	QIESYA AUDHELIA SUHERMAN	P	VIII A	\N	\N	\N
396	3136780128	RAKA MUHAMAD REFANDI	L	VIII A	\N	\N	\N
397	3129015929	RAMA FADILLAH PUTRA	L	VIII A	\N	\N	\N
398	3126447215	RANDI HARDIYANSYAH	L	VIII A	\N	\N	\N
399	0123383011	RIZQI NURFATAH RAMADHANI	L	VIII A	\N	\N	\N
400	0128053515	SAFIRA SYAFTI MUMTAZ	P	VIII A	\N	\N	\N
401	0139963229	SITI ALYA QIBTIYAH	P	VIII A	\N	\N	\N
402	0125492685	SITI JULAEHA	P	VIII A	\N	\N	\N
403	0134389897	SYEPIRA SALSABILA NURMAULIDA PUTRI	P	VIII A	\N	\N	\N
404	0125895799	TANIA RAMADHANI	P	VIII A	\N	\N	\N
405	0138418078	TANTRI PUTRI VIARANA	P	VIII A	\N	\N	\N
406	0139667498	YANA	L	VIII A	\N	\N	\N
407	3132135911	AMELIA CITRA	P	VIII B	\N	\N	\N
408	3121816982	ANANDA FAIZAL NUGRAHA	L	VIII B	\N	\N	\N
409	0131608724	ANISA NUR FADILLAH	P	VIII B	\N	\N	\N
410	0129894371	AQILA PUTRI HUMAIRA	P	VIII B	\N	\N	\N
411	3126382346	AZILA ILHAM BAGJAYANTI PUTRI	P	VIII B	\N	\N	\N
412	0126125118	AZKA REZVAN ZAIDAN FADILLAH	L	VIII B	\N	\N	\N
413	0131040209	AZZAHRA MAULIDA	P	VIII B	\N	\N	\N
414	0139999103	DIVANA AZKA KHALINDA	P	VIII B	\N	\N	\N
415	0135645983	FAJAR KHOERUL ANAM	L	VIII B	\N	\N	\N
416	0136165318	FANJI NUR'RALAM	L	VIII B	\N	\N	\N
417	3134581071	FUZHI NOERHIKMAH	P	VIII B	\N	\N	\N
418	0123129990	HANIF MUHAMMAD NAFIS RAHADIAN	L	VIII B	\N	\N	\N
419	3125340275	INDRA ANDRIANSYAH	L	VIII B	\N	\N	\N
420	0126042605	LIVIA DELYA MICHELLE	P	VIII B	\N	\N	\N
421	0121302639	M. FAZRIL RIZKI	L	VIII B	\N	\N	\N
422	0137609782	MIKHA ARKHA FABYAN	L	VIII B	\N	\N	\N
423	0127555217	MUHAMAD FAIZ ZOPANSYAH	L	VIII B	\N	\N	\N
424	0125094932	MUHAMAD GILANG RAMADHANI	L	VIII B	\N	\N	\N
425	3128072256	MUHAMAD RIYADH SOLIHIN	L	VIII B	\N	\N	\N
426	0121938483	MUHAMMAD AZFAR ALFARABI	L	VIII B	\N	\N	\N
427	3124706452	MUHAMMAD RIZQI RADITYA PRATAMA	L	VIII B	\N	\N	\N
428	0126417144	MUHAMMAD SYAFIK AQUILLA	L	VIII B	\N	\N	\N
429	3126519663	RAFIANDRA ADITHYA PUTERA BAHARI	L	VIII B	\N	\N	\N
430	0125617061	RANDIKA PRATAMA	L	VIII B	\N	\N	\N
431	0124751512	RESTRY MEZALUNA RABUNDA	P	VIII B	\N	\N	\N
432	0125663183	RESTU BAYU PAMUNGKAS	L	VIII B	\N	\N	\N
433	3122905558	ROHAENI	P	VIII B	\N	\N	\N
434	3133295578	SALSABILA MEIDINA PUTRI	P	VIII B	\N	\N	\N
435	3134023639	SALWA SALSAS BILA	P	VIII B	\N	\N	\N
436	3134953256	SINTIYA RATNASARI	P	VIII B	\N	\N	\N
437	3124309017	SITI MAYSAROH NURNOVIANTI	P	VIII B	\N	\N	\N
438	0121737666	SITI NAZWA KARTIKA SARI	P	VIII B	\N	\N	\N
439	3138754233	SITI NURMANIAH	P	VIII B	\N	\N	\N
440	0135299151	SYAFIRA YASMIN AULIA	P	VIII B	\N	\N	\N
441	3125917422	SYIVA BAYU ZAHRANI	P	VIII B	\N	\N	\N
442	3128071608	TEGAR PRASETYO	L	VIII B	\N	\N	\N
443	0135673888	YASMIN LAILATUL RAHMAT	P	VIII B	\N	\N	\N
444	3137565900	ADITYA NUR WAHYUDIN	L	VIII C	\N	\N	\N
445	0126752943	ADLY FAHRI EDIANSYAH	L	VIII C	\N	\N	\N
446	3134899272	ALESHA AZZAHRA MOHAMMED	P	VIII C	\N	\N	\N
447	0123298379	ALIFA SANIA AGUSTIN	P	VIII C	\N	\N	\N
448	0126175177	ANANDA PUTRI RIZKYA	P	VIII C	\N	\N	\N
449	3133262837	DELIMA MARSYA KIRANA	P	VIII C	\N	\N	\N
450	0123256742	DE TRIA FARAH KHAERUNNISA	P	VIII C	\N	\N	\N
451	3131438564	DIAN SOLAHUDIN	L	VIII C	\N	\N	\N
452	0115648556	DUDI SUHENDI	L	VIII C	\N	\N	\N
453	0121013626	EUGENIA AISYAH PUTRI	P	VIII C	\N	\N	\N
454	3131133899	FARHAN SYAQI ELRAFIF	L	VIII C	\N	\N	\N
455	0124707308	FATURRAHMAN	L	VIII C	\N	\N	\N
456	3118502577	GADIZA PUTRI CANTIKA	P	VIII C	\N	\N	\N
457	0127042173	GHANIA RAMADHANI	P	VIII C	\N	\N	\N
458	0123812390	HANIPAN	L	VIII C	\N	\N	\N
459	0128774255	JANNATUL MA'WAL HUSNA SYA'BANI	P	VIII C	\N	\N	\N
460	3124193829	LULU HIDAYATUL ULA	P	VIII C	\N	\N	\N
461	0127902156	MUHAMAD FARHAN SAPUTRA	L	VIII C	\N	\N	\N
462	0127730988	MUHAMAD HASBI FAUZAN	L	VIII C	\N	\N	\N
463	3131727070	MUHAMAD RAFA ANUGRAH	L	VIII C	\N	\N	\N
464	0123386696	MUHAMMAD AJI PANGESTU	L	VIII C	\N	\N	\N
465	3125370055	MUHAMMAD DHEVAN ARRO'UUF	L	VIII C	\N	\N	\N
466	3123720205	MUHAMMAD FIRMANSYAH	L	VIII C	\N	\N	\N
467	0137301486	MUHAMMAD HIBAR AKHTAR	L	VIII C	\N	\N	\N
468	0123021119	MUTIARA HABIBAH YASIN	P	VIII C	\N	\N	\N
470	0131227398	RAFKA OKTARA	L	VIII C	\N	\N	\N
469	0123225058	NIZAR HERDIANSYAH	L	VIII C	\N	\N	\N
473	0137833393	RAZA HAIDANUSIDDIQ ALFARIZY	L	VIII C	\N	\N	\N
477	3122417652	YUFIKA MAULINA	P	VIII C	\N	\N	\N
481	3121630653	ANISA FITRIYANI	P	VIII D	\N	\N	\N
485	0133945956	DEANDRA SHANUM ARSYILA	P	VIII D	\N	\N	\N
489	3129359771	IQRAM DZIKRI MUDZAKY	L	VIII D	\N	\N	\N
493	3139831500	MAULANA SAEPULOH	L	VIII D	\N	\N	\N
497	0138152143	MUHAMMAD DZAKWAN FAEYZA ALKHALIFI	L	VIII D	\N	\N	\N
501	0138578208	NATASYA MAULIDA	P	VIII D	\N	\N	\N
505	3139508610	NIZAM FEBRIAN SUHENDAR	L	VIII D	\N	\N	\N
509	3122081371	RIFKI RAMDANI	L	VIII D	\N	\N	\N
513	3133484617	SYIFA PUTRI AZZAHRA	P	VIII D	\N	\N	\N
517	0127661375	ANISA SHALIHA RAIHANAH	P	VIII E	\N	\N	\N
521	3134355019	DEVA APRILYA ANDINIE	P	VIII E	\N	\N	\N
525	3124220577	HAYKAL IBRAHIM	L	VIII E	\N	\N	\N
529	3136920954	MUHAMMAD FAIZAN	L	VIII E	\N	\N	\N
533	3138974705	MUTIA HARDIANSYAH	P	VIII E	\N	\N	\N
537	3139323595	NURUL MAULIDA	P	VIII E	\N	\N	\N
541	0126067503	RAYHAN FIRMANSYAH	L	VIII E	\N	\N	\N
545	3137650721	RISKA NAYSILA AYUNDA	P	VIII E	\N	\N	\N
549	0131897982	TRI PUTRI MULYANI	P	VIII E	\N	\N	\N
553	3129559481	ANISSA FITALIA YUWANSIH	P	VIII F	\N	\N	\N
557	3121171812	DHEA RACHMAWATI	P	VIII F	\N	\N	\N
561	0127681369	IKHSAN WAHYUDIN ALFARIDZI	L	VIII F	\N	\N	\N
565	0138543636	MIKAYLA SAGITA PUTRI	P	VIII F	\N	\N	\N
569	3123548310	MUHAMMAD FADIL AKMAL	L	VIII F	\N	\N	\N
573	0125318815	NAYLA SITI KHOERUNNISA	P	VIII F	\N	\N	\N
577	0125930700	RASYID CAISAR RAMADANI	L	VIII F	\N	\N	\N
581	3126691802	SILVI NUR FAUZIAH	P	VIII F	\N	\N	\N
585	3134497501	ZAHRAN MAULID ADYATMA	L	VIII F	\N	\N	\N
589	3137860665	AULIA RAHMAH	P	VIII G	\N	\N	\N
593	0126417824	FAJAR MAULANA HAMDANI	L	VIII G	\N	\N	\N
597	0122660749	IRMA ZAHROTUSSYITA	P	VIII G	\N	\N	\N
601	0128908794	MOCHAMAD IKHSAN OKTAVIAN	L	VIII G	\N	\N	\N
605	0126906124	MUHAMMAD FADILAH ALIMUDIN	L	VIII G	\N	\N	\N
609	3138945153	NADHIFA LATISYA SURIATNA	P	VIII G	\N	\N	\N
613	0127613064	RAFKA ZAIDAN AL TSANY	L	VIII G	\N	\N	\N
617	0136427723	RIZKI YUSUF HAWARI	L	VIII G	\N	\N	\N
620	0137012283	SYAHRUL ALAM FATURAHMAN	L	VIII G	\N	\N	\N
623	3125378076	ABDUL JABBAR	L	VIII H	\N	\N	\N
627	0139721771	AYU MAULIDA SALIMAH	P	VIII H	\N	\N	\N
631	0131849901	HAIKAL MANDALA PUTRA	L	VIII H	\N	\N	\N
635	3121562445	LUCKY RAMADHAN	L	VIII H	\N	\N	\N
639	0139282839	MUHAMMAD FAZRI MAULANA	L	VIII H	\N	\N	\N
643	0139333779	NANDA REVA ELVINA	P	VIII H	\N	\N	\N
647	3137368377	PATIMATU ZAHRO	P	VIII H	\N	\N	\N
651	3121538697	RIZKY MUHAMAD RAMADHANI	L	VIII H	\N	\N	\N
655	3123153568	SITI SAYYIDAH NURAULIA	P	VIII H	\N	\N	\N
471	3123552020	RANIA PERTIWI	P	VIII C	\N	\N	\N
475	3129175656	RISMA	P	VIII C	\N	\N	\N
479	0133327935	ZANE ANKE ALETHA RAMADHANI	P	VIII C	\N	\N	\N
483	0128387415	ASDAN MISBAHUL AKROMI	L	VIII D	\N	\N	\N
487	3122088947	GILANG PRATAMA	L	VIII D	\N	\N	\N
491	3120432610	KYANDRA GHASSANI AISYAH RAMDAN	P	VIII D	\N	\N	\N
495	3133769392	M. IRVANI ALGHIFARI	L	VIII D	\N	\N	\N
499	0138573687	MUHAMMAD IQBAL HERMANSYAH	L	VIII D	\N	\N	\N
503	0129368311	NADIYYA CAHAYA SALSABILA	P	VIII D	\N	\N	\N
507	3130358140	RAYI MUHAMAD REFANDI	L	VIII D	\N	\N	\N
511	0123878677	SRI AINI ANATA	P	VIII D	\N	\N	\N
515	0137521821	YULIA AMIRRANTI	P	VIII D	\N	\N	\N
519	0131397258	ARIZAL HANIF NURIHSAN	L	VIII E	\N	\N	\N
523	3135756427	GHANI HAWARI	L	VIII E	\N	\N	\N
527	0128236414	MUHAMAD NAZWAR	L	VIII E	\N	\N	\N
531	0136961281	MUHAMMAD ZAIDAN HAKIM	L	VIII E	\N	\N	\N
535	3126488293	NAZWA AYNI SIHAB	P	VIII E	\N	\N	\N
539	0121498106	RAISA NUR HANIFA	P	VIII E	\N	\N	\N
543	0123099045	RINA ZAHROTU ASYITA	P	VIII E	\N	\N	\N
547	3137368405	SARAH RAISYA FUTRI	P	VIII E	\N	\N	\N
551	3126866626	ZAHIRA RAMADHANI ANDANINGGAR	P	VIII E	\N	\N	\N
555	3136135078	ARSILA SALHA KOMARUDIN	P	VIII F	\N	\N	\N
559	3126382445	EMAN SULAEMAN	L	VIII F	\N	\N	\N
563	3134736586	IRMA PUSPITA SARI	P	VIII F	\N	\N	\N
567	3123472030	MOHAMAD NAGHIB ANNAUFAL	L	VIII F	\N	\N	\N
571	3138817036	M. WAFI ATHMAR	L	VIII F	\N	\N	\N
575	0124411937	RAEESA AQILAH PURNAMA	P	VIII F	\N	\N	\N
579	3136278933	RIYAD AKROM	L	VIII F	\N	\N	\N
583	0139032396	SUCI ADZRA HASNADINATA	P	VIII F	\N	\N	\N
587	0134551810	ANANDA FITRI LIYANI	P	VIII G	\N	\N	\N
591	0129893174	DIENDILOVIA ALFALAH	P	VIII G	\N	\N	\N
595	0127684093	GRACIA PUTRI RAHMADANI	P	VIII G	\N	\N	\N
599	3129753764	KELVIN JULIO	L	VIII G	\N	\N	\N
603	3121569957	MOHAMMAD WISNU KURNIA	L	VIII G	\N	\N	\N
607	0126045573	MUHAMMAD RAMDHAN MUBAROK	L	VIII G	\N	\N	\N
611	0128286991	NURI APRILIANI	P	VIII G	\N	\N	\N
615	0125832692	RAZKA ALFITRAH USMANI	L	VIII G	\N	\N	\N
621	0125497167	WENDI ARDIANSAH	L	VIII G	\N	\N	\N
625	0136007198	ANITA PUTRI ANGGRAENI	P	VIII H	\N	\N	\N
629	3120074639	DINDA SYARIFAH MUDAIM	P	VIII H	\N	\N	\N
633	3135218813	JULAIKA NURSAIDAH	P	VIII H	\N	\N	\N
637	3124187774	MUHAMAD ABDAN ROJABI	L	VIII H	\N	\N	\N
641	3129077163	MUHAMMAD REZKI PRATAMA	L	VIII H	\N	\N	\N
645	0139377332	NAZWA AULIA MEIDINA	P	VIII H	\N	\N	\N
649	3122000079	RAMA HAIKAL AGUSTIN	L	VIII H	\N	\N	\N
653	3137611503	SILPA NURUL AENI	P	VIII H	\N	\N	\N
657	3137962200	WIDA ADAWIAH	P	VIII H	\N	\N	\N
472	0131479087	RAPA HAERUL FAZRI	L	VIII C	\N	\N	\N
476	3128597495	ROSSI EVRIYODA SULTON	L	VIII C	\N	\N	\N
480	3136202767	ADZRA SAKHA ARIEFIN MAULANA	L	VIII D	\N	\N	\N
484	3123913930	ASMIL MAULANA	L	VIII D	\N	\N	\N
488	3125180312	GINA NURUL AIDA	P	VIII D	\N	\N	\N
492	0122772358	LUKI RAHMAT HIDAYAT	L	VIII D	\N	\N	\N
496	3123736626	MUHAMAD SYAEBANI	L	VIII D	\N	\N	\N
500	0133467950	MUHAMMAD KHAIRU FATHIR	L	VIII D	\N	\N	\N
504	3135303001	NAFIZA AZ-ZAHRA	P	VIII D	\N	\N	\N
508	0126390168	REDI ISKANDAR	L	VIII D	\N	\N	\N
512	0128797361	SRI RAHAYU	P	VIII D	\N	\N	\N
516	0126254433	AHMAD ZAENAL MUSLIM	L	VIII E	\N	\N	\N
520	3125749504	BAYU PUTRA HARIYANTO	L	VIII E	\N	\N	\N
524	0121077603	GIAN FATUROHMAN	L	VIII E	\N	\N	\N
528	0122859276	MUHAMMAD ERDI FERDIAN	L	VIII E	\N	\N	\N
532	0133069611	MUHAMMAD ZAKI FAKHRUDIN	L	VIII E	\N	\N	\N
536	0137758616	NOVI REVA ELVINA	P	VIII E	\N	\N	\N
540	0122434945	RAYAN ANTONI	L	VIII E	\N	\N	\N
544	3124252904	RIPKA MA'RIFATUZZAKIAH	P	VIII E	\N	\N	\N
548	0132073851	SENA ATHALLAH PUTRA	L	VIII E	\N	\N	\N
552	3121705757	ABDEE RAYI INFI RAMDHANI	L	VIII F	\N	\N	\N
556	0128867597	ASSLA SOFIYATUL AZQYA	P	VIII F	\N	\N	\N
560	0121276753	FAISAL AZMI SAFARI	L	VIII F	\N	\N	\N
564	0129065512	KIKI MUHAMAD PADILAH	L	VIII F	\N	\N	\N
568	3136707648	MUHAMAD RAMLAN	L	VIII F	\N	\N	\N
572	3124842975	NAEFA AGNIA SALSABILLA	P	VIII F	\N	\N	\N
576	3123517466	RAISA SELVIANI	P	VIII F	\N	\N	\N
580	0123087804	SASTRI HAPSOH MAOID	P	VIII F	\N	\N	\N
584	3121372959	VUSPITA SALSABILA RAMADAN	P	VIII F	\N	\N	\N
588	3134427150	ASILLA MAULIDINA ANGGRAENI	P	VIII G	\N	\N	\N
592	3124273661	DIKA SABIAN	L	VIII G	\N	\N	\N
596	3139891586	HASBI RIPA'I	L	VIII G	\N	\N	\N
600	3134754677	MECCA SITI NURISLAMI	P	VIII G	\N	\N	\N
604	0124840194	MUHAMAD RIZKI	L	VIII G	\N	\N	\N
608	3131643552	NADA PAJIRA SALSABILA	P	VIII G	\N	\N	\N
612	0134042284	PUAN JEMBAR	P	VIII G	\N	\N	\N
616	3128952699	RISALA	P	VIII G	\N	\N	\N
619	0128408311	SINTA DEWI ASRI	P	VIII G	\N	\N	\N
622	3129708989	ZIKRA RAFA ASSIDIK	L	VIII G	\N	\N	\N
626	3136615103	ASYIFA NUR AZIZAH	P	VIII H	\N	\N	\N
630	0123965008	FAJAR RIFKI ADITYA	L	VIII H	\N	\N	\N
634	0124741847	KENZIE AL-HABSY ISMAIL	L	VIII H	\N	\N	\N
638	0122450161	MUHAMMAD ADZAN MANSYUR	L	VIII H	\N	\N	\N
642	0136020385	NAFISA SITI ELFI YANI	P	VIII H	\N	\N	\N
646	3124797192	NOVIKA MUNAHILAH	P	VIII H	\N	\N	\N
650	0126074272	RAZQA LABIB MAULANA	L	VIII H	\N	\N	\N
654	3127305209	SITI AISYAH	P	VIII H	\N	\N	\N
658	3133443033	ZOHARA RAMADHANI	P	VIII H	\N	\N	\N
474	0136993292	REZA ANGGARA HIDAYAT	L	VIII C	\N	\N	\N
478	0128320340	ZAHIRA AISYI KAMILIA	P	VIII C	\N	\N	\N
482	0125794509	ANNISA RAHMA KURNIA	P	VIII D	\N	\N	\N
486	0129137962	ELSA SBASTIAN	P	VIII D	\N	\N	\N
490	0134883750	KEISHA NURI DZAKIYA	P	VIII D	\N	\N	\N
494	0121949289	MIKHAILA SHAKILA AZZAKIA	P	VIII D	\N	\N	\N
498	3114594512	MUHAMMAD GINANJAR AFIANDRI	L	VIII D	\N	\N	\N
502	0138952000	MUHAMMAD ZAKI ALIYUL HIKAM	L	VIII D	\N	\N	\N
506	3122495655	RAIHAN RAMADHAN PUTRA	L	VIII D	\N	\N	\N
510	0138999276	SANA BAYU ATISNA	L	VIII D	\N	\N	\N
514	0121005474	TASYA NAFSHAH NAIDA	P	VIII D	\N	\N	\N
518	0131520335	ARISHA INDA MUSTIKA	P	VIII E	\N	\N	\N
522	0137635688	DEWI FEBRIANI	P	VIII E	\N	\N	\N
526	3139885955	MARSHA ADELIA	P	VIII E	\N	\N	\N
530	3124169085	MUHAMMAD MAHMUL SIROJ ACHMAD	L	VIII E	\N	\N	\N
534	0122301660	NAYLA NUR ARINI PUTRI	P	VIII E	\N	\N	\N
538	0137303390	PARAS FADILAH PRATAMA	L	VIII E	\N	\N	\N
542	0122809072	RAZAN KALANI KARIM	L	VIII E	\N	\N	\N
546	0125946380	SANDI SULAEMAN	L	VIII E	\N	\N	\N
550	0136218907	YULIAHANI RAHMAWATI	P	VIII E	\N	\N	\N
554	0126864200	ARJUN KAHFI ARIPIN	L	VIII F	\N	\N	\N
558	0123431409	DHIYA DHIFANI ANATASYA	P	VIII F	\N	\N	\N
562	3126031106	IQMAL AZHAR IRAWAN	L	VIII F	\N	\N	\N
566	0122286191	MOCHAMAD FAUZI SETIAWAN	L	VIII F	\N	\N	\N
570	3133311511	MUHAMMAD GIAS RAMDANI	L	VIII F	\N	\N	\N
574	3127743351	PEBRIANTI NURJAMAMI	P	VIII F	\N	\N	\N
578	3139147562	RIQKY ADITYA PUTRA SURYA	L	VIII F	\N	\N	\N
582	3129110850	SITI SARAH	P	VIII F	\N	\N	\N
586	3122722539	ZAHRA SALSABILA	P	VIII F	\N	\N	\N
590	0123897562	AZZAHRA TUNNISA	P	VIII G	\N	\N	\N
594	3144307097	GILANG RIZQI PRATAMA	L	VIII G	\N	\N	\N
598	3123037142	JELITA SUCI MAHARANI	P	VIII G	\N	\N	\N
602	3136548680	MOCHAMMAD RIFQI ALFAIZIN ASSIDIQ	L	VIII G	\N	\N	\N
606	0122505408	MUHAMMAD KHOLIQ	L	VIII G	\N	\N	\N
610	3145106864	NASYILLA NURSYIFAUL QALBY	P	VIII G	\N	\N	\N
614	0132156688	RAISYA FATHINA NATAWIJAYA	P	VIII G	\N	\N	\N
618	0129000796	SHAZIA NISA SALSABILLA	P	VIII G	\N	\N	\N
624	3128211330	ALVIN SOLIHIN RAMDANI	L	VIII H	\N	\N	\N
628	0123121632	DIKY WAHYU PAMUNGKAS	L	VIII H	\N	\N	\N
632	3128334507	ILMI ARDIANSYAH	L	VIII H	\N	\N	\N
636	0131494795	MOHAMAD KARIM NASRI	L	VIII H	\N	\N	\N
640	3129261265	MUHAMMAD RADIAN	L	VIII H	\N	\N	\N
644	0125535714	NATASYA OKTAVIANI	P	VIII H	\N	\N	\N
648	0124217709	PUTRA AMANULLAH	L	VIII H	\N	\N	\N
652	3137605849	SAFFA DELISA ANZANI	P	VIII H	\N	\N	\N
656	3138093444	SYALMA NURIZKIYAH	P	VIII H	\N	\N	\N
\.


--
-- Data for Name: teacher_absences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teacher_absences (id, user_id, tanggal_absen, status_izin, alasan_detail, file_surat_keterangan, titipan_tugas_kelas, status_verifikasi, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: teaching_journals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teaching_journals (id, user_id, kelas, mata_pelajaran, jam_ke, materi_pembelajaran, catatan_kelas, created_at, updated_at) FROM stdin;
1	2	VIII A	Informatika	1-3	Test	\N	\N	\N
\.


--
-- Data for Name: teaching_schedules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teaching_schedules (id, user_id, mata_pelajaran, kelas, hari, jam_ke, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password, role, remember_token, created_at, updated_at) FROM stdin;
1	admin_spensawa	$2y$12$e6sZ90x6kDPWcICMpzitWu/sgD4KCpWxF6i0LwQZ9xwTg5JrgUYni	admin	\N	2026-06-29 10:42:42	2026-06-29 10:42:42
2	sidik_heryana	$2y$12$C1imO/hxdGSpkQ.pllQHjO/hy39cTX5udobMRxnbAewQ0GM1GNIhy	guru_mapel	\N	2026-06-29 10:42:43	2026-06-29 10:42:43
3	197310082000122001	$2y$12$B1F8RGBlIO68kpuFOTFrE.9bjvB3HLXTLfmYGS1BrbWDVmoFBBsUW	guru_mapel	\N	2026-07-02 20:06:54	2026-07-02 20:06:54
4	199406142020122003	guru123	guru_bk	\N	\N	\N
\.


--
-- Name: bk_records_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bk_records_id_seq', 1, true);


--
-- Name: bk_sesi_lanjutan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bk_sesi_lanjutan_id_seq', 1, true);


--
-- Name: extracurricular_journals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.extracurricular_journals_id_seq', 1, true);


--
-- Name: extracurricular_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.extracurricular_members_id_seq', 1, true);


--
-- Name: extracurricular_scores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.extracurricular_scores_id_seq', 1, false);


--
-- Name: journal_student_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.journal_student_logs_id_seq', 1, false);


--
-- Name: master_pelanggarans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.master_pelanggarans_id_seq', 245, true);


--
-- Name: profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.profiles_id_seq', 10, true);


--
-- Name: student_attendances_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.student_attendances_id_seq', 1, false);


--
-- Name: student_scores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.student_scores_id_seq', 1, false);


--
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.students_id_seq', 659, true);


--
-- Name: teacher_absences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teacher_absences_id_seq', 1, false);


--
-- Name: teaching_journals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teaching_journals_id_seq', 1, true);


--
-- Name: teaching_schedules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teaching_schedules_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 5, true);


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

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


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

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


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

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- PostgreSQL database dump complete
--

\unrestrict 7yD04fYfcBHZPAjIaOyFQJznu9Aw4MUrtxMgsjimYU7wdoNJqQFhgzK7Q9ncUAP

