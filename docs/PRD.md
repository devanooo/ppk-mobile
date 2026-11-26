# PRD: PraktikumKU, Sprint 1–4

> Dokumen ini merangkum requirement Sprint 1–4. Sprint 2 mencabut beberapa batasan Sprint 1: dukungan web, backend/database, autentikasi nyata, registrasi, persistensi sesi, dan sinkronisasi lintas perangkat. Acuan Sprint 2 adalah [`docs/sprints/sprint-2.md`](sprints/sprint-2.md). Sprint 3 mencabut batasan notifikasi push serta presensi QR/lokasi, dan menambahkan Maps; acuannya [`docs/sprints/sprint-3.md`](sprints/sprint-3.md). Sprint 4 menambahkan role Aslab, administrasi laboratorium, denda, pembayaran Midtrans Sandbox melalui backend, notifikasi tagihan/pembayaran, dan analisis sentimen AI untuk izin; acuannya [`docs/sprints/sprint-4.md`](sprints/sprint-4.md).
>
> Requirement Sprint 1–3 yang masih relevan dipertahankan. Bagian 15–23 berisi tambahan requirement Sprint 4 tanpa menghapus ketentuan sebelumnya. Bila ada pertentangan, dokumen sprint untuk pekerjaan sprint terkait yang berlaku, dan keputusan PM pada bagian 19 menjadi acuan bisnis Sprint 4.

## 1. Informasi produk dan tujuan sprint

| Field | Isi |
|---|---|
| Produk | PraktikumKU |
| Sprint | Sprint 1: UI, navigasi, auth dummy, dan alur inti. Sprint 2: Firebase Authentication, Cloud Firestore, izin, dan klasifikasi AI. Sprint 3: presensi QR/lokasi, Maps, dan push notification. Sprint 4: role Aslab, administrasi laboratorium, denda, pembayaran, AI izin, dan notifikasi transaksi |
| Platform | React Native (Expo), iOS, Android, dan Web. Sprint 1 hanya iOS/Android; Sprint 2 menambahkan Web; Sprint 3 menambahkan kamera, lokasi, Maps, dan push notification; Sprint 4 menambahkan pembayaran dan notifikasi transaksi dengan dukungan sesuai library, backend, dan platform |
| Data | Sprint 1: dummy dan state in-memory. Sprint 2 dan seterusnya: Firebase Authentication dan Cloud Firestore. Sprint 4 menambahkan koleksi laboratorium, mata kuliah, kelas, tagihan, pembayaran, dan notifikasi |
| Autentikasi | Sprint 1: dummy username + password. Sprint 2 dan seterusnya: Firebase Authentication dengan profil dan role di Firestore. Sprint 4 menambahkan role `aslab` di samping `praktikan` dan `asprak` |
| Status | Approved untuk Sprint 1–3; Sprint 4 dalam perencanaan |
| Pemilik | PM |

**Tujuan Sprint 1:** menghasilkan aplikasi yang dapat mendemonstrasikan pencatatan kehadiran praktikum dari dua perspektif, diawali landing page dan login dummy, dalam satu sesi aplikasi, tanpa backend.

**Definisi sukses Sprint 1:** demo script bagian 12 dijalankan berurutan tanpa reload dan tanpa error konsol, termasuk login, logout, dan ganti peran.

**Tujuan Sprint 4:** menyelesaikan pengelolaan laboratorium dan distribusi anggota oleh Aslab, operasional sesi/presensi/izin oleh Asprak, pengajuan izin oleh Praktikan dengan dukungan AI, perhitungan denda, pembayaran Midtrans Sandbox melalui backend, notifikasi, dan penyempurnaan navigasi. Definisi sukses Sprint 4 ada pada bagian 21 dan [`docs/sprints/sprint-4.md`](sprints/sprint-4.md) bagian 12.

## 2. Problem statement dan solusi

**Masalah.** Praktikan tidak punya cara pasti untuk tahu apakah sesi sudah dibuka, sehingga kehadiran dicatat manual dan mudah terlewat. Asisten tidak punya rekap waktu kehadiran yang rapi. Status sesi tidak terlihat konsisten antara asisten dan praktikan. Pengguna juga tidak punya titik masuk yang jelas untuk memahami aplikasi sebelum masuk ke alur praktikum.

**Solusi.** Satu aplikasi dengan landing page, login dummy, dan dua perspektif. Pengguna masuk dengan akun dummy, lalu diarahkan ke beranda sesuai peran. Asisten membuka sesi saat praktikum dimulai, memantau presensi, lalu menutup sesi. Praktikan melihat jadwal, membuka detail sesi, dan menekan presensi hanya ketika sesi dibuka. Waktu kehadiran tercatat dan tampil sebagai konfirmasi. Profil di header menyediakan jalan keluar akun dan kembali ke beranda.

## 3. Tujuan dan non-goals

**Tujuan**

1. Dua alur pengguna selesai end-to-end dalam satu sesi aplikasi.
2. Pengguna dapat masuk lewat landing page dan login dummy, lalu diarahkan ke antarmuka sesuai peran.
3. Status sesi konsisten antara daftar dan detail.
4. Aturan presensi, khususnya larangan presensi ganda, ditegakkan di lapisan data, bukan hanya UI.
5. Semua kondisi kosong memiliki tampilan yang jelas.
6. Pengguna dapat melihat identitas aktif, keluar akun, dan kembali ke beranda tanpa kehilangan data sesi selama aplikasi berjalan.

**Non-goals**

Daftar ini berlaku untuk Sprint 1 dan sebagian dicabut oleh Sprint 2 (lihat `docs/sprints/sprint-2.md` bagian 3): backend/database, autentikasi dan otorisasi nyata, registrasi akun, persistensi sesi setelah aplikasi ditutup, sinkronisasi lintas perangkat, pengelolaan data master, serta aplikasi web. Sprint 3 mencabut dua batasan lain: notifikasi push dan presensi QR/lokasi (lihat `docs/sprints/sprint-3.md` bagian 3).

Sprint 4 mencabut batasan pengelolaan laboratorium, distribusi anggota, role Aslab, denda, pembayaran, dan analisis sentimen AI untuk izin. Reset password baru dikoordinasikan dengan developer Auth pada Sprint 4 sebagai pekerjaan P2; keberhasilan implementasinya belum menjadi jaminan sampai task terkait selesai. Non-goals Sprint 4 yang tetap berlaku: pembayaran uang nyata di luar Midtrans Sandbox, keputusan izin otomatis oleh AI, reset data production, penyimpanan Secret Key Midtrans atau credential rahasia di aplikasi React Native, backend Midtrans dan detail API AI yang belum dikonfirmasi pengajar (TBD), serta perubahan requirement Sprint 1–3 di luar PDF Sprint 4.

Sisa non-goals yang masih berlaku: manajemen akun oleh admin, export laporan, multi-semester, riwayat audit perubahan status, membuka ulang sesi yang sudah ditutup, penutupan sesi otomatis berdasarkan waktu, serta aplikasi desktop.

## 4. Pengguna dan user stories

### 4.1 Akses dan identitas

1. **US-01 Landing page.** Sebagai pengguna, saya ingin melihat penjelasan singkat aplikasi di landing page, supaya saya tahu manfaat dan peran yang tersedia sebelum masuk.
2. **US-02 Login.** Sebagai pengguna, saya ingin login dengan username dan password dari akun dummy, supaya data yang tercatat atas nama yang benar.
3. **US-03 Validasi login.** Sebagai pengguna, saya ingin tombol Masuk nonaktif sampai username dan password diisi, supaya saya tidak mengirim form kosong.
4. **US-04 Redirect peran.** Sebagai pengguna, saya ingin diarahkan ke beranda sesuai peran setelah login, supaya saya langsung melihat menu yang relevan.
5. **US-05 Profil di header.** Sebagai pengguna, saya ingin melihat identitas aktif di header, supaya saya tahu akun yang sedang dipakai.
6. **US-06 Logout.** Sebagai pengguna, saya ingin keluar akun dengan konfirmasi, supaya saya tidak keluar karena salah tekan.
7. **US-07 Ganti peran demo.** Sebagai pengguna, saya ingin berpindah peran untuk demo tanpa mengetik ulang kredensial, supaya alur dua perspektif mudah diperagakan.
8. **US-08 Kembali ke beranda.** Sebagai pengguna, saya ingin kembali ke beranda dari halaman detail, supaya saya tidak tersesat di dalam alur.

### 4.2 Jadwal dan detail sesi

9. **US-09 Daftar jadwal.** Sebagai pengguna, saya ingin melihat daftar sesi yang relevan bagi saya, supaya saya tahu jadwal yang tersedia.
10. **US-10 Isi kartu jadwal.** Sebagai pengguna, saya ingin tiap kartu jadwal menampilkan nama praktikum, kelas, lab, hari dan tanggal, jam, dan status sesi, supaya saya bisa membedakan sesi.
11. **US-11 Detail sesi.** Sebagai pengguna, saya ingin membuka detail sesi, supaya saya melihat informasi lengkap termasuk nama asisten dan waktu buka/tutup.

### 4.3 Pengelolaan sesi (asisten)

12. **US-12 Buka sesi.** Sebagai asisten, saya ingin membuka sesi yang berstatus belum dibuka lewat konfirmasi, supaya saya tidak salah tekan.
13. **US-13 Waktu buka.** Sebagai asisten, saya ingin waktu buka tercatat dan ditampilkan, supaya saya tahu kapan sesi dimulai.
14. **US-14 Tutup sesi.** Sebagai asisten, saya ingin menutup sesi yang sedang dibuka lewat konfirmasi, supaya presensi berhenti pada waktu yang tepat.
15. **US-15 Waktu tutup.** Sebagai asisten, saya ingin waktu tutup tercatat, supaya sesi punya rentang waktu jelas.
16. **US-16 Aksi tidak valid.** Sebagai asisten, saya ingin tombol aksi yang tidak valid tidak tersedia atau nonaktif disertai alasan, supaya saya tidak mencoba aksi yang mustahil.
17. **US-17 Jumlah hadir.** Sebagai asisten, saya ingin melihat jumlah peserta hadir saat sesi berlangsung, supaya saya bisa memantau partisipasi.

### 4.4 Presensi (praktikan)

