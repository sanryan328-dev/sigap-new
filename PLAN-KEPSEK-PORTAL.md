# Plan: KepsekPortal.tsx — Dashboard Kepala Sekolah

## Overview
Membuat komponen portal/dashboard baru `KepsekPortal.tsx` untuk role Kepala Sekolah dengan 4 modul pemantauan: Metrik Kunci, Rekap Jurnal Guru, Absen Siswa per Kelas, dan Izin/Tugas Titipan Guru.

---

## Files to Create

### 1. `src/components/KepsekPortal.tsx` (NEW)
Komponen utama. ~500-600 baris.

**Struktur:**
```
KepsekPortal({ onSwitchRole?: () => void })
├── useEffect: Promise.all → fetch 4 dataset simultan dari Supabase
│   ├── teaching_journals (hari ini) → guru aktif + jurnal terisi
│   ├── student_attendances (hari ini) → kehadiran siswa per kelas
│   ├── teacher_absences (hari ini, verified) → guru berizin
│   └── profiles (all) → nama guru enrichment
├── 4x DaisyUI Stats cards (metrik kunci)
├── Tabel Rekap Jurnal Guru (tabel DaisyUI)
├── Tabel/Rekap Absen Siswa per Kelas (tabel + bar chart Recharts opsional)
└── Tabel Izin & Tugas Titipan Guru
```

**Props:** `{ onSwitchRole?: () => void }`

**State:**
- `dataJurnal: any[]` — teaching_journals + profiles join
- `dataAbsenSiswa: Record<string, {hadir,sakit,izin,alfa}>` — aggregated per kelas
- `dataGuruIzin: any[]` — teacher_absences + profiles join
- `stats: { guruAktif: number, kehadiranSiswa: number, guruBerizin: number, jurnalTerkirim: number }`
- `loading: boolean`
- `tab: 'metrik' | 'jurnal' | 'absen' | 'izin'`

**Data Fetching (Promise.all):**
```typescript
const today = new Date().toISOString().split('T')[0]; // "2026-07-19"

const [jurnalRes, absenRes, izinRes, profilesRes, studentsRes] = await Promise.all([
  supabase.from('teaching_journals')
    .select('id, user_id, kelas, mata_pelajaran, jam_ke, materi_pembelajaran, created_at')
    .gte('created_at', today)
    .order('created_at', { ascending: false }),
  supabase.from('student_attendances')
    .select('id, student_id, status, teaching_journal_id, created_at')
    .gte('created_at', today),
  supabase.from('teacher_absences')
    .select('user_id, status_izin, alasan_detail, titipan_tugas_kelas, status_verifikasi')
    .eq('tanggal_absen', today)
    .eq('status_verifikasi', 'diverifikasi_piket'),
  supabase.from('profiles')
    .select('user_id, nama_lengkap'),
  supabase.from('students')
    .select('id, kelas'),
]);
```

**Metrik Kunci:**
1. `guruAktif` = `new Set(jurnalRes.data.map(j => j.user_id)).size` (unique user_id)
2. `kehadiranSiswa` = `hadirCount / totalSiswa * 100` (persentase)
3. `guruBerizin` = `izinRes.data.length`
4. `jurnalTerkirim` = `jurnalRes.data.length`

**UI Layout:**
- **Navbar**: "SIGAP — Pusat Pemantauan Sekolah" + badge + tombol "Kembali" (onSwitchRole)
- **4 Stats Cards**: grid `grid-cols-2 lg:grid-cols-4` — masing-masing stat pakai DaisyUI `stat` component
- **Tab Navigation**: `tabs tabs-box` → Metrik | Jurnal | Absen | Izin
- **Tabel Jurnal**: Nama Guru | Kelas | Mapel | Jam Ke | Materi
- **Tabel Absen**: Kelas | Hadir | Sakit | Izin | Alfa (per baris = 1 kelas)
- **Tabel Izin**: Nama Guru | Status | Alasan | Titipan Tugas

**Style:**
- Primary color: `#367cce` (indigo-blue)
- Base background: `bg-base-200` (abu-abih bersih)
- Stat cards: `bg-white rounded-2xl shadow-sm border border-slate-200`
- Tables: `table table-sm w-full` inside `overflow-x-auto` inside rounded card
- Responsive: `grid-cols-2 lg:grid-cols-4` untuk stats, `overflow-x-auto` untuk tabel di mobile
- Framer Motion: `initial={{ opacity: 0, y: 24 }}`, `animate={{ opacity: 1, y: 0 }}`
- Icons: Lucide React (`GraduationCap`, `Users`, `BookOpen`, `CalendarX`, `ShieldCheck`, `ArrowLeft`, `Loader2`, `ClipboardList`, `UserX`)
- Badge untuk status izin: `badge badge-soft badge-warning` (sakit), `badge badge-soft badge-info` (izin_keperluan), `badge badge-soft badge-primary` (tugas_dinas)

---

## Files to Modify

### 2. `src/store/useAuthStore.ts`

**Changes:**
- Add `'kepala_sekolah'` to `RoleView` type union
- Add `selectIsKepsek` selector: `s.user?.role === 'kepala_sekolah'`

```typescript
// RoleView type — add 'kepala_sekolah'
type RoleView = 'guru_mapel' | 'wali_kelas' | 'pembina_ekskul' | 'guru_piket' | 'guru_bk' | 'kurikulum' | 'kepala_sekolah' | null;

// New selector
export const selectIsKepsek = (s: AuthStore) => s.user?.role === 'kepala_sekolah';
```

### 3. `src/App.tsx`

**Changes:**
- Import `KepsekPortal` and `selectIsKepsek`
- Add `const isKepsek = useAuthStore(selectIsKepsek);`
- Add routing branch after `isAdmin` check:
  ```tsx
  if (isKepsek) return <KepsekPortal onSwitchRole={() => { logout(); }} />;
  ```
- Add `handleLogin` early return for `kepala_sekolah` (similar to `kurikulum`):
  ```tsx
  if (userData.role === "kepala_sekolah") {
    setKurikulumPanel(null);
    setActiveRoleView(null);
    setSubMenu(null);
    setSubMenuWali(null);
    return;
  }
  ```
  Wait — actually, the Kepala Sekolah doesn't need RoleSwitcher. They go directly to KepsekPortal. So we just need the routing in the render chain, not a special login handler. The `setAuth()` already happens. The key is that `isKepsek` becomes true, and in the render chain:
  ```tsx
  if (isAdmin) return <AdminPortal ... />;
  if (isKepsek) return <KepsekPortal onSwitchRole={() => { logout(); }} />;
  if (isKurikulum && kurikulumPanel === null) return <RoleSwitcher ... />;
  ```
  The `onSwitchRole` for Kepala Sekolah just logs out since they don't have sub-roles.

### 4. `schema.sql` (reference only — user must run manually)
```sql
ALTER TYPE "public"."role_enum" ADD VALUE 'kepala_sekolah';
```

---

## Verification

1. `npm run build` — must compile without errors
2. Manual SQL: `ALTER TYPE role_enum ADD VALUE 'kepala_sekolah';`
3. Insert test user in `users` table with role `kepala_sekolah`
4. Login as that user → should see KepsekPortal directly
5. Check 4 stats cards render with real data from Supabase
6. Check all 4 tables render correctly
7. Check responsive layout on mobile viewport
8. Check "Kembali" button logs out and returns to login
