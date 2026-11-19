# Sprint 3: Location-Based Attendance, Maps, and Push Notification
 
## 1. Sprint Information
 
| Field | Isi |
|---|---|
| Sprint | Sprint 3 |
| Nama | Location-Based Attendance, Maps, and Push Notification |
| Periode | 19 November 2026 sampai 22 November 2026 (4 hari kerja) |
| Sprint goal | Mengembangkan presensi berbasis lokasi dan QR Code, integrasi Google Maps, informasi aktivitas laboratorium, push notification, serta penyempurnaan UI/UX |
| Target platform | Android, iOS, Web (menyesuaikan dukungan library dan fitur perangkat) |
| Tim | PM: Nashwa Aldebaran. Programmer 1: Anggita Kirana Puspa. Programmer 2: Dehar Zaidan Dzaki Amirullah. Programmer 3: Devano Trestanto |
| Status | Perencanaan, belum dimulai |
 
Dokumen ini menjadi acuan pelaksanaan Sprint 3. Setiap perubahan scope, kontrak data, atau pembagian tugas harus disepakati PM dan dicatat sebelum dikerjakan.
 
## 2. Sprint Goal
 
Pada akhir 22 November 2026, tiga alur demo wajib berjalan end-to-end dengan data Firebase:
 
1. **Alur A (presensi berbasis lokasi dan QR Code):** asisten membuka sesi dan menampilkan QR Code, praktikan memindai QR Code, sistem memvalidasi sesi serta lokasi praktikan terhadap radius laboratorium, presensi tersimpan, dan asisten dapat melihat hasilnya pada rekap.
2. **Alur B (Maps dan aktivitas laboratorium):** pengguna membuka halaman Maps, melihat marker lokasi Lab B, C, D, dan AP, melihat posisi perangkat, memilih marker laboratorium, serta melihat informasi kegiatan yang sedang berlangsung dan berikutnya.
3. **Alur C (push notification):** asisten membuka sesi, mengubah jadwal, atau memutuskan pengajuan izin; pengguna yang berkaitan menerima notifikasi sesuai kejadian tersebut.
Seluruh fitur harus terintegrasi dengan Firebase Authentication dan Cloud Firestore dari Sprint 2. Validasi presensi tidak boleh hanya dilakukan pada tampilan aplikasi. Presensi yang tidak memenuhi ketentuan tidak boleh tersimpan.
 
## 3. Scope and Requirements
 
### 3.1 Functional requirements
 
| ID | Requirement | User Story | Prioritas |
|---|---|---|---|
| FR-01 | Sistem menyimpan dan menyediakan data koordinat serta radius Lab B, Lab C, Lab D, dan AP di Firestore | US-01 | High |
| FR-02 | Pengguna dapat melihat lokasi laboratorium melalui Google Maps dan memilih marker untuk melihat informasi | US-02 | High |
| FR-03 | Sistem dapat memperoleh dan menampilkan posisi pengguna pada Maps selama halaman aktif | US-03 | High |
| FR-04 | Sistem menampilkan kegiatan praktikum yang sedang berlangsung dan kegiatan berikutnya berdasarkan data Firestore | US-04 | High |
| FR-05 | Praktikan memiliki halaman presensi yang menampilkan informasi sesi dan menyediakan proses pemindaian QR Code | US-05 | High |
| FR-06 | Praktikan dapat memindai QR Code dengan kamera perangkat | US-06 | High |
| FR-07 | Sistem memvalidasi QR Code, status sesi, dan lokasi praktikan sebelum presensi dicatat | US-07 | High |
| FR-08 | Sistem menyimpan presensi yang valid dan mencegah presensi ganda | US-08 | High |
| FR-09 | Asisten dapat mengubah informasi sesi melalui modal popup dan mengelola input waktu | US-09 | Medium |
| FR-10 | Asisten dapat membuat QR Code berdasarkan sesi praktikum | US-10 | High |
| FR-11 | Sistem mengirim notifikasi ketika sesi praktikum dibuka | US-11 | High |
| FR-12 | Sistem mengirim notifikasi ketika jadwal praktikum berubah | US-12 | High |
| FR-13 | Sistem mengirim notifikasi ketika pengajuan izin disetujui atau ditolak | US-13 | High |
| FR-14 | Sistem mengelola izin notifikasi, token perangkat, dan kondisi kegagalan pengiriman | US-14 | High |
| FR-15 | Asisten dapat mencari peserta praktikum berdasarkan informasi identitas peserta | US-15 | Medium |
| FR-16 | Asisten dapat memfilter pengajuan izin berdasarkan kategori | US-16 | Medium |
| FR-17 | Tampilan bagian atas halaman rekap presensi disempurnakan | US-17 | Medium |
| FR-18 | Sistem menerapkan validasi input dan penyempurnaan UI/UX pada fitur yang dikembangkan | US-18 | High |
 
Kode `FR-xx` di tabel ini dipakai sebagai kode SRS pada formulir pembagian tugas. Isian formulir per anggota:
 
**Anggita Kirana Puspa (P1)**
 
- FR-01 : US-01: Pengelolaan lokasi dan radius laboratorium
- FR-02 : US-02: Menampilkan lokasi laboratorium pada Maps
- FR-03 : US-03: Menampilkan lokasi pengguna pada Maps
- FR-04 : US-04: Menampilkan aktivitas praktikum saat ini dan berikutnya
**Dehar Zaidan Dzaki Amirullah (P2)**
 
- FR-05 : US-05: Menyediakan halaman presensi
- FR-06 : US-06: Memindai dan memvalidasi QR Code
- FR-07 : US-07: Memvalidasi lokasi praktikan
- FR-08 : US-08: Mencatat presensi dan mencegah duplikasi
- FR-09 : US-09: Mengelola sesi dan informasi waktu sesi
**Devano Trestanto (P3)**
 
- FR-10 : US-10: Membuat dan menampilkan QR Code untuk sesi
- FR-11 : US-11: Mengirim notifikasi ketika sesi dibuka
- FR-12 : US-12: Mengirim notifikasi perubahan jadwal
- FR-13 : US-13: Mengirim notifikasi keputusan pengajuan izin
- FR-14 : US-14: Mengelola izin notifikasi dan token perangkat
- FR-15 : US-15: Mencari peserta praktikum
- FR-16 : US-16: Memfilter kategori pengajuan izin
- FR-17 : US-17: Memperbaiki tampilan halaman rekap presensi
- FR-18 : US-18: Menambahkan validasi input dan penyempurnaan UI/UX
**Catatan scope:** QR Code ditetapkan sebagai fitur wajib berdasarkan keputusan kelompok, meskipun pada deskripsi awal sprint fitur tersebut bersifat opsional.
 
### 3.2 Non-functional requirements
 
| ID | Requirement |
|---|---|
| NFR-01 | Fitur harus terintegrasi dengan Firebase Authentication dan Cloud Firestore dari Sprint 2. |
| NFR-02 | Data lokasi laboratorium, sesi, presensi, jadwal, dan izin harus menggunakan sumber data Firestore yang konsisten. |
| NFR-03 | Setiap layar yang membaca data memiliki state memuat, kosong, dan gagal. |
| NFR-04 | Semua pesan kesalahan ditampilkan dalam bahasa Indonesia dan mudah dipahami pengguna. |
| NFR-05 | Validasi presensi harus dilakukan pada proses pencatatan data, bukan hanya pada UI. |
| NFR-06 | Sistem harus mencegah presensi ganda dan penulisan presensi yang tidak memenuhi ketentuan. |
| NFR-07 | Fitur yang membutuhkan perangkat, seperti kamera, lokasi, dan notifikasi, harus menangani izin perangkat dengan baik. |
| NFR-08 | Target sentuh minimal 44x44 pt tetap berlaku dan informasi status tidak hanya dibedakan melalui warna. |
| NFR-09 | Fitur diuji pada Android dan iOS. Web diuji untuk fitur yang didukung library dan browser. |
| NFR-10 | Perubahan dependency dan konfigurasi diumumkan kepada tim serta dijelaskan dalam deskripsi PR. |
| NFR-11 | Tidak ada kredensial atau token sensitif yang ditulis langsung di kode sumber. |
| NFR-12 | Kegagalan jaringan, GPS, kamera, dan pengiriman notifikasi harus ditangani tanpa menyebabkan aplikasi berhenti secara tidak terduga. |
 
### 3.3 Ketentuan tambahan berdasarkan keputusan kelompok
 
| Area | Ketentuan |
|---|---|
| QR Code | QR Code wajib digunakan dalam proses presensi. |
| Lokasi laboratorium | Lokasi yang dikelola adalah Lab B, Lab C, Lab D, dan AP. |
| Lokasi AP | Titik lokasi AP tidak mencakup lantai atas. |
| Radius laboratorium | Setiap laboratorium memiliki radius yang digunakan untuk validasi presensi. |
| Pemilihan laboratorium | Menggunakan enum dan dropdown dengan pilihan Lab B, Lab C, Lab D, dan AP. |
| Kamera | Pemindaian QR Code membutuhkan izin kamera. |
| Edit sesi | Pengubahan sesi menggunakan modal popup. |
| Waktu | Input waktu menggunakan field khusus dan validasi yang sesuai. |
| Peserta | Asisten dapat mencari peserta praktikum. |
| Pengajuan izin | Daftar pengajuan izin memiliki filter kategori. |
| Rekap | Bagian atas halaman rekap presensi diperbaiki. |
| NIM praktikan | Validasi NIM praktikan menggunakan 14 digit. |
| NIM asisten | Format validasi mengikuti ketentuan yang disepakati kelompok. |
| UI/UX | Input yang membutuhkan validasi harus memiliki pesan kesalahan yang jelas. |
 
## 4. Sprint Backlog
 
