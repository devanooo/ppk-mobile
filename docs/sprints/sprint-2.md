# Sprint 2: Data Dinamis dengan Firebase

## 1. Sprint Information

| Field | Isi |
|---|---|
| Sprint | Sprint 2 |
| Nama | Data Dinamis dengan Firebase |
| Periode | 12 November 2026 sampai 16 November 2026 (5 hari kerja) |
| Sprint goal | Mengganti seluruh sumber data dummy dengan Firebase Authentication dan Cloud Firestore, menambahkan sinkronisasi real-time, pengajuan izin dengan klasifikasi AI, dan pembatasan akses berbasis role, berjalan sama di Android, iOS, dan Web |
| Target platform | Android, iOS, Web (satu codebase) |
| Tim | PM: Dehar Zaidan Dzaki Amirullah. Programmer 1: Anggita Kirana Puspa. Programmer 2: Devano Trestanto. Programmer 3: Nashwa Aldebaran |
| Status | Perencanaan, belum dimulai |

Dokumen ini adalah acuan pelaksanaan. Setiap perubahan scope, kontrak data, atau pembagian tugas harus disepakati PM dan dicatat di sini sebelum dikerjakan.

## 2. Sprint Goal

Pada akhir 16 November 2026, dua alur demo wajib berjalan end-to-end dengan data nyata di Firestore:

1. **Alur A (presensi):** asisten membuka sesi, praktikan dari perangkat atau tab lain mencatat presensi, rekap asisten bertambah tanpa reload, asisten menutup sesi.
2. **Alur B (izin):** praktikan mengajukan izin, alasan dikirim ke API AI, kategori hasil klasifikasi tampil di sisi asisten, asisten menyetujui atau menolak, praktikan melihat keputusan tanpa reload.

Data bertahan setelah aplikasi ditutup dan dibuka kembali. Pengguna tanpa hak tidak dapat membaca atau mengubah data lewat Security Rules, bukan hanya lewat UI.

## 3. Scope and Requirements

### 3.1 Functional requirements

| ID | Requirement | User story | Prioritas |
|---|---|---|---|
| FR-01 | Registrasi akun praktikan dengan email dan kata sandi; profil disimpan di Firestore dengan role `praktikan` | US-01 | High |
| FR-02 | Login dan logout Firebase Authentication; sesi bertahan setelah reload atau aplikasi dibuka ulang | US-02 | High |
| FR-03 | Role dan identitas dibaca dari dokumen `users`; route dilindungi sesuai role | US-03 | High |
| FR-04 | Satu lapisan akses Firestore dipakai semua fitur, termasuk pemetaan error dan listener real-time | US-04 | High |
| FR-05 | Asisten mengelola data kelas dan peserta praktikan | US-05 | Medium |
| FR-06 | Asisten mengelola sesi praktikum dan mengubah status buka/tutup | US-06 | High |
| FR-07 | Praktikan melihat jadwal dan detail sesi yang terkait dengannya | US-07 | High |
| FR-08 | Praktikan mencatat presensi hanya saat sesi dibuka; presensi ganda ditolak di lapisan data | US-08 | High |
| FR-09 | Rekap kehadiran asisten dan riwayat kehadiran praktikan diperbarui real-time | US-08 | High |
| FR-10 | Praktikan mengajukan izin untuk sesi yang diikuti, maksimal satu pengajuan per sesi | US-09 | High |
| FR-11 | Alasan izin diklasifikasikan melalui API AI; hasil disimpan sebagai informasi pendukung | US-10 | High |
| FR-12 | Asisten melihat daftar izin, alasan, dan hasil klasifikasi, lalu menyetujui atau menolak | US-11 | High |
| FR-13 | Praktikan melihat status dan keputusan izin miliknya | US-12 | Medium |
| FR-14 | Security Rules membatasi baca dan tulis berdasarkan identitas, role, dan kepemilikan data | US-04, semua | High |

Kode `FR-xx` di tabel ini dipakai sebagai kode SRS pada formulir pembagian tugas: P1 `FR-01 : US-01` sampai `FR-04 : US-04`, P2 `FR-10 : US-09` sampai `FR-13 : US-12`, P3 `FR-05 : US-05` sampai `FR-08 : US-08`. FR-09 (rekap real-time) melekat pada US-08 dan FR-14 bersifat lintas story.

### 3.2 Non-functional requirements

| ID | Requirement |
|---|---|
| NFR-01 | Fitur fungsional identik di Android, iOS, dan Web. Perbedaan hanya pada perilaku perangkat, misalnya keyboard dan safe area |
| NFR-02 | Setiap layar yang membaca data punya state memuat, kosong, dan gagal. Tidak ada loading palsu |
| NFR-03 | Semua mutasi mengembalikan hasil `{ ok, pesan }` seperti Sprint 1. Pesan error berbahasa Indonesia |
| NFR-04 | Tidak ada kredensial Firebase atau API AI yang ditulis langsung di kode sumber. Nilai dibaca dari environment |
| NFR-05 | Target sentuh minimal 44x44 pt tetap berlaku; teks status tidak hanya dibedakan lewat warna |
| NFR-06 | `npx tsc --noEmit` dan `npx expo lint` hijau sebelum setiap PR |
| NFR-07 | Perubahan dependency dan konfigurasi diumumkan ke tim dan dijelaskan di deskripsi PR |

### 3.3 Ringkasan audit Sprint 1

Audit dilakukan pada `main` commit `103659f`. Ringkasan kondisi nyata repository:

| Area | Status | Bukti |
|---|---|---|
| Landing page dan login dummy | Sudah tersedia | `src/app/index.tsx`, `src/app/login.tsx`, `src/features/auth/landing-screen.tsx`, `src/features/auth/login-screen.tsx` |
| Auth guard dan redirect role | Sudah tersedia, perlu penyesuaian | `src/app/_layout.tsx` memakai `Stack.Protected`; sumber role masih state in-memory |
| Autentikasi | Parsial | `src/store/session-logic.ts` mencocokkan `src/data/credentials.ts`; tanpa registrasi, tanpa persistensi |
| State sesi dan presensi | Perlu penyesuaian | `src/store/session-store.tsx` menyimpan `sesi` dan `presensi` di `useState`, hilang saat reload |
| Jadwal dan detail (praktikan) | Sudah tersedia | `src/app/(praktikan)/jadwal/index.tsx`, `src/app/(praktikan)/jadwal/[id].tsx`, `src/features/praktikan/jadwal-screen.tsx`, `src/features/praktikan/detail-sesi-screen.tsx` |
| Jadwal, detail, rekap (asisten) | Sudah tersedia | `src/app/(asisten)/jadwal/index.tsx`, `src/app/(asisten)/jadwal/[id].tsx`, `src/app/(asisten)/rekap.tsx` |
| Buka dan tutup sesi | Sudah tersedia, perlu migrasi | `bukaSesi` dan `tutupSesi` di `src/store/session-logic.ts` sudah memvalidasi transisi status |
| Presensi dan penolakan ganda | Sudah tersedia, perlu migrasi | `catatPresensi` di `src/store/session-logic.ts` menolak sesi tidak aktif, peserta tidak terdaftar, dan presensi ganda |
| Komponen UI bersama | Sudah tersedia | `src/components/ui/` (Screen, AppButton, Card, StatusBadge, EmptyState, BottomSheet, TextField, Banner, ProfileMenu, HomeButton) |
| Design token dan dark mode | Sudah tersedia | `src/constants/tokens.js`, `src/global.css`, `tailwind.config.js` |
| Profil dan logout | Sudah tersedia, perlu penyesuaian | `src/components/ui/profile-menu.tsx`; item "Ganti peran (demo)" akan dihapus |
| Data dummy | Perlu penyesuaian | `src/data/dummy.ts` (6 user, 5 sesi, 2 presensi), `src/data/credentials.ts` |
| Tipe domain | Perlu penyesuaian | `src/types/index.ts` belum punya `Kelas`, `Izin`, dan role Firestore |
| Pengajuan izin dan AI | Belum tersedia | Tidak ada kode atau dokumentasi API AI di repository |
| Real-time | Belum tersedia | Tidak ada dependency Firebase, tidak ada listener |
| Dukungan Web | Belum tersedia | `app.json` memakai `"platforms": ["ios", "android"]`; `react-dom`, `react-native-web`, dan `@expo/metro-runtime` belum terpasang |
| Pengujian | Parsial | `src/store/session-logic.assert.mjs` menguji logika murni; belum ada uji Security Rules dan CI |
| Workflow Git | Sudah tersedia | `docs/GIT-WORKFLOW.md`, `.github/CODEOWNERS`, `.github/pull_request_template.md` |

Temuan yang memengaruhi rencana:

