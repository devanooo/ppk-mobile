// Kontrak payload QR sesi praktikum.
//
// Dipakai bersama oleh generator di sisi asisten dan scanner di sisi praktikan.
// Bentuk payload sengaja kecil supaya mudah dicocokkan:
//
//   { "v": 1, "sesiId": "<id sesi>", "exp": "<ISO 8601 UTC>" }
//
// Catatan keamanan: payload ini tidak ditandatangani. Verifikasi sebenarnya ada
// pada status sesi, radius lokasi, dan pencegahan presensi ganda yang dikerjakan
// P2. Tanda tangan server-side di luar lingkup Sprint 3.

export const VERSI_QR = 1;

/** Masa berlaku QR: 15 menit, sesuai keputusan kelompok (PM-08). */
export const MASA_BERLAKU_MENIT = 15;

export type PayloadQr = {
  v: number;
  sesiId: string;
  exp: string;
};

export type HasilBacaQr =
  | { ok: true; payload: PayloadQr }
  | { ok: false; pesan: string };

export type HasilPeriksaQr =
  | { ok: true }
  | { ok: false; pesan: string };

export const PESAN_QR = {
  formatTidakValid: 'QR tidak valid',
  versiTidakDidukung: 'Versi QR tidak didukung',
  kedaluwarsa: 'QR sudah kedaluwarsa',
  sesiTidakCocok: 'QR bukan untuk sesi ini',
} as const;

/** Membuat payload baru untuk satu sesi. Waktu dihitung dalam UTC. */
export function buatPayloadQr({
  sesiId,
  sekarang = new Date(),
  masaBerlakuMenit = MASA_BERLAKU_MENIT,
}: {
  sesiId: string;
  sekarang?: Date;
  masaBerlakuMenit?: number;
}): PayloadQr {
  const kedaluwarsa = new Date(sekarang.getTime() + masaBerlakuMenit * 60_000);

  return {
    v: VERSI_QR,
    sesiId: sesiId.trim(),
    exp: kedaluwarsa.toISOString(),
  };
}

/** Bentuk teks yang dimasukkan ke dalam gambar QR. */
export function encodePayloadQr(payload: PayloadQr): string {
  return JSON.stringify(payload);
}

/** Membaca teks hasil pindai. Menolak format yang tidak dikenali. */
export function bacaPayloadQr(teks: string): HasilBacaQr {
  let data: unknown;

  try {
    data = JSON.parse(teks);
  } catch {
    return { ok: false, pesan: PESAN_QR.formatTidakValid };
  }

  if (typeof data !== 'object' || data === null) {
    return { ok: false, pesan: PESAN_QR.formatTidakValid };
  }

  const { v, sesiId, exp } = data as Record<string, unknown>;

  if (
    typeof v !== 'number' ||
    typeof sesiId !== 'string' ||
    typeof exp !== 'string' ||
    !sesiId.trim() ||
    Number.isNaN(Date.parse(exp))
  ) {
    return { ok: false, pesan: PESAN_QR.formatTidakValid };
  }

  return { ok: true, payload: { v, sesiId, exp } };
}

/**
 * Memeriksa versi, kesesuaian sesi, dan masa berlaku.
 * `sesiId` opsional dipakai bila pemanggil ingin memastikan QR milik sesi tertentu.
 */
export function periksaPayloadQr(
  payload: PayloadQr,
  { sesiId, sekarang = new Date() }: { sesiId?: string; sekarang?: Date } = {},
): HasilPeriksaQr {
  if (payload.v !== VERSI_QR) {
    return { ok: false, pesan: PESAN_QR.versiTidakDidukung };
  }

  if (sesiId !== undefined && payload.sesiId !== sesiId) {
    return { ok: false, pesan: PESAN_QR.sesiTidakCocok };
  }

  const kedaluwarsa = Date.parse(payload.exp);

  if (Number.isNaN(kedaluwarsa)) {
    return { ok: false, pesan: PESAN_QR.formatTidakValid };
  }

  if (kedaluwarsa <= sekarang.getTime()) {
    return { ok: false, pesan: PESAN_QR.kedaluwarsa };
  }

  return { ok: true };
}
