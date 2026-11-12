/**
 * Seed data uji PraktikumKU menggunakan Firebase Admin SDK.
 *
 * Alasan memakai Admin SDK: seed menulis dokumen untuk beberapa pengguna
 * sekaligus (asisten, praktikan) dan membuat akun asisten — hal yang dilarang
 * Security Rules, dan memang seharusnya dilarang. Admin SDK melewati rules,
 * jadi rules tidak pernah dilonggarkan hanya untuk seed.
 *
 * Kredensial: file service account JSON di luar repo. Dicari lewat env
 * GOOGLE_APPLICATION_CREDENTIALS, atau file *firebase-adminsdk*.json di folder
 * induk repo.
 *
 * Jalankan: node scripts/seed.mjs
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

const akarRepo = dirname(dirname(fileURLToPath(import.meta.url)));

const envPath = join(akarRepo, '.env');

if (!existsSync(envPath)) {
  console.error('File .env tidak ditemukan. Salin .env.example menjadi .env lalu isi nilainya.');
  process.exit(1);
}

for (const baris of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
  const cocok = baris.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (!cocok) continue;
  const nilai = cocok[2].replace(/^["']|["']$/g, '');
  if (!process.env[cocok[1]]) process.env[cocok[1]] = nilai;
}

const wajib = [
  'SEED_ASISTEN_1_EMAIL',
  'SEED_ASISTEN_1_PASSWORD',
  'SEED_ASISTEN_2_EMAIL',
  'SEED_ASISTEN_2_PASSWORD',
  'SEED_PRAKTIKAN_1_EMAIL',
  'SEED_PRAKTIKAN_1_PASSWORD',
];

const hilang = wajib.filter((nama) => !process.env[nama]);
if (hilang.length > 0) {
  console.error('Variabel berikut kosong di .env:', hilang.join(', '));
  process.exit(1);
}

/** Temukan service account JSON di luar repo. */
function temukanKredensial() {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return process.env.GOOGLE_APPLICATION_CREDENTIALS;
  }

  const induk = dirname(akarRepo);

  try {
    const kandidat = readdirSync(induk).filter(
      (nama) => nama.includes('firebase-adminsdk') && nama.endsWith('.json'),
    );

    if (kandidat.length > 0) return join(induk, kandidat[0]);
  } catch {
    // Folder induk tidak terbaca; biarkan pesan error di bawah yang menjelaskan.
  }

  return undefined;
}

const pathKredensial = temukanKredensial();

if (!pathKredensial || !existsSync(pathKredensial)) {
  console.error(
    'Service account tidak ditemukan. Unduh dari Firebase Console > Project Settings >',
    'Service accounts, lalu set env GOOGLE_APPLICATION_CREDENTIALS ke path file JSON.',
  );
  process.exit(1);
}

const projectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;

initializeApp({
  credential: cert(pathKredensial),
  ...(projectId ? { projectId } : {}),
});

const auth = getAuth();
const db = getFirestore();

/** Akun dibuat kalau belum ada, lalu uid dikembalikan. */
async function pastikanAkun(email, password) {
  try {
    const pengguna = await auth.getUserByEmail(email);
    return pengguna.uid;
  } catch (error) {
    if (error?.code !== 'auth/user-not-found') throw error;

    const pengguna = await auth.createUser({ email, password });
    return pengguna.uid;
  }
}

async function tulisUsers(uid, data) {
  await db
    .collection('users')
    .doc(uid)
    .set({ ...data, dibuatPada: Timestamp.now() });
}

const uidAsisten1 = await pastikanAkun(
  process.env.SEED_ASISTEN_1_EMAIL,
  process.env.SEED_ASISTEN_1_PASSWORD,
);
await tulisUsers(uidAsisten1, {
  nama: 'Budi',
  nomorInduk: '198504122010121001',
  peran: 'asisten',
});

const uidAsisten2 = await pastikanAkun(
  process.env.SEED_ASISTEN_2_EMAIL,
  process.env.SEED_ASISTEN_2_PASSWORD,
);
await tulisUsers(uidAsisten2, {
  nama: 'Siti',
  nomorInduk: '199003212015042002',
  peran: 'asisten',
});

