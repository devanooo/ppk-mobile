# PRD — AntarMuka (AntarPraktikum), Sprint 1

## 1. Informasi produk dan tujuan sprint

| Field | Isi |
|---|---|
| Produk | AntarMuka — tagline "AntarPraktikum" |
| Sprint | Sprint 1 — UI, navigasi, dan alur inti |
| Platform | React Native (Expo), iOS / Android / web |
| Data | Dummy, state in-memory (tanpa backend/database) |
| Status | Approved |
| Pemilik | PM |

**Tujuan sprint:** menghasilkan aplikasi yang dapat mendemonstrasikan pencatatan kehadiran praktikum dari dua perspektif (praktikan dan asisten) dalam satu sesi aplikasi, tanpa backend.

**Definisi sukses:** demo script bagian 12 dijalankan berurutan tanpa reload dan tanpa error konsol.

## 2. Problem statement dan solusi

**Masalah.** Praktikan tidak punya cara pasti untuk tahu apakah sesi sudah dibuka, sehingga kehadiran dicatat manual dan mudah terlewat. Asisten tidak punya rekap waktu kehadiran yang rapi. Status sesi tidak terlihat konsisten antara asisten dan praktikan.

**Solusi.** Satu aplikasi dengan dua perspektif. Pengguna memilih peran dan identitas di layar awal. Asisten membuka sesi saat praktikum dimulai, memantau presensi, lalu menutup sesi. Praktikan melihat jadwal, membuka detail sesi, dan menekan presensi hanya ketika sesi dibuka; waktu kehadiran tercatat dan tampil sebagai konfirmasi.

## 3. Tujuan dan non-goals

**Tujuan**

1. Dua alur pengguna selesai end-to-end dalam satu sesi aplikasi.
2. Status sesi konsisten antara daftar dan detail.
3. Aturan presensi (khususnya larangan presensi ganda) ditegakkan di lapisan data, bukan hanya UI.
4. Semua kondisi kosong memiliki tampilan yang jelas.

**Non-goals**

Backend/database, autentikasi & otorisasi nyata, sinkronisasi lintas perangkat, notifikasi push, presensi QR/lokasi, export laporan, multi-semester, riwayat audit perubahan status, membuka ulang sesi yang sudah ditutup, penutupan sesi otomatis berdasarkan waktu, pengelolaan data master (tambah/edit pengguna, jadwal, peserta).

## 4. Pengguna dan user stories

### 4.1 Identitas

1. Sebagai pengguna, saya ingin memilih peran **praktikan** atau **asisten** di layar awal, supaya saya melihat antarmuka sesuai kegiatan saya.
2. Sebagai pengguna, saya ingin memilih identitas dari daftar dummy sesuai peran, supaya data yang tercatat atas nama yang benar.
3. Sebagai pengguna, saya ingin tombol **Masuk** nonaktif sampai peran dan identitas dipilih, supaya saya tidak masuk dengan data tidak lengkap.
4. Sebagai pengguna, saya ingin mengganti peran tanpa me-restart aplikasi, supaya saya bisa mendemokan kedua sudut pandang.

### 4.2 Jadwal dan detail sesi

5. Sebagai pengguna, saya ingin melihat daftar sesi yang relevan bagi saya, supaya saya tahu jadwal yang tersedia.
6. Sebagai pengguna, saya ingin tiap kartu jadwal menampilkan nama praktikum, kelas, lab, hari & tanggal, jam, dan status sesi, supaya saya bisa membedakan sesi.
7. Sebagai pengguna, saya ingin membuka detail sesi, supaya saya melihat informasi lengkap termasuk nama asisten dan waktu buka/tutup.

### 4.3 Pengelolaan sesi (asisten)

8. Sebagai asisten, saya ingin membuka sesi yang berstatus belum dibuka lewat konfirmasi, supaya saya tidak salah tekan.
9. Sebagai asisten, saya ingin waktu buka tercatat dan ditampilkan, supaya saya tahu kapan sesi dimulai.
10. Sebagai asisten, saya ingin menutup sesi yang sedang dibuka lewat konfirmasi, supaya presensi berhenti pada waktu yang tepat.
11. Sebagai asisten, saya ingin waktu tutup tercatat, supaya sesi punya rentang waktu jelas.
12. Sebagai asisten, saya ingin tombol aksi yang tidak valid tidak tersedia atau nonaktif disertai alasan, supaya saya tidak mencoba aksi yang mustahil.
13. Sebagai asisten, saya ingin melihat jumlah peserta hadir saat sesi berlangsung, supaya saya bisa memantau partisipasi.

