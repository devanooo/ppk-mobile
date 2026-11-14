import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  where,
  type Firestore,
  type Timestamp,
} from 'firebase/firestore';

import { pesanDariGalat } from './izin-aturan';

export type StatusSesi = 'belum-dibuka' | 'dibuka' | 'ditutup';

export type SesiFirestore = {
  id: string;
  kelasId: string;
  asistenId: string;
  hari: string;
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
  status: StatusSesi;
  dibuatPada: Date;
  dibukaPada?: Date;
  ditutupPada?: Date;
};

export type HasilMuatSesi<T> =
  | { ok: true; data: T }
  | { ok: false; pesan: string };

export type HasilAksiSesi = {
  ok: boolean;
  pesan: string;
};

type DataWaktuSesi = {
  hari: string;
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
};

type DataFormSesi = DataWaktuSesi & {
  kelasId: string;
  asistenId: string;
};

function ubahWaktu(waktu: unknown): Date | undefined {
  if (
    waktu &&
    typeof (waktu as Timestamp).toDate === 'function'
  ) {
    return (waktu as Timestamp).toDate();
  }

  return undefined;
}

function keSesi(
  id: string,
  data: Record<string, unknown>,
): SesiFirestore {
  return {
    id,
    kelasId: String(data.kelasId ?? ''),
    asistenId: String(data.asistenId ?? ''),
    hari: String(data.hari ?? ''),
    tanggal: String(data.tanggal ?? ''),
    jamMulai: String(data.jamMulai ?? ''),
    jamSelesai: String(data.jamSelesai ?? ''),
    status: (data.status as StatusSesi) ?? 'belum-dibuka',
    dibuatPada: ubahWaktu(data.dibuatPada) ?? new Date(0),
    dibukaPada: ubahWaktu(data.dibukaPada),
    ditutupPada: ubahWaktu(data.ditutupPada),
  };
}

function urutkanSesi(data: SesiFirestore[]): SesiFirestore[] {
  return [...data].sort((a, b) =>
    `${a.tanggal}T${a.jamMulai}`.localeCompare(
      `${b.tanggal}T${b.jamMulai}`,
    ),
  );
}

function validasiWaktuSesi(data: DataWaktuSesi): HasilAksiSesi {
  if (!data.hari.trim() || !data.tanggal.trim()) {
    return { ok: false, pesan: 'Hari dan tanggal wajib diisi' };
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.tanggal)) {
    return { ok: false, pesan: 'Format tanggal tidak valid' };
  }

  const [tahun, bulan, tanggal] = data.tanggal.split('-').map(Number);
  const tanggalValid = new Date(Date.UTC(tahun, bulan - 1, tanggal));

  if (
    tanggalValid.getUTCFullYear() !== tahun ||
    tanggalValid.getUTCMonth() !== bulan - 1 ||
    tanggalValid.getUTCDate() !== tanggal
  ) {
    return { ok: false, pesan: 'Tanggal tidak valid' };
  }

  if (
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(data.jamMulai) ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(data.jamSelesai)
  ) {
    return { ok: false, pesan: 'Format jam tidak valid' };
  }

  if (data.jamMulai >= data.jamSelesai) {
    return {
      ok: false,
      pesan: 'Jam selesai harus setelah jam mulai',
    };
  }

  return { ok: true, pesan: 'Data sesi valid' };
}

function validasiSesi(data: DataFormSesi): HasilAksiSesi {
  if (!data.kelasId.trim()) {
    return { ok: false, pesan: 'Kelas belum dipilih' };
  }

  return validasiWaktuSesi(data);
}

/** Mendengarkan daftar sesi milik asisten. */
export function dengarkanSesiAsisten(
  db: Firestore,
  asistenId: string,
  onData: (hasil: HasilMuatSesi<SesiFirestore[]>) => void,
): () => void {
  const rujukan = query(
    collection(db, 'sesi'),
    where('asistenId', '==', asistenId),
  );

  return onSnapshot(
    rujukan,
    (snapshot) => {
      const data = snapshot.docs.map((dokumen) =>
        keSesi(
          dokumen.id,
          dokumen.data() as Record<string, unknown>,
        ),
      );

      onData({ ok: true, data: urutkanSesi(data) });
    },
    (galat) => {
      onData({ ok: false, pesan: pesanDariGalat(galat) });
    },
  );
}

/** Mendengarkan satu sesi berdasarkan ID. */
export function dengarkanSesiById(
  db: Firestore,
  sesiId: string,
  onData: (hasil: HasilMuatSesi<SesiFirestore | null>) => void,
): () => void {
  return onSnapshot(
    doc(db, 'sesi', sesiId),
    (snapshot) => {
      if (!snapshot.exists()) {
        onData({ ok: true, data: null });
        return;
      }

      onData({
        ok: true,
        data: keSesi(
          snapshot.id,
          snapshot.data() as Record<string, unknown>,
        ),
      });
    },
    (galat) => {
      onData({
        ok: false,
        pesan: pesanDariGalat(galat),
      });
    },
  );
}