const uidPraktikan1 = await pastikanAkun(
  process.env.SEED_PRAKTIKAN_1_EMAIL,
  process.env.SEED_PRAKTIKAN_1_PASSWORD,
);
await tulisUsers(uidPraktikan1, {
  nama: 'Ahmad',
  nomorInduk: '2410511001',
  peran: 'praktikan',
});

const kelas = [
  {
    id: 'kelas-dasar-pemrograman',
    nama: 'Dasar Pemrograman',
    lab: 'Lab A',
    asistenId: uidAsisten1,
    pesertaIds: [uidPraktikan1],
  },
  {
    id: 'kelas-struktur-data',
    nama: 'Struktur Data',
    lab: 'Lab B',
    asistenId: uidAsisten1,
    pesertaIds: [uidPraktikan1],
  },
];

for (const item of kelas) {
  await db.collection('kelas').doc(item.id).set({
    nama: item.nama,
    lab: item.lab,
    asistenId: item.asistenId,
    pesertaIds: item.pesertaIds,
    dibuatPada: Timestamp.now(),
  });
}

function waktu(iso) {
  return Timestamp.fromDate(new Date(iso));
}

const sesi = [
  {
    id: 'sesi-1',
    kelasId: 'kelas-dasar-pemrograman',
    hari: 'Kamis',
    tanggal: '2026-11-12',
    jamMulai: '13:00',
    jamSelesai: '15:00',
    status: 'ditutup',
    dibukaPada: waktu('2026-11-12T13:00:00+07:00'),
    ditutupPada: waktu('2026-11-12T15:00:00+07:00'),
  },
  {
    id: 'sesi-2',
    kelasId: 'kelas-dasar-pemrograman',
    hari: 'Jumat',
    tanggal: '2026-11-13',
    jamMulai: '13:00',
    jamSelesai: '15:00',
    status: 'belum-dibuka',
  },
  {
    id: 'sesi-3',
    kelasId: 'kelas-dasar-pemrograman',
    hari: 'Senin',
    tanggal: '2026-11-16',
    jamMulai: '13:00',
    jamSelesai: '15:00',
    status: 'belum-dibuka',
  },
  {
    id: 'sesi-4',
    kelasId: 'kelas-struktur-data',
    hari: 'Selasa',
    tanggal: '2026-11-17',
    jamMulai: '10:00',
    jamSelesai: '12:00',
    status: 'belum-dibuka',
  },
  {
    id: 'sesi-5',
    kelasId: 'kelas-struktur-data',
    hari: 'Rabu',
    tanggal: '2026-11-18',
    jamMulai: '10:00',
    jamSelesai: '12:00',
    status: 'belum-dibuka',
  },
];

for (const item of sesi) {
  await db.collection('sesi').doc(item.id).set({
    kelasId: item.kelasId,
    asistenId: uidAsisten1,
    hari: item.hari,
    tanggal: item.tanggal,
    jamMulai: item.jamMulai,
    jamSelesai: item.jamSelesai,
    status: item.status,
    ...(item.dibukaPada ? { dibukaPada: item.dibukaPada } : {}),
    ...(item.ditutupPada ? { ditutupPada: item.ditutupPada } : {}),
    dibuatPada: Timestamp.now(),
  });
}

// Satu presensi pada sesi yang sudah ditutup, supaya riwayat dan rekap tidak kosong.
await db
  .collection('sesi')
  .doc('sesi-1')
  .collection('presensi')
  .doc(uidPraktikan1)
  .set({
    praktikanId: uidPraktikan1,
    waktu: waktu('2026-11-12T13:05:00+07:00'),
  });

console.log('Seed selesai. Akun uji:');
console.log(`- Asisten 1 (Budi): ${process.env.SEED_ASISTEN_1_EMAIL}`);
console.log(`- Asisten 2 (Siti): ${process.env.SEED_ASISTEN_2_EMAIL}`);
console.log(`- Praktikan (Ahmad): ${process.env.SEED_PRAKTIKAN_1_EMAIL}`);
console.log('Password mengikuti nilai SEED_* di .env.');
