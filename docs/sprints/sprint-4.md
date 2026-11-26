# Sprint 4: Role Aslab, Administrasi Laboratorium, Denda, Pembayaran, dan AI

## 1. Informasi Sprint

| Field | Isi |
|---|---|
| Sprint | Sprint 4 |
| Nama | Role Aslab, Administrasi Laboratorium, Denda, Pembayaran, dan AI |
| Periode | TBD (menunggu penetapan pengajar/PM) |
| Sprint goal | Menambahkan role Aslab, administrasi laboratorium dan distribusi anggota, operasional sesi dan presensi Asprak, pengajuan izin dengan dukungan analisis sentimen AI, perhitungan denda, pembayaran Midtrans Sandbox melalui backend, notifikasi, serta penyempurnaan navigasi dan UI |
| Target platform | Android, iOS, Web (satu codebase Expo; fitur perangkat dan payment mengikuti dukungan library serta konfigurasi) |
| Tim | PM: Anggi. Programmer 1: Dehar. Programmer 2: Nashwa. Programmer 3: Devano. |
| Status | Perencanaan, belum dimulai |
| Referensi utama | `docs/references/PEMBAGIAN JOBDESC SPRINT 4 — PRAKTIKUMKU.pdf` |

Dokumen ini menjadi acuan pelaksanaan Sprint 4. Setiap perubahan scope, kontrak data, pembagian tugas, atau dependency harus disepakati PM dan dicatat di dokumen ini sebelum dikerjakan. Bila dokumen ini berbeda dengan dokumen sprint sebelumnya, ketentuan Sprint 4 yang berlaku untuk pekerjaan Sprint 4.

**Catatan sumber.** Repository hanya memuat satu berkas PDF referensi Sprint 4, yaitu `PEMBAGIAN JOBDESC SPRINT 4 — PRAKTIKUMKU.pdf`. Berkas requirement resmi terpisah dan berkas perbaikan sprint sebelumnya yang terpisah tidak ditemukan. Seluruh requirement dan perbaikan pada dokumen ini diambil dari PDF tersebut. Hal yang tidak tercantum di PDF ditandai TBD, bukan diasumsikan.

## 2. Sprint Goals

Pada akhir Sprint 4, alur berikut harus berjalan end-to-end dengan Firebase Authentication dan Cloud Firestore:

1. **Alur Aslab:** Aslab masuk, mengelola laboratorium, melakukan bulk insert laboratorium, praktikan, dan Asprak, memindahkan anggota antarlaboratorium, lalu memantau seluruh laboratorium dan riwayat keuangan pada Dashboard Aslab.
2. **Alur Asprak:** Asprak melihat kelas, jadwal, dan sesi yang menjadi tanggung jawabnya, membuka dan menutup sesi secara real-time, memantau presensi, memeriksa pengajuan izin beserta hasil analisis AI, lalu menerima atau menolak izin.
3. **Alur Praktikan:** Praktikan mengajukan izin sesuai kategori, melihat keputusan secara real-time, menerima status `excused absence` tanpa denda bila disetujui, dan tetap dapat melakukan presensi melalui mekanisme QR/lokasi Sprint 3.
4. **Alur Denda dan Pembayaran:** Keterlambatan dihitung berdasarkan waktu presensi dan grace period, tagihan denda dibuat otomatis satu kali per kejadian, pembayaran dilakukan melalui Midtrans Sandbox dengan alur client–backend–payment gateway, status transaksi diperbarui dari backend, dan pembayaran tidak mengubah status kehadiran.
5. **Alur AI:** Alasan izin dikirim ke layanan AI, hasil analisis disimpan bersama pengajuan izin, ditampilkan kepada Asprak sebagai informasi pendukung, dan kegagalan AI tidak menghambat pengajuan izin.
6. **Alur Notifikasi dan Navigasi:** Notifikasi tagihan, pembayaran berhasil, dan pembayaran gagal dapat diklik serta mengarah ke halaman relevan; navbar Praktikan dan Asprak masing-masing memiliki lima halaman sesuai PDF.

Seluruh validasi hak akses harus ditegakkan di Firestore Security Rules, bukan hanya dengan menyembunyikan navigasi. Secret Key Midtrans tidak boleh berada di aplikasi React Native. Hasil AI tidak boleh menjadi keputusan otomatis.

## 3. Scope Resmi

### 3.1 In scope

| Area | Scope |
|---|---|
| Role dan akses | Role `aslab`, pemisahan kewenangan Aslab dan Asprak, matriks hak akses, Security Rules |
| Administrasi laboratorium | CRUD laboratorium, bulk/single insert laboratorium berdasarkan mata kuliah, bulk/single insert praktikan dan Asprak, template unduhan, halaman review hasil bulk insert, perpindahan anggota antarlaboratorium |
| Informasi laboratorium | Nama, lokasi, koordinat, radius validasi presensi, cakupan lokasi presensi, batas keterlambatan |
| Dashboard Aslab | Jumlah laboratorium dan praktikan, status kegiatan, jadwal berlangsung dan berikutnya, riwayat kegiatan, riwayat keuangan, filter hari/minggu/bulan |
| Operasional Asprak | Daftar kelas/jadwal/sesi, buka dan tutup sesi, sinkronisasi real-time, pemantauan dan pengelolaan presensi |
| Izin | Halaman pemeriksaan izin, alasan dan hasil analisis sentimen AI, keputusan terima/tolak, sinkronisasi real-time, kategori izin/alpha/sakit, alur pengajuan dengan sesi terpilih |
| Presensi dan denda | Integrasi izin disetujui dengan `excused absence` dan pembebasan denda, perhitungan keterlambatan, tagihan otomatis, idempotensi tagihan, relasi tagihan |
| Pembayaran | Midtrans Sandbox, transaksi melalui backend, callback/webhook, verifikasi, status pending/success/failed, pembaruan status tagihan, riwayat transaksi, persistensi riwayat |
| AI | Integrasi API analisis sentimen, pengiriman alasan izin, penyimpanan hasil, penanganan gangguan layanan, akses hasil oleh Asprak melalui modul Nashwa |
| Notifikasi | Tagihan baru, pembayaran berhasil, pembayaran gagal, tombol notifikasi dapat diklik, deep link ke halaman relevan, foreground/background/terminated |
| Navigasi | Navbar Praktikan lima halaman, navbar Asisten lima halaman, pemindahan Map Praktikan ke halaman praktikum terkait |
| Kualitas | Seed idempotent, backup sebelum reset development, Security Rules, testing integrasi dan acceptance, pembaruan dokumentasi |

### 3.2 Out of scope

1. Reset data pada environment production.
2. Penyimpanan Secret Key Midtrans atau credential rahasia di aplikasi React Native, termasuk melalui `EXPO_PUBLIC_*`.
3. Pembayaran uang nyata di luar Midtrans Sandbox; kesiapan produksi payment gateway TBD.
4. Keputusan izin otomatis oleh AI. AI hanya informasi pendukung Asprak.
5. Backend Midtrans dan detail API AI yang belum dikonfirmasi pengajar. Bagian tersebut berstatus TBD.
6. Perubahan requirement Sprint 1–3 yang tidak tercantum pada PDF Sprint 4.
7. File referensi PDF tidak boleh diubah.

## 4. Perubahan Role

### 4.1 Ringkasan perubahan

| Perubahan | Keterangan |
|---|---|
| Role baru `aslab` | Aslab bertanggung jawab atas pengelolaan laboratorium dan distribusi anggota. |
| Istilah `asisten` menjadi `asprak` | `asisten` pada Sprint 1–3 dipetakan ke `asprak` pada Sprint 4. Perubahan nama harus konsisten pada tipe, koleksi, UI, dan Security Rules; migrasi data mengikuti kontrak yang disepakati. |
| Kewenangan administratif pindah ke Aslab | CRUD kelas, edit/hapus kelas, pengelolaan peserta, distribusi anggota, dan pengelolaan laboratorium bukan kewenangan Asprak. Kewenangan tersebut berada di sisi Aslab. Ketentuan ini menggantikan pembagian kelas pada Sprint 2 untuk pekerjaan Sprint 4. |
| Asprak tetap operasional | Asprak hanya bertanggung jawab atas operasional kegiatan praktikum: sesi, presensi, dan pemeriksaan izin. |
| Praktikan tetap | Praktikan mengajukan izin, melakukan presensi, melihat denda, dan membayar denda. |

### 4.2 Role matrix

| Kemampuan | Praktikan | Asprak | Aslab |
|---|---|---|---|
| Melihat jadwal dan sesi yang terkait | Ya | Ya | Ya, seluruh laboratorium yang dikelola |
| Melakukan presensi QR/lokasi | Ya | Tidak | Tidak |
| Mengajukan izin | Ya | Tidak | Tidak |
| Melihat keputusan izin sendiri | Ya | Tidak | Tidak |
| Memeriksa dan memutuskan izin | Tidak | Ya | Tidak |
| Melihat hasil analisis sentimen AI | Tidak | Ya, sebagai informasi pendukung | TBD, mengikuti kebutuhan dashboard |
| Membuka dan menutup sesi | Tidak | Ya | Tidak |
| Memantau dan mengelola presensi | Tidak | Ya | Tidak |
| Melihat daftar tagihan dan membayar denda | Ya, milik sendiri | Tidak | Tidak |
| Melihat riwayat keuangan hasil denda | Tidak | Tidak | Ya |
| CRUD laboratorium | Tidak | Tidak | Ya |
| CRUD kelas, edit/hapus kelas | Tidak | Tidak | Ya |
| Bulk/single insert laboratorium, praktikan, Asprak | Tidak | Tidak | Ya |
| Distribusi dan perpindahan anggota antarlaboratorium | Tidak | Tidak | Ya |
| Dashboard seluruh laboratorium | Tidak | Tidak | Ya |
| Mengatur koordinat, radius, cakupan lokasi, batas keterlambatan | Tidak | Tidak | Ya |
| Mengatur konfigurasi jam minimal/maksimal sesi | TBD | TBD | TBD |
| Mengubah status kehadiran menjadi hadir | Tidak | Tidak | Tidak |
| Mengubah status kehadiran karena pembayaran | Tidak | Tidak | Tidak |

Catatan: sel "Tidak" berarti aksi tidak tersedia di UI dan wajib ditolak Security Rules. Sel "TBD" tidak boleh diimplementasikan sebelum disepakati PM.

## 5. Functional Requirements

Kode `FR-S4-xx` dipakai sebagai acuan requirement Sprint 4. Pemetaan ke task ada pada kolom Task.