### 4.4 Presensi (praktikan)

14. Sebagai praktikan, saya ingin tombol presensi aktif hanya saat sesi dibuka, supaya saya tidak presensi di luar waktu.
15. Sebagai praktikan, saya ingin melihat alasan saat tombol nonaktif ("Sesi belum dibuka" / "Sesi sudah ditutup"), supaya saya tahu harus menunggu atau sudah terlambat.
16. Sebagai praktikan, saya ingin mengonfirmasi presensi lewat bottom sheet berisi nama sesi dan identitas saya, supaya saya yakin data yang dikirim benar.
17. Sebagai praktikan, saya ingin menerima umpan balik jelas setelah presensi berhasil, supaya saya tahu kehadiran tercatat.
18. Sebagai praktikan, saya ingin melihat jam kehadiran saya setelah presensi, supaya saya punya bukti waktu.
19. Sebagai praktikan, saya ingin tombol berubah menjadi "Sudah presensi" dan tidak bisa ditekan lagi, supaya saya tidak mengirim data ganda.
20. Sebagai praktikan, saya ingin pesan penolakan bila mencoba presensi dua kali, supaya saya paham aturannya.

### 4.5 Rekap dan riwayat

21. Sebagai asisten, saya ingin melihat daftar praktikan yang sudah presensi pada satu sesi beserta jam kehadiran, diurutkan berdasarkan waktu, supaya saya bisa memverifikasi kehadiran.
22. Sebagai asisten, saya ingin melihat jumlah hadir dibanding total peserta terdaftar, supaya saya tahu tingkat kehadiran sekilas.
23. Sebagai asisten, saya ingin melihat ringkasan seluruh sesi yang saya ampu pada tab Rekap, supaya saya tidak harus membuka sesi satu per satu.
24. Sebagai praktikan, saya ingin melihat riwayat kehadiran saya sendiri, supaya saya bisa mengecek catatan dari sesi sebelumnya.

### 4.6 Kondisi kosong dan tata letak

25. Sebagai pengguna, saya ingin melihat empty state ketika daftar jadwal, rekap, atau riwayat kosong, supaya saya tahu aplikasi tidak rusak.
26. Sebagai pengguna, saya ingin tata letak menyesuaikan layar kecil dan aman dari notch, supaya konten tidak terpotong.

## 5. Alur utama per peran

**Praktikan**

Pilih peran *Praktikan* + identitas → **Masuk** → tab *Jadwal* → pilih sesi → detail sesi → tekan **Presensi** → bottom sheet konfirmasi → berhasil (jam kehadiran tampil, tombol jadi *Sudah presensi*) → tab *Kehadiran* menampilkan catatan.

**Asisten**

Pilih peran *Asisten* + identitas → **Masuk** → tab *Jadwal* → pilih sesi → detail sesi → **Buka sesi** → bottom sheet konfirmasi → status *Dibuka* + waktu buka → pantau jumlah hadir dan daftar peserta → **Tutup sesi** → bottom sheet konfirmasi → status *Ditutup* + waktu tutup → tab *Rekap*.

**Ganti peran**

Dari header mana pun → **Ganti peran** → kembali ke layar pemilihan identitas. Sesi dan presensi yang sudah tercatat tetap ada (lihat bagian 8).

## 6. Functional requirements

| ID | Requirement | User stories |
|---|---|---|
| FR-01 | Pemilihan peran + identitas (form terkontrol), tombol Masuk nonaktif sampai lengkap | 1–4 |
| FR-02 | Daftar jadwal + badge status, untuk kedua peran | 5, 6 |
| FR-03 | Detail sesi: nama praktikum, kelas, lab, hari & tanggal, jam, asisten, status, waktu buka/tutup | 7, 9, 11 |
| FR-04 | Asisten membuka dan menutup sesi dengan konfirmasi bottom sheet | 8–13 |
| FR-05 | Praktikan melakukan presensi saat sesi dibuka, dengan konfirmasi dan feedback | 14–20 |
| FR-06 | Rekap asisten (per sesi dan ringkasan) dan riwayat praktikan | 21–24 |
| FR-07 | Empty state, feedback sukses/gagal, layout flexbox + safe area | 25, 26 |

