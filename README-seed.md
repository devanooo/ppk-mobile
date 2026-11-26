# PraktikumKU — Seed Sprint 4 (Development)

Dokumentasi dataset sintetis dan prosedur import data untuk kebutuhan pengembangan dan pengujian Sprint 4 PraktikumKU.

| Informasi | Keterangan |
|---|---|
| Environment | Firebase Development |
| Firebase Project | `praktikumku-dcfc0` |
| Target pengguna | Praktikan, Asprak, dan Aslab |
| Versi dataset | JSON v3 |
| Status | Development / Testing |
| Production | Tidak digunakan |

> **Peringatan:** Seluruh proses seed hanya ditujukan untuk Firebase Development. Jangan menjalankan importer menggunakan kredensial atau project Production.

---

## 1. Isi Dataset

Dataset seed Sprint 4 mencakup:

| Data | Jumlah |
|---|---:|
| Praktikan | 20 |
| Asprak | 8 |
| Aslab | 4 |
| Mata kuliah | 4 |
| Kelas | 4 |
| Laboratorium | 4 |
| Sesi praktikum | 8 |
| Total akun | **32** |

Distribusi data:

- 5 praktikan untuk setiap kelas.
- 2 Asprak untuk setiap kelas.
- 1 Aslab untuk setiap mata kuliah.
- 2 sesi praktikum untuk setiap kelas.
- 4 laboratorium: `lab_b`, `lab_c`, `lab_d`, dan `lab_ap`.
- Relasi mata kuliah dan laboratorium menggunakan relasi many-to-many.
- Penugasan Asprak disimpan pada subcollection kelas.
- Penugasan Aslab disimpan pada subcollection laboratorium.

Seluruh nama, NIM, dan email dalam dataset merupakan data sintetis.

NIM menggunakan tipe data `String` dengan format tepat 14 digit angka.

## 2. Struktur Data Firestore

Struktur collection dan subcollection yang digunakan:

```text
users/{uid}

mataKuliah/{mataKuliahId}
  labs/{labId}

labs/{labId}
  mataKuliah/{mataKuliahId}
  penugasanAslab/{aslabUid}

kelas/{kelasId}
  penugasanAsprak/{asprakUid}

sesi/{sesiId}
  presensi/{presensiId}
  izin/{izinId}

nomorInduk/{nim}
```

### 2.1 Collection Labs

Collection `labs` merupakan collection master yang sudah tersedia di Firebase Development.

Dokumen yang digunakan:

- `lab_b`
- `lab_c`
- `lab_d`
- `lab_ap`

Importer hanya membaca dan memvalidasi dokumen master `labs`. Importer tidak membuat ulang atau mengubah dokumen master tersebut.

Informasi lokasi laboratorium, termasuk koordinat, dibaca dari dokumen aktual dan digunakan sebagai snapshot lokasi sesi.

### 2.2 Collection Users

Document ID pada collection `users` menggunakan Firebase Authentication UID.

Contoh:

```text
users/
  └── {uid}
       ├── nama
       ├── nomorInduk
       ├── peran
       └── dibuatPada
```

UID tidak harus disimpan kembali sebagai field dalam dokumen profil karena sudah menjadi Document ID.

### 2.3 Collection NomorInduk

Collection `nomorInduk` menggunakan NIM sebagai Document ID.

Contoh:

```text
nomorInduk/
  └── 24060124120001
       └── uid: "{firebase-auth-uid}"
```

Relasi tersebut digunakan untuk menghubungkan NIM dengan profil pengguna.

### 2.4 Collection Kelas

Setiap kelas memiliki:

- Relasi mata kuliah.
- Referensi laboratorium.
- Referensi Aslab.
- Daftar peserta melalui `pesertaIds`.
- Penugasan dua Asprak melalui subcollection `penugasanAsprak`.
- Field `dibuatPada`.

Field `asistenId` tetap dipertahankan apabila diperlukan untuk kompatibilitas dengan struktur aplikasi sebelumnya.

### 2.5 Collection Sesi

Setiap sesi memiliki:

- `kelasId`
- `asistenId`
- `tanggal`
- `hari`
- `jamMulai`
- `jamSelesai`
- `status`
- `labId`
- Snapshot informasi lokasi laboratorium
- `dibuatPada`
- `dibukaPada`
- `ditutupPada`

Field `dibukaPada` dan `ditutupPada` diinisialisasi dengan `null` apabila belum tersedia.

Kelas pengganti hanya mengubah `labId` pada sesi terkait. Relasi kelas dengan mata kuliah dan penugasan Asprak tidak berubah.

Subcollection `presensi` dan `izin` tetap menjadi bagian dari struktur sesi.

## 3. Struktur Folder

