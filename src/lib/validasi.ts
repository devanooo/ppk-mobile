// Validasi input bersama untuk PraktikumKU.
//
// Fungsi murni tanpa React dan tanpa Firebase supaya bisa dipakai form mana pun
// dan diuji langsung dengan node.
//
// Nomor induk 14 digit untuk praktikan maupun asisten, sama dengan yang
// ditegakkan `firestore.rules` dan `src/lib/auth.ts`.

export type HasilValidasi = { ok: true } | { ok: false; pesan: string };

export const PANJANG_NIM = {
  praktikan: 14,
  asisten: 14,
} as const;

export const PESAN_VALIDASI = {
  nimPraktikan: `NIM praktikan harus ${PANJANG_NIM.praktikan} digit angka`,
  nimAsisten: `NIM asisten harus ${PANJANG_NIM.asisten} digit angka`,
} as const;

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