18. **US-18 Presensi aktif.** Sebagai praktikan, saya ingin tombol presensi aktif hanya saat sesi dibuka, supaya saya tidak presensi di luar waktu.
19. **US-19 Alasan tombol nonaktif.** Sebagai praktikan, saya ingin melihat alasan saat tombol nonaktif ("Sesi belum dibuka" atau "Sesi sudah ditutup"), supaya saya tahu harus menunggu atau sudah terlambat.
20. **US-20 Konfirmasi presensi.** Sebagai praktikan, saya ingin mengonfirmasi presensi lewat bottom sheet berisi nama sesi dan identitas saya, supaya saya yakin data yang dikirim benar.
21. **US-21 Feedback berhasil.** Sebagai praktikan, saya ingin menerima umpan balik jelas setelah presensi berhasil, supaya saya tahu kehadiran tercatat.
22. **US-22 Jam kehadiran.** Sebagai praktikan, saya ingin melihat jam kehadiran saya setelah presensi, supaya saya punya bukti waktu.
23. **US-23 Sudah presensi.** Sebagai praktikan, saya ingin tombol berubah menjadi "Sudah presensi" dan tidak bisa ditekan lagi, supaya saya tidak mengirim data ganda.
24. **US-24 Penolakan ganda.** Sebagai praktikan, saya ingin pesan penolakan bila mencoba presensi dua kali, supaya saya paham aturannya.

### 4.5 Rekap dan riwayat

25. **US-25 Rekap per sesi.** Sebagai asisten, saya ingin melihat daftar praktikan yang sudah presensi pada satu sesi beserta jam kehadiran, diurutkan berdasarkan waktu, supaya saya bisa memverifikasi kehadiran.
26. **US-26 Ringkasan kehadiran.** Sebagai asisten, saya ingin melihat jumlah hadir dibanding total peserta terdaftar, supaya saya tahu tingkat kehadiran sekilas.
27. **US-27 Ringkasan semua sesi.** Sebagai asisten, saya ingin melihat ringkasan seluruh sesi yang saya ampu pada tab Rekap, supaya saya tidak harus membuka sesi satu per satu.
28. **US-28 Riwayat praktikan.** Sebagai praktikan, saya ingin melihat riwayat kehadiran saya sendiri, supaya saya bisa mengecek catatan dari sesi sebelumnya.

### 4.6 Kondisi kosong dan tata letak

29. **US-29 Empty state.** Sebagai pengguna, saya ingin melihat empty state ketika daftar jadwal, rekap, atau riwayat kosong, supaya saya tahu aplikasi tidak rusak.
30. **US-30 Layout aman.** Sebagai pengguna, saya ingin tata letak menyesuaikan layar kecil dan aman dari notch, supaya konten tidak terpotong.

## 5. Alur utama

### 5.1 Publik

Landing page terbuka saat aplikasi dijalankan. Pengguna membaca ringkasan aplikasi, lalu menekan **Masuk**. Halaman login menampilkan form username dan password. Setelah kredensial valid, pengguna diarahkan ke beranda sesuai peran.

### 5.2 Praktikan

Login sebagai praktikan, lalu masuk ke tab *Jadwal*, pilih sesi, buka detail sesi, tekan **Presensi**, konfirmasi lewat bottom sheet. Setelah berhasil, jam kehadiran tampil dan tombol berubah menjadi *Sudah presensi*. Tab *Kehadiran* menampilkan catatan.

### 5.3 Asisten

Login sebagai asisten, lalu masuk ke tab *Jadwal*, pilih sesi, buka detail sesi, tekan **Buka sesi**, konfirmasi lewat bottom sheet. Status berubah menjadi *Dibuka* dan waktu buka tampil. Asisten memantau jumlah hadir dan daftar peserta, lalu menekan **Tutup sesi** dan mengonfirmasi. Status berubah menjadi *Ditutup* dan waktu tutup tampil. Tab *Rekap* menampilkan ringkasan sesi yang diampu.

### 5.4 Profil, ganti peran, dan logout

Dari header mana pun, pengguna membuka menu profil. Dropdown menampilkan nama, NIM/NIP, dan peran aktif. Aksi yang tersedia:

- **Beranda**: kembali ke daftar jadwal sesuai peran.
- **Ganti peran (demo)**: berpindah ke akun dummy peran lain tanpa mengetik ulang kredensial. Asisten dipetakan ke `mhs-1` (Ahmad), praktikan dipetakan ke `asisten-1` (Budi).
- **Keluar akun**: membuka konfirmasi, lalu kembali ke landing page.

Logout hanya mengosongkan identitas aktif. Sesi dan presensi tetap ada selama aplikasi belum ditutup atau di-reload.

## 6. Functional requirements

| ID | Requirement | User stories |
|---|---|---|
| FR-01 | Landing page publik yang menjelaskan aplikasi, dua peran, fitur utama, dan tombol Masuk | US-01 |
| FR-02 | Login dummy dengan username dan password, validasi form, dan redirect sesuai peran | US-02, US-03, US-04 |
| FR-03 | Daftar jadwal dan detail sesi dengan badge status untuk kedua peran | US-09, US-10, US-11 |
| FR-04 | Detail sesi menampilkan nama praktikum, kelas, lab, hari dan tanggal, jam, asisten, status, waktu buka/tutup | US-11, US-13, US-15 |
| FR-05 | Asisten membuka dan menutup sesi dengan konfirmasi bottom sheet | US-12 sampai US-17 |
| FR-06 | Praktikan melakukan presensi saat sesi dibuka, dengan konfirmasi dan feedback | US-18 sampai US-24 |
| FR-07 | Rekap asisten per sesi dan ringkasan, serta riwayat praktikan | US-25 sampai US-28 |
| FR-08 | Profil di header berupa dropdown, logout dengan konfirmasi, ganti peran demo, dan tombol Beranda | US-05 sampai US-08 |
| FR-09 | Empty state, feedback sukses/gagal, error login, layout flexbox, safe area, dan aksesibilitas | US-29, US-30 |
| FR-10 | Data dummy dan shared state sebagai sumber kebenaran, termasuk state autentikasi | Semua |

## 7. Aturan bisnis dan transisi status

**State machine sesi:** `belum-dibuka -> dibuka -> ditutup`

| Status | Aksi tersedia (asisten) | Presensi praktikan | Tombol di UI |
|---|---|---|---|
| `belum-dibuka` | Buka sesi | Ditolak | Nonaktif, label alasan "Sesi belum dibuka" |
| `dibuka` | Tutup sesi | Diizinkan | Aktif (atau "Sudah presensi") |
| `ditutup` | Tidak ada | Ditolak | Nonaktif, label alasan "Sesi sudah ditutup" |

**Aturan wajib**

1. Pengguna harus login sebelum mengakses route peran.
2. Hanya asisten yang dapat membuka dan menutup sesi. Praktikan tidak memiliki aksi tersebut di UI.
3. Sesi `ditutup` tidak dapat dibuka kembali pada Sprint 1.
4. Presensi hanya diterima saat status `dibuka`.
5. Status tidak berubah otomatis berdasarkan waktu. Status hanya berubah melalui aksi asisten.
6. Setiap aksi yang tidak valid ditolak di lapisan data dan mengembalikan pesan yang ditampilkan ke pengguna.
7. Status pada kartu daftar dan halaman detail berasal dari sumber data yang sama sehingga tidak mungkin berbeda.
8. Logout tidak menghapus sesi atau presensi.
9. Ganti peran demo adalah jalan pintas demo, bukan autentikasi produksi. Aksi ini wajib diberi label "demo".
10. Pengguna yang sudah login tidak dapat membuka landing page atau halaman login.
11. Pengguna tidak dapat membuka route peran lain. Guard mengarahkan ke beranda yang sesuai.

## 8. Data model dan aturan integritas

```ts
type Peran = 'praktikan' | 'asisten';
type StatusSesi = 'belum-dibuka' | 'dibuka' | 'ditutup';

type User = {
  id: string;
  nama: string;
  nomorInduk: string; // NIM untuk praktikan, NIP untuk asisten
  peran: Peran;
};

type Sesi = {
  id: string;
  namaPraktikum: string;
  kelas: string;
  lab: string;
  hari: string;       // "Senin"
  tanggal: string;    // "2026-10-26"
  jamMulai: string;   // "13:00"
  jamSelesai: string; // "15:30"
  asistenId: string;
  pesertaIds: string[];
  status: StatusSesi;
  dibukaPada?: string;  // ISO 8601
  ditutupPada?: string; // ISO 8601
};

type Presensi = {
  sesiId: string;
  praktikanId: string;
  waktu: string; // ISO 8601
};

type Kredensial = {
  userId: string;
  username: string;
  password: string;
};
```

**Aturan integritas**

1. Kunci unik presensi adalah pasangan `sesiId + praktikanId`. Tidak ada field `id` terpisah.
2. Presensi hanya sah jika `sesiId` ada, `praktikanId` terdaftar pada `Sesi.pesertaIds`, status sesi `dibuka`, dan belum ada catatan untuk pasangan tersebut.
3. Waktu kehadiran diambil dari jam perangkat saat presensi berhasil, disimpan sebagai ISO 8601, dan ditampilkan `HH:mm`.
4. Tanggal ditampilkan sebagai `Senin, 26 Okt 2026`. Jam ditampilkan sebagai `HH:mm`.
5. Data dummy: 2 asisten (asisten A mengampu 5 sesi, asisten B tidak mengampu sesi), 4 praktikan (`mhs-1`, `mhs-2`, `mhs-3` terdaftar pada tiap sesi, `mhs-4` tidak terdaftar pada sesi mana pun), 5 sesi (2 `belum-dibuka`, 2 `dibuka`, 1 `ditutup`) dengan 3 peserta per sesi, dan 2 presensi awal. Presensi awal hanya berada pada sesi `dibuka` atau `ditutup`, bukan `belum-dibuka`.
6. Sesi tanpa presensi disediakan untuk menguji rekap kosong. Asisten B dan praktikan keempat dipakai untuk menguji jadwal dan riwayat kosong.
7. Akun dummy:

| Username | Password | Peran | User |
|---|---|---|---|
| `ahmad` | `praktikan123` | Praktikan | `mhs-1` |
| `citra` | `praktikan123` | Praktikan | `mhs-2` |
| `eko` | `praktikan123` | Praktikan | `mhs-3` |
| `fani` | `praktikan123` | Praktikan | `mhs-4` |
| `budi` | `asisten123` | Asisten | `asisten-1` |
| `siti` | `asisten123` | Asisten | `asisten-2` |

8. Login mencocokkan username dan password secara persis. Username tidak peka huruf besar/kecil, password peka huruf besar/kecil.
9. Identitas aktif disimpan sebagai `user: User | null` di store. Nilai awal `null`.
10. `login` mengisi `user` jika kredensial valid. `logout` mengosongkan `user` tanpa mengubah `sesi` atau `presensi`.
11. `setUser` hanya dipakai untuk ganti peran demo, bukan jalur login normal. Ganti peran demo memetakan asisten ke `mhs-1` dan praktikan ke `asisten-1`.
12. Identitas aktif menentukan data yang tampil: praktikan melihat sesi tempat ia ada di `pesertaIds`; asisten melihat sesi dengan `asistenId` miliknya.
13. Rekap hanya membaca presensi milik sesi terkait. Riwayat hanya membaca presensi milik praktikan aktif.
14. Tidak ada persistensi. Reload mengembalikan data ke kondisi dummy dan mengosongkan sesi login.

