const admin = require('firebase-admin');

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';
const KOLEKSI_TOKEN = 'tokenPerangkat';
const KOLEKSI_PERISTIWA = 'peristiwaNotifikasi';
const SALURAN_ANDROID = 'praktikum';
const MAKS_UID_PER_KUERI = 30;
const MAKS_PESAN_PER_KIRIM = 100;

const TIPE_VALID = new Set([
  'sesi-dibuka',
  'jadwal-berubah',
  'izin-diajukan',
  'izin-disetujui',
  'izin-ditolak',
]);

function inisialisasiAdmin() {
  if (admin.apps.length > 0) return;

  const mentah = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!mentah) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT belum diatur.');
  }

  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(mentah)),
  });
}

function ambilBearer(header) {
  if (typeof header !== 'string') return null;

  const [skema, nilai] = header.split(' ');
  if (skema !== 'Bearer' || !nilai) return null;

  return nilai;
}

function keMillis(nilai) {
  if (!nilai) return 0;
  if (typeof nilai.toMillis === 'function') return nilai.toMillis();
  if (nilai instanceof Date) return nilai.getTime();

  return 0;
}

function kunciPeristiwa(tipe, sesiId, tambahan) {
  return [tipe, sesiId, ...tambahan].join(':');
}

async function klaimPeristiwa(db, kunci) {
  try {
    await db.collection(KOLEKSI_PERISTIWA).doc(kunci).create({
      dibuatPada: admin.firestore.FieldValue.serverTimestamp(),
    });

    return true;
  } catch (galat) {
    if (galat && (galat.code === 6 || galat.code === 'already-exists')) {
      return false;
    }

    throw galat;
  }
}

async function ambilToken(db, daftarUid) {
  const unik = [...new Set(daftarUid)];
  const token = [];

  for (let i = 0; i < unik.length; i += MAKS_UID_PER_KUERI) {
    const bagian = unik.slice(i, i + MAKS_UID_PER_KUERI);
    const hasil = await db
      .collection(KOLEKSI_TOKEN)
      .where('uid', 'in', bagian)
      .get();

    hasil.forEach((dokumen) => token.push(dokumen.id));
  }

  return token;
}

function susunPesan(tipe, { kelas, sesi }) {
  if (tipe === 'sesi-dibuka') {
    return {
      title: 'Presensi dibuka',
      body: `${kelas.nama} · ${sesi.hari}, ${sesi.tanggal} ${sesi.jamMulai}`,
    };
  }

  if (tipe === 'jadwal-berubah') {
    return {
      title: 'Jadwal sesi berubah',
      body: `${kelas.nama} menjadi ${sesi.hari}, ${sesi.tanggal} ${sesi.jamMulai}–${sesi.jamSelesai}`,
    };
  }

  if (tipe === 'izin-disetujui') {
    return {
      title: 'Izin disetujui',
      body: `Pengajuan izin ${kelas.nama} pada ${sesi.tanggal} disetujui.`,
    };
  }

  return {
    title: 'Izin ditolak',
    body: `Pengajuan izin ${kelas.nama} pada ${sesi.tanggal} ditolak.`,
  };
}

async function kirimKeExpo(daftarPesan) {
  const respons = await fetch(EXPO_PUSH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(daftarPesan),
  });

  if (!respons.ok) {
    throw new Error(`Expo Push menolak permintaan: ${respons.status}`);
  }

  return respons.json();
}

function tokenTidakValid(hasil, daftarPesan) {
  const data = Array.isArray(hasil && hasil.data) ? hasil.data : [];
  const tidakValid = [];

  data.forEach((item, indeks) => {
    const pesan = daftarPesan[indeks];
    if (!pesan) return;

    const galat = item && item.details && item.details.error;
    if (item.status === 'error' && galat === 'DeviceNotRegistered') {
      tidakValid.push(pesan.to);
    }
  });

  return tidakValid;
}

async function bersihkanToken(db, daftarToken) {
  if (daftarToken.length === 0) return;

  const batch = db.batch();
  daftarToken.forEach((token) => {
    batch.delete(db.collection(KOLEKSI_TOKEN).doc(token));
  });

  await batch.commit();
}