| ID | Requirement | Prioritas | Task terkait |
|---|---|---|---|
| FR-S4-01 | Sistem menyediakan role Aslab beserta hak akses, tampilan, dan route khusus Aslab | P0 | ANG-03, ANG-08, DHR-01 |
| FR-S4-02 | Aslab dapat melakukan CRUD data laboratorium, termasuk bulk/single insert berdasarkan mata kuliah | P0 | DHR-02, DHR-03 |
| FR-S4-03 | Aslab dapat melakukan bulk/single insert data praktikan dan Asprak ke laboratorium tertentu | P0 | DHR-04, DHR-05 |
| FR-S4-04 | Sistem menyediakan template unduhan untuk setiap fitur bulk insert | P0 | DHR-06 |
| FR-S4-05 | Aslab dapat meninjau hasil bulk insert dan melakukan accept, deny, update, serta melengkapi data kosong | P0 | DHR-07 |
| FR-S4-06 | Aslab dapat memindahkan praktikan dan Asprak antarlaboratorium | P0 | DHR-08 |
| FR-S4-07 | Aslab dapat mengelola informasi laboratorium: nama, lokasi, koordinat, radius, cakupan lokasi presensi, dan batas keterlambatan | P0 | DHR-09, DHR-10 |
| FR-S4-08 | Aslab memiliki dashboard yang menampilkan jumlah laboratorium dan praktikan, status kegiatan, jadwal berlangsung/berikutnya, riwayat kegiatan, dan riwayat keuangan | P0 | DHR-11 sampai DHR-17 |
| FR-S4-09 | Sistem menyediakan seed Aslab, Asprak, dan Praktikan yang idempotent serta konsisten dengan Firebase Authentication dan profil Firestore | P0 | ANG-06 |
| FR-S4-10 | Sistem memvalidasi NIM sebagai String tepat 14 digit angka | P0 | ANG-07 |
| FR-S4-11 | PM melakukan backup Firestore sebelum reset data dummy development dan tidak melakukan reset pada production | P0 | ANG-09 |
| FR-S4-12 | Asprak dapat melihat kelas, jadwal, dan sesi yang menjadi tanggung jawabnya, lalu membuka dan menutup sesi | P0 | NSW-01 sampai NSW-03 |
| FR-S4-13 | Perubahan status sesi tersinkronisasi real-time dengan aplikasi Praktikan | P0 | NSW-04 |
| FR-S4-14 | Asprak dapat memantau dan mengelola presensi praktikan | P0 | NSW-05 |
| FR-S4-15 | Asprak dapat memeriksa pengajuan izin, melihat alasan dan hasil analisis sentimen AI, lalu menerima atau menolak | P0 | NSW-06 sampai NSW-08, DVN-19 sampai DVN-23 |
| FR-S4-16 | Status pengajuan izin tersinkronisasi real-time dengan aplikasi Praktikan | P0 | NSW-09 |
| FR-S4-17 | Izin yang disetujui menghasilkan `excused absence` dan pembebasan denda keterlambatan tanpa mengubah status kehadiran menjadi hadir | P0 | NSW-10, DVN-18 |
| FR-S4-18 | Sistem menghitung keterlambatan berdasarkan waktu presensi dan grace period | P0 | DVN-01 |
| FR-S4-19 | Sistem membuat tagihan denda otomatis, satu tagihan untuk satu kejadian keterlambatan | P0 | DVN-02, DVN-03 |
| FR-S4-20 | Data tagihan terhubung dengan praktikan, sesi, catatan presensi, dan laboratorium | P0 | DVN-04 |
| FR-S4-21 | Data tagihan dan pembayaran memakai struktur Firestore bersama dan dapat dibaca Dashboard Aslab | P0 | DVN-05, DHR-16 |
| FR-S4-22 | Midtrans diintegrasikan pada Sandbox melalui backend, termasuk pembuatan transaksi, callback/webhook, dan verifikasi | P0 | DVN-06 sampai DVN-08 |
| FR-S4-23 | Sistem mengelola status transaksi `pending`, `success`, dan `failed`, lalu memperbarui status tagihan dari hasil verifikasi backend | P0 | DVN-09, DVN-10 |
| FR-S4-24 | Praktikan dapat melihat daftar tagihan, rincian nominal denda, riwayat transaksi, dan riwayat pembayaran yang bertahan setelah aplikasi dibuka ulang | P0 | DVN-11 sampai DVN-13 |
| FR-S4-25 | Pembayaran denda tidak mengubah status kehadiran Praktikan | P0 | DVN-17 |
| FR-S4-26 | Sistem mengirim notifikasi tagihan baru, pembayaran berhasil, dan pembayaran gagal/membutuhkan penyelesaian | P0 | DVN-14 sampai DVN-16 |
| FR-S4-27 | Tombol notifikasi dapat diklik dan mengarah ke halaman relevan sesuai jenis notifikasi | P1 | DVN-24, DVN-25 |
| FR-S4-28 | Notifikasi berjalan pada kondisi foreground, background, dan terminated | P1 | DVN-27 |
| FR-S4-29 | Data transaksi dan status pembayaran tersinkronisasi dengan Firestore | P1 | DVN-26 |
| FR-S4-30 | Navbar Praktikan memiliki lima halaman: Jadwal, Riwayat, Presensi QR, Izin, Denda | P1 | NSW-11 |
| FR-S4-31 | Navbar Asisten memiliki lima halaman: Jadwal, Kelas, Map, Rekap, Izin | P1 | NSW-12 |
| FR-S4-32 | Alur pengajuan izin dari sesi tertentu langsung membuka form dengan sesi sudah terpilih | P1 | NSW-13 |
| FR-S4-33 | Sistem menerapkan aturan jam minimal dan maksimal sesi praktikum dapat dibuka sesuai konfigurasi | P1 | NSW-14, NSW-15, DHR-18, DHR-19 |
| FR-S4-34 | Kategori pengajuan izin terdiri dari izin, alpha, dan sakit | P1 | NSW-16 |
| FR-S4-35 | Halaman Map Praktikan dipindahkan dari halaman utama ke halaman praktikum terkait dan menampilkan lokasi laboratorium yang sesuai | P1 | NSW-17, NSW-18, ANG-15 |
| FR-S4-36 | Tampilan notifikasi Android dan logo PraktikumKU pada notifikasi disempurnakan | P2 | DVN-28, DVN-29 |
| FR-S4-37 | Visual dan konsistensi UI modul Aslab, Asprak, Praktikan, denda, pembayaran, dan notifikasi disempurnakan | P2 | NSW-19, DVN-30 |
| FR-S4-38 | Dokumentasi sprint, PRD, desain, struktur database, relasi data, dan alur aplikasi diperbarui | P0–P1 | ANG-01, ANG-02, ANG-13, ANG-14, ANG-18 |
| FR-S4-39 | Reset password setiap akun dikoordinasikan dengan developer Auth | P2 | ANG-17 |
| FR-S4-40 | Hak akses divalidasi di Firestore Security Rules dan diuji bersama | P0 | ANG-08, DHR-20 |

## 6. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-S4-01 | Seluruh fitur terintegrasi dengan Firebase Authentication dan Cloud Firestore dari Sprint 2 serta fitur lokasi/QR/notifikasi Sprint 3 yang masih relevan. |
| NFR-S4-02 | Data laboratorium, kelas, sesi, presensi, izin, tagihan, dan pembayaran memakai satu sumber kebenaran Firestore. Tidak boleh ada sumber data keuangan terpisah. |
| NFR-S4-03 | Setiap layar yang membaca data memiliki state memuat, kosong, dan gagal. Tidak ada loading palsu. |
| NFR-S4-04 | Hak akses divalidasi di Firestore Security Rules, bukan hanya melalui navigasi atau tombol tersembunyi. |
| NFR-S4-05 | Secret Key Midtrans, server key, credential AI rahasia, dan token sensitif tidak boleh ditulis di kode sumber atau dibundel ke aplikasi React Native. |
| NFR-S4-06 | Operasi pembuatan tagihan dan pencatatan pembayaran harus idempotent untuk mencegah tagihan atau transaksi ganda. |
| NFR-S4-07 | Semua mutasi mengembalikan hasil `{ ok, pesan }`; pesan kesalahan berbahasa Indonesia dan mudah dipahami. |
| NFR-S4-08 | Kegagalan jaringan, AI, Midtrans, GPS, kamera, dan notifikasi harus ditangani tanpa membuat aplikasi berhenti atau menyimpan status palsu. |
| NFR-S4-09 | Target sentuh minimal 44x44 pt, safe area, dan flexbox tetap berlaku; status tidak hanya dibedakan melalui warna. |
| NFR-S4-10 | NIM disimpan sebagai String dan divalidasi tepat 14 digit angka sebelum data disimpan. |
| NFR-S4-11 | Seed data harus dapat dijalankan ulang tanpa duplikasi dan menjaga konsistensi antara Firebase Authentication dan dokumen profil Firestore. |
| NFR-S4-12 | Backup Firestore wajib dilakukan sebelum reset data dummy development. Reset dilarang pada production. |
| NFR-S4-13 | `npx tsc --noEmit` dan `npx expo lint` harus hijau sebelum PR digabungkan. |
| NFR-S4-14 | Perubahan dependency dan konfigurasi diumumkan ke tim serta dijelaskan pada deskripsi PR. |
| NFR-S4-15 | Fitur diuji pada Android dan iOS; Web diuji sejauh didukung library dan browser. Keterbatasan platform wajib dicatat. |
| NFR-S4-16 | Hasil analisis AI wajib diberi label sebagai informasi pendukung, bukan keputusan otomatis. |
| NFR-S4-17 | Tidak boleh ada requirement, field, atau endpoint yang dikarang ketika referensi belum tersedia; gunakan status TBD. |

## 7. Business Rules

| ID | Aturan |
|---|---|
| BR-S4-01 | Aslab bertanggung jawab atas pengelolaan laboratorium dan distribusi anggota. |
| BR-S4-02 | Asprak bertanggung jawab atas operasional sesi, presensi, dan pemeriksaan izin. |
| BR-S4-03 | CRUD kelas, edit/hapus kelas, pengelolaan peserta, distribusi anggota, dan pengelolaan laboratorium bukan kewenangan Asprak. |
| BR-S4-04 | Satu akun hanya memiliki satu role: `praktikan`, `asprak`, atau `aslab`. |
| BR-S4-05 | Hak akses wajib ditegakkan di Firestore Security Rules, bukan hanya di UI. |
| BR-S4-06 | NIM menggunakan tipe data String dengan validasi tepat 14 digit angka. |
| BR-S4-07 | Data seed harus idempotent. Menjalankan seed berulang tidak boleh membuat akun atau dokumen ganda. |
| BR-S4-08 | Backup Firestore wajib dilakukan sebelum reset data dummy pada environment development. |
| BR-S4-09 | Reset data tidak boleh dilakukan pada environment production. |
| BR-S4-10 | Presensi hanya tercatat bila sesi dibuka dan seluruh validasi Sprint 3 (QR, lokasi, peserta, non-duplikat) terpenuhi. |
| BR-S4-11 | Keterlambatan dihitung dari selisih waktu presensi terhadap batas waktu sesi dan grace period yang dikonfigurasi. |
| BR-S4-12 | Satu kejadian keterlambatan hanya menghasilkan satu tagihan denda. Percobaan ulang proses tidak boleh membuat tagihan kedua. |
| BR-S4-13 | Tagihan denda harus terhubung dengan praktikan, sesi, catatan presensi, dan laboratorium. |
| BR-S4-14 | Izin yang disetujui berstatus `excused absence` dan dibebaskan dari denda keterlambatan. |
| BR-S4-15 | Izin yang disetujui tidak mengubah status kehadiran menjadi hadir. |
| BR-S4-16 | Izin yang disetujui tidak boleh menghasilkan tagihan denda baru untuk sesi terkait. |
| BR-S4-17 | Pembayaran denda tidak mengubah status kehadiran Praktikan. |
| BR-S4-18 | Status tagihan mengikuti hasil verifikasi pembayaran dari backend, bukan status dari sisi client. |
| BR-S4-19 | Status transaksi pembayaran hanya `pending`, `success`, dan `failed`; status lain yang diberikan payment gateway harus dipetakan sesuai kontrak backend yang disepakati. |
| BR-S4-20 | Midtrans hanya diintegrasikan pada lingkungan Sandbox untuk Sprint 4. |
| BR-S4-21 | Secret Key Midtrans tidak boleh berada di aplikasi React Native. Integrasi memakai alur client–backend–payment gateway. |
| BR-S4-22 | Hasil analisis AI hanya informasi pendukung keputusan Asprak, bukan keputusan otomatis untuk menerima atau menolak izin. |
| BR-S4-23 | Kegagalan layanan AI tidak boleh menghambat proses pengajuan izin. Pengajuan tetap tersimpan dengan status klasifikasi gagal atau menunggu. |
| BR-S4-24 | Penggunaan `EXPO_PUBLIC_AI_API_KEY` di aplikasi dicatat sebagai security gap. Bila API memakai credential rahasia, pemanggilan harus melalui backend. |
| BR-S4-25 | Jam minimal dan maksimal sesi praktikum dapat dibuka mengikuti konfigurasi yang disepakati dan divalidasi terhadap Firestore. |
| BR-S4-26 | Kategori pengajuan izin hanya izin, alpha, dan sakit. |
| BR-S4-27 | Asprak tidak dapat memindahkan peserta, mengubah kelas, atau mengelola laboratorium. |
| BR-S4-28 | Aslab dapat memindahkan praktikan dan Asprak antarlaboratorium tanpa membuat duplikasi keanggotaan. |
| BR-S4-29 | Bulk insert harus melalui halaman review; data yang ditolak atau belum lengkap tidak boleh masuk ke koleksi utama. |
| BR-S4-30 | Notifikasi tidak boleh dikirim berulang untuk kejadian yang sama. Kegagalan notifikasi tidak boleh membatalkan perubahan data utama. |

