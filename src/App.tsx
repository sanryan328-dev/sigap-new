import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "./supabaseClient";
import { addToOfflineQueue } from "./utils/dbLocal";
import { saveAccount } from "./utils/savedAccounts";
import { useAuthStore, selectIsAdmin, selectIsKepsek, selectIsKurikulum, selectIsPiket, selectIsGureBK } from "./store/useAuthStore";
import type { AuthUser, MapelEntry, UserProfile, RoleView } from "./store/useAuthStore";
import Login from "./components/Login";
import DashboardMenu from "./components/DashboardMenu";
import GuruMapelDashboard from "./components/GuruMapelDashboard";
import WaliKelasDashboard from "./components/WaliKelasDashboard";
import KehadiranWali from "./components/KehadiranWali";
import FormJurnal from "./components/FormJurnal";
import InputNilai from "./components/InputNilai";
import RiwayatNilai from "./components/RiwayatNilai";
import RiwayatJurnal from "./components/RiwayatJurnal";
import RekapBKWali from "./components/RekapBKWali";
import KonfirmasiProfil from "./components/KonfirmasiProfil";
import AdminPortal from "./components/AdminPortal";
import GuruPiketDashboard from "./components/GuruPiketDashboard";
import GuruBKDashboard from "./components/GuruBKDashboard";
import PembinaEkskulDashboard from "./components/PembinaEkskulDashboard";
import KurikulumPortal from "./components/KurikulumPortal";
import KepsekPortal from "./components/KepsekPortal";
import RoleSwitcher from "./components/RoleSwitcher";

interface Siswa {
  id: string;
  nama_siswa: string;
  nisn: string;
}

interface MataPelajaranEntry {
  mapel: string;
  kelas: string[];
}

