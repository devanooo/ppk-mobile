
import type { Timestamp } from 'firebase/firestore';

export type PeranFirestore = 'praktikan' | 'asisten';

export type StatusSesiFirestore =
  | 'belum-dibuka'
  | 'dibuka'
  | 'ditutup';

export type StatusIzinFirestore =
  | 'menunggu'
  | 'disetujui'
  | 'ditolak';

export type StatusKlasifikasiFirestore =
  | 'menunggu'
  | 'selesai'
  | 'gagal';

// =========================================================
// USERS
// Collection: users/{uid}

export interface UserFirestore {
  nama: string;
  nomorInduk: string;
  peran: PeranFirestore;
  dibuatPada: Timestamp;
}

// =========================================================
// KELAS
// Collection: kelas/{kelasId}

export interface KelasFirestore {
  nama: string;
  lab: string;
  asistenId: string;
  pesertaIds: string[];
  dibuatPada: Timestamp;
}

// =========================================================
// SESI
// Collection: sesi/{sesiId}

export interface SesiFirestore {
  kelasId: string;
  asistenId: string;
  hari: string;
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
  status: StatusSesiFirestore;

  dibukaPada?: Timestamp;
  ditutupPada?: Timestamp;
  dibuatPada: Timestamp;
}

// =========================================================
// PRESENSI
// Collection: sesi/{sesiId}/presensi/{uid}

export interface PresensiFirestore {
  praktikanId: string;
  waktu: Timestamp;
}

// =========================================================
// IZIN
// Collection: sesi/{sesiId}/izin/{uid}

export interface IzinFirestore {
  praktikanId: string;
  alasan: string;
  status: StatusIzinFirestore;

  kategoriAi?: string;
  klasifikasiStatus: StatusKlasifikasiFirestore;

  diprosesPada?: Timestamp;
  dibuatPada: Timestamp;
  diputuskanPada?: Timestamp;
  diputuskanOleh?: string;
}