## 8. Alur Utama

### 8.1 Alur Aslab: pengelolaan laboratorium dan anggota

```text
Aslab login
    |
    v
Dashboard Aslab
    |
    +--> CRUD laboratorium (nama, lokasi, koordinat, radius, batas keterlambatan)
    |
    +--> Bulk/single insert laboratorium berdasarkan mata kuliah
    |         |
    |         v
    |    Unduh template -> unggah -> review accept/deny/update -> simpan
    |
    +--> Bulk/single insert praktikan dan Asprak ke laboratorium
    |         |
    |         v
    |    Review hasil -> lengkapi data kosong -> simpan
    |
    +--> Pindahkan praktikan/Asprak antarlaboratorium
    |
    v
Pantau status kegiatan, jadwal, riwayat kegiatan, dan riwayat keuangan
```

### 8.2 Alur Asprak: sesi, presensi, dan izin

```text
Asprak login
    |
    v
Daftar kelas, jadwal, dan sesi tanggung jawab
    |
    +--> Buka sesi (validasi jam minimal/maksimal)
    |         |
    |         v
    |    Status sesi real-time terlihat oleh Praktikan
    |
    +--> Pantau dan kelola presensi
    |
    +--> Periksa pengajuan izin
              |
              v
         Lihat alasan + hasil analisis sentimen AI
              |
              v
         Terima / Tolak
              |
              v
         Status izin real-time terlihat oleh Praktikan
```

### 8.3 Alur Praktikan: presensi dan izin

```text
Praktikan login
    |
    +--> Presensi QR/lokasi (Sprint 3)
    |         |
    |         v
    |    Waktu presensi tercatat
    |         |
    |         v
    |    Sistem menghitung keterlambatan dan grace period
    |         |
    |         +--> Tepat waktu: tidak ada tagihan
    |         |
    |         +--> Terlambat: satu tagihan denda dibuat
    |
    +--> Ajukan izin (pilih sesi -> form terisi sesi -> kategori izin/alpha/sakit)
              |
              v
         Alasan dikirim ke API AI (bila tersedia)
              |
              v
         Hasil AI disimpan sebagai informasi pendukung
              |
              v
         Asprak memutuskan
              |
              +--> Disetujui: excused absence, bebas denda, bukan hadir
              |
              +--> Ditolak: status izin ditolak, aturan presensi/denda tetap berlaku
```

### 8.4 Alur denda dan pembayaran

```text
Kejadian keterlambatan
    |
    v
Hitung keterlambatan (waktu presensi + grace period)
    |
    v
Buat tagihan (idempotent: satu kejadian = satu tagihan)
    |
    v
Praktikan melihat daftar tagihan dan rincian nominal
    |
    v
Praktikan memulai pembayaran
    |
    v
Aplikasi -> backend -> Midtrans Sandbox
    |
    v
Backend menerima callback/webhook dan memverifikasi transaksi
    |
    v
Backend memperbarui status transaksi dan status tagihan
    |
    v
Praktikan menerima notifikasi dan melihat riwayat pembayaran
    |
    v
Status kehadiran tidak berubah
```

### 8.5 Alur AI analisis izin

```text
Praktikan mengirim alasan izin
    |
    v
Pengajuan izin disimpan di Firestore
    |
    v
Alasan dikirim ke API AI melalui backend (bila credential rahasia)
    |
    +--> Respons berhasil: simpan hasil analisis sentimen
    |
    +--> Gangguan/timeout: tandai gagal, pengajuan tetap tersimpan
    |
    v
Asprak melihat alasan dan hasil AI sebagai informasi pendukung
    |
    v
Asprak memutuskan secara manual
```

### 8.6 Alur notifikasi

```text
Kejadian: tagihan baru / pembayaran berhasil / pembayaran gagal
    |
    v
Sistem menentukan penerima
    |
    v
Notifikasi dikirim
    |
    v
Pengguna menekan notifikasi
    |
    v
Aplikasi membuka halaman relevan: denda, riwayat pembayaran, atau detail tagihan
```

## 9. Data dan Integrasi

### 9.1 Prinsip data

1. Firebase Authentication tetap menjadi sumber identitas.
2. Cloud Firestore menjadi sumber data profil, laboratorium, kelas, sesi, presensi, izin, tagihan, pembayaran, dan notifikasi.
3. Schema dan relasi data wajib disepakati Anggi dan Dehar pada hari pertama.
4. Dehar tidak perlu menunggu seluruh database selesai; pengembangan dimulai setelah kontrak data minimum disepakati.
5. Data tagihan dan pembayaran wajib menyimpan identitas laboratorium agar Dashboard Aslab dapat membacanya tanpa sumber keuangan terpisah.
6. Nama field tetap bahasa Indonesia agar UI tidak memerlukan pemetaan tambahan.

### 9.2 Usulan struktur Firestore

Struktur berikut adalah usulan yang wajib dikonfirmasi dan disepakati sebelum implementasi. Field yang belum diputuskan ditandai TBD.

```text
users/{uid}
  nama: string
  nomorInduk: string            // NIM praktikan: tepat 14 digit angka
  peran: "praktikan" | "asprak" | "aslab"
  laboratoriumIds: string[]     // TBD: perlu disepakati untuk Aslab/Asprak
  dibuatPada: Timestamp

laboratorium/{labId}
  nama: string
  lokasi: string
  latitude: number
  longitude: number
  radius: number
  cakupanLokasi: TBD            // perlu disepakati
  batasKeterlambatanMenit: number
  dibuatPada: Timestamp
  diperbaruiPada: Timestamp

mataKuliah/{mataKuliahId}
  nama: string
  kode: string                  // TBD: format kode
  dibuatPada: Timestamp

kelas/{kelasId}
  nama: string
  mataKuliahId: string
  laboratoriumId: string
  aslabId: string
  asprakIds: string[]
  pesertaIds: string[]
  dibuatPada: Timestamp

sesi/{sesiId}
  kelasId: string
  laboratoriumId: string
  asprakId: string
  hari: string
  tanggal: string
  jamMulai: string
  jamSelesai: string
  status: "belum-dibuka" | "dibuka" | "ditutup"
  dibukaPada?: Timestamp
  ditutupPada?: Timestamp
  dibuatPada: Timestamp

sesi/{sesiId}/presensi/{uid}
  praktikanId: string
  waktu: Timestamp
  statusKehadiran: "hadir" | "terlambat" | "excused-absence" | "alpha"   // usulan
  keterlambatanMenit?: number
  sumberDendaId?: string        // TBD: relasi ke tagihan

sesi/{sesiId}/izin/{uid}
  praktikanId: string
  alasan: string
  kategori: "izin" | "alpha" | "sakit"
  status: "menunggu" | "disetujui" | "ditolak"
  hasilAnalisisAi?: {
    label: string
    skor?: number
    ringkasan?: string
    model?: string
    dianalisisPada: Timestamp
  }
  klasifikasiStatus: "menunggu" | "selesai" | "gagal"
  dibuatPada: Timestamp
  diputuskanPada?: Timestamp
  diputuskanOleh?: string

tagihan/{tagihanId}
  praktikanId: string
  sesiId: string
  presensiId: string
  laboratoriumId: string
  nominal: number
  alasan: string
  status: "belum-dibayar" | "pending" | "dibayar" | "gagal"   // usulan
  dibuatPada: Timestamp
  diperbaruiPada: Timestamp

pembayaran/{pembayaranId}
  tagihanId: string
  orderId: string
  praktikanId: string
  laboratoriumId: string
  nominal: number
  status: "pending" | "success" | "failed"
  metode?: string
  midtransTransactionId?: string
  dibuatPada: Timestamp
  diverifikasiPada?: Timestamp

notifikasi/{notifikasiId}
  penerimaId: string
  tipe: "tagihan-baru" | "pembayaran-berhasil" | "pembayaran-gagal"
  referensiId: string
  judul: string
  isi: string
  dibaca: boolean
  dibuatPada: Timestamp
```

Catatan struktur:
- Status kehadiran `excused-absence` dan `alpha` adalah usulan untuk mendukung BR-S4-14 dan BR-S4-15; nilai final wajib disepakati bersama.
- Status tagihan `belum-dibayar`, `pending`, `dibayar`, dan `gagal` adalah usulan; pemetaan final terhadap status Midtrans wajib disepakati bersama backend.
- Field hasil AI yang tidak tercantum pada PDF wajib menunggu konfirmasi format respons dari pengajar.
- Field `laboratoriumIds` pada `users` belum ditentukan referensi; status TBD.

### 9.3 Relasi data

```text
users(aslab) 1 ---- n laboratorium
users(asprak) 1 ---- n kelas
laboratorium 1 ---- n kelas
mataKuliah 1 ---- n kelas
kelas 1 ---- n sesi
sesi 1 ---- n presensi
sesi 1 ---- n izin
presensi 1 ---- 0..1 tagihan
tagihan 1 ---- n pembayaran
tagihan/pembayaran n ---- 1 laboratorium
notifikasi n ---- 1 users
```

Aturan relasi:
1. `kelas.laboratoriumId` dan `sesi.laboratoriumId` harus menunjuk laboratorium yang sama.
2. `sesi.kelasId` tidak boleh dipindahkan setelah sesi dibuat.
3. `tagihan.laboratoriumId` wajib diisi dari sesi/laboratorium terkait.
4. `pembayaran.tagihanId` wajib menunjuk tagihan milik praktikan yang sama.
5. Dokumen presensi dan izin memakai `uid` praktikan sebagai ID dokumen agar unik per sesi.