/** Mendengarkan sesi dari seluruh kelas yang diikuti praktikan. */
export function dengarkanSesiPraktikan(
  db: Firestore,
  praktikanId: string,
  onData: (hasil: HasilMuatSesi<SesiFirestore[]>) => void,
): () => void {
  const rujukanKelas = query(
    collection(db, 'kelas'),
    where('pesertaIds', 'array-contains', praktikanId),
  );

  const berhentiSesi = new Map<string, () => void>();
  const sesiPerKelas = new Map<string, SesiFirestore[]>();
  const sesiSiap = new Set<string>();

  let berhenti = false;

  function kirimData() {
    if (berhenti) return;

    const semuaKelasSiap = Array.from(berhentiSesi.keys()).every(
      (kelasId) => sesiSiap.has(kelasId),
    );

    if (!semuaKelasSiap) return;

    const semuaSesi = Array.from(sesiPerKelas.values()).flat();

    onData({
      ok: true,
      data: urutkanSesi(semuaSesi),
    });
  }

  const berhentiKelas = onSnapshot(
    rujukanKelas,
    (snapshot) => {
      if (berhenti) return;

      const kelasIds = new Set(snapshot.docs.map((dokumen) => dokumen.id));

      // Hentikan listener untuk kelas yang sudah tidak diikuti.
      for (const [kelasId, hentikan] of berhentiSesi) {
        if (!kelasIds.has(kelasId)) {
          hentikan();
          berhentiSesi.delete(kelasId);
          sesiPerKelas.delete(kelasId);
          sesiSiap.delete(kelasId);
        }
      }

      // Pasang listener untuk kelas yang baru diikuti.
      for (const kelasId of kelasIds) {
        if (berhentiSesi.has(kelasId)) continue;

        const rujukanSesi = query(
          collection(db, 'sesi'),
          where('kelasId', '==', kelasId),
        );

        const hentikan = onSnapshot(
          rujukanSesi,
          (hasilSesi) => {
            if (berhenti) return;

            const data = hasilSesi.docs.map((dokumen) =>
              keSesi(
                dokumen.id,
                dokumen.data() as Record<string, unknown>,
              ),
            );

            sesiPerKelas.set(kelasId, data);
            sesiSiap.add(kelasId);

            kirimData();
          },
          (galat) => {
            if (berhenti) return;

            onData({
              ok: false,
              pesan: pesanDariGalat(galat),
            });
          },
        );

        berhentiSesi.set(kelasId, hentikan);
      }

      kirimData();
    },
    (galat) => {
      if (berhenti) return;

      onData({
        ok: false,
        pesan: pesanDariGalat(galat),
      });
    },
  );

  return () => {
    berhenti = true;
    berhentiKelas();

    for (const hentikan of berhentiSesi.values()) {
      hentikan();
    }

    berhentiSesi.clear();
    sesiPerKelas.clear();
    sesiSiap.clear();
  };
}

/** Membuat sesi baru pada kelas milik asisten. */
export async function buatSesi({
  db,
  ...data
}: {
  db: Firestore;
} & DataFormSesi): Promise<HasilAksiSesi> {
  const validasi = validasiSesi(data);
  if (!validasi.ok) return validasi;

  try {
    const dokumenKelas = await getDoc(
      doc(db, 'kelas', data.kelasId),
    );

    if (!dokumenKelas.exists()) {
      return { ok: false, pesan: 'Kelas tidak ditemukan' };
    }

    if (dokumenKelas.data().asistenId !== data.asistenId) {
      return {
        ok: false,
        pesan: 'Kamu tidak memiliki akses ke kelas ini',
      };
    }

    await addDoc(collection(db, 'sesi'), {
      kelasId: data.kelasId,
      asistenId: data.asistenId,
      hari: data.hari.trim(),
      tanggal: data.tanggal,
      jamMulai: data.jamMulai,
      jamSelesai: data.jamSelesai,
      status: 'belum-dibuka',
      dibuatPada: serverTimestamp(),
    });

    return { ok: true, pesan: 'Sesi berhasil dibuat' };
  } catch (galat) {
    return { ok: false, pesan: pesanDariGalat(galat) };
  }
}