1. Aplikasi belum punya backend. Semua mutasi terjadi di memori dan kembali ke data dummy setelah reload (PRD bagian 8 aturan 14).
2. `app.json` mengaktifkan `experiments.reactCompiler` dan `typedRoutes`. Konfigurasi web harus diuji terhadap keduanya.
3. `expo-symbols` dipakai di 5 file (`src/app/(praktikan)/_layout.tsx`, `src/app/(asisten)/_layout.tsx`, `src/components/ui/text-field.tsx`, `src/features/praktikan/jadwal-screen.tsx`, `src/features/praktikan/detail-sesi-screen.tsx`). Dukungan web harus diverifikasi sebelum dianggap selesai.
4. `Sesi` masih menyimpan `namaPraktikum`, `kelas`, dan `lab` sebagai string. Model ini tidak cocok dengan kebutuhan CRUD kelas.
5. Dokumentasi Sprint 1 menyatakan Web bukan target dan backend termasuk non-goals (`README.md` baris 5, `docs/PRD.md` baris 9 dan 38, `AGENTS.md`). Ini bertentangan dengan scope Sprint 2. Klaim yang bertentangan sudah diperbaiki secara minimal: `README.md`, `docs/PRD.md`, `AGENTS.md`, dan `docs/PEMBAGIAN-TUGAS.md` kini merujuk dokumen ini untuk Sprint 2. Lihat bagian 8.10.

## 4. Sprint Backlog

Estimasi memakai ukuran S (setengah hari), M (satu hari), L (dua hari) untuk satu programmer. Status awal seluruh story: `Belum dimulai`.

### 4.1 Ringkasan backlog

| ID | Judul | Owner | Prioritas | Estimasi | Dependensi | Status |
|---|---|---|---|---|---|---|
| US-01 | Registrasi akun praktikan | Programmer 1 | High | M | PM-01, PM-03, PM-05 | Belum dimulai |
| US-02 | Login, logout, dan sesi persisten | Programmer 1 | High | M | US-01 | Belum dimulai |
| US-03 | Role dari Firestore dan profil tanpa ganti peran demo | Programmer 1 | High | S | US-02 | Belum dimulai |
| US-04 | Lapisan akses Firestore bersama | Programmer 1 | High | M | PM-04, PM-05 | Belum dimulai |
| US-05 | Asisten mengelola kelas dan peserta | Programmer 3 | Medium | M | US-03, US-04, PM-07 | Belum dimulai |
| US-06 | Asisten mengelola sesi dan status sesi | Programmer 3 | High | M | US-04, US-05 | Belum dimulai |
| US-07 | Praktikan melihat jadwal dan detail dari Firestore | Programmer 3 | High | S | US-04, US-06 | Belum dimulai |
| US-08 | Presensi dan rekap real-time | Programmer 3 | High | L | US-06, US-07 | Belum dimulai |
| US-09 | Praktikan mengajukan izin | Programmer 2 | High | M | US-03, US-04, US-07 | Belum dimulai |
| US-10 | Klasifikasi alasan dengan API AI | Programmer 2 | High | M | US-09, API AI dari pengajar | Belum dimulai |
| US-11 | Asisten memeriksa dan memutuskan izin | Programmer 2 | High | M | US-09, US-10, US-06 | Belum dimulai |
| US-12 | Praktikan melihat status izin | Programmer 2 | Medium | S | US-09, US-11 | Belum dimulai |

Total 12 user story, 53 technical task. Rincian task ada di bagian 5.

### 4.2 Rincian user story

#### US-01 Registrasi akun praktikan

**User story.** Sebagai calon pengguna, saya ingin membuat akun praktikan dengan email dan kata sandi, supaya saya dapat masuk dan tercatat atas nama saya sendiri.

**Deskripsi.** Registrasi publik hanya membuat akun dengan role `praktikan`. Akun asisten dibuat PM (lihat bagian 7). Setelah registrasi berhasil, dokumen `users/{uid}` dibuat dan pengguna langsung masuk ke beranda praktikan.

**Priority.** High.

**Acceptance criteria.**

1. Form registrasi meminta email, kata sandi, nama lengkap, dan NIM. Tombol Daftar nonaktif sampai semua field terisi, dengan alasan yang terlihat.
2. Email tidak valid atau kata sandi kurang dari 6 karakter ditolak dengan pesan spesifik sebelum dikirim.
3. Registrasi berhasil membuat akun Firebase Auth dan dokumen `users/{uid}` berisi `nama`, `nomorInduk`, `peran: "praktikan"`, `dibuatPada`.
4. Email yang sudah terdaftar menampilkan pesan "Email sudah terdaftar" tanpa membuat dokumen baru.
5. Setelah berhasil, pengguna diarahkan ke `/(praktikan)/jadwal` tanpa login ulang.
6. Security Rules menolak pembuatan dokumen `users` dengan role `asisten`.

**Estimasi.** M. **Owner.** Programmer 1. **Dependensi.** PM-01, PM-03, PM-05. **Status.** Belum dimulai.

#### US-02 Login, logout, dan sesi persisten

**User story.** Sebagai pengguna terdaftar, saya ingin masuk dan keluar dengan akun Firebase, supaya identitas saya benar dan saya tidak perlu login ulang setiap membuka aplikasi.

**Deskripsi.** Menggantikan login dummy berbasis username menjadi email dan kata sandi Firebase Auth. Sesi dipulihkan dari persistence bawaan SDK di mobile dan web.

**Priority.** High.

**Acceptance criteria.**

1. Login dengan email dan kata sandi valid mengarahkan ke beranda sesuai role di dokumen `users`.
2. Kredensial salah menampilkan "Email atau kata sandi salah" dan tetap di halaman login.
3. Menutup dan membuka ulang aplikasi, atau reload tab web, mempertahankan status login.
4. Logout mengembalikan pengguna ke landing page tanpa menghapus data di Firestore.
5. Akun Auth yang tidak punya dokumen `users` ditolak dengan pesan "Profil pengguna tidak ditemukan" dan sesi Auth-nya diakhiri.
6. Selama sesi dipulihkan, aplikasi menampilkan state memuat, bukan layar kosong atau kedip ke landing.

**Estimasi.** M. **Owner.** Programmer 1. **Dependensi.** US-01. **Status.** Belum dimulai.

#### US-03 Role dari Firestore dan profil tanpa ganti peran demo

**User story.** Sebagai pengguna, saya ingin aplikasi membaca role saya dari database, supaya halaman yang terbuka selalu sesuai hak akses saya.

**Deskripsi.** Root layout memakai status Auth dan dokumen `users` sebagai sumber guard. Item "Ganti peran (demo)" dihapus karena tidak sesuai dengan autentikasi nyata.

**Priority.** High.

**Acceptance criteria.**

1. Route publik hanya tersedia saat belum login; route `(praktikan)` hanya untuk role praktikan; route `(asisten)` hanya untuk role asisten.
2. Membuka route role lain mengarahkan ke beranda role yang benar.
3. Menu profil menampilkan nama, NIM/NIP, dan role dari Firestore.
4. Menu profil tidak lagi memuat aksi ganti peran demo.
5. Perubahan nama pada dokumen `users` tampil di menu profil tanpa reload.

**Estimasi.** S. **Owner.** Programmer 1. **Dependensi.** US-02. **Status.** Belum dimulai.

#### US-04 Lapisan akses Firestore bersama

**User story.** Sebagai tim pengembang, saya ingin satu lapisan akses Firestore, supaya semua fitur memakai kontrak data, error, dan listener yang sama.

**Deskripsi.** Story enabler. Menyediakan modul inisialisasi Firebase, konversi dokumen, helper listener, dan pemetaan error. Semua programmer memakai modul ini, tidak menulis query Firestore langsung di file route.

**Priority.** High.

**Acceptance criteria.**

1. `src/lib/firebase.ts` menginisialisasi aplikasi dari variabel `EXPO_PUBLIC_FIREBASE_*` dan gagal dengan pesan jelas bila variabel tidak lengkap.
2. Tipe dan konversi Firestore untuk `users`, `kelas`, `sesi`, `presensi`, dan `izin` tersedia di satu tempat dan sesuai bagian 8.3.
3. Helper listener mengembalikan data, status memuat, dan error, serta membersihkan listener saat komponen unmount.
4. Error Firestore (`permission-denied`, `unavailable`, `not-found`) dipetakan ke pesan bahasa Indonesia.
5. Tidak ada file route di `src/app/` yang memanggil `getDocs`, `onSnapshot`, atau `setDoc` secara langsung.

**Estimasi.** M. **Owner.** Programmer 1. **Dependensi.** PM-04, PM-05. **Status.** Belum dimulai.

#### US-05 Asisten mengelola kelas dan peserta

