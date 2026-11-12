/**
 * Klien klasifikasi alasan izin (T-042).
 *
 * Semua pemetaan ke API AI dikumpulkan di `ai.ts` dan `ai-pemetaan.ts` supaya
 * perubahan skema hanya menyentuh satu tempat (docs/sprints/sprint-2.md
 * bagian 8.5).
 *
 * KONFIRMASI PENGAJAR - belum terjawab pada saat file ini ditulis.
 * Enam pertanyaan yang diajukan ke pengajar:
 *   1. Base URL dan path endpoint
 *   2. HTTP method dan header autentikasi
 *   3. Contoh request body
 *   4. Contoh response beserta nama field kategori
 *   5. Daftar kategori yang mungkin keluar
 *   6. Batas waktu dan kuota pemanggilan
 *
 * Sampai jawaban diterima:
 *   - `EXPO_PUBLIC_AI_BASE_URL` diperlakukan sebagai URL endpoint penuh.
 *   - Permintaan memakai POST JSON `{ alasan }` dengan header Bearer.
 *   - Nama field kategori dibaca lewat `petakanResponsAi` di `ai-pemetaan.ts`.
 * Tiga asumsi di atas adalah tebakan, bukan kontrak. Perbaiki di sini saja
 * setelah pengajar menjawab, lalu salin jawabannya ke bagian 8.5 dokumen sprint.
 */

import { klasifikasiAlasanMock } from './ai-mock';
import {
  BATAS_WAKTU_MS,
  PESAN_AI,
  bacaKonfigurasiAi,
  petakanResponsAi,
  type HasilKlasifikasi,
} from './ai-pemetaan';

/**
 * Mengembalikan kategori alasan, atau pesan gagal. Pemanggil tidak boleh
 * membatalkan pengajuan izin ketika fungsi ini gagal (AC US-10 nomor 4).
 */
export async function klasifikasiAlasan(alasan: string): Promise<HasilKlasifikasi> {
  if (process.env.EXPO_PUBLIC_AI_MOCK === '1') {
    return { ok: true, kategori: klasifikasiAlasanMock(alasan) };
  }

  const hasilKonfigurasi = bacaKonfigurasiAi();

  if (!hasilKonfigurasi.ok) {
    return { ok: false, pesan: hasilKonfigurasi.pesan };
  }

  const { baseUrl, apiKey } = hasilKonfigurasi.konfigurasi;
  const pembatal = new AbortController();
  const pengaturWaktu = setTimeout(() => pembatal.abort(), BATAS_WAKTU_MS);

  try {
    const respons = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ alasan }),
      signal: pembatal.signal,
    });

    if (!respons.ok) {
      return { ok: false, pesan: PESAN_AI.responsTidakValid };
    }

    return petakanResponsAi(await respons.json());
  } catch (galat) {
    if (galat instanceof Error && galat.name === 'AbortError') {
      return { ok: false, pesan: PESAN_AI.waktuHabis };
    }

    return { ok: false, pesan: PESAN_AI.gagalJaringan };
  } finally {
    clearTimeout(pengaturWaktu);
  }
}

export { BATAS_WAKTU_MS, PESAN_AI, bacaKonfigurasiAi, petakanResponsAi };
export type { HasilKlasifikasi };