```text
ppk-mobile/
│
├── data/
│   └── seed-data.json
│
├── scripts/
│   ├── seed.js
│   └── backup-development.js
│
├── docs/
│   └── database/
│       ├── firestore-schema.md
│       └── firestore-migration.md
│
├── tests/
│   └── firestore.rules.test.js
│
├── .env.seed
├── .env.seed.example
├── service-account-dev.json
├── firebase.emulator.json
├── firestore.rules
├── README-seed.md
└── .gitignore
```

File berikut hanya disimpan secara lokal dan tidak boleh diunggah ke repository:

- `.env.seed`
- `service-account-dev.json`
- `seed-uid-map.local.json`
- Folder `backups/`

## 4. Prasyarat

Sebelum menjalankan importer, pastikan tersedia:

- Node.js yang kompatibel dengan dependency project.
- Firebase Development Project.
- Firebase Authentication aktif.
- Cloud Firestore aktif.
- Firebase Admin SDK.
- Package `dotenv`.
- Service Account dengan akses administratif pada project Development.
- Dataset `data/seed-data.json` yang sudah diaudit.

## 5. Instalasi Dependency

Jalankan dari root project:

```bash
npm install firebase-admin dotenv
```

Tidak perlu menjalankan `npm init -y` karena project sudah memiliki `package.json`.

## 6. Konfigurasi Environment

Buat file `.env.seed` di root project.

Contoh:

```env
# Firebase DEVELOPMENT
SEED_TARGET_PROJECT_ID=praktikumku-dcfc0
SEED_ALLOWED_PROJECT_IDS=praktikumku-dcfc0
SEED_CONFIRM_PROJECT_ID=praktikumku-dcfc0

# Password berdasarkan role
SEED_PRAKTIKAN_PASSWORD=praktikan123
SEED_ASPRAK_PASSWORD=asprak123
SEED_ASLAB_PASSWORD=aslab123

# Firebase Admin SDK
GOOGLE_APPLICATION_CREDENTIALS=./service-account-dev.json

# Import mode
SEED_EXECUTE=false
```

### Keterangan Variabel

| Variabel | Fungsi |
|---|---|
| `SEED_TARGET_PROJECT_ID` | Project Firebase tujuan |
| `SEED_ALLOWED_PROJECT_IDS` | Allowlist project yang diizinkan |
| `SEED_CONFIRM_PROJECT_ID` | Konfirmasi project sebelum eksekusi |
| `SEED_PRAKTIKAN_PASSWORD` | Password akun Praktikan |
| `SEED_ASPRAK_PASSWORD` | Password akun Asprak |
| `SEED_ASLAB_PASSWORD` | Password akun Aslab |
| `GOOGLE_APPLICATION_CREDENTIALS` | Lokasi Service Account JSON |
| `SEED_EXECUTE` | Menentukan mode dry-run atau import |

Password dibedakan berdasarkan role.

Password tersebut digunakan untuk akun seed yang dibuat atau disinkronkan oleh importer.

> Password di atas merupakan kredensial pengujian. Jangan gunakan untuk akun Production.

## 7. Firebase Service Account

Service Account digunakan Firebase Admin SDK untuk mengakses Firebase Authentication dan Cloud Firestore.

Cara mendapatkannya:

1. Buka Firebase Console.
2. Pilih project `praktikumku-dcfc0`.
3. Buka Project Settings.
4. Pilih tab Service Accounts.
5. Klik Generate New Private Key.
6. Simpan file JSON yang diunduh.
7. Letakkan di root project.
8. Gunakan nama `service-account-dev.json`.

Konfigurasi:

```env
GOOGLE_APPLICATION_CREDENTIALS=./service-account-dev.json
```

### Keamanan

- Jangan mengunggah Service Account JSON ke GitHub.
- Jangan membagikan private key.
- Jangan menggunakan Service Account Production.
- Jika private key terlanjur terekspos, segera lakukan rotasi atau pencabutan key.

## 8. Git Ignore

Pastikan `.gitignore` utama memuat aturan berikut:

```gitignore
# Firebase credentials
.env.seed
service-account*.json
*serviceAccount*.json
*-firebase-adminsdk-*.json

# Seed local files
seed-uid-map.local.json

# Local backup
backups/

# Firebase emulator
firestore-debug.log
ui-debug.log
firebase-debug.log
firebase-debug.*.log
```

Jangan mengabaikan `data/seed-data.json` apabila dataset sintetis tersebut memang perlu dibagikan kepada anggota kelompok.

Verifikasi:

```powershell
git check-ignore -v .env.seed
git check-ignore -v service-account-dev.json
git check-ignore -v backups/
```

## 9. Prosedur Backup

Backup wajib dilakukan sebelum import data.

### 9.1 Backup Firestore

Jalankan:

```powershell
node scripts/backup-development.js
```

Script melakukan backup terhadap collection yang dikonfigurasi, termasuk subcollection.