**User story.** Sebagai asisten, saya ingin membuat kelas, mengubah datanya, dan mengatur peserta, supaya jadwal dan rekap memakai data kelas yang benar.

**Deskripsi.** Kelas menjadi entitas Firestore tersendiri: nama praktikum, lab, asisten pengampu, dan daftar peserta. CRUD memakai konfirmasi untuk aksi hapus.

**Priority.** Medium.

**Acceptance criteria.**

1. Asisten melihat daftar kelas yang diampu, dengan empty state saat kosong.
2. Asisten dapat membuat kelas dengan nama, lab, dan memilih praktikan sebagai peserta.
3. Asisten dapat mengubah nama dan lab, serta menambah atau menghapus peserta.
4. Kelas yang masih punya sesi tidak dapat dihapus; tombol nonaktif disertai alasan.
5. Asisten lain tidak dapat melihat atau mengubah kelas yang bukan miliknya; aturan ini ditegakkan Security Rules.
6. Aksi berhasil atau gagal menampilkan banner sesuai hasil.

**Estimasi.** M. **Owner.** Programmer 3. **Dependensi.** US-03, US-04, PM-07. **Status.** Belum dimulai.

#### US-06 Asisten mengelola sesi dan status sesi

**User story.** Sebagai asisten, saya ingin membuat sesi untuk kelas saya dan membuka atau menutupnya, supaya praktikan hanya bisa presensi pada waktu yang tepat.

**Deskripsi.** Sesi menyimpan `kelasId` dan referensi pengampu. Transisi status tetap satu arah: `belum-dibuka` ke `dibuka` ke `ditutup`.

**Priority.** High.

**Acceptance criteria.**

1. Asisten membuat sesi dengan kelas, hari, tanggal, jam mulai, dan jam selesai; status awal `belum-dibuka`.
2. Asisten dapat mengubah sesi yang belum dibuka, dan tidak dapat mengubah sesi yang sudah ditutup.
3. Buka dan tutup sesi tetap memakai bottom sheet konfirmasi dan menghasilkan banner.
4. Transisi ilegal ditolak di lapisan data dan di Security Rules.
5. Status sesi berubah di perangkat lain tanpa reload.
6. Waktu buka dan tutup tersimpan sebagai timestamp server.

**Estimasi.** M. **Owner.** Programmer 3. **Dependensi.** US-04, US-05. **Status.** Belum dimulai.

#### US-07 Praktikan melihat jadwal dan detail dari Firestore

**User story.** Sebagai praktikan, saya ingin melihat jadwal dan detail sesi saya dari database, supaya informasi yang saya lihat sama dengan yang dilihat asisten.

**Deskripsi.** Daftar sesi diturunkan dari keanggotaan praktikan pada kelas. Nama praktikum dan lab diambil dari dokumen kelas, nama asisten dari dokumen users.

**Priority.** High.

**Acceptance criteria.**

1. Jadwal praktikan hanya memuat sesi dari kelas tempat ia terdaftar, terurut tanggal dan jam.
2. Kartu dan detail menampilkan nama praktikum, kelas, lab, hari, tanggal, jam, status, dan nama asisten seperti Sprint 1.
3. Perubahan status sesi tampil tanpa reload.
4. Data kosong memakai empty state yang sudah ada.
5. Praktikan tidak dapat membaca sesi kelas tempat ia tidak terdaftar lewat Security Rules.

**Estimasi.** S. **Owner.** Programmer 3. **Dependensi.** US-04, US-06. **Status.** Belum dimulai.

#### US-08 Presensi dan rekap real-time

**User story.** Sebagai praktikan saya ingin mencatat presensi, dan sebagai asisten saya ingin rekap bertambah saat itu juga, supaya kehadiran tercatat tanpa perlu menyegarkan layar.

**Deskripsi.** Presensi disimpan sebagai dokumen anak sesi dengan ID praktikan, sehingga presensi ganda tidak mungkin dibuat. Rekap dan riwayat memakai listener.

**Priority.** High.

**Acceptance criteria.**

1. Tombol presensi aktif hanya saat sesi `dibuka` dan pengguna belum presensi; alasan nonaktif tetap tampil.
2. Presensi berhasil menulis `sesi/{sesiId}/presensi/{uid}` dengan `praktikanId` dan `waktu` timestamp server.
3. Percobaan kedua untuk pasangan yang sama ditolak dengan "Presensi sudah tercatat pada sesi ini", termasuk bila dua perangkat menekan bersamaan.
4. Presensi ditolak bila sesi `belum-dibuka` atau `ditutup`, atau pengguna bukan peserta kelas.
5. Rekap asisten dan riwayat praktikan bertambah tanpa reload saat presensi baru masuk.
6. Saat asisten menutup sesi, tombol presensi di perangkat praktikan langsung nonaktif.

**Estimasi.** L. **Owner.** Programmer 3. **Dependensi.** US-06, US-07. **Status.** Belum dimulai.

#### US-09 Praktikan mengajukan izin

**User story.** Sebagai praktikan, saya ingin mengajukan izin untuk sesi tertentu, supaya ketidakhadiran saya punya alasan yang tercatat.

**Deskripsi.** Satu pengajuan per sesi per praktikan. Data disimpan pada dokumen anak sesi dengan ID praktikan.

**Priority.** High.

**Acceptance criteria.**

1. Praktikan memilih sesi yang diikuti lalu mengisi alasan 5 sampai 500 karakter.
2. Pengajuan hanya dapat dibuat untuk sesi yang belum ditutup. Untuk sesi yang sudah ditutup, tombol nonaktif dengan alasan.
3. Jika sudah ada pengajuan untuk sesi tersebut, form menampilkan pengajuan yang ada dan tombol Ajukan nonaktif dengan alasan.
4. Pengajuan tersimpan dengan `status: "menunggu"`, `alasan`, `dibuatPada`, dan `praktikanId`.
5. Praktikan tidak dapat mengajukan izin untuk sesi kelas yang bukan miliknya.
6. Form memakai konfirmasi bottom sheet dan banner hasil.

**Estimasi.** M. **Owner.** Programmer 2. **Dependensi.** US-03, US-04, US-07. **Status.** Belum dimulai.

#### US-10 Klasifikasi alasan dengan API AI

**User story.** Sebagai asisten, saya ingin melihat kategori alasan izin dari AI, supaya saya punya informasi pendukung sebelum memutuskan.

**Deskripsi.** Alasan dikirim ke API AI setelah pengajuan tersimpan. Hasil hanya informasi pendukung; keputusan tetap manual. Detail API yang belum diketahui dicatat di bagian 8.9.

**Priority.** High.

**Acceptance criteria.**

1. Setelah pengajuan tersimpan, aplikasi memanggil API AI memakai `EXPO_PUBLIC_AI_BASE_URL` dan `EXPO_PUBLIC_AI_API_KEY`.
2. Hasil klasifikasi disimpan pada dokumen izin sebagai `kategoriAi`, `klasifikasiStatus`, dan `diprosesPada`.
3. `klasifikasiStatus` bernilai `menunggu`, `selesai`, atau `gagal`.
4. Kegagalan API tidak membatalkan pengajuan; pengajuan tetap `menunggu` dan asisten tetap dapat menilai.
5. Tidak ada perubahan status izin otomatis dari hasil klasifikasi.
6. Status klasifikasi tampil di sisi praktikan dan asisten, ditandai sebagai saran AI.

**Estimasi.** M. **Owner.** Programmer 2. **Dependensi.** US-09, akses API AI. **Status.** Belum dimulai.

#### US-11 Asisten memeriksa dan memutuskan izin

**User story.** Sebagai asisten, saya ingin melihat pengajuan izin beserta alasannya dan hasil klasifikasi, lalu menyetujui atau menolak, supaya keputusan tercatat dan dapat dilihat praktikan.

**Deskripsi.** Daftar izin dikelompokkan per sesi yang diampu. Aksi keputusan memakai bottom sheet konfirmasi.

**Priority.** High.

**Acceptance criteria.**

1. Asisten melihat daftar pengajuan untuk sesinya dengan filter status `menunggu`, `disetujui`, dan `ditolak`.
2. Detail pengajuan menampilkan identitas praktikan, alasan, waktu pengajuan, dan kategori AI dengan label bahwa hasil AI adalah saran.
3. Asisten menyetujui atau menolak melalui konfirmasi; keputusan menyimpan `status`, `diputuskanPada`, dan `diputuskanOleh`.
4. Hanya pengajuan berstatus `menunggu` yang dapat diputuskan. Pengajuan yang sudah diputuskan menampilkan hasil dan tidak punya tombol aksi.
5. Perubahan status tampil tanpa reload di perangkat asisten dan praktikan.
6. Praktikan tidak dapat mengubah keputusan; percobaan ditolak Security Rules.

