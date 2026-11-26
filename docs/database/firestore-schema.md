# Firestore Database Schema — PraktikumKU

**Version:** 1.1  
**Sprint:** Sprint 4  
**Status:** Agreed — Pending Implementation  
**Project Manager:** Anggi  
**Technical Reviewer:** Dehar  
**Database:** Firebase Cloud Firestore

---

# 1. Overview

Dokumen ini mendefinisikan struktur database Cloud Firestore PraktikumKU untuk Sprint 4, dengan mempertahankan collection yang telah digunakan pada Sprint 1–3 dan menambahkan struktur untuk kebutuhan role Aslab, penugasan, mata kuliah, denda, dan pembayaran.

Tujuan:
- Mendukung tiga role: Praktikan, Asprak, dan Aslab.
- Mendukung pengelolaan mata kuliah dan lokasi laboratorium.
- Mendukung penugasan Aslab dan Asprak.
- Mendukung pengelolaan kelas dan peserta praktikum.
- Mempertahankan riwayat sesi dan presensi.
- Mendukung integrasi denda, pembayaran, izin, dan notifikasi.

## 1.1 Prinsip Perancangan

1. Mempertahankan collection lama yang masih relevan.
2. Menggunakan UID Firebase Authentication sebagai identitas pengguna.
3. Menggunakan subcollection untuk data penugasan yang membutuhkan riwayat.
4. Menggunakan `labs` sebagai sumber data lokasi fisik laboratorium.
5. Tidak membuat collection `laboratorium` baru.
6. Mempertahankan `pesertaIds` sebagai array pada dokumen kelas.
7. Mempertahankan data historis ketika terjadi perubahan kelas, peserta, atau lokasi.
8. Memvalidasi hak akses melalui Firestore Security Rules dan backend tepercaya.

---

# 2. Collection Overview

| Collection | Status | Fungsi |
|---|---|---|
| `users` | Existing | Profil pengguna dan role |
| `nomorInduk` | Existing | Pemetaan nomor induk ke UID |
| `labs` | Existing | Lokasi fisik laboratorium |
| `mataKuliah` | New | Master data mata kuliah |
| `kelas` | Existing | Data kelas praktikum |
| `sesi` | Existing | Jadwal dan pelaksanaan praktikum |
| `tagihan` | New/Review | Data tagihan denda |
| `pembayaran` | New/Review | Data transaksi pembayaran |
| `peristiwaNotifikasi` | Existing | Peristiwa notifikasi |
| `tokenPerangkat` | Existing | Token perangkat pengguna |
| `logPengiriman` | Existing | Riwayat pengiriman notifikasi |

Status New/Review harus dicocokkan dengan collection aktual sebelum implementasi.

# 3. Role Definition

Aplikasi memiliki tiga role:

| Role | Fungsi |
|---|---|
| `praktikan` | Mengikuti kegiatan praktikum |
| `asprak` | Menjalankan operasional praktikum |
| `aslab` | Mengelola laboratorium, mata kuliah, kelas, dan penugasan |

## 3.1 Aturan Role

1. Satu akun hanya memiliki satu role.
2. Role `asisten` lama dipetakan menjadi `asprak`.
3. UID Firebase Authentication tetap dipertahankan.
4. Akun Aslab ditambahkan melalui proses provisioning.
5. Pengguna tidak dapat mengubah role miliknya sendiri.
6. Hak akses tidak hanya dibatasi melalui navigasi aplikasi.

# 4. Collection Specification

## 4.1 `users`

**Document ID:** Firebase Authentication UID.

| Field | Type | Keterangan |
|---|---|---|
| `nama` | String | Nama pengguna |
| `nomorInduk` | String | NIM atau nomor identitas |
| `email` | String | Email pengguna |
| `peran` | String | praktikan/asprak/aslab |
| `dibuatPada` | Timestamp | Waktu pembuatan |

Aturan:
- NIM Praktikan menggunakan tipe `String`.
- NIM wajib terdiri dari tepat 14 digit angka.
- Password tidak disimpan di Firestore.
- Setiap UID hanya memiliki satu role.

## 4.2 `nomorInduk`

**Document ID:** Nomor induk pengguna.

| Field | Type | Keterangan |
|---|---|---|
| `uid` | String | UID Firebase Authentication |

Digunakan untuk pemetaan nomor induk ke akun pengguna.

## 4.3 `mataKuliah`

**Document ID:** `mataKuliahId`.

| Field | Type | Keterangan |
|---|---|---|
| `kode` | String | Kode mata kuliah |
| `nama` | String | Nama mata kuliah |
| `isActive` | Boolean | Status mata kuliah |
| `dibuatPada` | Timestamp | Waktu pembuatan |

