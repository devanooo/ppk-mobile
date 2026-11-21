import type { SesiFirestore } from '@/lib/sesi';

const BULAN = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
];

const BULAN_PANJANG = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const HARI_PANJANG = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
];

const HARI_PENDEK = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

type DataWaktuSesi = Pick<
  SesiFirestore,
  'hari' | 'tanggal' | 'jamMulai' | 'jamSelesai'
>;

export function formatTanggal(tanggal: string): string {
  const [tahun, bulan, hari] = tanggal.split('-');
  const namaBulan = BULAN[Number(bulan) - 1];

  if (!tahun || !namaBulan || !hari) {
    return tanggal;
  }

  return `${Number(hari)} ${namaBulan} ${tahun}`;
}

export function labelJadwal(sesi: DataWaktuSesi): string {
  return `${sesi.hari}, ${formatTanggal(sesi.tanggal)}`;
}

export function rentangJam(sesi: DataWaktuSesi): string {
  return `${sesi.jamMulai}–${sesi.jamSelesai}`;
}

export function urutkanSesi<T extends DataWaktuSesi>(
  daftar: T[],
): T[] {
  return [...daftar].sort((a, b) =>
    `${a.tanggal}T${a.jamMulai}`.localeCompare(
      `${b.tanggal}T${b.jamMulai}`,
    ),
  );
}

/** Mengubah tanggal ISO lokal (`YYYY-MM-DD`) menjadi `Date` pada tengah malam. */
export function keTanggal(tanggal: string): Date | null {
  const [tahun, bulan, hari] = tanggal.split('-').map(Number);

  if (!tahun || !bulan || !hari) return null;

  const waktu = new Date(tahun, bulan - 1, hari);

  return Number.isNaN(waktu.getTime()) ? null : waktu;
}

/** Tanggal ISO lokal, bukan UTC, supaya pilihan hari tidak bergeser. */
export function keTanggalISO(waktu: Date): string {
  const tahun = waktu.getFullYear();
  const bulan = String(waktu.getMonth() + 1).padStart(2, '0');
  const hari = String(waktu.getDate()).padStart(2, '0');

  return `${tahun}-${bulan}-${hari}`;
}

export function tanggalHariIni(): string {
  return keTanggalISO(new Date());
}

export function geserTanggal(tanggal: string, jumlahHari: number): string {
  const waktu = keTanggal(tanggal);

  if (!waktu) return tanggal;

  waktu.setDate(waktu.getDate() + jumlahHari);

  return keTanggalISO(waktu);
}

/** Format tanggal panjang berbahasa Indonesia, mis. `Rabu, 18 November 2026`. */
export function formatTanggalPanjang(tanggal: string): string {
  const waktu = keTanggal(tanggal);

  if (!waktu) return tanggal;

  return `${HARI_PANJANG[waktu.getDay()]}, ${waktu.getDate()} ${
    BULAN_PANJANG[waktu.getMonth()]
  } ${waktu.getFullYear()}`;
}

/** Nama hari pendek untuk strip tanggal, mis. `Rab`. */
export function labelHari(tanggal: string): string {
  const waktu = keTanggal(tanggal);

  return waktu ? HARI_PENDEK[waktu.getDay()] : tanggal;
}

/** Nomor tanggal tanpa nol di depan untuk strip tanggal. */
export function nomorTanggal(tanggal: string): string {
  const waktu = keTanggal(tanggal);

  return waktu ? String(waktu.getDate()) : tanggal;
}

export function formatJamTitik(jam: string): string {
  return /^\d{2}:\d{2}$/.test(jam) ? jam.replace(':', '.') : jam;
}

export function rentangJamTitik(sesi: DataWaktuSesi): string {
  return `${formatJamTitik(sesi.jamMulai)}–${formatJamTitik(sesi.jamSelesai)}`;
}
