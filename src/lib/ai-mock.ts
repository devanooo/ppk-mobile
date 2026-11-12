/**
 * Klasifikasi alasan izin untuk pengembangan (T-045).
 *
 * Dipakai saat `EXPO_PUBLIC_AI_MOCK=1` atau sebelum endpoint AI dari pengajar
 * tersedia. Hasilnya deterministik supaya UI dan jalur penyimpanan bisa diuji
 * tanpa memanggil jaringan. Daftar kategori di sini BELUM final: pengajar belum
 * mengonfirmasi daftar kategori resmi (docs/sprints/sprint-2.md bagian 8.5).
 */

export const KATEGORI_MOCK = [
  'sakit',
  'keadaan-keluarga',
  'kegiatan-kampus',
  'lainnya',
] as const;

export type KategoriMock = (typeof KATEGORI_MOCK)[number];

const KATA_KUNCI: { kategori: KategoriMock; kata: string[] }[] = [
  {
    kategori: 'sakit',
    kata: ['sakit', 'demam', 'opname', 'rumah sakit', 'dokter', 'vaksin', 'klinik'],
  },
  {
    kategori: 'keadaan-keluarga',
    kata: ['keluarga', 'orang tua', 'ayah', 'ibu', 'duka', 'meninggal', 'nikah'],
  },
  {
    kategori: 'kegiatan-kampus',
    kata: ['lomba', 'kompetisi', 'seminar', 'rapat', 'organisasi', 'himpunan', 'delegasi'],
  },
];

export function klasifikasiAlasanMock(alasan: string): KategoriMock {
  const teks = alasan.toLowerCase();

  for (const { kategori, kata } of KATA_KUNCI) {
    if (kata.some((potongan) => teks.includes(potongan))) {
      return kategori;
    }
  }

  return 'lainnya';
}
