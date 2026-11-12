/**
 * Pemetaan respons API AI ke kategori (T-042).
 *
 * Dipisah dari `ai.ts` karena modul ini tidak boleh punya impor runtime sama
 * sekali: `src/lib/ai-logic.assert.mjs` mengimpornya langsung lewat Node, yang
 * mewajibkan ekstensi `.ts` pada setiap impor relatif. Modul ini adalah
 * SATU-SATUNYA tempat respons diterjemahkan.
 *
 * Kontrak endpoint: OpenAI Chat Completions (`/v1/chat/completions`). Model
 * mengembalikan teks bebas di `choices[0].message.content`, bukan JSON
 * terstruktur, jadi jawabannya dinormalisasi lalu dicocokkan ke daftar
 * kategori.
 */

export const BATAS_WAKTU_MS = 8000;

/**
 * Model bawaan. Contoh dari pengajar menyebut `claude-fable-5`, tetapi model
 * itu tidak terdaftar di `GET /v1/models` provider dan ditolak dengan
 * `model_not_found`. `gpt-5.6` adalah model pada daftar yang berhasil menjawab
 * saat dicek. Ubah lewat `EXPO_PUBLIC_AI_MODEL` bila pengajar memberi model lain.
 */
export const MODEL_AI_BAWAAN = 'gpt-5.6';

/** Satu sumber daftar kategori: dipakai prompt, normalisasi, dan mock. */
export const KATEGORI_IZIN = [
  'sakit',
  'keadaan-keluarga',
  'kegiatan-kampus',
  'lainnya',
] as const;

export type KategoriIzin = (typeof KATEGORI_IZIN)[number];

export type HasilKlasifikasi =
  | { ok: true; kategori: string }
  | { ok: false; pesan: string };

type KonfigurasiAi = { baseUrl: string; apiKey: string; model: string };

export const PESAN_AI = {
  envKosong: 'Layanan klasifikasi alasan belum dikonfigurasi',
  kunciTidakValid: 'Kunci API klasifikasi alasan tidak valid',
  kuotaHabis: 'Kuota klasifikasi alasan sudah habis',
  gagalJaringan: 'Klasifikasi alasan gagal karena masalah jaringan',
  waktuHabis: 'Klasifikasi alasan melewati batas waktu',
  responsTidakValid: 'Respons klasifikasi alasan tidak dapat dibaca',
};

/** Membaca `EXPO_PUBLIC_*` langsung supaya nilai di-inline saat bundling. */
export function bacaKonfigurasiAi():
  | { ok: true; konfigurasi: KonfigurasiAi }
  | { ok: false; pesan: string } {
  const baseUrl = process.env.EXPO_PUBLIC_AI_BASE_URL;
  const apiKey = process.env.EXPO_PUBLIC_AI_API_KEY;

  if (!baseUrl || !apiKey) {
    return { ok: false, pesan: PESAN_AI.envKosong };
  }

  return {
    ok: true,
    konfigurasi: {
      baseUrl,
      apiKey,
      model: process.env.EXPO_PUBLIC_AI_MODEL || MODEL_AI_BAWAAN,
    },
  };
}

/**
 * Merapikan jawaban model menjadi bentuk kanonik: huruf kecil, tanpa tanda
 * kutip/backtick/titik, dan spasi menjadi tanda hubung. Mengembalikan
 * `undefined` bila hasilnya bukan kategori yang dikenal, supaya pemanggil bisa
 * melaporkan kegagalan alih-alih menebak `lainnya`.
 */
export function normalisasiKategori(teks: string): KategoriIzin | undefined {
  const rapi = teks
    .toLowerCase()
    .replace(/["'`*.]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  return KATEGORI_IZIN.find((kategori) => kategori === rapi);
}

export function petakanResponsAi(json: unknown): HasilKlasifikasi {
  if (!json || typeof json !== 'object') {
    return { ok: false, pesan: PESAN_AI.responsTidakValid };
  }

  const choices = (json as { choices?: unknown }).choices;

  if (!Array.isArray(choices) || choices.length === 0) {
    return { ok: false, pesan: PESAN_AI.responsTidakValid };
  }

  const pesan = (choices[0] as { message?: unknown })?.message;
  const isi = (pesan as { content?: unknown })?.content;

  if (typeof isi !== 'string' || isi.trim() === '') {
    return { ok: false, pesan: PESAN_AI.responsTidakValid };
  }

  const kategori = normalisasiKategori(isi);

  if (!kategori) {
    return { ok: false, pesan: PESAN_AI.responsTidakValid };
  }

  return { ok: true, kategori };
}