**Estimasi.** M. **Owner.** Programmer 2. **Dependensi.** US-09, US-10, US-06. **Status.** Belum dimulai.

#### US-12 Praktikan melihat status izin

**User story.** Sebagai praktikan, saya ingin melihat status pengajuan izin saya, supaya saya tahu apakah izin sudah diputuskan.

**Priority.** Medium.

**Acceptance criteria.**

1. Tab Izin menampilkan daftar pengajuan milik pengguna aktif dengan status dan keputusan.
2. Perubahan status dari asisten tampil tanpa reload.
3. Empty state tampil saat belum ada pengajuan.
4. Praktikan tidak dapat membaca pengajuan praktikan lain; aturan ditegakkan Security Rules.

**Estimasi.** S. **Owner.** Programmer 2. **Dependensi.** US-09, US-11. **Status.** Belum dimulai.

## 5. Technical Tasks

Kolom owner memakai kode programmer. Semua task mewarisi Definition of Done bagian 10.

### US-01 Registrasi

| Task | Deskripsi | Deliverable | Kriteria selesai | Owner | Dependensi |
|---|---|---|---|---|---|
| T-001 | Buat route `src/app/register.tsx` dan komponen `src/features/auth/register-screen.tsx` dengan field email, kata sandi, nama, NIM; pakai `TextField`, `AppButton`, `Banner` | Layar registrasi | Form tampil, validasi inline, tombol nonaktif punya alasan | P1 | PM-04 |
| T-002 | Implementasi `daftarPraktikan()` di `src/lib/auth.ts`: `createUserWithEmailAndPassword`, `updateProfile`, tulis `users/{uid}` | Fungsi registrasi | Dokumen users terbentuk dengan role praktikan | P1 | T-001 |
| T-003 | Petakan kode error Auth (`email-already-in-use`, `weak-password`, `invalid-email`, `network-request-failed`) ke pesan Indonesia | Modul pesan error | Semua kode di atas punya pesan | P1 | T-002 |
| T-004 | Tambah tautan "Buat akun" di halaman login dan tombol kembali ke landing | Navigasi registrasi | Dua arah navigasi berjalan | P1 | T-001 |
| T-005 | Uji registrasi di Android, iOS, dan Web, termasuk penolakan role asisten oleh rules | Catatan uji | Tiga platform lulus | P1 | PM-07 |

### US-02 Login, logout, persisten

| Task | Deskripsi | Deliverable | Kriteria selesai | Owner | Dependensi |
|---|---|---|---|---|---|
| T-006 | Ubah `LoginScreen` dari username ke email; hapus pemakaian `src/data/credentials.ts` | Form login email | Login memakai email | P1 | US-01 |
| T-007 | Implementasi `masuk()` dan `keluar()` di `src/lib/auth.ts` | Fungsi auth | Login dan logout berjalan | P1 | T-006 |
| T-008 | Buat `src/store/auth-provider.tsx`: `onAuthStateChanged`, baca dokumen users, status `memuat`, `masuk`, `keluar` | Provider auth | Status auth tersedia untuk guard | P1 | T-007 |
| T-009 | Konfigurasi persistence: `getReactNativePersistence(AsyncStorage)` di mobile dan `browserLocalPersistence` di web; verifikasi nama API pada versi `firebase` yang terpasang | Inisialisasi auth | Login bertahan setelah reload di tiga platform | P1 | PM-04 |
| T-010 | Hapus `Kredensial` dari `src/types/index.ts` dan hapus `src/data/credentials.ts`; hapus `login`, `logout`, `setUser`, `gantiPeranDemo` dari `src/store/session-store.tsx` | Kode lama dibersihkan | Tidak ada referensi kredensial dummy | P1 | T-008 |
| T-011 | Uji kredensial salah, akun tanpa dokumen users, reload aplikasi, reload tab web, dan logout | Catatan uji | Semua kasus lulus | P1 | T-009 |

### US-03 Role dan profil

| Task | Deskripsi | Deliverable | Kriteria selesai | Owner | Dependensi |
|---|---|---|---|---|---|
| T-012 | Ubah `src/app/_layout.tsx` agar guard memakai status auth dan role Firestore; tampilkan layar memuat saat status `memuat` | Root layout baru | Redirect benar untuk 6 kombinasi role dan route | P1 | T-008 |
| T-013 | Ubah `src/components/ui/profile-menu.tsx`: hapus item ganti peran, terima data profil tanpa aksi demo | Menu profil baru | Tidak ada aksi ganti peran | P1 | T-012 |
| T-014 | Sesuaikan `src/features/praktikan/menu-profil.tsx` dan `src/features/asisten/menu-profil-asisten.tsx` dengan props baru | Dua wrapper profil | Keduanya kompilasi dan berjalan | P1 | T-013 |
| T-015 | Uji guard dan profil di tiga platform, termasuk akun asisten hasil seed PM | Catatan uji | Lulus di tiga platform | P1 | PM-08 |

### US-04 Lapisan data bersama

| Task | Deskripsi | Deliverable | Kriteria selesai | Owner | Dependensi |
|---|---|---|---|---|---|
| T-016 | Buat `src/lib/firebase.ts`: `initializeApp` dari `EXPO_PUBLIC_FIREBASE_*`, validasi env, ekspor `auth` dan `db` | Modul Firebase | Aplikasi terhubung di tiga platform | P1 | PM-04, PM-05 |
| T-017 | Tambah tipe Firestore di `src/types/firestore.ts` dan konverter di `src/lib/konversi.ts` sesuai bagian 8.3 | Tipe dan konverter | Semua koleksi punya konverter | P1 | T-016 |
| T-018 | Buat helper `src/lib/firestore.ts`: pembungkus `onSnapshot` dengan `data`, `memuat`, `error`, plus `petakanErrorFirestore` | Helper listener | Listener dibersihkan saat unmount | P1 | T-017 |
| T-019 | Dokumentasikan kontrak koleksi dan aturan penulisan query di komentar modul, lalu umumkan ke tim pada D1 | Catatan kontrak | P2 dan P3 memakai helper yang sama | P1 | T-018 |

### US-05 Kelas dan peserta

| Task | Deskripsi | Deliverable | Kriteria selesai | Owner | Dependensi |
|---|---|---|---|---|---|
| T-020 | Buat `src/lib/kelas.ts`: listener kelas milik asisten, create, update, delete, `arrayUnion`/`arrayRemove` peserta | Modul kelas | Semua operasi mengembalikan `{ ok, pesan }` | P3 | T-019 |
| T-021 | Buat route `src/app/(asisten)/kelas/index.tsx` dan layar daftar kelas; tambah tab Kelas di `src/app/(asisten)/_layout.tsx` | Tab Kelas | Daftar dan empty state tampil | P3 | T-020 |
| T-022 | Buat form kelas dan pemilih peserta dari daftar pengguna berperan praktikan | Form kelas | Peserta tersimpan dan tampil | P3 | T-021 |
| T-023 | Tambahkan validasi: nama dan lab wajib, kelas dengan sesi tidak dapat dihapus | Validasi kelas | Aksi ilegal ditolak dengan pesan | P3 | T-020 |
| T-024 | Uji CRUD kelas di tiga platform dan uji rules dengan akun asisten lain | Catatan uji | Asisten lain ditolak | P3 | PM-07 |

### US-06 Sesi dan status

| Task | Deskripsi | Deliverable | Kriteria selesai | Owner | Dependensi |
|---|---|---|---|---|---|
| T-025 | Buat `src/lib/sesi.ts`: list sesi asisten, create, update, dan transisi `bukaSesi`/`tutupSesi` dengan timestamp server | Modul sesi | Transisi ilegal ditolak | P3 | T-020 |
| T-026 | Buat form buat dan ubah sesi di `src/app/(asisten)/kelas/[id].tsx` | Form sesi | Sesi tersimpan pada kelas yang benar | P3 | T-025 |
| T-027 | Migrasikan aksi buka dan tutup di `src/app/(asisten)/jadwal/[id].tsx` ke `src/lib/sesi.ts`, pertahankan bottom sheet dan banner | Detail sesi terhubung Firestore | Aksi berhasil dan gagal tertangani | P3 | T-025 |
| T-028 | Ganti sumber daftar jadwal asisten ke listener Firestore | Jadwal asisten real-time | Perubahan status tampil tanpa reload | P3 | T-025 |
| T-029 | Uji transisi ilegal, dua perangkat, dan sesi yang diedit asisten lain | Catatan uji | Ditolak dan tidak ada data rusak | P3 | PM-07 |

### US-07 Jadwal praktikan

