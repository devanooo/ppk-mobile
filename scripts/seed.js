
/**
 * PraktikumKU Sprint 4 — Development Seed Importer
 * Run from repository root: node scripts/seed.js
 * Requirements: npm install firebase-admin dotenv
 *
 * Safety:
 * - Only runs against explicitly approved Firebase project IDs.
 * - Reuses Firebase Auth accounts by email.
 * - Uses deterministic Firestore document IDs and merge writes.
 * - Never deletes Auth users or users/{uid} profiles.
 * - Deletes only nomorInduk index documents whose UID has no users/{uid} profile.
 * - Existing labs master documents are read-only.
 * - SEED_EXECUTE=false performs read-only validation/dry-run.
 */

const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const fs = require("node:fs");
const path = require("node:path");

require("dotenv").config({ path: path.resolve(__dirname, "../.env.seed") });

// =====================================================
// 1. CONFIGURATION
// =====================================================

const DATA_PATH = path.resolve(__dirname, "../data/seed-data.json");
if (!fs.existsSync(DATA_PATH)) {
  throw new Error("File data/seed-data.json tidak ditemukan.");
}

let dataset;
try {
  dataset = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
} catch (error) {
  throw new Error(`seed-data.json bukan JSON valid: ${error.message}`);
}

const targetProjectId = process.env.SEED_TARGET_PROJECT_ID;
const allowedProjectIds = (process.env.SEED_ALLOWED_PROJECT_IDS || "")
  .split(",").map((value) => value.trim()).filter(Boolean);

const passwords = {
  praktikan: process.env.SEED_PRAKTIKAN_PASSWORD,
  asprak: process.env.SEED_ASPRAK_PASSWORD,
  aslab: process.env.SEED_ASLAB_PASSWORD,
};

function stop(message) {
  throw new Error(`SEED STOPPED: ${message}`);
}

if (!targetProjectId) stop("SEED_TARGET_PROJECT_ID belum diisi.");
if (!allowedProjectIds.includes(targetProjectId)) {
  stop("Project ID tujuan tidak ada dalam SEED_ALLOWED_PROJECT_IDS.");
}

for (const role of ["praktikan", "asprak", "aslab"]) {
  if (!passwords[role] || passwords[role].length < 8) {
    stop(`Password untuk role ${role} belum diisi atau terlalu pendek.`);
  }
}

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  stop("GOOGLE_APPLICATION_CREDENTIALS belum diisi.");
}

const serviceAccountPath = path.resolve(
  process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS
);
if (!fs.existsSync(serviceAccountPath)) {
  stop(`Service Account tidak ditemukan: ${serviceAccountPath}`);
}
process.env.GOOGLE_APPLICATION_CREDENTIALS = serviceAccountPath;

if (dataset.meta?.version !== 3) stop("Importer ini mengharapkan seed-data v3.");
if (!["true", "false"].includes(process.env.SEED_EXECUTE)) {
  stop("SEED_EXECUTE harus bernilai true atau false.");
}

// =====================================================
// 2. FIREBASE INITIALIZATION
// =====================================================

const app = initializeApp({
  credential: applicationDefault(),
  projectId: targetProjectId,
});
const db = getFirestore(app);
const auth = getAuth(app);

const accounts = [
  ...(dataset.users?.praktikan || []),
  ...(dataset.users?.asprak || []),
  ...(dataset.users?.aslab || []),
];

// =====================================================
// 3. DATASET VALIDATION
// =====================================================

