export type Peran = 'praktikan' | 'asisten';

export type StatusSesi = 'belum-dibuka' | 'dibuka' | 'ditutup';

export type User = {
  id: string;
  nama: string;
  /** NIM untuk praktikan, NIP untuk asisten. */
  nomorInduk: string;
  peran: Peran;
};

export type Sesi = {
  id: string;
  namaPraktikum: string;
  kelas: string;
  lab: string;
  /** Nama hari, mis. "Senin". */
  hari: string;
  /** Tanggal ISO 8601, mis. "2026-10-26". */
  tanggal: string;
  /** HH:mm, mis. "13:00". */
  jamMulai: string;
  /** HH:mm, mis. "15:30". */
  jamSelesai: string;
  asistenId: string;
  pesertaIds: string[];
  status: StatusSesi;
  /** ISO 8601, diisi saat asisten membuka sesi. */
  dibukaPada?: string;
  /** ISO 8601, diisi saat asisten menutup sesi. */
  ditutupPada?: string;
};

export type Presensi = {
  sesiId: string;
  praktikanId: string;
  /** ISO 8601 dari jam perangkat saat presensi berhasil. */
  waktu: string;
};

export type Kredensial = {
  userId: string;
  username: string;
  password: string;
};
