import { useEffect, useState } from 'react';
import type { Firestore } from 'firebase/firestore';

import { dengarkanIzinSaya } from '@/lib/izin';
import type { Izin } from '@/features/izin/types';

export type StatusMuat = 'memuat' | 'siap' | 'gagal';

type HasilIzin = {
  izin: Izin[];
  status: StatusMuat;
  pesanGalat?: string;
};

/** Batas jumlah sesi yang didengarkan sekaligus, supaya listener tetap wajar. */
const BATAS_SESI = 20;

/**
 * Mendengarkan izin milik satu praktikan lintas sesinya, lalu mengurutkan dari
 * pengajuan terbaru. `sesiIds` dipotong ke `BATAS_SESI` supaya jumlah listener
 * terkendali (sprint-2 bagian 8.4).
 */
export function useIzinPraktikan(
  db: Firestore | null,
  praktikanId: string | undefined,
  sesiIds: string[],
): HasilIzin {
  const [hasil, setHasil] = useState<HasilIzin>({ izin: [], status: 'memuat' });
  const punyaSumber = Boolean(db && praktikanId);
  const kunci = sesiIds.slice(0, BATAS_SESI).join(',');

  useEffect(() => {
    if (!db || !praktikanId) return;

    const daftar = kunci ? kunci.split(',') : [];

    if (daftar.length === 0) return;

    const bersihkan = dengarkanIzinSaya(db, praktikanId, daftar, (data) => {
      if (data.ok) {
        setHasil({ izin: data.data, status: 'siap' });
        return;
      }

      setHasil({ izin: [], status: 'gagal', pesanGalat: data.pesan });
    });

    return bersihkan;
  }, [db, praktikanId, kunci]);

  if (!punyaSumber) {
    return { izin: [], status: 'gagal', pesanGalat: 'Data izin belum tersedia' };
  }

  // Tidak ada sesi berarti memang belum ada yang bisa diajukan izinnya.
  if (sesiIds.length === 0) {
    return { izin: [], status: 'siap' };
  }

  return hasil;
}
