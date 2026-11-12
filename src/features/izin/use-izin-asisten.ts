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
 * Batas jumlah sesi yang didengarkan sekaligus. Setiap sesi menambah satu
 * listener, jadi jumlahnya harus dibatasi (sprint-2 bagian 8.4).
 */
export const BATAS_SESI_ASISTEN = 20;

/**
 * Mendengarkan izin dari sesi yang diampu asisten, maksimal
 * `BATAS_SESI_ASISTEN` sesi. Pemanggil mengurutkan sesi dari yang paling
 * relevan, karena hanya bagian awal yang didengarkan.
 */
export function useIzinAsisten(
  db: Firestore | null,
  asistenId: string | undefined,
  sesiIds: string[],
): HasilIzin {
  const [hasil, setHasil] = useState<HasilIzin>({ izin: [], status: 'memuat' });
  const kunci = sesiIds.slice(0, BATAS_SESI_ASISTEN).join('|');

  useEffect(() => {
    if (!db || !asistenId || !kunci) return;

    const daftar = kunci.split('|');
    const terkumpul = new Map<string, IzinAsisten>();

    const pembersih = daftar.map((sesiId) =>
      dengarkanIzinSesi(db, sesiId, (data) => {
        if (!data.ok) {
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

        // Status selalu ditulis ulang dari snapshot terbaru, sehingga listener
        // yang pulih setelah gangguan tetap dipakai (bukan terkunci di "gagal").
        setHasil({ izin: [...terkumpul.values()], status: 'siap' });
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
