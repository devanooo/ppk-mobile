
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
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

export type DataLabSesi = {
  labId?: string;
  labNama?: string;
  labLatitude?: number;
  labLongitude?: number;
  labRadiusMeters?: number;
};

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
} & DataLabSesi;

export type HasilMuatSesi<T> =
  | { ok: true; data: T }
  | { ok: false; pesan: string };

export type HasilAksiSesi = {
  ok: boolean;
  pesan: string;
};

export type DataWaktuSesi = {
  hari: string;
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
};

type DataFormSesi = DataWaktuSesi &
  DataLabSesi & {
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

function ambilDataLab(data: DataLabSesi): DataLabSesi {
  if (
    !data.labId ||
    typeof data.labLatitude !== 'number' ||
    typeof data.labLongitude !== 'number' ||
    typeof data.labRadiusMeters !== 'number'
  ) {
    return {};
  }

  return {
    labId: data.labId,
    labNama: data.labNama ?? data.labId,
    labLatitude: data.labLatitude,
    labLongitude: data.labLongitude,
    labRadiusMeters: data.labRadiusMeters,
  };
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
    labId: typeof data.labId === 'string' ? data.labId : undefined,
    labNama: typeof data.labNama === 'string' ? data.labNama : undefined,
    labLatitude:
      typeof data.labLatitude === 'number' ? data.labLatitude : undefined,
    labLongitude:
      typeof data.labLongitude === 'number' ? data.labLongitude : undefined,
    labRadiusMeters:
      typeof data.labRadiusMeters === 'number'
        ? data.labRadiusMeters
        : undefined,
  };
}

function urutkanSesi(data: SesiFirestore[]): SesiFirestore[] {
  return [...data].sort((a, b) =>
    `${a.tanggal}T${a.jamMulai}`.localeCompare(
      `${b.tanggal}T${b.jamMulai}`,
    ),
  );
}

export function validasiWaktuSesi(data: DataWaktuSesi): HasilAksiSesi {
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
  const kelasAktif = new Set<string>();

  let berhenti = false;

  function kirimData() {
    if (berhenti) return;

    const semuaKelasSiap = Array.from(kelasAktif).every(
      (kelasId) => sesiSiap.has(kelasId),
    );

    if (!semuaKelasSiap) return;

    const semuaSesi = Array.from(sesiPerKelas.values()).flat();

    onData({
      ok: true,
      data: urutkanSesi(semuaSesi),
    });
  }

  function hentikanListenerKelas(kelasId: string) {
    berhentiSesi.get(kelasId)?.();

    berhentiSesi.delete(kelasId);
    sesiPerKelas.delete(kelasId);
    sesiSiap.delete(kelasId);
  }

  const berhentiKelas = onSnapshot(
    rujukanKelas,
    (snapshot) => {
      if (berhenti) return;

      const kelasIds = new Set(
        snapshot.docs.map((dokumen) => dokumen.id),
      );

      // Perbarui daftar kelas yang masih diikuti praktikan.
      kelasAktif.clear();

      for (const kelasId of kelasIds) {
        kelasAktif.add(kelasId);
      }

      // Hentikan hanya listener kelas yang sudah tidak diikuti.
      for (const kelasId of berhentiSesi.keys()) {
        if (!kelasIds.has(kelasId)) {
          hentikanListenerKelas(kelasId);
        }
      }

      // Buat listener terpisah untuk setiap kelas aktif.
      for (const kelasId of kelasIds) {
        if (berhentiSesi.has(kelasId)) continue;

        const rujukanSesi = query(
          collection(db, 'sesi'),
          where('kelasId', '==', kelasId),
        );

        const hentikan = onSnapshot(
          rujukanSesi,
          (hasilSesi) => {
            if (berhenti || !kelasAktif.has(kelasId)) return;

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
          async (galat) => {
            if (berhenti || !kelasAktif.has(kelasId)) return;

            const kode = (galat as { code?: string })?.code;

            if (kode === 'permission-denied') {
              try {
                // Periksa apakah praktikan benar-benar sudah
                // dikeluarkan dari kelas tersebut di Firestore.
                const dokumenKelas = await getDoc(
                  doc(db, 'kelas', kelasId),
                );

                if (berhenti || !kelasAktif.has(kelasId)) return;

                const pesertaIds = dokumenKelas.exists()
                  ? dokumenKelas.data().pesertaIds
                  : [];

                const masihTerdaftar =
                  Array.isArray(pesertaIds) &&
                  pesertaIds.includes(praktikanId);

                if (!masihTerdaftar) {
                  hentikanListenerKelas(kelasId);
                  kirimData();
                  return;
                }
              } catch (galatPemeriksaan) {
                if (berhenti) return;

                onData({
                  ok: false,
                  pesan: pesanDariGalat(galatPemeriksaan),
                });

                return;
              }
            }

            // Jika masih terdaftar tetapi akses ditolak,
            // laporkan error sebenarnya. Jangan sembunyikan
            // masalah Security Rules.
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
      // Error listener kelas tidak memiliki kelasId tertentu.
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
    kelasAktif.clear();
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
      ...ambilDataLab(data),
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
  ...dataLab
}: {
  db: Firestore;
  sesiId: string;
  asistenId: string;
  hari: string;
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
} & DataLabSesi): Promise<HasilAksiSesi> {
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
        ...ambilDataLab(dataLab),
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

/** Menghapus sesi yang belum dibuka dan tidak memiliki data terkait. */
export async function hapusSesi({
  db,
  sesiId,
  asistenId,
}: {
  db: Firestore;
  sesiId: string;
  asistenId: string;
}): Promise<HasilAksiSesi> {
  try {
    const rujukanSesi = doc(db, 'sesi', sesiId);

    const [dataPresensi, dataIzin] = await Promise.all([
      getDocs(
        query(
          collection(db, 'sesi', sesiId, 'presensi'),
          limit(1),
        ),
      ),
      getDocs(
        query(
          collection(db, 'sesi', sesiId, 'izin'),
          limit(1),
        ),
      ),
    ]);

    if (!dataPresensi.empty || !dataIzin.empty) {
      return {
        ok: false,
        pesan:
          'Sesi tidak dapat dihapus karena masih memiliki data presensi atau izin.',
      };
    }

    await runTransaction(db, async (transaksi) => {
      const dokumen = await transaksi.get(rujukanSesi);

      if (!dokumen.exists()) {
        throw new Error('SESI_TIDAK_DITEMUKAN');
      }

      const sesi = dokumen.data();

      if (sesi.asistenId !== asistenId) {
        throw new Error('BUKAN_PEMILIK_SESI');
      }

      if (sesi.status !== 'belum-dibuka') {
        throw new Error('SESI_TIDAK_DAPAT_DIHAPUS');
      }

      transaksi.delete(rujukanSesi);
    });

    return {
      ok: true,
      pesan: 'Sesi berhasil dihapus',
    };
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

      if (galat.message === 'SESI_TIDAK_DAPAT_DIHAPUS') {
        return {
          ok: false,
          pesan: 'Hanya sesi yang belum dibuka yang dapat dihapus',
        };
      }
    }

    return {
      ok: false,
      pesan: pesanDariGalat(galat),
    };
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