/** Mengubah sesi yang belum dibuka. */
export async function ubahSesi({
  db,
  sesiId,
  asistenId,
  hari,
  tanggal,
  jamMulai,
  jamSelesai,
}: {
  db: Firestore;
  sesiId: string;
  asistenId: string;
  hari: string;
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
}): Promise<HasilAksiSesi> {
  const validasi = validasiWaktuSesi({
    hari,
    tanggal,
    jamMulai,
    jamSelesai,
  });

  if (!validasi.ok) return validasi;

  try {
    await runTransaction(db, async (transaksi) => {
      const rujukan = doc(db, 'sesi', sesiId);
      const dokumen = await transaksi.get(rujukan);

      if (!dokumen.exists()) {
        throw new Error('SESI_TIDAK_DITEMUKAN');
      }

      const sesi = dokumen.data();

      if (sesi.asistenId !== asistenId) {
        throw new Error('BUKAN_PEMILIK_SESI');
      }

      if (sesi.status !== 'belum-dibuka') {
        throw new Error('SESI_TIDAK_DAPAT_DIEDIT');
      }

      transaksi.update(rujukan, {
        hari: hari.trim(),
        tanggal,
        jamMulai,
        jamSelesai,
      });
    });

    return { ok: true, pesan: 'Sesi berhasil diperbarui' };
  } catch (galat) {
    if (galat instanceof Error) {
      if (galat.message === 'SESI_TIDAK_DITEMUKAN') {
        return { ok: false, pesan: 'Sesi tidak ditemukan' };
      }

      if (galat.message === 'BUKAN_PEMILIK_SESI') {
        return {
          ok: false,
          pesan: 'Kamu tidak memiliki akses ke sesi ini',
        };
      }

      if (galat.message === 'SESI_TIDAK_DAPAT_DIEDIT') {
        return {
          ok: false,
          pesan: 'Sesi yang sudah dibuka tidak dapat diubah',
        };
      }
    }

    return { ok: false, pesan: pesanDariGalat(galat) };
  }
}

/** Membuka sesi yang statusnya masih belum dibuka. */
export async function bukaSesi({
  db,
  sesiId,
  asistenId,
}: {
  db: Firestore;
  sesiId: string;
  asistenId: string;
}): Promise<HasilAksiSesi> {
  try {
    await runTransaction(db, async (transaksi) => {
      const rujukan = doc(db, 'sesi', sesiId);
      const dokumen = await transaksi.get(rujukan);

      if (!dokumen.exists()) {
        throw new Error('SESI_TIDAK_DITEMUKAN');
      }

      const sesi = dokumen.data();

      if (sesi.asistenId !== asistenId) {
        throw new Error('BUKAN_PEMILIK_SESI');
      }

      if (sesi.status !== 'belum-dibuka') {
        throw new Error('TRANSISI_TIDAK_VALID');
      }

      transaksi.update(rujukan, {
        status: 'dibuka',
        dibukaPada: serverTimestamp(),
      });
    });

    return { ok: true, pesan: 'Sesi berhasil dibuka' };
  } catch (galat) {
    if (galat instanceof Error) {
      if (galat.message === 'SESI_TIDAK_DITEMUKAN') {
        return { ok: false, pesan: 'Sesi tidak ditemukan' };
      }

      if (galat.message === 'BUKAN_PEMILIK_SESI') {
        return {
          ok: false,
          pesan: 'Kamu tidak memiliki akses ke sesi ini',
        };
      }

      if (galat.message === 'TRANSISI_TIDAK_VALID') {
        return {
          ok: false,
          pesan: 'Hanya sesi yang belum dibuka yang dapat dibuka',
        };
      }
    }

    return { ok: false, pesan: pesanDariGalat(galat) };
  }
}

/** Menutup sesi yang sedang dibuka. */
export async function tutupSesi({
  db,
  sesiId,
  asistenId,
}: {
  db: Firestore;
  sesiId: string;
  asistenId: string;
}): Promise<HasilAksiSesi> {
  try {
    await runTransaction(db, async (transaksi) => {
      const rujukan = doc(db, 'sesi', sesiId);
      const dokumen = await transaksi.get(rujukan);

      if (!dokumen.exists()) {
        throw new Error('SESI_TIDAK_DITEMUKAN');
      }

      const sesi = dokumen.data();

      if (sesi.asistenId !== asistenId) {
        throw new Error('BUKAN_PEMILIK_SESI');
      }

      if (sesi.status !== 'dibuka') {
        throw new Error('TRANSISI_TIDAK_VALID');
      }

      transaksi.update(rujukan, {
        status: 'ditutup',
        ditutupPada: serverTimestamp(),
      });
    });

    return { ok: true, pesan: 'Sesi berhasil ditutup' };
  } catch (galat) {
    if (galat instanceof Error) {
      if (galat.message === 'SESI_TIDAK_DITEMUKAN') {
        return { ok: false, pesan: 'Sesi tidak ditemukan' };
      }

      if (galat.message === 'BUKAN_PEMILIK_SESI') {
        return {
          ok: false,
          pesan: 'Kamu tidak memiliki akses ke sesi ini',
        };
      }

      if (galat.message === 'TRANSISI_TIDAK_VALID') {
        return {
          ok: false,
          pesan: 'Hanya sesi yang sedang dibuka yang dapat ditutup',
        };
      }
    }

    return { ok: false, pesan: pesanDariGalat(galat) };
  }
}
