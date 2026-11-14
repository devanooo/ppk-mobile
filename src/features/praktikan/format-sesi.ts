import type { SesiFirestore } from '@/lib/sesi';

const BULAN = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
];

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