Estimasi menggunakan ukuran S (setengah hari), M (satu hari), dan L (dua hari) untuk satu programmer. Estimasi merupakan perkiraan awal dan dapat disesuaikan setelah kontrak data serta kebutuhan teknis disepakati.
 
Status awal seluruh story: `Belum dimulai`.
 
### 4.1 Ringkasan backlog
 
| ID | Judul | Owner | Prioritas | Estimasi | Dependensi | Status |
|---|---|---|---|---|---|---|
| US-01 | Pengelolaan lokasi laboratorium | P1 | High | M | PM-01, PM-02 | Belum dimulai |
| US-02 | Menampilkan lokasi laboratorium pada Maps | P1 | High | M | US-01, PM-03 | Belum dimulai |
| US-03 | Menampilkan lokasi pengguna | P1 | High | M | US-02, PM-03 | Belum dimulai |
| US-04 | Informasi aktivitas laboratorium | P1 | High | M | US-01, data sesi | Belum dimulai |
| US-05 | Halaman presensi | P2 | High | S | US-06, data sesi | Belum dimulai |
| US-06 | Pemindaian QR Code | P2 | High | M | PM-03, US-10 | Belum dimulai |
| US-07 | Validasi lokasi dan sesi presensi | P2 | High | L | US-01, US-06 | Belum dimulai |
| US-08 | Pencatatan dan rekap presensi | P2 | High | M | US-07, Firestore | Belum dimulai |
| US-09 | Pengelolaan sesi dan input waktu | P2 | Medium | M | Data sesi Sprint 2 | Belum dimulai |
| US-10 | Pembuatan QR Code sesi | P3 | High | M | Kontrak QR, data sesi | Belum dimulai |
| US-11 | Notifikasi pembukaan sesi | P3 | High | M | PM-04, US-14 | Belum dimulai |
| US-12 | Notifikasi perubahan jadwal | P3 | High | M | US-14, data jadwal | Belum dimulai |
| US-13 | Notifikasi keputusan izin | P3 | High | M | US-14, data izin | Belum dimulai |
| US-14 | Pengelolaan push notification | P3 | High | L | PM-04, konfigurasi notifikasi | Belum dimulai |
| US-15 | Pencarian peserta praktikum | P3 | Medium | S | Data peserta Sprint 2 | Belum dimulai |
| US-16 | Filter kategori pengajuan izin | P3 | Medium | S | Data izin Sprint 2 | Belum dimulai |
| US-17 | Penyempurnaan halaman rekap | P3 | Medium | S | Halaman rekap Sprint 2 | Belum dimulai |
| US-18 | Validasi input dan penyempurnaan UI/UX | P3 | High | M | Form terkait | Belum dimulai |
 
Total 18 User Story, 86 technical task. Rincian pekerjaan teknis terdapat pada bagian 5.
 
### 4.2 Rincian user story
 
#### US-01 Pengelolaan lokasi laboratorium
 
**User story.** Sebagai asisten, saya ingin sistem menyimpan koordinat dan radius laboratorium, supaya lokasi tersebut dapat digunakan sebagai acuan pada Maps dan validasi presensi.
 
**Deskripsi.** Sistem menyediakan data lokasi Lab B, Lab C, Lab D, dan AP. Koordinat ditentukan berdasarkan Google Maps. Setiap laboratorium mempunyai radius yang digunakan pada proses validasi lokasi. Pilihan laboratorium menggunakan nilai yang telah ditentukan.
 
**Priority.** High.
 
**Acceptance criteria.**
 
1. Sistem menyediakan data Lab B, Lab C, Lab D, dan AP.
2. Setiap laboratorium memiliki koordinat dan radius.
3. Koordinat dan radius tersimpan di Cloud Firestore.
4. Pilihan laboratorium menggunakan dropdown dengan nilai Lab B, Lab C, Lab D, dan AP.
5. Data lokasi dapat digunakan oleh halaman Maps dan proses validasi presensi.
6. Lokasi AP tidak mencakup lantai atas.
7. Sistem menangani kondisi ketika data koordinat atau radius belum tersedia.
**Estimasi.** M. **Owner.** P1. **Dependensi.** PM-01, PM-02. **Status.** Belum dimulai.
 
#### US-02 Menampilkan lokasi laboratorium pada Maps
 
**User story.** Sebagai pengguna, saya ingin melihat lokasi laboratorium pada Google Maps, supaya saya dapat mengetahui posisi laboratorium yang tersedia.
 
**Deskripsi.** Sistem menampilkan peta interaktif yang berisi marker lokasi laboratorium. Pengguna dapat memilih marker untuk melihat informasi laboratorium.
 
**Priority.** High.
 
**Acceptance criteria.**
 
1. Sistem menyediakan halaman Maps.
2. Peta menampilkan marker Lab B, Lab C, Lab D, dan AP berdasarkan koordinat Firestore.
3. Pengguna dapat memilih marker laboratorium.
4. Sistem menampilkan informasi laboratorium ketika marker dipilih.
5. Sistem menampilkan kondisi gagal apabila data lokasi tidak dapat dimuat.
6. Marker tidak ditampilkan pada koordinat yang tidak valid.
**Estimasi.** M. **Owner.** P1. **Dependensi.** US-01, PM-03. **Status.** Belum dimulai.
 
#### US-03 Menampilkan lokasi pengguna
 
**User story.** Sebagai pengguna, saya ingin melihat posisi perangkat saya pada Maps, supaya saya dapat mengetahui posisi saya terhadap laboratorium.
 
**Deskripsi.** Sistem menggunakan layanan lokasi perangkat untuk memperoleh posisi pengguna dan menampilkannya pada peta selama halaman Maps aktif.
 
**Priority.** High.
 
**Acceptance criteria.**
 
1. Sistem meminta izin akses lokasi perangkat.
2. Sistem menampilkan posisi pengguna pada Maps.
3. Posisi pengguna diperbarui selama halaman Maps aktif.
4. Sistem menampilkan informasi apabila izin lokasi ditolak.
5. Sistem menangani kondisi GPS tidak aktif.
6. Sistem menangani kondisi lokasi tidak berhasil diperoleh.
7. Listener atau proses pembaruan lokasi dihentikan ketika halaman tidak lagi aktif.
**Estimasi.** M. **Owner.** P1. **Dependensi.** US-02, PM-03. **Status.** Belum dimulai.
 
#### US-04 Informasi aktivitas laboratorium
 
**User story.** Sebagai pengguna, saya ingin melihat kegiatan praktikum yang sedang berlangsung dan kegiatan berikutnya, supaya saya dapat mengetahui aktivitas laboratorium.
 
**Deskripsi.** Sistem mengambil informasi jadwal dan sesi dari Firestore untuk menampilkan aktivitas laboratorium berdasarkan waktu dan status sesi.
 
**Priority.** High.
 
**Acceptance criteria.**
 
1. Sistem menampilkan kegiatan praktikum yang sedang berlangsung.
2. Sistem menampilkan kegiatan praktikum berikutnya.
3. Informasi mencakup nama praktikum, kelas atau laboratorium, waktu, dan status sesi.
4. Data diperoleh dari Firestore.
5. Perubahan jadwal dan status sesi diperbarui sesuai data terbaru.
6. Sistem menampilkan empty state apabila tidak ada kegiatan yang sesuai.
**Estimasi.** M. **Owner.** P1. **Dependensi.** US-01, data sesi Sprint 2. **Status.** Belum dimulai.
 
#### US-05 Halaman presensi
 
**User story.** Sebagai praktikan, saya ingin memiliki halaman presensi tersendiri, supaya saya dapat melihat informasi sesi dan melakukan presensi dengan mudah.
 
**Deskripsi.** Halaman presensi menampilkan informasi sesi praktikum dan menyediakan akses ke fitur pemindaian QR Code.
 
**Priority.** High.
 
**Acceptance criteria.**
 
1. Sistem menyediakan halaman presensi.
2. Halaman menampilkan nama praktikum, kelas atau laboratorium, waktu, dan status sesi.
3. Halaman menyediakan tombol untuk memindai QR Code.
4. Sistem menampilkan hasil proses presensi.
5. Presensi hanya dapat dilakukan ketika sesi dibuka.
6. Tombol presensi memberikan informasi apabila sesi belum dibuka atau sudah ditutup.
**Estimasi.** S. **Owner.** P2. **Dependensi.** US-06, data sesi Sprint 2. **Status.** Belum dimulai.
 
#### US-06 Pemindaian QR Code
 
**User story.** Sebagai praktikan, saya ingin memindai QR Code sesi praktikum, supaya sistem dapat mengetahui sesi yang akan saya gunakan untuk presensi.
 
**Deskripsi.** Sistem menggunakan kamera perangkat untuk membaca QR Code. Data hasil pemindaian diteruskan ke proses validasi presensi.
 
**Priority.** High.
 
**Acceptance criteria.**
 
1. Sistem menyediakan fitur pemindaian QR Code.
2. Sistem meminta izin akses kamera.
3. Sistem dapat membaca QR Code yang valid.
4. QR Code harus memiliki informasi sesi yang dapat diverifikasi.
5. QR Code yang tidak valid ditolak.
6. QR Code yang sudah kedaluwarsa ditolak.
7. Sistem memberikan informasi apabila izin kamera ditolak atau kamera tidak dapat digunakan.
**Estimasi.** M. **Owner.** P2. **Dependensi.** PM-03, US-10. **Status.** Belum dimulai.
 
#### US-07 Validasi lokasi dan sesi presensi
 
**User story.** Sebagai praktikan, saya ingin sistem memeriksa lokasi dan status sesi sebelum mencatat presensi, supaya kehadiran hanya tercatat sesuai ketentuan.
 
