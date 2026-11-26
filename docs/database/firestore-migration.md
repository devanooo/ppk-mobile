# Firestore Migration Plan — PraktikumKU

**Version:** 1.0  
**Sprint:** Sprint 4  
**Status:** Agreed — Pending Execution  
**Project Manager:** Anggi  
**Technical Reviewer:** Dehar  
**Database:** Firebase Cloud Firestore

---

# 1. Overview

Dokumen ini menjelaskan rencana migrasi struktur Cloud Firestore PraktikumKU dari Sprint 1–3 menuju Sprint 4.

Migrasi diperlukan untuk mendukung:
- Penambahan role Aslab.
- Perubahan role `asisten` menjadi `asprak`.
- Penambahan master data mata kuliah.
- Penambahan relasi mata kuliah dengan lokasi laboratorium.
- Penambahan sistem penugasan Aslab.
- Penambahan sistem penugasan dua Asprak pada setiap kelas.
- Penyesuaian lokasi kelas dan sesi.
- Integrasi data denda dan pembayaran.

Migrasi dilakukan pada environment development setelah backup dan validasi struktur database.

# 2. Migration Principles

1. Backup database sebelum migrasi.
2. Tidak mengubah UID Firebase Authentication pengguna lama.
3. Mempertahankan data historis sesi dan presensi.
4. Mempertahankan array `pesertaIds`.
5. Menggunakan collection `labs` yang sudah tersedia.
6. Tidak membuat collection `laboratorium` baru.
7. Tidak menghapus field lama sebelum kompatibilitas kode diperiksa.
8. Memastikan seluruh referensi antarcollection valid.
9. Menghindari data penugasan ganda.
10. Tidak menjalankan migrasi pada environment production.

# 3. Existing Database

Collection lama yang menjadi objek pemeriksaan:

| Collection | Fungsi |
|---|---|
| `users` | Profil pengguna dan role |
| `nomorInduk` | Pemetaan nomor induk ke UID |
| `labs` | Data lokasi fisik laboratorium |
| `kelas` | Data kelas praktikum |
| `sesi` | Jadwal dan pelaksanaan praktikum |
| Collection presensi lama | Data kehadiran |
| Collection izin lama | Pengajuan izin |
| Collection notifikasi | Peristiwa dan token notifikasi |

Nama serta struktur collection presensi dan izin harus diverifikasi dari implementasi aktual.

# 4. Migration Changes

## 4.1 Role Migration

**Existing roles:**
- `praktikan`
- `asisten`

**Target roles:**
- `praktikan`
- `asprak`
- `aslab`

Perubahan:
1. Seluruh akun dengan role `asisten` dipetakan menjadi `asprak`.
2. UID Firebase Authentication tetap dipertahankan.
3. Dokumen profil pada `users` diperbarui.
4. Akun Aslab ditambahkan melalui provisioning.
5. Memastikan satu akun hanya memiliki satu role.
6. Memastikan pemetaan role tidak menyebabkan kehilangan akses akun lama.

Target:

```json
{
  "nama": "Nama Asisten",
  "email": "asisten@example.com",
  "peran": "asprak"
}
```

## 4.2 Participant Data Migration

**Keputusan: Tidak ada perubahan struktur.**

Field `pesertaIds` tetap menggunakan array pada dokumen `kelas`.

Tindakan:
1. Mempertahankan seluruh UID Praktikan yang sudah tersimpan.
2. Memastikan tidak ada UID duplikat.
3. Memvalidasi seluruh UID memiliki dokumen profil pengguna.
4. Memastikan seluruh peserta memiliki role `praktikan`.

Tidak dilakukan pemindahan data peserta ke subcollection.

## 4.3 Subject Data Migration

Penambahan collection `mataKuliah` sebagai master data mata kuliah.

Tindakan:
1. Mengidentifikasi mata kuliah yang digunakan dalam kelas lama.
2. Membuat dokumen master mata kuliah.
3. Menambahkan field `mataKuliahId` pada dokumen kelas.
4. Membuat relasi mata kuliah pada `labs` melalui subcollection `mataKuliah`.
5. Memastikan relasi many-to-many antara mata kuliah dan lokasi laboratorium.
6. Memvalidasi seluruh referensi mata kuliah.

Target:

```text
mataKuliah/{mataKuliahId}

labs/{labId}/mataKuliah/{mataKuliahId}
```

## 4.4 Aslab Assignment Migration

Penambahan sistem penugasan Aslab.

Target:

```text
labs/{labId}/penugasanAslab/{assignmentId}
```