| Task | Deskripsi | Deliverable | Kriteria selesai | Owner | Dependensi |
|---|---|---|---|---|---|
| T-030 | Buat query sesi untuk praktikan (kelas dengan `pesertaIds` memuat uid) dan gabungkan dengan data kelas dan asisten | Modul jadwal praktikan | Data lengkap sesuai kartu Sprint 1 | P3 | T-025 |
| T-031 | Migrasikan `src/app/(praktikan)/jadwal/index.tsx` dan `[id].tsx` ke data Firestore; pertahankan empty state dan props presentational | Dua layar praktikan | Tidak ada data dummy | P3 | T-030 |
| T-032 | Uji jadwal kosong, sesi lintas kelas, dan akun praktikan tanpa kelas | Catatan uji | Empty state benar | P3 | T-031 |

### US-08 Presensi dan rekap real-time

| Task | Deskripsi | Deliverable | Kriteria selesai | Owner | Dependensi |
|---|---|---|---|---|---|
| T-033 | Buat `src/lib/presensi.ts`: `catatPresensi` memakai transaction dan ID dokumen praktikan untuk mencegah duplikat | Modul presensi | Dua permintaan bersamaan hanya menghasilkan satu dokumen | P3 | T-030 |
| T-034 | Migrasikan detail sesi praktikan: status sesi real-time, tombol presensi, alasan nonaktif, pesan hasil | Detail sesi praktikan | Presensi berhasil dan gagal tertangani | P3 | T-033 |
| T-035 | Ganti rekap asisten di `src/app/(asisten)/jadwal/[id].tsx` menjadi listener presensi per sesi, urut waktu | Rekap real-time | Rekap bertambah tanpa reload | P3 | T-033 |
| T-036 | Ganti riwayat kehadiran praktikan menjadi listener presensi milik uid | Tab Kehadiran real-time | Riwayat bertambah tanpa reload | P3 | T-033 |
| T-037 | Uji presensi ganda dua perangkat, sesi ditutup saat detail praktikan terbuka, dan tiga platform | Catatan uji | Semua kasus lulus | P3 | PM-07 |

### US-09 Pengajuan izin

| Task | Deskripsi | Deliverable | Kriteria selesai | Owner | Dependensi |
|---|---|---|---|---|---|
| T-038 | Buat `src/lib/izin.ts`: `ajukanIzin` dengan ID dokumen praktikan, validasi panjang alasan dan duplikat | Modul izin | Satu pengajuan per sesi | P2 | T-019 |
| T-039 | Buat route `src/app/(praktikan)/izin.tsx` dan layar form: pilih sesi, alasan, bottom sheet konfirmasi | Tab Izin praktikan | Pengajuan tersimpan | P2 | T-038 |
| T-040 | Tampilkan status pengajuan dan `klasifikasiStatus` pada kartu izin | Kartu status | Status terbaca tanpa warna saja | P2 | T-039 |
| T-041 | Uji duplikat, sesi ditutup, alasan terlalu pendek, dan sesi kelas lain | Catatan uji | Semua ditolak dengan pesan | P2 | PM-07 |

### US-10 Klasifikasi AI

| Task | Deskripsi | Deliverable | Kriteria selesai | Owner | Dependensi |
|---|---|---|---|---|---|
| T-042 | Buat `src/lib/ai.ts`: baca `EXPO_PUBLIC_AI_BASE_URL` dan `EXPO_PUBLIC_AI_API_KEY`, fungsi `klasifikasiAlasan` dengan timeout | Klien AI | Gagal cepat bila env kosong | P2 | PM-05 |
| T-043 | Panggil klasifikasi setelah izin tersimpan dan simpan `kategoriAi`, `klasifikasiStatus`, `diprosesPada` | Integrasi klasifikasi | Hasil tersimpan di dokumen izin | P2 | T-042 |
| T-044 | Tangani gagal jaringan, timeout, dan respons tidak sesuai skema: status `gagal`, izin tetap tersimpan, tombol coba lagi | Penanganan gagal | UI tidak macet | P2 | T-043 |
| T-045 | Sediakan mock respons untuk pengembangan sebelum endpoint dan skema dari pengajar tersedia | Mock/fixture | Pengembangan UI tidak terblokir | P2 | T-042 |
| T-046 | Uji jalur sukses, gagal jaringan, dan respons tidak valid | Catatan uji | Tiga jalur lulus | P2 | T-044 |

### US-11 Review izin

| Task | Deskripsi | Deliverable | Kriteria selesai | Owner | Dependensi |
|---|---|---|---|---|---|
| T-047 | Buat listener izin per sesi yang diampu asisten, dengan filter status | Modul review izin | Daftar real-time | P2 | T-038 |
| T-048 | Buat layar daftar dan detail izin di `src/app/(asisten)/izin/index.tsx` dan `[id].tsx` | Layar review | Alasan dan saran AI tampil | P2 | T-047 |
| T-049 | Implementasi setujui dan tolak dengan bottom sheet, simpan `status`, `diputuskanPada`, `diputuskanOleh` | Aksi keputusan | Hanya status `menunggu` bisa diputuskan | P2 | T-048 |
| T-050 | Uji keputusan ganda, keputusan oleh praktikan, dan sinkronisasi dua perangkat | Catatan uji | Semua kasus sesuai AC | P2 | PM-07 |

### US-12 Status izin praktikan

| Task | Deskripsi | Deliverable | Kriteria selesai | Owner | Dependensi |
|---|---|---|---|---|---|
| T-051 | Ganti daftar izin di tab Izin praktikan menjadi listener milik uid, tampilkan status dan keputusan | Riwayat izin | Perubahan status tampil tanpa reload | P2 | T-049 |
| T-052 | Uji isolasi data antar praktikan dan empty state | Catatan uji | Praktikan lain tidak terbaca | P2 | PM-07 |

### Pembersihan lintas story

| Task | Deskripsi | Deliverable | Kriteria selesai | Owner | Dependensi |
|---|---|---|---|---|---|
| T-053 | Hapus `src/data/dummy.ts` dan seluruh impornya; `src/store/session-store.tsx` hanya membaca dari Firestore, termasuk daftar pengguna untuk nama asisten dan pemilih peserta | Sumber data tunggal | `grep` tidak menemukan impor `@/data/dummy`; aplikasi berjalan tanpa data in-memory | P1 | T-031, T-035, T-036 |

## 6. Programmer Assignment

Pembagian memakai pendekatan vertical slicing: satu programmer memiliki satu alur fungsional dari UI, logika, integrasi data, validasi, penanganan error, sampai pengujian di tiga platform. Tidak ada pembagian berdasarkan jenis file.

### 6.1 Programmer 1: Anggita Kirana Puspa

**Primary responsibility.** Identitas dan akses, plus fondasi koneksi data yang dipakai bersama.

| User Story | Technical Tasks | Expected Deliverable |
|---|---|---|
| US-01 | T-001, T-002, T-003, T-004, T-005 | Registrasi praktikan berjalan end-to-end dengan dokumen users otomatis |
| US-02 | T-006, T-007, T-008, T-009, T-010, T-011, T-053 | Login email, logout, sesi persisten di tiga platform, data dummy dihapus |
| US-03 | T-012, T-013, T-014, T-015 | Guard berbasis Firestore, profil tanpa aksi demo |
| US-04 | T-016, T-017, T-018, T-019 | Modul `src/lib/firebase.ts`, `konversi.ts`, `firestore.ts` dan tipe Firestore |

**Dependencies.** Membutuhkan PM-01 sampai PM-05 sebelum D1 berakhir. P2 dan P3 menunggu T-016 sampai T-019. Jika fondasi belum siap pada D1, P2 dan P3 tetap mengerjakan lapisan UI terhadap tipe dan kontrak di bagian 8.3.

**Testing responsibility.** Registrasi, login, logout, pemulihan sesi, guard semua kombinasi role, dan penolakan rules untuk role asisten. Diuji di Android, iOS, dan Web.

### 6.2 Programmer 2: Devano Trestanto

**Primary responsibility.** Alur pengajuan izin secara utuh, termasuk integrasi AI dan keputusan asisten.

| User Story | Technical Tasks | Expected Deliverable |
|---|---|---|
| US-09 | T-038, T-039, T-040, T-041 | Form pengajuan, riwayat status awal, validasi duplikat dan kepemilikan sesi |
| US-10 | T-042, T-043, T-044, T-045, T-046 | Klien AI, penyimpanan hasil, penanganan gagal, mock pengembangan |
| US-11 | T-047, T-048, T-049, T-050 | Daftar dan detail izin asisten, aksi setujui dan tolak |
| US-12 | T-051, T-052 | Riwayat izin praktikan dengan pembaruan real-time |