## 9. Navigasi dan interaksi

**Peta layar**

| Layar | Akses | Isi utama |
|---|---|---|
| Landing | publik, setelah logout | penjelasan aplikasi, dua peran, fitur, tombol Masuk |
| Login | publik | form username + password, error, tombol Masuk, tautan kembali ke landing |
| Jadwal (praktikan) | tab, setelah login praktikan | daftar kartu sesi + badge status |
| Detail sesi (praktikan) | dari daftar | info sesi, status, tombol Presensi + alasan |
| Kehadiran | tab | riwayat presensi praktikan aktif |
| Jadwal (asisten) | tab, setelah login asisten | daftar sesi yang diampu |
| Detail sesi (asisten) | dari daftar | info sesi, waktu buka/tutup, tombol Buka/Tutup sesi, jumlah hadir, daftar peserta |
| Rekap | tab | ringkasan tiap sesi yang diampu + jumlah hadir |

**Struktur route**

```text
/                          Landing (publik)
/login                     Login (publik)
/(praktikan)/jadwal        Beranda praktikan
/(praktikan)/jadwal/[id]   Detail sesi praktikan
/(praktikan)/kehadiran     Riwayat praktikan
/(asisten)/jadwal          Beranda asisten
/(asisten)/jadwal/[id]     Detail sesi asisten
/(asisten)/rekap           Rekap asisten
```

**Auth guard**

- Root stack memakai `Stack.Protected` dari Expo Router SDK 58.
- Route publik hanya tersedia saat `user === null`.
- Route `(praktikan)` hanya tersedia saat `user.peran === 'praktikan'`.
- Route `(asisten)` hanya tersedia saat `user.peran === 'asisten'`.
- Pengguna yang sudah login dan membuka `/` atau `/login` diarahkan ke beranda sesuai peran.
- Pengguna yang membuka route peran lain diarahkan ke beranda yang sesuai.
- Logout menghapus histori route peran dan kembali ke landing.

**Profil dan beranda**

- Profil tampil sebagai tombol avatar inisial di `headerRight` pada semua layar peran.
- Dropdown berisi nama, NIM/NIP, peran, Beranda, Ganti peran demo, dan Keluar akun.
- Logout memakai `BottomSheet` konfirmasi.
- Tombol Beranda tampil di `headerLeft` pada halaman detail dan halaman non-home.
- Tidak ada tab Profil terpisah pada Sprint 1.

**Interaksi**

| Aksi | Mekanisme | Feedback |
|---|---|---|
| Masuk | tombol form | redirect ke beranda peran; error banner bila gagal |
| Buka sesi | bottom sheet konfirmasi | status + waktu buka berubah; banner sukses |
| Tutup sesi | bottom sheet konfirmasi | status + waktu tutup berubah; banner sukses |
| Presensi | bottom sheet konfirmasi (nama sesi + identitas) | banner sukses + jam kehadiran; tombol menjadi Sudah presensi |
| Presensi ditolak | aksi dari store | banner gagal berisi pesan dari store |
| Ganti peran demo | konfirmasi bottom sheet | identitas aktif berganti; halaman diarahkan ke beranda peran baru |
| Keluar akun | konfirmasi bottom sheet | kembali ke landing; sesi dan presensi tetap |
| Beranda | tombol header atau item dropdown | kembali ke daftar jadwal sesuai peran |

**Aturan interaksi**

- Konfirmasi bottom sheet wajib untuk membuka sesi, menutup sesi, presensi, ganti peran demo, dan logout.
- Feedback memakai banner atau teks error inline, bukan alert sistem.
- Tombol nonaktif selalu menampilkan alasan sebagai teks pendukung.
- Operasi sepenuhnya sinkron. Tidak ada state loading palsu, spinner, atau skeleton.
- Tidak ada state lokal duplikat untuk sesi, presensi, atau autentikasi. Semua mutasi lewat store.
- Halaman login tidak menampilkan kartu pengisi field otomatis. Pengguna mengetik username dan password secara manual.
- Semua tombol di landing page harus memiliki tujuan yang benar-benar ada.

## 10. Empty states, error, dan feedback

| Kondisi | Tampilan | Teks |
|---|---|---|
| Daftar jadwal kosong | EmptyState dengan ikon + judul + deskripsi | "Belum ada jadwal" / "Sesi praktikum akan muncul di sini." |
| Rekap per sesi kosong | EmptyState | "Belum ada yang presensi" / "Peserta yang sudah presensi akan muncul di sini." |
| Tab Rekap belum ada data | EmptyState | "Belum ada data rekap" |
| Riwayat kehadiran kosong | EmptyState | "Belum ada catatan kehadiran" / "Presensi yang kamu lakukan akan tercatat di sini." |
| Sesi belum dibuka | tombol nonaktif + teks alasan | "Sesi belum dibuka" |
| Sesi sudah ditutup | tombol nonaktif + teks alasan | "Sesi sudah ditutup" |
| Presensi berhasil | banner sukses | "Presensi tercatat pukul 13:04" |
| Presensi ganda ditolak | banner gagal | "Presensi sudah tercatat pada sesi ini" |
| Praktikan tidak terdaftar | banner gagal | "Kamu tidak terdaftar pada sesi ini" |
| Login kosong | tombol nonaktif + alasan | "Isi username dan kata sandi" |
| Login gagal | banner gagal | "Username atau kata sandi salah" |
| Logout | bottom sheet konfirmasi | "Keluar dari akun?" / "Batal" / "Keluar" |
| Buka/tutup sesi butuh konfirmasi | bottom sheet | judul + deskripsi singkat + tombol Batal / Lanjutkan |

## 11. Acceptance criteria

Semua AC diverifikasi manual di satu perangkat. Tidak ada AC yang bergantung pada backend.

**AC-01: Landing page**

1. Buka aplikasi saat belum login.
2. Landing page tampil dengan penjelasan aplikasi, dua peran, fitur utama, dan tombol Masuk.
3. Tombol Masuk membuka halaman login.
4. Tidak ada tautan atau tombol yang mengarah ke halaman yang tidak ada.

**AC-02: Login dan redirect peran**

1. Di halaman login, tombol Masuk nonaktif sebelum username dan password diisi.
2. Isi kredensial salah. Hasil: pesan "Username atau kata sandi salah", tetap di halaman login.
3. Isi `budi` / `asisten123`. Hasil: masuk ke tab asisten, header menampilkan nama Budi.
4. Logout, lalu isi `ahmad` / `praktikan123`. Hasil: masuk ke tab praktikan, header menampilkan nama Ahmad.
5. Pengguna yang sudah login tidak bisa kembali ke landing atau login.

**AC-03: Jadwal dan detail sesi**

1. Sebagai praktikan, buka tab Jadwal.
2. Tiap kartu menampilkan nama praktikum, kelas, lab, hari dan tanggal, jam, dan badge status.
3. Tekan satu kartu.
4. Detail menampilkan seluruh field yang sama, nama asisten, dan badge status identik dengan kartu.

**AC-04: Buka sesi**

1. Sebagai asisten, buka detail sesi berstatus Belum dibuka, tekan Buka sesi.
2. Bottom sheet konfirmasi muncul. Tekan Batal, status tetap Belum dibuka.
3. Tekan Buka sesi lagi, lalu Lanjutkan.
4. Badge menjadi Dibuka, waktu buka tampil, banner sukses muncul.
5. Kembali ke daftar. Badge sesi tersebut juga Dibuka.

**AC-05: Presensi berhasil dan pencatatan waktu**

1. Sebagai praktikan pada sesi berstatus Dibuka, tekan Presensi.
2. Bottom sheet konfirmasi menampilkan nama sesi dan nama praktikan.
3. Tekan Konfirmasi.
4. Banner sukses berisi jam kehadiran. Jam kehadiran tampil di detail. Tombol berubah menjadi Sudah presensi dan nonaktif.

**AC-06: Penolakan presensi ganda**

1. Pada sesi yang sudah dipresensi praktikan tersebut, coba picu presensi lagi.
2. Aksi ditolak. Banner gagal "Presensi sudah tercatat pada sesi ini". Catatan waktu awal tidak berubah.
3. Jumlah presensi untuk sesi tersebut tetap.

**AC-07: Penolakan presensi saat sesi tidak aktif**

1. Buka detail sesi berstatus Belum dibuka. Tombol Presensi nonaktif dengan teks "Sesi belum dibuka".
2. Buka detail sesi berstatus Ditutup. Tombol nonaktif dengan teks "Sesi sudah ditutup".
3. Bila aksi tetap dipanggil, store menolak dan mengembalikan pesan.

**AC-08: Penolakan peserta tidak terdaftar**

1. Panggil presensi dengan `praktikanId` yang tidak ada di `pesertaIds` sesi tersebut.
2. Hasil: ditolak, tidak ada catatan presensi baru, pesan "Kamu tidak terdaftar pada sesi ini".

**AC-09: Tutup sesi dan rekap asisten**

1. Sebagai asisten, pada sesi Dibuka tekan Tutup sesi, lalu Lanjutkan.
2. Badge menjadi Ditutup, waktu tutup tampil.
3. Buka rekap sesi tersebut. Daftar nama peserta dan jam kehadiran tampil, urut naik berdasarkan waktu, dengan ringkasan "N hadir dari M peserta".

**AC-10: Riwayat praktikan**

1. Sebagai praktikan, buka tab Kehadiran.
2. Hanya sesi tempat ia presensi yang tampil, lengkap dengan jam kehadiran.

**AC-11: Empty state**

1. Masuk sebagai asisten B (tidak mengampu sesi). Tab Jadwal menampilkan "Belum ada jadwal" dan tab Rekap menampilkan "Belum ada data rekap".
2. Masuk sebagai praktikan keempat (tidak terdaftar pada sesi). Tab Jadwal menampilkan "Belum ada jadwal".
3. Masuk sebagai praktikan terdaftar yang belum pernah presensi. Tab Kehadiran menampilkan "Belum ada catatan kehadiran".
4. Sebagai asisten A, buka rekap sesi tanpa presensi. Tampil "Belum ada yang presensi".
5. Semua empty state tampil tanpa error dan tanpa elemen kosong yang menggantung.

**AC-12: Konsistensi lintas peran**

1. Sebagai asisten A, buka satu sesi.
2. Buka profil, pilih Ganti peran demo, lalu berpindah ke praktikan yang terdaftar pada sesi tersebut.
3. Sesi tampil Dibuka tanpa reload aplikasi.
4. Praktikan presensi, lalu ganti peran kembali ke asisten A.
5. Rekap sesi tersebut memuat praktikan tadi beserta jam kehadiran.

