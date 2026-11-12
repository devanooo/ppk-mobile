import { useEffect, useState } from 'react';
import type { Firestore } from 'firebase/firestore';

import { dengarkanIzinSaya } from '@/lib/izin';
import type { Izin } from '@/features/izin/types';

export type StatusMuat = 'memuat' | 'siap' | 'gagal';

type HasilIzin = {
  izin: Izin[];
  status: StatusMuat;
  pesanGalat?: string;
  /** `true` bila jumlah sesi melebihi batas, sehingga riwayat tidak lengkap. */
  terpotong: boolean;
};

/** Batas jumlah sesi yang didengarkan sekaligus, supaya listener tetap wajar. */
export const BATAS_SESI_PRAKTIKAN = 20;

/**
 * Mendengarkan izin milik satu praktikan lintas sesinya, lalu mengurutkan dari
 * pengajuan terbaru. `sesiIds` dipotong ke `BATAS_SESI_PRAKTIKAN` supaya jumlah
 * listener terkendali (sprint-2 bagian 8.4).
 *
 * Pemotongan dilaporkan lewat `terpotong` supaya layar bisa memberi tahu
 * pengguna bahwa riwayat yang tampil tidak lengkap, bukan memotong diam-diam.
 */
export function useIzinPraktikan(
  db: Firestore | null,
  praktikanId: string | undefined,
  sesiIds: string[],
): HasilIzin {
  const [hasil, setHasil] = useState<HasilIzin>({
    izin: [],
    status: 'memuat',
    terpotong: false,
  });
  const punyaSumber = Boolean(db && praktikanId);
  const kunci = sesiIds.slice(0, BATAS_SESI_PRAKTIKAN).join(',');
  const terpotong = sesiIds.length > BATAS_SESI_PRAKTIKAN;

  useEffect(() => {
    if (!db || !praktikanId) return;

    const daftar = kunci ? kunci.split(',') : [];

    if (daftar.length === 0) return;

    const bersihkan = dengarkanIzinSaya(db, praktikanId, daftar, (data) => {
      if (data.ok) {
        setHasil({ izin: data.data, status: 'siap', terpotong });
        return;
      }

      setHasil({ izin: [], status: 'gagal', pesanGalat: data.pesan, terpotong });
    });

    return bersihkan;
  }, [db, praktikanId, kunci, terpotong]);

  if (!punyaSumber) {
    return { izin: [], status: 'gagal', pesanGalat: 'Data izin belum tersedia', terpotong };
  }

  // Tidak ada sesi berarti memang belum ada yang bisa diajukan izinnya.
  if (sesiIds.length === 0) {
    return { izin: [], status: 'siap', terpotong: false };
  }

  return { ...hasil, terpotong };
}
