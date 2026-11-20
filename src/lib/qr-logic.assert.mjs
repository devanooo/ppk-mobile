// Pemeriksaan otomatis kontrak payload QR.
//
// Jalankan: node src/lib/qr-logic.assert.mjs
//
// Hanya fungsi murni yang diuji di sini supaya tidak butuh React atau Firebase.

import {
  MASA_BERLAKU_MENIT,
  PESAN_QR,
  VERSI_QR,
  bacaPayloadQr,
  buatPayloadQr,
  encodePayloadQr,
  periksaPayloadQr,
} from './qr.ts';

let jumlah = 0;

function pastikan(kondisi, pesan) {
  jumlah += 1;
  if (!kondisi) throw new Error(`GAGAL: ${pesan}`);
}

const sekarang = new Date('2026-11-20T10:00:00.000Z');

// 1. Payload baru terhubung ke sesi dan memakai masa berlaku default.
const payload = buatPayloadQr({ sesiId: 'sesi-1', sekarang });
pastikan(payload.v === VERSI_QR, 'versi payload harus versi terbaru');
pastikan(payload.sesiId === 'sesi-1', 'sesiId harus tersimpan apa adanya');
pastikan(
  payload.exp === '2026-11-20T10:10:00.000Z',
  `exp harus ${MASA_BERLAKU_MENIT} menit setelah dibuat`,
);
pastikan(periksaPayloadQr(payload, { sekarang }).ok, 'QR baru harus valid');

// 2. Batas kedaluwarsa: tepat pada exp sudah ditolak, sesaat sebelum masih valid.
pastikan(
  periksaPayloadQr(payload, { sekarang: new Date('2026-11-20T10:09:59.000Z') }).ok,
  'QR harus valid satu detik sebelum kedaluwarsa',
);
const tepatKedaluwarsa = periksaPayloadQr(payload, {
  sekarang: new Date('2026-11-20T10:10:00.000Z'),
});
pastikan(!tepatKedaluwarsa.ok, 'QR harus ditolak tepat pada waktu kedaluwarsa');
pastikan(
  tepatKedaluwarsa.pesan === PESAN_QR.kedaluwarsa,
  'pesan kedaluwarsa harus spesifik',
);

// 3. QR tidak boleh dipakai untuk sesi lain.
const sesiLain = periksaPayloadQr(payload, { sesiId: 'sesi-2', sekarang });
pastikan(!sesiLain.ok, 'QR sesi lain harus ditolak');
pastikan(sesiLain.pesan === PESAN_QR.sesiTidakCocok, 'pesan sesi tidak cocok');
pastikan(periksaPayloadQr(payload, { sesiId: 'sesi-1', sekarang }).ok, 'sesi yang sama harus diterima');

// 4. Versi yang tidak dikenal ditolak.
const versiLain = periksaPayloadQr({ ...payload, v: 2 }, { sekarang });
pastikan(!versiLain.ok, 'versi lain harus ditolak');
pastikan(versiLain.pesan === PESAN_QR.versiTidakDidukung, 'pesan versi tidak didukung');

// 5. Encode dan baca ulang harus menghasilkan payload yang sama.
const hasilBaca = bacaPayloadQr(encodePayloadQr(payload));
pastikan(hasilBaca.ok, 'payload yang di-encode harus bisa dibaca ulang');
pastikan(hasilBaca.payload.sesiId === 'sesi-1', 'sesiId harus sama setelah dibaca');
pastikan(hasilBaca.payload.exp === payload.exp, 'exp harus sama setelah dibaca');

// 6. Format yang tidak valid ditolak.
const tidakValid = [
  'bukan json',
  'null',
  '[]',
  '{}',
  '{"v":1,"sesiId":"sesi-1"}',
  '{"v":"1","sesiId":"sesi-1","exp":"2026-11-20T10:10:00.000Z"}',
  '{"v":1,"sesiId":"   ","exp":"2026-11-20T10:10:00.000Z"}',
  '{"v":1,"sesiId":"sesi-1","exp":"bukan-tanggal"}',
];

for (const teks of tidakValid) {
  const hasil = bacaPayloadQr(teks);
  pastikan(!hasil.ok, `format "${teks}" harus ditolak`);
  pastikan(hasil.pesan === PESAN_QR.formatTidakValid, `pesan untuk "${teks}" harus format tidak valid`);
}

// 7. Masa berlaku bisa diatur pemanggil.
const panjang = buatPayloadQr({ sesiId: 'sesi-1', sekarang, masaBerlakuMenit: 60 });
pastikan(panjang.exp === '2026-11-20T11:00:00.000Z', 'masa berlaku kustom harus dipakai');
pastikan(
  periksaPayloadQr(panjang, { sekarang: new Date('2026-11-20T10:59:59.000Z') }).ok,
  'QR bermasa 60 menit harus valid sampai batas',
);

// 8. Spasi di tepi sesiId diabaikan saat dibuat.
const spasi = buatPayloadQr({ sesiId: '  sesi-9  ', sekarang });
pastikan(spasi.sesiId === 'sesi-9', 'spasi di tepi sesiId harus dibuang');

console.log(`OK ${jumlah} pemeriksaan QR`);