Aturan:
- Satu mata kuliah dapat diselenggarakan di beberapa lokasi `labs`.
- Satu lokasi `labs` dapat digunakan untuk beberapa mata kuliah.

## 4.4 `labs`

Collection `labs` yang sudah tersedia tetap menjadi sumber data lokasi fisik laboratorium, seperti Lab B, Lab C, Lab D, dan Lab AP.

Field yang telah diketahui dari struktur lama:

| Field | Type | Keterangan |
|---|---|---|
| `code` | String | Kode laboratorium |
| `name` | String | Nama laboratorium |
| `building` | String | Gedung |
| `floor` | String/Number | Lantai |
| `location` | GeoPoint | Koordinat |
| `plusCode` | String | Plus Code |
| `radiusMeters` | Number | Radius presensi |
| `isActive` | Boolean | Status lokasi |
| `roomCenterVerified` | Boolean | Status verifikasi koordinat |

Field aktual lainnya tetap dipertahankan.

### Subcollection `mataKuliah`

Path:

`labs/{labId}/mataKuliah/{mataKuliahId}`

| Field | Type | Keterangan |
|---|---|---|
| `mataKuliahId` | String | ID mata kuliah |
| `status` | String | aktif/nonaktif |
| `ditambahkanPada` | Timestamp | Waktu penambahan |

Subcollection ini merepresentasikan relasi many-to-many antara lokasi laboratorium dan mata kuliah.

### Subcollection `penugasanAslab`

Path:

`labs/{labId}/penugasanAslab/{assignmentId}`

| Field | Type | Keterangan |
|---|---|---|
| `aslabId` | String | UID Aslab |
| `mataKuliahId` | String | Mata kuliah tanggung jawab |
| `status` | String | aktif/nonaktif |
| `ditugaskanPada` | Timestamp | Waktu penugasan |
| `ditugaskanOleh` | String | UID pihak yang menugaskan |
| `dicabutPada` | Timestamp/Null | Waktu pencabutan |

**Aturan penugasan Aslab:**

1. Satu laboratorium dapat memiliki beberapa Aslab.
2. Satu Aslab dapat mengelola beberapa lokasi `labs`.
3. Satu Aslab hanya bertanggung jawab atas satu mata kuliah.
4. Jika Aslab mengelola beberapa `labs`, mata kuliah pada seluruh penugasan aktifnya harus sama.
5. Mata kuliah yang ditugaskan harus terdaftar pada lokasi `labs` terkait.
6. Penugasan dilakukan secara manual melalui mekanisme provisioning yang disepakati.
7. Riwayat penugasan tidak dihapus; status diubah menjadi nonaktif.

Contoh:

| Aslab | Lokasi | Mata kuliah |
|---|---|---|
| Aslab A | Lab B | Struktur Data |
| Aslab A | Lab C | Struktur Data |
| Aslab B | Lab B | Sistem Operasi |

## 4.5 `kelas`

Collection `kelas` tetap digunakan.

Field baru atau yang perlu dipastikan tersedia:

| Field | Type | Keterangan |
|---|---|---|
| `nama` | String | Nama kelas |
| `mataKuliahId` | String | Referensi mata kuliah |
| `labId` | String | Lokasi fisik utama kelas |
| `pesertaIds` | Array<String> | UID peserta kelas |
| `isActive` | Boolean | Status kelas |

Field lama lainnya tetap dipertahankan sesuai implementasi aktual.

**Aturan kelas:**

1. Satu kelas hanya memiliki satu mata kuliah.
2. Satu kelas memiliki satu lokasi fisik utama.
3. Setiap kelas wajib memiliki tepat dua Asprak aktif.
4. Asprak dapat ditugaskan pada beberapa kelas.
5. Aslab berhak mengelola penugasan Asprak pada kelas yang menjadi kewenangannya.
6. Pemindahan kelas berlaku untuk kegiatan berikutnya.
7. Perubahan lokasi utama kelas tidak mengubah sesi historis.

### Subcollection `penugasanAsprak`

Path:

`kelas/{kelasId}/penugasanAsprak/{assignmentId}`

| Field | Type | Keterangan |
|---|---|---|
| `asprakId` | String | UID Asprak |
| `status` | String | aktif/nonaktif |
| `ditugaskanOleh` | String | UID Aslab |
| `ditugaskanPada` | Timestamp | Waktu penugasan |
| `dicabutPada` | Timestamp/Null | Waktu pencabutan |

