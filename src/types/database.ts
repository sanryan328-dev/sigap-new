export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      bk_records: {
        Row: {
          created_at: string | null
          detail_kasus: string
          id: number
          kategori_kasus: string
          kelas: string
          status: string
          student_id: number
          tindakan_penanganan: string
          updated_at: string | null
          user_id: number
        }
        Insert: {
          created_at?: string | null
          detail_kasus: string
          id?: number
          kategori_kasus: string
          kelas: string
          status?: string
          student_id: number
          tindakan_penanganan: string
          updated_at?: string | null
          user_id: number
        }
        Update: {
          created_at?: string | null
          detail_kasus?: string
          id?: number
          kategori_kasus?: string
          kelas?: string
          status?: string
          student_id?: number
          tindakan_penanganan?: string
          updated_at?: string | null
          user_id?: number
        }
        Relationships: []
      }
      bk_sesi_lanjutan: {
        Row: {
          bk_record_id: number
          catatan_sesi: string
          created_at: string | null
          id: number
          status: string
          tindak_lanjut: string
          updated_at: string | null
        }
        Insert: {
          bk_record_id: number
          catatan_sesi: string
          created_at?: string | null
          id?: number
          status: string
          tindak_lanjut: string
          updated_at?: string | null
        }
        Update: {
          bk_record_id?: number
          catatan_sesi?: string
          created_at?: string | null
          id?: number
          status?: string
          tindak_lanjut?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      extracurricular_journals: {
        Row: {
          aktivitas_kegiatan: string
          created_at: string | null
          id: number
          jumlah_alfa: number
          jumlah_hadir: number
          jumlah_izin: number
          jumlah_sakit: number
          nama_ekskul: string
          tanggal: string
          updated_at: string | null
          user_id: number
        }
        Insert: {
          aktivitas_kegiatan: string
          created_at?: string | null
          id?: number
          jumlah_alfa?: number
          jumlah_hadir?: number
          jumlah_izin?: number
          jumlah_sakit?: number
          nama_ekskul: string
          tanggal: string
          updated_at?: string | null
          user_id: number
        }
        Update: {
          aktivitas_kegiatan?: string
          created_at?: string | null
          id?: number
          jumlah_alfa?: number
          jumlah_hadir?: number
          jumlah_izin?: number
          jumlah_sakit?: number
          nama_ekskul?: string
          tanggal?: string
          updated_at?: string | null
          user_id?: number
        }
        Relationships: []
      }
      extracurricular_members: {
        Row: {
          created_at: string | null
          id: number
          nama_ekskul: string
          student_id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          nama_ekskul: string
          student_id: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          nama_ekskul?: string
          student_id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      extracurricular_scores: {
        Row: {
          catatan_pembinaan: string | null
          created_at: string | null
          id: number
          nama_ekskul: string
          nilai_kualitatif: Database["public"]["Enums"]["kualitatif_enum"]
          student_id: number
          updated_at: string | null
          user_id: number
        }
        Insert: {
          catatan_pembinaan?: string | null
          created_at?: string | null
          id?: number
          nama_ekskul: string
          nilai_kualitatif?: Database["public"]["Enums"]["kualitatif_enum"]
          student_id: number
          updated_at?: string | null
          user_id: number
        }
        Update: {
          catatan_pembinaan?: string | null
          created_at?: string | null
          id?: number
          nama_ekskul?: string
          nilai_kualitatif?: Database["public"]["Enums"]["kualitatif_enum"]
          student_id?: number
          updated_at?: string | null
          user_id?: number
        }
        Relationships: []
      }
      journal_student_logs: {
        Row: {
          catatan_kejadian: string
          created_at: string | null
          id: number
          jenis_kejadian: Database["public"]["Enums"]["kejadian_enum"]
          student_id: number
          teaching_journal_id: number
          updated_at: string | null
        }
        Insert: {
          catatan_kejadian: string
          created_at?: string | null
          id?: number
          jenis_kejadian: Database["public"]["Enums"]["kejadian_enum"]
          student_id: number
          teaching_journal_id: number
          updated_at?: string | null
        }
        Update: {
          catatan_kejadian?: string
          created_at?: string | null
          id?: number
          jenis_kejadian?: Database["public"]["Enums"]["kejadian_enum"]
          student_id?: number
          teaching_journal_id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      master_pelanggarans: {
        Row: {
          bobot: number | null
          created_at: string | null
          id: number
          jenis_kasus: string
          kategori: string
          updated_at: string | null
        }
        Insert: {
          bobot?: number | null
          created_at?: string | null
          id?: number
          jenis_kasus: string
          kategori: string
          updated_at?: string | null
        }
        Update: {
          bobot?: number | null
          created_at?: string | null
          id?: number
          jenis_kasus?: string
          kategori?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          foto_profil: string | null
          id: number
          is_guru_piket: boolean
          is_wali_kelas: boolean
          kelas_wali: string | null
          mapel: string | null
          mata_pelajaran: Json | null
          nama_ekstrakurikuler: string | null
          nama_lengkap: string
          updated_at: string | null
          user_id: number
        }
        Insert: {
          created_at?: string | null
          foto_profil?: string | null
          id?: number
          is_guru_piket?: boolean
          is_wali_kelas?: boolean
          kelas_wali?: string | null
          mapel?: string | null
          mata_pelajaran?: Json | null
          nama_ekstrakurikuler?: string | null
          nama_lengkap: string
          updated_at?: string | null
          user_id: number
        }
        Update: {
          created_at?: string | null
          foto_profil?: string | null
          id?: number
          is_guru_piket?: boolean
          is_wali_kelas?: boolean
          kelas_wali?: string | null
          mapel?: string | null
          mata_pelajaran?: Json | null
          nama_ekstrakurikuler?: string | null
          nama_lengkap?: string
          updated_at?: string | null
          user_id?: number
        }
        Relationships: []
      }
      student_attendances: {
        Row: {
          created_at: string | null
          id: number
          status: string | null
          student_id: number
          teaching_journal_id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          status?: string | null
          student_id: number
          teaching_journal_id: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          status?: string | null
          student_id?: number
          teaching_journal_id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      student_scores: {
        Row: {
          created_at: string | null
          id: number
          jenis_penilaian: string
          kelas: string
          mapel: string
          nilai: number
          student_id: number
          updated_at: string | null
          user_id: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          jenis_penilaian: string
          kelas: string
          mapel: string
          nilai: number
          student_id: number
          updated_at?: string | null
          user_id: number
        }
        Update: {
          created_at?: string | null
          id?: number
          jenis_penilaian?: string
          kelas?: string
          mapel?: string
          nilai?: number
          student_id?: number
          updated_at?: string | null
          user_id?: number
        }
        Relationships: []
      }
      students: {
        Row: {
          created_at: string | null
          id: number
          jenis_kelamin: Database["public"]["Enums"]["jk_enum"]
          kelas: string
          kelas_wali: string | null
          nama_siswa: string
          nisn: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          jenis_kelamin: Database["public"]["Enums"]["jk_enum"]
          kelas: string
          kelas_wali?: string | null
          nama_siswa: string
          nisn: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          jenis_kelamin?: Database["public"]["Enums"]["jk_enum"]
          kelas?: string
          kelas_wali?: string | null
          nama_siswa?: string
          nisn?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      teacher_absences: {
        Row: {
          alasan_detail: string
          created_at: string | null
          file_surat_keterangan: string | null
          id: number
          status_izin: Database["public"]["Enums"]["izin_enum"]
          status_verifikasi: Database["public"]["Enums"]["verifikasi_enum"]
          tanggal_absen: string
          titipan_tugas_kelas: string | null
          tugas_attachment_url: string | null
          updated_at: string | null
          user_id: number
        }
        Insert: {
          alasan_detail: string
          created_at?: string | null
          file_surat_keterangan?: string | null
          id?: number
          status_izin: Database["public"]["Enums"]["izin_enum"]
          status_verifikasi?: Database["public"]["Enums"]["verifikasi_enum"]
          tanggal_absen: string
          titipan_tugas_kelas?: string | null
          tugas_attachment_url?: string | null
          updated_at?: string | null
          user_id: number
        }
        Update: {
          alasan_detail?: string
          created_at?: string | null
          file_surat_keterangan?: string | null
          id?: number
          status_izin?: Database["public"]["Enums"]["izin_enum"]
          status_verifikasi?: Database["public"]["Enums"]["verifikasi_enum"]
          tanggal_absen?: string
          titipan_tugas_kelas?: string | null
          tugas_attachment_url?: string | null
          updated_at?: string | null
          user_id?: number
        }
        Relationships: []
      }
      teaching_journals: {
        Row: {
          catatan_kelas: string | null
          created_at: string | null
          id: number
          jam_ke: string
          kelas: string
          mata_pelajaran: string
          materi_pembelajaran: string
          updated_at: string | null
          user_id: number
        }
        Insert: {
          catatan_kelas?: string | null
          created_at?: string | null
          id?: number
          jam_ke: string
          kelas: string
          mata_pelajaran: string
          materi_pembelajaran: string
          updated_at?: string | null
          user_id: number
        }
        Update: {
          catatan_kelas?: string | null
          created_at?: string | null
          id?: number
          jam_ke?: string
          kelas?: string
          mata_pelajaran?: string
          materi_pembelajaran?: string
          updated_at?: string | null
          user_id?: number
        }
        Relationships: []
      }
      teaching_schedules: {
        Row: {
          created_at: string | null
          hari: string
          id: number
          jam_ke: string
          kelas: string
          mata_pelajaran: string
          updated_at: string | null
          user_id: number
        }
        Insert: {
          created_at?: string | null
          hari: string
          id?: number
          jam_ke: string
          kelas: string
          mata_pelajaran: string
          updated_at?: string | null
          user_id: number
        }
        Update: {
          created_at?: string | null
          hari?: string
          id?: number
          jam_ke?: string
          kelas?: string
          mata_pelajaran?: string
          updated_at?: string | null
          user_id?: number
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          id: number
          password: string
          remember_token: string | null
          role: Database["public"]["Enums"]["role_enum"]
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          password: string
          remember_token?: string | null
          role?: Database["public"]["Enums"]["role_enum"]
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          id?: number
          password?: string
          remember_token?: string | null
          role?: Database["public"]["Enums"]["role_enum"]
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      izin_enum: "sakit" | "izin_keperluan" | "tugas_dinas"
      jk_enum: "L" | "P"
      kejadian_enum: "apresiasi" | "pelanggaran"
      kualitatif_enum: "Sangat Baik" | "Baik" | "Cukup" | "Kurang"
      role_enum:
        | "admin"
        | "guru_mapel"
        | "guru_piket"
        | "wali_kelas"
        | "guru_bk"
        | "pembina_ekskul"
        | "pks_kesiswaan"
        | "kepala_sekolah"
        | "kurikulum"
      verifikasi_enum: "pending" | "diverifikasi_piket"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      izin_enum: ["sakit", "izin_keperluan", "tugas_dinas"],
      jk_enum: ["L", "P"],
      kejadian_enum: ["apresiasi", "pelanggaran"],
      kualitatif_enum: ["Sangat Baik", "Baik", "Cukup", "Kurang"],
      role_enum: [
        "admin",
        "guru_mapel",
        "guru_piket",
        "wali_kelas",
        "guru_bk",
        "pembina_ekskul",
        "pks_kesiswaan",
        "kepala_sekolah",
        "kurikulum",
      ],
      verifikasi_enum: ["pending", "diverifikasi_piket"],
    },
  },
} as const