### 9.4 Seed dan reset environment

| Langkah | Ketentuan |
|---|---|
| 1 | PM memverifikasi environment target adalah development, bukan production. |
| 2 | PM melakukan backup Firestore sebelum reset. |
| 3 | PM mereset data dummy development. |
| 4 | PM menjalankan seed Aslab, Asprak, dan Praktikan. |
| 5 | Seed memakai ID dokumen tetap atau penanda versi seed agar idempotent. |
| 6 | PM memverifikasi jumlah akun Firebase Authentication sama dengan dokumen profil Firestore. |
| 7 | Menjalankan seed ulang tidak boleh membuat akun atau dokumen ganda. |

Format penanda seed final TBD dan wajib disepakati bersama sebelum implementasi.

### 9.5 Security Rules

Matriks hak akses final wajib disepakati sebelum implementasi. Baseline yang harus diuji:

| Koleksi | Praktikan | Asprak | Aslab |
|---|---|---|---|
| `users` | Baca dan ubah profil sendiri tanpa mengubah role | Baca profil praktikan yang terkait untuk presensi/izin | Baca dan kelola profil anggota laboratorium yang dikelola, tanpa mengubah role sembarang |
| `laboratorium` | Baca laboratorium terkait | Baca laboratorium terkait | CRUD laboratorium yang dikelola |
| `kelas` | Baca kelas yang diikuti | Baca kelas yang diampu | CRUD kelas pada laboratorium yang dikelola |
| `sesi` | Baca sesi terkait | Baca dan ubah status sesi yang diampu | Baca sesi seluruh laboratorium yang dikelola |
| `presensi` | Create milik sendiri saat sesi dibuka; baca milik sendiri | Baca dan kelola presensi sesi yang diampu | Baca presensi laboratorium yang dikelola |
| `izin` | Create dan baca milik sendiri | Baca dan putuskan izin sesi yang diampu | Baca izin laboratorium yang dikelola (TBD) |
| `tagihan` | Baca tagihan milik sendiri | Tidak | Baca tagihan laboratorium yang dikelola |
| `pembayaran` | Baca pembayaran milik sendiri | Tidak | Baca pembayaran laboratorium yang dikelola |
| `notifikasi` | Baca notifikasi milik sendiri | Baca notifikasi milik sendiri | Baca notifikasi milik sendiri |

Aturan wajib:
1. Praktikan tidak dapat mengubah status izin, status presensi, tagihan, atau pembayaran.
2. Asprak tidak dapat mengubah kelas, laboratorium, atau keanggotaan.
3. Asprak tidak dapat mengubah sesi Asprak lain.
4. Aslab tidak dapat mengubah data di luar laboratorium yang dikelolanya.
5. Validasi status sesi dan kepemilikan dilakukan di server.
6. Validasi yang tidak dapat dilakukan Security Rules, seperti query lintas koleksi, dilakukan di lapisan data dan diuji.

### 9.6 Integrasi Midtrans

Alur wajib:

```text
React Native
    |
    | permintaan membuat transaksi (tanpa Secret Key)
    v
Backend (Firebase Cloud Functions atau server terpisah: TBD)
    |
    | membuat transaksi dengan Secret Key di server
    v
Midtrans Sandbox
    |
    | callback/webhook
    v
Backend memverifikasi transaksi
    |
    v
Backend memperbarui status transaksi dan tagihan di Firestore
    |
    v
React Native membaca status terbaru dari Firestore
```

Ketentuan:
1. Secret Key Midtrans tidak boleh disimpan di aplikasi React Native.
2. Backend Midtrans menunggu konfirmasi pengajar: Firebase Cloud Functions atau backend/server terpisah. Status TBD.
3. Endpoint backend, skema request/response, signature verification, dan mekanisme autentikasi wajib disepakati sebelum implementasi.
4. Callback/webhook membutuhkan endpoint HTTPS yang dapat diakses Midtrans. Mekanisme untuk development TBD.
5. Status tagihan hanya berubah setelah verifikasi backend.
6. Aplikasi tidak boleh menandai pembayaran berhasil berdasarkan respons client semata.
7. Kredensial Sandbox disimpan di environment backend, bukan di repository aplikasi.

### 9.7 Integrasi AI

Ketentuan:
1. API AI disediakan pengajar. Format layanan, endpoint, metode autentikasi, dan format respons belum dikonfirmasi. Status TBD.
2. Bila API memakai API key atau credential rahasia, pemanggilan harus melalui backend.
3. Penggunaan `EXPO_PUBLIC_AI_API_KEY` di aplikasi dicatat sebagai security gap dan tidak boleh dipakai untuk credential rahasia.
4. Bila pengajar memberikan file model, bukan API siap pakai, Devano harus mengimplementasikan preprocessing dan inference sesuai spesifikasi model. Detail TBD.
5. Hasil analisis disimpan bersama data pengajuan izin.
6. Kegagalan AI tidak boleh menghambat pengajuan izin.
7. Hasil AI hanya informasi pendukung Asprak.

### 9.8 Integrasi notifikasi

Ketentuan:
1. Notifikasi tagihan baru dipicu oleh pembuatan tagihan.
2. Notifikasi pembayaran berhasil dipicu oleh status transaksi `success` hasil verifikasi backend.
3. Notifikasi pembayaran gagal dipicu oleh status transaksi `failed` atau status yang membutuhkan penyelesaian lanjutan.
4. Notifikasi harus dapat diklik dan mengarah ke halaman relevan.
5. Notifikasi harus berjalan pada kondisi foreground, background, dan terminated sesuai dukungan platform.
6. Mekanisme pengiriman notifikasi dan kebutuhan layanan tambahan TBD, mengikuti keputusan Sprint 3 dan konfirmasi PM.

### 9.9 Dependency eksternal dan lingkungan

| Dependency | Keterangan | Status |
|---|---|---|
| Firebase Auth dan Firestore | Dilanjutkan dari Sprint 2 | Tersedia |
| Midtrans Sandbox | Client key dan server key, backend | Sebagian TBD |
| Backend payment | Cloud Functions atau server terpisah | TBD |
| API AI | Endpoint, auth, request, response | TBD |
| Model AI file | Bila diberikan pengajar | TBD |
| Push notification | Mekanisme dan layanan | TBD |
| Map/lokasi/QR | Dilanjutkan dari Sprint 3 | Tersedia, verifikasi platform |
| Developer Auth | Reset password | Koordinasi P2 |

## 10. Task Breakdown

### 10.1 Verifikasi jumlah task

Jumlah task induk dihitung langsung dari PDF `PEMBAGIAN JOBDESC SPRINT 4 — PRAKTIKUMKU.pdf`. Subtask tidak dihitung sebagai task induk.

| PIC | P0 | P1 | P2 | Total |
|---|---:|---:|---:|---:|
| Anggi | 12 | 4 | 2 | 18 |
| Dehar | 17 | 3 | 0 | 20 |
| Nashwa | 10 | 8 | 1 | 19 |
| Devano | 23 | 4 | 3 | 30 |
| **Total** | **62** | **19** | **6** | **87** |

Angka 87 terverifikasi dari penjumlahan task induk per anggota, bukan dari analisis sebelumnya. Seluruh deskripsi, PIC, dan prioritas di bawah mengikuti PDF. Subtask boleh ditambahkan saat implementasi tanpa mengubah tanggung jawab task induk.

### 10.2 Task Anggi (Project Manager)

PIC: **Anggi**. Fokus: Project Management, Firebase Architecture, Integration & Quality Assurance.

#### P0 — Prioritas Utama

| Task ID | Deskripsi | PIC | Prioritas | Dependency | Output yang diharapkan | Acceptance Criteria |
|---|---|---|---|---|---|---|
| ANG-01 | Menyiapkan dokumen `sprint-4.md` berisi target sprint, user requirement, pembagian pekerjaan, dependency, dan acceptance criteria | Anggi | P0 | PDF Jobdesc Sprint 4 | `docs/sprints/sprint-4.md` | Dokumen memuat seluruh bagian wajib; 87 task induk tercatat; setiap task memiliki PIC, prioritas, dependency, output, dan AC; tidak ada ID duplikat |
| ANG-02 | Memperbarui `PRD.md` sesuai kebutuhan Sprint 4 dan penambahan role Aslab | Anggi | P0 | ANG-01 | `docs/PRD.md` Sprint 1–4 | Requirement Sprint 1–3 tetap ada; requirement Sprint 4, role matrix, FR, BR, AC, alur, dependency, risiko, dan link sprint-4 ditambahkan; judul mencakup Sprint 1–4 |
| ANG-03 | Menentukan dan menyepakati struktur role serta hak akses pengguna (Praktikan, Asprak, dan Aslab) bersama Dehar | Anggi | P0 | ANG-01 | Matriks role dan hak akses | Tiga role terdefinisi; setiap kemampuan memiliki izin/tolak; Asprak tidak memiliki kewenangan administratif; disepakati bersama Dehar |
| ANG-04 | Menyusun schema Firestore dan relasi data bersama Dehar | Anggi | P0 | ANG-03 | Schema dan diagram relasi | Seluruh koleksi Sprint 4 tercantum; relasi laboratorium, kelas, sesi, presensi, izin, tagihan, dan pembayaran jelas; disepakati bersama Dehar |
| ANG-05 | Menentukan struktur collection, field, tipe data, dan relasi antarcollection, termasuk memastikan data tagihan dan pembayaran menyimpan identitas laboratorium agar dapat digunakan Dashboard Aslab | Anggi | P0 | ANG-04 | Kontrak data Firestore | Setiap field memiliki tipe; `laboratoriumId` ada pada tagihan dan pembayaran; Dashboard Aslab dapat membaca data tanpa sumber terpisah |
| ANG-06 | Menyiapkan data seed untuk role Aslab, Asprak, dan Praktikan; seed dapat dijalankan ulang tanpa duplikasi serta menjaga konsistensi Firebase Authentication dan dokumen profil Firestore | Anggi | P0 | ANG-04, ANG-05 | Data seed idempotent | Akun dan profil ketiga role tersedia; seed ulang tidak membuat duplikat; jumlah Auth dan profil konsisten; NIM valid 14 digit |
| ANG-07 | Memastikan NIM menggunakan tipe data String dengan validasi tepat 14 digit angka | Anggi | P0 | ANG-05 | Aturan tipe dan validasi NIM | NIM disimpan sebagai String; nilai bukan 14 digit ditolak; validasi diterapkan sebelum data disimpan |
| ANG-08 | Menentukan matriks hak akses setiap role sebagai dasar Firestore Security Rules; memastikan hak akses divalidasi di Firestore, bukan hanya melalui pembatasan navigasi aplikasi; melakukan review dan pengujian Security Rules bersama Dehar | Anggi | P0 | ANG-03, ANG-05 | Matriks akses dan hasil review rules | Setiap koleksi memiliki aturan baca/tulis per role; akses tanpa hak ditolak di Firestore; pengujian bersama Dehar tercatat |
| ANG-09 | Melakukan backup data Firestore terlebih dahulu, kemudian mereset data dummy pada environment development sebelum memasukkan data seed Sprint 4; reset tidak boleh dilakukan pada environment production | Anggi | P0 | ANG-06 | Bukti backup dan catatan reset development | Backup tersedia sebelum reset; environment target terverifikasi development; production tidak disentuh; seed berhasil dimuat setelah reset |
| ANG-10 | Mengoordinasikan integrasi antarprogrammer dan memastikan kontrak data setiap modul konsisten | Anggi | P0 | ANG-03, ANG-04, ANG-05 | Catatan koordinasi dan keputusan kontrak data | Tidak ada perbedaan schema antar modul; perubahan kontrak dicatat dan diumumkan; integrasi antarprogrammer berjalan |
| ANG-11 | Memastikan seluruh user requirement Sprint 4 memiliki PIC, acceptance criteria, dan status pengerjaan | Anggi | P0 | ANG-01 | Daftar requirement dengan PIC, AC, dan status | 87 task induk memiliki PIC dan AC; status pengerjaan dapat dilacak; tidak ada requirement tanpa PIC |
| ANG-12 | Memantau progres seluruh anggota serta melakukan integration testing dan acceptance testing terhadap keseluruhan alur pengguna | Anggi | P0 | ANG-01 sampai ANG-11 | Laporan progres dan hasil integration/acceptance test | Seluruh alur utama diuji; AC Sprint 4 diperiksa; bug kritis tercatat dan ditindaklanjuti; hasil testing terdokumentasi |

