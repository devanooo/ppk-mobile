import { useEffect, useState } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  type Firestore,
  type Timestamp,
} from 'firebase/firestore';

import {
  dengarkanSesiPraktikan,
  type SesiFirestore,
} from '@/lib/sesi';
import { pesanDariGalat } from '@/lib/izin-aturan';
import type { StatusIzinFirestore } from '@/types/firestore';

import type { JadwalPraktikan } from './use-jadwal-praktikan';

export type StatusKehadiran = 'hadir' | 'izin' | 'tidak-hadir';

export type PraktikumRiwayat = {
  id: string;
  nama: string;
};

export type RiwayatKehadiran = {
  sesi: JadwalPraktikan;
  waktu: Date | null;
  status: StatusKehadiran;
  izin?: StatusIzinFirestore;
  minggu: number;
};

type HasilRiwayat = {
  riwayat: RiwayatKehadiran[];
  praktikum: PraktikumRiwayat[];
  status: 'memuat' | 'siap' | 'gagal';
  pesanGalat?: string;
};

type DataKelas = {
  nama: string;
  lab: string;
};

const HASIL_MEMUAT: HasilRiwayat = {
  riwayat: [],
  praktikum: [],
  status: 'memuat',
};

const HASIL_GAGAL: HasilRiwayat = {
  riwayat: [],
  praktikum: [],
  status: 'gagal',
  pesanGalat: 'Data praktikan belum tersedia.',
};

function ubahWaktu(waktu: unknown): Date | null {
  if (
    waktu &&
    typeof (waktu as Timestamp).toDate === 'function'
  ) {
    return (waktu as Timestamp).toDate();
  }

  return null;
}

function bacaStatusIzin(nilai: unknown): StatusIzinFirestore {
  if (nilai === 'disetujui' || nilai === 'ditolak') {
    return nilai;
  }

  return 'menunggu';
}

function tentukanStatus(
  waktu: Date | null,
  izin: StatusIzinFirestore | null,
): StatusKehadiran {
  if (waktu) return 'hadir';
  if (izin === 'disetujui' || izin === 'menunggu') return 'izin';
  return 'tidak-hadir';
}

function hitungMingguPerKelas(
  daftarSesi: SesiFirestore[],
): Map<string, number> {
  const perKelas = new Map<string, SesiFirestore[]>();

  for (const sesi of daftarSesi) {
    const daftar = perKelas.get(sesi.kelasId) ?? [];
    daftar.push(sesi);
    perKelas.set(sesi.kelasId, daftar);
  }

  const hasil = new Map<string, number>();

  for (const daftar of perKelas.values()) {
    const urut = [...daftar].sort((a, b) =>
      `${a.tanggal}T${a.jamMulai}`.localeCompare(
        `${b.tanggal}T${b.jamMulai}`,
      ),
    );

    urut.forEach((sesi, indeks) => hasil.set(sesi.id, indeks + 1));
  }

  return hasil;
}

function sesiSudahBerakhir(
  sesi: SesiFirestore,
  sekarang: Date,
): boolean {
  if (sesi.status === 'ditutup') return true;

  const selesai = new Date(
    `${sesi.tanggal}T${sesi.jamSelesai}:00`,
  );

  return (
    !Number.isNaN(selesai.getTime()) &&
    selesai.getTime() < sekarang.getTime()
  );
}

function susunPraktikum(
  daftarKelas: Map<string, DataKelas>,
): PraktikumRiwayat[] {
  return Array.from(daftarKelas.entries())
    .map(([id, data]) => ({ id, nama: data.nama }))
    .filter((praktikum) => praktikum.nama.trim().length > 0)
    .sort((a, b) => a.nama.localeCompare(b.nama, 'id'));
}

