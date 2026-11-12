import { useEffect, useState } from 'react';
import type { Firestore } from 'firebase/firestore';

import { dengarkanSesiAsisten, type SesiPraktikan } from '@/lib/izin-sesi';

export type StatusMuat = 'memuat' | 'siap' | 'gagal';

type HasilSesi = {
  sesi: SesiPraktikan[];
  status: StatusMuat;
  pesanGalat?: string;
};

/** Sesi yang diampu satu asisten, terurut tanggal menurun. */
export function useSesiAsisten(db: Firestore | null, asistenId: string | undefined): HasilSesi {
  const [hasil, setHasil] = useState<HasilSesi>({ sesi: [], status: 'memuat' });
  const punyaSumber = Boolean(db && asistenId);

  useEffect(() => {
    if (!db || !asistenId) return;

    return dengarkanSesiAsisten(db, asistenId, (data) => {
      if (data.ok) {
        setHasil({ sesi: data.data, status: 'siap' });
        return;
      }

      setHasil({ sesi: [], status: 'gagal', pesanGalat: data.pesan });
    });
  }, [db, asistenId]);

  if (!punyaSumber) {
    return { sesi: [], status: 'gagal', pesanGalat: 'Data sesi belum tersedia' };
  }

  return hasil;
}
