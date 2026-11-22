import type { SesiFirestore } from '@/lib/sesi';

import type {
  AktivitasLaboratorium,
  HasilAktivitas,
  KelasAktivitas,
} from '../types/activity';
import { LaboratoryId } from '../types/laboratory';

const BULAN = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];

type DataWaktuSesi = Pick<
  SesiFirestore,
  'hari' | 'tanggal' | 'jamMulai' | 'jamSelesai'
>;

/**
 * `kelas.lab` masih berupa teks bebas dari form kelas. Nilai yang sudah
 * dipakai seed maupun form adalah `Lab B`, `Lab C`, `Lab D`, dan `Lab AP`,
 * jadi pencocokan dilakukan pada kode lab setelah awalan `lab` dibuang.
 */
export function normalisasiLaboratorium(
  lab: string,
): LaboratoryId | null {
  const kode = lab
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/^lab/, '')
    .replace(/\d+$/, '');

  switch (kode) {
    case 'b':
      return LaboratoryId.LAB_B;
    case 'c':
      return LaboratoryId.LAB_C;
    case 'd':
      return LaboratoryId.LAB_D;
    case 'ap':
      return LaboratoryId.LAB_AP;
    default:
      return null;
  }
}

export function formatTanggalAktivitas(tanggal: string): string {
  const [tahun, bulan, hari] = tanggal.split('-');
  const namaBulan = BULAN[Number(bulan) - 1];

  if (!tahun || !namaBulan || !hari) {
    return tanggal;
  }

  return `${Number(hari)} ${namaBulan} ${tahun}`;
}

export function labelTanggalAktivitas(sesi: DataWaktuSesi): string {
  const tanggal = formatTanggalAktivitas(sesi.tanggal);

  return sesi.hari ? `${sesi.hari}, ${tanggal}` : tanggal;
}

export function rentangJamAktivitas(sesi: DataWaktuSesi): string {
  return `${sesi.jamMulai} - ${sesi.jamSelesai}`;
}

function keWaktu(tanggal: string, jam: string): Date | null {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(tanggal) ||
    !/^\d{2}:\d{2}$/.test(jam)
  ) {
    return null;
  }

  const [tahun, bulan, hari] = tanggal.split('-').map(Number);
  const [pukul, menit] = jam.split(':').map(Number);
  const waktu = new Date(tahun, bulan - 1, hari, pukul, menit, 0, 0);

  if (Number.isNaN(waktu.getTime())) {
    return null;
  }

  if (
    waktu.getFullYear() !== tahun ||
    waktu.getMonth() !== bulan - 1 ||
    waktu.getDate() !== hari ||
    waktu.getHours() !== pukul ||
    waktu.getMinutes() !== menit
  ) {
    return null;
  }

  return waktu;
}

/**
 * Menentukan aktivitas yang sedang berlangsung dan berikutnya untuk satu lab.
 *
 * Sesi `dibuka` dianggap sedang berlangsung karena asisten sudah membuka
 * presensi. Bila tidak ada sesi yang dibuka, sesi yang jamnya sedang berjalan
 * tetap ditampilkan supaya jadwal hari ini tidak hilang. Aktivitas berikutnya
 * hanya diambil dari sesi yang belum ditutup dan belum dimulai.
 */
export function pilihAktivitas(
  daftarSesi: SesiFirestore[],
  daftarKelas: KelasAktivitas[],
  labId: LaboratoryId | null,
  sekarang: Date = new Date(),
): HasilAktivitas {
  if (!labId) {
    return { saatIni: null, berikutnya: null };
  }

  const kelasById = new Map(
    daftarKelas.map((kelas) => [kelas.id, kelas]),
  );

  const aktivitas: AktivitasLaboratorium[] = [];

  for (const sesi of daftarSesi) {
    const kelas = kelasById.get(sesi.kelasId);

    if (!kelas || normalisasiLaboratorium(sesi.labId ?? kelas.lab) !== labId) {
      continue;
    }

    const mulai = keWaktu(sesi.tanggal, sesi.jamMulai);
    const selesai = keWaktu(sesi.tanggal, sesi.jamSelesai);

    if (!mulai || !selesai) {
      continue;
    }

    aktivitas.push({
      sesi,
      namaKelas: kelas.nama,
      lab: sesi.labNama || kelas.lab,
      mulai,
      selesai,
      laboratorium: labId,
    });
  }

  aktivitas.sort((a, b) => a.mulai.getTime() - b.mulai.getTime());

  const saatIni =
    aktivitas.find((item) => item.sesi.status === 'dibuka') ??
    aktivitas.find(
      (item) =>
        item.sesi.status !== 'ditutup' &&
        sekarang.getTime() >= item.mulai.getTime() &&
        sekarang.getTime() <= item.selesai.getTime(),
    ) ??
    null;

  const berikutnya =
    aktivitas.find(
      (item) =>
        item.sesi.id !== saatIni?.sesi.id &&
        item.sesi.status !== 'ditutup' &&
        item.mulai.getTime() > sekarang.getTime(),
    ) ?? null;

  return { saatIni, berikutnya };
}
