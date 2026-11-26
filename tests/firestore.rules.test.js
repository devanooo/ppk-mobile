/**
 * Emulator tests for Firestore Rules.
 * Install: npm i -D @firebase/rules-unit-testing firebase
 * Run with Firebase Emulator Suite and FIRESTORE_EMULATOR_HOST=127.0.0.1:8080.
 *
 * Set RULES_FILE to the path of firestore.rules.
 */
const fs = require("node:fs");
const { initializeTestEnvironment, assertSucceeds, assertFails } = require("@firebase/rules-unit-testing");
const { doc, getDoc, setDoc, updateDoc } = require("firebase/firestore");

const projectId = "praktikumku-rules-test";
const rules = fs.readFileSync(process.env.RULES_FILE || "firestore.rules", "utf8");

let testEnv;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId,
    firestore: { rules },
  });
});

afterEach(async () => {
  await testEnv.clearFirestore();
});

afterAll(async () => {
  await testEnv.cleanup();
});

async function seed(data) {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    for (const [path, value] of Object.entries(data)) {
      await setDoc(doc(db, path), value);
    }
  });
}

test("praktikan dapat membaca profil sendiri", async () => {
  await seed({ "users/p1": { nama: "Praktikan", nomorInduk: "24060124120001", peran: "praktikan" } });
  const db = testEnv.authenticatedContext("p1").firestore();
  await assertSucceeds(getDoc(doc(db, "users/p1")));
});

test("praktikan tidak dapat mengubah role sendiri", async () => {
  await seed({ "users/p1": { nama: "Praktikan", nomorInduk: "24060124120001", peran: "praktikan" } });
  const db = testEnv.authenticatedContext("p1").firestore();
  await assertFails(updateDoc(doc(db, "users/p1"), { peran: "aslab" }));
});

test("akun tanpa profil tidak dapat membaca kelas", async () => {
  await seed({ "kelas/k1": { nama: "Kelas A", pesertaIds: ["p1"], aslabId: "a1" } });
  const db = testEnv.authenticatedContext("unknown").firestore();
  await assertFails(getDoc(doc(db, "kelas/k1")));
});

test("praktikan yang terdaftar dapat membaca kelas", async () => {
  await seed({
    "users/p1": { nama: "Praktikan", nomorInduk: "24060124120001", peran: "praktikan" },
    "kelas/k1": { nama: "Kelas A", pesertaIds: ["p1"], aslabId: "a1" },
  });
  const db = testEnv.authenticatedContext("p1").firestore();
  await assertSucceeds(getDoc(doc(db, "kelas/k1")));
});

test("praktikan di luar kelas tidak dapat membaca kelas", async () => {
  await seed({
    "users/p2": { nama: "Praktikan 2", nomorInduk: "24060124120002", peran: "praktikan" },
    "kelas/k1": { nama: "Kelas A", pesertaIds: ["p1"], aslabId: "a1" },
  });
  const db = testEnv.authenticatedContext("p2").firestore();
  await assertFails(getDoc(doc(db, "kelas/k1")));
});
