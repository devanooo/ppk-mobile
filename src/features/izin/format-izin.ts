import { formatJam } from '@/store/session-logic';

import type { Izin, KlasifikasiStatus, StatusIzin } from './types';

const LABEL_STATUS: Record<StatusIzin, string> = {
  menunggu: 'Menunggu',
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

/**
 * Urutan untuk daftar asisten: pengajuan yang masih menunggu selalu di atas,
 * diurut menurut tanggal sesi yang terlihat di layar. Pengajuan yang sudah
 * diputuskan (disetujui atau ditolak) diurut menurut waktu diajukan, yang
 * paling awal di atas. Entri tanpa waktu ditaruh paling bawah.
 */
export function urutkanIzinAsisten(
  daftar: Izin[],
  tanggalSesi: (sesiId: string) => string | undefined,
): Izin[] {
  function waktuSesi(izin: Izin): number {
    const tanggal = tanggalSesi(izin.sesiId);

    if (!tanggal) return Number.POSITIVE_INFINITY;

    const waktu = Date.parse(`${tanggal}T00:00:00Z`);

    return Number.isNaN(waktu) ? Number.POSITIVE_INFINITY : waktu;
  }

  function waktuPengajuan(izin: Izin): number {
    return izin.dibuatPada?.getTime() ?? Number.POSITIVE_INFINITY;
  }

  return [...daftar].sort((a, b) => {
    const aMenunggu = a.status === 'menunggu';
    const bMenunggu = b.status === 'menunggu';

    if (aMenunggu !== bMenunggu) {
      return aMenunggu ? -1 : 1;
    }

    // Pengajuan yang sudah diputuskan diurut menurut waktu diajukan, bukan
    // tanggal sesi, supaya antrean keputusan tetap kronologis.
    if (!aMenunggu) {
      return waktuPengajuan(a) - waktuPengajuan(b);
    }

    const selisihTanggal = waktuSesi(a) - waktuSesi(b);

    if (selisihTanggal !== 0) return selisihTanggal;

    return waktuPengajuan(a) - waktuPengajuan(b);
  });
}

export function formatWaktuIzin(waktu?: Date): string | undefined {
  if (!waktu) return undefined;

  return formatJam(waktu.toISOString());
}