export default function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const [kurikulumPanel, setKurikulumPanel] = useState<'kurikulum' | 'wali_kelas' | 'pembina_ekskul' | 'guru_piket' | 'guru_mapel' | null>(null);
  
  const [subMenu, setSubMenu] = useState<"jurnal" | "nilai" | "riwayat-nilai" | "riwayat-jurnal" | null>(null);
  const [subMenuWali, setSubMenuWali] = useState<"kehadiran" | "bk" | null>(null);

  const [perluKonfirmasi, setPerluKonfirmasi] = useState(false);
  const [loadingKonfirmasi, setLoadingKonfirmasi] = useState(false);

  const [kelas, setKelas] = useState("");
  const [mataPelajaran, setMataPelajaran] = useState("");
  const [jamMulai, setJamMulai] = useState("1");
  const [durasiJam, setDurasiJam] = useState("2");
  const [materi, setMateri] = useState("");
  const [catatan, setCatatan] = useState("");

  const [daftarKelas, setDaftarKelas] = useState<string[]>([]);
  const [daftarSiswa, setDaftarSiswa] = useState<Siswa[]>([]);
  const [presensi, setPresensi] = useState<{ [key: string]: string }>({});
  const [loadingSiswa, setLoadingSiswa] = useState(false);
  const [loadingSimpan, setLoadingSimpan] = useState(false);
  const [pesanEror, setPesanEror] = useState("");
  const [sessionChecked, setSessionChecked] = useState(false);

  // PWA Install Debug
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      console.log('✅ beforeinstallprompt FIRED — PWA can be installed!');
      (window as any).__deferredPrompt = e;
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);
  const [dataBk, setDataBk] = useState<any[]>([]);
  const [loadingBk, setLoadingBk] = useState(false);
  const [guruMapelList, setGuruMapelList] = useState<MapelEntry[]>([]);

  // ── Zustand ──
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const activeRoleView = useAuthStore((s) => s.activeRoleView);
  const setAuth = useAuthStore((s) => s.setAuth);
  const setActiveRoleView = useAuthStore((s) => s.setActiveRoleView);
  const setOnlineStatus = useAuthStore((s) => s.setOnlineStatus);
  const logout = useAuthStore((s) => s.logout);
  const isAdmin = useAuthStore(selectIsAdmin);
  const isKepsek = useAuthStore(selectIsKepsek);
  const isKurikulum = useAuthStore(selectIsKurikulum);
  const isPiket = useAuthStore(selectIsPiket);
  const isGureBK = useAuthStore(selectIsGureBK);

  const isLoggedIn = user !== null;

  // ── Network listener ──
  useEffect(() => {
    setOnlineStatus(navigator.onLine);
    const onOnline = () => setOnlineStatus(true);
    const onOffline = () => setOnlineStatus(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, [setOnlineStatus]);

  /* ── Restore session dari localStorage ── */
  useEffect(() => {
    const raw = localStorage.getItem('sigap_session');
    if (!raw) {
      setSessionChecked(true);
      return;
    }
    let stored: { user: AuthUser; profile: UserProfile } | null = null;
    try {
      stored = JSON.parse(raw);
    } catch {
      localStorage.removeItem('sigap_session');
      setSessionChecked(true);
      return;
    }
    if (!stored?.user?.id) {
      localStorage.removeItem('sigap_session');
      setSessionChecked(true);
      return;
    }

    /* Verifikasi user masih ada di database */
    (async () => {
      try {
        const { data: userData } = await supabase
          .from('users')
          .select('id, username, role')
          .eq('id', stored!.user.id)
          .single();
        if (!userData) {
          localStorage.removeItem('sigap_session');
          setSessionChecked(true);
          return;
        }

        let profilTarik: any;
        const res = await supabase
          .from('profiles')
          .select('user_id, nama_lengkap, mapel, mata_pelajaran, is_wali_kelas, kelas_wali, nama_ekstrakurikuler, hari_piket')
          .eq('user_id', userData.id)
          .single();
        if (res.data) {
          profilTarik = res.data;
        } else {
          const fallback = await supabase
            .from('profiles')
            .select('user_id, nama_lengkap, mapel, mata_pelajaran, is_wali_kelas, kelas_wali, nama_ekstrakurikuler')
            .eq('user_id', userData.id)
            .single();
          profilTarik = fallback.data;
        }

        if (!profilTarik) {
          localStorage.removeItem('sigap_session');
          setSessionChecked(true);
          return;
        }

        const authUser: AuthUser = {
          id: userData.id,
          username: userData.username,
          role: userData.role,
        };
        setAuth(authUser, profilTarik as UserProfile);
      } catch {
        localStorage.removeItem('sigap_session');
      } finally {
        setSessionChecked(true);
      }
    })();
  }, [setAuth]);

  useEffect(() => {
    async function fetchKelas() {
      try {
        const { data } = await supabase.from("students").select("kelas");
        if (data) {
          const listKelasUnik = Array.from(new Set(data.map((item) => item.kelas)))
            .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
          setDaftarKelas(listKelasUnik);
          if (listKelasUnik.length > 0) setKelas(listKelasUnik[0]);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchKelas();
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !kelas || !activeRoleView || isAdmin || activeRoleView === 'guru_piket') return;
    if (activeRoleView === "wali_kelas" && subMenuWali === "bk") return;

    async function fetchSiswa() {
      setLoadingSiswa(true);
      setPesanEror("");
      try {
        const { data } = await supabase
          .from("students")
          .select("id, nama_siswa, nisn")
          .eq("kelas", kelas)
          .order("nama_siswa", { ascending: true });
        if (data) {
          setDaftarSiswa(data);
          const defaultPresensi: { [key: string]: string } = {};
          data.forEach((siswa) => { defaultPresensi[siswa.id] = "Hadir"; });
          setPresensi(defaultPresensi);
        }
      } catch (err: any) {
        setPesanEror(err.message || "Gagal mengambil data siswa");
      } finally {
        setLoadingSiswa(false);
      }
    }
    fetchSiswa();
  }, [kelas, isLoggedIn, activeRoleView, subMenuWali, isAdmin]);

  useEffect(() => {
    if (!profile || !activeRoleView || isAdmin || activeRoleView === 'guru_piket') return;
    if (activeRoleView === "guru_bk") {
      setMataPelajaran(profile.mapel || "");
    } else if (activeRoleView === "wali_kelas") {
      setMataPelajaran("Pembinaan Wali Kelas");
      if (profile.kelas_wali) setKelas(profile.kelas_wali);
    } else if (activeRoleView === "pembina_ekskul") {
      setMataPelajaran(`Ekskul ${profile.nama_ekstrakurikuler || ""}`);
    }
  }, [activeRoleView, profile, isAdmin]);

  useEffect(() => {
    if (isLoggedIn && activeRoleView === "wali_kelas" && subMenuWali === "bk" && profile?.kelas_wali && !isAdmin) {
      async function fetchRecordsBK() {
        setLoadingBk(true);
        try {
          const { data } = await supabase
            .from("bk_records")
            .select(`id, kategori_kasus, detail_kasus, tindakan_penanganan, status, created_at, students!inner(nama_siswa)`)
            .eq("kelas", profile.kelas_wali);
          if (data) {
            const cleanData = data.map((item: any) => ({
              id: item.id, kategori_kasus: item.kategori_kasus, detail_kasus: item.detail_kasus,
              tindakan_penanganan: item.tindakan_penanganan, status: item.status, created_at: item.created_at,
              student_name: item.students?.nama_siswa || "Siswa Hilang",
            }));
            setDataBk(cleanData);
          }
        } catch (err) { console.error(err); } finally { setLoadingBk(false); }
      }
      fetchRecordsBK();
    }
  }, [isLoggedIn, activeRoleView, subMenuWali, profile, isAdmin]);

  useEffect(() => {
    if (profile?.mata_pelajaran && Array.isArray(profile.mata_pelajaran)) {
      setGuruMapelList(profile.mata_pelajaran.filter((e: any) => e?.mapel?.trim()));
    } else if (profile?.mapel) {
      setGuruMapelList([{ mapel: profile.mapel, kelas: [...daftarKelas] }]);
    } else {
      setGuruMapelList([]);
    }
  }, [profile, daftarKelas]);

  const handleSelectMapelKelas = (mapel: string, kelas: string) => {
    setMataPelajaran(mapel);
    setKelas(kelas);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPesanEror("");
    try {
      if (username.toLowerCase() === "admin") {
        const adminUser = { id: 0, username: 'admin', role: 'admin' } as const;
        setAuth(adminUser, null as unknown as UserProfile);
        localStorage.setItem('sigap_session', JSON.stringify({ user: adminUser, profile: null }));
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id, username, role, password")
        .eq("username", username)
        .single();
        
      if (userError || !userData) throw new Error("Username tidak ditemukan.");

      if (userData.password !== password) {
        throw new Error("Password yang Anda masukkan salah.");
      }

      let profilTarik: any;
      const res = await supabase.from("profiles").select("user_id, nama_lengkap, mapel, mata_pelajaran, is_wali_kelas, kelas_wali, nama_ekstrakurikuler, hari_piket").eq("user_id", userData.id).single();
      if (res.error) {
        const fallback = await supabase.from("profiles").select("user_id, nama_lengkap, mapel, mata_pelajaran, is_wali_kelas, kelas_wali, nama_ekstrakurikuler").eq("user_id", userData.id).single();
        if (fallback.error || !fallback.data) throw new Error("Profil gagal dimuat.");
        profilTarik = fallback.data;
      } else {
        profilTarik = res.data;
      }

      const authUser = { id: userData.id, username: userData.username, role: userData.role };
      setAuth(authUser, profilTarik);

      /* Simpan sesi ke localStorage supaya tahan refresh */
      localStorage.setItem('sigap_session', JSON.stringify({ user: authUser, profile: profilTarik }));

      if (userData.role === "kurikulum") {
        setKurikulumPanel(null);
        setActiveRoleView(null);
        setSubMenu(null);
        setSubMenuWali(null);
        return;
      }

      if (userData.role === "kepala_sekolah") {
        setActiveRoleView(null);
        setSubMenu(null);
        setSubMenuWali(null);
        return;
      }

      const cekMapel = profilTarik.mapel ? String(profilTarik.mapel).trim() : "";
      const cekEkskul = profilTarik.nama_ekstrakurikuler ? String(profilTarik.nama_ekstrakurikuler).trim() : "";
      const isWali = profilTarik.is_wali_kelas === true || String(profilTarik.is_wali_kelas).toLowerCase() === "true";

      const belumAdaTugasSamaSekali = cekMapel === "" && cekEkskul === "" && !isWali;
      const isAkunKhususPiket = userData.role === "guru_piket";
      const isAkunKhususBK = userData.role === "guru_bk";
      const isAkunKhususKurikulum = userData.role === "kurikulum";
      const isAkunKhususKepsek = userData.role === "kepala_sekolah";

      if (belumAdaTugasSamaSekali && !isAkunKhususPiket && !isAkunKhususBK && !isAkunKhususKurikulum && !isAkunKhususKepsek) {
        setPerluKonfirmasi(true);
      } else {
        setPerluKonfirmasi(false);
      }

      setActiveRoleView(null);
      setSubMenu(null);
      setSubMenuWali(null);
    } catch (err: any) {
      setPesanEror(err.message || "Login Gagal");
    }
  };

  const handleSimpanProfilAwal = async (dataInput: { mapel: string | null; mataPelajaran: MapelEntry[]; isWaliKelas: boolean; kelasWali: string | null; namaEkskul: string | null; }) => {
    if (!profile) return;
    setLoadingKonfirmasi(true);
    try {
      const { data: profileDiperbarui, error } = await supabase.from("profiles").update({
          mapel: dataInput.mapel,
          mata_pelajaran: dataInput.mataPelajaran,
          is_wali_kelas: dataInput.isWaliKelas,
          kelas_wali: dataInput.kelasWali,
          nama_ekstrakurikuler: dataInput.namaEkskul,
          updated_at: new Date().toISOString(),
        }).eq("user_id", profile.user_id).select().single();
      if (error) throw error;
      toast.success("Profil berhasil diperbarui!");
      setAuth(user!, profileDiperbarui as UserProfile);
      setPerluKonfirmasi(false);
    } catch (err: any) { toast.error(`Gagal: ${err.message}`); } finally { setLoadingKonfirmasi(false); }
  };

  const handleLogout = () => {
    /* Simpan username sebelum logout */
    if (user) {
      saveAccount({
        username: user.username,
        nama_lengkap: profile?.nama_lengkap || user.username,
        role: user.role === 'admin' ? 'Admin' : user.role,
      });
    }
    logout();
    localStorage.removeItem('sigap_session');
    setKurikulumPanel(null);
    setUsername("");
    setPassword("");
    setSubMenu(null);
    setSubMenuWali(null);
    setPerluKonfirmasi(false);
  };

  const handleStatusChange = (siswaId: string, status: string) => { setPresensi({ ...presensi, [siswaId]: status }); };

  const [errorJadwal, setErrorJadwal] = useState('');

  const handleSubmitJurnal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !activeRoleView) return;
    setLoadingSimpan(true); setPesanEror(""); setErrorJadwal('');

    const jamMulaiNum = parseInt(jamMulai);
    const durasiJamNum = parseInt(durasiJam);
    const jamSelesaiNum = jamMulaiNum + durasiJamNum - 1;
    const formatJamKe = `${jamMulai}-${jamSelesaiNum}`;

    /* Validasi bentrok jadwal dari teaching_schedules */
    try {
      const todayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const hariIni = todayNames[new Date().getDay()];
      const { data: existingSchedules } = await supabase
        .from('teaching_schedules')
        .select('user_id, jam_mulai, durasi_jam, mata_pelajaran')
        .eq('kelas', kelas)
        .eq('hari', hariIni);

      if (existingSchedules) {
        const bentrok = existingSchedules.some((s: any) => {
          if (s.user_id === profile.user_id) return false; /* skip diri sendiri */
          const sMulai = s.jam_mulai;
          const sAkhir = s.jam_mulai + s.durasi_jam - 1;
          return (jamMulaiNum <= sAkhir) && (jamSelesaiNum >= sMulai);
        });
        if (bentrok) {
          setErrorJadwal(`Kelas ${kelas} sudah diisi guru lain pada hari ${hariIni} di rentang jam yang sama. Silakan periksa jadwal.`);
          setLoadingSimpan(false);
          return;
        }
      }
    } catch (scheduleErr: any) {
      console.error('Gagal validasi jadwal (non-bloking):', scheduleErr.message);
    }
    if (!navigator.onLine) {
      const payloadJurnal = {
        user_id: profile.user_id, kelas, mata_pelajaran: mataPelajaran, jam_ke: formatJamKe,
        materi_pembelajaran: materi, catatan_kelas: catatan ? `[Role: ${activeRoleView}] ${catatan}` : `[Role: ${activeRoleView}]`,
        daftar_siswa: daftarSiswa.map((siswa) => ({ student_id: siswa.id, status: presensi[siswa.id] || "Hadir", status_verifikasi: "pending" })),
      };
      await addToOfflineQueue(profile.user_id, 'teaching_journals', payloadJurnal);
      toast.success("Data disimpan secara offline. Akan dikirim saat online kembali.");
      setMateri(""); setCatatan("");
      if (activeRoleView === "guru_mapel" || activeRoleView === "guru_bk") setSubMenu(null);
      if (activeRoleView === "wali_kelas") setSubMenuWali(null);
      if (activeRoleView === "pembina_ekskul") setActiveRoleView(null);
      setLoadingSimpan(false);
      return;
    }
    try {
      const { data: jurnalBaru, error: errorJurnal } = await supabase.from('teaching_journals').insert([{
            user_id: profile.user_id, kelas, mata_pelajaran: mataPelajaran, jam_ke: formatJamKe,
            materi_pembelajaran: materi, catatan_kelas: catatan ? `[Role: ${activeRoleView}] ${catatan}` : `[Role: ${activeRoleView}]`,
        }]).select().single();
      if (errorJurnal) throw errorJurnal;
      if (jurnalBaru) {
        const dataAbsenSiswa = daftarSiswa.map((siswa) => ({ teaching_journal_id: jurnalBaru.id, student_id: siswa.id, status: presensi[siswa.id] || "Hadir", status_verifikasi: "pending" }));
        const { error: errorAbsensi } = await supabase.from('student_attendances').insert(dataAbsenSiswa);
        if (errorAbsensi) {
          /* Coba ulang tanpa status_verifikasi jika kolom belum ada */
          if (errorAbsensi.message?.includes('status_verifikasi') || errorAbsensi.code === '42703') {
            console.warn('⚠️ Kolom status_verifikasi belum ada — insert tanpa kolom tersebut');
            const dataFallback = daftarSiswa.map((siswa) => ({ teaching_journal_id: jurnalBaru.id, student_id: siswa.id, status: presensi[siswa.id] || "Hadir" }));
            const { error: e2 } = await supabase.from('student_attendances').insert(dataFallback);
            if (e2) throw e2;
          } else {
            throw errorAbsensi;
          }
        }
      }
      toast.success("Sukses! Data Jurnal berhasil disimpan.");
      setMateri(""); setCatatan("");

      if (activeRoleView === "guru_mapel" || activeRoleView === "guru_bk") setSubMenu(null);
      if (activeRoleView === "wali_kelas") setSubMenuWali(null);
      if (activeRoleView === "pembina_ekskul") setActiveRoleView(null);
    } catch (err: any) { toast.error(err.message || "Gagal menyimpan jurnal"); } finally { setLoadingSimpan(false); }
  };

  const handleSimpanNilai = async (jenisPenilaian: string, kumpulanNilai: { [key: string]: number }) => {
    if (!profile) return;
    setLoadingSimpan(true); setPesanEror("");
    try {
      const dataNilaiArray = Object.entries(kumpulanNilai)
        .filter(([_, nilai]) => nilai !== undefined && nilai !== null)
        .map(([studentId, nilai]) => ({
          user_id: profile.user_id,
          student_id: Number(studentId),
          kelas,
          mapel: mataPelajaran,
          jenis_penilaian: jenisPenilaian,
          nilai,
        }));

      if (dataNilaiArray.length === 0) {
        toast.error('Minimal isi satu nilai siswa untuk disimpan.');
        return;
      }

      /* Hapus data lama untuk (user_id, kelas, mapel, jenis_penilaian) lalu insert ulang */
      await supabase
        .from('student_scores')
        .delete()
        .eq('user_id', profile.user_id)
        .eq('kelas', kelas)
        .eq('mapel', mataPelajaran)
        .eq('jenis_penilaian', jenisPenilaian);

      const { error } = await supabase.from('student_scores').insert(dataNilaiArray);
      if (error) throw error;

      toast.success(`Sukses! Rekap nilai ${jenisPenilaian} Kelas ${kelas} berhasil disimpan.`);
      setSubMenu(null);
    } catch (err: any) { toast.error(err.message || "Gagal menyimpan rekap nilai."); } finally { setLoadingSimpan(false); }
  };

  const handleBackFromJurnal = () => {
    setErrorJadwal('');
    if (activeRoleView === "guru_mapel" && isKurikulum) {
      setSubMenu(null);
    } else if (activeRoleView === "guru_mapel") setSubMenu(null);
    else if (activeRoleView === "guru_bk") setSubMenu(null);
    else if (activeRoleView === "wali_kelas") setSubMenuWali(null);
    else if (activeRoleView === "pembina_ekskul") setActiveRoleView(null);
  };

  if (!sessionChecked) {
    return (
      <div
        style={{ backgroundColor: '#fefaef', color: '#1d1601' }}
        className="min-h-screen flex flex-col items-center justify-center gap-4"
      >
        <div
          className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: '#f4aa18', borderTopColor: 'transparent' }}
        />
        <p className="text-base font-semibold">Memuat sesi...</p>
      </div>
    );
  }

  if (!isLoggedIn) return <Login username={username} setUsername={setUsername} password={password} setPassword={setPassword} handleLogin={handleLogin} pesanEror={pesanEror} />;
  if (isAdmin) return <AdminPortal handleLogout={handleLogout} daftarKelas={daftarKelas} />;
  if (isKepsek) return <KepsekPortal onSwitchRole={handleLogout} />;
  
  // ── Kurikulum: role selection screen ──
  if (isKurikulum && kurikulumPanel === null) {
    return (
      <RoleSwitcher
        onSelect={(panel) => {
          setKurikulumPanel(panel);
          if (panel === 'wali_kelas' || panel === 'pembina_ekskul' || panel === 'guru_piket' || panel === 'guru_mapel') {
            setActiveRoleView(panel);
          }
        }}
        onLogout={handleLogout}
      />
    );
  }
  if (isKurikulum && kurikulumPanel === 'kurikulum') {
    return <KurikulumPortal onSwitchRole={() => setKurikulumPanel(null)} />;
  }

  // ── Kurikulum: dynamic redirect helpers ──
  const backToSwitcher = () => {
    setKurikulumPanel(null);
    setActiveRoleView(null);
    setSubMenu(null);
    setSubMenuWali(null);
  };

  if (isKurikulum && kurikulumPanel === 'wali_kelas') {
    if (activeRoleView === 'wali_kelas') {
      if (subMenuWali === null) return <WaliKelasDashboard setSubMenuWali={setSubMenuWali} setCurrentRole={backToSwitcher} onSwitchRole={backToSwitcher} />;
      if (subMenuWali === 'bk') return <RekapBKWali setSubMenuWali={setSubMenuWali} dataBk={dataBk} loadingBk={loadingBk} />;
      if (subMenuWali === 'kehadiran') return <KehadiranWali setSubMenuWali={setSubMenuWali} kelas={kelas} daftarSiswa={daftarSiswa} />;
    }
  }

  if (isKurikulum && kurikulumPanel === 'pembina_ekskul') {
    if (profile) {
      return <PembinaEkskulDashboard setCurrentRole={backToSwitcher} daftarKelas={daftarKelas} onSwitchRole={backToSwitcher} />;
    }
  }

  if (isKurikulum && kurikulumPanel === 'guru_piket') {
    if (profile) {
      return <GuruPiketDashboard onSwitchRole={backToSwitcher} />;
    }
  }

  if (isKurikulum && kurikulumPanel === 'guru_mapel') {
    if (activeRoleView === 'guru_mapel') {
      if (subMenu === null) return <GuruMapelDashboard setSubMenu={setSubMenu} setCurrentRole={backToSwitcher} onSelectMapelKelas={handleSelectMapelKelas} mataPelajaranData={guruMapelList} daftarKelas={daftarKelas} onSwitchRole={backToSwitcher} />;
      if (subMenu === 'nilai') return <InputNilai setSubMenu={setSubMenu} kelas={kelas} setKelas={setKelas} mataPelajaran={mataPelajaran} daftarKelas={daftarKelas} daftarSiswa={daftarSiswa} handleSimpanNilai={handleSimpanNilai} loadingSiswa={loadingSiswa} loadingSimpan={loadingSimpan} />;
      if (subMenu === 'riwayat-nilai') return <RiwayatNilai setSubMenu={setSubMenu} kelas={kelas} mataPelajaran={mataPelajaran} />;
      if (subMenu === 'riwayat-jurnal') return <RiwayatJurnal setSubMenu={setSubMenu} kelas={kelas} mataPelajaran={mataPelajaran} />;
      return <FormJurnal currentRole={activeRoleView} setSubMenu={handleBackFromJurnal} kelas={kelas} setKelas={setKelas} mataPelajaran={mataPelajaran} setMataPelajaran={setMataPelajaran} jamMulai={jamMulai} setJamMulai={setJamMulai} durasiJam={durasiJam} setDurasiJam={setDurasiJam} materi={materi} setMateri={setMateri} catatan={catatan} setCatatan={setCatatan} daftarKelas={daftarKelas} daftarSiswa={daftarSiswa} presensi={presensi} handleStatusChange={handleStatusChange} handleSubmitJurnal={handleSubmitJurnal} loadingSiswa={loadingSiswa} loadingSimpan={loadingSimpan} errorJadwal={errorJadwal} />;
    }
  }
  
  if (perluKonfirmasi) return <KonfirmasiProfil namaLengkap={profile?.nama_lengkap || ""} daftarKelas={daftarKelas} onSimpanProfil={handleSimpanProfilAwal} loading={loadingKonfirmasi} />;

  if (activeRoleView === null) {
    return (
      <DashboardMenu
        setCurrentRole={setActiveRoleView}
        handleLogout={handleLogout}
        daftarKelas={daftarKelas}
      />
    );
  }

  if (activeRoleView === "guru_piket" && profile) {
    return <GuruPiketDashboard handleLogout={() => setActiveRoleView(null)} />;
  }

  if (activeRoleView === "guru_bk" && profile) {
    return (
      <GuruBKDashboard
        handleLogout={() => setActiveRoleView(null)}
        daftarKelas={daftarKelas}
      />
    );
  }

  if (activeRoleView === "guru_mapel") {
    if (subMenu === null) return <GuruMapelDashboard setSubMenu={setSubMenu} setCurrentRole={setActiveRoleView} onSelectMapelKelas={handleSelectMapelKelas} mataPelajaranData={guruMapelList} daftarKelas={daftarKelas} />;
    if (subMenu === "nilai") return <InputNilai setSubMenu={setSubMenu} kelas={kelas} setKelas={setKelas} mataPelajaran={mataPelajaran} daftarKelas={daftarKelas} daftarSiswa={daftarSiswa} handleSimpanNilai={handleSimpanNilai} loadingSiswa={loadingSiswa} loadingSimpan={loadingSimpan} />;
    if (subMenu === "riwayat-nilai") return <RiwayatNilai setSubMenu={setSubMenu} kelas={kelas} mataPelajaran={mataPelajaran} />;
    if (subMenu === "riwayat-jurnal") return <RiwayatJurnal setSubMenu={setSubMenu} kelas={kelas} mataPelajaran={mataPelajaran} />;
  }

  if (activeRoleView === "wali_kelas") {
    if (subMenuWali === null) return <WaliKelasDashboard setSubMenuWali={setSubMenuWali} setCurrentRole={setActiveRoleView} />;
    if (subMenuWali === "bk") return <RekapBKWali setSubMenuWali={setSubMenuWali} dataBk={dataBk} loadingBk={loadingBk} />;
    if (subMenuWali === "kehadiran") return <KehadiranWali setSubMenuWali={setSubMenuWali} kelas={kelas} daftarSiswa={daftarSiswa} />;
  }

  if (activeRoleView === "pembina_ekskul") {
    return <PembinaEkskulDashboard setCurrentRole={setActiveRoleView} daftarKelas={daftarKelas} />;
  }

  return (
    <FormJurnal currentRole={activeRoleView} setSubMenu={handleBackFromJurnal} kelas={kelas} setKelas={setKelas} mataPelajaran={mataPelajaran} setMataPelajaran={setMataPelajaran} jamMulai={jamMulai} setJamMulai={setJamMulai} durasiJam={durasiJam} setDurasiJam={setDurasiJam} materi={materi} setMateri={setMateri} catatan={catatan} setCatatan={setCatatan} daftarKelas={daftarKelas} daftarSiswa={daftarSiswa} presensi={presensi} handleStatusChange={handleStatusChange} handleSubmitJurnal={handleSubmitJurnal} loadingSiswa={loadingSiswa} loadingSimpan={loadingSimpan} errorJadwal={errorJadwal} />
  );
}