**Dependencies.** Membutuhkan T-019 (lapisan data) dan T-030 (jadwal praktikan) sebelum integrasi. Detail API AI dari pengajar; sampai tersedia, memakai mock T-045. Tidak menunggu P3 untuk membangun UI.

**Testing responsibility.** Pengajuan ganda, akses sesi kelas lain, jalur gagal AI, keputusan ganda, isolasi data antar praktikan, dan sinkronisasi dua perangkat.

### 6.3 Programmer 3: Nashwa Aldebaran

**Primary responsibility.** Data praktikum dan presensi real-time, dari CRUD asisten sampai rekap.

| User Story | Technical Tasks | Expected Deliverable |
|---|---|---|
| US-05 | T-020, T-021, T-022, T-023, T-024 | Tab Kelas, CRUD kelas, pengelolaan peserta |
| US-06 | T-025, T-026, T-027, T-028, T-029 | CRUD sesi, transisi status di Firestore, jadwal asisten real-time |
| US-07 | T-030, T-031, T-032 | Jadwal dan detail praktikan dari Firestore |
| US-08 | T-033, T-034, T-035, T-036, T-037 | Presensi anti-duplikat, rekap dan riwayat real-time |

**Dependencies.** Membutuhkan T-019 dari P1 dan PM-07 (rules) untuk pengujian. T-030 menjadi prasyarat P2 untuk memilih sesi saat mengajukan izin.

**Testing responsibility.** Presensi bersamaan dari dua perangkat, transisi status ilegal, rekap urut waktu, kelas dan sesi kosong, serta perilaku web.

### 6.4 Alasan pembagian dan keseimbangan

| Programmer | Story | Estimasi total | Kompleksitas utama |
|---|---|---|---|
| P1 | 4 | 1 S + 3 M | Fondasi menahan seluruh tim, risiko waktu di D1 |
| P2 | 4 | 1 S + 3 M | Ketergantungan eksternal API AI dan jalur gagal |
| P3 | 4 | 1 S + 2 M + 1 L | Cakupan terluas, presensi real-time paling rawan |

- P1 memegang auth karena seluruh identitas dan rules bergantung pada `uid` dan role. P1 juga memegang modul data bersama agar hanya satu orang yang mengubah kontrak koneksi.
- P2 memegang izin end-to-end sesuai kebutuhan: integrasi AI, tampilan asisten, dan keputusan berada di satu tangan sehingga tidak ada negosiasi kontrak internal.
- P3 memegang data dan presensi karena CRUD kelas dan sesi adalah prasyarat data bagi P1 (jadwal praktikan) dan P2 (pemilihan sesi). Beban P3 paling besar; bila T-030 melewati D3, P1 mengambil alih T-031 dan T-032 agar P2 tidak terblokir.
- Tidak ada story yang dimiliki dua orang. Perubahan kontrak bersama (tipe, konversi, nama koleksi) hanya lewat P1 dan diumumkan ke tim lewat pesan grup.

### 6.5 Koordinasi dan workflow

Workflow Git Sprint 1 dipertahankan tanpa perubahan: branch `<type>/<owner>-<area>-<slug>`, Conventional Commits dengan scope, PR maksimal 400 baris dan 10 file, satu approval, squash merge. Aturan lengkap ada di `docs/GIT-WORKFLOW.md`.

Tambahan untuk Sprint 2:

| Topik | Aturan |
|---|---|
| Pengumuman perubahan kontrak | Setiap perubahan pada `src/types/firestore.ts`, `src/lib/firestore.ts`, atau nama koleksi wajib diumumkan ke tim pada hari yang sama dan dijelaskan di deskripsi PR |
| Dependency baru | Dipasang PM dengan `npx expo install`, diumumkan ke tim, dan dijelaskan di deskripsi PR |
| File konfigurasi Firebase | Hanya PM yang mengubah `src/lib/firebase.ts` bagian inisialisasi, `.env`, `app.json`, dan Security Rules |
| Review | Reviewer default adalah pemilik story terkait; perubahan lintas fitur direview PM |
| Rencana harian | D1 fondasi dan auth, D2 data praktikum dan jadwal, D3 izin dan AI, D4 integrasi dan QA tiga platform, D5 perbaikan dan demo |

## 7. Project Manager Responsibilities

Pekerjaan PM terpisah dari backlog programmer dan wajib selesai sebelum atau bersamaan D1.

| ID | Pekerjaan | Output | Kriteria selesai | Target |
|---|---|---|---|---|
| PM-01 | Membuat Firebase project dan mengaktifkan Authentication dengan provider Email/Password | Project aktif | Login email berhasil | D1 pagi |
| PM-02 | Mendaftarkan aplikasi Android, iOS, dan Web di Firebase Console | Catatan app ID | Tercatat di konsol | D1 pagi |
| PM-03 | Membuat Cloud Firestore mode production dan memilih region | Database aktif | Koleksi uji dapat ditulis | D1 pagi |
| PM-04 | Memasang dependency: `firebase`, `@react-native-async-storage/async-storage`, `react-dom`, `react-native-web`, `@expo/metro-runtime` memakai `npx expo install` | `package.json` dan lockfile | Aplikasi berjalan di tiga platform | D1 siang |
| PM-05 | Menyiapkan `.env` lokal dan `.env.example`, menambahkan `.env` ke `.gitignore`, mendokumentasikan variabel `EXPO_PUBLIC_*` | Konfigurasi environment | Variabel terbaca di bundel | D1 siang |
| PM-06 | Mengaktifkan platform web di `app.json` dan memastikan build web berjalan | Konfigurasi platform | `npx expo export -p web` berhasil | D1 sore |
| PM-07 | Menyusun baseline Security Rules sesuai bagian 8.6 dan memasangnya ke project | Rules aktif | Uji dasar baca dan tulis sesuai role | D1 sore |
| PM-08 | Seed data: 2 akun asisten Auth beserta dokumen `users`, 2 kelas, 5 sesi, 1 akun praktikan uji | Data seed | Login asisten dan praktikan berhasil | D1 sore |
| PM-09 | Verifikasi koneksi dari Android, iOS, dan Web: baca daftar sesi dan tulis satu presensi uji | Catatan verifikasi | Tiga platform terhubung | D2 pagi |
| PM-10 | Tentukan apakah uji Security Rules memakai Firebase Emulator Suite (menambah dependency `firebase-tools` dan `@firebase/rules-unit-testing`) | Keputusan | Tercatat di deskripsi PR | D2 pagi |

**Titik koordinasi PM dan programmer.**

1. D1 pagi: PM menyerahkan nama project, isi `.env.example`, dan daftar akun seed. Programmer tidak menebak ID project.
2. D1 sore: PM mengumumkan baseline rules. Sejak saat itu, penambahan aturan diusulkan lewat PR kecil atau pesan grup, bukan diubah langsung oleh programmer.
3. Setiap hari: PM memeriksa kebutuhan akses baru dari story yang sedang dikerjakan.
4. D4: PM menjalankan QA manual tiga platform dan mencatat status AC.
5. D5: PM menandai tag `sprint-2` setelah demo lulus.

Catatan teknis untuk PM: dengan Firebase JS SDK, aplikasi hanya memakai satu konfigurasi web app. Registrasi aplikasi Android dan iOS di konsol tidak dibutuhkan oleh SDK ini dan hanya diperlukan bila nanti memakai SDK native seperti FCM. Tetap didaftarkan bila pengajar mensyaratkan.

## 8. Technical Decisions and Dependencies

### 8.1 SDK Firebase

Memakai **Firebase JS SDK modular (`firebase`)** untuk Android, iOS, dan Web.

Alasan:

- Satu codebase dan satu jalur inisialisasi untuk tiga platform.
- Berjalan di Expo Go tanpa build native dan tanpa `google-services.json` atau `GoogleService-Info.plist`, sehingga tidak perlu mengubah proyek menjadi prebuild.
- Tidak menambah variabel native, cocok dengan kondisi repository yang belum memiliki folder `ios/` dan `android/`.
- API Auth dan Firestore identik dengan yang dipakai di web, termasuk listener real-time.

Konsekuensi yang harus diterima: autentikasi mobile memerlukan `@react-native-async-storage/async-storage` untuk persistence, dan ukuran bundel lebih besar dibanding SDK native. Nama API persistence perlu diverifikasi pada versi `firebase` yang terpasang (T-009).

### 8.2 Autentikasi dan otorisasi

- Identifier login: email dan kata sandi.
- Registrasi publik hanya untuk role `praktikan`. Akun asisten dibuat PM lewat Firebase Console, lalu dokumen `users` ditulis dengan `peran: "asisten"`.
- Role tidak disimpan di custom claims, tetapi di dokumen `users/{uid}`. Alasan: lebih mudah diubah saat pengembangan dan dapat dibaca langsung oleh UI. Risiko: Security Rules perlu membaca dokumen tambahan.
- Guard aplikasi memakai `Stack.Protected` seperti Sprint 1, dengan sumber `status auth` dan `peran` dari Firestore.
- "Ganti peran (demo)" dihapus dari menu profil.
- Sesi Auth yang tidak memiliki dokumen `users` langsung diakhiri.