**AC-13: Profil dan logout**

1. Buka menu profil di header. Dropdown menampilkan nama, NIM/NIP, dan peran aktif.
2. Pilih Beranda. Pengguna kembali ke daftar jadwal sesuai peran.
3. Pilih Keluar akun. Bottom sheet konfirmasi muncul.
4. Tekan Batal. Pengguna tetap login dan data tidak berubah.
5. Pilih Keluar akun lagi, lalu Keluar. Landing page tampil.
6. Login ulang sebagai akun yang sama. Sesi dan presensi yang dibuat sebelumnya masih ada selama aplikasi belum ditutup.

**AC-14: Beranda dan auth guard**

1. Dari detail sesi, tekan tombol Beranda. Pengguna kembali ke daftar jadwal.
2. Saat login sebagai praktikan, buka URL `/(asisten)/jadwal`. Pengguna diarahkan ke beranda praktikan.
3. Saat login sebagai asisten, buka URL `/(praktikan)/jadwal`. Pengguna diarahkan ke beranda asisten.
4. Saat sudah login, buka `/` atau `/login`. Pengguna diarahkan ke beranda sesuai peran.

**AC-15: Demo end-to-end tanpa reload**

Jalankan berurutan pada satu instance aplikasi, tanpa reload:

1. Landing page tampil, tekan Masuk.
2. Login sebagai `budi` / `asisten123`.
3. Asisten membuka sesi. Badge Dibuka, waktu buka tampil.
4. Buka profil, pilih Ganti peran demo ke praktikan (Ahmad).
5. Praktikan presensi pada sesi tersebut. Banner sukses dan jam kehadiran tercatat.
6. Coba presensi lagi. Ditolak dengan pesan yang jelas.
7. Ganti peran kembali ke asisten (Budi). Rekap menampilkan praktikan tersebut beserta jam kehadiran.
8. Asisten menutup sesi. Badge Ditutup, waktu tutup tampil.
9. Ganti peran ke praktikan (Ahmad). Buka sesi yang sudah ditutup. Presensi ditolak, tombol nonaktif dengan alasan "Sesi sudah ditutup".
10. Buka profil, keluar akun. Landing page tampil.
11. Login ulang sebagai `ahmad` / `praktikan123`. Riwayat kehadiran tetap tersedia dan presensi pada sesi yang sudah ditutup tetap ditolak.

Seluruh langkah berhasil tanpa reload dan tanpa error konsol.

## 12. Testing dan demo script

**Automated check (minimal)**

Satu skrip assert pada modul logika sesi, presensi, dan login (bebas React Native):

1. Login dengan username dan password benar diterima.
2. Login dengan username atau password salah ditolak.
3. Presensi saat `belum-dibuka` ditolak.
4. Presensi saat `dibuka` oleh peserta terdaftar diterima, `waktu` terisi.
5. Presensi kedua pada sesi sama oleh praktikan sama ditolak, catatan awal tidak tertimpa.
6. Presensi setelah `ditutup` ditolak.
7. Presensi oleh praktikan tidak terdaftar ditolak.
8. Logout mengosongkan `user` tanpa mengubah `sesi` dan `presensi`.

Ditambah pemeriksaan statis: `npx tsc --noEmit` dan `npx expo lint` hijau. Tidak ada test framework yang diwajibkan pada sprint ini.

**QA manual (PM)**

AC-01 sampai AC-15 dijalankan di satu perangkat. Status lulus/gagal dicatat.

**Demo script (dijalankan 2 kali)**

1. Landing page tampil. Tekan Masuk.
2. Login sebagai `budi` / `asisten123`.
3. Asisten membuka sesi. Badge Dibuka, waktu buka tampil.
4. Buka profil, pilih Ganti peran demo ke praktikan (Ahmad).
5. Tombol Presensi aktif. Konfirmasi. Sukses, jam kehadiran tercatat.
6. Coba presensi lagi. Ditolak dengan feedback jelas.
7. Ganti peran kembali ke asisten (Budi). Rekap sesi menampilkan praktikan tersebut dan jam kehadiran.
8. Asisten menutup sesi. Badge Ditutup, waktu tutup tampil.
9. Ganti peran ke praktikan (Ahmad). Presensi pada sesi yang sudah ditutup ditolak dengan feedback jelas.
10. Buka profil, keluar akun. Landing page tampil.
11. Login ulang. Data sesi dan presensi masih ada selama aplikasi belum ditutup.

Seluruh langkah berjalan tanpa reload (AC-15). Penolakan presensi ganda diuji pada AC-06.

## 13. Implementation decisions dan asumsi

**Implementation decisions**

1. Satu aplikasi, dua peran. Landing page dan login adalah pintu masuk publik.
2. Model domain hanya `User`, `Sesi`, `Presensi`, dan `Kredensial` (lihat bagian 8), tanpa field tambahan.
3. State machine sesi dikelola di satu modul logika murni. Store context membungkusnya.
4. Mutasi sesi dan presensi mengembalikan `{ ok, pesan }`; login mengembalikan `{ ok: true, user }` atau `{ ok: false, pesan }`. Feedback UI seragam dan validasi tidak bergantung pada disabled tombol. `logout` dan `setUser` tidak memakai jalur hasil aksi.
5. Satu store context sebagai sumber kebenaran lintas peran dan lintas status login. Layar menerima props dari route tipis.
6. Navigasi memakai Expo Router: root stack dengan `Stack.Protected`, tab per peran, dan stack detail.
7. Landing page memakai arah visual Apple dari `docs/design.md`, diadaptasi untuk React Native: SF Pro di iOS, system sans di Android, Action Blue `#0066cc`, parchment `#f5f5f7`, pill CTA, dan tanpa shadow dekoratif.
8. Profil adalah dropdown di header, bukan tab baru. Logout memakai bottom sheet konfirmasi.
9. Halaman login tidak memakai kartu pengisi field otomatis. Akun demo dicatat di README dan dapat ditampilkan sebagai teks bantuan statis.
10. Ganti peran demo memakai `setUser` ke akun dummy peran lain. Aksi ini diberi label "demo" dan bukan jalur autentikasi produksi.
11. Flexbox dan safe area. Target sentuh minimal 44x44 pt. Status sesi selalu memakai label teks, bukan warna saja.
12. `(asisten)` wajib tersedia sebelum login asisten diuji. Tanpa route tersebut, login asisten tidak boleh diarahkan ke halaman kosong.

**Asumsi (perlu persetujuan tim)**

1. Nama produk **PraktikumKU**.
2. Daftar jadwal praktikan difilter ke sesi yang memuat dirinya di `pesertaIds`. Kondisi "tidak terdaftar" tetap ditolak store.
3. Tab Rekap asisten menampilkan ringkasan per sesi. Daftar nama dan waktu ada di rekap detail sesi.
4. Sesi tidak menutup otomatis saat jam selesai.
5. Sesi `ditutup` tidak dapat dibuka ulang di Sprint 1.
6. Waktu presensi memakai jam perangkat tanpa penanda terlambat atau tepat waktu.
7. Satu store bersama dipakai lintas peran. Perubahan sesi dan presensi wajib konsisten saat berpindah peran dalam satu instance aplikasi (AC-12, AC-15).
8. Logout tidak menghapus data sesi dan presensi. Reload aplikasi mengembalikan semuanya ke kondisi dummy.
9. Login memakai username, bukan email atau NIM/NIP. Password disimpan sebagai data dummy di `src/data/credentials.ts`.
10. P2 bertanggung jawab menyediakan route asisten sebelum login asisten dianggap selesai.

## 14. Risiko dan backlog Sprint 2

| Risiko | Mitigasi |
|---|---|
| Tiga programmer mengubah file yang sama | CODEOWNERS + path beku + kontrak data di-freeze D1 |
| Store belum siap saat layar dikerjakan | Layar presentational menerima props. Route file tipis |
| Demo gagal karena state terduplikasi | Satu store context. Dilarang state lokal sesi, presensi, atau auth |
| Validasi hanya di level tombol | Semua mutasi lewat fungsi store yang memvalidasi |
| Login asisten mengarah ke route kosong | P2 wajib menyediakan `(asisten)` sebelum AC-02 dan AC-15 diuji |
| Auth guard menyebabkan redirect loop | Gunakan `Stack.Protected` dengan anchor route yang jelas. Uji AC-14 |
| Token Apple belum diterjemahkan ke `tokens.js` | P3 mengganti warna, radius, dan tipografi di `tokens.js` serta channel warna di `global.css` sebelum styling dimulai |
| Scope melebar ke backend | Non-goals eksplisit. Perubahan scope lewat PM |

**Backlog setelah Sprint 2:** verifikasi pendaftaran asisten, perubahan peran akun, lupa password, rekap per semester + export CSV, notifikasi pengingat jadwal, membuka ulang sesi, dan penutupan otomatis berdasarkan jadwal. Backend, database, autentikasi, dan registrasi sudah menjadi scope Sprint 2, lihat `docs/sprints/sprint-2.md`. Presensi berbasis QR dan lokasi, Maps, serta push notification (pembukaan sesi, perubahan jadwal, keputusan izin) sudah menjadi scope Sprint 3, lihat `docs/sprints/sprint-3.md`.
Sprint 3 juga mencakup penyempurnaan UI/UX pada seluruh halaman aplikasi untuk meningkatkan konsistensi tampilan dan pengalaman pengguna. Perubahan antarmuka tetap perlu dikoordinasikan dengan pemilik fitur terkait agar tidak mengganggu implementasi fungsionalitas masing-masing halaman.

## 15. Cakupan Sprint 4

Sprint 4 menambahkan role Aslab dan memisahkan kewenangan administratif dari operasional Asprak. Requirement resmi diambil dari `docs/references/PEMBAGIAN JOBDESC SPRINT 4 — PRAKTIKUMKU.pdf`. Rincian 87 task induk, PIC, prioritas, dependency, output, dan acceptance criteria per task ada di [`docs/sprints/sprint-4.md`](sprints/sprint-4.md) bagian 10.

**In scope Sprint 4:**

