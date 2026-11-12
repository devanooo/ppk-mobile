import { useEffect, useState } from 'react';
import type { Firestore } from 'firebase/firestore';

import { dengarkanIzinSesi } from '@/lib/izin';
import type { Izin } from '@/features/izin/types';

export type StatusMuat = 'memuat' | 'siap' | 'gagal';

export type IzinAsisten = Izin & {
  /** Nama sesi yang memuat pengajuan ini, untuk judul kartu. */
  sesiId: string;
};

type HasilIzin = {
  izin: IzinAsisten[];
  status: StatusMuat;
  pesanGalat?: string;
};

/**
 * Mendengarkan izin dari semua sesi yang diampu asisten. Jumlah sesi dibatasi
 * 20 supaya jumlah listener tetap wajar (sprint-2 bagian 8.4); sesi di urutan
 * awal adalah yang paling relevan menurut pemanggil.
 */
export function useIzinAsisten(
  db: Firestore | null,
  asistenId: string | undefined,
  sesiIds: string[],
): HasilIzin {
  const [hasil, setHasil] = useState<HasilIzin>({ izin: [], status: 'memuat' });
  const kunci = sesiIds.join('|');

  useEffect(() => {
    if (!db || !asistenId || !kunci) return;

    const daftar = kunci.split('|');
    const terkumpul = new Map<string, IzinAsisten>();
    let gagal = false;

    const kirim = () => {
      if (!gagal) setHasil({ izin: [...terkumpul.values()], status: 'siap' });
    };

    const pembersih = daftar.map((sesiId) =>
      dengarkanIzinSesi(db, sesiId, (data) => {
        if (!data.ok) {
          gagal = true;
          setHasil({ izin: [], status: 'gagal', pesanGalat: data.pesan });
          return;
        }

        data.data.forEach((izin) => terkumpul.set(`${sesiId}:${izin.id}`, izin));

        // Pengajuan bisa hilang dari satu sesi, jadi kunci lama dibersihkan dulu.
        for (const kunciLama of [...terkumpul.keys()]) {
          if (!kunciLama.startsWith(`${sesiId}:`)) continue;

          const idDokumen = kunciLama.slice(sesiId.length + 1);

          if (!data.data.some((izin) => izin.id === idDokumen)) {
            terkumpul.delete(kunciLama);
          }
        }

        kirim();
      }),
    );

    return () => pembersih.forEach((bersihkan) => bersihkan());
  }, [db, asistenId, kunci]);

  if (!db || !asistenId) {
    return { izin: [], status: 'gagal', pesanGalat: 'Data izin belum tersedia' };
  }

  if (sesiIds.length === 0) {
    return { izin: [], status: 'siap' };
  }

  return hasil;
}
