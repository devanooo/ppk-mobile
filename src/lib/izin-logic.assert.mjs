// Pemeriksaan otomatis validasi izin dan aturan keputusan.
//
// Jalankan: node src/lib/izin-logic.assert.mjs
//
// Hanya fungsi murni yang diuji di sini supaya tidak butuh Firestore.

import {
  PESAN_IZIN,
  bolehDiajukan,
  bolehDiputuskan,
  pesanDariGalat,
  validasiAlasan,
} from './izin-aturan.ts';

let jumlah = 0;

function pastikan(kondisi, pesan) {
  jumlah += 1;
  if (!kondisi) throw new Error(`GAGAL: ${pesan}`);
}

// 1. Batas panjang alasan 5 sampai 500 karakter.
pastikan(!validasiAlasan('').ok, 'alasan kosong harus ditolak');
pastikan(!validasiAlasan('    ').ok, 'alasan berisi spasi saja harus ditolak');
pastikan(!validasiAlasan('abcd').ok, 'alasan 4 karakter harus ditolak');
pastikan(validasiAlasan('abcde').ok, 'alasan 5 karakter harus diterima');
pastikan(validasiAlasan('a'.repeat(500)).ok, 'alasan 500 karakter harus diterima');
pastikan(!validasiAlasan('a'.repeat(501)).ok, 'alasan 501 karakter harus ditolak');

// 2. Pesan penolakan spesifik supaya bisa ditampilkan apa adanya.
pastikan(validasiAlasan('abcd').pesan === PESAN_IZIN.alasanTerlaluPendek, 'pesan alasan pendek');
pastikan(
  validasiAlasan('a'.repeat(501)).pesan === PESAN_IZIN.alasanTerlaluPanjang,
  'pesan alasan panjang',
);
pastikan(validasiAlasan('    ').pesan === PESAN_IZIN.alasanKosong, 'pesan alasan kosong');
pastikan(validasiAlasan('  abcde  ').ok, 'spasi di tepi alasan harus diabaikan');

// 3. Hanya pengajuan berstatus menunggu yang bisa diputuskan.
pastikan(bolehDiputuskan('menunggu').ok, 'status menunggu harus bisa diputuskan');
pastikan(!bolehDiputuskan('disetujui').ok, 'status disetujui tidak boleh diputuskan lagi');
pastikan(!bolehDiputuskan('ditolak').ok, 'status ditolak tidak boleh diputuskan lagi');
pastikan(
  bolehDiputuskan('disetujui').pesan === PESAN_IZIN.sudahDiputuskan,
  'pesan keputusan ganda harus spesifik',
);

// 4. Aturan pengajuan: peserta, status sesi, dan duplikat.
const dasar = {
  statusSesi: 'dibuka',
  pesertaIds: ['mhs-1', 'mhs-2'],
  praktikanId: 'mhs-1',
  sudahAda: false,
};
pastikan(bolehDiajukan(dasar).ok, 'peserta pada sesi dibuka harus boleh mengajukan');
pastikan(
  bolehDiajukan({ ...dasar, statusSesi: 'belum-dibuka' }).ok,
  'sesi belum dibuka masih boleh diajukan',
);
pastikan(
  !bolehDiajukan({ ...dasar, statusSesi: 'ditutup' }).ok,
  'sesi ditutup harus ditolak',
);
pastikan(
  bolehDiajukan({ ...dasar, statusSesi: 'ditutup' }).pesan === PESAN_IZIN.sesiDitutup,
  'pesan sesi ditutup harus spesifik',
);
pastikan(
  !bolehDiajukan({ ...dasar, praktikanId: 'mhs-9' }).ok,
  'bukan peserta harus ditolak',
);
pastikan(
  bolehDiajukan({ ...dasar, praktikanId: 'mhs-9' }).pesan === PESAN_IZIN.bukanPeserta,
  'pesan bukan peserta harus spesifik',
);
pastikan(
  !bolehDiajukan({ ...dasar, sudahAda: true }).ok,
  'pengajuan ganda harus ditolak',
);
pastikan(
  bolehDiajukan({ ...dasar, sudahAda: true }).pesan === PESAN_IZIN.pengajuanGanda,
  'pesan pengajuan ganda harus spesifik',
);
pastikan(
  !bolehDiajukan({ ...dasar, praktikanId: 'mhs-9', sudahAda: true }).ok &&
    bolehDiajukan({ ...dasar, praktikanId: 'mhs-9', sudahAda: true }).pesan ===
      PESAN_IZIN.bukanPeserta,
  'penolakan bukan peserta didahulukan dari penolakan duplikat',
);

// 5. Error Firestore dipetakan ke pesan bahasa Indonesia.
pastikan(
  pesanDariGalat({ code: 'permission-denied' }) !== pesanDariGalat({ code: 'unavailable' }),
  'setiap kode error harus punya pesan berbeda',
);
pastikan(
  pesanDariGalat({ code: 'permission-denied' }).includes('akses'),
  'permission-denied harus menyebut akses',
);
pastikan(pesanDariGalat({ code: 'unavailable' }).includes('server'), 'unavailable harus menyebut server');
pastikan(pesanDariGalat({ code: 'not-found' }) === PESAN_IZIN.izinTidakDitemukan, 'not-found');
pastikan(
  pesanDariGalat({ code: 'unknown-kode' }, 'cadangan') === 'cadangan',
  'kode tak dikenal harus memakai pesan cadangan',
);
pastikan(pesanDariGalat(null).length > 0, 'galat null harus tetap menghasilkan pesan');

console.log(`LULUS: ${jumlah} pemeriksaan`);