function validateDataset() {
  const expected = { praktikan: 20, asprak: 8, aslab: 4 };
  for (const [role, count] of Object.entries(expected)) {
    if (!Array.isArray(dataset.users?.[role]) || dataset.users[role].length !== count) {
      stop(`Jumlah akun ${role} harus ${count}.`);
    }
  }

  for (const key of ["kelas", "sesi", "mataKuliah", "labs", "relasiMataKuliahLabs"]) {
    if (!Array.isArray(dataset[key])) stop(`Struktur dataset ${key} tidak valid.`);
  }

  const seedIds = new Set();
  const emails = new Set();
  const nims = new Set();

  for (const account of accounts) {
    if (!account.id || !account.nama || !account.email || !account.peran) {
      stop(`Data akun tidak lengkap: ${JSON.stringify(account)}`);
    }
    if (seedIds.has(account.id)) stop(`ID seed duplikat: ${account.id}`);
    if (emails.has(account.email.toLowerCase())) stop(`Email duplikat: ${account.email}`);
    if (typeof account.nomorInduk !== "string" || !/^\d{14}$/.test(account.nomorInduk)) {
      stop(`NIM harus berupa String 14 digit: ${account.id}`);
    }
    if (nims.has(account.nomorInduk)) stop(`NIM duplikat: ${account.nomorInduk}`);
    if (!["praktikan", "asprak", "aslab"].includes(account.peran)) {
      stop(`Role tidak dikenal: ${account.id}`);
    }
    seedIds.add(account.id);
    emails.add(account.email.toLowerCase());
    nims.add(account.nomorInduk);
  }

  for (const kelas of dataset.kelas) {
    if (!dataset.mataKuliah.some((mk) => mk.id === kelas.mataKuliahId)) {
      stop(`Mata kuliah kelas ${kelas.id} tidak ditemukan.`);
    }
    if (!dataset.labs.some((lab) => lab.id === kelas.labId)) {
      stop(`Lab kelas ${kelas.id} tidak ditemukan.`);
    }
    if (!dataset.users.aslab.some((a) => a.id === kelas.aslabId)) {
      stop(`Aslab kelas ${kelas.id} tidak ditemukan.`);
    }
    if (!Array.isArray(kelas.pesertaIds)) stop(`pesertaIds kelas ${kelas.id} harus berupa array.`);
    if (!Array.isArray(kelas.penugasanAsprak) || kelas.penugasanAsprak.length !== 2) {
      stop(`Kelas ${kelas.id} wajib memiliki tepat dua Asprak.`);
    }
    for (const id of kelas.pesertaIds) {
      if (!dataset.users.praktikan.some((p) => p.id === id)) {
        stop(`Praktikan ${id} pada ${kelas.id} tidak ditemukan.`);
      }
    }
    for (const id of kelas.penugasanAsprak) {
      if (!dataset.users.asprak.some((a) => a.id === id)) {
        stop(`Asprak ${id} pada ${kelas.id} tidak ditemukan.`);
      }
    }
  }

  for (const sesi of dataset.sesi) {
    if (!dataset.kelas.some((k) => k.id === sesi.kelasId)) {
      stop(`Kelas sesi ${sesi.id} tidak ditemukan.`);
    }
    if (!dataset.labs.some((lab) => lab.id === sesi.labId)) {
      stop(`Lab sesi ${sesi.id} tidak ditemukan.`);
    }
    if (!dataset.users.asprak.some((a) => a.id === sesi.asistenId)) {
      stop(`Asprak sesi ${sesi.id} tidak ditemukan.`);
    }
  }

  for (const relation of dataset.relasiMataKuliahLabs) {
    if (!dataset.mataKuliah.some((mk) => mk.id === relation.mataKuliahId)) {
      stop(`Mata kuliah relasi tidak ditemukan: ${relation.mataKuliahId}`);
    }
    if (!dataset.labs.some((lab) => lab.id === relation.labId)) {
      stop(`Lab relasi tidak ditemukan: ${relation.labId}`);
    }
  }

  console.log("Dataset validation passed.");
}

// =====================================================
// 4. DEVELOPMENT PROJECT GUARD
// =====================================================

async function assertDevelopmentProject() {
  if (app.options.projectId !== targetProjectId) {
    stop("Project ID Admin SDK tidak cocok dengan target.");
  }
  console.log("\n=================================");
  console.log("PRAKTIKUMKU SPRINT 4 SEED");
  console.log("=================================");
  console.log(`Target project: ${targetProjectId}`);
  if (process.env.SEED_CONFIRM_PROJECT_ID !== targetProjectId) {
    stop(`Isi SEED_CONFIRM_PROJECT_ID=${targetProjectId} di .env.seed.`);
  }
}

// =====================================================
// 5. VERIFY EXISTING LAB MASTER DOCUMENTS (READ ONLY)
// =====================================================

