/**
 * Pemetaan respons API AI ke kategori (T-042).
 *
 * Dipisah dari `ai.ts` karena modul ini tidak boleh punya impor runtime sama
 * sekali: `src/lib/ai-logic.assert.mjs` mengimpornya langsung lewat Node, yang
 * mewajibkan ekstensi `.ts` pada setiap impor relatif. Modul ini adalah
 * SATU-SATUNYA tempat nama field respons diterjemahkan.
 *
 * Nama field yang dicoba adalah tebakan sampai pengajar mengonfirmasi skema
 * respons (docs/sprints/sprint-2.md bagian 8.5).
 */

export const BATAS_WAKTU_MS = 8000;

export type HasilKlasifikasi =
  | { ok: true; kategori: string }
  | { ok: false; pesan: string };

type KonfigurasiAi = { baseUrl: string; apiKey: string };

export const PESAN_AI = {
  envKosong: 'Layanan klasifikasi alasan belum dikonfigurasi',
  gagalJaringan: 'Klasifikasi alasan gagal karena masalah jaringan',
  waktuHabis: 'Klasifikasi alasan melewati batas waktu',
  responsTidakValid: 'Respons klasifikasi alasan tidak dapat dibaca',
};

/** Nama field respons yang mungkin dipakai API, sesuai urutan prioritas. */
const FIELD_KATEGORI = ['kategori', 'category', 'label'] as const;

/** Membaca `EXPO_PUBLIC_*` langsung supaya nilai di-inline saat bundling. */
export function bacaKonfigurasiAi():
  | { ok: true; konfigurasi: KonfigurasiAi }
  | { ok: false; pesan: string } {
  const baseUrl = process.env.EXPO_PUBLIC_AI_BASE_URL;
  const apiKey = process.env.EXPO_PUBLIC_AI_API_KEY;

  if (!baseUrl || !apiKey) {
    return { ok: false, pesan: PESAN_AI.envKosong };
  }

  return { ok: true, konfigurasi: { baseUrl, apiKey } };
}

export function petakanResponsAi(json: unknown): HasilKlasifikasi {
  if (!json || typeof json !== 'object') {
    return { ok: false, pesan: PESAN_AI.responsTidakValid };
  }

  const isi = json as Record<string, unknown>;

  for (const kunci of FIELD_KATEGORI) {
    const nilai = isi[kunci];

    if (typeof nilai === 'string' && nilai.trim() !== '') {
      return { ok: true, kategori: nilai.trim() };
    }
  }

  return { ok: false, pesan: PESAN_AI.responsTidakValid };
}
