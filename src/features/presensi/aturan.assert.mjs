// Pemeriksaan otomatis aturan validasi presensi (US-07).
//
// Jalankan: node src/features/presensi/aturan.assert.mjs
//
// Semua dependensi yang diuji adalah modul asli aplikasi: parser QR dari
// `src/lib/qr.ts` dan penghitung jarak dari `features/maps/utils/haversine.ts`.
// Keduanya murni, tanpa enum, jadi tidak butuh flag transform.

import { PESAN_QR, bacaPayloadQr, buatPayloadQr, encodePayloadQr, periksaPayloadQr } from '../../lib/qr.ts';
import { calculateDistance } from '../maps/utils/haversine.ts';
import {
  PESAN_TOLAK,
  TOLERANSI_RADIUS_METER,
  validasiPresensi,
} from './aturan.ts';

let jumlah = 0;

function pastikan(kondisi, pesan) {
  jumlah += 1;
  if (!kondisi) throw new Error(`GAGAL: ${pesan}`);
}

const DEPS = {
  bacaQr: bacaPayloadQr,
  periksaQr: periksaPayloadQr,
  pesanQr: PESAN_QR,
  hitungJarak: calculateDistance,
};

const SEKARANG = new Date('2026-11-20T10:00:00.000Z');

// Lab B: pusat -7.051756, 110.443525 dengan radius 40 meter.
const LAB = {
  id: 'lab_b',
  nama: 'Lab B',
  latitude: -7.051756,
  longitude: 110.443525,
  radiusMeter: 40,
};

/** Geser 1 derajat lintang ~ 111.320 m; hitung offset meter ke derajat. */
function geser(koordinat, meter) {
  return {
    latitude: koordinat.latitude + meter / 111320,
    longitude: koordinat.longitude,
  };
}

function qrSah(sesiId = 'sesi-1', opsi = {}) {
  return encodePayloadQr(buatPayloadQr({ sesiId, sekarang: SEKARANG, ...opsi }));
}

function input(ubah = {}) {
  return {
    payloadTeks: qrSah(),
    sesiId: 'sesi-1',
    statusSesi: 'dibuka',
    lab: LAB,
    lokasi: { latitude: LAB.latitude, longitude: LAB.longitude },
    sekarang: SEKARANG,
    ...ubah,
  };
}

function alasan(hasil) {
  return hasil.ok ? null : hasil.alasan;
}

// 1. Jalur bahagia: QR sah, sesi dibuka, di pusat lab.
const sukses = validasiPresensi(input(), DEPS);
pastikan(sukses.ok, 'QR sah di dalam radius harus diterima');
pastikan(sukses.ok && sukses.lab.id === LAB.id, 'lab hasil validasi ikut dikembalikan');
pastikan(sukses.ok && sukses.jarakMeter === 0, 'jarak di titik pusat harus 0');
// Bukti yang disimpan bersama presensi memakai masa berlaku QR yang benar-benar
// dipakai, bukan waktu saat presensi dicatat.
pastikan(
  sukses.ok && sukses.qrExp === buatPayloadQr({ sesiId: 'sesi-1', sekarang: SEKARANG }).exp,
  'qrExp pada hasil validasi sama dengan exp payload',
);
pastikan(
  sukses.ok && !Number.isNaN(Date.parse(sukses.qrExp)),
  'qrExp dapat dibaca sebagai tanggal',
);

// 2. QR tidak valid / bukan payload kita.
pastikan(
  alasan(validasiPresensi(input({ payloadTeks: 'bukan json' }), DEPS)) === 'QR_TIDAK_VALID',
  'teks bukan JSON ditolak sebagai QR tidak valid',
);
pastikan(
  alasan(validasiPresensi(input({ payloadTeks: '{}' }), DEPS)) === 'QR_TIDAK_VALID',
  'objek tanpa field wajib ditolak',
);
pastikan(
  alasan(validasiPresensi(input({ payloadTeks: '' }), DEPS)) === 'QR_TIDAK_VALID',
  'teks kosong ditolak',
);

