// Pemeriksaan otomatis modul validasi bersama.
//
// Jalankan: node src/lib/validasi-logic.assert.mjs
//
// Hanya fungsi murni, tanpa React dan tanpa Firebase.

import {
  PANJANG_NIM,
  PESAN_VALIDASI,
  validasiNim,
} from './validasi.ts';

let jumlah = 0;

function pastikan(kondisi, pesan) {
  jumlah += 1;
  if (!kondisi) throw new Error(`GAGAL: ${pesan}`);
}

// 1. NIM praktikan 14 digit.
pastikan(PANJANG_NIM.praktikan === 14, 'panjang NIM praktikan harus 14');
pastikan(validasiNim('24060101234567', 'praktikan').ok, 'NIM 14 digit harus diterima');
pastikan(!validasiNim('2406010123456', 'praktikan').ok, 'NIM 13 digit harus ditolak');
pastikan(!validasiNim('240601012345678', 'praktikan').ok, 'NIM 15 digit harus ditolak');
pastikan(
  validasiNim('2406', 'praktikan').pesan === PESAN_VALIDASI.nimPraktikan,
  'pesan NIM praktikan harus spesifik',
);
pastikan(validasiNim('  24060101234567  ', 'praktikan').ok, 'spasi tepi diabaikan');

// 2. NIM asisten 14 digit.
pastikan(PANJANG_NIM.asisten === 14, 'panjang NIM asisten harus 14');
pastikan(validasiNim('19850412201012', 'asisten').ok, 'NIM asisten 14 digit harus diterima');
pastikan(!validasiNim('1985041220101', 'asisten').ok, 'NIM asisten 13 digit harus ditolak');
pastikan(!validasiNim('198504122010121', 'asisten').ok, 'NIM asisten 15 digit harus ditolak');
pastikan(
  validasiNim('1985', 'asisten').pesan === PESAN_VALIDASI.nimAsisten,
  'pesan NIM asisten harus spesifik',
);
pastikan(!validasiNim('19850412201O12', 'asisten').ok, 'huruf O harus ditolak');

console.log(`OK ${jumlah} pemeriksaan validasi`);