Pastikan file backup berhasil dibuat di folder `backups/`.

### 9.2 Backup Authentication

Gunakan Firebase CLI:

```powershell
npx firebase auth:export backups/auth-praktikumku-dcfc0.json --format=json --project praktikumku-dcfc0
```

Periksa hasil export dan jumlah akun yang berhasil dicadangkan.

File backup Authentication bersifat sensitif dan tidak boleh diunggah ke Git.

## 10. Menjalankan Seed Importer

Importer mendukung dua mode: dry-run dan eksekusi.

### 10.1 Dry Run

Pastikan:

```env
SEED_EXECUTE=false
```

Jalankan:

```powershell
node --check scripts/seed.js
node scripts/seed.js
```

Pada tahap ini, importer melakukan validasi dataset dan pemeriksaan data terkait tanpa melakukan penulisan atau penghapusan dokumen.

Periksa:

- Project ID sesuai Development.
- Konfirmasi project sesuai.
- Dataset JSON berhasil dibaca.
- Jumlah akun sesuai.
- NIM berupa String 14 digit.
- Email akun valid dan tidak duplikat.
- Relasi kelas, mata kuliah, Aslab, dan Asprak konsisten.
- Seluruh laboratorium ditemukan.
- Koordinat laboratorium berhasil dibaca.
- Tidak ada ID atau relasi yang bermasalah.
- Daftar indeks `nomorInduk` yatim yang terdeteksi.

Jangan lanjut ke import jika terdapat error.

### 10.2 Eksekusi Import

Jika dry-run dan backup sudah berhasil:

```env
SEED_EXECUTE=true
```

Kemudian jalankan:

```powershell
node scripts/seed.js
```

Importer akan:

1. Memvalidasi dataset.
2. Memastikan project tujuan sesuai.
3. Memverifikasi dokumen laboratorium.
4. Memproses akun Firebase Authentication.
5. Menyiapkan operasi Firestore.
6. Menulis data menggunakan mekanisme merge.
7. Memeriksa kembali indeks `nomorInduk` yatim.
8. Membersihkan indeks yang memenuhi kriteria penghapusan.
9. Menyimpan pemetaan ID seed ke UID secara lokal.

Jika berhasil, terminal menampilkan:

```text
SEED COMPLETED
```

Setelah import berhasil, kembalikan:

```env
SEED_EXECUTE=false
```

untuk mencegah eksekusi ulang yang tidak disengaja.

## 11. Sifat dan Keamanan Importer

Importer dirancang untuk mendukung eksekusi berulang (idempotent).

Ketentuan:

- Project ID harus cocok dengan allowlist.
- ID dokumen seed bersifat deterministik.
- Akun Authentication yang ditemukan berdasarkan email digunakan kembali.
- Password akun seed yang sudah ada dapat diperbarui berdasarkan role.
- Dokumen Firestore ditulis menggunakan mekanisme merge.
- Importer tidak menghapus seluruh collection.
- Data historis Sprint 1–3 tidak boleh dihapus secara massal.
- Dokumen master `labs` tidak dibuat ulang.
- File `seed-uid-map.local.json` hanya disimpan secara lokal.

### 11.1 Pengelolaan Timestamp

Importer mengelola field `dibuatPada` pada dokumen yang dibuat.

Ketentuan:

- Dokumen baru memperoleh `dibuatPada` menggunakan Firestore server timestamp.
- Timestamp `dibuatPada` yang sudah tersedia dipertahankan.
- Sesi yang belum memiliki `dibukaPada` dan `ditutupPada` memperoleh nilai awal `null`.
- Nilai timestamp pembukaan dan penutupan yang sudah tersedia tidak ditimpa.

### 11.2 Pembersihan Indeks NomorInduk Yatim

Importer memeriksa seluruh dokumen `nomorInduk`.

Mekanisme pemeriksaan:

1. Mengambil field `uid` dari dokumen `nomorInduk`.
2. Menggunakan UID tersebut sebagai Document ID pada collection `users`.
3. Memeriksa keberadaan dokumen `users/{uid}`.
4. Jika dokumen tidak ditemukan, indeks dimasukkan ke daftar kandidat penghapusan.
5. Indeks yang termasuk dataset seed dilindungi dari penghapusan.

Contoh:

```text
nomorInduk/
  └── 24060124140149
       └── uid: "pu3oavLt2uTp2jMZbTmz37nhkwv2"

users/
  └── Dokumen dengan UID tersebut tidak ditemukan
```

Dalam kondisi tersebut, dokumen indeks NIM dapat dihapus.

Pembersihan ini hanya menghapus dokumen pada collection `nomorInduk`.

Importer tidak menghapus:

- Dokumen profil `users`.
- Akun Firebase Authentication.
- Riwayat presensi.
- Riwayat izin.
- Dokumen kelas.
- Dokumen sesi.

