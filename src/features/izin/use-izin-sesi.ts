import { useEffect, useState } from 'react';
import type { Firestore } from 'firebase/firestore';

import { dengarkanIzinSesi } from '@/lib/izin';
import type { Izin } from '@/features/izin/types';

type HasilIzinSesi = {
  izin?: Izin;
  status: 'memuat' | 'siap' | 'gagal';
  pesanGalat?: string;
};

/**
 * Mendengarkan satu dokumen izin (`sesiId` + `praktikanId`) lewat listener
 * koleksi, supaya keputusan dari perangkat lain langsung terlihat (AC US-11
 * nomor 5). Listener koleksi dipakai karena lapisan data belum menyediakan
 * listener dokumen tunggal.
 */
export function useIzinSesi(
  db: Firestore | null,
  sesiId: string | undefined,
  praktikanId: string | undefined,
): HasilIzinSesi {
  const [hasil, setHasil] = useState<HasilIzinSesi>({ status: 'memuat' });
  const punyaSumber = Boolean(db && sesiId && praktikanId);

  useEffect(() => {
    if (!db || !sesiId || !praktikanId) return;

    return dengarkanIzinSesi(db, sesiId, (data) => {
      if (!data.ok) {
        setHasil({ status: 'gagal', pesanGalat: data.pesan });
        return;
      }

      setHasil({
        izin: data.data.find((izin) => izin.praktikanId === praktikanId),
        status: 'siap',
      });
    });
  }, [db, sesiId, praktikanId]);

  if (!punyaSumber) {
    return { status: 'gagal', pesanGalat: 'Pengajuan izin tidak ditemukan' };
  }

  return hasil;
}