### 8.3 Struktur data Firestore

```text
users/{uid}
  nama: string
  nomorInduk: string
  peran: "praktikan" | "asisten"
  dibuatPada: Timestamp

kelas/{kelasId}
  nama: string                // nama praktikum
  lab: string
  asistenId: string           // uid asisten pengampu
  pesertaIds: string[]        // kumpulan uid praktikan
  dibuatPada: Timestamp

sesi/{sesiId}
  kelasId: string
  asistenId: string
  hari: string                // "Senin"
  tanggal: string             // "2026-11-12"
  jamMulai: string            // "13:00"
  jamSelesai: string          // "15:00"
  status: "belum-dibuka" | "dibuka" | "ditutup"
  dibukaPada?: Timestamp
  ditutupPada?: Timestamp
  dibuatPada: Timestamp

sesi/{sesiId}/presensi/{uid}
  praktikanId: string
  waktu: Timestamp

sesi/{sesiId}/izin/{uid}
  praktikanId: string
  alasan: string
  status: "menunggu" | "disetujui" | "ditolak"
  kategoriAi?: string
  klasifikasiStatus: "menunggu" | "selesai" | "gagal"
  diprosesPada?: Timestamp
  dibuatPada: Timestamp
  diputuskanPada?: Timestamp
  diputuskanOleh?: string
```

Pemetaan dari model Sprint 1:

| Sprint 1 | Sprint 2 | Catatan |
|---|---|---|
| `User.id` | ID dokumen `users` | Sama dengan `uid` Firebase Auth |
| `Sesi.namaPraktikum` | `kelas.nama` | Dibaca lewat `kelasId` |
| `Sesi.kelas` | `kelas.nama` | Label kelas di kartu memakai nama kelas |
| `Sesi.lab` | `kelas.lab` | Satu sumber, tidak diduplikasi di sesi |
| `Sesi.pesertaIds` | `kelas.pesertaIds` | Peserta melekat pada kelas |
| `Sesi.asistenId` | tetap | Disalin agar rules tidak perlu membaca kelas |
| `Presensi` | `sesi/{id}/presensi/{uid}` | ID dokumen menjamin anti-duplikat |
| `Kredensial` | dihapus | Ditangani Firebase Auth |
| `Izin` | baru | Satu dokumen per sesi per praktikan |

Aturan penamaan field tetap bahasa Indonesia agar UI tidak perlu pemetaan tambahan. Tipe domain aplikasi tetap di `src/types/index.ts`; tipe dokumen Firestore di `src/types/firestore.ts`.

Setelah migrasi selesai, `src/data/dummy.ts` dihapus (T-053). Pada masa transisi, file itu masih ada, tetapi tidak boleh menjadi sumber data layar mana pun. Seed untuk pengembangan hanya ditulis PM ke Firestore (PM-08), bukan lewat kode aplikasi.

### 8.4 Real-time

- Semua data yang tampil memakai `onSnapshot`: sesi, presensi rekap, riwayat, izin, dan profil.
- Setiap listener dibersihkan pada fungsi cleanup `useEffect`.
- Status layar memakai `memuat`, `data`, `kosong`, `gagal`. Story yang menampilkan daftar wajib menguji keempat status.
- Tidak memakai polling dan tidak memakai refresh manual sebagai pengganti listener.
- Untuk rekap asisten, listener dibatasi pada sesi yang sedang dibuka agar jumlah listener terkendali.

### 8.5 Integrasi AI

Alur: pengajuan disimpan, lalu klasifikasi dipanggil, hasil ditulis ke dokumen izin. Kegagalan klasifikasi tidak membatalkan pengajuan.

Keputusan yang sudah ditetapkan:

- Pemanggilan langsung dari aplikasi memakai `EXPO_PUBLIC_AI_BASE_URL` dan `EXPO_PUBLIC_AI_API_KEY`.
- Klasifikasi tidak pernah mengubah `status` izin.
- Hasil ditampilkan dengan label bahwa AI hanya memberi saran.

Yang belum diketahui dan tidak boleh dikarang:

| Item | Status |
|---|---|
| Path endpoint | Perlu dikonfirmasi pengajar |
| HTTP method dan header autentikasi | Perlu dikonfirmasi pengajar |
| Skema request body | Perlu dikonfirmasi pengajar |
| Skema response dan nama field kategori | Perlu dikonfirmasi pengajar |
| Daftar kategori yang mungkin | Perlu dikonfirmasi pengajar |
| Batas waktu dan kuota pemanggilan | Perlu dikonfirmasi pengajar |

Sampai informasi tersedia, T-045 menyediakan mock. Semua pemetaan field AI dikumpulkan di `src/lib/ai.ts` agar perubahan skema hanya menyentuh satu file.

**Panduan untuk Programmer 2 mendapat detail API.** Programmer 2 menghubungi pengajar paling lambat D1 dan menanyakan enam item di tabel di atas secara tertulis. Format pertanyaan yang bisa dipakai: "Untuk API klasifikasi alasan izin, mohon info: (1) base URL dan path endpoint, (2) method dan header autentikasi, (3) contoh request body, (4) contoh response beserta nama field kategori, (5) daftar kategori yang mungkin keluar, (6) batas waktu dan kuota." Jawaban dicatat di `src/lib/ai.ts` sebagai komentar dan disalin ke bagian 8.5 dokumen ini. Bila pengajar belum menjawab sampai D3, mock T-045 tetap dipakai dan risikonya dicatat di bagian 11.

### 8.6 Security Rules

Baseline yang sudah diterapkan di `firestore.rules`. Kolom tulis mencakup create, update, dan delete.

| Koleksi | Baca | Tulis |
|---|---|---|
| `users` | Diri sendiri; asisten boleh membaca profil praktikan untuk rekap dan pemeriksaan izin | Hanya diri sendiri; `peran` tidak boleh diubah. `nama` dan `nomorInduk` boleh diperbarui pemiliknya |
| `kelas` | Asisten pengampu; praktikan yang ada di `pesertaIds` | Hanya asisten pengampu dengan `asistenId == uid`, termasuk delete. Kelas yang masih punya sesi dicek di lapisan data karena rules tidak bisa query koleksi `sesi` |
| `sesi` | Asisten pengampu; praktikan peserta kelas | Hanya asisten pengampu. Create selalu `belum-dibuka`; transisi hanya `belum-dibuka` ke `dibuka` ke `ditutup`; sesi `ditutup` tidak dapat diubah; `kelasId` tidak dapat dipindah |
| `sesi/{id}/presensi` | Praktikan pemilik dokumen; asisten pengampu sesi | Create hanya oleh praktikan pemilik, hanya jika sesi `dibuka` dan ia peserta, dengan `waktu` timestamp server. Update dan delete ditolak |
| `sesi/{id}/izin` | Praktikan pemilik; asisten pengampu | Create oleh praktikan pemilik dengan `status: "menunggu"` dan `klasifikasiStatus: "menunggu"`, hanya bila sesi belum ditutup. Update field AI hanya selama `menunggu`; keputusan hanya oleh asisten pengampu dengan `diputuskanOleh` = uid-nya |

Prinsip yang wajib diuji:

1. Praktikan tidak dapat mengubah `status` izin atau dokumen presensi.
2. Praktikan tidak dapat membaca data praktikan lain.
3. Asisten tidak dapat mengubah sesi asisten lain.
4. Sesi `ditutup` tidak dapat dibuka kembali.
5. Validasi status dan kepemilikan dilakukan di server. Pengecekan yang tidak bisa dilakukan rules, yaitu kelas yang masih punya sesi dan hapus berantai subkoleksi, dilakukan di lapisan data.

### 8.7 Environment dan konfigurasi

