/**
 * Klien klasifikasi alasan izin (T-042).
 *
 * Endpoint dari pengajar: `https://aotianzz.xyz/v1/chat/completions`
 * Format: OpenAI Chat Completions.
 *
 * Semua pemetaan ke API AI dikumpulkan di `ai.ts` dan `ai-pemetaan.ts` supaya
 * perubahan skema hanya menyentuh satu tempat (docs/sprints/sprint-2.md
 * bagian 8.5).
 *
 * Yang diketahui dari pengajar:
 *   - Path endpoint: /v1/chat/completions (OpenAI-compatible)
 *   - Header autentikasi: `Authorization: Bearer <kunci>`
 *   - Body: `{ model, messages }`
 *   - Kategori dibaca dari `choices[0].message.content`
 *
 * Catatan saat menghubungi endpoint nyata:
 *   - Model `claude-fable-5` pada contoh TIDAK tersedia; provider menjawab
 *     `model_not_found`. Bawaan kini `gpt-5.6`, lihat `MODEL_AI_BAWAAN`.
 *   - Sebagian model membalas 429/502 karena antrean provider, bukan karena
 *     permintaan salah. Pesan 429 dipetakan ke "kuota habis"; 502 jatuh ke
 *     pesan respons tidak valid.
 *
 * Yang BELUM dipastikan dan perlu ditanyakan bila ingin mengubah perilaku:
 *   - Daftar kategori resmi (sekarang dipakai daftar lokal di ai-pemetaan.ts)
 *   - Batas waktu dan kuota pemanggilan
 *   - Apakah provider mendukung `response_format` terstruktur
 */

import { klasifikasiAlasanMock } from './ai-mock';
import {
  BATAS_WAKTU_MS,
  KATEGORI_IZIN,
  PESAN_AI,
  bacaKonfigurasiAi,
  petakanResponsAi,
  type HasilKlasifikasi,
} from './ai-pemetaan';

/**
 * Model diminta menjawab satu kata kategori saja. Instruksi dibuat tegas karena
 * jawaban diurai dengan pencocokan persis, bukan dibaca sebagai prosa.
 */
const PROMPT_SISTEM = [
  'Kamu mengklasifikasikan alasan izin praktikum.',
  `Jawab HANYA dengan satu kata dari daftar ini: ${KATEGORI_IZIN.join(', ')}.`,
  'Tanpa penjelasan, tanpa tanda kutip, tanpa kalimat.',
].join(' ');

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

  const { baseUrl, apiKey, model } = hasilKonfigurasi.konfigurasi;
  const pembatal = new AbortController();
  const pengaturWaktu = setTimeout(() => pembatal.abort(), BATAS_WAKTU_MS);

  try {
    const respons = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0,
        messages: [
          { role: 'system', content: PROMPT_SISTEM },
          { role: 'user', content: alasan },
        ],
      }),
      signal: pembatal.signal,
    });

    if (respons.status === 401 || respons.status === 403) {
      return { ok: false, pesan: PESAN_AI.kunciTidakValid };
    }

    if (respons.status === 429) {
      return { ok: false, pesan: PESAN_AI.kuotaHabis };
    }

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

export {
  BATAS_WAKTU_MS,
  KATEGORI_IZIN,
  MODEL_AI_BAWAAN,
  PESAN_AI,
  bacaKonfigurasiAi,
  normalisasiKategori,
  petakanResponsAi,
} from './ai-pemetaan';
export type { HasilKlasifikasi, KategoriIzin } from './ai-pemetaan';
