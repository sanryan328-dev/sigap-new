-- Data for Name: bk_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.bk_records (id, user_id, student_id, kelas, kategori_kasus, detail_kasus, tindakan_penanganan, status, created_at, updated_at) VALUES (1, 4, 74, 'VIII A', 'Bersikap pasif/tidak memperhatikan pelajaran', 'di kelas waktu itu', 'teguran', 'Diproses', '2026-07-07 10:57:18', '2026-07-07 10:57:18');
--

-- Data for Name: bk_sesi_lanjutan; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.bk_sesi_lanjutan (id, bk_record_id, catatan_sesi, tindak_lanjut, status, created_at, updated_at) VALUES (1, 1, 'alhamdu', 'lillah', 'Tuntas', '2026-07-07 11:47:01', NULL);
--

-- Data for Name: extracurricular_journals; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.extracurricular_journals (id, user_id, nama_ekskul, tanggal, aktivitas_kegiatan, jumlah_hadir, jumlah_sakit, jumlah_izin, jumlah_alfa, created_at, updated_at) VALUES (1, 2, 'Hortikultura', '2026-07-07', 'jms', 0, 0, 0, 0, '2026-07-07 08:29:19', '2026-07-07 08:29:19');
--

-- Data for Name: extracurricular_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.extracurricular_members (id, nama_ekskul, student_id, created_at, updated_at) VALUES (1, 'Hortikultura', 80, '2026-07-07 08:33:45', '2026-07-07 15:33:45');
--

-- Data for Name: extracurricular_scores; Type: TABLE DATA; Schema: public; Owner: postgres
--

--

-- Data for Name: journal_student_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

--

