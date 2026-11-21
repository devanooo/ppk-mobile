// Pemeriksaan otomatis modul validasi bersama.
//
// Jalankan: node src/lib/validasi-logic.assert.mjs
//
// Hanya fungsi murni, tanpa React dan tanpa Firebase.

import {
  PANJANG_NIM,
  PESAN_VALIDASI,
  hanyaAngka,
  validasiNim,
  validasiRentangWaktu,
  validasiWaktu,
  wajibDiisi,
} from './validasi.ts';

let jumlah = 0;

function pastikan(kondisi, pesan) {
  jumlah += 1;
  if (!kondisi) throw new Error(`GAGAL: ${pesan}`);
}

// 1. Input wajib.
pastikan(!wajibDiisi('', 'Nama').ok, 'teks kosong harus ditolak');
pastikan(!wajibDiisi('   ', 'Nama').ok, 'spasi saja harus ditolak');
pastikan(wajibDiisi('Budi', 'Nama').ok, 'teks terisi harus diterima');
pastikan(
  wajibDiisi('', 'Nama').pesan === PESAN_VALIDASI.wajibDiisi('Nama'),
  'pesan wajib harus menyebut label',
);

// 2. Hanya angka.
pastikan(hanyaAngka('12345', 'NIM').ok, 'digit harus diterima');
pastikan(!hanyaAngka('12a45', 'NIM').ok, 'huruf harus ditolak');
pastikan(!hanyaAngka('12 45', 'NIM').ok, 'spasi di tengah harus ditolak');
pastikan(!hanyaAngka('', 'NIM').ok, 'kosong harus ditolak');

// 3. NIM praktikan 14 digit.
pastikan(PANJANG_NIM.praktikan === 14, 'panjang NIM praktikan harus 14');
pastikan(validasiNim('24060101234567', 'praktikan').ok, 'NIM 14 digit harus diterima');
pastikan(!validasiNim('2406010123456', 'praktikan').ok, 'NIM 13 digit harus ditolak');
pastikan(!validasiNim('240601012345678', 'praktikan').ok, 'NIM 15 digit harus ditolak');
pastikan(
  validasiNim('2406', 'praktikan').pesan === PESAN_VALIDASI.nimPraktikan,
  'pesan NIM praktikan harus spesifik',
);
pastikan(validasiNim('  24060101234567  ', 'praktikan').ok, 'spasi tepi diabaikan');

// 4. NIM asisten 14 digit.
pastikan(PANJANG_NIM.asisten === 14, 'panjang NIM asisten harus 14');
pastikan(validasiNim('19850412201012', 'asisten').ok, 'NIM asisten 14 digit harus diterima');
pastikan(!validasiNim('1985041220101', 'asisten').ok, 'NIM asisten 13 digit harus ditolak');
pastikan(!validasiNim('198504122010121', 'asisten').ok, 'NIM asisten 15 digit harus ditolak');
pastikan(
  validasiNim('1985', 'asisten').pesan === PESAN_VALIDASI.nimAsisten,
  'pesan NIM asisten harus spesifik',
);
pastikan(!validasiNim('19850412201O12', 'asisten').ok, 'huruf O harus ditolak');

// 5. Format waktu.
pastikan(validasiWaktu('08:00').ok, '08:00 harus diterima');
pastikan(validasiWaktu('23:59').ok, '23:59 harus diterima');
pastikan(validasiWaktu('00:00').ok, '00:00 harus diterima');
pastikan(!validasiWaktu('24:00').ok, '24:00 harus ditolak');
pastikan(!validasiWaktu('8:00').ok, 'jam satu digit harus ditolak');
pastikan(!validasiWaktu('08.00').ok, 'pemisah titik harus ditolak');
pastikan(!validasiWaktu('08:60').ok, 'menit 60 harus ditolak');
pastikan(
  validasiWaktu('8:00').pesan === PESAN_VALIDASI.waktuFormat,
  'pesan format waktu harus spesifik',
);

// 6. Rentang waktu.
pastikan(validasiRentangWaktu('08:00', '10:00').ok, 'rentang valid harus diterima');
pastikan(
  !validasiRentangWaktu('10:00', '10:00').ok,
  'jam mulai sama dengan selesai harus ditolak',
);
pastikan(!validasiRentangWaktu('11:00', '10:00').ok, 'rentang terbalik harus ditolak');
pastikan(
  validasiRentangWaktu('11:00', '10:00').pesan === PESAN_VALIDASI.waktuUrut,
  'pesan rentang harus spesifik',
);
pastikan(
  !validasiRentangWaktu('8:00', '10:00').ok,
  'format salah pada jam mulai harus ditolak lebih dulu',
);

console.log(`OK ${jumlah} pemeriksaan validasi`);