**Deskripsi.** Sistem memvalidasi QR Code, status sesi, identitas praktikan, dan jarak perangkat terhadap lokasi laboratorium. Validasi harus menjadi bagian dari proses pencatatan data.
 
**Priority.** High.
 
**Acceptance criteria.**
 
1. Sistem memeriksa validitas QR Code.
2. Sistem memeriksa apakah sesi sedang dibuka.
3. Sistem memperoleh lokasi perangkat praktikan.
4. Sistem memperoleh koordinat dan radius laboratorium dari Firestore.
5. Sistem menghitung jarak antara posisi praktikan dan lokasi laboratorium.
6. Presensi hanya dapat dilanjutkan apabila posisi berada dalam radius yang diizinkan.
7. Sistem menolak presensi apabila pengguna berada di luar radius.
8. Sistem menolak presensi apabila lokasi tidak berhasil diperoleh.
9. Sistem menolak presensi apabila data lokasi laboratorium tidak tersedia.
10. Validasi dilakukan pada proses pencatatan presensi, bukan hanya pada UI.
11. Presensi yang tidak memenuhi ketentuan tidak disimpan.
**Estimasi.** L. **Owner.** P2. **Dependensi.** US-01, US-06. **Status.** Belum dimulai.
 
#### US-08 Pencatatan dan rekap presensi
 
**User story.** Sebagai praktikan, saya ingin presensi yang berhasil tersimpan ke sistem, dan sebagai asisten saya ingin melihat hasilnya pada rekap, supaya kehadiran tercatat dengan benar.
 
**Deskripsi.** Sistem menyimpan data presensi ke Firestore setelah seluruh validasi berhasil. Rekap presensi menggunakan data yang sama agar asisten dapat melihat hasil pencatatan.
 
**Priority.** High.
 
**Acceptance criteria.**
 
1. Presensi hanya disimpan setelah validasi berhasil.
2. Data presensi terhubung dengan identitas praktikan dan sesi.
3. Sistem mencegah praktikan melakukan presensi lebih dari satu kali pada sesi yang sama.
4. Presensi yang gagal divalidasi tidak disimpan.
5. Asisten dapat melihat hasil presensi pada halaman rekap.
6. Perubahan data presensi terlihat sesuai sinkronisasi Firestore.
7. Sistem menampilkan pesan apabila penyimpanan presensi gagal.
**Estimasi.** M. **Owner.** P2. **Dependensi.** US-07, Firestore. **Status.** Belum dimulai.
 
#### US-09 Pengelolaan sesi dan input waktu
 
**User story.** Sebagai asisten, saya ingin mengubah informasi sesi melalui modal popup, supaya pengelolaan jadwal praktikum lebih mudah.
 
**Deskripsi.** Form pengubahan sesi menggunakan modal popup. Field waktu dibuat khusus agar input dan validasinya lebih sesuai.
 
**Priority.** Medium.
 
**Acceptance criteria.**
 
1. Asisten dapat membuka modal untuk mengubah informasi sesi.
2. Form menampilkan data sesi yang akan diubah.
3. Input waktu menggunakan field khusus.
4. Format waktu divalidasi sebelum data disimpan.
5. Sistem menolak waktu yang tidak sesuai ketentuan.
6. Perubahan disimpan ke Firestore.
7. Sistem menampilkan pesan berhasil atau gagal setelah penyimpanan.
**Estimasi.** M. **Owner.** P2. **Dependensi.** Data sesi Sprint 2. **Status.** Belum dimulai.
 
#### US-10 Pembuatan QR Code sesi
 
**User story.** Sebagai asisten, saya ingin membuat QR Code berdasarkan sesi praktikum, supaya praktikan dapat menggunakannya untuk melakukan presensi.
 
**Deskripsi.** Sistem menghasilkan QR Code pada sisi asisten. QR Code harus memiliki informasi yang dapat digunakan untuk memeriksa sesi dan masa berlaku.
 
**Priority.** High.
 
**Acceptance criteria.**
 
1. Sistem menyediakan fitur pembuatan QR Code untuk sesi.
2. QR Code terhubung dengan identitas sesi praktikum.
3. QR Code memiliki masa berlaku.
4. QR Code ditampilkan pada halaman pengelolaan sesi.
5. QR Code dapat dibaca oleh fitur pemindaian praktikan.
6. QR Code yang tidak valid atau kedaluwarsa tidak dapat digunakan.
7. QR Code tidak boleh digunakan untuk mencatat presensi pada sesi yang berbeda.
**Estimasi.** M. **Owner.** P3. **Dependensi.** Kontrak QR dan data sesi. **Status.** Belum dimulai.
 
#### US-11 Notifikasi pembukaan sesi
 
**User story.** Sebagai praktikan, saya ingin menerima notifikasi ketika sesi praktikum dibuka, supaya saya mengetahui bahwa presensi sudah dapat dilakukan.
 
**Deskripsi.** Sistem mengirimkan notifikasi kepada praktikan yang terdaftar pada sesi ketika asisten membuka sesi.
 
**Priority.** High.
 
**Acceptance criteria.**
 
1. Sistem mengirimkan notifikasi ketika sesi berubah menjadi dibuka.
2. Notifikasi ditujukan kepada praktikan yang terdaftar pada sesi terkait.
3. Notifikasi menampilkan informasi sesi praktikum.
4. Sistem menangani kondisi izin notifikasi tidak diberikan.
5. Sistem tidak mengirimkan notifikasi berulang untuk satu kejadian pembukaan sesi yang sama.
**Estimasi.** M. **Owner.** P3. **Dependensi.** PM-04, US-14. **Status.** Belum dimulai.
 
#### US-12 Notifikasi perubahan jadwal
 
**User story.** Sebagai pengguna, saya ingin menerima notifikasi ketika jadwal praktikum berubah, supaya saya mendapatkan informasi terbaru.
 
**Deskripsi.** Sistem mengirimkan notifikasi kepada pengguna yang berkaitan dengan jadwal ketika terdapat perubahan data jadwal praktikum.
 
**Priority.** High.
 
**Acceptance criteria.**
 
1. Sistem mendeteksi perubahan jadwal praktikum.
2. Sistem mengirimkan notifikasi kepada pengguna yang berkaitan dengan jadwal.
3. Notifikasi menampilkan informasi perubahan jadwal.
4. Sistem tidak mengirimkan notifikasi kepada pengguna yang tidak berkaitan.
5. Sistem menangani kegagalan pengiriman notifikasi.
**Estimasi.** M. **Owner.** P3. **Dependensi.** US-14, data jadwal. **Status.** Belum dimulai.
 
#### US-13 Notifikasi keputusan izin
 
**User story.** Sebagai praktikan, saya ingin menerima notifikasi ketika pengajuan izin disetujui atau ditolak, supaya saya mengetahui hasil pengajuan.
 
**Deskripsi.** Sistem mengirimkan notifikasi kepada praktikan yang mengajukan izin ketika asisten mengubah status pengajuan.
 
**Priority.** High.
 
**Acceptance criteria.**
 
1. Sistem mengirimkan notifikasi ketika izin disetujui.
2. Sistem mengirimkan notifikasi ketika izin ditolak.
3. Notifikasi hanya dikirim kepada praktikan yang mengajukan izin.
4. Notifikasi menampilkan status keputusan izin.
5. Notifikasi dikirim berdasarkan perubahan status izin di Firestore.
6. Kegagalan notifikasi tidak membatalkan perubahan status izin.
**Estimasi.** M. **Owner.** P3. **Dependensi.** US-14, data izin Sprint 2. **Status.** Belum dimulai.
 
#### US-14 Pengelolaan push notification
 
**User story.** Sebagai pengguna, saya ingin aplikasi mengelola notifikasi dengan baik, supaya informasi penting dapat diterima sesuai kondisi perangkat.
 
**Deskripsi.** Sistem mengelola izin notifikasi, token perangkat, serta mekanisme pengiriman notifikasi. Integrasi dilakukan dengan Firebase Cloud Messaging atau mekanisme yang disepakati berdasarkan dukungan platform.
 
**Priority.** High.
 
**Acceptance criteria.**
 
1. Sistem meminta izin notifikasi kepada pengguna.
2. Sistem mengelola token perangkat untuk kebutuhan pengiriman notifikasi.
3. Sistem dapat mengirimkan notifikasi melalui mekanisme yang disepakati.
4. Sistem menangani token yang tidak tersedia atau tidak valid.
5. Sistem menangani kegagalan pengiriman notifikasi.
6. Sistem mendukung penanganan notifikasi ketika aplikasi berada di foreground maupun background sesuai dukungan platform.
7. Sistem mencegah pemrosesan event yang sama menghasilkan notifikasi berulang.
8. Pengiriman notifikasi ditujukan berdasarkan pengguna atau kelompok pengguna yang berkaitan.
**Estimasi.** L. **Owner.** P3. **Dependensi.** PM-04, konfigurasi notifikasi. **Status.** Belum dimulai.
 
#### US-15 Pencarian peserta praktikum
 
**User story.** Sebagai asisten, saya ingin mencari peserta praktikum, supaya saya dapat menemukan data peserta dengan lebih mudah.
 
**Priority.** Medium.
 
**Acceptance criteria.**
 
1. Sistem menyediakan kolom pencarian peserta.
2. Pencarian dapat dilakukan berdasarkan informasi identitas peserta yang tersedia.
3. Hasil pencarian menampilkan peserta yang sesuai dengan kata kunci.
4. Sistem menampilkan informasi apabila peserta tidak ditemukan.
5. Pencarian tidak mengubah data peserta.
**Estimasi.** S. **Owner.** P3. **Dependensi.** Data peserta Sprint 2. **Status.** Belum dimulai.
 
#### US-16 Filter kategori pengajuan izin
 
