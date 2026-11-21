import type { SesiFirestore } from '@/lib/sesi';

import type { LaboratoryId } from './laboratory';

export type StatusAktivitas = 'memuat' | 'siap' | 'gagal';

export type KelasAktivitas = {
  id: string;
  nama: string;
  lab: string;
};

export type AktivitasLaboratorium = {
  sesi: SesiFirestore;
  namaKelas: string;
  lab: string;
  mulai: Date;
  selesai: Date;
  laboratorium: LaboratoryId;
};

export type HasilAktivitas = {
  saatIni: AktivitasLaboratorium | null;
  berikutnya: AktivitasLaboratorium | null;
};