#### P1 — Prioritas Menengah

| Task ID | Deskripsi | PIC | Prioritas | Dependency | Output yang diharapkan | Acceptance Criteria |
|---|---|---|---|---|---|---|
| ANG-13 | Memperbarui `designs.md` sesuai perubahan role, struktur halaman, dan navigasi aplikasi | Anggi | P1 | ANG-02, ANG-03 | Dokumen desain yang diperbarui | Role Aslab dan navigasi lima halaman terdokumentasi; nama berkas mengikuti referensi `designs.md`; ketidaksesuaian dengan `docs/design.md` dicatat TBD |
| ANG-14 | Memperbarui dokumentasi struktur database, relasi data, dan alur aplikasi | Anggi | P1 | ANG-04, ANG-05 | Dokumentasi database dan alur | Dokumen sesuai schema final; relasi dan alur Sprint 4 tercatat; tidak ada field yatim |
| ANG-15 | Mengoordinasikan handover implementasi Map Praktikan dari Sprint 3 kepada Nashwa; Nashwa menjadi PIC implementasi dan Anggi bertanggung jawab atas transfer informasi teknis | Anggi | P1 | ANG-14 | Catatan handover teknis | Nashwa menerima kontrak data, lokasi berkas, dan batasan implementasi; PIC implementasi tercatat; tidak ada informasi teknis yang hilang |
| ANG-16 | Memastikan pembagian navigasi, fitur, dan hak akses antara Praktikan, Asprak, dan Aslab sudah konsisten | Anggi | P1 | ANG-03, ANG-13, ANG-14 | Checklist konsistensi role dan navigasi | Navigasi lima halaman sesuai role; fitur tidak melampaui kewenangan; hak akses konsisten dengan Security Rules |

#### P2 — Prioritas Rendah

| Task ID | Deskripsi | PIC | Prioritas | Dependency | Output yang diharapkan | Acceptance Criteria |
|---|---|---|---|---|---|---|
| ANG-17 | Mengoordinasikan implementasi fitur reset password untuk setiap akun bersama developer Auth | Anggi | P2 | Developer Auth (TBD) | Catatan koordinasi reset password | Kebutuhan reset password tercatat; penanggung jawab dan mekanisme disepakati; status implementasi tercatat |
| ANG-18 | Memastikan dokumentasi teknis dan dokumentasi proyek diperbarui setelah Sprint 4 selesai | Anggi | P2 | Seluruh task Sprint 4 | Dokumentasi teknis dan proyek final | PRD, sprint-4, database, desain, dan README relevan diperbarui; tidak ada dokumentasi yang menyatakan scope lama secara bertentangan |

### 10.3 Task Dehar (Programmer 1)

PIC: **Dehar**. Fokus: Aslab Management, Core Database & Laboratory Administration. PIC utama modul Aslab.

#### P0 — Prioritas Utama

| Task ID | Deskripsi | PIC | Prioritas | Dependency | Output yang diharapkan | Acceptance Criteria |
|---|---|---|---|---|---|---|
| DHR-01 | Mengimplementasikan role Aslab beserta hak akses dan tampilan khusus Aslab | Dehar | P0 | ANG-03, ANG-08 | Role Aslab dan tampilan khusus | Aslab dapat login dan masuk ke beranda Aslab; menu terbatas sesuai role; route role lain ditolak; akses divalidasi Security Rules |
| DHR-02 | Membuat fitur CRUD data laboratorium | Dehar | P0 | ANG-05, DHR-01 | Modul CRUD laboratorium | Aslab dapat membuat, membaca, mengubah, dan menghapus laboratorium; validasi input berjalan; perubahan tersimpan di Firestore |
| DHR-03 | Membuat fitur bulk/single insert laboratorium berdasarkan mata kuliah | Dehar | P0 | DHR-02 | Fitur insert laboratorium | Single insert berhasil; bulk insert memproses banyak baris; data terhubung ke mata kuliah; baris tidak valid ditolak |
| DHR-04 | Membuat fitur bulk/single insert data praktikan ke laboratorium tertentu | Dehar | P0 | DHR-02, ANG-06 | Fitur insert praktikan | Praktikan dapat ditambahkan satu atau banyak sekaligus; NIM divalidasi; duplikasi ditolak; keanggotaan tersimpan |
| DHR-05 | Membuat fitur bulk/single insert data Asprak ke laboratorium tertentu | Dehar | P0 | DHR-02, ANG-06 | Fitur insert Asprak | Asprak dapat ditambahkan satu atau banyak sekaligus; role divalidasi; duplikasi ditolak; keanggotaan tersimpan |
| DHR-06 | Menyediakan downloadable file template untuk masing-masing fitur bulk insert | Dehar | P0 | DHR-03, DHR-04, DHR-05 | Template unduhan | Tersedia template laboratorium, praktikan, dan Asprak; kolom sesuai kontrak; file dapat diunduh dan diunggah kembali |
| DHR-07 | Membuat halaman review hasil bulk insert dalam bentuk list/scroll view yang memungkinkan Aslab melakukan accept, deny, update, dan melengkapi data yang masih kosong | Dehar | P0 | DHR-03 sampai DHR-06 | Halaman review bulk insert | Setiap baris dapat diterima, ditolak, diubah, atau dilengkapi; data kosong ditandai; hanya baris diterima yang disimpan; ringkasan hasil tampil |
| DHR-08 | Membuat fitur perpindahan praktikan dan Asprak antarlaboratorium | Dehar | P0 | DHR-04, DHR-05, DHR-07 | Fitur perpindahan anggota | Anggota dapat dipindah ke laboratorium tujuan; keanggotaan lama diperbarui; tidak ada duplikasi; riwayat perpindahan TBD |
| DHR-09 | Membuat pengelolaan informasi laboratorium, meliputi nama, lokasi, koordinat, dan radius validasi presensi | Dehar | P0 | DHR-02, ANG-05 | Form informasi laboratorium | Nama, lokasi, koordinat, dan radius dapat diubah; koordinat valid; radius tersimpan; perubahan terbaca modul presensi |
| DHR-10 | Membuat konfigurasi cakupan lokasi presensi dan batas keterlambatan waktu | Dehar | P0 | DHR-09, ANG-05 | Konfigurasi presensi dan keterlambatan | Cakupan lokasi dapat diatur; batas keterlambatan tersimpan; konfigurasi terbaca modul presensi dan denda; validasi input berjalan |
| DHR-11 | Membuat Dashboard Aslab untuk memantau seluruh laboratorium yang dikelola | Dehar | P0 | DHR-01, DHR-02 | Dashboard Aslab | Dashboard hanya menampilkan laboratorium yang dikelola; data dimuat dari Firestore; state memuat, kosong, dan gagal tersedia |
| DHR-12 | Menampilkan jumlah laboratorium dan praktikan pada dashboard | Dehar | P0 | DHR-11 | Ringkasan jumlah | Jumlah laboratorium dan praktikan sesuai data; angka diperbarui saat data berubah; tidak menghitung duplikat |
| DHR-13 | Menampilkan status kegiatan praktikum pada setiap laboratorium beserta informasi lokasi dan waktu pelaksanaan | Dehar | P0 | DHR-11, DHR-09 | Status kegiatan per laboratorium | Status kegiatan tampil per laboratorium; lokasi dan waktu tampil; status sesuai data sesi |
| DHR-14 | Menampilkan jadwal praktikum yang sedang berlangsung maupun yang akan datang | Dehar | P0 | DHR-11 | Jadwal berlangsung dan berikutnya | Jadwal berlangsung dan berikutnya tampil; data dari Firestore; tidak menampilkan jadwal laboratorium lain |
| DHR-15 | Menampilkan riwayat kegiatan laboratorium | Dehar | P0 | DHR-11 | Riwayat kegiatan | Riwayat tampil urut waktu; kosong state tersedia; data hanya laboratorium yang dikelola |
| DHR-16 | Menampilkan riwayat keuangan hasil denda praktikum; data diambil dari struktur Firestore yang dikelola bersama Devano, tanpa membuat sumber data keuangan terpisah | Dehar | P0 | ANG-05, DHR-11, DVN-05 | Riwayat keuangan dashboard | Data tagihan/pembayaran terbaca dari koleksi bersama; tidak ada koleksi keuangan baru; nominal dan status tampil; hanya laboratorium yang dikelola |
| DHR-17 | Menyediakan filter dashboard berdasarkan hari, minggu, dan bulan | Dehar | P0 | DHR-11 sampai DHR-16 | Filter dashboard | Filter hari, minggu, dan bulan berfungsi; data dan ringkasan mengikuti rentang; filter kosong menampilkan state kosong |

#### P1 — Prioritas Menengah

| Task ID | Deskripsi | PIC | Prioritas | Dependency | Output yang diharapkan | Acceptance Criteria |
|---|---|---|---|---|---|---|
| DHR-18 | Membantu Nashwa dalam integrasi konfigurasi jam minimal dan maksimal sesi praktikum pada Firestore | Dehar | P1 | ANG-05, NSW-14 | Konfigurasi waktu sesi | Field konfigurasi disepakati; nilai tersimpan di Firestore; Nashwa dapat membacanya; tidak ada field duplikat |
| DHR-19 | Memastikan konfigurasi waktu sesi dapat dibaca dan disinkronkan secara real-time | Dehar | P1 | DHR-18 | Sinkronisasi konfigurasi waktu | Perubahan konfigurasi terbaca real-time; listener dibersihkan saat tidak dipakai; kegagalan baca ditangani |
| DHR-20 | Memverifikasi bahwa Firestore Security Rules yang ditetapkan Anggi sesuai dengan struktur data dan operasi pada modul Aslab | Dehar | P1 | ANG-08, DHR-01 sampai DHR-17 | Hasil verifikasi rules modul Aslab | Operasi CRUD laboratorium, bulk insert, distribusi, dan dashboard diuji; akses tanpa hak ditolak; temuan dicatat dan diperbaiki |

### 10.4 Task Nashwa (Programmer 2)