**User story.** Sebagai asisten, saya ingin memfilter pengajuan izin berdasarkan kategori, supaya saya dapat memeriksa pengajuan dengan lebih mudah.
 
**Priority.** Medium.
 
**Acceptance criteria.**
 
1. Sistem menyediakan pilihan filter kategori izin.
2. Asisten dapat memilih kategori yang tersedia.
3. Sistem menampilkan pengajuan sesuai kategori yang dipilih.
4. Sistem dapat menampilkan seluruh pengajuan ketika filter dihapus.
5. Filter tidak mengubah data pengajuan izin.
**Estimasi.** S. **Owner.** P3. **Dependensi.** Data izin Sprint 2. **Status.** Belum dimulai.
 
#### US-17 Penyempurnaan halaman rekap presensi
 
**User story.** Sebagai asisten, saya ingin bagian atas halaman rekap presensi lebih informatif, supaya informasi utama dapat dilihat dengan lebih mudah.
 
**Priority.** Medium.
 
**Acceptance criteria.**
 
1. Bagian atas halaman rekap diperbaiki.
2. Informasi utama rekap ditampilkan dengan susunan yang jelas.
3. Tampilan mengikuti design system aplikasi.
4. Perbaikan tidak menghilangkan fungsi rekap yang sudah tersedia.
5. Tampilan diuji pada ukuran layar yang didukung.
**Estimasi.** S. **Owner.** P3. **Dependensi.** Halaman rekap Sprint 2. **Status.** Belum dimulai.
 
#### US-18 Validasi input dan penyempurnaan UI/UX
 
**User story.** Sebagai pengguna, saya ingin setiap input memiliki validasi yang sesuai, supaya kesalahan pengisian data dapat dikurangi.
 
**Priority.** High.
 
**Acceptance criteria.**
 
1. NIM praktikan divalidasi menggunakan 14 digit.
2. NIM asisten divalidasi berdasarkan format yang disepakati kelompok.
3. Input waktu memiliki validasi format dan nilai.
4. Input wajib tidak boleh kosong.
5. Sistem menampilkan pesan kesalahan yang mudah dipahami.
6. Validasi diterapkan sebelum data disimpan.
7. Tampilan fitur baru mengikuti konsistensi UI/UX aplikasi.
8. Validasi tidak menghilangkan fungsi yang sudah tersedia dari Sprint sebelumnya.
**Estimasi.** M. **Owner.** P3. **Dependensi.** Form terkait. **Status.** Belum dimulai.
 
## 5. Technical Tasks
 
Kolom owner menggunakan kode P1, P2, dan P3. Seluruh task harus memenuhi Definition of Done pada bagian 10.
 
### US-01 Pengelolaan lokasi laboratorium
 
| Task | Deskripsi | Deliverable | Kriteria selesai | Owner | Dependensi |
|---|---|---|---|---|---|
| T-001 | Menentukan data koordinat dan radius Lab B, C, D, dan AP berdasarkan Google Maps | Data lokasi laboratorium | Seluruh laboratorium memiliki data lokasi | P1 | PM-01 |
| T-002 | Membuat struktur data lokasi laboratorium pada Firestore | Koleksi lokasi laboratorium | Data dapat dibaca dari aplikasi | P1 | T-001 |
| T-003 | Membuat tipe data dan fungsi pembacaan lokasi laboratorium | Modul lokasi | Data memiliki tipe yang konsisten | P1 | T-002 |
| T-004 | Membuat enum dan dropdown pilihan Lab B, C, D, dan AP | Komponen pilihan lab | Pilihan hanya berisi nilai yang disepakati | P1 | T-003 |
| T-005 | Menguji pembacaan data lokasi dan kondisi data kosong | Catatan pengujian | Data valid terbaca dan kondisi gagal tertangani | P1 | T-003 |
 
### US-02 Maps laboratorium
 
| Task | Deskripsi | Deliverable | Kriteria selesai | Owner | Dependensi |
|---|---|---|---|---|---|
| T-006 | Menyiapkan dependency dan konfigurasi Maps sesuai platform | Konfigurasi Maps | Maps dapat dijalankan pada platform yang didukung | P1 | PM-03 |
| T-007 | Membuat halaman Maps dan menampilkan peta | Halaman Maps | Peta tampil tanpa error | P1 | T-006 |
| T-008 | Mengambil data lokasi dari Firestore dan menampilkan marker laboratorium | Marker laboratorium | Marker sesuai koordinat | P1 | T-003, T-007 |
| T-009 | Membuat interaksi pemilihan marker dan informasi laboratorium | Detail marker | Informasi muncul saat marker dipilih | P1 | T-008 |
| T-010 | Menguji kondisi data lokasi kosong dan gagal dimuat | Catatan pengujian | State kosong dan gagal tampil | P1 | T-009 |
 
### US-03 Geolocation pengguna
 
| Task | Deskripsi | Deliverable | Kriteria selesai | Owner | Dependensi |
|---|---|---|---|---|---|
| T-011 | Mengintegrasikan library geolocation yang sesuai dengan Expo dan platform target (rencana awal: `expo-location`) | Modul lokasi perangkat | Lokasi dapat diperoleh pada platform yang didukung | P1 | PM-03 |
| T-012 | Membuat fungsi permintaan izin lokasi | Permission handler | Izin lokasi ditangani | P1 | T-011 |
| T-013 | Menampilkan marker posisi pengguna pada Maps | Marker pengguna | Posisi pengguna terlihat pada peta | P1 | T-007, T-011 |
| T-014 | Mengatur pembaruan posisi selama halaman Maps aktif | Pembaruan lokasi | Posisi diperbarui dan proses dihentikan saat halaman tidak aktif | P1 | T-013 |
| T-015 | Menangani izin ditolak, GPS mati, dan lokasi gagal diperoleh | Penanganan error | Pengguna mendapat pesan yang sesuai | P1 | T-012 |
 
### US-04 Aktivitas laboratorium
 
| Task | Deskripsi | Deliverable | Kriteria selesai | Owner | Dependensi |
|---|---|---|---|---|---|
| T-016 | Membuat fungsi pengambilan jadwal dan sesi berdasarkan laboratorium | Modul aktivitas | Data sesuai laboratorium | P1 | T-003 |
| T-017 | Menentukan aktivitas yang sedang berlangsung dan berikutnya berdasarkan waktu serta status sesi | Logika aktivitas | Aktivitas ditampilkan sesuai data | P1 | T-016 |
| T-018 | Membuat komponen informasi aktivitas laboratorium | Komponen aktivitas | Nama praktikum, kelas/lab, waktu, dan status tampil | P1 | T-017 |
| T-019 | Mengintegrasikan data aktivitas dengan halaman Maps | Informasi aktivitas Maps | Data tampil pada laboratorium yang sesuai | P1 | T-018 |
| T-020 | Menguji kondisi tidak ada aktivitas dan perubahan jadwal | Catatan pengujian | Empty state dan pembaruan data berjalan | P1 | T-019 |
 
### US-05 Halaman presensi
 
| Task | Deskripsi | Deliverable | Kriteria selesai | Owner | Dependensi |
|---|---|---|---|---|---|
| T-021 | Membuat halaman presensi praktikan | Halaman presensi | Halaman dapat dibuka dari navigasi praktikan | P2 | Data sesi |
| T-022 | Menampilkan informasi sesi pada halaman presensi | Informasi sesi | Nama praktikum, lab/kelas, waktu, dan status tampil | P2 | T-021 |
| T-023 | Menghubungkan tombol presensi dengan halaman pemindaian QR | Navigasi scanner | Praktikan dapat membuka scanner | P2 | US-06 |
| T-024 | Membuat tampilan hasil presensi dan pesan kesalahan | Feedback presensi | Hasil berhasil atau gagal terlihat jelas | P2 | T-021 |
 
### US-06 Pemindaian QR Code
 
| Task | Deskripsi | Deliverable | Kriteria selesai | Owner | Dependensi |
|---|---|---|---|---|---|
| T-025 | Menentukan library pemindaian QR yang sesuai dengan Expo dan platform target | Konfigurasi scanner | Library berjalan pada platform yang didukung | P2 | PM-03 |
| T-026 | Membuat halaman scanner dan tampilan kamera | Halaman scanner | Kamera dapat digunakan | P2 | T-025 |
| T-027 | Mengimplementasikan permintaan izin kamera | Permission handler | Izin kamera ditangani | P2 | T-026 |
| T-028 | Membaca data QR Code dan meneruskannya ke fungsi validasi | Fungsi pembacaan QR | Data QR dapat dibaca dan diproses | P2 | T-026, US-10 |
| T-029 | Menangani QR tidak valid, kamera gagal, dan izin ditolak | Penanganan error | Pesan kesalahan tampil sesuai kondisi | P2 | T-027, T-028 |
 
### US-07 Validasi lokasi dan sesi
 
| Task | Deskripsi | Deliverable | Kriteria selesai | Owner | Dependensi |
|---|---|---|---|---|---|
| T-030 | Menyepakati kontrak data QR bersama P3 | Kontrak QR | Field dan masa berlaku disepakati | P2 | P3 |
| T-031 | Membuat fungsi validasi identitas QR dan sesi | Validator QR | QR harus sesuai dengan sesi | P2 | T-028, T-030 |
| T-032 | Mengambil lokasi perangkat dan data koordinat laboratorium | Data validasi lokasi | Kedua data tersedia sebelum validasi | P2 | P1 |
| T-033 | Mengimplementasikan perhitungan jarak antara pengguna dan laboratorium (rencana awal: Haversine) | Fungsi validasi radius | Jarak dapat dibandingkan dengan radius | P2 | T-032 |
| T-034 | Menggabungkan validasi QR, status sesi, peserta, dan lokasi pada proses presensi | Fungsi validasi presensi | Seluruh ketentuan diperiksa sebelum pencatatan | P2 | T-031, T-033 |
| T-035 | Menolak pencatatan apabila salah satu validasi gagal | Penanganan presensi tidak valid | Data tidak tersimpan saat validasi gagal | P2 | T-034 |
| T-036 | Menguji lokasi di dalam radius, di luar radius, GPS mati, dan sesi tertutup | Catatan pengujian | Seluruh kondisi ditangani | P2 | T-035 |
 
