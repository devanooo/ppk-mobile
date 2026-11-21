import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Firestore } from 'firebase/firestore';

import type { SesiFirestore } from '@/lib/sesi';
import type { Peran } from '@/types';

import {
  dengarkanAktivitasAsisten,
  dengarkanAktivitasPraktikan,
  type HasilAktivitasMentah,
} from '../services/activity-service';
import type {
  HasilAktivitas,
  KelasAktivitas,
  StatusAktivitas,
} from '../types/activity';
import type { LaboratoryId } from '../types/laboratory';
import { pilihAktivitas } from '../utils/activity';

type DataAktivitas = {
  kelas: KelasAktivitas[];
  sesi: SesiFirestore[];
};

export type HasilHookAktivitas = HasilAktivitas & {
  status: StatusAktivitas;
  pesanGalat?: string;
  retry: () => void;
};

const DATA_KOSONG: DataAktivitas = {
  kelas: [],
  sesi: [],
};

const HASIL_KOSONG: HasilAktivitas = {
  saatIni: null,
  berikutnya: null,
};

/**
 * Satu sumber data aktivitas Maps. Listener dipilih dari peran akun yang
 * sedang login, lalu hasilnya difilter ke laboratorium yang dipilih.
 */
export function useAktivitasLaboratorium({
  db,
  userId,
  peran,
  labId,
}: {
  db: Firestore | null;
  userId?: string;
  peran?: Peran;
  labId: LaboratoryId | null;
}): HasilHookAktivitas {
  const [data, setData] = useState<DataAktivitas>(DATA_KOSONG);
  const [status, setStatus] = useState<StatusAktivitas>('memuat');
  const [pesanGalat, setPesanGalat] = useState<string>();
  const [percobaan, setPercobaan] = useState(0);

  const retry = useCallback(() => {
    setStatus('memuat');
    setPesanGalat(undefined);
    setPercobaan((nilai) => nilai + 1);
  }, []);

  useEffect(() => {
    if (!db || !userId || !peran) {
      return;
    }

    let aktif = true;

    const tangani = (hasil: HasilAktivitasMentah) => {
      if (!aktif) return;

      if (hasil.ok) {
        setData({ kelas: hasil.kelas, sesi: hasil.sesi });
        setStatus('siap');
        setPesanGalat(undefined);
        return;
      }

      setStatus('gagal');
      setPesanGalat(hasil.pesan);
    };

    const berhenti =
      peran === 'asisten'
        ? dengarkanAktivitasAsisten(db, userId, tangani)
        : dengarkanAktivitasPraktikan(db, userId, tangani);

    return () => {
      aktif = false;
      berhenti();
    };
  }, [db, userId, peran, percobaan]);

  const hasil = useMemo(
    () => pilihAktivitas(data.sesi, data.kelas, labId),
    [data, labId],
  );

  if (!db || !userId || !peran) {
    return {
      ...HASIL_KOSONG,
      status: 'gagal',
      pesanGalat: 'Data akun belum tersedia.',
      retry,
    };
  }

  return {
    ...hasil,
    status,
    pesanGalat,
    retry,
  };
}
