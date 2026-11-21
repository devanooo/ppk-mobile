import {
  collection,
  onSnapshot,
  query,
  where,
  type Firestore,
} from 'firebase/firestore';

import { pesanDariGalat } from '@/lib/izin-aturan';
import {
  dengarkanKelasAsisten,
  type Kelas,
} from '@/lib/kelas';
import {
  dengarkanSesiAsisten,
  dengarkanSesiPraktikan,
  type SesiFirestore,
} from '@/lib/sesi';

import type { KelasAktivitas } from '../types/activity';

export type HasilAktivitasMentah =
  | {
      ok: true;
      sesi: SesiFirestore[];
      kelas: KelasAktivitas[];
    }
  | { ok: false; pesan: string };

function petakanKelas(kelas: Kelas[]): KelasAktivitas[] {
  return kelas.map((item) => ({
    id: item.id,
    nama: item.nama,
    lab: item.lab,
  }));
}

/**
 * Sesi asisten beserta kelasnya. `dengarkanSesiAsisten` tidak membawa nama
 * kelas dan lab, jadi keduanya digabung dari listener kelas milik asisten.
 */
export function dengarkanAktivitasAsisten(
  db: Firestore,
  asistenId: string,
  onData: (hasil: HasilAktivitasMentah) => void,
): () => void {
  let kelas: KelasAktivitas[] | null = null;
  let sesi: SesiFirestore[] | null = null;
  let gagal = false;

  const kirim = () => {
    if (gagal || !kelas || !sesi) return;

    onData({ ok: true, kelas, sesi });
  };

  const berhentiKelas = dengarkanKelasAsisten(
    db,
    asistenId,
    (hasil) => {
      if (gagal) return;

      if (!hasil.ok) {
        gagal = true;
        onData({ ok: false, pesan: hasil.pesan });
        return;
      }

      kelas = petakanKelas(hasil.data);
      kirim();
    },
  );

  const berhentiSesi = dengarkanSesiAsisten(
    db,
    asistenId,
    (hasil) => {
      if (gagal) return;

      if (!hasil.ok) {
        gagal = true;
        onData({ ok: false, pesan: hasil.pesan });
        return;
      }

      sesi = hasil.data;
      kirim();
    },
  );

  return () => {
    berhentiKelas();
    berhentiSesi();
  };
}

/**
 * Sesi praktikan beserta kelasnya. `dengarkanSesiPraktikan` sudah memantau
 * keanggotaan kelas, sedangkan listener kelas di sini menyediakan nama dan lab
 * terbaru untuk ditampilkan pada aktivitas.
 */
export function dengarkanAktivitasPraktikan(
  db: Firestore,
  praktikanId: string,
  onData: (hasil: HasilAktivitasMentah) => void,
): () => void {
  let kelas: KelasAktivitas[] | null = null;
  let sesi: SesiFirestore[] | null = null;
  let gagal = false;

  const kirim = () => {
    if (gagal || !kelas || !sesi) return;

    onData({ ok: true, kelas, sesi });
  };

  const rujukanKelas = query(
    collection(db, 'kelas'),
    where('pesertaIds', 'array-contains', praktikanId),
  );

  const berhentiKelas = onSnapshot(
    rujukanKelas,
    (snapshot) => {
      if (gagal) return;

      kelas = snapshot.docs.map((dokumen) => {
        const data = dokumen.data();

        return {
          id: dokumen.id,
          nama: String(data.nama ?? ''),
          lab: String(data.lab ?? ''),
        };
      });

      kirim();
    },
    (galat) => {
      if (gagal) return;

      gagal = true;
      onData({
        ok: false,
        pesan: pesanDariGalat(
          galat,
          'Kelas praktikan gagal dimuat',
        ),
      });
    },
  );

  const berhentiSesi = dengarkanSesiPraktikan(
    db,
    praktikanId,
    (hasil) => {
      if (gagal) return;

      if (!hasil.ok) {
        gagal = true;
        onData({ ok: false, pesan: hasil.pesan });
        return;
      }

      sesi = hasil.data;
      kirim();
    },
  );

  return () => {
    berhentiKelas();
    berhentiSesi();
  };
}