### US-08 Pencatatan dan rekap presensi
 
| Task | Deskripsi | Deliverable | Kriteria selesai | Owner | Dependensi |
|---|---|---|---|---|---|
| T-037 | Membuat fungsi pencatatan presensi ke Firestore setelah validasi berhasil | Modul presensi | Data tersimpan sesuai struktur | P2 | T-034 |
| T-038 | Mengimplementasikan pencegahan presensi ganda | Validasi duplikat | Praktikan hanya dapat presensi sekali pada sesi yang sama | P2 | T-037 |
| T-039 | Menghubungkan hasil presensi dengan halaman rekap asisten | Integrasi rekap | Asisten dapat melihat presensi terbaru | P2 | T-037 |
| T-040 | Menangani kegagalan jaringan dan penyimpanan | Penanganan error | Pengguna menerima informasi kegagalan | P2 | T-037 |
| T-041 | Menguji presensi valid, tidak valid, dan duplikat | Catatan pengujian | Seluruh skenario sesuai acceptance criteria | P2 | T-038, T-039 |
 
### US-09 Pengelolaan sesi dan waktu
 
| Task | Deskripsi | Deliverable | Kriteria selesai | Owner | Dependensi |
|---|---|---|---|---|---|
| T-042 | Membuat modal popup untuk mengubah informasi sesi | Modal edit sesi | Modal dapat dibuka dan ditutup | P2 | Data sesi Sprint 2 |
| T-043 | Membuat field input waktu khusus | Komponen input waktu | Waktu dapat dipilih atau dimasukkan | P2 | T-042 |
| T-044 | Menambahkan validasi format dan nilai waktu | Validasi waktu | Input tidak valid ditolak | P2 | T-043 |
| T-045 | Menghubungkan modal dengan fungsi update sesi Firestore | Integrasi edit sesi | Perubahan tersimpan | P2 | T-044 |
| T-046 | Menguji perubahan sesi dan kegagalan penyimpanan | Catatan pengujian | Hasil berhasil dan gagal tertangani | P2 | T-045 |
 
### US-10 QR Code generator
 
| Task | Deskripsi | Deliverable | Kriteria selesai | Owner | Dependensi |
|---|---|---|---|---|---|
| T-047 | Menentukan format data QR bersama P2 | Kontrak QR | Struktur data disepakati kedua programmer | P3 | P2 |
| T-048 | Membuat fungsi pembuatan QR Code berdasarkan sesi | Modul QR generator | QR terhubung dengan sesi yang benar | P3 | T-047 |
| T-049 | Menentukan dan menerapkan masa berlaku QR Code | Validasi masa berlaku | QR memiliki batas penggunaan | P3 | T-048 |
| T-050 | Menampilkan QR Code pada halaman asisten | Tampilan QR | QR dapat ditampilkan dan dipindai | P3 | T-048 |
| T-051 | Menguji QR valid, tidak valid, dan kedaluwarsa | Catatan pengujian | Semua kondisi ditangani | P3 | T-049, T-050 |
 
### US-11 Notifikasi pembukaan sesi
 
| Task | Deskripsi | Deliverable | Kriteria selesai | Owner | Dependensi |
|---|---|---|---|---|---|
| T-052 | Menentukan event perubahan status sesi menjadi dibuka | Event pembukaan sesi | Event dapat dikenali | P3 | Data sesi |
| T-053 | Menghubungkan event pembukaan sesi dengan mekanisme notifikasi | Trigger notifikasi | Notifikasi diproses saat sesi dibuka | P3 | US-14 |
| T-054 | Menentukan penerima berdasarkan peserta sesi | Target penerima | Hanya praktikan terkait yang menjadi penerima | P3 | Data peserta |
| T-055 | Menguji pengiriman dan pencegahan notifikasi berulang | Catatan pengujian | Event yang sama tidak menghasilkan notifikasi ganda | P3 | T-053 |
 
### US-12 Notifikasi perubahan jadwal
 
| Task | Deskripsi | Deliverable | Kriteria selesai | Owner | Dependensi |
|---|---|---|---|---|---|
| T-056 | Menentukan event perubahan jadwal praktikum | Event jadwal | Perubahan jadwal dapat dikenali | P3 | Data jadwal |
| T-057 | Menghubungkan perubahan jadwal dengan trigger notifikasi | Trigger jadwal | Notifikasi diproses ketika jadwal berubah | P3 | US-14 |
| T-058 | Menentukan penerima berdasarkan kelas atau sesi terkait | Target penerima | Penerima sesuai data keanggotaan | P3 | Data peserta |
| T-059 | Menguji notifikasi perubahan jadwal | Catatan pengujian | Notifikasi dan penerima sesuai | P3 | T-057 |
 
### US-13 Notifikasi keputusan izin
 
| Task | Deskripsi | Deliverable | Kriteria selesai | Owner | Dependensi |
|---|---|---|---|---|---|
| T-060 | Menentukan event perubahan status izin menjadi disetujui atau ditolak | Event keputusan izin | Perubahan status dapat dikenali | P3 | Data izin |
| T-061 | Menghubungkan keputusan izin dengan trigger notifikasi | Trigger izin | Notifikasi diproses setelah keputusan | P3 | US-14 |
| T-062 | Menentukan penerima berdasarkan praktikan pemilik pengajuan | Target penerima | Hanya pengaju izin yang menerima | P3 | Data izin |
| T-063 | Menguji notifikasi keputusan izin | Catatan pengujian | Notifikasi sesuai keputusan | P3 | T-061 |
 
### US-14 Pengelolaan push notification
 
| Task | Deskripsi | Deliverable | Kriteria selesai | Owner | Dependensi |
|---|---|---|---|---|---|
| T-064 | Menentukan mekanisme push notification yang sesuai dengan Expo dan platform target | Keputusan teknis notifikasi | Mekanisme dan batasan platform terdokumentasi | P3 | PM-04 |
| T-065 | Mengimplementasikan permintaan izin notifikasi | Permission handler | Izin notifikasi dapat diminta dan ditangani | P3 | T-064 |
| T-066 | Mengelola token perangkat untuk pengiriman notifikasi | Modul token perangkat | Token tersedia dan dapat diperbarui | P3 | T-065 |
| T-067 | Mengintegrasikan mekanisme pengiriman notifikasi (rencana awal: FCM dan Cloud Functions) | Modul notifikasi | Notifikasi dapat dikirim ke perangkat uji | P3 | T-066 |
| T-068 | Mengimplementasikan penanganan notifikasi foreground dan background sesuai dukungan platform | Handler notifikasi | Notifikasi ditangani pada kondisi yang didukung | P3 | T-067 |
| T-069 | Menangani token tidak valid, kegagalan jaringan, dan kegagalan pengiriman | Penanganan error | Kegagalan tidak menghentikan aplikasi | P3 | T-067 |
| T-070 | Mengimplementasikan idempotensi event notifikasi | Pencegahan duplikat | Event yang sama tidak diproses berulang | P3 | T-067 |
| T-071 | Menguji penerimaan notifikasi pada platform yang didukung | Catatan pengujian | Pengiriman dan penerimaan sesuai hasil pengujian | P3 | T-068, T-070 |
 
### US-15 Pencarian peserta
 
| Task | Deskripsi | Deliverable | Kriteria selesai | Owner | Dependensi |
|---|---|---|---|---|---|
| T-072 | Menambahkan kolom pencarian pada daftar peserta | Komponen pencarian | Kolom pencarian tampil | P3 | Data peserta Sprint 2 |
| T-073 | Mengimplementasikan pencarian berdasarkan identitas peserta | Fungsi pencarian | Hasil sesuai kata kunci | P3 | T-072 |
| T-074 | Menambahkan kondisi hasil tidak ditemukan | Empty state pencarian | Pesan tampil saat tidak ada hasil | P3 | T-073 |
 
### US-16 Filter kategori izin
 
| Task | Deskripsi | Deliverable | Kriteria selesai | Owner | Dependensi |
|---|---|---|---|---|---|
| T-075 | Menambahkan pilihan filter kategori izin | Komponen filter | Pilihan kategori tampil | P3 | Data izin Sprint 2 |
| T-076 | Mengimplementasikan penyaringan berdasarkan kategori | Fungsi filter | Hasil sesuai kategori | P3 | T-075 |
| T-077 | Menambahkan opsi untuk menampilkan seluruh pengajuan | Reset filter | Seluruh data tampil kembali | P3 | T-076 |
 
### US-17 Penyempurnaan rekap presensi
 
| Task | Deskripsi | Deliverable | Kriteria selesai | Owner | Dependensi |
|---|---|---|---|---|---|
| T-078 | Meninjau tampilan bagian atas halaman rekap | Catatan UI | Bagian yang perlu diperbaiki teridentifikasi | P3 | Halaman rekap Sprint 2 |
| T-079 | Memperbaiki susunan informasi utama rekap | UI rekap baru | Informasi lebih jelas dan terstruktur | P3 | T-078 |
| T-080 | Menguji tampilan pada ukuran layar yang didukung | Catatan pengujian | Tidak ada komponen terpotong | P3 | T-079 |
 
### US-18 Validasi input dan UI/UX
 