async function tangani(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ pesan: 'Gunakan POST.' });
    return;
  }

  inisialisasiAdmin();

  const db = admin.firestore();
  const idToken = ambilBearer(req.headers.authorization);

  if (!idToken) {
    res.status(401).json({ pesan: 'Token tidak ada.' });
    return;
  }

  let pemanggil;
  try {
    pemanggil = await admin.auth().verifyIdToken(idToken);
  } catch {
    res.status(401).json({ pesan: 'Token tidak valid.' });
    return;
  }

  const badan = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const { tipe, sesiId, praktikanId } = badan || {};

  if (!TIPE_VALID.has(tipe) || typeof sesiId !== 'string' || !sesiId) {
    res.status(400).json({ pesan: 'Tipe atau sesiId tidak valid.' });
    return;
  }

  const butuhPraktikan = tipe === 'izin-disetujui' || tipe === 'izin-ditolak';
  if (butuhPraktikan && (typeof praktikanId !== 'string' || !praktikanId)) {
    res.status(400).json({ pesan: 'praktikanId wajib untuk event izin.' });
    return;
  }

  const sesiDokumen = await db.collection('sesi').doc(sesiId).get();
  if (!sesiDokumen.exists) {
    res.status(404).json({ pesan: 'Sesi tidak ditemukan.' });
    return;
  }

  const sesi = sesiDokumen.data();

  const kelasDokumen = await db.collection('kelas').doc(sesi.kelasId).get();
  if (!kelasDokumen.exists) {
    res.status(404).json({ pesan: 'Kelas tidak ditemukan.' });
    return;
  }

  const kelas = kelasDokumen.data();
  const peserta = Array.isArray(kelas.pesertaIds) ? kelas.pesertaIds : [];

  let penerima;
  let kunci;
  let isi;

  if (tipe === 'izin-diajukan') {
    if (!peserta.includes(pemanggil.uid)) {
      res.status(403).json({ pesan: 'Hanya peserta kelas yang bisa mengajukan izin.' });
      return;
    }

    const izinDokumen = await db
      .collection('sesi')
      .doc(sesiId)
      .collection('izin')
      .doc(pemanggil.uid)
      .get();

    if (!izinDokumen.exists) {
      res.status(404).json({ pesan: 'Pengajuan izin tidak ditemukan.' });
      return;
    }

    const izin = izinDokumen.data();
    if (izin.status !== 'menunggu') {
      res.status(409).json({ pesan: 'Pengajuan izin sudah diputuskan.' });
      return;
    }

    const penggunaDokumen = await db
      .collection('users')
      .doc(pemanggil.uid)
      .get();
    const nama = penggunaDokumen.exists
      ? String(penggunaDokumen.data().nama || 'Praktikan')
      : 'Praktikan';

    penerima = [sesi.asistenId];
    kunci = kunciPeristiwa(tipe, sesiId, [
      pemanggil.uid,
      keMillis(izin.dibuatPada),
    ]);
    isi = {
      title: 'Pengajuan izin baru',
      body: `${nama} mengajukan izin untuk ${kelas.nama} · ${sesi.tanggal}`,
    };
  } else {
    if (sesi.asistenId !== pemanggil.uid) {
      res.status(403).json({ pesan: 'Hanya asisten pemilik sesi.' });
      return;
    }

    if (tipe === 'sesi-dibuka') {
      penerima = peserta;
      kunci = kunciPeristiwa(tipe, sesiId, [keMillis(sesi.dibukaPada)]);
    } else if (tipe === 'jadwal-berubah') {
      penerima = peserta;
      kunci = kunciPeristiwa(tipe, sesiId, [
        sesi.tanggal,
        sesi.jamMulai,
        sesi.jamSelesai,
      ]);
    } else {
      const izinDokumen = await db
        .collection('sesi')
        .doc(sesiId)
        .collection('izin')
        .doc(praktikanId)
        .get();

      if (!izinDokumen.exists) {
        res.status(404).json({ pesan: 'Pengajuan izin tidak ditemukan.' });
        return;
      }

      const izin = izinDokumen.data();
      const statusDiminta = tipe === 'izin-disetujui' ? 'disetujui' : 'ditolak';

      if (izin.status !== statusDiminta) {
        res.status(409).json({ pesan: 'Status izin belum sesuai.' });
        return;
      }

      penerima = [praktikanId];
      kunci = kunciPeristiwa(tipe, sesiId, [
        praktikanId,
        keMillis(izin.diputuskanPada),
      ]);
    }

    isi = susunPesan(tipe, { kelas, sesi });
  }

  const baru = await klaimPeristiwa(db, kunci);
  if (!baru) {
    res.status(200).json({ ok: true, dilewati: true });
    return;
  }

  const token = await ambilToken(db, penerima);
  if (token.length === 0) {
    res.status(200).json({ ok: true, terkirim: 0 });
    return;
  }

  const daftarPesan = token.map((alamat) => ({
    to: alamat,
    ...isi,
    sound: 'default',
    channelId: SALURAN_ANDROID,
    data: { tipe, sesiId },
  }));

  const tidakValid = [];

  for (let i = 0; i < daftarPesan.length; i += MAKS_PESAN_PER_KIRIM) {
    const bagian = daftarPesan.slice(i, i + MAKS_PESAN_PER_KIRIM);
    const hasil = await kirimKeExpo(bagian);
    tidakValid.push(...tokenTidakValid(hasil, bagian));
  }

  await bersihkanToken(db, tidakValid);

  res.status(200).json({
    ok: true,
    terkirim: daftarPesan.length,
    dibersihkan: tidakValid.length,
  });
}

module.exports = async function handler(req, res) {
  try {
    await tangani(req, res);
  } catch (galat) {
    const pesan =
      galat instanceof Error ? galat.message : 'Terjadi kesalahan di server.';

    res.status(500).json({ pesan });
  }
};
