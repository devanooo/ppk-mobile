/**
 * Tipe domain izin untuk lapisan UI.
 *
 * TODO(p1): `StatusIzin`, `KlasifikasiStatus`, dan `IzinDokumen` akan pindah ke
 * `src/types/firestore.ts` bersama `izinConverter` (T-017). Definisi di bawah
 * adalah salinan persis kontrak docs/sprints/sprint-2.md bagian 8.3, jadi
 * bentuknya tidak boleh menyimpang. `src/types/**` hanya boleh disentuh P1/P3.
 *
 * `Izin` adalah bentuk yang dipakai layar: dokumen Firestore ditambah `id`.
 */

export type StatusIzin = 'menunggu' | 'disetujui' | 'ditolak';

export type KlasifikasiStatus = 'menunggu' | 'selesai' | 'gagal';

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