| Task | Deskripsi | Deliverable | Kriteria selesai | Owner | Dependensi |
|---|---|---|---|---|---|
| T-081 | Menambahkan validasi NIM praktikan 14 digit | Validasi NIM | NIM dengan jumlah digit tidak sesuai ditolak | P3 | Form terkait |
| T-082 | Menambahkan validasi NIM asisten sesuai format yang disepakati | Validasi NIM asisten | Format mengikuti keputusan kelompok | P3 | PM-09 |
| T-083 | Menambahkan validasi input wajib dan input waktu pada form terkait | Validasi form | Input tidak valid ditolak | P3 | US-09 |
| T-084 | Menambahkan pesan kesalahan pada input yang tidak valid | Feedback validasi | Pesan mudah dipahami | P3 | T-081, T-082, T-083 |
| T-085 | Meninjau konsistensi komponen UI/UX fitur Sprint 3 | Penyempurnaan UI | Tampilan konsisten dengan aplikasi | P3 | Seluruh fitur |
| T-086 | Menguji validasi dan tampilan pada platform yang didukung | Catatan pengujian | Seluruh validasi berjalan | P3 | T-084, T-085 |
 
## 6. Programmer Assignment
 
Pembagian memakai pendekatan vertical slicing: satu programmer memiliki satu alur fungsional dari UI, logika, integrasi data, validasi, penanganan error, sampai pengujian. Tidak ada pembagian berdasarkan jenis file.
 
### 6.1 Programmer 1: Anggita Kirana Puspa
 
**Primary responsibility.** Maps, lokasi laboratorium, geolocation, dan informasi aktivitas laboratorium.
 
| User Story | Technical Tasks | Expected Deliverable |
|---|---|---|
| US-01 | T-001 sampai T-005 | Data koordinat dan radius Lab B, C, D, AP tersimpan di Firestore serta pilihan lab tersedia |
| US-02 | T-006 sampai T-010 | Halaman Maps dengan marker dan informasi laboratorium |
| US-03 | T-011 sampai T-015 | Posisi pengguna tampil dan diperbarui selama halaman Maps aktif (hook `useLocation()` berbasis `expo-location`, rencana awal) |
| US-04 | T-016 sampai T-020 | Informasi kegiatan yang sedang berlangsung dan berikutnya tampil berdasarkan Firestore |
 
**Dependencies.** Membutuhkan koordinat laboratorium yang disepakati dan konfigurasi Maps. P1 harus mengomunikasikan kontrak data lokasi serta fungsi pembacaan koordinat kepada P2 sebelum integrasi validasi presensi.
 
**Testing responsibility.** Pengujian marker laboratorium, data koordinat, izin lokasi, GPS mati, pembaruan lokasi, data aktivitas kosong, dan perubahan jadwal.
 
### 6.2 Programmer 2: Dehar Zaidan Dzaki Amirullah
 
**Primary responsibility.** Presensi berbasis lokasi dan QR Code, validasi presensi, serta pengelolaan sesi.
 
| User Story | Technical Tasks | Expected Deliverable |
|---|---|---|
| US-05 | T-021 sampai T-024 | Halaman presensi dengan informasi sesi dan hasil presensi |
| US-06 | T-025 sampai T-029 | QR scanner dengan penanganan izin kamera |
| US-07 | T-030 sampai T-036 | Validasi QR, status sesi, identitas, dan radius lokasi |
| US-08 | T-037 sampai T-041 | Pencatatan presensi ke Firestore dan pencegahan presensi ganda |
| US-09 | T-042 sampai T-046 | Modal edit sesi dan input waktu dengan validasi |
 
**Dependencies.** Membutuhkan kontrak data lokasi dari P1 dan kontrak QR Code dari P3. P2 harus menyepakati format QR dan masa berlakunya bersama P3 sebelum proses integrasi scanner dan generator.
 
**Testing responsibility.** Pengujian QR valid dan tidak valid, izin kamera, sesi dibuka dan ditutup, lokasi di dalam dan di luar radius, GPS mati, presensi ganda, serta perubahan sesi.
 
### 6.3 Programmer 3: Devano Trestanto
 
**Primary responsibility.** QR Code generator, push notification, dan penyempurnaan UI/UX.
 
| User Story | Technical Tasks | Expected Deliverable |
|---|---|---|
| US-10 | T-047 sampai T-051 | QR Code sesi dapat dibuat dan ditampilkan |
| US-11 | T-052 sampai T-055 | Notifikasi pembukaan sesi dikirim ke praktikan terkait |
| US-12 | T-056 sampai T-059 | Notifikasi perubahan jadwal dikirim ke pengguna terkait |
| US-13 | T-060 sampai T-063 | Notifikasi keputusan izin dikirim ke praktikan pengaju |
| US-14 | T-064 sampai T-071 | Mekanisme push notification, pengelolaan token, dan penanganan kegagalan |
| US-15 | T-072 sampai T-074 | Pencarian peserta praktikum |
| US-16 | T-075 sampai T-077 | Filter kategori pengajuan izin |
| US-17 | T-078 sampai T-080 | Penyempurnaan bagian atas halaman rekap |
| US-18 | T-081 sampai T-086 | Validasi input dan penyempurnaan UI/UX |
 
**Dependencies.** Membutuhkan keputusan mekanisme push notification dan akses konfigurasi dari PM. P3 harus berkoordinasi dengan P2 untuk menyepakati format QR Code. Trigger notifikasi harus dihubungkan dengan perubahan data sesi dan izin yang dikerjakan programmer terkait.
 
**Testing responsibility.** Pengujian QR generator, penerimaan notifikasi, penerima notifikasi, event duplikat, token perangkat, pencarian peserta, filter izin, validasi NIM, validasi waktu, dan UI/UX.
 
### 6.4 Koordinasi dan keseimbangan pekerjaan
 
| Programmer | Story | Estimasi total | Fokus kompleksitas |
|---|---|---|---|
| P1 Anggita | 4 | 4 M | Maps, koordinat laboratorium, geolocation, dan pengambilan data aktivitas |
| P2 Dehar | 5 | 1 S + 3 M + 1 L | QR scanner, validasi lokasi, pencatatan presensi, dan pengelolaan sesi |
| P3 Devano | 9 | 3 S + 5 M + 1 L | QR generator, integrasi push notification, pencarian, filter, rekap, dan validasi UI/UX |
 
Jumlah User Story tidak selalu menunjukkan beban pekerjaan yang sama. P2 memiliki proses validasi presensi yang cukup kompleks, sedangkan P3 memiliki lebih banyak story yang sebagian berupa penyempurnaan tampilan dan fitur pendukung. Estimasi dan perkembangan setiap task harus diperiksa PM setiap hari agar pekerjaan tidak menumpuk pada akhir sprint.
 
**Aturan koordinasi antarprogrammer.**
 
1. P1 dan P2 menyepakati struktur data koordinat, radius laboratorium, dan fungsi validasi lokasi.
2. P2 dan P3 menyepakati struktur QR Code, identitas sesi, dan masa berlaku QR.
3. P1, P2, dan P3 menggunakan kontrak data Firestore yang disepakati bersama.
4. P3 berkoordinasi dengan P1 dan P2 untuk menghubungkan event perubahan data dengan notifikasi.
5. Programmer wajib menguji fitur masing-masing sebelum integrasi.
6. Perubahan struktur data atau dependency harus diumumkan kepada anggota lain.
7. Perubahan lintas fitur harus disetujui PM sebelum diterapkan.
### 6.5 Koordinasi dan workflow
 
Workflow Git Sprint sebelumnya dipertahankan: branch mengikuti format `<type>/<owner>-<area>-<slug>`, menggunakan Conventional Commits, pull request, review, dan squash merge sesuai `docs/GIT-WORKFLOW.md`.
 
Tambahan untuk Sprint 3:
 
| Topik | Aturan |
|---|---|
| Kontrak lokasi | P1 dan P2 harus menyepakati struktur koordinat dan radius sebelum validasi presensi diintegrasikan |
| Kontrak QR | P2 dan P3 harus menyepakati format data, identitas sesi, dan masa berlaku QR |
| Struktur Firestore | Perubahan koleksi atau field harus diumumkan kepada seluruh anggota |
| Dependency baru | Pemasangan dependency dikoordinasikan dengan PM dan disesuaikan dengan versi Expo |
| Konfigurasi perangkat | Perubahan konfigurasi kamera, lokasi, Maps, dan notifikasi harus dikomunikasikan sebelum diuji |
| Review | Perubahan pada fitur milik programmer lain harus direview pemilik fitur terkait |
| Pengujian | Setiap programmer menguji fitur sendiri sebelum digabungkan |
| Integrasi | Pengujian end-to-end dilakukan bersama setelah fitur utama tersedia |
 
## 7. Project Manager Responsibilities
 
Pekerjaan PM terpisah dari backlog programmer dan harus selesai sebelum atau bersamaan dengan D1.
 
