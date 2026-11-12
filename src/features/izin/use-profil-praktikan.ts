import { useEffect, useState } from 'react';
import type { Firestore } from 'firebase/firestore';

import { bacaProfilPraktikan } from '@/lib/izin-sesi';

type ProfilPraktikan = {
  nama?: string;
  nomorInduk?: string;
};

const KOSONG: ProfilPraktikan = {};

/**
 * Membaca identitas praktikan untuk layar detail asisten.
 *
 * Dipisah dari route karena AC US-04 nomor 5 melarang file route di `src/app/`
 * memanggil Firestore langsung. Kegagalan pembacaan tidak menggagalkan detail
 * izin, karena identitas hanya pelengkap tampilan.
 */
export function useProfilPraktikan(
  db: Firestore | null,
  praktikanId: string | undefined,
): ProfilPraktikan {
  const [profil, setProfil] = useState<ProfilPraktikan>(KOSONG);

  useEffect(() => {
    if (!db || !praktikanId) return;

    let dibatalkan = false;

    bacaProfilPraktikan(db, [praktikanId])
      .then((peta) => {
        if (!dibatalkan) setProfil(peta.get(praktikanId) ?? KOSONG);
      })
      .catch(() => {
        if (!dibatalkan) setProfil(KOSONG);
      });

    return () => {
      dibatalkan = true;
    };
  }, [db, praktikanId]);

  return profil;
}
