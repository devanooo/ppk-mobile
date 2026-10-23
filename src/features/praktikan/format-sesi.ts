import type { Sesi } from '@/types';

const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export function formatTanggal(tanggal: string): string {
  const [tahun, bulan, hari] = tanggal.split('-');
  const namaBulan = BULAN[Number(bulan) - 1];

  if (!tahun || !namaBulan || !hari) {
    return tanggal;
  }

  return `${Number(hari)} ${namaBulan} ${tahun}`;
}

export function labelJadwal(sesi: Sesi): string {
  return `${sesi.hari}, ${formatTanggal(sesi.tanggal)}`;
}

export function rentangJam(sesi: Sesi): string {
  return `${sesi.jamMulai}–${sesi.jamSelesai}`;
}

export function urutkanSesi(daftar: Sesi[]): Sesi[] {
  return [...daftar].sort((a, b) =>
    `${a.tanggal}T${a.jamMulai}`.localeCompare(`${b.tanggal}T${b.jamMulai}`),
  );
}