1. Role Aslab, hak akses, Security Rules, dan pemisahan kewenangan dengan Asprak.
2. CRUD laboratorium, bulk/single insert laboratorium berdasarkan mata kuliah, bulk/single insert praktikan dan Asprak, template unduhan, halaman review, dan perpindahan anggota antarlaboratorium.
3. Informasi laboratorium: nama, lokasi, koordinat, radius, cakupan lokasi presensi, dan batas keterlambatan.
4. Dashboard Aslab: jumlah laboratorium dan praktikan, status kegiatan, jadwal, riwayat kegiatan, riwayat keuangan, dan filter hari/minggu/bulan.
5. Operasional Asprak: daftar kelas/jadwal/sesi, buka/tutup sesi, sinkronisasi real-time, dan pemantauan presensi.
6. Izin: kategori izin/alpha/sakit, alur dari sesi terpilih, pemeriksaan oleh Asprak, hasil AI, keputusan, dan sinkronisasi real-time.
7. Integrasi izin disetujui dengan `excused absence` dan pembebasan denda tanpa mengubah status menjadi hadir.
8. Perhitungan keterlambatan, tagihan otomatis idempotent, relasi tagihan, dan riwayat keuangan.
9. Midtrans Sandbox melalui backend, callback/webhook, verifikasi, status transaksi, dan pembaruan status tagihan.
10. Halaman tagihan, rincian nominal, riwayat transaksi/pembayaran, dan persistensi riwayat.
11. Notifikasi tagihan baru, pembayaran berhasil, pembayaran gagal, deep link, dan kondisi foreground/background/terminated.
12. Navbar Praktikan dan Asprak lima halaman, pemindahan Map Praktikan, serta penyempurnaan UI.
13. Seed idempotent, NIM String 14 digit, backup sebelum reset development, dan larangan reset production.
14. Pembaruan dokumen sprint, PRD, desain, database, dan alur aplikasi.

**Out of scope Sprint 4:**

1. Reset data pada environment production.
2. Penyimpanan Secret Key Midtrans atau credential rahasia di aplikasi React Native.
3. Pembayaran uang nyata di luar Midtrans Sandbox.
4. Keputusan izin otomatis oleh AI.
5. Backend Midtrans dan detail API AI yang belum dikonfirmasi pengajar; statusnya TBD.
6. Perubahan requirement Sprint 1–3 yang tidak tercantum pada PDF Sprint 4.

## 16. Perubahan role dan role matrix

### 16.1 Perubahan role

| Perubahan | Keterangan |
|---|---|
| Role baru `aslab` | Aslab bertanggung jawab atas pengelolaan laboratorium dan distribusi anggota. |
| `asisten` menjadi `asprak` | Istilah asisten pada Sprint 1–3 dipetakan ke Asprak. Konsistensi tipe, koleksi, UI, dan Security Rules wajib dijaga. |
| Kewenangan administratif pindah ke Aslab | CRUD kelas, edit/hapus kelas, pengelolaan peserta, distribusi anggota, dan pengelolaan laboratorium bukan kewenangan Asprak. Ketentuan ini menggantikan pembagian kelas pada Sprint 2 untuk pekerjaan Sprint 4. |
| Asprak tetap operasional | Asprak hanya bertanggung jawab atas operasional sesi, presensi, dan pemeriksaan izin. |
| Praktikan tetap | Praktikan mengajukan izin, melakukan presensi, melihat dan membayar denda. |

### 16.2 Role matrix

| Kemampuan | Praktikan | Asprak | Aslab |
|---|---|---|---|
| Melihat jadwal dan sesi terkait | Ya | Ya | Ya, laboratorium yang dikelola |
| Presensi QR/lokasi | Ya | Tidak | Tidak |
| Mengajukan izin | Ya | Tidak | Tidak |
| Memeriksa dan memutuskan izin | Tidak | Ya | Tidak |
| Melihat hasil analisis AI izin | Tidak | Ya, sebagai informasi pendukung | TBD |
| Membuka dan menutup sesi | Tidak | Ya | Tidak |
| Memantau dan mengelola presensi | Tidak | Ya | Tidak |
| Melihat dan membayar tagihan denda | Ya, milik sendiri | Tidak | Tidak |
| Melihat riwayat keuangan hasil denda | Tidak | Tidak | Ya |
| CRUD laboratorium | Tidak | Tidak | Ya |
| CRUD kelas, edit/hapus kelas | Tidak | Tidak | Ya |
| Bulk/single insert laboratorium, praktikan, Asprak | Tidak | Tidak | Ya |
| Distribusi dan perpindahan anggota | Tidak | Tidak | Ya |
| Dashboard seluruh laboratorium | Tidak | Tidak | Ya |
| Mengatur koordinat, radius, cakupan lokasi, batas keterlambatan | Tidak | Tidak | Ya |
| Mengatur konfigurasi jam minimal/maksimal sesi | TBD | TBD | TBD |
| Mengubah status kehadiran menjadi hadir | Tidak | Tidak | Tidak |
| Mengubah status kehadiran karena pembayaran | Tidak | Tidak | Tidak |

Sel "Tidak" berarti aksi tidak tersedia di UI dan wajib ditolak Firestore Security Rules. Sel "TBD" tidak boleh diimplementasikan sebelum disepakati PM.

## 17. User stories Sprint 4

| ID | User story | Role |
|---|---|---|
| US-S4-01 | Sebagai Aslab, saya ingin memiliki role, hak akses, dan tampilan khusus, supaya saya dapat mengelola laboratorium tanpa bercampur dengan kewenangan Asprak | Aslab |
| US-S4-02 | Sebagai Aslab, saya ingin membuat, membaca, mengubah, dan menghapus laboratorium, supaya data laboratorium selalu akurat | Aslab |
| US-S4-03 | Sebagai Aslab, saya ingin melakukan bulk/single insert laboratorium berdasarkan mata kuliah, supaya laboratorium dapat disiapkan lebih cepat | Aslab |
| US-S4-04 | Sebagai Aslab, saya ingin melakukan bulk/single insert praktikan dan Asprak ke laboratorium tertentu, supaya anggota laboratorium dapat didistribusikan | Aslab |
| US-S4-05 | Sebagai Aslab, saya ingin mengunduh template bulk insert, supaya format unggahan sesuai kontrak data | Aslab |
| US-S4-06 | Sebagai Aslab, saya ingin meninjau hasil bulk insert dan menerima, menolak, mengubah, atau melengkapi data, supaya hanya data valid yang tersimpan | Aslab |
| US-S4-07 | Sebagai Aslab, saya ingin memindahkan praktikan dan Asprak antarlaboratorium, supaya distribusi anggota dapat diperbarui | Aslab |
| US-S4-08 | Sebagai Aslab, saya ingin mengelola nama, lokasi, koordinat, radius, cakupan lokasi, dan batas keterlambatan, supaya presensi sesuai ketentuan | Aslab |
| US-S4-09 | Sebagai Aslab, saya ingin melihat dashboard seluruh laboratorium yang saya kelola, supaya saya dapat memantau kegiatan | Aslab |
| US-S4-10 | Sebagai Aslab, saya ingin melihat riwayat keuangan hasil denda, supaya kondisi keuangan laboratorium terpantau | Aslab |
| US-S4-11 | Sebagai Aslab, saya ingin memfilter dashboard berdasarkan hari, minggu, dan bulan, supaya data dapat dilihat sesuai periode | Aslab |
| US-S4-12 | Sebagai Asprak, saya ingin melihat kelas, jadwal, dan sesi yang menjadi tanggung jawab saya, supaya saya fokus pada sesi yang tepat | Asprak |
| US-S4-13 | Sebagai Asprak, saya ingin membuka dan menutup sesi, supaya presensi hanya berlangsung selama kegiatan | Asprak |
| US-S4-14 | Sebagai Asprak, saya ingin perubahan status sesi tersinkronisasi real-time, supaya Praktikan melihat status terbaru | Asprak |
| US-S4-15 | Sebagai Asprak, saya ingin memantau dan mengelola presensi, supaya kehadiran tercatat benar | Asprak |
| US-S4-16 | Sebagai Asprak, saya ingin memeriksa alasan izin beserta hasil analisis AI, supaya keputusan memiliki informasi pendukung | Asprak |
| US-S4-17 | Sebagai Asprak, saya ingin menerima atau menolak izin dan melihat statusnya tersinkronisasi, supaya Praktikan segera mengetahui keputusan | Asprak |
| US-S4-18 | Sebagai Praktikan, saya ingin izin yang disetujui menjadi `excused absence` dan bebas denda tanpa dianggap hadir, supaya status kehadiran sesuai kondisi | Praktikan |
| US-S4-19 | Sebagai Praktikan, saya ingin sistem menghitung keterlambatan dan membuat satu tagihan per kejadian, supaya denda adil dan tidak ganda | Praktikan |
| US-S4-20 | Sebagai Praktikan, saya ingin melihat tagihan dan membayar melalui Midtrans Sandbox, supaya denda dapat diselesaikan | Praktikan |
| US-S4-21 | Sebagai Praktikan, saya ingin riwayat transaksi dan pembayaran tetap tersedia setelah aplikasi dibuka ulang, supaya saya punya bukti pembayaran | Praktikan |
| US-S4-22 | Sebagai pengguna, saya ingin menerima dan membuka notifikasi tagihan/pembayaran yang relevan, supaya saya mengetahui tindakan yang diperlukan | Semua role terkait |
| US-S4-23 | Sebagai pengguna, saya ingin navbar lima halaman dan Map pada praktikum terkait, supaya navigasi sesuai kebutuhan role | Praktikan, Asprak |
| US-S4-24 | Sebagai PM, saya ingin seed idempotent, NIM 14 digit, backup sebelum reset development, dan Security Rules yang diuji, supaya data dan akses aman | PM |
| US-S4-25 | Sebagai pengguna, saya ingin tampilan modul Sprint 4 konsisten dan mudah digunakan, supaya pekerjaan tidak terganggu oleh UI yang tidak konsisten | Semua role |

## 18. Functional requirements Sprint 4

