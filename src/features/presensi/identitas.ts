/**
 * Aturan identitas dan duplikasi presensi.
 *
 * Dipisah dari `aturan.ts` karena lapisan ini butuh data peserta kelas dan
 * status presensi, sedangkan `aturan.ts` hanya memeriksa QR, status sesi, dan
 * radius. Kedua berkas tetap murni (tanpa impor runtime) agar bisa diuji Node.
 */

export type AlasanIdentitas = 'BUKAN_PESERTA' | 'PRESENSI_SUDAH_ADA';

export const PESAN_IDENTITAS: Record<AlasanIdentitas, string> = {
  BUKAN_PESERTA: 'Kamu tidak terdaftar pada sesi ini',
  PRESENSI_SUDAH_ADA: 'Presensi sudah tercatat pada sesi ini',
};

export type HasilValidasiIdentitas =
  | { ok: true }
  | { ok: false; alasan: AlasanIdentitas; pesan: string };

export type InputValidasiIdentitas = {
  /** ID praktikan yang sedang login. */
  praktikanId: string;
  /** Peserta kelas sesi ini, dibaca dari dokumen kelas. */
  pesertaIds: string[];
  /** Praktikan sudah punya dokumen presensi pada sesi ini. */
  sudahPresensi: boolean;
};

/**
 * Urutan penting: identitas diperiksa sebelum duplikasi, dan keduanya sebelum
 * radius. Pesan yang tampil harus penyebab yang sebenarnya, bukan "di luar
 * radius" untuk praktikan yang memang bukan peserta.
 */
export function validasiIdentitas(
  input: InputValidasiIdentitas,
): HasilValidasiIdentitas {
  if (!input.pesertaIds.includes(input.praktikanId)) {
    return {
      ok: false,
      alasan: 'BUKAN_PESERTA',
      pesan: PESAN_IDENTITAS.BUKAN_PESERTA,
    };
  }

  if (input.sudahPresensi) {
    return {
      ok: false,
      alasan: 'PRESENSI_SUDAH_ADA',
      pesan: PESAN_IDENTITAS.PRESENSI_SUDAH_ADA,
    };
  }

  return { ok: true };
}