async function loadAndValidateLabs() {
  const result = new Map();
  for (const lab of dataset.labs) {
    const snap = await db.collection("labs").doc(lab.id).get();
    if (!snap.exists) stop(`Dokumen labs/${lab.id} tidak ditemukan.`);
    const data = snap.data() || {};
    if (data.isActive === false) stop(`labs/${lab.id} tidak aktif.`);

    const location = data.location || {};
    const latitude = location.latitude ?? location.lat ?? data.latitude ?? null;
    const longitude = location.longitude ?? location.lng ?? data.longitude ?? null;
    if (typeof latitude !== "number" || typeof longitude !== "number") {
      stop(`Koordinat labs/${lab.id} tidak ditemukan atau format tidak dikenali.`);
    }
    result.set(lab.id, { ...data, latitude, longitude });
  }
  return result;
}

// =====================================================
// 6. FIREBASE AUTHENTICATION
// =====================================================

async function getOrCreateAuthUser(account) {
  const password = passwords[account.peran];
  try {
    const existing = await auth.getUserByEmail(account.email);
    await auth.updateUser(existing.uid, {
      password,
      displayName: account.nama,
      disabled: false,
    });
    return existing.uid;
  } catch (error) {
    if (error.code !== "auth/user-not-found") throw error;
    const created = await auth.createUser({
      email: account.email,
      password,
      displayName: account.nama,
      emailVerified: true,
      disabled: false,
    });
    return created.uid;
  }
}

// =====================================================
// 7. FIRESTORE HELPERS
// =====================================================

async function commitOperations(operations, chunkSize = 400) {
  for (let index = 0; index < operations.length; index += chunkSize) {
    const batch = db.batch();
    for (const operation of operations.slice(index, index + chunkSize)) {
      batch.set(operation.ref, operation.data, { merge: true });
    }
    await batch.commit();
  }
}

// Add dibuatPada only if the document is new or the field is absent.
// Existing creation timestamps are never overwritten on seed reruns.
async function addCreatedAtIfMissing(ref, data) {
  const snap = await ref.get();
  if (!snap.exists || !snap.get("dibuatPada")) {
    data.dibuatPada = FieldValue.serverTimestamp();
  }
  return data;
}

// A nomorInduk index is orphaned only if it has a valid UID but no users/{uid} profile.
// Seed NIMs are always protected. Malformed records without UID are reported, not deleted.
async function findOrphanNomorInduk(seedNims) {
  const snapshot = await db.collection("nomorInduk").get();
  const orphanDocs = [];
  const malformedDocs = [];

  for (const doc of snapshot.docs) {
    if (seedNims.has(doc.id)) continue;
    const data = doc.data() || {};
    const uid = data.uid;
    if (typeof uid !== "string" || !uid.trim()) {
      malformedDocs.push(doc.id);
      continue;
    }
    const userSnap = await db.collection("users").doc(uid).get();
    if (!userSnap.exists) orphanDocs.push(doc.ref);
  }
  return { orphanDocs, malformedDocs };
}

async function deleteOrphanNomorInduk(orphanDocs, chunkSize = 400) {
  for (let index = 0; index < orphanDocs.length; index += chunkSize) {
    const batch = db.batch();
    for (const ref of orphanDocs.slice(index, index + chunkSize)) batch.delete(ref);
    await batch.commit();
  }
}

// =====================================================
// 8. MAIN PROCESS
// =====================================================

