import { useEffect, useState } from 'react';
import type { Firestore } from 'firebase/firestore';

import { dengarkanSesiPraktikan, type SesiPraktikan } from '@/lib/izin-sesi';

export type StatusMuat = 'memuat' | 'siap' | 'gagal';

type HasilSesi = {
  sesi: SesiPraktikan[];
  status: StatusMuat;
  pesanGalat?: string;
};

/**
 * Membungkus listener sesi praktikan dengan state memuat dan gagal, lalu
 * membersihkan listener saat unmount (sprint-2 bagian 8.4).
 *
 * Tanpa `db` (T-016 belum ada) atau `praktikanId`, hasilnya diturunkan langsung
 * sebagai `gagal` alih-alih memanggil setState di dalam effect. State hanya
 * berubah dari callback listener, sesuai aturan react-hooks/set-state-in-effect.
 */
export function useSesiPraktikan(db: Firestore | null, praktikanId?: string): HasilSesi {
  const [hasil, setHasil] = useState<HasilSesi>({ sesi: [], status: 'memuat' });
  const siapDipakai = Boolean(db && praktikanId);

  useEffect(() => {
    if (!db || !praktikanId) return;

    const bersihkan = dengarkanSesiPraktikan(db, praktikanId, (data) => {
      if (data.ok) {
        setHasil({ sesi: data.data, status: 'siap' });
        return;
      }

      setHasil({ sesi: [], status: 'gagal', pesanGalat: data.pesan });
    });

    return bersihkan;
  }, [db, praktikanId]);

  if (!siapDipakai) {
    return { sesi: [], status: 'gagal', pesanGalat: 'Data sesi belum tersedia' };
  }

  return hasil;
}