export function useRiwayatKehadiran(
  db: Firestore | null,
  praktikanId: string | undefined,
): HasilRiwayat {
  const [hasil, setHasil] = useState<HasilRiwayat>(
    HASIL_MEMUAT,
  );

  useEffect(() => {
    if (!db || !praktikanId) {
      return;
    }

    let berhenti = false;
    let kelasSiap = false;
    let sesiSiap = false;
    let gagal = false;

    let daftarKelas = new Map<string, DataKelas>();
    let daftarSesi: SesiFirestore[] = [];

    const waktuPresensi = new Map<string, Date | null>();
    const presensiSiap = new Set<string>();
    const listenerPresensi = new Map<string, () => void>();

    const izinPerSesi = new Map<string, StatusIzinFirestore | null>();
    const izinSiap = new Set<string>();
    const listenerIzin = new Map<string, () => void>();

    function perbaruiRiwayat() {
      if (berhenti || gagal || !kelasSiap || !sesiSiap) {
        return;
      }

      const semuaPresensiSiap = daftarSesi.every((sesi) =>
        presensiSiap.has(sesi.id),
      );
      const semuaIzinSiap = daftarSesi.every((sesi) =>
        izinSiap.has(sesi.id),
      );

      if (!semuaPresensiSiap || !semuaIzinSiap) return;

      const sekarang = new Date();
      const mingguPerSesi = hitungMingguPerKelas(daftarSesi);
      const riwayat: RiwayatKehadiran[] = [];

      for (const sesi of daftarSesi) {
        const kelas = daftarKelas.get(sesi.kelasId);

        if (!kelas) continue;

        const waktu = waktuPresensi.get(sesi.id) ?? null;
        const izin = izinPerSesi.get(sesi.id) ?? null;
        const adaRiwayat = waktu !== null || izin !== null;

        if (!adaRiwayat && !sesiSudahBerakhir(sesi, sekarang)) {
          continue;
        }

        riwayat.push({
          sesi: {
            ...sesi,
            namaKelas: kelas.nama,
            lab: kelas.lab,
          },
          waktu,
          status: tentukanStatus(waktu, izin),
          izin: izin ?? undefined,
          minggu: mingguPerSesi.get(sesi.id) ?? 1,
        });
      }

      riwayat.sort((a, b) =>
        `${b.sesi.tanggal}T${b.sesi.jamMulai}`.localeCompare(
          `${a.sesi.tanggal}T${a.sesi.jamMulai}`,
        ),
      );

      setHasil({
        riwayat,
        praktikum: susunPraktikum(daftarKelas),
        status: 'siap',
      });
    }

    function tampilkanGalat(pesan: string) {
      if (berhenti) return;

      gagal = true;

      setHasil({
        riwayat: [],
        praktikum: [],
        status: 'gagal',
        pesanGalat: pesan,
      });
    }

    const berhentiKelas = onSnapshot(
      query(
        collection(db, 'kelas'),
        where('pesertaIds', 'array-contains', praktikanId),
      ),
      (snapshot) => {
        if (berhenti) return;

        daftarKelas = new Map(
          snapshot.docs.map((dokumen) => {
            const data = dokumen.data();

            return [
              dokumen.id,
              {
                nama: String(data.nama ?? ''),
                lab: String(data.lab ?? ''),
              },
            ];
          }),
        );

        kelasSiap = true;
        perbaruiRiwayat();
      },
      (galat) => tampilkanGalat(pesanDariGalat(galat)),
    );

    const berhentiSesi = dengarkanSesiPraktikan(
      db,
      praktikanId,
      (hasilSesi) => {
        if (berhenti) return;

        if (!hasilSesi.ok) {
          tampilkanGalat(hasilSesi.pesan);
          return;
        }

        daftarSesi = hasilSesi.data;
        sesiSiap = true;

        const idSesiAktif = new Set(
          daftarSesi.map((sesi) => sesi.id),
        );

        for (const [sesiId, hentikan] of listenerPresensi) {
          if (!idSesiAktif.has(sesiId)) {
            hentikan();
            listenerPresensi.delete(sesiId);
            waktuPresensi.delete(sesiId);
            presensiSiap.delete(sesiId);
          }
        }

        for (const [sesiId, hentikan] of listenerIzin) {
          if (!idSesiAktif.has(sesiId)) {
            hentikan();
            listenerIzin.delete(sesiId);
            izinPerSesi.delete(sesiId);
            izinSiap.delete(sesiId);
          }
        }

        for (const sesi of daftarSesi) {
          if (!listenerPresensi.has(sesi.id)) {
            const hentikan = onSnapshot(
              doc(
                db,
                'sesi',
                sesi.id,
                'presensi',
                praktikanId,
              ),
              (snapshot) => {
                if (berhenti) return;

                waktuPresensi.set(
                  sesi.id,
                  snapshot.exists()
                    ? ubahWaktu(snapshot.data()?.waktu)
                    : null,
                );

                presensiSiap.add(sesi.id);
                perbaruiRiwayat();
              },
              (galat) => tampilkanGalat(pesanDariGalat(galat)),
            );

            listenerPresensi.set(sesi.id, hentikan);
          }

          if (!listenerIzin.has(sesi.id)) {
            const hentikan = onSnapshot(
              doc(db, 'sesi', sesi.id, 'izin', praktikanId),
              (snapshot) => {
                if (berhenti) return;

                izinPerSesi.set(
                  sesi.id,
                  snapshot.exists()
                    ? bacaStatusIzin(snapshot.data()?.status)
                    : null,
                );

                izinSiap.add(sesi.id);
                perbaruiRiwayat();
              },
              (galat) => tampilkanGalat(pesanDariGalat(galat)),
            );

            listenerIzin.set(sesi.id, hentikan);
          }
        }

        perbaruiRiwayat();
      },
    );

    return () => {
      berhenti = true;
      berhentiKelas();
      berhentiSesi();

      for (const hentikan of listenerPresensi.values()) {
        hentikan();
      }

      for (const hentikan of listenerIzin.values()) {
        hentikan();
      }

      listenerPresensi.clear();
      waktuPresensi.clear();
      presensiSiap.clear();
      listenerIzin.clear();
      izinPerSesi.clear();
      izinSiap.clear();
    };
  }, [db, praktikanId]);

  if (!db || !praktikanId) {
    return HASIL_GAGAL;
  }

  return hasil;
}