async function main() {
  validateDataset();
  await assertDevelopmentProject();

  const labDataById = await loadAndValidateLabs();
  const seedNims = new Set(accounts.map((account) => account.nomorInduk));
  const orphanCheck = await findOrphanNomorInduk(seedNims);

  console.log(`Total akun: ${accounts.length}`);
  console.log(`Total kelas: ${dataset.kelas.length}`);
  console.log(`Total sesi: ${dataset.sesi.length}`);
  console.log(`Dokumen labs terverifikasi: ${labDataById.size}`);
  console.log(`Indeks nomorInduk yatim terdeteksi: ${orphanCheck.orphanDocs.length}`);
  console.log(`Indeks nomorInduk tanpa UID (tidak dihapus): ${orphanCheck.malformedDocs.length}`);

  if (orphanCheck.orphanDocs.length) {
    console.log("ID nomorInduk yatim:");
    orphanCheck.orphanDocs.forEach((ref) => console.log(` - ${ref.id}`));
  }
  if (orphanCheck.malformedDocs.length) {
    console.log("ID nomorInduk tanpa UID yang perlu diperiksa manual:");
    orphanCheck.malformedDocs.forEach((id) => console.log(` - ${id}`));
  }

  if (process.env.SEED_EXECUTE !== "true") {
    console.log("\nDRY RUN COMPLETE.");
    console.log("Tidak ada akun Authentication atau dokumen Firestore yang dibuat/diubah/dihapus.");
    console.log("Set SEED_EXECUTE=true hanya setelah memeriksa hasil dry-run.");
    return;
  }

  // ---------------------------------------------------
  // 8A. AUTH RECONCILIATION
  // ---------------------------------------------------

  console.log("\nMemproses Firebase Authentication...");
  const uidBySeedId = {};
  for (const account of accounts) {
    uidBySeedId[account.id] = await getOrCreateAuthUser(account);
  }

  // ---------------------------------------------------
  // 8B. PREPARE FIRESTORE OPERATIONS
  // ---------------------------------------------------

  const ops = [];
  const serverNow = FieldValue.serverTimestamp();

  // USERS + NIM INDEX
  for (const account of accounts) {
    const uid = uidBySeedId[account.id];
    const userRef = db.collection("users").doc(uid);
    const profile = {
      nama: account.nama,
      nomorInduk: account.nomorInduk,
      peran: account.peran,
    };
    await addCreatedAtIfMissing(userRef, profile);
    if (account.peran === "aslab") profile.mataKuliahId = account.mataKuliahId;

    ops.push({ ref: userRef, data: profile });
    ops.push({
      ref: db.collection("nomorInduk").doc(account.nomorInduk),
      data: { uid },
    });
  }

  // MATA KULIAH
  for (const course of dataset.mataKuliah) {
    const aslabUid = uidBySeedId[course.aslabId];
    if (!aslabUid) stop(`Aslab ${course.aslabId} tidak ditemukan untuk ${course.id}.`);
    ops.push({
      ref: db.collection("mataKuliah").doc(course.id),
      data: {
        kode: course.kode ?? null,
        nama: course.nama,
        aslabId: aslabUid,
        diperbaruiPada: serverNow,
      },
    });
  }

  // MANY-TO-MANY COURSE-LAB RELATION
  for (const relation of dataset.relasiMataKuliahLabs) {
    const course = dataset.mataKuliah.find((item) => item.id === relation.mataKuliahId);
    const lab = dataset.labs.find((item) => item.id === relation.labId);
    ops.push({
      ref: db.collection("labs").doc(lab.id).collection("mataKuliah").doc(course.id),
      data: { mataKuliahId: course.id, namaMataKuliah: course.nama, labId: lab.id },
    });
    ops.push({
      ref: db.collection("mataKuliah").doc(course.id).collection("labs").doc(lab.id),
      data: { labId: lab.id, namaLab: lab.name, mataKuliahId: course.id },
    });
  }

  // ASLAB ASSIGNMENTS
  for (const account of dataset.users.aslab) {
    const uid = uidBySeedId[account.id];
    const course = dataset.mataKuliah.find((item) => item.aslabId === account.id);
    if (!course) stop(`Aslab ${account.id} belum dipasangkan dengan satu mata kuliah.`);
    const relatedLabs = dataset.relasiMataKuliahLabs.filter(
      (relation) => relation.mataKuliahId === course.id
    );
    for (const relation of relatedLabs) {
      ops.push({
        ref: db.collection("labs").doc(relation.labId).collection("penugasanAslab").doc(uid),
        data: {
          uid,
          aslabId: uid,
          mataKuliahId: course.id,
          labId: relation.labId,
          status: "aktif",
          dibuatPada: serverNow,
        },
      });
    }
  }

  // KELAS + TWO ASPRAK ASSIGNMENTS
  for (const kelas of dataset.kelas) {
    const classRef = db.collection("kelas").doc(kelas.id);
    const aslabUid = uidBySeedId[kelas.aslabId];
    const asprakUids = kelas.penugasanAsprak.map((seedId) => uidBySeedId[seedId]);
    const participantUids = kelas.pesertaIds.map((seedId) => uidBySeedId[seedId]);

    const classData = {
      nama: kelas.nama,
      lab: kelas.lab,
      labId: kelas.labId,
      mataKuliahId: kelas.mataKuliahId,
      aslabId: aslabUid,
      // Legacy compatibility field; canonical assignments are in penugasanAsprak.
      asistenId: asprakUids[0],
      pesertaIds: participantUids,
    };
    await addCreatedAtIfMissing(classRef, classData);
    ops.push({ ref: classRef, data: classData });

    for (let index = 0; index < asprakUids.length; index++) {
      const uid = asprakUids[index];
      const assignmentRef = classRef.collection("penugasanAsprak").doc(uid);
      const assignmentData = {
        asprakId: uid,
        uid,
        kelasId: kelas.id,
        status: "aktif",
        urutan: index + 1,
      };
      await addCreatedAtIfMissing(assignmentRef, assignmentData);
      ops.push({ ref: assignmentRef, data: assignmentData });
    }
  }

  // SESI + LOCATION SNAPSHOT
  for (const sesi of dataset.sesi) {
    const asprakUid = uidBySeedId[sesi.asistenId];
    if (!asprakUid) stop(`Asprak untuk sesi ${sesi.id} tidak ditemukan.`);
    const lab = dataset.labs.find((item) => item.id === sesi.labId);
    const labData = labDataById.get(lab.id);
    const sessionRef = db.collection("sesi").doc(sesi.id);

    const sessionData = {
      kelasId: sesi.kelasId,
      asistenId: asprakUid,
      tanggal: sesi.tanggal,
      hari: sesi.hari,
      jamMulai: sesi.jamMulai,
      jamSelesai: sesi.jamSelesai,
      status: sesi.status,
      labId: sesi.labId,
      labNama: labData.name || lab.name,
      labLatitude: labData.latitude,
      labLongitude: labData.longitude,
      labRadiusMeters: labData.radiusMeters ?? null,
      labBuildingSnapshot: labData.building ?? null,
      labCodeSnapshot: labData.code ?? lab.code,
      snapshotDiambilPada: serverNow,
    };

    const existingSession = await sessionRef.get();
    const oldSessionData = existingSession.exists ? existingSession.data() : {};

    if (!oldSessionData.dibuatPada) sessionData.dibuatPada = serverNow;
    if (!Object.prototype.hasOwnProperty.call(oldSessionData, "dibukaPada")) {
      sessionData.dibukaPada = null;
    }
    if (!Object.prototype.hasOwnProperty.call(oldSessionData, "ditutupPada")) {
      sessionData.ditutupPada = null;
    }

    ops.push({ ref: sessionRef, data: sessionData });
  }

  // ---------------------------------------------------
  // 8C. WRITE FIRESTORE AND CLEAN ORPHAN NIM INDEXES
  // ---------------------------------------------------

  console.log(`\nTotal akun Auth diproses: ${accounts.length}`);
  console.log(`Total operasi Firestore: ${ops.length}`);
  console.log("Memulai penulisan data Firestore...");
  await commitOperations(ops);

  // Re-check after seed writes. Seed NIMs and any UID with an existing
  // users/{uid} profile are protected from deletion.
  const finalOrphanCheck = await findOrphanNomorInduk(seedNims);
  if (finalOrphanCheck.orphanDocs.length > 0) {
    console.log(`Menghapus ${finalOrphanCheck.orphanDocs.length} indeks nomorInduk yatim...`);
    await deleteOrphanNomorInduk(finalOrphanCheck.orphanDocs);
  } else {
    console.log("Tidak ada indeks nomorInduk yatim yang perlu dihapus.");
  }

  // Save local UID mapping (keep this file private; it is gitignored).
  const localMapPath = path.resolve(__dirname, "../seed-uid-map.local.json");
  fs.writeFileSync(localMapPath, JSON.stringify(uidBySeedId, null, 2), { mode: 0o600 });

  console.log("\n=================================");
  console.log("SEED COMPLETED");
  console.log("=================================");
  console.log("Tidak ada profil users atau akun Authentication yang dihapus.");
  console.log("Hanya indeks nomorInduk yatim yang terdeteksi aman yang dibersihkan.");
}

// =====================================================
// 9. RUN
// =====================================================

main().catch((error) => {
  console.error("\nSEED ERROR:");
  console.error(error);
  process.exitCode = 1;
});