- Variabel: `EXPO_PUBLIC_FIREBASE_API_KEY`, `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`, `EXPO_PUBLIC_FIREBASE_PROJECT_ID`, `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`, `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `EXPO_PUBLIC_FIREBASE_APP_ID`, `EXPO_PUBLIC_AI_BASE_URL`, `EXPO_PUBLIC_AI_API_KEY`.
- `EXPO_PUBLIC_*` tertanam di bundel dan bukan rahasia. Konfigurasi web Firebase memang bersifat publik dan diamankan oleh Security Rules. Kunci API AI adalah satu-satunya nilai sensitif; risikonya disetujui sadar untuk skala tugas ini.
- `.env` tidak di-commit. Repository saat ini hanya mengabaikan `.env*.local`, sehingga penambahan `.env` ke `.gitignore` menjadi tugas PM-05.

### 8.8 Dependency tambahan

| Package | Alasan | Pemasang |
|---|---|---|
| `firebase` | Auth, Firestore, SDK JS | PM |
| `@react-native-async-storage/async-storage` | Persistence Auth di iOS dan Android | PM |
| `react-dom`, `react-native-web`, `@expo/metro-runtime` | Menjalankan target web | PM |
| `firebase-tools`, `@firebase/rules-unit-testing` | Uji Security Rules dengan emulator, opsional | PM, keputusan PM-10 |

### 8.9 Ketergantungan antarfitur

```text
PM-01..PM-07 (infrastruktur)
  -> US-04 (lapisan data)
      -> US-01 -> US-02 -> US-03
      -> US-05 -> US-06 -> US-07 -> US-08
                                  -> US-09 -> US-10 -> US-11 -> US-12
```

- US-04 adalah satu-satunya jalur kritis yang menahan semua story lain. Keterlambatan di sini langsung memotong waktu P2 dan P3.
- US-06 dan US-07 dibutuhkan P2 untuk memilih sesi pada form izin. Bila terlambat, P2 memakai daftar sesi dari seed untuk pengembangan UI, bukan mengubah kontrak.
- US-10 bergantung pada akses API AI yang belum tersedia. Mock T-045 wajib ada di D1 agar P2 tidak menganggur.

### 8.10 Hal yang perlu dikonfirmasi PM

| Item | Dampak bila tidak dikonfirmasi |
|---|---|
| Detail API AI (endpoint, skema, kategori) | Implementasi klasifikasi memakai mock, demo B tidak bisa memakai model asli |
| Pembaruan dokumentasi lama yang masih menyatakan web bukan target dan backend non-goal | Kontradiksi aturan bagi programmer dan reviewer. Sudah diperbarui; PM cukup memeriksa ulang sebelum D1 |
| Pengujian rules memakai emulator atau manual | Waktu D4 dan kebutuhan dependency |
| Registrasi Android dan iOS di konsol meski SDK JS tidak memerlukannya | Hanya kelengkapan administrasi |

**Sudah diputuskan.** Asisten boleh membaca semua dokumen `users` berperan praktikan, termasuk yang bukan peserta kelasnya. Batasan per kelas tidak dapat ditegakkan karena Security Rules tidak bisa query relasi kelas. Akses ini dipakai untuk rekap presensi dan pemeriksaan izin.

## 9. Testing Strategy

| Jenis | Cakupan | Pelaksana | Kapan |
|---|---|---|---|
| Unit (node assert) | Fungsi murni yang tidak bergantung SDK: validasi alasan izin, pemetaan error, transformasi data sesi dan rekap | Pemilik story | Setiap story selesai |
| Integration | Modul `src/lib/*` terhadap project Firebase nyata atau emulator: registrasi, login, CRUD kelas dan sesi, presensi, izin | Pemilik story | D2 sampai D4 |
| Authentication | Registrasi, login salah, sesi persisten, logout, akun tanpa dokumen users | P1 | D2 dan D4 |
| Authorization | Praktikan membuka data praktikan lain, asisten membuka sesi asisten lain, praktikan mengubah keputusan izin | P2 dan P3, difasilitasi PM | D3 dan D4 |
| Security Rules | Seluruh tabel di bagian 8.6, dijalankan dengan emulator bila PM-10 disetujui | PM dan pemilik story | D2 sampai D4 |
| Real-time | Presensi dari dua perangkat, status sesi berubah saat detail praktikan terbuka, keputusan izin di sisi praktikan | P2 dan P3 | D3 dan D4 |
| Integrasi AI | Jalur sukses, timeout, respons tidak sesuai skema, izin tetap tersimpan saat gagal | P2 | D3 dan D4 |
| End-to-end | Alur A dan Alur B bagian 3 pada dua perangkat atau dua tab, satu sesi tanpa reload | PM | D4 dan D5 |
| Lintas platform | Setiap story diuji di Android, iOS, dan Web pada hari story selesai, bukan hanya di akhir sprint | Pemilik story | Harian |

Catatan pengujian lintas platform:

- Web diuji dengan `npx expo start --web` dan minimal satu kali `npx expo export -p web` sebelum D5.
- Komponen `expo-symbols` wajib diperiksa di web. Bila ikon tidak tampil, gunakan fallback teks atau komponen pengganti tanpa mengubah token.
- Keyboard dan safe area diuji di iOS, tombol back diuji di Android.

## 10. Definition of Done

**Task**

- [ ] Kode sesuai deskripsi task dan kriteria selesai di bagian 5.
- [ ] `npx tsc --noEmit` dan `npx expo lint` hijau.
- [ ] Tidak ada `console.log` sisa, tidak ada kredensial hardcode.
- [ ] Perubahan dependency atau konfigurasi dijelaskan di deskripsi PR.

**User Story**

- [ ] Semua acceptance criteria terbukti, dengan langkah uji yang dicatat.
- [ ] Diuji di Android, iOS, dan Web.
- [ ] State memuat, kosong, dan gagal tersedia bila layar menampilkan data.
- [ ] Error dari Firestore atau AI tampil sebagai pesan yang dapat dipahami.
- [ ] Security Rules terkait story diuji, termasuk jalur penolakan.
- [ ] Tidak merusak fitur lain: jadwal, detail, presensi, rekap, dan profil tetap berjalan.
- [ ] PR sudah direview dan di-merge sesuai `docs/GIT-WORKFLOW.md`.

**Sprint**

- [ ] Alur A dan Alur B berjalan end-to-end dengan data Firestore, tanpa reload, pada dua perangkat atau dua tab.
- [ ] Data tetap ada setelah aplikasi ditutup dan dibuka kembali, di mobile dan web.
- [ ] Seluruh 12 user story berstatus selesai, atau story yang tidak selesai dicatat di bagian 12.
- [ ] Tidak ada dependency lama yang tidak terpakai tertinggal tanpa penjelasan.
- [ ] Dokumentasi kontrak data dan aturan akses sesuai kondisi akhir.
- [ ] `npx tsc --noEmit` dan `npx expo lint` hijau di `main`.

## 11. Risks and Mitigation

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Ketidakcocokan dependency lintas platform, terutama `expo-symbols` di web | Fitur tampil berbeda atau error di web | Uji web setiap hari, mulai D1; siapkan fallback ikon |
| Persistence Auth berbeda di mobile dan web | Sesi hilang setelah reload | T-009 menguji tiga platform sebelum D2 |
| Modul data bersama terlambat | P2 dan P3 terblokir | Kontrak di bagian 8.3 dibekukan D1; P2 dan P3 membangun UI terhadap tipe tersebut |
| Security Rules terlalu longgar atau memblokir fitur | Data bocor atau fitur gagal | Uji jalur positif dan negatif setiap story; PM meninjau usulan aturan |
| API AI tidak tersedia atau skemanya berbeda | Alur B tidak lengkap | Mock T-045; pemetaan terpusat di `src/lib/ai.ts`; jalur gagal wajib diuji |
| Kunci API AI terekspos di bundel | Penyalahgunaan kuota | Sadar diterima untuk skala tugas; batasi kuota di sisi pengajar bila memungkinkan |
| Presensi ganda dari dua perangkat | Data ganda atau tidak konsisten | ID dokumen presensi sama dengan `uid` dan transaction T-033 |
| Perubahan konfigurasi oleh programmer merusak setup PM | Aplikasi tidak terhubung | File inisialisasi, `.env`, `app.json`, dan rules hanya diubah PM |
| Beban P3 paling besar | D4 tidak siap | T-030 diprioritaskan; bila melewati D3, T-031 dan T-032 dialihkan ke P1 |
| PM baru belum pernah menyiapkan infrastruktur Firebase | Setup D1 terlambat dan seluruh tim menunggu | Dehar mulai membuat project sebelum D1; Devano (PM Sprint 1) mendampingi serah terima |
| Dokumentasi lama menyatakan web bukan target | Review dan aturan kerja bertentangan | PM memperbarui `README.md`, `docs/PRD.md`, `AGENTS.md`, dan `docs/PEMBAGIAN-TUGAS.md` sebelum D1 |
| Data seed dan akun asisten tidak siap D1 | P2 dan P3 tidak bisa menguji | PM-08 diselesaikan D1 sore; seed ditulis sebagai data, bukan lewat UI |

## 12. Sprint Review

Diisi pada 16 November 2026.

**Completed User Stories.** [Belum diisi]

**Incomplete User Stories.** [Belum diisi]

**Known Issues.** [Belum diisi]

**Review Notes.** [Belum diisi]