Aturan:
1. Setiap kelas memiliki tepat dua penugasan Asprak aktif.
2. Satu Asprak dapat menangani beberapa kelas.
3. Asprak hanya boleh ditugaskan pada kelas dalam cakupan laboratorium dan mata kuliah Aslab terkait.
4. Penambahan dan pencabutan penugasan dilakukan oleh Aslab berwenang.
5. Riwayat penugasan dipertahankan.
6. Penugasan lama dinonaktifkan, bukan dihapus.
7. UID kedua Asprak harus berbeda dari UID Asprak pertama.

### Data peserta

Data peserta tetap menggunakan `pesertaIds` berbentuk array pada dokumen kelas.

Aturan:
1. UID Praktikan tidak boleh duplikat dalam satu array.
2. Pemindahan Praktikan memperbarui keanggotaan kelas sesuai mekanisme yang disepakati.
3. Data sesi dan presensi historis tetap dipertahankan.
4. Pemindahan tidak boleh menyebabkan perubahan data historis.

## 4.6 `sesi`

Collection `sesi` tetap dipertahankan.

Field lokasi yang telah diketahui dari struktur lama:

| Field | Type | Keterangan |
|---|---|---|
| `kelasId` | String | Referensi kelas |
| `labId` | String | Lokasi fisik aktual sesi |
| `labNama` | String | Snapshot nama lokasi |
| `labLatitude` | Number | Snapshot latitude |
| `labLongitude` | Number | Snapshot longitude |
| `labRadiusMeters` | Number | Snapshot radius |
| `tanggal` | String | Tanggal sesi |
| `hari` | String | Hari sesi |
| `jamMulai` | String | Jam mulai |
| `jamSelesai` | String | Jam selesai |
| `status` | String | Status sesi |
| `asprakId` | String | UID Asprak, jika digunakan struktur lama |

Field aktual lainnya tetap dipertahankan.

### Aturan lokasi sesi

1. `kelas.labId` adalah lokasi fisik utama kelas.
2. `sesi.labId` adalah lokasi fisik aktual sesi.
3. Sesi normal mengikuti lokasi utama kelas.
4. Kelas pengganti hanya mengubah `labId` pada sesi terkait.
5. Perubahan tersebut tidak mengubah `kelas.labId`.
6. Mata kuliah dan penugasan Aslab tidak berubah akibat kelas pengganti.
7. Sesi dan presensi historis tidak boleh berubah.
8. Snapshot lokasi sesi harus diperbarui secara konsisten dengan `labId` yang digunakan.

Contoh:

```json
{
  "kelasId": "KELAS001",
  "labId": "LAB_C",
  "labNama": "Lab C",
  "tanggal": "2026-11-25"
}
```

Contoh tersebut merupakan sesi pengganti. Lokasi utama kelas tetap tersimpan pada dokumen kelas.

## 4.7 Presensi dan Izin

Struktur presensi dan izin lama dipertahankan sampai field aktual diperiksa.

Jika menggunakan subcollection, path yang direkomendasikan:

- `sesi/{sesiId}/presensi/{presensiId}`
- `sesi/{sesiId}/izin/{izinId}`

Jangan memindahkan atau menghapus data historis sebelum struktur aktual diverifikasi.

## 4.8 `tagihan`

Collection untuk menyimpan tagihan denda.

| Field | Type | Keterangan |
|---|---|---|
| `praktikanId` | String | UID Praktikan |
| `sesiId` | String | Referensi sesi |
| `kelasId` | String | Referensi kelas |
| `labId` | String | Identitas lokasi saat kejadian |
| `mataKuliahId` | String | Referensi mata kuliah |
| `nominal` | Number | Nominal denda |
| `status` | String | Status tagihan |
| `dibuatPada` | Timestamp | Waktu pembuatan |

Aturan:
- Satu kejadian keterlambatan tidak boleh menghasilkan tagihan ganda.
- Tagihan terhubung dengan praktikan, kelas, dan sesi.
- Identitas lokasi serta mata kuliah saat tagihan dibuat dipertahankan.

## 4.9 `pembayaran`

Collection untuk menyimpan transaksi pembayaran.

| Field | Type | Keterangan |
|---|---|---|
| `tagihanId` | String | Referensi tagihan |
| `praktikanId` | String | UID Praktikan |
| `labId` | String | Lokasi terkait tagihan |
| `nominal` | Number | Nominal pembayaran |
| `orderId` | String | ID transaksi Midtrans |
| `status` | String | Status pembayaran |
| `dibuatPada` | Timestamp | Waktu transaksi |
| `dibayarPada` | Timestamp/Null | Waktu pembayaran |

Status transaksi harus diperbarui melalui backend tepercaya.

## 4.10 Collection Notifikasi

