// Pemeriksaan otomatis pemetaan respons AI dan mock klasifikasi alasan.
//
// Jalankan: node src/lib/ai-logic.assert.mjs
//
// Pola sama dengan src/store/session-logic.assert.mjs: Node menjalankan
// TypeScript secara langsung, jadi modul diimpor dengan ekstensi eksplisit.

import { klasifikasiAlasanMock } from './ai-mock.ts';
import {
  KATEGORI_IZIN,
  bacaKonfigurasiAi,
  normalisasiKategori,
  petakanResponsAi,
} from './ai-pemetaan.ts';

let jumlah = 0;

function pastikan(kondisi, pesan) {
  jumlah += 1;
  if (!kondisi) throw new Error(`GAGAL: ${pesan}`);
}

/** Membungkus teks jawaban model ke bentuk respons chat completions. */
function respons(konten) {
  return { choices: [{ message: { role: 'assistant', content: konten } }] };
}

// 1. Jawaban kategori bersih diterima.
const sakit = petakanResponsAi(respons('sakit'));
pastikan(sakit.ok && sakit.kategori === 'sakit', 'kategori sakit harus terbaca');

// 2. Jawaban dengan tanda kutip, backtick, titik, dan huruf besar tetap terbaca.
for (const varian of ['"sakit"', '`sakit`', 'Sakit.', 'SAKIT', ' sakit ', "'sakit'"]) {
  const hasil = petakanResponsAi(respons(varian));
  pastikan(hasil.ok && hasil.kategori === 'sakit', `varian ${JSON.stringify(varian)} harus terbaca`);
}

// 3. Kategori berspasi dinormalisasi menjadi tanda hubung.
pastikan(
  normalisasiKategori('KEGIATAN KAMPUS') === 'kegiatan-kampus',
  'spasi harus menjadi tanda hubung',
);
pastikan(
  petakanResponsAi(respons('keadaan keluarga')).ok,
  'kategori berspasi harus diterima setelah normalisasi',
);
pastikan(
  petakanResponsAi(respons('Keadaan-Keluarga')).ok,
  'huruf besar pada kategori bergaris hubung harus diterima',
);

// 4. Setiap kategori resmi bisa dipetakan bolak-balik.
for (const kategori of KATEGORI_IZIN) {
  const hasil = petakanResponsAi(respons(kategori));
  pastikan(hasil.ok && hasil.kategori === kategori, `kategori ${kategori} harus dikenali`);
}

// 5. Jawaban prosa atau kategori asing ditolak, bukan ditebak "lainnya".
pastikan(
  !petakanResponsAi(respons('Praktikan tersebut sakit demam tinggi.')).ok,
  'prosa panjang harus ditolak, bukan ditebak',
);
pastikan(!petakanResponsAi(respons('kategori: sakit')).ok, 'bukan kategori persis harus ditolak');
pastikan(!petakanResponsAi(respons('membolos')).ok, 'kategori asing harus ditolak');
pastikan(!petakanResponsAi(respons('')).ok, 'jawaban kosong harus ditolak');
pastikan(!petakanResponsAi(respons('   ')).ok, 'jawaban spasi saja harus ditolak');

// 6. Bentuk respons rusak ditolak tanpa melempar.
pastikan(!petakanResponsAi(null).ok, 'respons null harus ditolak');
pastikan(!petakanResponsAi(undefined).ok, 'respons undefined harus ditolak');
pastikan(!petakanResponsAi('sakit').ok, 'respons string harus ditolak');
pastikan(!petakanResponsAi({}).ok, 'respons tanpa choices harus ditolak');
pastikan(!petakanResponsAi({ choices: [] }).ok, 'choices kosong harus ditolak');
pastikan(!petakanResponsAi({ choices: 'sakit' }).ok, 'choices bukan array harus ditolak');
pastikan(!petakanResponsAi({ choices: [{}] }).ok, 'choice tanpa message harus ditolak');
pastikan(!petakanResponsAi({ choices: [{ message: {} }] }).ok, 'message tanpa content harus ditolak');
pastikan(
  !petakanResponsAi({ choices: [{ message: { content: 42 } }] }).ok,
  'content bukan string harus ditolak',
);
pastikan(
  !petakanResponsAi({ choices: [{ message: { content: null } }] }).ok,
  'content null harus ditolak',
);

// 7. Pesan gagal tidak kosong supaya bisa langsung dipakai di banner.
const gagal = petakanResponsAi({ choices: [] });
pastikan(!gagal.ok && gagal.pesan.length > 0, 'pesan gagal tidak boleh kosong');

// 8. Konfigurasi kosong gagal cepat, bukan menembak jaringan.
const konfigurasi = bacaKonfigurasiAi();
if (!process.env.EXPO_PUBLIC_AI_BASE_URL || !process.env.EXPO_PUBLIC_AI_API_KEY) {
  pastikan(!konfigurasi.ok, 'env kosong harus ditolak');
  pastikan(!konfigurasi.ok && konfigurasi.pesan.length > 0, 'pesan env kosong tidak boleh kosong');
} else {
  pastikan(konfigurasi.ok && konfigurasi.konfigurasi.model.length > 0, 'model harus ada');
  pastikan(
    konfigurasi.ok && konfigurasi.konfigurasi.baseUrl.startsWith('http'),
    'baseUrl harus berupa URL',
  );
}

// 9. Mock deterministik dan hanya menghasilkan kategori resmi.
pastikan(klasifikasiAlasanMock('saya sakit demam') === 'sakit', 'kata sakit harus terdeteksi');
pastikan(
  klasifikasiAlasanMock('ada acara keluarga') === 'keadaan-keluarga',
  'kata keluarga harus terdeteksi',
);
pastikan(
  klasifikasiAlasanMock('mewakili kampus di lomba') === 'kegiatan-kampus',
  'kata lomba harus terdeteksi',
);
pastikan(klasifikasiAlasanMock('alasan lain') === 'lainnya', 'alasan tanpa kata kunci jadi lainnya');
pastikan(
  klasifikasiAlasanMock('SAKIT') === klasifikasiAlasanMock('sakit'),
  'mock harus tidak peka huruf besar kecil',
);
pastikan(
  KATEGORI_IZIN.includes(klasifikasiAlasanMock('apa saja')),
  'mock harus selalu menghasilkan kategori resmi',
);

console.log(`LULUS: ${jumlah} pemeriksaan`);