| ID | Requirement | Prioritas | User story |
|---|---|---|---|
| FR-S4-01 | Sistem menyediakan role Aslab beserta hak akses, tampilan, dan route khusus Aslab | P0 | US-S4-01 |
| FR-S4-02 | Aslab dapat melakukan CRUD data laboratorium | P0 | US-S4-02 |
| FR-S4-03 | Aslab dapat melakukan bulk/single insert laboratorium berdasarkan mata kuliah | P0 | US-S4-03 |
| FR-S4-04 | Aslab dapat melakukan bulk/single insert data praktikan ke laboratorium tertentu | P0 | US-S4-04 |
| FR-S4-05 | Aslab dapat melakukan bulk/single insert data Asprak ke laboratorium tertentu | P0 | US-S4-04 |
| FR-S4-06 | Sistem menyediakan downloadable file template untuk setiap fitur bulk insert | P0 | US-S4-05 |
| FR-S4-07 | Aslab dapat meninjau hasil bulk insert dan melakukan accept, deny, update, serta melengkapi data kosong | P0 | US-S4-06 |
| FR-S4-08 | Aslab dapat memindahkan praktikan dan Asprak antarlaboratorium | P0 | US-S4-07 |
| FR-S4-09 | Aslab dapat mengelola informasi laboratorium: nama, lokasi, koordinat, dan radius validasi presensi | P0 | US-S4-08 |
| FR-S4-10 | Aslab dapat mengonfigurasi cakupan lokasi presensi dan batas keterlambatan waktu | P0 | US-S4-08 |
| FR-S4-11 | Aslab memiliki dashboard untuk memantau seluruh laboratorium yang dikelola | P0 | US-S4-09 |
| FR-S4-12 | Dashboard menampilkan jumlah laboratorium dan praktikan | P0 | US-S4-09 |
| FR-S4-13 | Dashboard menampilkan status kegiatan praktikum per laboratorium beserta lokasi dan waktu pelaksanaan | P0 | US-S4-09 |
| FR-S4-14 | Dashboard menampilkan jadwal praktikum yang sedang berlangsung dan yang akan datang | P0 | US-S4-09 |
| FR-S4-15 | Dashboard menampilkan riwayat kegiatan laboratorium | P0 | US-S4-09 |
| FR-S4-16 | Dashboard menampilkan riwayat keuangan hasil denda dari struktur Firestore bersama, tanpa sumber data keuangan terpisah | P0 | US-S4-10 |
| FR-S4-17 | Dashboard menyediakan filter berdasarkan hari, minggu, dan bulan | P0 | US-S4-11 |
| FR-S4-18 | Asprak dapat melihat daftar kelas, jadwal, dan sesi yang menjadi tanggung jawabnya | P0 | US-S4-12 |
| FR-S4-19 | Asprak dapat membuka sesi praktikum ketika kegiatan dimulai | P0 | US-S4-13 |
| FR-S4-20 | Asprak dapat menutup sesi praktikum setelah kegiatan selesai | P0 | US-S4-13 |
| FR-S4-21 | Perubahan status sesi tersinkronisasi real-time dengan aplikasi Praktikan | P0 | US-S4-14 |
| FR-S4-22 | Asprak dapat memantau dan mengelola presensi praktikan | P0 | US-S4-15 |
| FR-S4-23 | Asprak memiliki halaman pemeriksaan pengajuan izin | P0 | US-S4-16 |
| FR-S4-24 | Halaman pemeriksaan izin menampilkan alasan dan hasil analisis sentimen AI yang disimpan di Firestore | P0 | US-S4-16 |
| FR-S4-25 | Asprak dapat menerima dan menolak pengajuan izin | P0 | US-S4-17 |
| FR-S4-26 | Status pengajuan izin tersinkronisasi real-time dengan aplikasi Praktikan | P0 | US-S4-17 |
| FR-S4-27 | Izin disetujui diintegrasikan dengan `excused absence` dan pembebasan denda keterlambatan tanpa mengubah status menjadi hadir | P0 | US-S4-18 |
| FR-S4-28 | Sistem menghitung keterlambatan berdasarkan waktu presensi dan grace period | P0 | US-S4-19 |
| FR-S4-29 | Sistem membuat tagihan denda otomatis berdasarkan kejadian keterlambatan | P0 | US-S4-19 |
| FR-S4-30 | Satu kejadian keterlambatan hanya menghasilkan satu tagihan denda | P0 | US-S4-19 |
| FR-S4-31 | Tagihan terhubung dengan praktikan, sesi, catatan presensi, dan laboratorium | P0 | US-S4-19 |
| FR-S4-32 | Tagihan dan pembayaran tersimpan pada struktur Firestore bersama dan dapat dipakai Dashboard Aslab | P0 | US-S4-10, US-S4-19 |
| FR-S4-33 | Midtrans diintegrasikan pada Sandbox melalui backend | P0 | US-S4-20 |
| FR-S4-34 | Sistem membuat transaksi pembayaran melalui backend | P0 | US-S4-20 |
| FR-S4-35 | Sistem mengimplementasikan callback/webhook dan verifikasi transaksi melalui backend | P0 | US-S4-20 |
| FR-S4-36 | Sistem mengelola status transaksi pembayaran `pending`, `success`, dan `failed` | P0 | US-S4-20 |
| FR-S4-37 | Sistem memperbarui status tagihan berdasarkan verifikasi backend | P0 | US-S4-20 |
| FR-S4-38 | Praktikan dapat melihat daftar tagihan dan rincian nominal denda | P0 | US-S4-20 |
| FR-S4-39 | Praktikan dapat melihat riwayat transaksi dan pembayaran | P0 | US-S4-21 |
| FR-S4-40 | Riwayat pembayaran tetap tersedia setelah aplikasi ditutup dan dibuka kembali | P0 | US-S4-21 |
| FR-S4-41 | Sistem mengirim notifikasi tagihan denda baru | P0 | US-S4-22 |
| FR-S4-42 | Sistem mengirim notifikasi pembayaran berhasil | P0 | US-S4-22 |
| FR-S4-43 | Sistem mengirim notifikasi pembayaran gagal atau yang membutuhkan penyelesaian lanjutan | P0 | US-S4-22 |
| FR-S4-44 | Tombol notifikasi dapat diklik | P1 | US-S4-22 |
| FR-S4-45 | Notifikasi mengarahkan pengguna ke halaman relevan sesuai jenisnya | P1 | US-S4-22 |
| FR-S4-46 | Data transaksi dan status pembayaran tersinkronisasi dengan Firestore | P1 | US-S4-20 |
| FR-S4-47 | Integrasi notifikasi berjalan pada foreground, background, dan terminated | P1 | US-S4-22 |
| FR-S4-48 | Navbar Praktikan memiliki lima halaman: Jadwal, Riwayat, Presensi QR, Izin, Denda | P1 | US-S4-23 |
| FR-S4-49 | Navbar Asisten memiliki lima halaman: Jadwal, Kelas, Map, Rekap, Izin | P1 | US-S4-23 |
| FR-S4-50 | Alur pengajuan izin dari sesi tertentu langsung membuka form dengan sesi terpilih | P1 | US-S4-16 |
| FR-S4-51 | Aturan jam minimal dan maksimal sesi praktikum dapat dibuka sesuai konfigurasi | P1 | US-S4-13 |
| FR-S4-52 | Validasi waktu buka dan tutup sesi terintegrasi real-time dengan Firestore | P1 | US-S4-13 |
| FR-S4-53 | Kategori pengajuan izin terdiri dari izin, alpha, dan sakit | P1 | US-S4-16 |
| FR-S4-54 | Map Praktikan dipindahkan dari halaman utama ke halaman praktikum terkait | P1 | US-S4-23 |
| FR-S4-55 | Map Praktikan menampilkan lokasi laboratorium sesuai praktikum dan mendukung validasi lokasi presensi | P1 | US-S4-23 |
| FR-S4-56 | Tampilan notifikasi Android disempurnakan | P2 | US-S4-25 |
| FR-S4-57 | Logo PraktikumKU ditambahkan pada notifikasi | P2 | US-S4-25 |
| FR-S4-58 | Visual dan konsistensi UI modul Aslab, Asprak, Praktikan, denda, pembayaran, dan notifikasi disempurnakan | P2 | US-S4-25 |
| FR-S4-59 | Seed Aslab, Asprak, dan Praktikan idempotent serta konsisten antara Firebase Authentication dan profil Firestore | P0 | US-S4-24 |
| FR-S4-60 | NIM menggunakan String dengan validasi tepat 14 digit angka | P0 | US-S4-24 |
| FR-S4-61 | Backup Firestore dilakukan sebelum reset data dummy development; reset production dilarang | P0 | US-S4-24 |
| FR-S4-62 | Matriks hak akses ditegakkan di Firestore Security Rules dan diuji bersama | P0 | US-S4-24 |
| FR-S4-63 | Dokumentasi sprint, PRD, desain, struktur database, relasi, dan alur diperbarui | P0–P1 | US-S4-24 |
| FR-S4-64 | Reset password dikoordinasikan dengan developer Auth | P2 | US-S4-24 |

## 19. Business rules Sprint 4

| ID | Aturan bisnis |
|---|---|
| BR-S4-01 | Aslab bertanggung jawab atas pengelolaan laboratorium dan distribusi anggota. |
| BR-S4-02 | Asprak bertanggung jawab atas operasional sesi, presensi, dan pemeriksaan izin. |
| BR-S4-03 | CRUD kelas, edit/hapus kelas, pengelolaan peserta, distribusi anggota, dan pengelolaan laboratorium bukan kewenangan Asprak. |
| BR-S4-04 | Satu akun hanya memiliki satu role: `praktikan`, `asprak`, atau `aslab`. |
| BR-S4-05 | Hak akses wajib ditegakkan di Firestore Security Rules, bukan hanya melalui UI. |
| BR-S4-06 | NIM menggunakan tipe data String dengan validasi tepat 14 digit angka. |
| BR-S4-07 | Seed harus idempotent; seed ulang tidak boleh membuat akun atau dokumen ganda. |
| BR-S4-08 | Backup Firestore wajib dilakukan sebelum reset data dummy development. |
| BR-S4-09 | Reset data tidak boleh dilakukan pada environment production. |
| BR-S4-10 | Presensi hanya tercatat bila sesi dibuka dan seluruh validasi QR/lokasi/peserta/non-duplikat terpenuhi. |
| BR-S4-11 | Keterlambatan dihitung dari selisih waktu presensi terhadap batas waktu dan grace period. |
| BR-S4-12 | Satu kejadian keterlambatan hanya menghasilkan satu tagihan denda; proses ulang tidak boleh membuat tagihan kedua. |
| BR-S4-13 | Tagihan denda harus terhubung dengan praktikan, sesi, catatan presensi, dan laboratorium. |
| BR-S4-14 | Izin yang disetujui berstatus `excused absence` dan dibebaskan dari denda keterlambatan. |
| BR-S4-15 | Izin yang disetujui tidak mengubah status kehadiran menjadi hadir. |
| BR-S4-16 | Izin yang disetujui tidak boleh menghasilkan tagihan denda baru untuk sesi terkait. |
| BR-S4-17 | Pembayaran denda tidak mengubah status kehadiran Praktikan. |
| BR-S4-18 | Status tagihan mengikuti hasil verifikasi backend, bukan status dari client. |
| BR-S4-19 | Status transaksi pembayaran hanya `pending`, `success`, dan `failed`; status lain dipetakan sesuai kontrak backend. |
| BR-S4-20 | Midtrans hanya diintegrasikan pada Sandbox untuk Sprint 4. |
| BR-S4-21 | Secret Key Midtrans tidak boleh berada di aplikasi React Native; alur wajib client–backend–payment gateway. |
| BR-S4-22 | Hasil AI hanya informasi pendukung Asprak, bukan keputusan otomatis. |
| BR-S4-23 | Kegagalan AI tidak boleh menghambat pengajuan izin. |
| BR-S4-24 | `EXPO_PUBLIC_AI_API_KEY` di aplikasi dicatat sebagai security gap; credential rahasia harus melalui backend. |
| BR-S4-25 | Jam minimal dan maksimal sesi dapat dibuka mengikuti konfigurasi dan divalidasi terhadap Firestore. |
| BR-S4-26 | Kategori pengajuan izin hanya izin, alpha, dan sakit. |
| BR-S4-27 | Asprak tidak dapat memindahkan peserta, mengubah kelas, atau mengelola laboratorium. |
| BR-S4-28 | Aslab dapat memindahkan praktikan dan Asprak antarlaboratorium tanpa duplikasi keanggotaan. |
| BR-S4-29 | Bulk insert harus melalui review; data yang ditolak atau belum lengkap tidak masuk koleksi utama. |
| BR-S4-30 | Notifikasi tidak boleh dikirim berulang untuk kejadian yang sama; kegagalan notifikasi tidak membatalkan perubahan data utama. |

