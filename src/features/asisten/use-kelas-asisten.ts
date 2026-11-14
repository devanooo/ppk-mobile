import { useEffect, useState } from 'react';
import type { Firestore } from 'firebase/firestore';

import {
  dengarkanKelasAsisten,
  type Kelas,
} from '@/lib/kelas';

export type StatusMuatKelas = 'memuat' | 'siap' | 'gagal';

type HasilKelas = {
  kelas: Kelas[];
  status: StatusMuatKelas;
  pesanGalat?: string;
};

export function useKelasAsisten(
  db: Firestore | null,
  asistenId: string | undefined,
): HasilKelas {
  const [hasil, setHasil] = useState<HasilKelas>({
    kelas: [],
    status: 'memuat',
  });

  useEffect(() => {
    if (!db || !asistenId) return;

    return dengarkanKelasAsisten(db, asistenId, (data) => {
      if (data.ok) {
        setHasil({
          kelas: data.data,
          status: 'siap',
        });
        return;
      }

      setHasil({
        kelas: [],
        status: 'gagal',
        pesanGalat: data.pesan,
      });
    });
  }, [db, asistenId]);

  if (!db || !asistenId) {
    return {
      kelas: [],
      status: 'gagal',
      pesanGalat: 'Data kelas belum tersedia',
    };
  }

  return hasil;
}
