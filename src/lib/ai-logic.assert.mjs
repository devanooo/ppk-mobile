// Pemeriksaan otomatis pemetaan respons AI dan mock klasifikasi alasan.
//
// Jalankan: node src/lib/ai-logic.assert.mjs
//
// Pola sama dengan src/store/session-logic.assert.mjs: Node menjalankan
// TypeScript secara langsung, jadi modul diimpor dengan ekstensi eksplisit.

import { klasifikasiAlasanMock } from './ai-mock.ts';
import { bacaKonfigurasiAi, petakanResponsAi } from './ai-pemetaan.ts';

let jumlah = 0;

function pastikan(kondisi, pesan) {
  jumlah += 1;
  if (!kondisi) throw new Error(`GAGAL: ${pesan}`);
}

// 1. Respons dengan field `kategori` diterima.
const kategori = petakanResponsAi({ kategori: 'sakit' });
pastikan(kategori.ok && kategori.kategori === 'sakit', 'field kategori harus terbaca');
pastikan(
  petakanResponsAi({ kategori: '  sakit  ' }).ok,
  'spasi di tepi kategori harus dirapikan',
);

// 2. Respons dengan nama field alternatif tetap terbaca.
const kategoriAlternatif = petakanResponsAi({ category: 'keadaan-keluarga' });
pastikan(
  kategoriAlternatif.ok && kategoriAlternatif.kategori === 'keadaan-keluarga',
  'field category harus dikenali sebagai alternatif',
);
const labelAlternatif = petakanResponsAi({ label: 'lainnya' });
pastikan(labelAlternatif.ok && labelAlternatif.kategori === 'lainnya', 'field label harus dikenali');

// 3. Respons tanpa field kategori ditolak dengan pesan yang bisa ditampilkan.
pastikan(!petakanResponsAi({}).ok, 'respons tanpa kategori harus ditolak');
pastikan(!petakanResponsAi({ kategori: '' }).ok, 'kategori kosong harus ditolak');
pastikan(!petakanResponsAi({ kategori: null }).ok, 'kategori null harus ditolak');

// 4. Respons bukan objek ditolak tanpa melempar.
pastikan(!petakanResponsAi(null).ok, 'respons null harus ditolak');
pastikan(!petakanResponsAi(undefined).ok, 'respons undefined harus ditolak');
pastikan(!petakanResponsAi('sakit').ok, 'respons string harus ditolak');
pastikan(!petakanResponsAi(42).ok, 'respons angka harus ditolak');

// 5. Pesan gagal tidak kosong supaya bisa langsung dipakai di banner.
const gagal = petakanResponsAi({});
pastikan(!gagal.ok && gagal.pesan.length > 0, 'pesan gagal tidak boleh kosong');

// 6. Konfigurasi kosong gagal cepat, bukan menembak jaringan.
const konfigurasi = bacaKonfigurasiAi();
if (!process.env.EXPO_PUBLIC_AI_BASE_URL || !process.env.EXPO_PUBLIC_AI_API_KEY) {
  pastikan(!konfigurasi.ok, 'env kosong harus ditolak');
  pastikan(!konfigurasi.ok && konfigurasi.pesan.length > 0, 'pesan env kosong tidak boleh kosong');
}

// 7. Mock klasifikasi deterministik dan selalu mengembalikan kategori yang dikenal.
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

console.log(`LULUS: ${jumlah} pemeriksaan`);