Tindakan:
1. Menyiapkan akun Aslab.
2. Memastikan setiap Aslab hanya memiliki satu mata kuliah tanggung jawab.
3. Menambahkan penugasan Aslab pada lokasi `labs` terkait.
4. Memastikan satu Aslab dapat ditugaskan pada beberapa lokasi laboratorium.
5. Memastikan seluruh penugasan aktif Aslab menggunakan mata kuliah yang sama.
6. Memastikan mata kuliah sudah terdaftar pada lokasi `labs` terkait.
7. Mempertahankan riwayat penugasan ketika terjadi perubahan.

Penugasan awal Aslab dilakukan melalui mekanisme provisioning manual.

## 4.5 Asprak Assignment Migration

**Existing:**

Dokumen kelas menggunakan field `asistenId` untuk menyimpan UID Asisten lama.

**Target:**

```text
kelas/{kelasId}/penugasanAsprak/{assignmentId}
```

Tindakan migrasi:

1. Membaca nilai `asistenId` dari setiap dokumen kelas.
2. Memeriksa apakah UID Asisten lama masih valid.
3. Memastikan akun tersebut telah dimigrasikan menjadi role `asprak`.
4. Membuat dokumen penugasan pertama menggunakan UID Asprak lama.
5. Mempertahankan UID tersebut sebagai Asprak pertama.
6. Aslab menambahkan Asprak kedua melalui fitur pengelolaan penugasan.
7. Memastikan setiap kelas memiliki tepat dua Asprak aktif.
8. Memastikan kedua UID Asprak berbeda.
9. Mempertahankan field `asistenId` lama selama masa transisi.
10. Menghentikan penggunaan `asistenId` setelah seluruh kode baru menggunakan subcollection penugasan dan pengujian berhasil.

Contoh:

**Sebelum migrasi:**

```json
{
  "nama": "Struktur Data A1",
  "asistenId": "uid-asisten-001"
}
```

**Sesudah migrasi:**

```text
kelas/KELAS001/
  penugasanAsprak/
    assignment-001
      asprakId: uid-asisten-001
      status: aktif

    assignment-002
      asprakId: uid-asprak-002
      status: aktif
```

Catatan:
- Asprak kedua tidak dibuat otomatis menggunakan UID Asprak pertama.
- Jika Asprak kedua belum ditentukan, kelas belum memenuhi persyaratan dua Asprak aktif.
- Jika `asistenId` kosong atau UID tidak valid, kelas harus masuk daftar pemeriksaan manual.
- Penugasan baru harus divalidasi terhadap kewenangan Aslab.

## 4.6 Laboratory Reference Migration

Collection `labs` tetap digunakan sebagai sumber data lokasi fisik laboratorium.

Tindakan:
1. Memeriksa seluruh `labId` pada dokumen kelas.
2. Memastikan setiap referensi mengarah ke dokumen `labs` yang valid.
3. Memeriksa referensi lokasi pada dokumen sesi.
4. Memastikan kelas memiliki lokasi fisik utama.
5. Memastikan sesi memiliki lokasi fisik aktual.
6. Mempertahankan snapshot informasi lokasi pada sesi historis.

### Aturan kelas pengganti

Kelas pengganti hanya mengubah `labId` pada dokumen sesi terkait.

Contoh:

| Data | Sebelum | Sesudah |
|---|---|---|
| `kelas.labId` | LAB_B | LAB_B |
| `sesi.labId` | LAB_B | LAB_C |
| Mata kuliah | Struktur Data | Struktur Data |
| Penugasan Aslab | Aslab A | Aslab A |

Ketentuan:
- Lokasi utama kelas tidak berubah.
- Mata kuliah tidak berubah.
- Penugasan Aslab tidak berubah.
- Sesi historis tidak berubah.
- Snapshot nama, koordinat, dan radius sesi harus konsisten dengan lokasi baru.

## 4.7 Historical Data Preservation

Data berikut wajib dipertahankan:

- Data pengguna.
- Data mata kuliah yang sudah dipetakan.
- Data kelas.
- Data peserta.
- Riwayat sesi.
- Riwayat presensi.
- Riwayat izin.
- Riwayat penugasan.
- Riwayat tagihan.
- Riwayat pembayaran.

Perubahan kelas, lokasi, atau penugasan tidak boleh mengubah catatan historis.

# 5. Migration Execution Order

Migrasi dilakukan dengan urutan berikut:

| No. | Aktivitas | Output |
|---|---|---|
| 1 | Backup Firestore development | Backup tersedia |
| 2 | Audit collection dan field lama | Inventaris database |
| 3 | Mapping role `asisten` menjadi `asprak` | Role konsisten |
| 4 | Menyiapkan akun Aslab | Akun Aslab tersedia |
| 5 | Membuat master mata kuliah | Collection mataKuliah |
| 6 | Membuat relasi mata kuliah pada labs | Relasi valid |
| 7 | Membuat penugasan Aslab | Subcollection penugasanAslab |
| 8 | Memigrasikan `asistenId` menjadi penugasan pertama | Penugasan Asprak pertama |
| 9 | Menambahkan Asprak kedua | Dua Asprak aktif |
| 10 | Memvalidasi `pesertaIds` | Peserta tetap utuh |
| 11 | Memvalidasi referensi `labId` | Lokasi valid |
| 12 | Menguji sesi dan presensi historis | Data historis utuh |
| 13 | Menguji hak akses setiap role | Security terverifikasi |
| 14 | Melakukan regression testing | Fitur lama tetap berjalan |

# 6. Migration Validation

| Pengujian | Kriteria keberhasilan |
|---|---|
| Role migration | Tidak ada role `asisten` yang tertinggal pada akun aktif |
| UID consistency | UID Authentication sesuai dokumen `users` |
| NIM validation | NIM tepat 14 digit |
| Mata kuliah | Seluruh referensi valid |
| Aslab assignment | Satu Aslab hanya memiliki satu mata kuliah |
| Aslab coverage | Penugasan sesuai cakupan laboratorium |
| Asprak assignment | Setiap kelas memiliki tepat dua Asprak aktif |
| Asprak uniqueness | Tidak ada UID ganda pada satu kelas |
| Participant data | `pesertaIds` tetap utuh dan tidak duplikat |
| Laboratory reference | Seluruh `labId` valid |
| Replacement session | Hanya sesi terkait yang berubah |
| Session history | Sesi historis tetap tersedia |
| Attendance history | Presensi lama tetap tersedia |
| Payment history | Tagihan dan pembayaran tetap tersedia |

# 7. Rollback Plan

Jika migrasi mengalami kegagalan:

1. Hentikan proses migrasi.
2. Identifikasi dokumen dan collection yang terdampak.
3. Jangan melanjutkan migrasi ke tahap berikutnya.
4. Pulihkan backup apabila integritas data terganggu.
5. Verifikasi ulang UID, referensi, dan data historis.
6. Perbaiki script migrasi sebelum dijalankan kembali.

Migrasi harus menggunakan operasi yang aman terhadap duplikasi, misalnya pemeriksaan dokumen sebelum penulisan dan ID dokumen yang deterministik.

# 8. Post-Migration Checklist

- [ ] Seluruh akun memiliki role yang sesuai.
- [ ] UID Authentication tetap konsisten.
- [ ] Collection `mataKuliah` tersedia.
- [ ] Relasi mata kuliah dan `labs` valid.
- [ ] Penugasan Aslab tersedia.
- [ ] `asistenId` lama telah dipetakan.
- [ ] Setiap kelas memiliki dua Asprak aktif.
- [ ] `pesertaIds` tetap utuh.
- [ ] Referensi `labId` valid.
- [ ] Sesi historis tetap tersedia.
- [ ] Presensi historis tetap tersedia.
- [ ] Tagihan dan pembayaran tetap tersedia.
- [ ] Security Rules telah diuji.
- [ ] Fitur Sprint 1–3 telah melewati regression testing.

# 9. Open Decisions

| Topik | Status |
|---|---|
| Mekanisme provisioning awal Aslab | Pending |
| Penentuan Asprak kedua untuk setiap kelas lama | Pending data |
| Penanganan kelas dengan `asistenId` kosong/tidak valid | Pending data audit |
| Mapping seluruh field kelas lama | Pending code inspection |
| Mapping struktur presensi dan izin lama | Pending code inspection |
| Migrasi data tagihan dan pembayaran | Menyesuaikan implementasi aktual |
| Jadwal pelaksanaan migrasi | Pending |

# 10. Approval

| Peran | Nama | Status |
|---|---|---|
| Project Manager | Anggi | Disetujui |
| Programmer Aslab | Dehar | Disetujui |
| Programmer Asprak | Nashwa | Pending |
| Programmer Backend | Devano | Pending |

Dokumen ini menjadi acuan prosedur migrasi database Sprint 4. Pelaksanaan migrasi hanya dilakukan setelah backup, audit data lama, dan kesiapan implementasi telah diverifikasi.