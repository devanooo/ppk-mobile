/**
 * Aturan validasi presensi (US-07): QR, status sesi, dan radius lokasi.
 *
 * Modul ini sengaja tidak punya impor runtime sama sekali. Kontrak repo ini
 * (lihat `src/lib/izin-aturan.ts`) membuat modul yang diuji Node harus murni:
 * impor relatif berekstensi `.ts` ditolak `tsc`, sedangkan impor tanpa ekstensi
 * ditolak Node ESM. Karena itu parser QR, pemeriksa masa berlaku, dan penghitung
 * jarak disuntikkan pemanggil — semuanya tetap bersumber dari satu tempat
 * (`src/lib/qr.ts` dan `features/maps/utils/haversine.ts`), tidak diduplikasi.
 *
 * Pelabuhan lab juga sudah dipetakan pemanggil lewat `features/presensi/lokasi.ts`,
 * sehingga modul ini menerima `LabPresensi | null` yang sudah bertipe enum.
 */

import type { PayloadQr } from '../../lib/qr';
import type { LabPresensi } from './lokasi';

export type AlasanTolak =
  | 'QR_TIDAK_VALID'
  | 'QR_KEDALUWARSA'
  | 'QR_SESI_TIDAK_COCOK'
  | 'SESI_BELUM_DIBUKA'
  | 'SESI_DITUTUP'
  | 'LAB_TIDAK_DIKENAL'
  | 'LAB_TANPA_RADIUS'
  | 'LOKASI_TIDAK_TERSEDIA'
  | 'DI_LUAR_RADIUS';

export type StatusSesiPresensi = 'belum-dibuka' | 'dibuka' | 'ditutup';

export type Koordinat = {
  latitude: number;
  longitude: number;
};

export type HasilValidasiPresensi =
  | { ok: true; lab: LabPresensi; jarakMeter: number }
  | { ok: false; alasan: AlasanTolak; pesan: string };

/** Pesan penolakan, mengikuti tabel penanganan error docs/sprints/sprint-3.md §8.6. */
export const PESAN_TOLAK: Record<AlasanTolak, string> = {
  QR_TIDAK_VALID: 'QR tidak valid',
  QR_KEDALUWARSA: 'QR sudah kedaluwarsa',
  QR_SESI_TIDAK_COCOK: 'QR bukan untuk sesi ini',
  SESI_BELUM_DIBUKA: 'Sesi belum dibuka',
  SESI_DITUTUP: 'Sesi sudah ditutup',
  LAB_TIDAK_DIKENAL: 'Laboratorium sesi ini belum dikenali',
  LAB_TANPA_RADIUS: 'Radius laboratorium belum tersedia',
  LOKASI_TIDAK_TERSEDIA: 'Lokasi perangkat tidak tersedia',
  DI_LUAR_RADIUS: 'Lokasi kamu di luar radius laboratorium',
};

/**
 * Toleransi akurasi GPS perangkat. Radius laboratorium diukur dari titik pusat
 * ruangan, sedangkan GPS ponsel bisa meleset beberapa meter di dalam gedung.
 * Tanpa toleransi, praktikan yang duduk di dalam lab bisa ditolak.
 */
export const TOLERANSI_RADIUS_METER = 15;

/** Bentuk dependensi yang disuntikkan; semua dari modul murni lain. */
export type DependensiAturan = {
  bacaQr: (
    teks: string,
  ) => { ok: true; payload: PayloadQr } | { ok: false; pesan: string };
  periksaQr: (
    payload: PayloadQr,
    opsi: { sesiId: string; sekarang: Date },
  ) => { ok: true } | { ok: false; pesan: string };
  pesanQr: {
    formatTidakValid: string;
    versiTidakDidukung: string;
    kedaluwarsa: string;
    sesiTidakCocok: string;
  };
  hitungJarak: (dari: Koordinat, ke: Koordinat) => number;
};

export type InputValidasiPresensi = {
  /** Teks mentah hasil pindai QR. */
  payloadTeks: string;
  /** ID sesi yang dibuka di layar; QR wajib milik sesi ini. */
  sesiId: string;
  statusSesi: StatusSesiPresensi;
  /** Lab yang sudah dipetakan dari `kelas.lab`; `null` bila tidak dikenali. */
  lab: LabPresensi | null;
  lokasi: Koordinat | null;
  sekarang?: Date;
};

function tolak(alasan: AlasanTolak): HasilValidasiPresensi {
  return { ok: false, alasan, pesan: PESAN_TOLAK[alasan] };
}

/**
 * Urutan pemeriksaan mengikuti alur doc: QR → status sesi → lab/radius →
 * lokasi perangkat → jarak. Pemeriksaan berhenti pada kegagalan pertama agar
 * pesan yang tampil selalu penyebab sebenarnya.
 */
export function validasiPresensi(
  input: InputValidasiPresensi,
  deps: DependensiAturan,
): HasilValidasiPresensi {
  const sekarang = input.sekarang ?? new Date();

  const dibaca = deps.bacaQr(input.payloadTeks);

  if (!dibaca.ok) {
    return tolak('QR_TIDAK_VALID');
  }

  const diperiksa = deps.periksaQr(dibaca.payload, {
    sesiId: input.sesiId,
    sekarang,
  });

  if (!diperiksa.ok) {
    if (diperiksa.pesan === deps.pesanQr.kedaluwarsa) {
      return tolak('QR_KEDALUWARSA');
    }

    if (diperiksa.pesan === deps.pesanQr.sesiTidakCocok) {
      return tolak('QR_SESI_TIDAK_COCOK');
    }

    return tolak('QR_TIDAK_VALID');
  }

  if (input.statusSesi === 'belum-dibuka') {
    return tolak('SESI_BELUM_DIBUKA');
  }

  if (input.statusSesi === 'ditutup') {
    return tolak('SESI_DITUTUP');
  }

  if (!input.lab) {
    return tolak('LAB_TIDAK_DIKENAL');
  }

  if (!Number.isFinite(input.lab.radiusMeter) || input.lab.radiusMeter <= 0) {
    return tolak('LAB_TANPA_RADIUS');
  }

  if (!input.lokasi) {
    return tolak('LOKASI_TIDAK_TERSEDIA');
  }

  const jarakMeter = deps.hitungJarak(input.lokasi, {
    latitude: input.lab.latitude,
    longitude: input.lab.longitude,
  });

  if (jarakMeter > input.lab.radiusMeter + TOLERANSI_RADIUS_METER) {
    return tolak('DI_LUAR_RADIUS');
  }

  return { ok: true, lab: input.lab, jarakMeter };
}
