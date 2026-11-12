/**
 * Klasifikasi alasan izin untuk pengembangan (T-045).
 *
 * Dipakai saat `EXPO_PUBLIC_AI_MOCK=1`. Hasilnya deterministik supaya UI dan
 * jalur penyimpanan bisa diuji tanpa memanggil jaringan maupun memakai kuota.
 *
 * Modul ini sengaja tidak punya impor runtime: `src/lib/ai-logic.assert.mjs`
 * mengimpornya langsung lewat Node. Tipe kategori diambil sebagai `import type`
 * (dihapus saat transpilasi) supaya daftar kategori tetap satu sumber di
 * `ai-pemetaan.ts`.
 */

import type { KategoriIzin } from './ai-pemetaan';

const KATA_KUNCI: { kategori: KategoriIzin; kata: string[] }[] = [
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

export function klasifikasiAlasanMock(alasan: string): KategoriIzin {
  const teks = alasan.toLowerCase();

  for (const { kategori, kata } of KATA_KUNCI) {
    if (kata.some((potongan) => teks.includes(potongan))) {
      return kategori;
    }
  }

  return 'lainnya';
}