| ID | Pekerjaan | Output | Kriteria selesai | Target |
|---|---|---|---|---|
| PM-01 | Memastikan project Firebase Sprint 2 masih aktif dan dapat digunakan | Project Firebase siap | Authentication dan Firestore dapat diakses | D1 pagi |
| PM-02 | Mengumpulkan dan menetapkan koordinat serta radius Lab B, C, D, dan AP berdasarkan Google Maps bersama tim | Data lokasi yang disepakati | Seluruh titik dan radius sudah dikonfirmasi | D1 pagi |
| PM-03 | Menentukan library Maps, geolocation, dan QR scanner yang sesuai dengan Expo SDK serta platform target | Keputusan dependency | Kompatibilitas dan kebutuhan konfigurasi diketahui | D1 pagi |
| PM-04 | Menentukan mekanisme push notification, konfigurasi Firebase/FCM, dan kebutuhan layanan tambahan | Konfigurasi notifikasi | Mekanisme pengiriman dan pengujian disepakati | D1 pagi |
| PM-05 | Menyepakati struktur koleksi dan field Firestore tambahan untuk lokasi laboratorium, QR, dan token perangkat | Kontrak data | P1, P2, dan P3 menggunakan struktur yang sama | D1 siang |
| PM-06 | Memastikan izin kamera, lokasi, dan notifikasi tercantum pada konfigurasi platform yang diperlukan | Konfigurasi permission | Permission dapat diminta pada perangkat uji | D1 siang |
| PM-07 | Menyediakan akun dan data uji praktikan, asisten, kelas, sesi, jadwal, dan izin | Data pengujian | Data dapat digunakan untuk tiga alur demo | D1 siang |
| PM-08 | Menentukan aturan masa berlaku QR dan format data QR bersama P2 dan P3 | Keputusan QR | Format dan aturan penggunaan disepakati | D1 siang |
| PM-09 | Menentukan format validasi NIM asisten bersama kelompok | Ketentuan NIM asisten | Format tertulis dan disepakati | D1 siang |
| PM-10 | Memeriksa integrasi Maps, lokasi, QR, dan notifikasi pada platform target | Catatan integrasi | Kendala platform tercatat dan memiliki penanganan | D3 |
| PM-11 | Melakukan QA terhadap tiga alur demo utama | Checklist pengujian | Semua alur diuji dan hasil dicatat | D4 |
| PM-12 | Mengelola perbaikan bug dan kesiapan demo akhir | Catatan bug dan hasil demo | Tidak ada bug kritis yang menghambat demo | D4 |
 
**Titik koordinasi PM dan programmer.**
 
1. D1 pagi: PM mengumumkan kontrak data lokasi, daftar dependency, dan konfigurasi yang akan digunakan.
2. D1 siang: P1, P2, dan P3 menyepakati struktur data lokasi, QR Code, serta token perangkat.
3. D2: PM memeriksa progres implementasi dan memastikan fitur yang saling bergantung sudah dapat diintegrasikan.
4. D3: PM menjalankan pengujian integrasi awal pada tiga alur demo.
5. D4: PM menjalankan QA akhir dan memastikan seluruh acceptance criteria telah diperiksa.
## 8. Technical Decisions and Dependencies
 
### 8.1 Integrasi Firebase
 
Sprint 3 melanjutkan penggunaan Firebase Authentication dan Cloud Firestore dari Sprint 2.
 
Keputusan:
 
- Firebase Authentication tetap digunakan untuk identitas pengguna.
- Cloud Firestore menjadi sumber data lokasi laboratorium, jadwal, sesi, presensi, dan izin.
- Struktur koleksi Sprint 2 dipertahankan selama masih sesuai kebutuhan.
- Data baru tidak boleh membuat duplikasi informasi yang sudah tersedia.
- Perubahan data yang digunakan beberapa fitur harus dikoordinasikan terlebih dahulu.
### 8.2 Maps dan geolocation
 
- Sistem menggunakan Google Maps atau library yang sesuai dengan konfigurasi Expo dan platform target.
- Koordinat laboratorium disimpan di Firestore.
- Setiap laboratorium memiliki radius yang digunakan dalam validasi presensi.
- Posisi pengguna diperoleh dari layanan lokasi perangkat (rencana awal: `expo-location`).
- Jarak pengguna ke laboratorium dihitung dengan rumus Haversine (rencana awal).
- Pembaruan posisi dilakukan selama halaman Maps aktif.
- Izin lokasi harus diminta sebelum mengambil posisi pengguna.
- Ketika layanan lokasi tidak aktif atau izin ditolak, sistem menampilkan pesan yang sesuai.
**Hal yang harus dipastikan PM dan P1:**
 
| Item | Status |
|---|---|
| Koordinat Lab B | Perlu dikonfirmasi |
| Koordinat Lab C | Perlu dikonfirmasi |
| Koordinat Lab D | Perlu dikonfirmasi |
| Koordinat AP | Perlu dikonfirmasi |
| Radius setiap laboratorium | Perlu disepakati |
| Library Maps yang digunakan | Perlu diverifikasi |
| Dukungan Maps pada Web | Perlu diverifikasi |
 
### 8.3 Struktur data lokasi laboratorium
 
Struktur awal yang diusulkan untuk disepakati sebelum implementasi:
 
```text
laboratorium/{labId}
  nama: string
  latitude: number
  longitude: number
  radius: number
  diperbaruiPada: Timestamp
```
 
Ketentuan:
 
- `labId` merepresentasikan Lab B, Lab C, Lab D, atau AP.
- `latitude` dan `longitude` menyimpan koordinat laboratorium.
- `radius` menyimpan batas jarak yang digunakan untuk validasi presensi.
- Nilai radius harus menggunakan satuan yang sama pada seluruh proses validasi.
- Data lokasi hanya boleh menggunakan nilai yang sudah disepakati kelompok.
Struktur ini merupakan usulan awal dan harus dikonfirmasi sebelum dipakai bersama.
 
### 8.4 QR Code dan validasi presensi
 
Alur umum presensi:
 
```text
Asisten membuka sesi
        |
        v
Sistem membuat QR Code
        |
        v
Praktikan memindai QR Code
        |
        v
Validasi QR dan masa berlaku
        |
        v
Validasi status sesi
        |
        v
Mengambil lokasi perangkat
        |
        v
Validasi radius laboratorium
        |
        v
Mencegah presensi ganda
        |
        v
Menyimpan presensi ke Firestore
        |
        v
Asisten melihat hasil pada rekap
```
 
Ketentuan:
 
- QR Code harus terhubung dengan sesi praktikum.
- QR Code memiliki masa berlaku.
- QR Code yang tidak valid atau kedaluwarsa ditolak.
- Presensi hanya dapat dilakukan ketika sesi dibuka.
- Lokasi praktikan harus berada dalam radius laboratorium yang sesuai.
- Sistem menolak presensi ganda.
- Data tidak boleh disimpan jika salah satu validasi gagal.
**Hal yang belum ditentukan dan harus disepakati:**
 
| Item | Status |
|---|---|
| Format payload QR Code | Perlu disepakati P2 dan P3 |
| Cara memverifikasi QR Code | Perlu disepakati |
| Masa berlaku QR Code | Perlu ditentukan |
| Apakah QR dibuat ulang ketika sesi dibuka kembali | Perlu ditentukan sesuai aturan sesi |
| Lokasi dan radius yang digunakan | Mengacu pada data P1 |
 
### 8.5 Push notification
 
Sistem menggunakan mekanisme push notification yang sesuai dengan Expo dan platform target. Integrasi harus memperhatikan dukungan Firebase Cloud Messaging atau layanan yang dipilih. Rencana awal: FCM dengan trigger melalui Firebase Cloud Functions, final setelah keputusan PM-04.
 
Alur umum:
 
```text
Perubahan data di Firestore
        |
        v
Event perubahan dikenali
        |
        v
Menentukan pengguna penerima
        |
        v
Memproses event notifikasi
        |
        v
Mengirim push notification
        |
        v
Perangkat menerima notifikasi
```
 
Event yang menghasilkan notifikasi:
 
| Event | Penerima |
|---|---|
| Sesi dibuka | Praktikan yang terdaftar pada sesi |
| Jadwal berubah | Pengguna yang berkaitan dengan jadwal |
| Izin disetujui | Praktikan yang mengajukan izin |
| Izin ditolak | Praktikan yang mengajukan izin |
 
Ketentuan:
 
- Sistem meminta izin notifikasi kepada pengguna.
- Token perangkat harus dikelola untuk kebutuhan pengiriman.
- Penerima ditentukan berdasarkan data pengguna yang berkaitan.
- Event yang sama tidak boleh menghasilkan notifikasi berulang.
- Kegagalan pengiriman notifikasi tidak boleh membatalkan perubahan data utama.
- Penanganan foreground dan background mengikuti kemampuan platform.
**Hal yang perlu dipastikan sebelum implementasi:**
 
| Item | Status |
|---|---|
| Mekanisme pengiriman notifikasi | Perlu dikonfirmasi PM |
| Dukungan Expo dan Firebase pada versi yang digunakan | Perlu diverifikasi |
| Kebutuhan Cloud Functions atau layanan tambahan | Perlu ditentukan |
| Struktur penyimpanan token perangkat | Perlu disepakati |
| Dukungan notifikasi Web | Perlu diverifikasi |
| Penanganan event berulang | Wajib diimplementasikan |
 
### 8.6 Validasi dan penanganan error
 
Sistem harus menangani kondisi berikut:
 
| Kondisi | Penanganan |
|---|---|
| Izin lokasi ditolak | Menampilkan informasi bahwa lokasi diperlukan |
| GPS tidak aktif | Menampilkan informasi untuk mengaktifkan layanan lokasi |
| Lokasi gagal diperoleh | Presensi tidak dilanjutkan |
| Data laboratorium tidak tersedia | Validasi presensi ditolak |
| Pengguna di luar radius | Presensi ditolak |
| Sesi belum dibuka | Presensi ditolak |
| Sesi sudah ditutup | Presensi ditolak |
| QR Code tidak valid | Pemindaian ditolak |
| QR Code kedaluwarsa | Pemindaian ditolak |
| Izin kamera ditolak | Menampilkan informasi bahwa kamera diperlukan |
| Presensi sudah tercatat | Menampilkan informasi presensi sudah dilakukan |
| Jaringan terputus | Menampilkan pesan kegagalan dan tidak menganggap penyimpanan berhasil |
| Token notifikasi tidak valid | Pengiriman ditangani sebagai kegagalan |
| Notifikasi gagal dikirim | Data utama tetap tersimpan dan kegagalan dicatat |
| Input tidak valid | Menampilkan pesan pada field terkait |
 
### 8.7 Kompatibilitas platform
 
