// Pemeriksaan otomatis aturan identitas presensi.
//
// Jalankan: node src/features/presensi/identitas.assert.mjs

import { PESAN_IDENTITAS, validasiIdentitas } from './identitas.ts';

let jumlah = 0;

function pastikan(kondisi, pesan) {
  jumlah += 1;
  if (!kondisi) throw new Error(`GAGAL: ${pesan}`);
}

function input(ubah = {}) {
  return {
    praktikanId: 'praktikan-1',
    pesertaIds: ['praktikan-1', 'praktikan-2'],
    sudahPresensi: false,
    ...ubah,
  };
}

// 1. Jalur bahagia.
pastikan(validasiIdentitas(input()).ok, 'peserta yang belum presensi diterima');

// 2. Bukan peserta kelas.
const asing = validasiIdentitas(input({ praktikanId: 'praktikan-99' }));
pastikan(!asing.ok, 'bukan peserta ditolak');
pastikan(asing.alasan === 'BUKAN_PESERTA', 'alasan bukan peserta');
pastikan(asing.pesan === PESAN_IDENTITAS.BUKAN_PESERTA, 'pesan bukan peserta');

// 3. Kelas tanpa peserta menolak semua praktikan.
pastikan(
  !validasiIdentitas(input({ pesertaIds: [] })).ok,
  'kelas kosong menolak semua praktikan',
);

// 4. Presensi ganda.
const ganda = validasiIdentitas(input({ sudahPresensi: true }));
pastikan(!ganda.ok, 'presensi ganda ditolak');
pastikan(ganda.alasan === 'PRESENSI_SUDAH_ADA', 'alasan presensi ganda');
pastikan(
  ganda.pesan === PESAN_IDENTITAS.PRESENSI_SUDAH_ADA,
  'pesan presensi ganda',
);

// 5. Identitas diperiksa lebih dulu daripada duplikasi: praktikan asing yang
//    entah bagaimana punya presensi tetap dilaporkan sebagai bukan peserta.
const asingDanGanda = validasiIdentitas(
  input({ praktikanId: 'praktikan-99', sudahPresensi: true }),
);
pastikan(!asingDanGanda.ok, 'asing yang punya presensi ditolak');
pastikan(
  asingDanGanda.alasan === 'BUKAN_PESERTA',
  'identitas dilaporkan sebelum duplikasi',
);

// 6. Semua pesan terisi.
for (const [kode, pesan] of Object.entries(PESAN_IDENTITAS)) {
  pastikan(typeof pesan === 'string' && pesan.trim().length > 0, `pesan ${kode} terisi`);
}

console.log(`LULUS: ${jumlah} pemeriksaan identitas`);
