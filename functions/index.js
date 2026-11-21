// Trigger notifikasi PraktikumKU.
//
// Alur: perubahan Firestore -> Cloud Functions -> Firebase Admin SDK -> FCM.
// Klien tidak mengirim ke FCM langsung; klien hanya menyimpan token perangkat
// di koleksi `tokenPerangkat/{token}`.
//
// Setiap event diklaim lebih dulu di koleksi `peristiwaNotifikasi` agar event
// yang sama tidak menghasilkan notifikasi ganda (T-070). Koleksi ini hanya
// ditulis server; klien tidak punya akses.
//
// Deploy memerlukan paket Blaze dan konfigurasi FCM/APNs pada project Firebase.

const { setGlobalOptions } = require('firebase-functions/v2');
const { onDocumentUpdated } = require('firebase-functions/v2/firestore');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { getMessaging } = require('firebase-admin/messaging');

initializeApp();

const db = getFirestore();
const messaging = getMessaging();

setGlobalOptions({ region: 'asia-southeast2' });

const KOLEKSI_TOKEN = 'tokenPerangkat';
const KOLEKSI_PERISTIWA = 'peristiwaNotifikasi';
const MAKS_TOKEN_PER_KUERY = 30;

/** Menandai event sudah diproses. Mengembalikan false bila sudah pernah. */
async function klaimPeristiwa(kunci) {
  try {
    await db.collection(KOLEKSI_PERISTIWA).doc(kunci).create({
      dibuatPada: FieldValue.serverTimestamp(),
    });

    return true;
  } catch (galat) {
    // Kode 6 ALREADY_EXISTS berarti event ini sudah pernah diproses.
    if (galat && galat.code === 6) return false;
    throw galat;
  }
}

function waktuKunci(nilai) {
  if (!nilai) return 'tanpa-waktu';
  if (typeof nilai.toMillis === 'function') return String(nilai.toMillis());
  return String(nilai);
}

function rapikanData(data) {
  const hasil = {};

  for (const [kunci, nilai] of Object.entries(data)) {
    if (nilai === undefined || nilai === null) continue;
    hasil[kunci] = String(nilai);
  }

  return hasil;
}

/** Mengambil token milik sekumpulan pengguna, dipotong per 30 uid. */
async function ambilToken(uids) {
  const unik = [...new Set(uids)].filter(Boolean);
  const hasil = [];

  for (let mulai = 0; mulai < unik.length; mulai += MAKS_TOKEN_PER_KUERY) {
    const potong = unik.slice(mulai, mulai + MAKS_TOKEN_PER_KUERY);
    const snapshot = await db
      .collection(KOLEKSI_TOKEN)
      .where('uid', 'in', potong)
      .get();

    for (const dokumen of snapshot.docs) {
      hasil.push(dokumen.id);
    }
  }

  return hasil;
}

/** Menghapus token yang sudah tidak valid agar tidak dicoba lagi. */
async function bersihkanTokenGagal(token, responses) {
  const gagal = [];

  responses.forEach((respons, indeks) => {
    if (respons.success) return;

    const kode = respons.error?.code ?? '';
    const tidakValid =
      kode.includes('registration-token-not-registered') ||
      kode.includes('invalid-argument') ||
      kode.includes('invalid-registration-token');

    if (tidakValid) gagal.push(token[indeks]);
  });

  await Promise.all(
    gagal.map((nilai) =>
      db.collection(KOLEKSI_TOKEN).doc(nilai).delete().catch(() => undefined),
    ),
  );
}

/** Mengirim satu notifikasi ke sekumpulan pengguna. */
async function kirimKePengguna(uids, judul, isi, data) {
  const token = await ambilToken(uids);

  if (token.length === 0) {
    console.warn('Tidak ada token perangkat untuk penerima:', uids);
    return;
  }

  const respons = await messaging.sendEachForMulticast({
    tokens: token,
    notification: { title: judul, body: isi },
    data: rapikanData(data),
  });

  await bersihkanTokenGagal(token, respons.responses);
}

async function namaKelas(kelasId) {
  if (!kelasId) return 'Sesi praktikum';

  const dokumen = await db.doc(`kelas/${kelasId}`).get();

  return dokumen.get('nama') ?? 'Sesi praktikum';
}

exports.notifikasiSesiDibuka = onDocumentUpdated(
  'sesi/{sesiId}',
  async (event) => {
    const sebelum = event.data?.before.data();
    const sesudah = event.data?.after.data();

    if (!sebelum || !sesudah) return;
    if (sebelum.status === sesudah.status) return;
    if (sesudah.status !== 'dibuka') return;

    const kunci = `sesi-dibuka:${event.params.sesiId}:${waktuKunci(sesudah.dibukaPada)}`;
    if (!(await klaimPeristiwa(kunci))) return;

    const kelas = await db.doc(`kelas/${sesudah.kelasId}`).get();
    const peserta = kelas.get('pesertaIds') ?? [];

    await kirimKePengguna(
      peserta,
      'Presensi dibuka',
      `${kelas.get('nama') ?? 'Sesi praktikum'} sudah dibuka. Pindai QR untuk presensi.`,
      { tipe: 'sesi-dibuka', sesiId: event.params.sesiId },
    );
  },
);

exports.notifikasiJadwalBerubah = onDocumentUpdated(
  'sesi/{sesiId}',
  async (event) => {
    const sebelum = event.data?.before.data();
    const sesudah = event.data?.after.data();

    if (!sebelum || !sesudah) return;

    const berubah = ['tanggal', 'jamMulai', 'jamSelesai'].some(
      (field) => sebelum[field] !== sesudah[field],
    );

    if (!berubah) return;

    const kunci = `jadwal-berubah:${event.params.sesiId}:${sesudah.tanggal}T${sesudah.jamMulai}-${sesudah.jamSelesai}`;
    if (!(await klaimPeristiwa(kunci))) return;

    const kelas = await db.doc(`kelas/${sesudah.kelasId}`).get();
    const peserta = kelas.get('pesertaIds') ?? [];
    const nama = await namaKelas(sesudah.kelasId);

    await kirimKePengguna(
      peserta,
      'Jadwal berubah',
      `${nama} sekarang ${sesudah.tanggal} pukul ${sesudah.jamMulai} sampai ${sesudah.jamSelesai}.`,
      { tipe: 'jadwal-berubah', sesiId: event.params.sesiId },
    );
  },
);

exports.notifikasiKeputusanIzin = onDocumentUpdated(
  'sesi/{sesiId}/izin/{praktikanId}',
  async (event) => {
    const sebelum = event.data?.before.data();
    const sesudah = event.data?.after.data();

    if (!sebelum || !sesudah) return;
    if (sebelum.status === sesudah.status) return;
    if (!['disetujui', 'ditolak'].includes(sesudah.status)) return;

    const kunci = `izin-${sesudah.status}:${event.params.sesiId}:${event.params.praktikanId}:${waktuKunci(sesudah.diputuskanPada)}`;
    if (!(await klaimPeristiwa(kunci))) return;

    const sesi = await db.doc(`sesi/${event.params.sesiId}`).get();
    const nama = await namaKelas(sesi.get('kelasId'));
    const disetujui = sesudah.status === 'disetujui';

    await kirimKePengguna(
      [event.params.praktikanId],
      disetujui ? 'Izin disetujui' : 'Izin ditolak',
      `Pengajuan izinmu untuk ${nama} ${disetujui ? 'disetujui' : 'ditolak'}.`,
      {
        tipe: disetujui ? 'izin-disetujui' : 'izin-ditolak',
        sesiId: event.params.sesiId,
      },
    );
  },
);