// 3. QR kedaluwarsa.
const qrBasi = encodePayloadQr(
  buatPayloadQr({ sesiId: 'sesi-1', sekarang: new Date('2026-11-20T09:00:00.000Z') }),
);
const kedaluwarsa = validasiPresensi(input({ payloadTeks: qrBasi }), DEPS);
pastikan(alasan(kedaluwarsa) === 'QR_KEDALUWARSA', 'QR kedaluwarsa ditolak');
pastikan(
  !kedaluwarsa.ok && kedaluwarsa.pesan === PESAN_TOLAK.QR_KEDALUWARSA,
  'pesan kedaluwarsa memakai PESAN_TOLAK',
);

// 4. QR milik sesi lain.
pastikan(
  alasan(validasiPresensi(input({ payloadTeks: qrSah('sesi-2') }), DEPS)) === 'QR_SESI_TIDAK_COCOK',
  'QR sesi lain ditolak',
);

// 5. Status sesi.
pastikan(
  alasan(validasiPresensi(input({ statusSesi: 'belum-dibuka' }), DEPS)) === 'SESI_BELUM_DIBUKA',
  'sesi belum dibuka ditolak',
);
pastikan(
  alasan(validasiPresensi(input({ statusSesi: 'ditutup' }), DEPS)) === 'SESI_DITUTUP',
  'sesi ditutup ditolak',
);

// 6. Lab tidak dikenali (mis. "Lab A" pada data seed lama).
pastikan(
  alasan(validasiPresensi(input({ lab: null }), DEPS)) === 'LAB_TIDAK_DIKENAL',
  'lab tidak dikenali ditolak',
);

// 7. Radius belum tersedia / tidak masuk akal.
for (const radiusMeter of [0, -5, Number.NaN, Number.POSITIVE_INFINITY]) {
  pastikan(
    alasan(validasiPresensi(input({ lab: { ...LAB, radiusMeter } }), DEPS)) === 'LAB_TANPA_RADIUS',
    `radius ${radiusMeter} ditolak sebagai tanpa radius`,
  );
}

// 8. Lokasi perangkat tidak tersedia.
pastikan(
  alasan(validasiPresensi(input({ lokasi: null }), DEPS)) === 'LOKASI_TIDAK_TERSEDIA',
  'lokasi null ditolak',
);

// 9. Batas radius dan toleransi GPS.
const pusat = { latitude: LAB.latitude, longitude: LAB.longitude };

pastikan(
  validasiPresensi(input({ lokasi: geser(pusat, 30) }), DEPS).ok,
  'di dalam radius diterima',
);
pastikan(
  validasiPresensi(input({ lokasi: geser(pusat, LAB.radiusMeter) }), DEPS).ok,
  'tepat di tepi radius diterima',
);
pastikan(
  validasiPresensi(
    input({ lokasi: geser(pusat, LAB.radiusMeter + TOLERANSI_RADIUS_METER - 1) }),
    DEPS,
  ).ok,
  'sedikit di luar radius masih diterima karena toleransi',
);
pastikan(
  alasan(
    validasiPresensi(
      input({ lokasi: geser(pusat, LAB.radiusMeter + TOLERANSI_RADIUS_METER + 5) }),
      DEPS,
    ),
  ) === 'DI_LUAR_RADIUS',
  'jauh di luar radius ditolak',
);
pastikan(
  alasan(validasiPresensi(input({ lokasi: geser(pusat, 500) }), DEPS)) === 'DI_LUAR_RADIUS',
  '500 meter dari lab ditolak',
);

// 10. Urutan pemeriksaan: QR diperiksa sebelum status sesi.
pastikan(
  alasan(
    validasiPresensi(
      input({ payloadTeks: 'rusak', statusSesi: 'ditutup' }),
      DEPS,
    ),
  ) === 'QR_TIDAK_VALID',
  'QR rusak dilaporkan lebih dulu daripada status sesi',
);

// 11. Status sesi diperiksa sebelum lokasi, supaya pesan tidak menyesatkan.
pastikan(
  alasan(
    validasiPresensi(input({ statusSesi: 'ditutup', lokasi: null }), DEPS),
  ) === 'SESI_DITUTUP',
  'status sesi dilaporkan sebelum lokasi',
);

// 12. Semua pesan penolakan berbahasa Indonesia dan tidak kosong.
for (const [kode, pesan] of Object.entries(PESAN_TOLAK)) {
  pastikan(typeof pesan === 'string' && pesan.trim().length > 0, `pesan ${kode} terisi`);
}

console.log(`LULUS: ${jumlah} pemeriksaan aturan presensi`);
