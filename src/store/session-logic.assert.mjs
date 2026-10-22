// Pemeriksaan otomatis PRD bagian 12 atas logika sesi, presensi, dan login.
//
// Node menjalankan TypeScript secara langsung tetapi mewajibkan ekstensi file
// eksplisit, sedangkan `tsc` melarang impor berekstensi `.ts` tanpa
// `allowImportingTsExtensions`. Karena itu skrip ini berupa ESM `.mjs` yang
// dijalankan `node`, seperti `scripts/reset-project.js` bawaan proyek.
//
// Jalankan: node src/store/session-logic.assert.mjs

import { kredensial } from '../data/credentials.ts';
import { presensi as presensiAwal, sesi as sesiAwal, users } from '../data/dummy.ts';
import {
  bukaSesi,
  catatPresensi,
  gantiPeran,
  keluar,
  masuk,
  rekapSesi,
  sudahPresensi,
  tutupSesi,
} from './session-logic.ts';

const WAKTU = '2026-10-27T08:11:00';
const waktuBuka = '2026-10-29T15:40:00';
const waktuTutup = '2026-10-27T10:00:00';

let jumlah = 0;

function pastikan(kondisi, pesan) {
  jumlah += 1;
  if (!kondisi) throw new Error(`GAGAL: ${pesan}`);
}

function stateAwal() {
  return { user: null, sesi: sesiAwal, presensi: presensiAwal };
}

const sesiById = (state, sesiId) => state.sesi.find((s) => s.id === sesiId);

// 1. Login dengan username dan password benar diterima.
const loginBenar = masuk(stateAwal(), kredensial, users, 'ahmad', 'praktikan123');
pastikan(loginBenar.ok && loginBenar.user.id === 'mhs-1', 'login benar harus diterima');
pastikan(
  loginBenar.ok && loginBenar.state.user?.id === 'mhs-1',
  'login harus mengisi user pada state',
);
pastikan(
  masuk(stateAwal(), kredensial, users, 'Ahmad', 'praktikan123').ok,
  'username harus dicocokkan tanpa peka huruf besar/kecil',
);

// 2. Login dengan username atau password salah ditolak.
const loginSalah = masuk(stateAwal(), kredensial, users, 'ahmad', 'salah');
pastikan(!loginSalah.ok, 'login salah harus ditolak');
pastikan(
  loginSalah.pesan === 'Username atau kata sandi salah',
  'pesan login salah harus mengikuti PRD bagian 10',
);

// 3. Presensi saat belum dibuka ditolak.
const presensiBelumDibuka = catatPresensi(stateAwal(), 'sesi-4', 'mhs-1', WAKTU);
pastikan(!presensiBelumDibuka.ok, 'presensi saat belum dibuka harus ditolak');
pastikan(
  presensiBelumDibuka.pesan === 'Sesi belum dibuka',
  'pesan presensi saat belum dibuka harus mengikuti PRD bagian 10',
);

// 4. Presensi saat dibuka oleh peserta terdaftar diterima, waktu terisi.
const presensiPertama = catatPresensi(stateAwal(), 'sesi-2', 'mhs-1', WAKTU);
pastikan(presensiPertama.ok, 'presensi pada sesi dibuka harus diterima');
pastikan(
  presensiPertama.ok && presensiPertama.state.presensi.at(-1).waktu === WAKTU,
  'waktu presensi harus terisi',
);
pastikan(
  presensiPertama.pesan === 'Presensi tercatat pukul 08:11',
  'pesan presensi harus memuat jam perangkat',
);

// 5. Presensi kedua pada sesi sama ditolak, catatan awal tidak tertimpa.
const presensiKedua = catatPresensi(presensiPertama.state, 'sesi-2', 'mhs-1', waktuTutup);
pastikan(!presensiKedua.ok, 'presensi ganda harus ditolak');
pastikan(
  presensiKedua.pesan === 'Presensi sudah tercatat pada sesi ini',
  'pesan presensi ganda harus mengikuti PRD bagian 10',
);
const catatanAwal = presensiPertama.state.presensi.filter(
  (p) => p.sesiId === 'sesi-2' && p.praktikanId === 'mhs-1',
);
pastikan(
  catatanAwal.length === 1 && catatanAwal[0].waktu === WAKTU,
  'catatan presensi awal tidak boleh tertimpa',
);

// 6. Presensi setelah ditutup ditolak.
const presensiSesudahTutup = catatPresensi(stateAwal(), 'sesi-1', 'mhs-1', WAKTU);
pastikan(!presensiSesudahTutup.ok, 'presensi pada sesi ditutup harus ditolak');
pastikan(
  presensiSesudahTutup.pesan === 'Sesi sudah ditutup',
  'pesan presensi pada sesi ditutup harus mengikuti PRD bagian 10',
);

