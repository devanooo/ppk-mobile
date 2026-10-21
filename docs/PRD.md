# PRD — AntarMuka, Sprint 1

| Field | Isi |
|---|---|
| Produk | AntarMuka (Antar Praktikum) |
| Sprint | Sprint 1 — UI & alur inti |
| Platform | React Native (Expo), iOS / Android / web |
| Status | Approved untuk eksekusi |
| Pemilik | PM |

## 1. Ringkasan

AntarMuka adalah aplikasi sistem informasi praktikum untuk mencatat kehadiran. Sprint 1 membangun demo yang bisa dijalankan tanpa backend: seluruh data (pengguna, jadwal, sesi, presensi) adalah dummy di memori. Fokus sprint ini adalah **UI, navigasi, dan interaksi**, bukan integrasi server.

## 2. Masalah

Pencatatan kehadiran praktikum masih dilakukan manual, sehingga:

- praktikan tidak tahu pasti sesi sudah dibuka atau belum;
- asisten tidak punya rekap waktu kehadiran yang rapi;
- status sesi (belum dibuka / dibuka / ditutup) tidak terlihat konsisten antar pihak.

## 3. Pengguna & peran

| Peran | Kebutuhan utama |
|---|---|
| Praktikan | tahu jadwal & detail sesi, presensi saat sesi dibuka, lihat riwayat kehadiran sendiri |
| Asisten | lihat jadwal yang diampu, buka/tutup sesi, pantau kehadiran, lihat rekap + waktu presensi |

Identitas tidak memakai login. Pengguna memilih peran dan identitas dari daftar dummy di layar awal.

## 4. Tujuan sprint

1. Dua alur pengguna utama dapat didemokan end-to-end.
2. Semua status sesi terlihat konsisten di layar jadwal, detail, dan rekap.
3. Tidak ada aksi yang bisa menghasilkan data ganda (presensi dobel).
4. Seluruh layar punya kondisi kosong yang jelas.

**Metrik keberhasilan (kualitatif):** demo 5 langkah di bagian 11 berjalan tanpa error dan tanpa penjelasan tambahan dari pembuat.

## 5. Scope

### Termasuk

- Pemilihan peran + identitas (form sederhana).
- Daftar jadwal & detail sesi untuk kedua peran.
- Buka/tutup sesi oleh asisten.
- Presensi oleh praktikan + pencegahan presensi ganda.
- Rekap kehadiran untuk asisten, riwayat kehadiran untuk praktikan.
- Empty state, feedback sukses/gagal, modal/bottom sheet konfirmasi.

### Tidak termasuk (non-goals)

Backend & database, autentikasi/otorisasi nyata, sinkronisasi lintas perangkat, notifikasi push, QR/lokasi, export laporan, multi-semester, riwayat perubahan status.

## 6. Alur utama

**Alur praktikan**

Pilih peran → Jadwal → pilih sesi → detail sesi → tekan *Presensi* → bottom sheet konfirmasi → berhasil (waktu tercatat) → tab *Kehadiran* menampilkan catatan.

**Alur asisten**

Pilih peran → Jadwal → pilih sesi → detail sesi → *Buka sesi* (konfirmasi) → pantau daftar hadir → *Tutup sesi* (konfirmasi) → tab *Rekap* menampilkan rekap + waktu.

## 7. Kebutuhan fungsional & acceptance criteria

### F1 — Jadwal dan detail sesi

- [ ] Daftar jadwal menampilkan nama praktikum, kelas/lab, hari & tanggal, jam, dan status sesi (badge).
- [ ] Detail sesi menampilkan nama praktikum, kode/kelas, lab, hari & tanggal, jam, nama asisten, dan status.
- [ ] Status yang tampil konsisten di daftar, detail, dan rekap.
- [ ] Daftar kosong menampilkan empty state + penjelasan.

### F2 — Pengelolaan sesi (asisten)

- [ ] Tombol **Buka sesi** hanya muncul saat status `belum-dibuka`; menampilkan bottom sheet konfirmasi sebelum eksekusi.
- [ ] Setelah dibuka, status berubah menjadi `dibuka` dan waktu buka tampil.
- [ ] Tombol **Tutup sesi** hanya muncul saat status `dibuka`; memakai konfirmasi.
- [ ] Setelah ditutup, status `ditutup`, tombol presensi praktikan nonaktif.
- [ ] Asisten tidak bisa menutup sesi yang belum dibuka (tombol tidak tersedia / nonaktif dengan alasan).

### F3 — Presensi (praktikan)

- [ ] Tombol **Presensi** aktif hanya saat sesi `dibuka`.
- [ ] Saat `belum-dibuka`/`ditutup`, tombol nonaktif disertai alasan ("Sesi belum dibuka" / "Sesi sudah ditutup").
- [ ] Presensi melalui bottom sheet konfirmasi berisi nama sesi + identitas praktikan.
- [ ] Setelah sukses: umpan balik jelas (banner/toast/sheet sukses) dan waktu kehadiran tampil (format `HH:mm`).
- [ ] Praktikan yang sama tidak bisa presensi dua kali pada sesi yang sama — tombol menjadi *Sudah presensi* dan aksi kedua ditolak dengan pesan.

### F4 — Rekap (asisten)