PIC: **Nashwa**. Fokus: Asprak Operational Management, Session & Permission Management. PIC utama modul operasional Asprak.

#### P0 — Prioritas Utama

| Task ID | Deskripsi | PIC | Prioritas | Dependency | Output yang diharapkan | Acceptance Criteria |
|---|---|---|---|---|---|---|
| NSW-01 | Menampilkan daftar kelas, jadwal, dan sesi praktikum yang menjadi tanggung jawab Asprak | Nashwa | P0 | ANG-05, ANG-08, DHR-02 | Halaman kelas, jadwal, dan sesi Asprak | Hanya kelas/sesi yang diampu tampil; data dari Firestore; state memuat, kosong, dan gagal tersedia |
| NSW-02 | Mengimplementasikan fitur membuka sesi praktikum ketika kegiatan dimulai | Nashwa | P0 | NSW-01 | Aksi buka sesi | Sesi `belum-dibuka` dapat dibuka; konfirmasi tampil; status dan waktu buka tersimpan; sesi yang tidak valid ditolak |
| NSW-03 | Mengimplementasikan fitur menutup sesi praktikum setelah kegiatan selesai | Nashwa | P0 | NSW-01 | Aksi tutup sesi | Sesi `dibuka` dapat ditutup; konfirmasi tampil; status dan waktu tutup tersimpan; sesi `ditutup` tidak dapat ditutup ulang |
| NSW-04 | Memastikan perubahan status sesi tersinkronisasi secara real-time dengan aplikasi Praktikan | Nashwa | P0 | NSW-02, NSW-03 | Sinkronisasi status sesi | Perubahan status terlihat di aplikasi Praktikan tanpa reload; listener dibersihkan; kegagalan sinkronisasi ditangani |
| NSW-05 | Membuat fitur pemantauan dan pengelolaan presensi praktikan | Nashwa | P0 | NSW-01 | Halaman pemantauan presensi | Daftar presensi tampil; jumlah hadir dan peserta terdaftar tampil; Asprak dapat mengelola sesuai kewenangan; perubahan real-time |
| NSW-06 | Mengembangkan halaman pemeriksaan pengajuan izin di sisi Asprak | Nashwa | P0 | NSW-01 | Halaman pemeriksaan izin | Daftar pengajuan izin tampil; detail pengajuan dapat dibuka; state kosong dan gagal tersedia; hanya izin sesi yang diampu |
| NSW-07 | Menampilkan alasan pengajuan izin beserta hasil analisis sentimen AI yang disimpan Devano di Firestore | Nashwa | P0 | NSW-06, DVN-21 | Tampilan alasan dan hasil AI | Alasan tampil; hasil AI tampil bila tersedia; label informasi pendukung tampil; kondisi AI gagal atau belum selesai ditangani |
| NSW-08 | Mengimplementasikan fitur menerima dan menolak pengajuan izin | Nashwa | P0 | NSW-06 | Aksi keputusan izin | Asprak dapat menerima atau menolak; keputusan tersimpan; tombol aksi sesuai status; kegagalan penyimpanan dilaporkan |
| NSW-09 | Memastikan status pengajuan izin tersinkronisasi secara real-time dengan aplikasi Praktikan | Nashwa | P0 | NSW-08 | Sinkronisasi status izin | Keputusan terlihat di aplikasi Praktikan tanpa reload; listener dibersihkan; perubahan tidak hilang saat koneksi pulih |
| NSW-10 | Mengintegrasikan izin yang disetujui dengan status presensi `excused absence` dan pembebasan denda keterlambatan, tanpa mengubah status kehadiran menjadi hadir | Nashwa | P0 | NSW-08, DVN-01, DVN-02, DVN-18 | Integrasi izin dan presensi | Izin disetujui menghasilkan `excused absence`; denda keterlambatan dibebaskan; status bukan hadir; tidak ada tagihan baru untuk sesi tersebut |

#### P1 — Prioritas Menengah

| Task ID | Deskripsi | PIC | Prioritas | Dependency | Output yang diharapkan | Acceptance Criteria |
|---|---|---|---|---|---|---|
| NSW-11 | Membuat Navbar Praktikan menjadi lima halaman: Jadwal, Riwayat, Presensi QR, Izin, Denda | Nashwa | P1 | ANG-16 | Navbar Praktikan | Lima tab tampil dengan label yang benar; setiap tab membuka halaman yang ada; role Praktikan tidak melihat menu Asprak/Aslab |
| NSW-12 | Membuat Navbar Asisten menjadi lima halaman: Jadwal, Kelas, Map, Rekap, Izin | Nashwa | P1 | ANG-16 | Navbar Asisten | Lima tab tampil; label sesuai; setiap tab membuka halaman yang ada; role Asprak tidak melihat menu Aslab |
| NSW-13 | Memperbaiki alur pengajuan izin agar ketika Praktikan memilih izin dari sesi tertentu, aplikasi langsung membuka form pengajuan dengan sesi tersebut sudah terpilih | Nashwa | P1 | NSW-06 | Alur pengajuan izin | Dari sesi tertentu, form terbuka dengan sesi terpilih; pengguna tidak memilih sesi ulang; sesi yang tidak valid ditolak |
| NSW-14 | Mengimplementasikan aturan jam minimal dan maksimal sesi praktikum dapat dibuka sesuai konfigurasi yang ditentukan | Nashwa | P1 | DHR-18, DHR-19 | Validasi jam buka sesi | Buka sesi sebelum jam minimal ditolak; setelah jam maksimal ditolak; pesan alasan tampil; konfigurasi dibaca dari Firestore |
| NSW-15 | Memastikan validasi waktu buka dan tutup sesi terintegrasi secara real-time dengan Firestore | Nashwa | P1 | NSW-14 | Validasi waktu real-time | Perubahan konfigurasi waktu langsung memengaruhi validasi; validasi dilakukan saat aksi, bukan hanya di UI; listener dibersihkan |
| NSW-16 | Menambahkan kategori pengajuan izin: izin, alpha, dan sakit | Nashwa | P1 | NSW-06 | Kategori izin | Ketiga kategori tersedia; kategori wajib dipilih; nilai tersimpan; kategori di luar daftar ditolak |
| NSW-17 | Memindahkan halaman Map Praktikan dari halaman utama ke halaman praktikum terkait berdasarkan handover implementasi Sprint 3 dari Anggi | Nashwa | P1 | ANG-15 | Map pada halaman praktikum | Map tidak lagi menjadi halaman utama; Map dapat dibuka dari praktikum terkait; navigasi kembali berfungsi |
| NSW-18 | Memastikan Map Praktikan menampilkan informasi lokasi laboratorium yang sesuai dengan praktikum yang dipilih dan tetap mendukung kebutuhan validasi lokasi presensi | Nashwa | P1 | NSW-17, DHR-09 | Map per praktikum | Marker laboratorium sesuai praktikum; lokasi tampil; data radius tetap dapat dipakai validasi presensi; data kosong/gagal ditangani |

#### P2 — Prioritas Rendah

| Task ID | Deskripsi | PIC | Prioritas | Dependency | Output yang diharapkan | Acceptance Criteria |
|---|---|---|---|---|---|---|
| NSW-19 | Menyempurnakan visual dan konsistensi UI pada modul operasional Asprak dan halaman Praktikan yang dikerjakan | Nashwa | P2 | NSW-01 sampai NSW-18 | Penyempurnaan UI | Tampilan mengikuti design system; target sentuh 44x44 pt; status tidak hanya lewat warna; tidak menghilangkan fungsi |

### 10.5 Task Devano (Programmer 3)

PIC: **Devano**. Fokus: Fine Management, Payment Gateway, AI Integration & Notification. PIC utama modul denda, pembayaran, AI, dan notifikasi.

#### P0 — Prioritas Utama

