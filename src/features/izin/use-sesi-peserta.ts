import { useEffect, useState } from 'react';
import type { Firestore } from 'firebase/firestore';

import { dengarkanIzinSesi } from '@/lib/izin';
import { bacaSesiPraktikan } from '@/lib/izin-sesi';

type HasilPeserta = {
  pesertaIds: string[];
  sudahAdaIzin: boolean;
  /** `false` selama data sesi atau izin belum tiba. */
  siap: boolean;
};

const BELUM_SIAP: HasilPeserta = { pesertaIds: [], sudahAdaIzin: false, siap: false };

/**
 * Menyediakan `pesertaIds` sesi dan status pengajuan milik `praktikanId`, bahan
 * untuk `bolehDiajukan`. Kedua sumber punya siklus hidup berbeda, jadi
 * `siap` baru `true` setelah keduanya terisi.
 *
 * State hanya diubah dari callback asinkron/listener, bukan langsung di badan
 * effect, sesuai aturan react-hooks/set-state-in-effect.
 */
export function useSesiPeserta(
  db: Firestore | null,
  sesiId: string | undefined,
  praktikanId: string | undefined,
): HasilPeserta {
  const [pesertaIds, setPesertaIds] = useState<string[]>();
  const [sudahAdaIzin, setSudahAdaIzin] = useState<boolean>();
  const kunci = db && sesiId && praktikanId ? `${sesiId}:${praktikanId}` : undefined;
  const [kunciTerakhir, setKunciTerakhir] = useState(kunci);

  // Ganti sesi berarti data lama tidak berlaku. Reset dilakukan saat render,
  // bukan di effect, supaya tidak ada render berantai.
  if (kunci !== kunciTerakhir) {
    setKunciTerakhir(kunci);
    setPesertaIds(undefined);
    setSudahAdaIzin(undefined);
  }

  useEffect(() => {
    if (!db || !sesiId) return;

    let dibatalkan = false;

    bacaSesiPraktikan(db, sesiId).then((hasil) => {
      if (dibatalkan) return;

      setPesertaIds(hasil.ok ? hasil.data.pesertaIds : []);
    });

    return () => {
      dibatalkan = true;
    };
  }, [db, sesiId]);

  useEffect(() => {
    if (!db || !sesiId || !praktikanId) return;

    return dengarkanIzinSesi(db, sesiId, (hasil) => {
      if (!hasil.ok) {
        setSudahAdaIzin(undefined);
        return;
      }

      setSudahAdaIzin(hasil.data.some((izin) => izin.praktikanId === praktikanId));
    });
  }, [db, sesiId, praktikanId]);

  const siap = pesertaIds !== undefined && sudahAdaIzin !== undefined;

  if (!siap) return BELUM_SIAP;

  return { pesertaIds: pesertaIds ?? [], sudahAdaIzin: sudahAdaIzin ?? false, siap };
}
