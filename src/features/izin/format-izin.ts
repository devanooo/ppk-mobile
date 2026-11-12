import { formatJam } from '@/store/session-logic';

import type { Izin, KlasifikasiStatus, StatusIzin } from './types';

const LABEL_STATUS: Record<StatusIzin, string> = {
  menunggu: 'Menunggu keputusan',
  disetujui: 'Disetujui',
  ditolak: 'Ditolak',
};

const LABEL_KLASIFIKASI: Record<KlasifikasiStatus, string> = {
  menunggu: 'Klasifikasi AI sedang diproses',
  selesai: 'Sudah diklasifikasikan AI',
  gagal: 'Klasifikasi AI gagal',
};

/** Dokumen dari Firestore belum tentu sesuai tipe, jadi nilai tak dikenal ditangani. */
export function labelStatusIzin(status: StatusIzin): string {
  return LABEL_STATUS[status] ?? 'Status tidak dikenal';
}

export function labelKlasifikasi(status: KlasifikasiStatus): string {
  return LABEL_KLASIFIKASI[status] ?? 'Status klasifikasi tidak dikenal';
}

/**
 * Urut dari pengajuan terbaru. `dibuatPada` bisa belum ada saat dokumen baru
 * ditulis, jadi entri tanpa waktu ditaruh paling akhir alih-alih melempar.
 */
export function urutkanIzin(daftar: Izin[]): Izin[] {
  return [...daftar].sort((a, b) => {
    const waktuA = a.dibuatPada?.getTime() ?? 0;
    const waktuB = b.dibuatPada?.getTime() ?? 0;

    return waktuB - waktuA;
  });
}

export function formatWaktuIzin(waktu?: Date): string | undefined {
  if (!waktu) return undefined;

  return formatJam(waktu.toISOString());
}