| Task ID | Deskripsi | PIC | Prioritas | Dependency | Output yang diharapkan | Acceptance Criteria |
|---|---|---|---|---|---|---|
| DVN-01 | Mengimplementasikan perhitungan keterlambatan berdasarkan waktu presensi dan grace period | Devano | P0 | ANG-05, NSW-05 | Fungsi perhitungan keterlambatan | Selisih waktu dihitung dari waktu presensi; grace period diterapkan; tepat waktu tidak menghasilkan keterlambatan; hasil dapat diuji |
| DVN-02 | Membuat tagihan denda secara otomatis berdasarkan kejadian keterlambatan | Devano | P0 | DVN-01 | Pembuatan tagihan otomatis | Keterlambatan menghasilkan tagihan; nominal dan alasan tersimpan; tagihan terhubung ke praktikan dan sesi; kegagalan tidak menyimpan tagihan setengah jadi |
| DVN-03 | Memastikan satu kejadian keterlambatan hanya menghasilkan satu tagihan denda | Devano | P0 | DVN-02 | Idempotensi tagihan | Proses ulang tidak membuat tagihan kedua; kunci unik kejadian digunakan; pengujian duplikasi lulus |
| DVN-04 | Menghubungkan data tagihan dengan identitas praktikan, sesi praktikum, catatan presensi, dan identitas laboratorium | Devano | P0 | ANG-05, DVN-02 | Relasi tagihan lengkap | Semua relasi terisi; tagihan tanpa relasi wajib ditolak; data dapat ditelusuri ke presensi dan laboratorium |
| DVN-05 | Memastikan data tagihan dan pembayaran tersimpan dalam struktur Firestore yang disepakati bersama Anggi dan dapat digunakan oleh Dashboard Aslab yang dikembangkan Dehar | Devano | P0 | ANG-05, DVN-04 | Struktur tagihan dan pembayaran | Struktur sesuai kontrak; Dehar dapat membaca data; tidak ada sumber keuangan terpisah; field laboratorium tersedia |
| DVN-06 | Mengintegrasikan Midtrans menggunakan lingkungan Sandbox | Devano | P0 | DVN-05, konfirmasi backend (TBD) | Integrasi Midtrans Sandbox | Transaksi Sandbox dapat dibuat setelah backend tersedia; client key sesuai environment; Secret Key tidak ada di aplikasi |
| DVN-07 | Mengimplementasikan pembuatan transaksi pembayaran melalui backend | Devano | P0 | DVN-06 | Alur pembuatan transaksi | Aplikasi meminta transaksi ke backend; backend membuat transaksi Midtrans; respons berisi data yang dibutuhkan; gagal transaksi ditangani |
| DVN-08 | Mengimplementasikan callback/webhook dan verifikasi transaksi pembayaran melalui backend | Devano | P0 | DVN-07 | Callback dan verifikasi backend | Webhook menerima status; signature/keaslian diverifikasi; status tidak dipercaya dari client; kegagalan verifikasi tidak mengubah tagihan |
| DVN-09 | Mengelola status transaksi pembayaran: pending, success, dan failed | Devano | P0 | DVN-07, DVN-08 | Pengelolaan status transaksi | Ketiga status tersimpan; transisi status sesuai hasil verifikasi; status tidak valid ditolak; status dapat dibaca aplikasi |
| DVN-10 | Memperbarui status tagihan berdasarkan hasil verifikasi pembayaran dari backend | Devano | P0 | DVN-09 | Sinkronisasi status tagihan | Tagihan berubah setelah verifikasi; `success` menandai lunas sesuai kontrak; `failed` tidak menandai lunas; perubahan tercatat |
| DVN-11 | Membuat halaman daftar tagihan dan rincian nominal denda Praktikan | Devano | P0 | DVN-05 | Halaman tagihan Praktikan | Daftar tagihan milik sendiri tampil; rincian nominal dan alasan tampil; state kosong dan gagal tersedia |
| DVN-12 | Membuat halaman riwayat transaksi dan pembayaran Praktikan | Devano | P0 | DVN-09 | Halaman riwayat pembayaran | Riwayat transaksi tampil; status dan nominal tampil; hanya milik sendiri; state kosong dan gagal tersedia |
| DVN-13 | Memastikan riwayat pembayaran tetap tersedia meskipun aplikasi ditutup dan dibuka kembali | Devano | P0 | DVN-12, ANG-05 | Persistensi riwayat | Riwayat dibaca dari Firestore; data tetap ada setelah restart; tidak bergantung pada state lokal |
| DVN-14 | Mengintegrasikan notifikasi tagihan denda baru | Devano | P0 | DVN-02, mekanisme notifikasi (TBD) | Notifikasi tagihan baru | Notifikasi terkirim saat tagihan dibuat; penerima adalah praktikan terkait; tidak ada notifikasi ganda untuk tagihan yang sama |
| DVN-15 | Mengintegrasikan notifikasi pembayaran berhasil | Devano | P0 | DVN-09 | Notifikasi pembayaran berhasil | Notifikasi terkirim saat transaksi `success`; penerima sesuai; isi notifikasi sesuai tagihan |
| DVN-16 | Mengintegrasikan notifikasi pembayaran gagal atau membutuhkan penyelesaian lebih lanjut | Devano | P0 | DVN-09 | Notifikasi pembayaran gagal | Notifikasi terkirim saat `failed` atau status lanjutan; penerima sesuai; tidak menandai tagihan lunas |
| DVN-17 | Memastikan pembayaran denda tidak mengubah status kehadiran Praktikan | Devano | P0 | DVN-10, NSW-10 | Jaminan status kehadiran | Pembayaran berhasil tidak mengubah presensi; status `excused absence` tetap; status terlambat/hadir tidak berubah; diuji end-to-end |
| DVN-18 | Mengintegrasikan sistem denda dengan modul presensi dan pengajuan izin bersama Nashwa | Devano | P0 | DVN-01, DVN-02, DVN-03, NSW-08, NSW-10 | Integrasi denda-presensi-izin | Keterlambatan dari presensi memicu denda; izin disetujui membebaskan denda; tidak ada denda ganda; kontrak disepakati bersama |
| DVN-19 | Mengintegrasikan API model analisis sentimen yang disediakan pengajar untuk menganalisis alasan pengajuan izin Praktikan | Devano | P0 | Kontrak API AI (TBD) | Integrasi API AI | Endpoint dan auth sesuai kontrak; request berhasil dikirim; respons dipetakan; kegagalan ditangani; tidak ada credential rahasia di aplikasi |
| DVN-20 | Mengirimkan alasan pengajuan izin Praktikan ke API AI untuk diproses | Devano | P0 | DVN-19 | Pengiriman alasan izin | Alasan terkirim setelah pengajuan tersimpan; data yang dikirim sesuai kontrak; kegagalan tidak menghapus pengajuan |
| DVN-21 | Mengolah respons API dan menyimpan hasil analisis sentimen bersama data pengajuan izin di Firestore | Devano | P0 | DVN-20, ANG-05 | Penyimpanan hasil AI | Respons dipetakan ke field kontrak; hasil tersimpan bersama izin; status klasifikasi selesai/gagal tersimpan; tidak menimpa keputusan Asprak |
| DVN-22 | Menangani kondisi ketika layanan AI mengalami gangguan atau tidak memberikan respons tanpa menghambat proses pengajuan izin | Devano | P0 | DVN-20 | Penanganan gangguan AI | Timeout dan error ditangani; pengajuan tetap tersimpan; status klasifikasi gagal; pengguna mendapat informasi; alur tidak terblokir |
| DVN-23 | Memastikan hasil analisis AI dapat diakses oleh Nashwa untuk ditampilkan kepada Asprak sebagai informasi pendukung pengambilan keputusan | Devano | P0 | DVN-21, NSW-07 | Akses hasil AI | Nashwa dapat membaca field hasil AI; data tampil di halaman Asprak; label informasi pendukung tersedia; tidak menjadi keputusan otomatis |

#### P1 — Prioritas Menengah

| Task ID | Deskripsi | PIC | Prioritas | Dependency | Output yang diharapkan | Acceptance Criteria |
|---|---|---|---|---|---|---|
| DVN-24 | Memastikan tombol notifikasi dapat diklik | Devano | P1 | DVN-14, DVN-15, DVN-16 | Tombol notifikasi aktif | Tombol merespons sentuhan; target sentuh minimal 44x44 pt; tidak ada tombol mati tanpa alasan |
| DVN-25 | Memastikan notifikasi mengarahkan pengguna ke halaman yang relevan sesuai jenis notifikasinya | Devano | P1 | DVN-24 | Deep link notifikasi | Tagihan baru membuka halaman denda/tagihan; pembayaran berhasil/gagal membuka riwayat/detail yang relevan; tujuan tidak kosong |
| DVN-26 | Memastikan data transaksi dan status pembayaran tersinkronisasi dengan Firestore | Devano | P1 | DVN-09 | Sinkronisasi transaksi | Perubahan status tampil tanpa reload; data berasal dari Firestore; listener dibersihkan; kegagalan ditangani |
| DVN-27 | Memastikan integrasi notifikasi berjalan pada kondisi aplikasi foreground, background, dan terminated | Devano | P1 | DVN-14, DVN-15, DVN-16 | Notifikasi lintas kondisi aplikasi | Notifikasi diterima pada tiga kondisi yang didukung; handler tidak error; klik membuka halaman relevan; keterbatasan platform dicatat |

#### P2 — Prioritas Rendah

| Task ID | Deskripsi | PIC | Prioritas | Dependency | Output yang diharapkan | Acceptance Criteria |
|---|---|---|---|---|---|---|
| DVN-28 | Menyempurnakan tampilan notifikasi pada Android | Devano | P2 | DVN-27 | Tampilan notifikasi Android | Ikon, judul, dan isi tampil benar; tidak terpotong; konsisten dengan notifikasi platform lain sejauh didukung |
| DVN-29 | Menambahkan logo PraktikumKU pada notifikasi | Devano | P2 | DVN-28 | Logo pada notifikasi | Logo tampil pada notifikasi Android yang didukung; aset tidak pecah; ukuran sesuai pedoman platform |
| DVN-30 | Menyempurnakan visual dan konsistensi UI pada modul denda, pembayaran, dan notifikasi | Devano | P2 | DVN-11 sampai DVN-29 | Penyempurnaan UI | Tampilan mengikuti design system; status tidak hanya lewat warna; target sentuh 44x44 pt; fungsi tidak hilang |

## 11. Testing dan Demo

### 11.1 Strategi pengujian

| Jenis | Cakupan | Penanggung jawab |
|---|---|---|
| Unit/logic | Validasi NIM, perhitungan keterlambatan, idempotensi tagihan, pemetaan status pembayaran, pemetaan hasil AI | Programmer terkait |
| Integration | Firestore listener, Security Rules, alur izin–presensi–denda, alur pembayaran backend | Programmer terkait dan PM |
| End-to-end | Alur Aslab, Asprak, Praktikan, denda/pembayaran, AI, notifikasi | PM |
| Regression | Fitur Sprint 1–3 yang masih relevan: login, jadwal, presensi QR/lokasi, rekap, izin, notifikasi | PM dan seluruh tim |
| Static | `npx tsc --noEmit`, `npx expo lint` | Seluruh tim |

### 11.2 Skenario demo wajib

#### Demo A — Aslab

1. Login sebagai Aslab.
2. Dashboard menampilkan jumlah laboratorium dan praktikan.
3. Buat atau ubah laboratorium dengan nama, lokasi, koordinat, radius, dan batas keterlambatan.
4. Unduh template bulk insert laboratorium, praktikan, dan Asprak.
5. Unggah data, buka halaman review, terima sebagian, tolak sebagian, lengkapi data kosong, lalu simpan.
6. Pindahkan satu praktikan dan satu Asprak ke laboratorium lain.
7. Buka riwayat kegiatan dan riwayat keuangan; uji filter hari/minggu/bulan.
8. Pastikan Asprak tidak dapat membuka fitur administratif tersebut.

#### Demo B — Asprak, sesi, presensi, dan izin

1. Login sebagai Asprak.
2. Daftar kelas, jadwal, dan sesi hanya menampilkan tanggung jawabnya.
3. Buka sesi pada jam yang diizinkan; status terlihat real-time di Praktikan.
4. Coba buka sesi di luar jam minimal/maksimal; sistem menolak dengan alasan.
5. Pantau presensi praktikan.
6. Buka pengajuan izin; lihat alasan, kategori, dan hasil AI.
7. Setujui satu izin dan tolak satu izin.
8. Pastikan keputusan terlihat real-time di Praktikan.
9. Tutup sesi.

#### Demo C — Praktikan, izin, dan excused absence

1. Login sebagai Praktikan.
2. Dari sesi tertentu, pilih izin; form terbuka dengan sesi terpilih.
3. Pilih kategori izin/alpha/sakit dan isi alasan.
4. Kirim pengajuan; pastikan pengajuan tetap tersimpan saat AI gagal.
5. Setelah Asprak menyetujui, status menjadi `excused absence`.
6. Pastikan status bukan hadir dan tidak ada tagihan denda keterlambatan untuk sesi tersebut.

#### Demo D — Denda dan pembayaran

1. Buat presensi terlambat di luar grace period.
2. Pastikan satu tagihan denda dibuat dan terhubung ke praktikan, sesi, presensi, dan laboratorium.
3. Picu ulang proses; pastikan tidak ada tagihan kedua.
4. Login sebagai Praktikan; buka daftar tagihan dan rincian nominal.
5. Mulai pembayaran melalui backend dan Midtrans Sandbox.
6. Selesaikan pembayaran; pastikan status transaksi dan tagihan diperbarui dari backend.
7. Buka riwayat pembayaran; tutup dan buka aplikasi; riwayat tetap ada.
8. Pastikan status kehadiran tidak berubah.
9. Uji pembayaran gagal dan notifikasinya.

#### Demo E — Notifikasi dan navigasi

1. Notifikasi tagihan baru muncul dan dapat diklik.
2. Klik notifikasi membuka halaman denda/tagihan yang relevan.
3. Notifikasi pembayaran berhasil/gagal membuka halaman yang relevan.
4. Uji notifikasi pada foreground, background, dan terminated.
5. Periksa navbar Praktikan lima halaman dan navbar Asprak lima halaman.
6. Buka Map Praktikan dari halaman praktikum terkait, bukan halaman utama.

### 11.3 Kasus negatif dan keamanan wajib