// 7. Presensi oleh praktikan tidak terdaftar ditolak.
const presensiTakTerdaftar = catatPresensi(stateAwal(), 'sesi-2', 'mhs-4', WAKTU);
pastikan(!presensiTakTerdaftar.ok, 'presensi praktikan tidak terdaftar harus ditolak');
pastikan(
  presensiTakTerdaftar.pesan === 'Kamu tidak terdaftar pada sesi ini',
  'pesan praktikan tidak terdaftar harus mengikuti PRD bagian 10',
);

// 8. Logout mengosongkan user tanpa mengubah sesi dan presensi.
const sebelumKeluar = { ...loginBenar.state, presensi: presensiPertama.state.presensi };
const sesudahKeluar = keluar(sebelumKeluar);
pastikan(sesudahKeluar.user === null, 'logout harus mengosongkan user');
pastikan(
  sesudahKeluar.sesi === sebelumKeluar.sesi && sesudahKeluar.presensi === sebelumKeluar.presensi,
  'logout tidak boleh mengubah referensi sesi dan presensi',
);
pastikan(
  sesudahKeluar.sesi.length === sesiAwal.length &&
    sesudahKeluar.presensi.length === presensiAwal.length + 1,
  'jumlah sesi dan presensi harus tetap setelah logout',
);

// Tambahan US-12/US-14/US-16: buka dan tutup sesi beserta aksinya yang tidak valid.
const buka = bukaSesi(stateAwal(), 'sesi-4', waktuBuka);
pastikan(buka.ok, 'buka sesi pada status belum dibuka harus diterima');
pastikan(
  buka.ok &&
    sesiById(buka.state, 'sesi-4').status === 'dibuka' &&
    sesiById(buka.state, 'sesi-4').dibukaPada === waktuBuka,
  'buka sesi harus mengubah status dan mencatat waktu buka',
);
const bukaLagi = bukaSesi(buka.state, 'sesi-4', WAKTU);
pastikan(!bukaLagi.ok && bukaLagi.pesan === 'Sesi sudah dibuka', 'buka sesi ganda harus ditolak');

const tutup = tutupSesi(stateAwal(), 'sesi-2', waktuTutup);
pastikan(tutup.ok, 'tutup sesi pada status dibuka harus diterima');
pastikan(
  tutup.ok &&
    sesiById(tutup.state, 'sesi-2').status === 'ditutup' &&
    sesiById(tutup.state, 'sesi-2').ditutupPada === waktuTutup,
  'tutup sesi harus mengubah status dan mencatat waktu tutup',
);
const tutupBelumDibuka = tutupSesi(stateAwal(), 'sesi-4', waktuTutup);
pastikan(
  !tutupBelumDibuka.ok && tutupBelumDibuka.pesan === 'Sesi belum dibuka',
  'tutup sesi yang belum dibuka harus ditolak dengan alasan yang terlihat',
);
pastikan(
  !bukaSesi(stateAwal(), 'sesi-99', waktuBuka).ok,
  'aksi pada sesi yang tidak ada harus ditolak',
);

// Tambahan kontrak PEMBAGIAN-TUGAS bagian 4: pemetaan ganti peran demo.
const sebagaiAsisten = masuk(stateAwal(), kredensial, users, 'budi', 'asisten123');
pastikan(sebagaiAsisten.ok && sebagaiAsisten.user.id === 'asisten-1', 'login asisten harus diterima');
const kePraktikan = gantiPeran(sebagaiAsisten.state, users);
pastikan(
  kePraktikan.ok && kePraktikan.user.id === 'mhs-1',
  'ganti peran dari asisten harus mengarah ke mhs-1',
);
const keAsisten = gantiPeran(kePraktikan.state, users);
pastikan(
  keAsisten.ok && keAsisten.user.id === 'asisten-1',
  'ganti peran dari praktikan harus mengarah ke asisten-1',
);
const peranAsing = gantiPeran(sebagaiAsisten.state, users, 'mhs-99');
pastikan(
  !peranAsing.ok && peranAsing.pesan === 'Peran demo tidak dikenali',
  'id peran yang tidak dikenal harus ditolak tanpa mengubah user',
);

// Tambahan: rekap urut waktu dan sudahPresensi per pasangan sesi dan praktikan.
const rekap = rekapSesi('sesi-1', presensiAwal, users);
pastikan(
  rekap.length === 1 && rekap[0].praktikan.id === 'mhs-1',
  'rekap harus memuat presensi sesi terkait saja',
);
const rekapGanda = rekapSesi('sesi-2', presensiPertama.state.presensi, users);
pastikan(
  rekapGanda.length === 2 && rekapGanda[0].waktu <= rekapGanda[1].waktu,
  'rekap harus urut waktu',
);
pastikan(
  sudahPresensi(presensiAwal, 'sesi-1', 'mhs-1') &&
    !sudahPresensi(presensiAwal, 'sesi-1', 'mhs-2'),
  'sudahPresensi harus tepat per pasangan sesi dan praktikan',
);

console.log(`LULUS: ${jumlah} pemeriksaan`);