- Android dan iOS menjadi target utama untuk pengujian fitur perangkat.
- Web diuji untuk fitur yang didukung oleh library dan browser.
- Fitur kamera, geolocation, Maps, dan push notification harus diperiksa dukungannya pada setiap platform.
- Jika suatu library tidak mendukung platform tertentu, keterbatasan tersebut harus dicatat dan alternatifnya disepakati PM.
- Tidak boleh menyatakan seluruh fitur berjalan pada Web sebelum benar-benar diuji.
### 8.8 Dependency tambahan
 
| Kebutuhan | Tujuan | Penanggung jawab |
|---|---|---|
| Maps | Menampilkan peta dan marker laboratorium | P1 dan PM |
| Geolocation | Mengambil posisi perangkat | P1 dan PM |
| QR scanner | Membaca QR Code dari kamera | P2 dan PM |
| QR generator | Membuat QR Code sesi | P3 |
| Push notification | Mengirim dan menerima notifikasi | P3 dan PM |
| Layanan pemrosesan event | Menjalankan trigger notifikasi jika dibutuhkan | P3 dan PM |
 
Dependency final ditentukan setelah pemeriksaan kompatibilitas dengan Expo SDK yang digunakan. Pemasangan dependency baru harus dikoordinasikan dengan PM.
 
### 8.9 Ketergantungan antarfitur
 
```text
PM-01..PM-05 (persiapan dan kontrak data)
        |
        +--> US-01 --> US-02 --> US-03
        |       |
        |       +--> US-04
        |
        +--> US-10 --> US-06 --> US-05
        |                  |
        |                  v
        |                US-07 --> US-08
        |                  |
        |                US-09
        |
        +--> US-14 --> US-11
        |          --> US-12
        |          --> US-13
        |
        +--> US-15, US-16, US-17, US-18
```
 
Ketergantungan utama:
 
1. US-01 menjadi dasar lokasi untuk Maps dan validasi presensi.
2. US-02 menjadi dasar tampilan lokasi pengguna pada Maps.
3. US-01 dan US-06 diperlukan sebelum validasi presensi dapat diintegrasikan.
4. US-10 dan US-06 harus menggunakan kontrak QR yang sama.
5. US-07 harus selesai sebelum pencatatan presensi terintegrasi pada US-08.
6. US-14 menjadi dasar pengiriman notifikasi pada US-11, US-12, dan US-13.
7. Notifikasi harus terhubung dengan event perubahan data yang dikerjakan programmer terkait.
## 9. Testing Strategy
 
### 9.1 Alur A: Presensi berbasis lokasi dan QR Code
 
1. Asisten membuka sesi praktikum.
2. Sistem menampilkan QR Code untuk sesi tersebut.
3. Praktikan membuka halaman presensi.
4. Praktikan memberikan izin kamera dan memindai QR Code.
5. Sistem memeriksa validitas QR Code dan status sesi.
6. Sistem mengambil posisi perangkat praktikan.
7. Sistem memeriksa jarak perangkat terhadap radius laboratorium.
8. Jika seluruh validasi berhasil, sistem menyimpan presensi.
9. Asisten melihat presensi pada halaman rekap.
10. Praktikan mencoba melakukan presensi kembali dan sistem menolak duplikasi.
Kasus negatif yang wajib diuji:
 
- QR Code tidak valid.
- QR Code kedaluwarsa.
- Sesi belum dibuka atau sudah ditutup.
- Lokasi di luar radius.
- GPS tidak aktif.
- Izin kamera atau lokasi ditolak.
- Presensi sudah pernah dilakukan.
### 9.2 Alur B: Maps dan aktivitas laboratorium
 
1. Pengguna membuka halaman Maps.
2. Sistem meminta izin lokasi perangkat.
3. Sistem menampilkan peta.
4. Sistem menampilkan marker Lab B, C, D, dan AP.
5. Sistem menampilkan posisi pengguna.
6. Pengguna memilih salah satu marker laboratorium.
7. Sistem menampilkan informasi laboratorium.
8. Sistem menampilkan kegiatan yang sedang berlangsung dan kegiatan berikutnya.
9. Pengguna melihat perubahan posisi selama halaman Maps aktif.
Kasus negatif yang wajib diuji:
 
- Izin lokasi ditolak.
- GPS tidak aktif.
- Data koordinat tidak tersedia.
- Koneksi jaringan bermasalah.
- Tidak ada kegiatan praktikum yang sedang berlangsung atau berikutnya.
### 9.3 Alur C: Push notification
 
1. Pengguna memberikan izin notifikasi.
2. Asisten membuka sesi praktikum.
3. Praktikan yang terdaftar menerima notifikasi pembukaan sesi.
4. Asisten mengubah jadwal praktikum.
5. Pengguna yang berkaitan menerima notifikasi perubahan jadwal.
6. Asisten menyetujui atau menolak pengajuan izin.
7. Praktikan yang mengajukan menerima notifikasi keputusan.
8. Sistem memastikan event yang sama tidak menghasilkan notifikasi ganda.
Kasus negatif yang wajib diuji:
 
- Izin notifikasi tidak diberikan.
- Token perangkat tidak tersedia.
- Pengiriman notifikasi gagal.
- Pengguna bukan penerima yang sesuai.
- Event perubahan data diproses ulang.
## 10. Definition of Done
 
Sprint 3 dinyatakan selesai apabila:
 
- [ ] Seluruh User Story wajib telah diimplementasikan.
- [ ] Data koordinat dan radius Lab B, C, D, dan AP tersedia di Firestore.
- [ ] Halaman Maps menampilkan marker laboratorium.
- [ ] Posisi pengguna dapat ditampilkan dan diperbarui selama halaman aktif.
- [ ] Informasi kegiatan laboratorium dapat ditampilkan.
- [ ] Halaman presensi tersedia.
- [ ] QR Code dapat dibuat dan dipindai.
- [ ] Validasi QR Code dan masa berlaku berjalan.
- [ ] Validasi status sesi berjalan.
- [ ] Validasi radius lokasi berjalan.
- [ ] Presensi yang gagal divalidasi tidak tersimpan.
- [ ] Sistem mencegah presensi ganda.
- [ ] Rekap presensi menampilkan data terbaru.
- [ ] Pengelolaan sesi menggunakan modal popup dan input waktu yang tervalidasi.
- [ ] Notifikasi pembukaan sesi berjalan.
- [ ] Notifikasi perubahan jadwal berjalan.
- [ ] Notifikasi keputusan izin berjalan.
- [ ] Sistem menangani token dan kegagalan pengiriman notifikasi.
- [ ] Pencarian peserta dan filter kategori izin berjalan.
- [ ] Tampilan bagian atas halaman rekap telah diperbaiki.
- [ ] Validasi NIM praktikan dan input lainnya berjalan.
- [ ] Seluruh fitur terintegrasi dengan Firebase dan fitur Sprint 2.
- [ ] Skenario pengujian utama berhasil dilakukan.
- [ ] Fitur diuji pada platform yang didukung.
- [ ] Tidak terdapat bug kritis yang menghambat demonstrasi sprint.
## 11. Risks and Mitigation
 
| Risiko | Dampak | Mitigasi |
|---|---|---|
| Koordinat atau radius laboratorium belum disepakati | Validasi lokasi tidak dapat diuji dengan benar | PM menetapkan data lokasi bersama kelompok pada D1 |
| Library Maps tidak kompatibel dengan platform tertentu | Halaman Maps tidak dapat berjalan pada platform tersebut | Verifikasi dependency sebelum implementasi |
| Izin kamera atau lokasi ditolak | Praktikan tidak dapat menyelesaikan presensi | Sediakan pesan dan penanganan izin |
| GPS tidak akurat atau tidak tersedia | Validasi lokasi gagal | Tangani lokasi tidak tersedia dan tampilkan pesan yang sesuai |
| Format QR belum disepakati | Scanner dan generator tidak dapat terintegrasi | P2 dan P3 menetapkan kontrak QR pada D1 |
| QR digunakan setelah kedaluwarsa | Presensi tidak sesuai sesi | Terapkan validasi masa berlaku |
| Pengiriman notifikasi gagal | Pengguna tidak menerima informasi | Tangani kegagalan pengiriman dan periksa token perangkat |
| Event notifikasi diproses berulang | Pengguna menerima notifikasi ganda | Terapkan idempotensi event |
| Struktur data Firestore berbeda antarprogrammer | Integrasi fitur terhambat | PM menetapkan kontrak data bersama |
| Waktu pengerjaan terbatas | Fitur tidak selesai sebelum demo | Prioritaskan tiga alur demo utama dan periksa progres harian |
 
## 12. Hasil Akhir yang Diharapkan
 
Pada akhir Sprint 3, aplikasi PraktikumKU diharapkan dapat mendukung proses presensi praktikum menggunakan QR Code dan validasi lokasi laboratorium. Pengguna dapat melihat lokasi laboratorium serta aktivitas praktikum melalui Google Maps. Asisten dapat mengelola sesi dan melihat hasil presensi, sedangkan praktikan dapat menerima notifikasi terkait pembukaan sesi, perubahan jadwal, dan keputusan pengajuan izin.
 
Selain fitur utama tersebut, sistem juga memiliki pencarian peserta, filter kategori izin, penyempurnaan halaman rekap, dan validasi input. Seluruh fitur harus terintegrasi dengan Firebase serta fitur Sprint 2 sehingga aplikasi dapat digunakan secara konsisten pada platform yang didukung.
 
## 13. Sprint Review
 
Diisi pada 22 November 2026.
 
**Completed User Stories.** [Belum diisi]
 
**Incomplete User Stories.** [Belum diisi]
 
**Known Issues.** [Belum diisi]
 
**Review Notes.** [Belum diisi]
 