| Kasus | Hasil yang diharapkan |
|---|---|
| Praktikan membuka route Aslab/Asprak | Ditolak dan diarahkan ke beranda sesuai role |
| Asprak mencoba CRUD kelas/laboratorium | Ditolak di UI dan Security Rules |
| Aslab mengubah laboratorium di luar kewenangannya | Ditolak |
| NIM bukan 14 digit atau bukan angka | Ditolak sebelum disimpan |
| Seed dijalankan dua kali | Tidak ada duplikasi |
| Reset diarahkan ke production | Dibatalkan dan dicatat |
| Secret Key Midtrans dicari di bundel aplikasi | Tidak ditemukan |
| AI timeout | Pengajuan izin tetap tersimpan |
| Callback Midtrans palsu | Verifikasi gagal dan tagihan tidak berubah |
| Client menandai pembayaran berhasil | Tagihan tidak berubah tanpa verifikasi backend |
| Pembayaran berhasil | Status kehadiran tidak berubah |
| Izin disetujui | `excused absence`, bebas denda, bukan hadir |
| Tagihan diproses ulang | Tetap satu tagihan |
| Notifikasi dikirim berulang | Tidak ada duplikasi untuk kejadian yang sama |
| Bulk insert berisi baris tidak valid | Baris ditolak dan tidak masuk koleksi utama |

### 11.4 Perintah verifikasi

```bash
npx tsc --noEmit
npx expo lint
npx expo-doctor
```

Demo dijalankan pada perangkat/emulator Android dan iOS. Fitur Web diuji sejauh didukung library dan browser. Hasil setiap AC dicatat lulus/gagal.

## 12. Definition of Done

Sprint 4 dinyatakan selesai apabila:

- [ ] `docs/sprints/sprint-4.md` dan `docs/PRD.md` sudah diperbarui dan saling merujuk.
- [ ] Role Aslab beserta hak akses, tampilan, dan route-nya berjalan.
- [ ] Matriks hak akses disepakati dan ditegakkan Firestore Security Rules.
- [ ] Schema Firestore dan relasi data disepakati; tagihan dan pembayaran menyimpan identitas laboratorium.
- [ ] Seed Aslab, Asprak, dan Praktikan idempotent serta konsisten dengan Firebase Authentication.
- [ ] NIM disimpan sebagai String dan divalidasi tepat 14 digit.
- [ ] Backup Firestore dilakukan sebelum reset development; production tidak direset.
- [ ] CRUD laboratorium berjalan.
- [ ] Bulk/single insert laboratorium, praktikan, dan Asprak berjalan.
- [ ] Template bulk insert tersedia dan dapat diunduh.
- [ ] Halaman review bulk insert mendukung accept, deny, update, dan pelengkapan data.
- [ ] Perpindahan praktikan dan Asprak antarlaboratorium berjalan tanpa duplikasi.
- [ ] Konfigurasi lokasi, radius, cakupan presensi, dan batas keterlambatan berjalan.
- [ ] Dashboard Aslab menampilkan jumlah laboratorium/praktikan, status kegiatan, jadwal, riwayat kegiatan, dan riwayat keuangan dengan filter hari/minggu/bulan.
- [ ] Asprak melihat kelas, jadwal, dan sesi yang menjadi tanggung jawabnya.
- [ ] Asprak dapat membuka dan menutup sesi dengan validasi jam minimal/maksimal.
- [ ] Status sesi tersinkronisasi real-time dengan Praktikan.
- [ ] Asprak dapat memantau dan mengelola presensi.
- [ ] Halaman pemeriksaan izin menampilkan alasan dan hasil AI.
- [ ] Asprak dapat menerima dan menolak izin; status tersinkronisasi real-time.
- [ ] Izin disetujui menghasilkan `excused absence`, bebas denda, dan bukan hadir.
- [ ] Keterlambatan dihitung dari waktu presensi dan grace period.
- [ ] Tagihan denda dibuat otomatis dan idempotent.
- [ ] Tagihan terhubung dengan praktikan, sesi, presensi, dan laboratorium.
- [ ] Midtrans Sandbox terintegrasi melalui backend.
- [ ] Callback/webhook dan verifikasi transaksi berjalan di backend.
- [ ] Status transaksi pending/success/failed dikelola.
- [ ] Status tagihan diperbarui dari verifikasi backend.
- [ ] Praktikan dapat melihat tagihan, rincian nominal, dan riwayat pembayaran.
- [ ] Riwayat pembayaran bertahan setelah aplikasi dibuka ulang.
- [ ] Pembayaran tidak mengubah status kehadiran.
- [ ] Notifikasi tagihan baru, pembayaran berhasil, dan pembayaran gagal berjalan.
- [ ] Notifikasi dapat diklik dan mengarah ke halaman relevan.
- [ ] Notifikasi berjalan pada foreground, background, dan terminated sesuai dukungan platform.
- [ ] Navbar Praktikan dan Asprak masing-masing lima halaman.
- [ ] Alur izin dari sesi tertentu langsung membuka form dengan sesi terpilih.
- [ ] Kategori izin/alpha/sakit tersedia.
- [ ] Map Praktikan dipindahkan ke halaman praktikum terkait.
- [ ] Visual dan konsistensi UI modul terkait disempurnakan.
- [ ] Hasil AI hanya menjadi informasi pendukung dan tidak mengambil keputusan otomatis.
- [ ] Tidak ada Secret Key Midtrans atau credential rahasia di aplikasi React Native.
- [ ] `EXPO_PUBLIC_AI_API_KEY` dicatat sebagai security gap bila masih digunakan.
- [ ] Seluruh skenario demo dan kasus negatif utama lulus.
- [ ] `npx tsc --noEmit` dan `npx expo lint` hijau.
- [ ] Tidak ada bug kritis yang menghambat demo.
- [ ] Dokumentasi teknis dan proyek diperbarui.
- [ ] Hanya file dokumentasi target yang diubah untuk pekerjaan dokumentasi ini.

## 13. Risiko dan TBD

### 13.1 Risiko

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Backend Midtrans belum ditentukan | Pembuatan transaksi, callback, dan verifikasi tidak dapat diimplementasikan | PM meminta konfirmasi pengajar sebelum integrasi; tandai TBD; siapkan antarmuka backend yang tidak bergantung pada pilihan |
| Secret Key Midtrans tidak sengaja masuk bundel | Kebocoran kredensial pembayaran | Secret hanya di backend; review PR; pemindaian variabel `EXPO_PUBLIC_*` |
| `EXPO_PUBLIC_AI_API_KEY` digunakan di aplikasi | API key dapat diekstrak dari bundel | Catat sebagai security gap; pindahkan pemanggilan ke backend bila credential rahasia |
| Detail API AI belum dikonfirmasi | Integrasi AI tidak dapat diselesaikan | Mock/fallback; pengajuan izin tetap berjalan; status klasifikasi gagal |
| Model AI berupa file, bukan API | Perlu preprocessing dan inference tambahan | Konfirmasi spesifikasi model; rencanakan waktu dan dependency |
| Tagihan ganda | Praktikan ditagih lebih dari sekali | Kunci idempotensi per kejadian; uji proses ulang |
| Callback palsu atau status client dipercaya | Status tagihan salah | Verifikasi signature/keaslian di backend; client hanya membaca Firestore |
| Reset development mengenai production | Kehilangan data | Verifikasi environment; backup wajib; prosedur reset berlapis |
| Seed tidak idempotent | Akun dan data ganda | ID tetap atau penanda versi seed; uji seed ulang |
| Perubahan role asisten menjadi Asprak tidak konsisten | Data dan rules tidak cocok | Petakan istilah di kontrak data; migrasi terkoordinasi; uji rules |
| Kewenangan kelas berpindah dari Asprak ke Aslab | Konflik dengan implementasi Sprint 2 | Catat sebagai perubahan role Sprint 4; perbarui rules dan UI; uji akses Asprak |
| Security Rules tidak dapat memvalidasi query lintas koleksi | Sebagian validasi harus di lapisan data | Dokumentasikan batasan; uji di lapisan data; jangan mengandalkan UI |
| Bulk insert berukuran besar | Waktu proses dan batas Firestore | Batasi ukuran batch; proses bertahap; review sebelum simpan |
| Notifikasi duplikat | Pengguna menerima pesan berulang | Idempotensi event; kunci kejadian |
| Notifikasi tidak berjalan di terminated | Informasi tidak diterima | Uji tiga kondisi; catat keterbatasan platform |
| Pembayaran Sandbox tidak stabil | Demo gagal | Siapkan status gagal dan ulangi transaksi; catat kondisi |
| Zona waktu dan format tanggal tidak konsisten | Perhitungan keterlambatan salah | Sepakati zona waktu dan format; uji batas hari |
| Koordinat/radius laboratorium belum final | Validasi lokasi gagal | Gunakan data Sprint 3; konfirmasi ulang sebelum demo |
| Dokumentasi desain memakai nama berbeda | Kebingungan target pembaruan | Catat `designs.md` vs `docs/design.md` sebagai TBD; konfirmasi PM |
| Waktu sprint terbatas | Fitur tidak selesai | Prioritaskan P0; pantau progres harian; P2 dapat ditunda |

### 13.2 TBD

| Item | Status | Pemilik | Dampak |
|---|---|---|---|
| Periode Sprint 4 | TBD | PM/Pengajar | Perencanaan waktu |
| Backend Midtrans: Firebase Cloud Functions atau server terpisah | TBD | PM/Pengajar | Implementasi DVN-06 sampai DVN-10 |
| Endpoint backend, request/response, signature verification | TBD | PM/Devano | Integrasi pembayaran |
| Mekanisme callback HTTPS untuk development | TBD | PM/Devano | Pengujian webhook |
| Endpoint API AI, metode autentikasi, request body, response body | TBD | PM/Devano/Pengajar | Implementasi DVN-19 sampai DVN-23 |
| Daftar kategori/format hasil analisis AI | TBD | Devano/Pengajar | Pemetaan field hasil AI |
| Apakah AI berupa API atau file model | TBD | PM/Pengajar | preprocessing/inference |
| Batas waktu dan kuota API AI | TBD | PM/Pengajar | Penanganan timeout dan biaya |
| Mekanisme push notification dan layanan tambahan | TBD | PM/Devano | DVN-14 sampai DVN-27 |
| Format template bulk insert | TBD | Dehar/PM | DHR-06 |
| Format penanda seed idempotent | TBD | Anggi/Dehar | ANG-06 |
| Format kode mata kuliah | TBD | Anggi/Dehar | DHR-03 |
| Nominal denda dan aturan grace period | TBD | PM/Pengajar | DVN-01, DVN-02 |
| Status tagihan final dan pemetaan status Midtrans | TBD | Anggi/Devano | DVN-09, DVN-10 |
| Nilai status kehadiran final (`excused-absence`, `alpha`, dan lainnya) | TBD | Anggi/Nashwa/Devano | NSW-10, DVN-17 |
| Field `laboratoriumIds` pada `users` | TBD | Anggi/Dehar | Relasi anggota dan rules |
| Kewenangan Aslab membaca hasil AI dan izin | TBD | Anggi | Role matrix dan rules |
| Riwayat perpindahan anggota | TBD | Anggi/Dehar | DHR-08 |
| Nama berkas desain: `designs.md` atau `docs/design.md` | TBD | Anggi | ANG-13 |
| Developer Auth dan mekanisme reset password | TBD | Anggi | ANG-17 |
| Dukungan Web untuk Midtrans, notifikasi, dan AI | TBD | PM/Devano | NFR-S4-15 |
| Migrasi istilah `asisten` ke `asprak` | TBD | Anggi/Dehar | Konsistensi data dan rules |
