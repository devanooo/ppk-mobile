// Pemeriksaan otomatis adaptor lab presensi.
//
// Jalankan: node --experimental-transform-types src/features/presensi/lokasi.assert.mjs
//
// Flag transform diperlukan karena file ini mengimpor enum `LaboratoryId` asli;
// Node type-stripping biasa menolak `enum`. `lokasi.ts` sendiri tetap murni
// (hanya `import type`) sehingga aman dipakai di runtime React tanpa flag.
//
// Catatan: `LABORATORY_OPTIONS` (milik P1) memakai impor relatif tanpa ekstensi,
// yang tidak bisa dimuat Node ESM. Karena file itu tidak boleh diubah dari sisi
// P2, daftar opsi di sini diturunkan dari enum asli dengan aturan yang sama
// dengan `constants/laboratory.ts` (label "Lab <huruf>", code huruf besar).
// Setiap anggota enum wajib terpetakan, sehingga penambahan lab baru di enum
// akan membuat test ini gagal sampai adaptor ikut diperbarui.

import { LaboratoryId } from '../maps/types/laboratory.ts';
import {
  cariLaboratorium,
  keLabPresensi,
  normalisasiNamaLab,
  petakanLab,
} from './lokasi.ts';

let jumlah = 0;

function pastikan(kondisi, pesan) {
  jumlah += 1;
  if (!kondisi) throw new Error(`GAGAL: ${pesan}`);
}

/** "lab_ap" -> "Lab AP", mengikuti label pada `LABORATORY_OPTIONS`. */
function labelDariId(id) {
  return id
    .split('_')
    .map((bagian) => bagian.toUpperCase())
    .join(' ')
    .replace(/^LAB /, 'Lab ');
}

const OPSI = Object.values(LaboratoryId).map((id) => ({
  id,
  code: id.toUpperCase(),
  label: labelDariId(id),
}));

/** Dokumen laboratorium minimal; semua nilai enum, tanpa literal id. */
function lab(id, isActive = true) {
  return {
    id,
    code: id.toUpperCase(),
    name: id,
    building: 'Gedung A',
    floor: 1,
    location: { latitude: -7.051756, longitude: 110.443525 },
    radiusMeters: 40,
    plusCode: 'x',
    pointType: 'room',
    roomCenterVerified: true,
    isActive,
  };
}

// 1. Normalisasi membuang spasi, titik, garis bawah, dan tanda hubung.
pastikan(normalisasiNamaLab('Lab B') === 'labb', 'spasi dibuang');
pastikan(normalisasiNamaLab('lab_b') === 'labb', 'garis bawah dibuang');
pastikan(normalisasiNamaLab('LAB-B') === 'labb', 'tanda hubung dibuang');
pastikan(normalisasiNamaLab('  Lab   AP ') === 'labap', 'spasi ganda dan tepi dibuang');
pastikan(normalisasiNamaLab('') === '', 'string kosong tetap kosong');

// 2. Setiap anggota enum bisa dipetakan lewat label, id, dan code.
for (const opsi of OPSI) {
  pastikan(
    petakanLab(opsi.label, OPSI) === opsi.id,
    `label "${opsi.label}" memetakan ke ${opsi.id}`,
  );
  pastikan(
    petakanLab(opsi.id, OPSI) === opsi.id,
    `id "${opsi.id}" diterima apa adanya`,
  );
  pastikan(
    petakanLab(opsi.code, OPSI) === opsi.id,
    `code "${opsi.code}" diterima`,
  );
  pastikan(
    petakanLab(`  ${opsi.label.toUpperCase()} `, OPSI) === opsi.id,
    `label huruf besar dengan spasi berlebih memetakan ke ${opsi.id}`,
  );
}

// 3. Khusus Lab AP: singkatan tanpa awalan "Lab" juga diterima.
pastikan(
  petakanLab('AP', OPSI) === LaboratoryId.LAB_AP,
  'singkatan "AP"',
);
pastikan(
  petakanLab('ap', OPSI) === LaboratoryId.LAB_AP,
  'singkatan "ap" huruf kecil',
);

// 4. Yang tidak dikenal ditolak, termasuk Lab A di data seed lama.
pastikan(petakanLab('Lab A', OPSI) === null, '"Lab A" tidak ada di daftar');
pastikan(petakanLab('', OPSI) === null, 'string kosong ditolak');
pastikan(petakanLab('   ', OPSI) === null, 'spasi saja ditolak');
pastikan(petakanLab('Lab Z', OPSI) === null, '"Lab Z" ditolak');
pastikan(petakanLab('labb', []) === null, 'daftar opsi kosong menghasilkan null');

// 5. Pencarian dokumen laboratorium.
const labs = Object.values(LaboratoryId).map((id) => lab(id));

pastikan(
  cariLaboratorium(labs, 'Lab B', OPSI)?.id === LaboratoryId.LAB_B,
  'menemukan Lab B',
);
pastikan(
  cariLaboratorium(labs, 'AP', OPSI)?.id === LaboratoryId.LAB_AP,
  'menemukan Lab AP',
);
pastikan(
  cariLaboratorium(labs, 'Lab A', OPSI) === null,
  'Lab A tidak ditemukan',
);
pastikan(
  cariLaboratorium([], 'Lab B', OPSI) === null,
  'koleksi kosong menghasilkan null',
);
pastikan(
  cariLaboratorium([lab(LaboratoryId.LAB_C)], 'Lab B', OPSI) === null,
  'dokumen lab lain tidak dipakai',
);

// 6. Bila ada beberapa dokumen untuk id yang sama, yang aktif dipilih.
const ganda = [lab(LaboratoryId.LAB_B, false), lab(LaboratoryId.LAB_B, true)];
pastikan(
  cariLaboratorium(ganda, 'Lab B', OPSI)?.isActive === true,
  'pilih dokumen aktif',
);

// 7. Konversi ke bentuk angka biasa untuk aturan validasi.
const konversi = keLabPresensi(labs[0]);
pastikan(konversi.id === labs[0].id, 'id tetap nilai enum');
pastikan(konversi.nama === labs[0].name, 'nama diambil dari name');
pastikan(konversi.latitude === -7.051756, 'latitude jadi angka');
pastikan(konversi.longitude === 110.443525, 'longitude jadi angka');
pastikan(konversi.radiusMeter === 40, 'radiusMeters menjadi radiusMeter');
pastikan(!('radiusMeters' in konversi), 'nama field lama tidak ikut tersalin');

console.log(`LULUS: ${jumlah} pemeriksaan lokasi`);