Collection lama berikut tetap dipertahankan:

- `peristiwaNotifikasi`
- `tokenPerangkat`
- `logPengiriman`

Penyesuaian field dan navigasi notifikasi mengikuti implementasi modul Devano.

---

# 5. Data Relationships

| Relasi | Kardinalitas |
|---|---|
| Mata kuliah – Labs | Many-to-many |
| Labs – Aslab | Many-to-many melalui penugasan |
| Aslab – Mata kuliah | Satu Aslab : satu mata kuliah |
| Labs – Kelas | One-to-many |
| Kelas – Mata kuliah | Many-to-one |
| Kelas – Asprak | Tepat dua penugasan aktif |
| Kelas – Praktikan | One-to-many melalui `pesertaIds` |
| Kelas – Sesi | One-to-many |
| Sesi – Presensi | One-to-many |
| Sesi – Izin | One-to-many |
| Tagihan – Pembayaran | One-to-many sesuai riwayat transaksi |

---

# 6. Business Constraints

1. Satu akun hanya memiliki satu role.
2. Role valid: praktikan, asprak, dan aslab.
3. NIM menggunakan String dan tepat 14 digit.
4. Satu mata kuliah dapat diselenggarakan di beberapa lokasi `labs`.
5. Satu lokasi `labs` dapat digunakan beberapa mata kuliah.
6. Satu Aslab hanya bertanggung jawab atas satu mata kuliah.
7. Satu Aslab boleh mengelola beberapa lokasi `labs` dengan mata kuliah yang sama.
8. Satu kelas hanya memiliki satu mata kuliah.
9. Setiap kelas memiliki satu lokasi fisik utama.
10. Setiap kelas wajib memiliki dua Asprak aktif.
11. Satu Asprak dapat bertugas pada beberapa kelas.
12. Aslab dapat mengelola penugasan Asprak sesuai kewenangannya.
13. `pesertaIds` tetap berupa array.
14. Pemindahan Praktikan tidak menghapus riwayat sesi dan presensi.
15. Pemindahan kelas tidak mengubah sesi historis.
16. Kelas pengganti hanya mengubah `labId` pada sesi terkait.
17. Tagihan dan pembayaran menyimpan identitas lokasi dan mata kuliah terkait.
18. Status pembayaran hanya diperbarui melalui backend tepercaya.

---

# 7. Security Principles

1. Hak akses berdasarkan UID dan role.
2. Praktikan hanya mengakses data yang menjadi haknya.
3. Asprak hanya mengelola kelas yang ditugaskan.
4. Aslab hanya mengelola lokasi, mata kuliah, dan kelas sesuai cakupan penugasannya.
5. Pengguna tidak dapat mengubah role sendiri.
6. Pengguna tidak dapat memanipulasi penugasan administratif.
7. Status pembayaran tidak boleh diperbarui langsung oleh aplikasi klien.
8. Operasi sensitif harus menggunakan mekanisme tepercaya.

Detail implementasi Security Rules didokumentasikan secara terpisah.

---

# 8. Migration Considerations

1. Role `asisten` dipetakan menjadi `asprak`.
2. UID Authentication dipertahankan.
3. `pesertaIds` tetap dipertahankan.
4. Tidak membuat collection `laboratorium` baru.
5. Penugasan Aslab ditambahkan melalui subcollection pada `labs`.
6. Penugasan Asprak ditambahkan melalui subcollection pada `kelas`.
7. `asistenId` lama dipetakan menjadi penugasan Asprak pertama.
8. Asprak kedua ditambahkan melalui Aslab.
9. Lokasi utama kelas disimpan pada `kelas.labId`.
10. Lokasi aktual sesi disimpan pada `sesi.labId`.
11. Data historis dipertahankan.

Detail prosedur migrasi terdapat pada `docs/database/firestore-migration.md`.

---

# 9. Open Technical Decisions

| Topik | Status |
|---|---|
| Mekanisme provisioning awal Aslab | Pending |
| Detail field mata kuliah | Perlu pemeriksaan kode |
| Detail field penugasan | Perlu validasi implementasi |
| Struktur presensi dan izin lama | Perlu pemeriksaan kode |
| Kontrak data AI | Menunggu spesifikasi pengajar |
| Backend Midtrans | Menunggu keputusan |
| Composite indexes | Berdasarkan query aktual |

---

# 10. Approval

| Peran | Nama | Status |
|---|---|---|
| Project Manager | Anggi | Disetujui |
| Programmer Aslab | Dehar | Disetujui |
| Programmer Asprak | Nashwa | Pending |
| Programmer Backend | Devano | Pending |