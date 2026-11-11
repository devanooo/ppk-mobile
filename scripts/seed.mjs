import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {
  Timestamp,
  doc,
  getFirestore,
  setDoc,
} from 'firebase/firestore';

const envPath = fileURLToPath(new URL('../.env', import.meta.url));

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
  'EXPO_PUBLIC_FIREBASE_API_KEY',
  'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
  'EXPO_PUBLIC_FIREBASE_APP_ID',
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

const app = initializeApp({
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
});

const auth = getAuth(app);
const db = getFirestore(app);

/** Akun dibuat kalau belum ada, lalu uid dikembalikan. */
async function pastikanAkun(email, password) {
  try {
    const kredensial = await createUserWithEmailAndPassword(auth, email, password);
    return kredensial.user.uid;
  } catch (error) {
    if (error?.code !== 'auth/email-already-in-use') throw error;
    const kredensial = await signInWithEmailAndPassword(auth, email, password);
    return kredensial.user.uid;
  }
}

async function tulisUsers(uid, data) {
  await setDoc(doc(db, 'users', uid), {
    ...data,
    dibuatPada: Timestamp.now(),
  });
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

// Seed kelas dan sesi ditulis sebagai asisten pertama agar aturan kepemilikan terpenuhi.
await signInWithEmailAndPassword(
  auth,
  process.env.SEED_ASISTEN_1_EMAIL,
  process.env.SEED_ASISTEN_1_PASSWORD,
);

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
  await setDoc(doc(db, 'kelas', item.id), {
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
  await setDoc(doc(db, 'sesi', item.id), {
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
await setDoc(doc(db, 'sesi', 'sesi-1', 'presensi', uidPraktikan1), {
  praktikanId: uidPraktikan1,
  waktu: waktu('2026-11-12T13:05:00+07:00'),
});

console.log('Seed selesai. Akun uji:');
console.log(`- Asisten 1 (Budi): ${process.env.SEED_ASISTEN_1_EMAIL}`);
console.log(`- Asisten 2 (Siti): ${process.env.SEED_ASISTEN_2_EMAIL}`);
console.log(`- Praktikan (Ahmad): ${process.env.SEED_PRAKTIKAN_1_EMAIL}`);
console.log('Password mengikuti nilai SEED_* di .env.');
