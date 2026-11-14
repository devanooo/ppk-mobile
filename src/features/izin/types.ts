/**
 * Tipe domain izin untuk lapisan UI.
 *
 * `StatusIzin` dan `KlasifikasiStatus` bukan deklarasi baru: keduanya re-export
 * dari `@/types/firestore` supaya satu nilai hanya punya satu sumber.
 *
 * `IzinDokumen` sengaja dideklarasikan lokal. Bentuk field mengikuti
 * `IzinFirestore` di `@/types/firestore`, tetapi `Timestamp` sudah dikonversi
 * menjadi `Date` oleh `keIzin` di `src/lib/izin.ts`, dan komponen UI memformat
 * `Date`. Jangan ganti kembali menjadi `Timestamp`.
 *
 * `Izin` adalah bentuk yang dipakai layar: dokumen Firestore ditambah `id`.
 */

import type {
  StatusIzinFirestore,
  StatusKlasifikasiFirestore,
} from '@/types/firestore';

export type StatusIzin = StatusIzinFirestore;

export type KlasifikasiStatus = StatusKlasifikasiFirestore;

export type IzinDokumen = {
  praktikanId: string;
  alasan: string;
  status: StatusIzin;
  kategoriAi?: string;
  klasifikasiStatus: KlasifikasiStatus;
  diprosesPada?: Date;
  dibuatPada: Date;
  diputuskanPada?: Date;
  diputuskanOleh?: string;
};

export type Izin = IzinDokumen & {
  id: string;
  sesiId: string;
};