- [ ] Rekap menampilkan daftar praktikan yang hadir beserta waktu presensi, diurutkan berdasarkan waktu.
- [ ] Menampilkan jumlah hadir / total praktikan terdaftar.
- [ ] Rekap kosong menampilkan empty state ("Belum ada yang presensi").
- [ ] Rekap dapat diakses dari detail sesi dan dari tab Rekap.

### F5 — Riwayat kehadiran (praktikan)

- [ ] Tab Kehadiran menampilkan daftar sesi yang pernah dihadiri + waktu presensi.
- [ ] Bila belum ada, tampil empty state ("Belum ada catatan kehadiran").

### F6 — Interaksi & input

- [ ] Semua input memakai form terkontrol (pilihan peran/identitas).
- [ ] Konfirmasi aksi destruktif/perubahan status memakai modal atau bottom sheet.
- [ ] Setiap aksi memberi feedback (sukses/gagal) yang terlihat tanpa harus pindah layar.
- [ ] Tidak ada tombol tanpa state disabled yang jelas.

### F7 — Tata letak & state

- [ ] Layout memakai flexbox, aman terhadap notch (safe area), dan tidak overflow di layar kecil.
- [ ] Navigasi memakai Expo Router (tab + stack detail).
- [ ] State dibagi antar layar lewat context store sehingga perubahan status langsung terlihat.
- [ ] Data bertahan selama aplikasi berjalan; reset saat reload (dapat diterima).

## 8. Peta layar

| Route | Peran | Isi | Empty state |
|---|---|---|---|
| `/` | semua | pilih peran + identitas, tombol Masuk | — |
| `/(praktikan)/jadwal` | praktikan | daftar sesi + badge status | "Belum ada jadwal" |
| `/(praktikan)/jadwal/[id]` | praktikan | detail sesi + aksi presensi | status nonaktif + alasan |
| `/(praktikan)/kehadiran` | praktikan | riwayat presensi sendiri | "Belum ada catatan kehadiran" |
| `/(asisten)/jadwal` | asisten | daftar sesi yang diampu | "Belum ada sesi" |
| `/(asisten)/jadwal/[id]` | asisten | detail + buka/tutup sesi + rekap ringkas | "Belum ada yang presensi" |
| `/(asisten)/rekap` | asisten | rekap semua sesi yang diampu | "Belum ada data rekap" |

## 9. Model data (dummy)

```ts
type StatusSesi = 'belum-dibuka' | 'dibuka' | 'ditutup';

type User = {
  id: string;
  nama: string;
  nim: string;
  role: 'praktikan' | 'asisten';
};

type Sesi = {
  id: string;
  namaPraktikum: string;
  kode: string;
  kelas: string;
  lab: string;
  hari: string;      // "Senin"
  tanggal: string;   // "2026-10-26"
  jamMulai: string;  // "13:00"
  jamSelesai: string;// "15:30"
  asistenId: string;
  praktikanIds: string[];
  status: StatusSesi;
  dibukaPada?: string;  // ISO datetime
  ditutupPada?: string; // ISO datetime
};

type Presensi = {
  id: string;
  sesiId: string;
  praktikanId: string;
  waktu: string; // ISO datetime
};
```

Aturan: kunci unik presensi = `sesiId + praktikanId`. Data awal 4–6 sesi dengan variasi status, 4 praktikan, 2 asisten.

## 10. Aturan UI

- Token warna/spacing/font dari `src/constants/theme.ts`; dilarang hardcode warna di layar.
- Badge status: abu (belum dibuka), hijau (dibuka), netral gelap (ditutup) — konsisten di semua layar.
- Aksi utama satu per layar (primary button), aksi sekunder berupa teks.
- Bottom sheet dipakai untuk konfirmasi presensi dan buka/tutup sesi.
- Format waktu `HH:mm`, tanggal `Senin, 26 Okt 2026`.
- Target sentuh minimal 44×44 pt.

## 11. Skenario demo (Definition of Done)

1. Asisten membuka sesi → badge berubah *Dibuka* dan waktu buka tampil.
2. Praktikan membuka sesi yang sama → tombol Presensi aktif → konfirmasi → sukses, waktu tercatat.
3. Praktikan mencoba presensi lagi → ditolak dengan pesan jelas.
4. Asisten membuka rekap → praktikan tersebut muncul + waktu presensi.
5. Asisten menutup sesi → badge *Ditutup*, tombol presensi praktikan nonaktif.

Demo dianggap lulus bila kelima langkah berjalan di satu perangkat tanpa reload dan tanpa error di konsol.

## 12. Risiko

| Risiko | Mitigasi |
|---|---|
| Tiga programmer mengubah file yang sama | CODEOWNERS + path beku + kontrak data di-freeze D1 |
| Store belum siap saat layar dikerjakan | layar presentational menerima props, route file tipis |
| Demo gagal karena state tidak sinkron | satu store context, bukan state lokal per layar |
| Scope melebar ke backend | non-goals ditulis eksplisit, perubahan scope via PM |

## 13. Backlog Sprint 2 (di luar sprint ini)

Backend + database, login asisten/praktikan, presensi via kode sesi/QR, rekap per semester + export CSV, notifikasi pengingat jadwal.