## 20. Alur utama Sprint 4

### 20.1 Aslab

Aslab login, membuka Dashboard Aslab, lalu mengelola laboratorium: CRUD laboratorium, bulk/single insert laboratorium berdasarkan mata kuliah, bulk/single insert praktikan dan Asprak, mengunduh template, meninjau hasil bulk insert, dan memindahkan anggota antarlaboratorium. Aslab mengatur nama, lokasi, koordinat, radius, cakupan lokasi, dan batas keterlambatan. Dashboard menampilkan jumlah laboratorium/praktikan, status kegiatan, jadwal berlangsung/berikutnya, riwayat kegiatan, riwayat keuangan, dan filter hari/minggu/bulan.

### 20.2 Asprak

Asprak login, melihat kelas/jadwal/sesi yang menjadi tanggung jawabnya, membuka sesi pada jam yang diizinkan, memantau presensi, memeriksa pengajuan izin beserta alasan dan hasil AI, lalu menerima atau menolak. Status sesi dan izin tersinkronisasi real-time dengan Praktikan. Asprak menutup sesi setelah kegiatan selesai.

### 20.3 Praktikan: presensi dan izin

Praktikan melakukan presensi melalui QR/lokasi Sprint 3. Waktu presensi dicatat. Sistem menghitung keterlambatan berdasarkan grace period. Praktikan dapat mengajukan izin dari sesi tertentu; form terbuka dengan sesi terpilih dan kategori izin/alpha/sakit. Alasan dikirim ke AI bila tersedia. Setelah Asprak menyetujui, status menjadi `excused absence`, bebas denda, dan bukan hadir.

### 20.4 Denda dan pembayaran

Kejadian keterlambatan menghasilkan tepat satu tagihan yang terhubung ke praktikan, sesi, presensi, dan laboratorium. Praktikan melihat tagihan dan rincian nominal, memulai pembayaran, lalu aplikasi meminta backend membuat transaksi Midtrans Sandbox. Backend menerima callback/webhook, memverifikasi, dan memperbarui status transaksi serta tagihan. Praktikan melihat status dan riwayat. Status kehadiran tidak berubah karena pembayaran.

### 20.5 AI

Pengajuan izin disimpan, lalu alasan dikirim ke API AI melalui backend bila memakai credential rahasia. Respons disimpan bersama pengajuan izin. Bila AI gagal atau timeout, pengajuan tetap tersimpan dengan status klasifikasi gagal. Asprak melihat hasil AI sebagai informasi pendukung dan tetap memutuskan secara manual.

### 20.6 Notifikasi

Tagihan baru, pembayaran berhasil, dan pembayaran gagal menghasilkan notifikasi kepada Praktikan terkait. Notifikasi dapat diklik dan membuka halaman denda, tagihan, atau riwayat pembayaran yang relevan. Notifikasi ditangani pada foreground, background, dan terminated sesuai dukungan platform. Event yang sama tidak menghasilkan notifikasi ganda.

## 21. Acceptance criteria Sprint 4

**AC-S4-01: Role Aslab dan auth guard**

1. Login sebagai Aslab berhasil dan diarahkan ke beranda Aslab.
2. Praktikan dan Asprak tidak dapat membuka route Aslab; akses ditolak dan diarahkan ke beranda sesuai role.
3. Aslab tidak dapat membuka route operasional Asprak yang bukan kewenangannya.
4. Menu yang tampil sesuai role matrix.

**AC-S4-02: Security Rules**

1. Praktikan tidak dapat mengubah status izin, presensi, tagihan, atau pembayaran.
2. Asprak tidak dapat melakukan CRUD kelas/laboratorium dan tidak dapat mengubah sesi Asprak lain.
3. Aslab tidak dapat mengubah data laboratorium di luar yang dikelolanya.
4. Seluruh pengujian akses tanpa hak ditolak di Firestore, bukan hanya di UI.
5. Hasil review dan pengujian Security Rules bersama Dehar tercatat.

**AC-S4-03: Laboratorium dan konfigurasi**

1. Aslab dapat membuat, membaca, mengubah, dan menghapus laboratorium.
2. Nama, lokasi, koordinat, radius, cakupan lokasi, dan batas keterlambatan dapat disimpan dan dibaca kembali.
3. Input koordinat/radius tidak valid ditolak dengan pesan jelas.
4. Data laboratorium terbaca oleh modul Map dan validasi presensi.

**AC-S4-04: Bulk insert**

1. Aslab dapat mengunduh template laboratorium, praktikan, dan Asprak.
2. Single insert dan bulk insert berhasil untuk data valid.
3. Baris tidak valid ditolak dan ditandai pada halaman review.
4. Aslab dapat menerima, menolak, mengubah, dan melengkapi data kosong.
5. Hanya baris yang diterima yang masuk koleksi utama.
6. Bulk insert dengan NIM bukan 14 digit ditolak.

**AC-S4-05: Perpindahan anggota**

1. Aslab memindahkan praktikan ke laboratorium tujuan.
2. Keanggotaan lama diperbarui dan tidak ada duplikasi.
3. Aslab memindahkan Asprak ke laboratorium tujuan dengan hasil yang sama.
4. Anggota yang dipindah tidak lagi muncul pada laboratorium asal.

**AC-S4-06: Dashboard Aslab**

1. Dashboard hanya menampilkan laboratorium yang dikelola.
2. Jumlah laboratorium dan praktikan sesuai data.
3. Status kegiatan, lokasi, dan waktu pelaksanaan tampil.
4. Jadwal berlangsung dan berikutnya tampil.
5. Riwayat kegiatan tampil.
6. Riwayat keuangan menampilkan data tagihan/pembayaran dari koleksi bersama; tidak ada koleksi keuangan terpisah.
7. Filter hari, minggu, dan bulan mengubah data yang tampil.
8. State memuat, kosong, dan gagal tampil sesuai kondisi.

**AC-S4-07: Seed dan NIM**

1. Seed membuat akun Aslab, Asprak, dan Praktikan beserta profil Firestore.
2. Menjalankan seed dua kali tidak membuat akun atau dokumen ganda.
3. Jumlah akun Authentication sama dengan dokumen profil.
4. NIM disimpan sebagai String dan hanya menerima tepat 14 digit angka.

**AC-S4-08: Backup dan reset**

1. Backup Firestore tersedia sebelum reset.
2. Environment target terverifikasi development.
3. Reset data dummy development berhasil.
4. Seed dimuat setelah reset.
5. Tidak ada operasi reset pada production; percobaan ke production dibatalkan dan dicatat.

**AC-S4-09: Sesi Asprak**

1. Asprak hanya melihat kelas/jadwal/sesi yang menjadi tanggung jawabnya.
2. Asprak membuka sesi `belum-dibuka`; status dan waktu buka tersimpan.
3. Asprak menutup sesi `dibuka`; status dan waktu tutup tersimpan.
4. Sesi `ditutup` tidak dapat ditutup ulang atau dibuka kembali.
5. Perubahan status terlihat di aplikasi Praktikan tanpa reload.

**AC-S4-10: Jam sesi**

1. Buka sesi sebelum jam minimal ditolak dengan alasan.
2. Buka sesi setelah jam maksimal ditolak dengan alasan.
3. Buka sesi dalam rentang yang diizinkan berhasil.
4. Perubahan konfigurasi waktu di Firestore langsung memengaruhi validasi.
5. Validasi dilakukan saat aksi, bukan hanya dengan menonaktifkan tombol.

**AC-S4-11: Pemantauan presensi**

1. Asprak melihat daftar presensi sesi yang diampu.
2. Jumlah hadir dan total peserta tampil.
3. Perubahan presensi tampil real-time.
4. State kosong dan gagal tampil.

**AC-S4-12: Izin dan AI**

1. Praktikan memilih izin dari sesi tertentu; form terbuka dengan sesi terpilih.
2. Kategori izin, alpha, dan sakit tersedia dan wajib dipilih.
3. Pengajuan tersimpan di Firestore.
4. Alasan dikirim ke API AI bila kontrak tersedia.
5. Hasil AI tersimpan bersama pengajuan dan ditampilkan kepada Asprak dengan label informasi pendukung.
6. Bila AI gagal/timeout, pengajuan tetap tersimpan dan status klasifikasi gagal.
7. AI tidak mengubah status izin secara otomatis.

**AC-S4-13: Keputusan izin dan excused absence**

1. Asprak menerima satu izin dan menolak satu izin.
2. Keputusan tersimpan dan terlihat real-time di aplikasi Praktikan.
3. Izin yang disetujui menjadi `excused absence`.
4. Status tidak berubah menjadi hadir.
5. Tidak ada tagihan denda keterlambatan untuk sesi yang izinnya disetujui.
6. Izin yang ditolak tidak menghasilkan `excused absence`.

**AC-S4-14: Keterlambatan dan tagihan**

1. Presensi tepat waktu atau dalam grace period tidak menghasilkan tagihan.
2. Presensi terlambat di luar grace period menghasilkan tagihan.
3. Tagihan memuat praktikan, sesi, presensi, laboratorium, nominal, dan alasan.
4. Memproses ulang kejadian yang sama tidak membuat tagihan kedua.
5. Tagihan dapat dibaca Dashboard Aslab.

**AC-S4-15: Pembayaran Midtrans**

1. Praktikan melihat daftar tagihan dan rincian nominal.
2. Praktikan memulai pembayaran; aplikasi meminta transaksi ke backend.
3. Secret Key Midtrans tidak ditemukan di aplikasi.
4. Transaksi Sandbox dibuat dan status awal `pending`.
5. Callback/webhook diterima dan diverifikasi backend.
6. Transaksi berhasil mengubah status transaksi menjadi `success` dan status tagihan sesuai kontrak.
7. Transaksi gagal menjadi `failed` dan tagihan tidak ditandai lunas.
8. Status dari client tidak dapat menandai pembayaran berhasil tanpa verifikasi backend.

**AC-S4-16: Pembayaran tidak mengubah kehadiran**

1. Catat status kehadiran Praktikan sebelum pembayaran.
2. Lakukan pembayaran berhasil.
3. Status kehadiran tetap sama.
4. `excused absence` tetap `excused absence`; status terlambat/hadir tidak berubah.

