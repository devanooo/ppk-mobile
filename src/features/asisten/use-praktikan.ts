import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  query,
  where,
  type Firestore,
} from 'firebase/firestore';

import { pesanDariGalat } from '@/lib/izin-aturan';
import { userConverter } from '@/lib/konversi';
import type { UserFirestore } from '@/types/firestore';

export type Praktikan = UserFirestore & {
  id: string;
};

type StatusMuatPraktikan = 'memuat' | 'siap' | 'gagal';

type HasilPraktikan = {
  praktikan: Praktikan[];
  status: StatusMuatPraktikan;
  pesanGalat?: string;
};

export function usePraktikan(db: Firestore): HasilPraktikan {
  const [hasil, setHasil] = useState<HasilPraktikan>({
    praktikan: [],
    status: 'memuat',
  });

  useEffect(() => {
    const rujukan = query(
      collection(db, 'users').withConverter(userConverter),
      where('peran', '==', 'praktikan'),
    );

    return onSnapshot(
      rujukan,
      (snapshot) => {
        const data = snapshot.docs
          .map((dokumen) => ({
            id: dokumen.id,
            ...dokumen.data(),
          }))
          .sort((a, b) => a.nama.localeCompare(b.nama));

        setHasil({
          praktikan: data,
          status: 'siap',
        });
      },
      (galat) => {
        setHasil({
          praktikan: [],
          status: 'gagal',
          pesanGalat: pesanDariGalat(galat),
        });
      },
    );
  }, [db]);

  return hasil;
}
