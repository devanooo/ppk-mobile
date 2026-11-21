// Validasi input bersama untuk PraktikumKU.
//
// Fungsi murni tanpa React dan tanpa Firebase supaya bisa dipakai form mana pun
// dan diuji langsung dengan node.
//
// Catatan kontrak: panjang NIM ditetapkan 14 digit untuk praktikan dan asisten.
// Nilai ini belum sama dengan yang ditegakkan `firestore.rules` dan
// `src/lib/auth.ts` saat ini, jadi penerapan di form registrasi menunggu
// penyesuaian kontrak data oleh PM dan P1.

export type HasilValidasi = { ok: true } | { ok: false; pesan: string };

export const PANJANG_NIM = {
  praktikan: 14,
  asisten: 14,
} as const;

export const POLA_WAKTU = /^([01]\d|2[0-3]):[0-5]\d$/;

export const PESAN_VALIDASI = {
  wajibDiisi: (label: string) => `${label} wajib diisi`,
  harusAngka: (label: string) => `${label} harus berupa angka`,
  nimPraktikan: `NIM praktikan harus ${PANJANG_NIM.praktikan} digit angka`,
  nimAsisten: `NIM asisten harus ${PANJANG_NIM.asisten} digit angka`,
  waktuFormat: 'Format waktu harus HH:mm',
  waktuUrut: 'Jam selesai harus setelah jam mulai',
  pilihanWajib: (label: string) => `${label} belum dipilih`,
} as const;

/** Nilai wajib diisi setelah spasi tepi dibuang. */
export function wajibDiisi(nilai: string, label: string): HasilValidasi {
  if (!nilai.trim()) {
    return { ok: false, pesan: PESAN_VALIDASI.wajibDiisi(label) };
  }

  return { ok: true };
}

/** Hanya digit, tanpa spasi atau tanda baca. */
export function hanyaAngka(nilai: string, label: string): HasilValidasi {
  if (!/^\d+$/.test(nilai.trim())) {
    return { ok: false, pesan: PESAN_VALIDASI.harusAngka(label) };
  }

  return { ok: true };
}

/** NIM praktikan dan asisten sama-sama 14 digit, dengan pesan per peran. */
export function validasiNim(
  nilai: string,
  peran: 'praktikan' | 'asisten',
): HasilValidasi {
  const panjang = PANJANG_NIM[peran];
  const pesan =
    peran === 'praktikan'
      ? PESAN_VALIDASI.nimPraktikan
      : PESAN_VALIDASI.nimAsisten;

  if (!new RegExp(`^\\d{${panjang}}$`).test(nilai.trim())) {
    return { ok: false, pesan };
  }

  return { ok: true };
}

/** Format waktu 24 jam `HH:mm`. */
export function validasiWaktu(nilai: string): HasilValidasi {
  if (!POLA_WAKTU.test(nilai.trim())) {
    return { ok: false, pesan: PESAN_VALIDASI.waktuFormat };
  }

  return { ok: true };
}

/** Jam selesai harus setelah jam mulai, dibandingkan sebagai teks HH:mm. */
export function validasiRentangWaktu(
  mulai: string,
  selesai: string,
): HasilValidasi {
  const formatMulai = validasiWaktu(mulai);
  if (!formatMulai.ok) return formatMulai;

  const formatSelesai = validasiWaktu(selesai);
  if (!formatSelesai.ok) return formatSelesai;

  if (mulai.trim() >= selesai.trim()) {
    return { ok: false, pesan: PESAN_VALIDASI.waktuUrut };
  }

  return { ok: true };
}