Dokumen `nomorInduk` yang tidak memiliki field UID yang valid tidak dihapus otomatis dan perlu diperiksa secara manual.

> **Catatan:** Idempotent bukan berarti tanpa efek samping. Sinkronisasi password Authentication dan pembersihan indeks tetap merupakan perubahan data.

## 12. Catatan Integrasi Schema

Asumsi struktur yang digunakan importer:

1. Collection mata kuliah menggunakan nama `mataKuliah`.
2. Penugasan Asprak disimpan pada `kelas/{kelasId}/penugasanAsprak`.
3. Relasi mata kuliah dan laboratorium disimpan pada kedua sisi.
4. Penugasan Aslab disimpan pada `labs/{labId}/penugasanAslab`.
5. Collection `nomorInduk` menggunakan NIM sebagai Document ID dan menyimpan UID.
6. Collection `users` menggunakan Firebase Authentication UID sebagai Document ID.
7. Lokasi laboratorium dibaca dari dokumen master `labs` aktual.
8. Field `lab` pada kelas dipertahankan apabila diperlukan oleh struktur lama.
9. Sesi baru menyimpan `labId` dan snapshot lokasi laboratorium.
10. Field `asistenId` pada sesi merujuk kepada UID Asprak yang ditugaskan membuka sesi.
11. Kelas pengganti hanya mengubah `labId` pada sesi terkait.
12. Data izin, tagihan, dan pembayaran tidak dibuat karena struktur finalnya belum dikonfirmasi.
13. Presensi dan izin historis tidak diubah oleh proses seed.

Jika struktur aktual berbeda dari asumsi tersebut, importer harus disesuaikan sebelum import dijalankan.

Referensi utama: `docs/database/firestore-schema.md`.

## 13. Pengujian Firestore Security Rules

Pengujian Security Rules dilakukan secara terpisah dari proses seed.

Firebase Admin SDK menggunakan hak administrator dan melewati Firestore Security Rules.

Oleh karena itu, keberhasilan seed tidak membuktikan bahwa Security Rules sudah benar.

Pengujian dilakukan menggunakan Firebase Emulator dan Firebase Rules Unit Testing.

Perintah pengujian:

```powershell
$env:RULES_FILE="firestore.rules"

npx firebase emulators:exec --only firestore --project demo-praktikumku --config firebase.emulator.json "npx jest tests/firestore.rules.test.js --runInBand"
```

Skenario pengujian minimal:

- Praktikan dapat membaca profil sendiri.
- Praktikan tidak dapat mengubah role sendiri.
- Praktikan hanya dapat membaca kelas yang diizinkan.
- Asprak hanya dapat mengakses kelas yang menjadi tanggung jawabnya.
- Aslab hanya dapat mengakses laboratorium dan mata kuliah sesuai kewenangannya.
- Pengguna tanpa autentikasi ditolak untuk operasi yang memerlukan autentikasi.
- Perubahan data sensitif ditolak apabila pengguna tidak memiliki hak akses.

## 14. Troubleshooting

| Kendala | Pemeriksaan |
|---|---|
| Project ID mismatch | Periksa target project, allowlist, dan konfirmasi project |
| Service Account error | Periksa lokasi JSON dan hak akses |
| Email sudah digunakan | Periksa akun Authentication berdasarkan email |
| Invalid NIM | Pastikan NIM berupa String 14 digit |
| Lab tidak ditemukan | Periksa dokumen master `labs` |
| Koordinat tidak terbaca | Periksa struktur field lokasi |
| Permission denied | Periksa konfigurasi Admin SDK |
| Relasi tidak valid | Periksa ID kelas, mata kuliah, lab, dan UID |
| Indeks NIM yatim | Periksa keberadaan `users/{uid}` |
| Dry-run gagal | Periksa dataset dan konfigurasi environment |

## 15. Referensi

- `data/seed-data.json` — Dataset seed JSON v3.
- `scripts/seed.js` — Script importer.
- `scripts/backup-development.js` — Script backup Firestore.
- `.env.seed.example` — Contoh konfigurasi environment.
- `docs/database/firestore-schema.md` — Schema Firestore Sprint 4.
- `docs/database/firestore-migration.md` — Dokumentasi migrasi database.
- `firestore.rules` — Firestore Security Rules.
- `firebase.emulator.json` — Konfigurasi Firebase Emulator.
- `tests/firestore.rules.test.js` — Pengujian Security Rules.
- `README.md` — Dokumentasi utama PraktikumKU.

---

**Status:** Dokumentasi Seed Sprint 4 — Development Only.

**Catatan:** Importer telah berhasil dijalankan pada Firebase Development dengan 32 akun, 4 kelas, 8 sesi, dan pembersihan satu indeks `nomorInduk` yatim. Pengujian Security Rules tetap dilakukan secara terpisah.