## 7. Aturan bisnis dan transisi status

**State machine sesi:** `belum-dibuka → dibuka → ditutup`

| Status | Aksi tersedia (asisten) | Presensi praktikan | Tombol di UI |
|---|---|---|---|
| `belum-dibuka` | Buka sesi | Ditolak | Nonaktif, label alasan "Sesi belum dibuka" |
| `dibuka` | Tutup sesi | Diizinkan | Aktif (atau "Sudah presensi") |
| `ditutup` | Tidak ada | Ditolak | Nonaktif, label alasan "Sesi sudah ditutup" |

**Aturan wajib**

1. Hanya asisten yang dapat membuka/menutup sesi; praktikan tidak memiliki aksi tersebut di UI.
2. Sesi `ditutup` tidak dapat dibuka kembali pada Sprint 1.
3. Presensi hanya diterima saat status `dibuka`.
4. Status tidak berubah otomatis berdasarkan waktu; hanya berubah melalui aksi asisten.
5. Setiap aksi yang tidak valid ditolak di lapisan data dan mengembalikan pesan yang ditampilkan ke pengguna.
6. Status pada kartu daftar dan halaman detail berasal dari sumber data yang sama sehingga tidak mungkin berbeda.

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
```

**Aturan integritas**

1. Kunci unik presensi = pasangan `sesiId + praktikanId`; tidak ada field `id` terpisah.
2. Presensi hanya sah jika `sesiId` ada, `praktikanId` terdaftar pada `Sesi.pesertaIds`, status sesi `dibuka`, dan belum ada catatan untuk pasangan tersebut.
3. Waktu kehadiran diambil dari jam perangkat saat presensi berhasil, disimpan sebagai ISO 8601, ditampilkan `HH:mm`.
4. Tanggal ditampilkan sebagai `Senin, 26 Okt 2026`; jam sebagai `HH:mm`.
5. Data dummy: 2 asisten (asisten A mengampu 5 sesi, asisten B tidak mengampu sesi), 4 praktikan (3 terdaftar pada tiap sesi, 1 praktikan tidak terdaftar pada sesi mana pun), 5 sesi (2 `belum-dibuka`, 2 `dibuka`, 1 `ditutup`) dengan 3 peserta per sesi, dan 2 presensi awal. Sesi tanpa presensi disediakan untuk menguji rekap kosong; asisten B dan praktikan ke-4 dipakai untuk menguji jadwal/riwayat kosong.
6. Pergantian identitas hanya mengganti `user` aktif; sesi dan presensi tidak dihapus.
7. Identitas aktif menentukan data yang tampil: praktikan melihat sesi tempat ia ada di `pesertaIds`; asisten melihat sesi dengan `asistenId` miliknya.
8. Rekap hanya membaca presensi milik sesi terkait; riwayat hanya membaca presensi milik praktikan aktif.
9. Tidak ada persistensi: reload mengembalikan data ke kondisi dummy.

## 9. Navigasi dan interaksi

**Peta layar**

| Layar | Akses | Isi utama |
|---|---|---|
| Pilih identitas | root, setelah "Ganti peran" | form peran + identitas, tombol Masuk |
| Jadwal (praktikan) | tab | daftar kartu sesi + badge status |
| Detail sesi (praktikan) | dari daftar | info sesi, status, tombol Presensi + alasan |
| Kehadiran | tab | riwayat presensi praktikan aktif |
| Jadwal (asisten) | tab | daftar sesi yang diampu |
| Detail sesi (asisten) | dari daftar | info sesi, waktu buka/tutup, tombol Buka/Tutup sesi, jumlah hadir, daftar peserta |
| Rekap | tab | ringkasan tiap sesi yang diampu + jumlah hadir |

**Navigasi:** root stack untuk pemilihan identitas; tab per peran setelah masuk; detail sesi sebagai layar stack dari daftar. Tombol **Ganti peran** tersedia di header tab.

**Interaksi**

| Aksi | Mekanisme | Feedback |
|---|---|---|
| Masuk | tombol form | navigasi ke tab peran |
| Buka sesi | bottom sheet konfirmasi | status + waktu buka berubah; banner sukses |
| Tutup sesi | bottom sheet konfirmasi | status + waktu tutup berubah; banner sukses |
| Presensi | bottom sheet konfirmasi (nama sesi + identitas) | banner sukses + jam kehadiran; tombol jadi *Sudah presensi* |
| Presensi ditolak | aksi dari store | banner gagal berisi pesan dari store |
| Ganti peran | tombol header | kembali ke layar pilih identitas |

**Aturan interaksi**

- Konfirmasi bottom sheet wajib untuk membuka sesi, menutup sesi, dan presensi.
- Feedback memakai banner inline di layar, bukan alert sistem.
- Tombol nonaktif selalu menampilkan alasan sebagai teks pendukung.
- Operasi sepenuhnya sinkron → tidak ada state loading. Dilarang menampilkan spinner atau skeleton palsu.
- Tidak ada state lokal duplikat untuk sesi/presensi; semua mutasi lewat store.

## 10. Empty states dan feedback

| Kondisi | Tampilan | Teks |
|---|---|---|
| Daftar jadwal kosong | EmptyState dengan ikon + judul + deskripsi | "Belum ada jadwal" / "Sesi praktikum akan muncul di sini." |
| Rekap per sesi kosong | EmptyState | "Belum ada yang presensi" / "Peserta yang sudah presensi akan muncul di sini." |
| Tab Rekap belum ada data | EmptyState | "Belum ada data rekap" |
| Riwayat kehadiran kosong | EmptyState | "Belum ada catatan kehadiran" / "Presensi yang kamu lakukan akan tercatat di sini." |
| Sesi belum dibuka | tombol nonaktif + teks alasan | "Sesi belum dibuka" |
| Sesi sudah ditutup | tombol nonaktif + teks alasan | "Sesi sudah ditutup" |
| Presensi berhasil | banner sukses hijau | "Presensi tercatat pukul 13:04" |
| Presensi ganda ditolak | banner gagal | "Presensi sudah tercatat pada sesi ini" |
| Praktikan tidak terdaftar | banner gagal | "Kamu tidak terdaftar pada sesi ini" |
| Buka/tutup sesi butuh konfirmasi | bottom sheet | judul + deskripsi singkat + tombol Batal / Lanjutkan |

## 11. Acceptance criteria

Semua AC diverifikasi manual di satu perangkat. Tidak ada AC yang bergantung pada backend.

**AC-01 — Pemilihan peran dan identitas**
1. Buka aplikasi → layar pilih identitas muncul.
2. Tombol **Masuk** nonaktif sebelum peran dan identitas dipilih.
3. Pilih peran *Asisten*, pilih salah satu asisten, tekan **Masuk**.
4. Hasil: masuk ke tab asisten; header menampilkan nama asisten yang dipilih.

**AC-02 — Jadwal dan detail sesi**
1. Sebagai praktikan, buka tab Jadwal.
2. Hasil: tiap kartu menampilkan nama praktikum, kelas, lab, hari & tanggal, jam, dan badge status.
3. Tekan satu kartu.
4. Hasil: detail menampilkan seluruh field yang sama + nama asisten, dan badge status identik dengan kartu.

**AC-03 — Buka sesi**
1. Sebagai asisten, buka detail sesi berstatus *Belum dibuka*, tekan **Buka sesi**.
2. Bottom sheet konfirmasi muncul; tekan **Batal** → status tetap *Belum dibuka*.
3. Tekan **Buka sesi** lagi → **Lanjutkan**.
4. Hasil: badge menjadi *Dibuka*, waktu buka tampil, banner sukses muncul.
5. Kembali ke daftar: badge sesi tersebut juga *Dibuka*.

**AC-04 — Presensi berhasil dan pencatatan waktu**
1. Sebagai praktikan pada sesi berstatus *Dibuka*, tekan **Presensi**.
2. Bottom sheet konfirmasi menampilkan nama sesi dan nama praktikan.
3. Tekan **Konfirmasi**.
4. Hasil: banner sukses berisi jam kehadiran; jam kehadiran tampil di detail; tombol berubah menjadi *Sudah presensi* dan nonaktif.

**AC-05 — Penolakan presensi ganda**
1. Pada sesi yang sudah dipresensi praktikan tersebut, coba picu presensi lagi.
2. Hasil: aksi ditolak; banner gagal "Presensi sudah tercatat pada sesi ini"; catatan waktu awal tidak berubah.
3. Jumlah presensi untuk sesi tersebut tetap bertambah satu.

**AC-06 — Penolakan presensi saat sesi tidak aktif**
1. Buka detail sesi berstatus *Belum dibuka* → tombol Presensi nonaktif dengan teks "Sesi belum dibuka".
2. Buka detail sesi berstatus *Ditutup* → tombol nonaktif dengan teks "Sesi sudah ditutup".
3. Bila aksi tetap dipanggil, store menolak dan mengembalikan pesan.

**AC-07 — Penolakan peserta tidak terdaftar**
1. Panggil presensi dengan `praktikanId` yang tidak ada di `pesertaIds` sesi tersebut.
2. Hasil: ditolak; tidak ada catatan presensi baru; pesan "Kamu tidak terdaftar pada sesi ini".

**AC-08 — Tutup sesi dan rekap asisten**
1. Sebagai asisten, pada sesi *Dibuka* tekan **Tutup sesi** → **Lanjutkan**.
2. Hasil: badge *Ditutup*, waktu tutup tampil.
3. Buka rekap sesi tersebut: daftar nama peserta + jam kehadiran, urut naik berdasarkan waktu, dengan ringkasan "N hadir dari M peserta".

**AC-09 — Riwayat praktikan**
1. Sebagai praktikan, buka tab Kehadiran.
2. Hasil: hanya sesi tempat ia presensi, lengkap dengan jam kehadiran.

**AC-10 — Empty state**
1. Masuk sebagai asisten B (tidak mengampu sesi) → tab Jadwal menampilkan "Belum ada jadwal" dan tab Rekap menampilkan "Belum ada data rekap".
2. Masuk sebagai praktikan ke-4 (tidak terdaftar pada sesi) → tab Jadwal menampilkan "Belum ada jadwal".
3. Masuk sebagai praktikan terdaftar yang belum pernah presensi → tab Kehadiran menampilkan "Belum ada catatan kehadiran".
4. Sebagai asisten A, buka rekap sesi tanpa presensi → "Belum ada yang presensi".
5. Semua empty state tampil tanpa error dan tanpa elemen kosong yang menggantung.

**AC-11 — Konsistensi lintas peran** (wajib)
1. Sebagai asisten A, buka satu sesi.
2. Tekan **Ganti peran**, masuk sebagai praktikan yang terdaftar pada sesi tersebut.
3. Hasil: sesi tampil *Dibuka* tanpa reload aplikasi.
4. Praktikan presensi, lalu **Ganti peran** kembali ke asisten A.
5. Hasil: rekap sesi tersebut memuat praktikan tadi beserta jam kehadiran.

**AC-12 — Demo end-to-end tanpa reload** (wajib)
Jalankan berurutan pada satu instance aplikasi, tanpa reload:
1. Asisten membuka sesi → badge *Dibuka*, waktu buka tampil.
2. **Ganti peran** ke praktikan → presensi pada sesi tersebut → banner sukses + jam kehadiran tercatat.
3. **Ganti peran** kembali ke asisten → rekap menampilkan praktikan tersebut beserta jam kehadiran.
4. Asisten menutup sesi → badge *Ditutup*, waktu tutup tampil.
5. **Ganti peran** ke praktikan → buka sesi yang sudah ditutup.
6. Hasil: presensi ditolak, tombol nonaktif dengan alasan "Sesi sudah ditutup"; bila aksi dipanggil, store menolak dengan feedback jelas.

Seluruh langkah berhasil tanpa reload dan tanpa error konsol. Penolakan presensi ganda diuji terpisah pada AC-05.

## 12. Testing dan demo script

**Automated check (minimal)**

Satu skrip assert pada modul logika sesi/presensi (bebas React Native):

1. Presensi saat `belum-dibuka` → ditolak.
2. Presensi saat `dibuka` oleh peserta terdaftar → diterima, `waktu` terisi.
3. Presensi kedua pada sesi sama oleh praktikan sama → ditolak, catatan awal tidak tertimpa.
4. Presensi setelah `ditutup` → ditolak.
5. Presensi oleh praktikan tidak terdaftar → ditolak.

Ditambah pemeriksaan statis: `npx tsc --noEmit` dan `npx expo lint` hijau. Tidak ada test framework yang diwajibkan pada sprint ini.

**QA manual (PM)**

AC-01…AC-12 dijalankan di satu perangkat; status lulus/gagal dicatat.

**Demo script (dijalankan 2×)**

1. Asisten membuka sesi → badge *Dibuka*, waktu buka tampil.
2. **Ganti peran** ke praktikan → tombol Presensi aktif → konfirmasi → sukses, jam kehadiran tercatat.
3. **Ganti peran** ke asisten → rekap sesi menampilkan praktikan tersebut + jam kehadiran.
4. Asisten menutup sesi → badge *Ditutup*, waktu tutup tampil.
5. **Ganti peran** ke praktikan → presensi pada sesi yang sudah ditutup ditolak dengan feedback jelas.

Seluruh langkah berjalan tanpa reload (AC-12). Penolakan presensi ganda diuji pada AC-05.

## 13. Implementation decisions dan asumsi

**Implementation decisions**

1. Satu aplikasi, dua peran; pemilihan peran dan identitas lewat form terkontrol.
2. Model domain hanya `User`, `Sesi`, `Presensi` (lihat bagian 8), tanpa field tambahan.
3. State machine sesi dikelola di satu modul logika murni; store context membungkusnya.
4. Mutasi sesi dan presensi (`bukaSesi`, `tutupSesi`, `catatPresensi`) mengembalikan `{ ok, pesan }` sehingga feedback UI seragam dan validasi tidak bergantung pada disabled tombol. `setUser` hanya mengganti identitas aktif dan tidak memakai jalur hasil aksi tersebut.
5. Satu store context sebagai sumber kebenaran lintas peran; layar menerima props dari route tipis.
6. Navigasi memakai Expo Router: root stack → tab per peran → stack detail.
7. Token warna/spacing/font terpusat; badge status selalu menyertakan label teks, bukan hanya warna.
8. Flexbox + safe area; target sentuh minimal 44×44 pt.

**Asumsi (perlu persetujuan tim)**

1. Nama produk **AntarMuka**, tagline **AntarPraktikum**.
2. Daftar jadwal praktikan difilter ke sesi yang memuat dirinya di `pesertaIds`; karena itu kondisi "tidak terdaftar" hanya muncul lewat data yang tidak konsisten dan tetap ditolak store.
3. Tab Rekap asisten menampilkan ringkasan per sesi; daftar nama + waktu ada di rekap detail sesi.
4. Sesi tidak menutup otomatis saat jam selesai.
5. Sesi `ditutup` tidak dapat dibuka ulang di Sprint 1.
6. Waktu presensi memakai jam perangkat tanpa penanda terlambat/tepat waktu.
7. Satu store bersama dipakai lintas peran. Perubahan sesi dan presensi wajib konsisten saat berpindah peran dalam satu instance aplikasi (AC-11, AC-12). Backend dan sinkronisasi lintas perangkat tetap di luar scope Sprint 1.

## 14. Risiko dan backlog Sprint 2

| Risiko | Mitigasi |
|---|---|
| Tiga programmer mengubah file yang sama | CODEOWNERS + path beku + kontrak data di-freeze D1 |
| Store belum siap saat layar dikerjakan | layar presentational menerima props; route file tipis |
| Demo gagal karena state terduplikasi | satu store context; dilarang state lokal sesi/presensi |
| Validasi hanya di level tombol | semua mutasi lewat fungsi store yang memvalidasi |
| Scope melebar ke backend | non-goals eksplisit; perubahan scope lewat PM |

**Backlog Sprint 2:** backend + database, login asisten/praktikan, presensi via kode sesi/QR, rekap per semester + export CSV, notifikasi pengingat jadwal, membuka ulang sesi, penutupan otomatis berdasarkan jadwal.
