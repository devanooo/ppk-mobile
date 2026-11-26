
const fs = require("fs");
const path = require("path");

const { initializeApp, cert } = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  GeoPoint,
} = require("firebase-admin/firestore");

const EXPECTED_PROJECT = "praktikumku-dcfc0";
const OUTPUT_DIR = path.resolve(__dirname, "../backups");
const SERVICE_ACCOUNT_PATH = path.resolve(
  __dirname,
  "../service-account-dev.json"
);

function stop(message) {
  console.error("\nBACKUP STOPPED:", message);
  process.exit(1);
}

// Pastikan service account tersedia.
if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
  stop("service-account-dev.json tidak ditemukan.");
}

const serviceAccount = JSON.parse(
  fs.readFileSync(SERVICE_ACCOUNT_PATH, "utf8")
);

// Proteksi project.
if (serviceAccount.project_id !== EXPECTED_PROJECT) {
  stop(
    `Project tidak sesuai. Diharapkan ${EXPECTED_PROJECT}, ditemukan ${serviceAccount.project_id}`
  );
}

// Inisialisasi Firebase Admin SDK.
const app = initializeApp({
  credential: cert(serviceAccount),
  projectId: EXPECTED_PROJECT,
});

const db = getFirestore(app);

// Mengubah tipe khusus Firestore menjadi format JSON
// yang mempertahankan informasi tipe aslinya.
function encodeValue(value) {
  if (value instanceof Timestamp) {
    return {
      __type: "timestamp",
      seconds: value.seconds,
      nanoseconds: value.nanoseconds,
    };
  }

  if (value instanceof GeoPoint) {
    return {
      __type: "geopoint",
      latitude: value.latitude,
      longitude: value.longitude,
    };
  }

  if (Buffer.isBuffer(value)) {
    return {
      __type: "bytes",
      base64: value.toString("base64"),
    };
  }

  if (
    value &&
    typeof value.path === "string" &&
    typeof value.get === "function" &&
    typeof value.collection === "function"
  ) {
    return {
      __type: "reference",
      path: value.path,
    };
  }

  if (Array.isArray(value)) {
    return value.map(encodeValue);
  }

  if (value && typeof value === "object") {
    const result = {};

    for (const [key, item] of Object.entries(value)) {
      result[key] = encodeValue(item);
    }

    return result;
  }

  return value;
}

// Backup collection dan seluruh subcollection secara rekursif.
async function exportCollection(collectionRef) {
  const snapshot = await collectionRef.get();

  const documents = [];

  for (const document of snapshot.docs) {
    const subcollections = await document.ref.listCollections();
    const exportedSubcollections = [];

    for (const subcollection of subcollections) {
      exportedSubcollections.push(
        await exportCollection(subcollection)
      );
    }

    documents.push({
      id: document.id,
      data: encodeValue(document.data()),
      subcollections: exportedSubcollections,
    });
  }

  return {
    id: collectionRef.id,
    documents,
  };
}

async function main() {
  console.log("\n=================================");
  console.log("PRAKTIKUMKU FIRESTORE BACKUP");
  console.log("=================================");
  console.log("Project:", EXPECTED_PROJECT);
  console.log("Mode: READ ONLY");
  console.log("Subcollections: INCLUDED");

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const rootCollections = await db.listCollections();
  const collections = [];

  for (const collection of rootCollections) {
    console.log("Backing up:", collection.id);

    collections.push(
      await exportCollection(collection)
    );
  }

  const backup = {
    backupVersion: 1,
    projectId: EXPECTED_PROJECT,
    exportedAt: new Date().toISOString(),
    collectionCount: collections.length,
    collections,
  };

  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-");

  const outputPath = path.join(
    OUTPUT_DIR,
    `firestore-${EXPECTED_PROJECT}-${timestamp}.json`
  );

  fs.writeFileSync(
    outputPath,
    JSON.stringify(backup, null, 2),
    { encoding: "utf8", flag: "wx" }
  );

  console.log("\nBACKUP SUCCESS");
  console.log("Collections:", collections.length);
  console.log("Output:", outputPath);
  console.log("Mode: READ ONLY");
}

main()
  .catch((error) => {
    console.error("\nBACKUP ERROR:");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await app.delete();
  });
