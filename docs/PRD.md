# PRD: PraktikumKU, Sprint 1

## 1. Informasi produk dan tujuan sprint

| Field | Isi |
|---|---|
| Produk | PraktikumKU |
| Sprint | Sprint 1: UI, navigasi, auth dummy, dan alur inti |
| Platform | React Native (Expo), iOS dan Android. Web bukan target |
| Data | Dummy, state in-memory (tanpa backend/database) |
| Autentikasi | Dummy, username + password |
| Status | Approved |
| Pemilik | PM |

**Tujuan sprint:** menghasilkan aplikasi yang dapat mendemonstrasikan pencatatan kehadiran praktikum dari dua perspektif, diawali landing page dan login dummy, dalam satu sesi aplikasi, tanpa backend.

**Definisi sukses:** demo script bagian 12 dijalankan berurutan tanpa reload dan tanpa error konsol, termasuk login, logout, dan ganti peran.

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

Backend/database, autentikasi dan otorisasi nyata, registrasi akun, lupa password, manajemen akun oleh admin, persistensi sesi setelah aplikasi ditutup, sinkronisasi lintas perangkat, notifikasi push, presensi QR/lokasi, export laporan, multi-semester, riwayat audit perubahan status, membuka ulang sesi yang sudah ditutup, penutupan sesi otomatis berdasarkan waktu, pengelolaan data master (tambah/edit pengguna, jadwal, peserta), serta aplikasi web/desktop.

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

**Backlog Sprint 2:** backend + database, login asisten/praktikan yang nyata, registrasi, lupa password, presensi via kode sesi/QR, rekap per semester + export CSV, notifikasi pengingat jadwal, membuka ulang sesi, dan penutupan otomatis berdasarkan jadwal.