-- Data for Name: master_pelanggarans; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (173, 'sangat berat', 'Membawa senjata tajam/senjata api', 100, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (174, 'sangat berat', 'Terlibat perkelahian massal (tawuran)', 100, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (175, 'sangat berat', 'Menjadi provokator kerusuhan', 100, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (176, 'sangat berat', 'Menggunakan, menyimpan, mengedarkan narkoba/miras', 100, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (177, 'sangat berat', 'Melakukan pencurian besar', 100, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (178, 'sangat berat', 'Melakukan kekerasan fisik yang membahayakan', 100, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (179, 'sangat berat', 'Melakukan tindakan asusila (persetubuhan/perkosaan)', 100, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (180, 'sangat berat', 'Mengandung, menghamili', 100, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (181, 'sangat berat', 'Membuat atau menyebar konten pornografi', 100, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (182, 'sangat berat', 'Membully secara sistematis (fisik/psikis/siber) berat', 100, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (183, 'berat', 'Membawa rokok/vape ke sekolah', 90, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (184, 'berat', 'Menghisap rokok/vape di lingkungan sekolah', 90, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (185, 'berat', 'Menyebar ujaran kebencian atau fitnah', 90, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (186, 'berat', 'Menyebarkan hoaks yang merugikan sekolah/guru', 90, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (187, 'berat', 'Menghina atau mengancam guru/karyawan', 90, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (188, 'berat', 'Melakukan perundungan berat (fisik/psikis)', 85, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (189, 'berat', 'Membobol akun media sosial orang lain', 85, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (190, 'berat', 'Merusak properti sekolah secara sengaja', 80, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (191, 'berat', 'Membawa bahan peledak/petasan', 80, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (192, 'berat', 'Membawa/menggunakan kartu judi', 80, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (193, 'berat', 'Membawa alat atau barang ilegal', 80, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (194, 'berat', 'Keluar dari lingkungan sekolah tanpa izin', 70, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (195, 'berat', 'Membolos lebih dari 3 hari berturut-turut', 70, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (196, 'berat', 'Menyebarkan video tidak senonoh', 70, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (197, 'berat', 'Menghina suku, ras, agama (SARA)', 70, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (198, 'sedang', 'Membully secara verbal/social', 25, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (199, 'sedang', 'Mengendarai sepeda motor', 25, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (200, 'sedang', 'Berkata kasar pada guru/karyawan', 25, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (201, 'sedang', 'Menerobos pagar sekolah', 25, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (202, 'sedang', 'Terlambat datang lebih dari 3x dalam seminggu', 25, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (203, 'sedang', 'Membolos 1–2 hari', 25, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (204, 'sedang', 'Berduaan dengan lawan jenis di tempat sepi (Berpacaran)', 25, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (205, 'sedang', 'Menonton/membuka situs pornografi', 25, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (206, 'sedang', 'Membawa HP tanpa izin', 25, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (207, 'sedang', 'Bermain game saat pelajaran berlangsung', 25, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (208, 'sedang', 'Melakukan pemalakan uang/makanan terhadap teman', 25, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (209, 'sedang', 'Tidur di kelas berulang kali', 20, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (210, 'sedang', 'Meludah/membuang sampah sembarangan', 20, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (211, 'sedang', 'Tidak melaksanakan salat zuhur di sekolah', 20, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (212, 'sedang', 'Tidak mengikuti kegiatan upacara', 20, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (213, 'sedang', 'Tidak masuk tanpa keterangan (1 hari)', 20, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (214, 'sedang', 'Menggunakan media sosial untuk menghina teman', 20, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (215, 'ringan', 'Terlambat datang ke sekolah (1–2 kali)', 15, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (216, 'ringan', 'Tidak mengenakan atribut lengkap seragam', 15, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (217, 'ringan', 'Tidak membawa perlengkapan sekolah', 15, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (218, 'ringan', 'Merusak/menghilangkan fasilitas kelas', 15, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (219, 'ringan', 'Membuat gaduh di kelas', 15, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (220, 'ringan', 'Tidak menjaga kebersihan kelas', 15, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (221, 'ringan', 'Memotong rambut tidak sesuai aturan', 15, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (222, 'ringan', 'Tidak mengikuti kegiatan kebersihan', 15, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (223, 'ringan', 'Membawa barang tidak sesuai ketentuan', 15, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (224, 'ringan', 'Meminjam barang tanpa izin', 15, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (225, 'ringan', 'Menyontek saat ulangan', 15, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (226, 'ringan', 'Makan di kelas tanpa izin', 15, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (227, 'ringan', 'Duduk tidak sopan di kelas', 15, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (228, 'ringan', 'Tidak mengerjakan PR', 15, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (229, 'ringan', 'Berjalan di lorong saat pelajaran', 15, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (230, 'ringan', 'Keluar masuk kelas tanpa izin', 15, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (231, 'ringan', 'Membuat keributan saat istirahat', 10, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (232, 'ringan', 'Mengobrol saat guru menjelaskan', 10, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (233, 'ringan', 'Tidak menyapa guru/karyawan', 10, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (234, 'ringan', 'Tidak masuk sekolah tanpa keterangan', 10, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (235, 'ringan', 'Bermain saat pelajaran berlangsung', 10, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (236, 'ringan', 'Membawa mainan ke sekolah', 10, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (237, 'ringan', 'Membuat coretan di meja/kursi', 10, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (238, 'ringan', 'Membawa kosmetik', 10, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (239, 'ringan', 'Tidak masuk saat ekstrakurikuler', 10, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (240, 'ringan', 'Tidur di kelas (1x)', 10, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (241, 'ringan', 'Duduk di kursi / meja guru', 10, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (242, 'ringan', 'Makan/minum saat pelajaran tanpa izin', 10, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (243, 'ringan', 'Menaruh kaki di kursi', 5, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (244, 'ringan', 'Bersikap pasif/tidak memperhatikan pelajaran', 5, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
INSERT INTO public.master_pelanggarans (id, kategori, jenis_kasus, bobot, created_at, updated_at) VALUES (245, 'ringan', 'Menjawab guru dengan nada tinggi', 5, '2026-07-09 14:47:29.900279', '2026-07-09 14:47:29.900279');
--

-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.profiles (id, user_id, nama_lengkap, foto_profil, mata_pelajaran, is_wali_kelas, kelas_wali, is_guru_piket, nama_ekstrakurikuler, mapel, created_at, updated_at) VALUES (1, 2, 'Muhamad Sidik Heryana', NULL, NULL, 'f', 'VIII F', 'f', 'Hortikultura', 'Informatika', '2026-06-29 10:42:43', '2026-07-01 10:35:38');
INSERT INTO public.profiles (id, user_id, nama_lengkap, foto_profil, mata_pelajaran, is_wali_kelas, kelas_wali, is_guru_piket, nama_ekstrakurikuler, mapel, created_at, updated_at) VALUES (2, 3, 'Dodoh, S.Ag', NULL, NULL, 'f', '-', 'f', NULL, 'Pendidikan Agama Islam', '2026-07-02 20:06:54', '2026-07-02 20:06:54');
INSERT INTO public.profiles (id, user_id, nama_lengkap, foto_profil, mata_pelajaran, is_wali_kelas, kelas_wali, is_guru_piket, nama_ekstrakurikuler, mapel, created_at, updated_at) VALUES (10, 4, 'Lestari Indra Sumantri, S.Pd.Gr', NULL, NULL, 'f', NULL, 'f', NULL, 'Bimbingan Konseling', '2026-07-10 01:44:55', '2026-07-10 01:44:58');
--

-- Data for Name: student_attendances; Type: TABLE DATA; Schema: public; Owner: postgres
--

--

-- Data for Name: student_scores; Type: TABLE DATA; Schema: public; Owner: postgres
--

--

-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (371, '3139831611', 'ADI HERMAWAN', 'L', 'VIII A', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (372, '3126470544', 'ADNAN DINURHIYANTO', 'L', 'VIII A', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (373, '3134697369', 'AHSAN POETRA NUR AHMAD', 'L', 'VIII A', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (374, '3133412576', 'ANA MARDHIYYAH', 'P', 'VIII A', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (375, '3132697150', 'AZKIYA ZAHROTUN NAFITSA', 'P', 'VIII A', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (376, '3132996167', 'DIMAS ADRIAN PRAYOGA', 'L', 'VIII A', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (377, '3134917380', 'DISI APRILIANI PUTRI', 'P', 'VIII A', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (378, '3123747441', 'FAJRI NURFAUJAN', 'L', 'VIII A', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (379, '0124690698', 'HAMZA IZZATUL HAQQ', 'L', 'VIII A', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (380, '0133419142', 'INAYA RAFA APRILIA', 'P', 'VIII A', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (381, '3135994500', 'JULFAN NURFADILAH', 'L', 'VIII A', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (382, '3124550110', 'KAYLA AZ-ZAHRA DESIREE', 'P', 'VIII A', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (383, '3129637864', 'LILIS ALISA', 'P', 'VIII A', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (384, '0126295852', 'M SYAFIL KAAFIY ABDILLAH', 'L', 'VIII A', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (385, '3122891830', 'MUHAMAD AZKA FAEYZA', 'L', 'VIII A', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (386, '3133344959', 'MUHAMAD BASORI', 'L', 'VIII A', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (387, '3121218982', 'MUHAMAD RIPAL SURYA NURPADILAH', 'L', 'VIII A', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (388, '0124721650', 'MUHAMMAD ARFA ASHARI', 'L', 'VIII A', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (389, '3138720057', 'MUHAMMAD RIFAI', 'L', 'VIII A', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (390, '0139480918', 'MUHAMMAD RISWAN MAULANA', 'L', 'VIII A', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (391, '0128656981', 'NAILA KAIKO', 'P', 'VIII A', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (392, '0138339868', 'NANDA FEBRIAN', 'L', 'VIII A', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (393, '3128277278', 'NAZWA NAILA RAMADHANI', 'P', 'VIII A', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (394, '0129528211', 'NUNUNG RAHMAWATI', 'P', 'VIII A', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (395, '3124874317', 'QIESYA AUDHELIA SUHERMAN', 'P', 'VIII A', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (396, '3136780128', 'RAKA MUHAMAD REFANDI', 'L', 'VIII A', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (397, '3129015929', 'RAMA FADILLAH PUTRA', 'L', 'VIII A', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (398, '3126447215', 'RANDI HARDIYANSYAH', 'L', 'VIII A', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (399, '0123383011', 'RIZQI NURFATAH RAMADHANI', 'L', 'VIII A', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (400, '0128053515', 'SAFIRA SYAFTI MUMTAZ', 'P', 'VIII A', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (401, '0139963229', 'SITI ALYA QIBTIYAH', 'P', 'VIII A', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (402, '0125492685', 'SITI JULAEHA', 'P', 'VIII A', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (403, '0134389897', 'SYEPIRA SALSABILA NURMAULIDA PUTRI', 'P', 'VIII A', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (404, '0125895799', 'TANIA RAMADHANI', 'P', 'VIII A', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (405, '0138418078', 'TANTRI PUTRI VIARANA', 'P', 'VIII A', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (406, '0139667498', 'YANA', 'L', 'VIII A', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (407, '3132135911', 'AMELIA CITRA', 'P', 'VIII B', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (408, '3121816982', 'ANANDA FAIZAL NUGRAHA', 'L', 'VIII B', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (409, '0131608724', 'ANISA NUR FADILLAH', 'P', 'VIII B', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (410, '0129894371', 'AQILA PUTRI HUMAIRA', 'P', 'VIII B', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (411, '3126382346', 'AZILA ILHAM BAGJAYANTI PUTRI', 'P', 'VIII B', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (412, '0126125118', 'AZKA REZVAN ZAIDAN FADILLAH', 'L', 'VIII B', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (413, '0131040209', 'AZZAHRA MAULIDA', 'P', 'VIII B', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (414, '0139999103', 'DIVANA AZKA KHALINDA', 'P', 'VIII B', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (415, '0135645983', 'FAJAR KHOERUL ANAM', 'L', 'VIII B', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (416, '0136165318', 'FANJI NUR''RALAM', 'L', 'VIII B', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (417, '3134581071', 'FUZHI NOERHIKMAH', 'P', 'VIII B', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (418, '0123129990', 'HANIF MUHAMMAD NAFIS RAHADIAN', 'L', 'VIII B', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (419, '3125340275', 'INDRA ANDRIANSYAH', 'L', 'VIII B', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (420, '0126042605', 'LIVIA DELYA MICHELLE', 'P', 'VIII B', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (421, '0121302639', 'M. FAZRIL RIZKI', 'L', 'VIII B', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (422, '0137609782', 'MIKHA ARKHA FABYAN', 'L', 'VIII B', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (423, '0127555217', 'MUHAMAD FAIZ ZOPANSYAH', 'L', 'VIII B', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (424, '0125094932', 'MUHAMAD GILANG RAMADHANI', 'L', 'VIII B', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (425, '3128072256', 'MUHAMAD RIYADH SOLIHIN', 'L', 'VIII B', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (426, '0121938483', 'MUHAMMAD AZFAR ALFARABI', 'L', 'VIII B', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (427, '3124706452', 'MUHAMMAD RIZQI RADITYA PRATAMA', 'L', 'VIII B', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (428, '0126417144', 'MUHAMMAD SYAFIK AQUILLA', 'L', 'VIII B', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (429, '3126519663', 'RAFIANDRA ADITHYA PUTERA BAHARI', 'L', 'VIII B', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (430, '0125617061', 'RANDIKA PRATAMA', 'L', 'VIII B', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (431, '0124751512', 'RESTRY MEZALUNA RABUNDA', 'P', 'VIII B', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (432, '0125663183', 'RESTU BAYU PAMUNGKAS', 'L', 'VIII B', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (433, '3122905558', 'ROHAENI', 'P', 'VIII B', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (434, '3133295578', 'SALSABILA MEIDINA PUTRI', 'P', 'VIII B', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (435, '3134023639', 'SALWA SALSAS BILA', 'P', 'VIII B', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (436, '3134953256', 'SINTIYA RATNASARI', 'P', 'VIII B', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (437, '3124309017', 'SITI MAYSAROH NURNOVIANTI', 'P', 'VIII B', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (438, '0121737666', 'SITI NAZWA KARTIKA SARI', 'P', 'VIII B', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (439, '3138754233', 'SITI NURMANIAH', 'P', 'VIII B', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (440, '0135299151', 'SYAFIRA YASMIN AULIA', 'P', 'VIII B', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (441, '3125917422', 'SYIVA BAYU ZAHRANI', 'P', 'VIII B', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (442, '3128071608', 'TEGAR PRASETYO', 'L', 'VIII B', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (443, '0135673888', 'YASMIN LAILATUL RAHMAT', 'P', 'VIII B', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (444, '3137565900', 'ADITYA NUR WAHYUDIN', 'L', 'VIII C', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (445, '0126752943', 'ADLY FAHRI EDIANSYAH', 'L', 'VIII C', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (446, '3134899272', 'ALESHA AZZAHRA MOHAMMED', 'P', 'VIII C', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (447, '0123298379', 'ALIFA SANIA AGUSTIN', 'P', 'VIII C', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (448, '0126175177', 'ANANDA PUTRI RIZKYA', 'P', 'VIII C', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (449, '3133262837', 'DELIMA MARSYA KIRANA', 'P', 'VIII C', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (450, '0123256742', 'DE TRIA FARAH KHAERUNNISA', 'P', 'VIII C', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (451, '3131438564', 'DIAN SOLAHUDIN', 'L', 'VIII C', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (452, '0115648556', 'DUDI SUHENDI', 'L', 'VIII C', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (453, '0121013626', 'EUGENIA AISYAH PUTRI', 'P', 'VIII C', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (454, '3131133899', 'FARHAN SYAQI ELRAFIF', 'L', 'VIII C', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (455, '0124707308', 'FATURRAHMAN', 'L', 'VIII C', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (456, '3118502577', 'GADIZA PUTRI CANTIKA', 'P', 'VIII C', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (457, '0127042173', 'GHANIA RAMADHANI', 'P', 'VIII C', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (458, '0123812390', 'HANIPAN', 'L', 'VIII C', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (459, '0128774255', 'JANNATUL MA''WAL HUSNA SYA''BANI', 'P', 'VIII C', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (460, '3124193829', 'LULU HIDAYATUL ULA', 'P', 'VIII C', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (461, '0127902156', 'MUHAMAD FARHAN SAPUTRA', 'L', 'VIII C', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (462, '0127730988', 'MUHAMAD HASBI FAUZAN', 'L', 'VIII C', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (463, '3131727070', 'MUHAMAD RAFA ANUGRAH', 'L', 'VIII C', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (464, '0123386696', 'MUHAMMAD AJI PANGESTU', 'L', 'VIII C', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (465, '3125370055', 'MUHAMMAD DHEVAN ARRO''UUF', 'L', 'VIII C', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (466, '3123720205', 'MUHAMMAD FIRMANSYAH', 'L', 'VIII C', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (467, '0137301486', 'MUHAMMAD HIBAR AKHTAR', 'L', 'VIII C', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (468, '0123021119', 'MUTIARA HABIBAH YASIN', 'P', 'VIII C', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (470, '0131227398', 'RAFKA OKTARA', 'L', 'VIII C', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (469, '0123225058', 'NIZAR HERDIANSYAH', 'L', 'VIII C', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (473, '0137833393', 'RAZA HAIDANUSIDDIQ ALFARIZY', 'L', 'VIII C', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (477, '3122417652', 'YUFIKA MAULINA', 'P', 'VIII C', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (481, '3121630653', 'ANISA FITRIYANI', 'P', 'VIII D', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (485, '0133945956', 'DEANDRA SHANUM ARSYILA', 'P', 'VIII D', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (489, '3129359771', 'IQRAM DZIKRI MUDZAKY', 'L', 'VIII D', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (493, '3139831500', 'MAULANA SAEPULOH', 'L', 'VIII D', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (497, '0138152143', 'MUHAMMAD DZAKWAN FAEYZA ALKHALIFI', 'L', 'VIII D', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (501, '0138578208', 'NATASYA MAULIDA', 'P', 'VIII D', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (505, '3139508610', 'NIZAM FEBRIAN SUHENDAR', 'L', 'VIII D', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (509, '3122081371', 'RIFKI RAMDANI', 'L', 'VIII D', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (513, '3133484617', 'SYIFA PUTRI AZZAHRA', 'P', 'VIII D', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (517, '0127661375', 'ANISA SHALIHA RAIHANAH', 'P', 'VIII E', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (521, '3134355019', 'DEVA APRILYA ANDINIE', 'P', 'VIII E', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (525, '3124220577', 'HAYKAL IBRAHIM', 'L', 'VIII E', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (529, '3136920954', 'MUHAMMAD FAIZAN', 'L', 'VIII E', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (533, '3138974705', 'MUTIA HARDIANSYAH', 'P', 'VIII E', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (537, '3139323595', 'NURUL MAULIDA', 'P', 'VIII E', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (541, '0126067503', 'RAYHAN FIRMANSYAH', 'L', 'VIII E', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (545, '3137650721', 'RISKA NAYSILA AYUNDA', 'P', 'VIII E', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (549, '0131897982', 'TRI PUTRI MULYANI', 'P', 'VIII E', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (553, '3129559481', 'ANISSA FITALIA YUWANSIH', 'P', 'VIII F', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (557, '3121171812', 'DHEA RACHMAWATI', 'P', 'VIII F', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (561, '0127681369', 'IKHSAN WAHYUDIN ALFARIDZI', 'L', 'VIII F', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (565, '0138543636', 'MIKAYLA SAGITA PUTRI', 'P', 'VIII F', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (569, '3123548310', 'MUHAMMAD FADIL AKMAL', 'L', 'VIII F', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (573, '0125318815', 'NAYLA SITI KHOERUNNISA', 'P', 'VIII F', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (577, '0125930700', 'RASYID CAISAR RAMADANI', 'L', 'VIII F', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (581, '3126691802', 'SILVI NUR FAUZIAH', 'P', 'VIII F', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (585, '3134497501', 'ZAHRAN MAULID ADYATMA', 'L', 'VIII F', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (589, '3137860665', 'AULIA RAHMAH', 'P', 'VIII G', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (593, '0126417824', 'FAJAR MAULANA HAMDANI', 'L', 'VIII G', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (597, '0122660749', 'IRMA ZAHROTUSSYITA', 'P', 'VIII G', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (601, '0128908794', 'MOCHAMAD IKHSAN OKTAVIAN', 'L', 'VIII G', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (605, '0126906124', 'MUHAMMAD FADILAH ALIMUDIN', 'L', 'VIII G', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (609, '3138945153', 'NADHIFA LATISYA SURIATNA', 'P', 'VIII G', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (613, '0127613064', 'RAFKA ZAIDAN AL TSANY', 'L', 'VIII G', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (617, '0136427723', 'RIZKI YUSUF HAWARI', 'L', 'VIII G', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (620, '0137012283', 'SYAHRUL ALAM FATURAHMAN', 'L', 'VIII G', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (623, '3125378076', 'ABDUL JABBAR', 'L', 'VIII H', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (627, '0139721771', 'AYU MAULIDA SALIMAH', 'P', 'VIII H', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (631, '0131849901', 'HAIKAL MANDALA PUTRA', 'L', 'VIII H', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (635, '3121562445', 'LUCKY RAMADHAN', 'L', 'VIII H', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (639, '0139282839', 'MUHAMMAD FAZRI MAULANA', 'L', 'VIII H', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (643, '0139333779', 'NANDA REVA ELVINA', 'P', 'VIII H', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (647, '3137368377', 'PATIMATU ZAHRO', 'P', 'VIII H', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (651, '3121538697', 'RIZKY MUHAMAD RAMADHANI', 'L', 'VIII H', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (655, '3123153568', 'SITI SAYYIDAH NURAULIA', 'P', 'VIII H', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (471, '3123552020', 'RANIA PERTIWI', 'P', 'VIII C', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (475, '3129175656', 'RISMA', 'P', 'VIII C', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (479, '0133327935', 'ZANE ANKE ALETHA RAMADHANI', 'P', 'VIII C', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (483, '0128387415', 'ASDAN MISBAHUL AKROMI', 'L', 'VIII D', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (487, '3122088947', 'GILANG PRATAMA', 'L', 'VIII D', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (491, '3120432610', 'KYANDRA GHASSANI AISYAH RAMDAN', 'P', 'VIII D', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (495, '3133769392', 'M. IRVANI ALGHIFARI', 'L', 'VIII D', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (499, '0138573687', 'MUHAMMAD IQBAL HERMANSYAH', 'L', 'VIII D', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (503, '0129368311', 'NADIYYA CAHAYA SALSABILA', 'P', 'VIII D', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (507, '3130358140', 'RAYI MUHAMAD REFANDI', 'L', 'VIII D', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (511, '0123878677', 'SRI AINI ANATA', 'P', 'VIII D', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (515, '0137521821', 'YULIA AMIRRANTI', 'P', 'VIII D', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (519, '0131397258', 'ARIZAL HANIF NURIHSAN', 'L', 'VIII E', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (523, '3135756427', 'GHANI HAWARI', 'L', 'VIII E', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (527, '0128236414', 'MUHAMAD NAZWAR', 'L', 'VIII E', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (531, '0136961281', 'MUHAMMAD ZAIDAN HAKIM', 'L', 'VIII E', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (535, '3126488293', 'NAZWA AYNI SIHAB', 'P', 'VIII E', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (539, '0121498106', 'RAISA NUR HANIFA', 'P', 'VIII E', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (543, '0123099045', 'RINA ZAHROTU ASYITA', 'P', 'VIII E', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (547, '3137368405', 'SARAH RAISYA FUTRI', 'P', 'VIII E', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (551, '3126866626', 'ZAHIRA RAMADHANI ANDANINGGAR', 'P', 'VIII E', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (555, '3136135078', 'ARSILA SALHA KOMARUDIN', 'P', 'VIII F', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (559, '3126382445', 'EMAN SULAEMAN', 'L', 'VIII F', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (563, '3134736586', 'IRMA PUSPITA SARI', 'P', 'VIII F', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (567, '3123472030', 'MOHAMAD NAGHIB ANNAUFAL', 'L', 'VIII F', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (571, '3138817036', 'M. WAFI ATHMAR', 'L', 'VIII F', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (575, '0124411937', 'RAEESA AQILAH PURNAMA', 'P', 'VIII F', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (579, '3136278933', 'RIYAD AKROM', 'L', 'VIII F', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (583, '0139032396', 'SUCI ADZRA HASNADINATA', 'P', 'VIII F', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (587, '0134551810', 'ANANDA FITRI LIYANI', 'P', 'VIII G', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (591, '0129893174', 'DIENDILOVIA ALFALAH', 'P', 'VIII G', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (595, '0127684093', 'GRACIA PUTRI RAHMADANI', 'P', 'VIII G', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (599, '3129753764', 'KELVIN JULIO', 'L', 'VIII G', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (603, '3121569957', 'MOHAMMAD WISNU KURNIA', 'L', 'VIII G', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (607, '0126045573', 'MUHAMMAD RAMDHAN MUBAROK', 'L', 'VIII G', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (611, '0128286991', 'NURI APRILIANI', 'P', 'VIII G', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (615, '0125832692', 'RAZKA ALFITRAH USMANI', 'L', 'VIII G', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (621, '0125497167', 'WENDI ARDIANSAH', 'L', 'VIII G', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (625, '0136007198', 'ANITA PUTRI ANGGRAENI', 'P', 'VIII H', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (629, '3120074639', 'DINDA SYARIFAH MUDAIM', 'P', 'VIII H', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (633, '3135218813', 'JULAIKA NURSAIDAH', 'P', 'VIII H', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (637, '3124187774', 'MUHAMAD ABDAN ROJABI', 'L', 'VIII H', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (641, '3129077163', 'MUHAMMAD REZKI PRATAMA', 'L', 'VIII H', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (645, '0139377332', 'NAZWA AULIA MEIDINA', 'P', 'VIII H', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (649, '3122000079', 'RAMA HAIKAL AGUSTIN', 'L', 'VIII H', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (653, '3137611503', 'SILPA NURUL AENI', 'P', 'VIII H', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (657, '3137962200', 'WIDA ADAWIAH', 'P', 'VIII H', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (472, '0131479087', 'RAPA HAERUL FAZRI', 'L', 'VIII C', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (476, '3128597495', 'ROSSI EVRIYODA SULTON', 'L', 'VIII C', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (480, '3136202767', 'ADZRA SAKHA ARIEFIN MAULANA', 'L', 'VIII D', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (484, '3123913930', 'ASMIL MAULANA', 'L', 'VIII D', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (488, '3125180312', 'GINA NURUL AIDA', 'P', 'VIII D', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (492, '0122772358', 'LUKI RAHMAT HIDAYAT', 'L', 'VIII D', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (496, '3123736626', 'MUHAMAD SYAEBANI', 'L', 'VIII D', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (500, '0133467950', 'MUHAMMAD KHAIRU FATHIR', 'L', 'VIII D', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (504, '3135303001', 'NAFIZA AZ-ZAHRA', 'P', 'VIII D', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (508, '0126390168', 'REDI ISKANDAR', 'L', 'VIII D', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (512, '0128797361', 'SRI RAHAYU', 'P', 'VIII D', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (516, '0126254433', 'AHMAD ZAENAL MUSLIM', 'L', 'VIII E', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (520, '3125749504', 'BAYU PUTRA HARIYANTO', 'L', 'VIII E', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (524, '0121077603', 'GIAN FATUROHMAN', 'L', 'VIII E', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (528, '0122859276', 'MUHAMMAD ERDI FERDIAN', 'L', 'VIII E', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (532, '0133069611', 'MUHAMMAD ZAKI FAKHRUDIN', 'L', 'VIII E', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (536, '0137758616', 'NOVI REVA ELVINA', 'P', 'VIII E', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (540, '0122434945', 'RAYAN ANTONI', 'L', 'VIII E', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (544, '3124252904', 'RIPKA MA''RIFATUZZAKIAH', 'P', 'VIII E', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (548, '0132073851', 'SENA ATHALLAH PUTRA', 'L', 'VIII E', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (552, '3121705757', 'ABDEE RAYI INFI RAMDHANI', 'L', 'VIII F', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (556, '0128867597', 'ASSLA SOFIYATUL AZQYA', 'P', 'VIII F', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (560, '0121276753', 'FAISAL AZMI SAFARI', 'L', 'VIII F', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (564, '0129065512', 'KIKI MUHAMAD PADILAH', 'L', 'VIII F', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (568, '3136707648', 'MUHAMAD RAMLAN', 'L', 'VIII F', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (572, '3124842975', 'NAEFA AGNIA SALSABILLA', 'P', 'VIII F', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (576, '3123517466', 'RAISA SELVIANI', 'P', 'VIII F', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (580, '0123087804', 'SASTRI HAPSOH MAOID', 'P', 'VIII F', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (584, '3121372959', 'VUSPITA SALSABILA RAMADAN', 'P', 'VIII F', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (588, '3134427150', 'ASILLA MAULIDINA ANGGRAENI', 'P', 'VIII G', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (592, '3124273661', 'DIKA SABIAN', 'L', 'VIII G', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (596, '3139891586', 'HASBI RIPA''I', 'L', 'VIII G', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (600, '3134754677', 'MECCA SITI NURISLAMI', 'P', 'VIII G', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (604, '0124840194', 'MUHAMAD RIZKI', 'L', 'VIII G', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (608, '3131643552', 'NADA PAJIRA SALSABILA', 'P', 'VIII G', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (612, '0134042284', 'PUAN JEMBAR', 'P', 'VIII G', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (616, '3128952699', 'RISALA', 'P', 'VIII G', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (619, '0128408311', 'SINTA DEWI ASRI', 'P', 'VIII G', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (622, '3129708989', 'ZIKRA RAFA ASSIDIK', 'L', 'VIII G', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (626, '3136615103', 'ASYIFA NUR AZIZAH', 'P', 'VIII H', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (630, '0123965008', 'FAJAR RIFKI ADITYA', 'L', 'VIII H', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (634, '0124741847', 'KENZIE AL-HABSY ISMAIL', 'L', 'VIII H', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (638, '0122450161', 'MUHAMMAD ADZAN MANSYUR', 'L', 'VIII H', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (642, '0136020385', 'NAFISA SITI ELFI YANI', 'P', 'VIII H', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (646, '3124797192', 'NOVIKA MUNAHILAH', 'P', 'VIII H', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (650, '0126074272', 'RAZQA LABIB MAULANA', 'L', 'VIII H', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (654, '3127305209', 'SITI AISYAH', 'P', 'VIII H', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (658, '3133443033', 'ZOHARA RAMADHANI', 'P', 'VIII H', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (474, '0136993292', 'REZA ANGGARA HIDAYAT', 'L', 'VIII C', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (478, '0128320340', 'ZAHIRA AISYI KAMILIA', 'P', 'VIII C', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (482, '0125794509', 'ANNISA RAHMA KURNIA', 'P', 'VIII D', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (486, '0129137962', 'ELSA SBASTIAN', 'P', 'VIII D', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (490, '0134883750', 'KEISHA NURI DZAKIYA', 'P', 'VIII D', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (494, '0121949289', 'MIKHAILA SHAKILA AZZAKIA', 'P', 'VIII D', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (498, '3114594512', 'MUHAMMAD GINANJAR AFIANDRI', 'L', 'VIII D', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (502, '0138952000', 'MUHAMMAD ZAKI ALIYUL HIKAM', 'L', 'VIII D', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (506, '3122495655', 'RAIHAN RAMADHAN PUTRA', 'L', 'VIII D', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (510, '0138999276', 'SANA BAYU ATISNA', 'L', 'VIII D', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (514, '0121005474', 'TASYA NAFSHAH NAIDA', 'P', 'VIII D', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (518, '0131520335', 'ARISHA INDA MUSTIKA', 'P', 'VIII E', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (522, '0137635688', 'DEWI FEBRIANI', 'P', 'VIII E', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (526, '3139885955', 'MARSHA ADELIA', 'P', 'VIII E', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (530, '3124169085', 'MUHAMMAD MAHMUL SIROJ ACHMAD', 'L', 'VIII E', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (534, '0122301660', 'NAYLA NUR ARINI PUTRI', 'P', 'VIII E', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (538, '0137303390', 'PARAS FADILAH PRATAMA', 'L', 'VIII E', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (542, '0122809072', 'RAZAN KALANI KARIM', 'L', 'VIII E', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (546, '0125946380', 'SANDI SULAEMAN', 'L', 'VIII E', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (550, '0136218907', 'YULIAHANI RAHMAWATI', 'P', 'VIII E', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (554, '0126864200', 'ARJUN KAHFI ARIPIN', 'L', 'VIII F', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (558, '0123431409', 'DHIYA DHIFANI ANATASYA', 'P', 'VIII F', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (562, '3126031106', 'IQMAL AZHAR IRAWAN', 'L', 'VIII F', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (566, '0122286191', 'MOCHAMAD FAUZI SETIAWAN', 'L', 'VIII F', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (570, '3133311511', 'MUHAMMAD GIAS RAMDANI', 'L', 'VIII F', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (574, '3127743351', 'PEBRIANTI NURJAMAMI', 'P', 'VIII F', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (578, '3139147562', 'RIQKY ADITYA PUTRA SURYA', 'L', 'VIII F', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (582, '3129110850', 'SITI SARAH', 'P', 'VIII F', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (586, '3122722539', 'ZAHRA SALSABILA', 'P', 'VIII F', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (590, '0123897562', 'AZZAHRA TUNNISA', 'P', 'VIII G', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (594, '3144307097', 'GILANG RIZQI PRATAMA', 'L', 'VIII G', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (598, '3123037142', 'JELITA SUCI MAHARANI', 'P', 'VIII G', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (602, '3136548680', 'MOCHAMMAD RIFQI ALFAIZIN ASSIDIQ', 'L', 'VIII G', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (606, '0122505408', 'MUHAMMAD KHOLIQ', 'L', 'VIII G', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (610, '3145106864', 'NASYILLA NURSYIFAUL QALBY', 'P', 'VIII G', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (614, '0132156688', 'RAISYA FATHINA NATAWIJAYA', 'P', 'VIII G', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (618, '0129000796', 'SHAZIA NISA SALSABILLA', 'P', 'VIII G', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (624, '3128211330', 'ALVIN SOLIHIN RAMDANI', 'L', 'VIII H', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (628, '0123121632', 'DIKY WAHYU PAMUNGKAS', 'L', 'VIII H', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (632, '3128334507', 'ILMI ARDIANSYAH', 'L', 'VIII H', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (636, '0131494795', 'MOHAMAD KARIM NASRI', 'L', 'VIII H', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (640, '3129261265', 'MUHAMMAD RADIAN', 'L', 'VIII H', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (644, '0125535714', 'NATASYA OKTAVIANI', 'P', 'VIII H', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (648, '0124217709', 'PUTRA AMANULLAH', 'L', 'VIII H', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (652, '3137605849', 'SAFFA DELISA ANZANI', 'P', 'VIII H', NULL, NULL, NULL);
INSERT INTO public.students (id, nisn, nama_siswa, jenis_kelamin, kelas, kelas_wali, created_at, updated_at) VALUES (656, '3138093444', 'SYALMA NURIZKIYAH', 'P', 'VIII H', NULL, NULL, NULL);
--

-- Dummy students for testing
DELETE FROM public.students WHERE nisn LIKE '0026%';

INSERT INTO public.students (nisn, nama_siswa, jenis_kelamin, kelas) VALUES
('0026701001', 'Ahmad Rizky Pratama', 'L', 'VII A'),
('0026701002', 'Aisyah Anindya Putri', 'P', 'VII A'),
('0026701003', 'Andi Muhammad Farhan', 'L', 'VII A'),
('0026701004', 'Anisa Nur Rahma', 'P', 'VII A'),
('0026701005', 'Bagus Prasetyo', 'L', 'VII A'),
('0026701006', 'Bintang Cahya Ramadhan', 'L', 'VII A'),
('0026701007', 'Citra Lestari', 'P', 'VII A'),
('0026701008', 'Daffa Ibnu Hafiz', 'L', 'VII A'),
('0026701009', 'Dina Amelia', 'P', 'VII A'),
('0026701010', 'Eka Saputra', 'L', 'VII A'),
('0026701011', 'Fadhil Kurniawan', 'L', 'VII A'),
('0026701012', 'Fitri Handayani', 'P', 'VII A'),

('0026702001', 'Galang Fernando', 'L', 'VII B'),
('0026702002', 'Gita Gutawa Putri', 'P', 'VII B'),
('0026702003', 'Hafiz Az-Zahra', 'L', 'VII B'),
('0026702004', 'Hana Salsabila', 'P', 'VII B'),
('0026702005', 'Ibrahim Luqman', 'L', 'VII B'),
('0026702006', 'Indah Permata Sari', 'P', 'VII B'),
('0026702007', 'Irwan Ardiansyah', 'L', 'VII B'),
('0026702008', 'Jasmine Aulia', 'P', 'VII B'),
('0026702009', 'Kevin Sanjaya', 'L', 'VII B'),
('0026702010', 'Kirana Maheswari', 'P', 'VII B'),
('0026702011', 'Lutfi Al-Ghifari', 'L', 'VII B'),
('0026702012', 'Mutiara Annisa', 'P', 'VII B'),

('0026703001', 'Nabil Ahmad', 'L', 'VII C'),
('0026703002', 'Nabila Maharani', 'P', 'VII C'),
('0026703003', 'Oktavian Dwi', 'L', 'VII C'),
('0026703004', 'Olivia Zalianty', 'P', 'VII C'),
('0026703005', 'Pandu Wijaya', 'L', 'VII C'),
('0026703006', 'Putri Ayu Wandira', 'P', 'VII C'),
('0026703007', 'Rafi Ahmad Hidayat', 'L', 'VII C'),
('0026703008', 'Rania Salsabila', 'P', 'VII C'),
('0026703009', 'Rian Ardianto', 'L', 'VII C'),
('0026703010', 'Siti Sarah', 'P', 'VII C'),
('0026703011', 'Tio Firmansyah', 'L', 'VII C'),
('0026703012', 'Vania Amanda', 'P', 'VII C'),

('0026901001', 'Aditya Maulana', 'L', 'IX A'),
('0026901002', 'Agnes Monica', 'P', 'IX A'),
('0026901003', 'Aldi Taher', 'L', 'IX A'),
('0026901004', 'Bella Cantika', 'P', 'IX A'),
('0026901005', 'Candra Gunawan', 'L', 'IX A'),
('0026901006', 'Dewi Persik', 'P', 'IX A'),
('0026901007', 'Fajar Alfian', 'L', 'IX A'),
('0026901008', 'Gisella Anastasia', 'P', 'IX A'),
('0026901009', 'Hendra Setiawan', 'L', 'IX A'),
('0026901010', 'Intan Nuraini', 'P', 'IX A'),
('0026901011', 'Joko Susilo', 'L', 'IX A'),
('0026901012', 'Kartika Putri', 'P', 'IX A'),

('0026902001', 'Lukman Hakim', 'L', 'IX B'),
('0026902002', 'Maya Septha', 'P', 'IX B'),
('0026902003', 'Naufal Samudra', 'L', 'IX B'),
('0026902004', 'Nia Ramadhani', 'P', 'IX B'),
('0026902005', 'Onadio Leonardo', 'L', 'IX B'),
('0026902006', 'Pevita Pearce', 'P', 'IX B'),
('0026902007', 'Raditya Dika', 'L', 'IX B'),
('0026902008', 'Raisa Andriana', 'P', 'IX B'),
('0026902009', 'Raffi Ahmad', 'L', 'IX B'),
('0026902010', 'Sherina Munaf', 'P', 'IX B'),
('0026902011', 'Tora Sudiro', 'L', 'IX B'),
('0026902012', 'Ussy Sulistiawaty', 'P', 'IX B'),

('0026903001', 'Vino G Bastian', 'L', 'IX C'),
('0026903002', 'Wika Salim', 'P', 'IX C'),
('0026903003', 'Yovie Widianto', 'L', 'IX C'),
('0026903004', 'Yura Yunita', 'P', 'IX C'),
('0026903005', 'Zack Lee', 'L', 'IX C'),
('0026903006', 'Zaskia Adya Mecca', 'P', 'IX C'),
('0026903007', 'Ahmad Dhani', 'L', 'IX C'),
('0026903008', 'Bunga Citra Lestari', 'P', 'IX C'),
('0026903009', 'Cakra Khan', 'L', 'IX C'),
('0026903010', 'Dira Sugandi', 'P', 'IX C'),
('0026903011', 'Eza Gionino', 'L', 'IX C'),
('0026903012', 'Febby Rastanty', 'P', 'IX C');
--

-- Data for Name: teacher_absences; Type: TABLE DATA; Schema: public; Owner: postgres
--

--

-- Data for Name: teaching_journals; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.teaching_journals (id, user_id, kelas, mata_pelajaran, jam_ke, materi_pembelajaran, catatan_kelas, created_at, updated_at) VALUES (1, 2, 'VIII A', 'Informatika', '1-3', 'Test', NULL, NULL, NULL);
--

-- Data for Name: teaching_schedules; Type: TABLE DATA; Schema: public; Owner: postgres
--

--

-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users (id, username, password, role, remember_token, created_at, updated_at) VALUES (1, 'admin_spensawa', '$2y$12$e6sZ90x6kDPWcICMpzitWu/sgD4KCpWxF6i0LwQZ9xwTg5JrgUYni', 'admin', NULL, '2026-06-29 10:42:42', '2026-06-29 10:42:42');
INSERT INTO public.users (id, username, password, role, remember_token, created_at, updated_at) VALUES (2, 'sidik_heryana', '$2y$12$C1imO/hxdGSpkQ.pllQHjO/hy39cTX5udobMRxnbAewQ0GM1GNIhy', 'guru_mapel', NULL, '2026-06-29 10:42:43', '2026-06-29 10:42:43');
INSERT INTO public.users (id, username, password, role, remember_token, created_at, updated_at) VALUES (3, '197310082000122001', '$2y$12$B1F8RGBlIO68kpuFOTFrE.9bjvB3HLXTLfmYGS1BrbWDVmoFBBsUW', 'guru_mapel', NULL, '2026-07-02 20:06:54', '2026-07-02 20:06:54');
INSERT INTO public.users (id, username, password, role, remember_token, created_at, updated_at) VALUES (4, '199406142020122003', 'guru123', 'guru_bk', NULL, NULL, NULL);
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

