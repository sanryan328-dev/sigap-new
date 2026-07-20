import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "./supabaseClient";
import { addToOfflineQueue } from "./utils/dbLocal";
import { useAuthStore, selectIsAdmin, selectIsKepsek, selectIsKurikulum, selectIsPiket, selectIsGureBK } from "./store/useAuthStore";
import type { MapelEntry, UserProfile, RoleView } from "./store/useAuthStore";
import Login from "./components/Login";
import DashboardMenu from "./components/DashboardMenu";
import GuruMapelDashboard from "./components/GuruMapelDashboard";
import WaliKelasDashboard from "./components/WaliKelasDashboard";
import KehadiranWali from "./components/KehadiranWali";
import FormJurnal from "./components/FormJurnal";
import InputNilai from "./components/InputNilai";
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
  
  const [subMenu, setSubMenu] = useState<"jurnal" | "nilai" | null>(null);
  const [subMenuWali, setSubMenuWali] = useState<"kehadiran" | "bk" | null>(null);

  const [perluKonfirmasi, setPerluKonfirmasi] = useState(false);
  const [loadingKonfirmasi, setLoadingKonfirmasi] = useState(false);

  const [kelas, setKelas] = useState("");
  const [mataPelajaran, setMataPelajaran] = useState("");
  const [jamMulai, setJamMulai] = useState("1");
  const [jamSelesai, setJamSelesai] = useState("3");
  const [materi, setMateri] = useState("");
  const [catatan, setCatatan] = useState("");

  const [daftarKelas, setDaftarKelas] = useState<string[]>([]);
  const [daftarSiswa, setDaftarSiswa] = useState<Siswa[]>([]);
  const [presensi, setPresensi] = useState<{ [key: string]: string }>({});
  const [loadingSiswa, setLoadingSiswa] = useState(false);
  const [loadingSimpan, setLoadingSimpan] = useState(false);
  const [pesanEror, setPesanEror] = useState("");

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
        setAuth({ id: 0, username: 'admin', role: 'admin' }, null as unknown as UserProfile);
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
    logout();
    setKurikulumPanel(null);
    setUsername("");
    setPassword("");
    setSubMenu(null);
    setSubMenuWali(null);
    setPerluKonfirmasi(false);
  };

  const handleStatusChange = (siswaId: string, status: string) => { setPresensi({ ...presensi, [siswaId]: status }); };

  const handleSubmitJurnal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !activeRoleView) return;
    setLoadingSimpan(true); setPesanEror("");
    const formatJamKe = `${jamMulai}-${jamSelesai}`;
    if (!navigator.onLine) {
      const payloadJurnal = {
        user_id: profile.user_id, kelas, mata_pelajaran: mataPelajaran, jam_ke: formatJamKe,
        materi_pembelajaran: materi, catatan_kelas: catatan ? `[Role: ${activeRoleView}] ${catatan}` : `[Role: ${activeRoleView}]`,
        daftar_siswa: daftarSiswa.map((siswa) => ({ student_id: siswa.id, status: presensi[siswa.id] || "Hadir" })),
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
        const dataAbsenSiswa = daftarSiswa.map((siswa) => ({ teaching_journal_id: jurnalBaru.id, student_id: siswa.id, status: presensi[siswa.id] || "Hadir" }));
        const { error: errorAbsensi } = await supabase.from('student_attendances').insert(dataAbsenSiswa);
        if (errorAbsensi) throw errorAbsensi;
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
      const dataNilaiArray = daftarSiswa.map((siswa) => ({ user_id: profile.user_id, student_id: siswa.id, kelas: kelas, mapel: mataPelajaran, jenis_penilaian: jenisPenilaian, nilai: kumpulanNilai[siswa.id] || 0 }));
      const { error } = await supabase.from('student_scores').insert(dataNilaiArray);
      if (error) throw error;
      toast.success(`Sukses! Rekap nilai ${jenisPenilaian} Kelas ${kelas} berhasil disimpan.`);
      setSubMenu(null);
    } catch (err: any) { toast.error(err.message || "Gagal menyimpan rekap nilai."); } finally { setLoadingSimpan(false); }
  };

  const handleBackFromJurnal = () => {
    if (activeRoleView === "guru_mapel" && isKurikulum) {
      setSubMenu(null);
    } else if (activeRoleView === "guru_mapel") setSubMenu(null);
    else if (activeRoleView === "guru_bk") setSubMenu(null);
    else if (activeRoleView === "wali_kelas") setSubMenuWali(null);
    else if (activeRoleView === "pembina_ekskul") setActiveRoleView(null);
  };

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
      return <FormJurnal currentRole={activeRoleView} setSubMenu={handleBackFromJurnal} kelas={kelas} setKelas={setKelas} mataPelajaran={mataPelajaran} setMataPelajaran={setMataPelajaran} jamMulai={jamMulai} setJamMulai={setJamMulai} jamSelesai={jamSelesai} setJamSelesai={setJamSelesai} materi={materi} setMateri={setMateri} catatan={catatan} setCatatan={setCatatan} daftarKelas={daftarKelas} daftarSiswa={daftarSiswa} presensi={presensi} handleStatusChange={handleStatusChange} handleSubmitJurnal={handleSubmitJurnal} loadingSiswa={loadingSiswa} loadingSimpan={loadingSimpan} />;
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
    <FormJurnal currentRole={activeRoleView} setSubMenu={handleBackFromJurnal} kelas={kelas} setKelas={setKelas} mataPelajaran={mataPelajaran} setMataPelajaran={setMataPelajaran} jamMulai={jamMulai} setJamMulai={setJamMulai} jamSelesai={jamSelesai} setJamSelesai={setJamSelesai} materi={materi} setMateri={setMateri} catatan={catatan} setCatatan={setCatatan} daftarKelas={daftarKelas} daftarSiswa={daftarSiswa} presensi={presensi} handleStatusChange={handleStatusChange} handleSubmitJurnal={handleSubmitJurnal} loadingSiswa={loadingSiswa} loadingSimpan={loadingSimpan} />
  );
}