**AC-S4-17: Riwayat pembayaran**

1. Praktikan membuka riwayat transaksi dan pembayaran.
2. Riwayat menampilkan nominal, status, dan waktu.
3. Tutup dan buka kembali aplikasi.
4. Riwayat tetap tersedia karena dibaca dari Firestore.

**AC-S4-18: Notifikasi**

1. Tagihan baru menghasilkan notifikasi kepada Praktikan terkait.
2. Pembayaran berhasil menghasilkan notifikasi.
3. Pembayaran gagal menghasilkan notifikasi.
4. Tombol notifikasi dapat diklik dan membuka halaman relevan.
5. Notifikasi berjalan pada foreground, background, dan terminated sesuai dukungan platform.
6. Kejadian yang sama tidak menghasilkan notifikasi ganda.
7. Kegagalan notifikasi tidak membatalkan perubahan data utama.

**AC-S4-19: Navigasi dan Map**

1. Navbar Praktikan memiliki lima halaman: Jadwal, Riwayat, Presensi QR, Izin, Denda.
2. Navbar Asprak memiliki lima halaman: Jadwal, Kelas, Map, Rekap, Izin.
3. Setiap tab membuka halaman yang ada.
4. Map Praktikan tidak lagi menjadi halaman utama.
5. Map dibuka dari praktikum terkait dan menampilkan laboratorium yang sesuai.
6. Data radius tetap mendukung validasi presensi.

**AC-S4-20: UI dan aksesibilitas**

1. Tampilan modul Sprint 4 mengikuti design system dan token.
2. Target sentuh minimal 44x44 pt.
3. Status tidak hanya dibedakan melalui warna.
4. Tombol nonaktif memiliki alasan yang terlihat.
5. Empty state tersedia untuk daftar kosong yang relevan.

**AC-S4-21: Regresi Sprint 1–3**

1. Login/logout dan auth guard tetap berjalan.
2. Jadwal, detail sesi, presensi QR/lokasi, rekap, izin, dan notifikasi Sprint 3 tetap berjalan.
3. Perubahan role dan navigasi tidak memutus alur lama yang masih relevan.
4. Tidak ada error konsol pada alur demo.

**AC-S4-22: Dokumentasi**

1. `docs/sprints/sprint-4.md` memuat seluruh bagian wajib dan 87 task induk.
2. `docs/PRD.md` memuat requirement Sprint 4 dan tetap mempertahankan requirement Sprint 1–3.
3. Kedua dokumen saling merujuk.
4. Hanya file dokumentasi target yang berubah untuk pekerjaan dokumentasi.

**AC-S4-23: Demo end-to-end**

1. Demo A (Aslab) berjalan sesuai bagian 11.2 `sprint-4.md`.
2. Demo B (Asprak/sesi/izin) berjalan.
3. Demo C (Praktikan/izin/excused absence) berjalan.
4. Demo D (denda/pembayaran) berjalan.
5. Demo E (notifikasi/navigasi) berjalan.
6. Seluruh langkah berhasil tanpa bug kritis yang menghambat demo.

## 22. Data, dependency, dan risiko teknis Sprint 4

### 22.1 Data dan integrasi

Struktur Firestore rinci ada di [`docs/sprints/sprint-4.md`](sprints/sprint-4.md) bagian 9. Ringkasan koleksi Sprint 4:

| Koleksi | Isi utama |
|---|---|
| `users` | Profil, `nomorInduk` String, role `praktikan`/`asprak`/`aslab` |
| `laboratorium` | Nama, lokasi, koordinat, radius, cakupan lokasi, batas keterlambatan |
| `mataKuliah` | Nama dan kode mata kuliah |
| `kelas` | Mata kuliah, laboratorium, Aslab, Asprak, peserta |
| `sesi` | Kelas, laboratorium, Asprak, waktu, status buka/tutup |
| `sesi/{id}/presensi` | Waktu, status kehadiran, keterlambatan |
| `sesi/{id}/izin` | Alasan, kategori, status, hasil analisis AI |
| `tagihan` | Praktikan, sesi, presensi, laboratorium, nominal, status |
| `pembayaran` | Tagihan, order, status transaksi, verifikasi |
| `notifikasi` | Penerima, tipe, referensi, status baca |

Ketentuan integrasi:

1. Schema dan relasi wajib disepakati Anggi dan Dehar pada hari pertama.
2. Tagihan dan pembayaran wajib menyimpan `laboratoriumId` agar Dashboard Aslab tidak membuat sumber keuangan terpisah.
3. Midtrans memakai alur client–backend–payment gateway. Secret Key hanya di backend.
4. API AI dipanggil melalui backend bila memakai credential rahasia. `EXPO_PUBLIC_AI_API_KEY` dicatat sebagai security gap.
5. Hasil AI disimpan bersama izin dan hanya menjadi informasi pendukung.
6. Seed memakai penanda idempotensi dan diverifikasi terhadap Firebase Authentication.
7. Backup Firestore wajib sebelum reset development; production dilarang direset.

### 22.2 Dependency eksternal

| Dependency | Status | Dampak bila belum tersedia |
|---|---|---|
| Firebase Auth dan Firestore | Tersedia dari Sprint 2 | Seluruh fitur Sprint 4 terblokir |
| Midtrans Sandbox | Sebagian TBD | Pembayaran tidak dapat diuji end-to-end |
| Backend payment (Cloud Functions/server) | TBD | Transaksi, callback, verifikasi tidak dapat diimplementasikan |
| API AI (endpoint, auth, request, response) | TBD | Analisis sentimen memakai fallback/mock; hasil asli tidak tersedia |
| File model AI | TBD | Perlu preprocessing/inference tambahan |
| Push notification | TBD | Notifikasi tagihan/pembayaran tidak dapat diuji lintas kondisi |
| Map/lokasi/QR | Tersedia dari Sprint 3 | Presensi dan Map terdampak |
| Developer Auth | TBD | Reset password belum dapat diselesaikan |

### 22.3 Risiko teknis

| Risiko | Mitigasi |
|---|---|
| Backend Midtrans belum ditentukan | Konfirmasi pengajar sebelum integrasi; antarmuka backend disiapkan; status TBD dicatat |
| Secret Key Midtrans bocor ke bundel | Secret hanya di backend; review PR; periksa variabel `EXPO_PUBLIC_*` |
| `EXPO_PUBLIC_AI_API_KEY` diekstrak dari bundel | Catat sebagai security gap; pindahkan ke backend bila credential rahasia |
| Detail API AI belum tersedia | Mock/fallback; pengajuan izin tetap berjalan |
| Tagihan ganda | Idempotensi per kejadian; uji proses ulang |
| Callback palsu atau status client dipercaya | Verifikasi backend; client hanya membaca Firestore |
| Reset development mengenai production | Verifikasi environment, backup wajib, prosedur berlapis |
| Seed tidak idempotent | Penanda seed/ID tetap; uji seed ulang |
| Kewenangan kelas pindah ke Aslab | Perbarui rules dan UI; uji akses Asprak |
| Security Rules tidak dapat query lintas koleksi | Validasi tambahan di lapisan data; dokumentasikan batasan |
| Bulk insert besar | Batasi batch; proses bertahap; review sebelum simpan |
| Notifikasi duplikat | Idempotensi event dan kunci kejadian |
| Notifikasi terminated tidak berjalan | Uji tiga kondisi; catat keterbatasan platform |
| Zona waktu tidak konsisten | Sepakati zona waktu dan format tanggal/waktu |
| Koordinat/radius belum final | Gunakan data Sprint 3; konfirmasi sebelum demo |
| Waktu sprint terbatas | Prioritaskan P0; pantau progres harian; P2 dapat ditunda |

### 22.4 TBD Sprint 4

| Item | Status | Dampak |
|---|---|---|
| Periode Sprint 4 | TBD | Perencanaan waktu |
| Backend Midtrans: Cloud Functions atau server terpisah | TBD | Implementasi pembayaran |
| Endpoint backend, request/response, signature verification | TBD | Integrasi pembayaran |
| Callback HTTPS untuk development | TBD | Pengujian webhook |
| Endpoint API AI, autentikasi, request, response | TBD | Integrasi AI |
| Kategori/format hasil AI | TBD | Pemetaan field hasil |
| API atau file model AI | TBD | Preprocessing/inference |
| Batas waktu dan kuota AI | TBD | Timeout dan biaya |
| Mekanisme push notification | TBD | Notifikasi transaksi |
| Format template bulk insert | TBD | Bulk insert |
| Penanda seed idempotent | TBD | Seed ulang |
| Format kode mata kuliah | TBD | Bulk insert laboratorium |
| Nominal denda dan grace period | TBD | Perhitungan denda |
| Status tagihan final dan pemetaan status Midtrans | TBD | Sinkronisasi tagihan |
| Nilai status kehadiran final | TBD | `excused absence`, alpha, terlambat |
| Field `laboratoriumIds` pada `users` | TBD | Relasi anggota dan rules |
| Kewenangan Aslab membaca izin/hasil AI | TBD | Role matrix dan rules |
| Riwayat perpindahan anggota | TBD | Jejak distribusi |
| Nama berkas desain | TBD | Pembaruan desain |
| Developer Auth dan reset password | TBD | Reset password |
| Dukungan Web untuk Midtrans, notifikasi, AI | TBD | Pengujian platform |
| Migrasi istilah `asisten` ke `asprak` | TBD | Konsistensi data dan rules |

## 23. Referensi

1. [`docs/sprints/sprint-2.md`](sprints/sprint-2.md) — Firebase Authentication, Cloud Firestore, izin, dan klasifikasi AI.
2. [`docs/sprints/sprint-3.md`](sprints/sprint-3.md) — presensi QR/lokasi, Maps, dan push notification.
3. [`docs/sprints/sprint-4.md`](sprints/sprint-4.md) — scope, role, 87 task induk, data, testing, dan risiko Sprint 4.
4. [`docs/references/PEMBAGIAN JOBDESC SPRINT 4 — PRAKTIKUMKU.pdf`](references/PEMBAGIAN%20JOBDESC%20SPRINT%204%20%E2%80%94%20PRAKTIKUMKU.pdf) — sumber resmi jobdesc dan requirement Sprint 4.
5. [`docs/GIT-WORKFLOW.md`](GIT-WORKFLOW.md) — branch, commit, PR, dan review.
6. [`AGENTS.md`](../AGENTS.md) — aturan implementasi dan ownership.

**Catatan sumber:** repository hanya menyediakan satu berkas PDF referensi Sprint 4. Berkas requirement resmi terpisah dan berkas perbaikan sprint sebelumnya yang terpisah tidak ditemukan. Requirement yang tidak tercantum pada PDF ditandai TBD dan tidak diasumsikan.

 