# Arah Desain PraktikumKU

Dokumen ini adalah sumber tunggal arah desain aplikasi PraktikumKU. Berlaku sejak Sprint 3.

## 1. Status dan cara membaca

- Arah visual navy menggantikan analisis Apple.com yang dipakai pada Sprint 1 dan Sprint 2. Spesifikasi Apple (Action Blue, parchment, SF Pro, product tile, hero 56px, section 80px, grid 1440px, glassmorphism) tidak berlaku lagi dan tidak lagi didokumentasikan di sini. Isi lama tetap tersedia di riwayat git sebagai catatan historis.
- Nilai desain yang mengikat ada di `src/constants/tokens.js`. Dokumen ini menjelaskan cara memakainya, bukan menggantikannya.
- Kepemilikan: P3 memiliki token (`src/constants/tokens.js`, `src/constants/theme.ts`); P1 memiliki `src/global.css`, konfigurasi Tailwind, dan konfigurasi native; P1 memiliki Maps dan `react-native-maps`.
- Label status yang dipakai di seluruh dokumen:

| Label | Arti |
|---|---|
| `[TERKONFIRMASI]` | Sudah disepakati. |
| `[TERBUKA]` | Belum diputuskan. Jangan diarang. |
| `[EKSTERNAL]` | Milik PM atau owner lain. Tidak diputuskan di sini. |

## 2. Platform

- iOS, Android, dan Web lewat Expo. Mobile first; Web diuji untuk fitur yang didukung library dan browser.
- Satu komponen harus berjalan di tiga platform. Tidak ada berkas `.web.tsx` khusus.
- Safe area wajib, layout memakai flexbox, tanpa overflow horizontal.
- Konten dibatasi 720dp dan ditengahkan di tablet.

## 3. Arah visual navy

`[TERKONFIRMASI]` Bahasa visual navy dari `docs/design-references/flows/*` dan `docs/design-references/full-overview.png` menggantikan arah Apple.

Ciri yang diambil dari referensi:

| Aspek | Aturan |
|---|---|
| Kanvas | Terang. Gelap bukan default. |
| Permukaan | Lavender muda untuk blok info, field, dan kartu terpilih. |
| Aksi utama | Satu tombol navy pill, tinggi 56dp. |
| Aksi sekunder | Outline dengan warna aksi, bukan pill terisi kedua. |
| Aksi destruktif | Merah terisi hanya pada konfirmasi. Aksi destruktif inline memakai teks merah. |
| Header | Wordmark, lonceng dengan titik notifikasi, dan pill peran. |
| Baris meta | Setiap baris informasi penting didampingi ikon. |
| Status | Badge berbasis teks. Warna hanya penguat, bukan satu-satunya pembeda. |
| Navigasi | Tab mengambang berbentuk pill kaca, dengan kapsul abu di belakang ikon dan label tab aktif. Bar menimpa konten dan hanya tampil di layar utama tab; layar detail menyembunyikannya. Label tab belum final. |

`[TERKONFIRMASI]` Hex navy `#172554`. Nilai ini dipakai pada `primary` mode terang dan pada `loginInk`.

| Token | Nilai | Catatan |
|---|---|---|
| `primary` terang | `#172554` | Aksi utama, tautan, fokus |
| `primary` gelap | `#2997ff` | Mode gelap belum diputuskan, nilai lama dipertahankan |
| `loginInk` | `#172554` | Teks dan CTA layar auth |

Kanal RGB di `src/global.css` sudah disamakan dengan nilai ini.

### 3.1 Rujukan per pola

| Berkas | Pola yang diambil |
|---|---|
| `flows/01-login.png` | Kanvas putih, field lavender, CTA navy, pemilih peran berbentuk kartu |
| `flows/02-session-schedule-detail.png` | Header wordmark dan pill peran, headline dua baris, strip tanggal, baris meta berikon, CTA navy dan outline |
| `flows/05-attendance-confirmations.png` | Bottom sheet konfirmasi dengan fakta validasi, layar sukses dengan ikon |
| `flows/06-attendance-history.png` | Baris riwayat dengan badge status dan pemisah |
| `flows/09-permission-review.png` | Dropdown kategori dan status, kartu pengajuan, sheet setujui dan tolak |
| `flows/10-permission-summary.png` | Pemilih sesi, tiga angka besar, daftar peserta |
| `flows/13-empty-schedule.png` | State kosong, state gagal dengan tombol coba lagi, skeleton memuat |

## 4. Token

### 4.1 Prinsip

- `src/constants/tokens.js` adalah sumber tunggal nilai. `src/constants/theme.ts` hanya re-export bertipe. `tailwind.config.js` membaca token yang sama.
- Warna, jarak, radius, dan tipografi ditulis lewat class token. Dilarang hex langsung dan dilarang arbitrary value seperti `p-[13px]` atau `text-[#123456]`.
- Nilai baru ditambahkan ke `tokens.js`, bukan ditulis di komponen.
- Perubahan `global.css` dan `tailwind.config.js` dikoordinasikan dengan P1.

### 4.2 Lapisan token

1. **Primitif:** ramp navy, ramp netral, hue status. Basis navy `#172554` sudah ditetapkan; ramp turunan dan ramp netral belum.
2. **Semantik:** dipakai komponen dan layar. Nama mengikuti `tokens.js`.
3. **Komponen:** tinggi, padding, dan radius per komponen.

### 4.3 Warna semantik

Nilai di bawah adalah nilai yang berlaku hari ini. Bila berbeda, `tokens.js` yang menang.

| Token | Terang | Gelap | Pemakaian |
|---|---|---|---|
| `text` | `#1d1d1f` | `#f5f5f7` | Teks utama |
| `textSecondary` | `#6e6e73` | `#cccccc` | Teks sekunder |
| `textInverse` | `#ffffff` | `#1d1d1f` | Teks di atas warna aksi terisi |
| `background` | `#ffffff` | `#000000` | Latar layar |
| `backgroundElement` | `#ffffff` | `#272729` | Kartu dan sheet |
| `backgroundSelected` | `#e8e8ed` | `#2a2a2c` | Baris terpilih, permukaan bertinta |
| `surfaceMuted` | `#f1f5f9` | `#1f2228` | Permukaan kartu dan blok info |
| `border` | `#d2d2d7` | `#3a3a3c` | Garis dan border |
| `primary` | `#172554` | `#2997ff` | Aksi utama, tautan, fokus |
| `primaryText` | `#ffffff` | `#00131f` | Label di atas `primary` |
| `success` | `#248a3d` | `#30d158` | Status dibuka, feedback sukses |
| `successSurface` | `#e4f5ec` | `#10291e` | Latar badge sukses |
| `warning` | `#b25000` | `#ff9f0a` | Status belum dibuka |
| `warningSurface` | `#fff4e0` | `#2b2213` | Latar badge peringatan |
| `danger` | `#d70015` | `#ff453a` | Error dan aksi destruktif |
| `dangerSurface` | `#fdecea` | `#2e1715` | Latar badge bahaya |
| `overlay` | `#000000` | `#000000` | Scrim modal, alpha diatur komponen |
| `loginBackground` | `#ffffff` | `#ffffff` | Kanvas layar auth |
| `loginInk` | `#172554` | `#172554` | Teks dan CTA navy di layar auth |
| `loginMuted` | `#5f6880` | `#5f6880` | Teks sekunder layar auth |
| `loginField` | `#f1f4f8` | `#f1f4f8` | Field lavender di layar auth |

### 4.4 Slot baru yang belum bernilai

Semua `[TERBUKA]`. Jangan dipakai sebelum masuk `tokens.js`.

| Slot | Pemakaian |
|---|---|
| `chip`, `chipSelected` | Chip filter dan pemilih kategori |
| `notificationDot` | Titik notifikasi pada ikon lonceng |
| `focusRing` | Cincin fokus keyboard di Web |
| `statusOngoing`, `statusUpcoming`, `statusDone` | Kosakata status sesi |
| `statusPresent`, `statusPermission`, `statusAbsent` | Kosakata kehadiran dan izin |
| Permukaan tiap status | Pasangan tone dan latar, wajib lolos kontras |

### 4.5 Tipografi

- Keluarga font memakai font sistem. Tidak ada dependency font eksternal; menambah font memerlukan persetujuan.
- Ukuran dan line-height dalam dp.

| Token | Ukuran / baris | Pemakaian |
|---|---|---|
| `caption` | 13 / 18 | Label, badge, keterangan |
| `small` | 15 / 20 | Meta dan teks pendukung |
| `body` | 17 / 24 | Teks isi |
| `subtitle` | 22 / 26 | Judul kartu besar |
| `title` | 28 / 36 | Judul layar |
| `display` | 34 / 40 | Judul landing |
| `authTitle` | 30 / 38 | Judul layar auth |
| `authBody` | 15 / 21 | Teks bantu layar auth |
| `authButton` | 16 / 24 | Label tombol layar auth |

`[TERBUKA]` Skala final dan keluarga font dari Figma. Referensi memakai headline yang lebih rapat daripada default sistem, jadi token `letterSpacing` (`rapat`, `normal`, `lebar`) disiapkan sebagai struktur, nilainya belum ditetapkan.

### 4.6 Spacing, radius, elevasi

| Token spacing | Nilai | Pemakaian |
|---|---|---|
| `half` | 2dp | Koreksi tipografis |
| `one` | 4dp | Jarak dalam komponen |
| `two` | 8dp | Jarak antar elemen kecil |
| `twoHalf` | 12dp | Jarak antar kartu |
| `three` | 16dp | Padding kartu dan layar |
| `four` | 24dp | Padding blok |
| `five` | 32dp | Jarak antar bagian |
| `six` | 64dp | Jarak besar |

| Token radius | Nilai | Pemakaian |
|---|---|---|
| `sm` | 8dp | Elemen kecil |
| `md` | 12dp | Input dan dropdown |
| `lg` | 16dp | Kartu |
| `authCard` | 20dp | Kartu layar auth |
| `xl` | 24dp | Bottom sheet |
| `pill` | 999dp | Tombol dan badge |

Elevasi: satu shadow untuk dropdown profil, bottom sheet, dan navbar mengambang. Kartu tidak memakai shadow. Arah navy tidak menambah shadow kartu.

## 5. Komponen

### 5.1 Sudah ada di `main`

| Komponen | Perilaku |
|---|---|
| `AppButton` | Varian `primary`, `secondary`, `ghost`, `danger`, `dangerFilled`, `auth`. Ukuran `sm` dan `md` 44dp, `lg` 56dp (default). Mendukung `fullWidth`, `loading`, dan `disabledReason`. |
| `Card` | Tone `default` (border dan permukaan) dan `muted` (`surfaceMuted` tanpa border). Tanpa shadow. |
| `Screen` | Safe area dan padding layar. |
| `Banner` | Feedback sukses dan gagal. |
| `BottomSheet` | Konfirmasi dengan handle, tinggi maksimal 85%, dan aksi di bawah. |
| `ProfileMenu` | Dropdown identitas dan aksi akun. |
| `HomeButton` | Tombol kembali ke beranda. |
| `StatusBadge` | Tiga status sesi dengan label teks, plus peta tone tambahan tanpa mengubah kosakata status. |
| `EmptyState` | Kondisi kosong dengan judul, deskripsi, ikon opsional, `tone="gagal"`, dan slot aksi untuk coba lagi. |
| `TextField` | Varian `default` dan `auth`, `error`, toggle kata sandi, `helper`, dan penghitung karakter. |
| `Skeleton` | Placeholder memuat yang menghormati reduce motion. |
| `SectionHeader` | Judul bagian dengan aksi opsional. |
| `IconButton` | Tombol ikon 44dp dengan label aksesibilitas. |
| `FilterSelect` | Tombol filter dengan menu dropdown, dipakai untuk status dan kategori pengajuan izin. |

Aturan penting: `danger` adalah aksi destruktif inline (teks merah). `dangerFilled` adalah aksi destruktif pada konfirmasi (merah terisi). Jangan menukar keduanya.

### 5.2 Aturan komponen

- Target sentuh minimal 44dp.
- Tombol ikon wajib punya `accessibilityLabel`.
- State nonaktif wajib punya alasan yang terlihat.
- Tidak ada loading palsu. Teks memuat dipakai hanya bila memang menunggu data.
- Komponen presentasional menerima props. Route tetap tipis dan hanya memanggil hook.

## 6. Aksesibilitas

- Kontras teks minimal 4.5:1 untuk teks normal dan 3:1 untuk teks besar.
- Status tidak boleh dibedakan hanya lewat warna. Selalu ada teks.
- Dynamic type didukung sampai sekitar 1.3x tanpa teks terpotong.
- Semua kontrol interaktif punya label aksesibilitas.
- Fokus keyboard di Web harus terlihat. Token `focusRing` masih `[TERBUKA]`.
- Hormati reduce motion.

## 7. Motion

- Motion hanya untuk membuka bottom sheet dan dropdown, sekitar 150 sampai 200ms.
- Tidak ada parallax, autoplay, animasi dekoratif, atau animasi template.
- Saat reduce motion aktif, animasi dilewati dan elemen langsung tampil pada posisi akhir.

## 8. State standar

Setiap layar yang membaca data wajib punya empat state:

| State | Isi |
|---|---|
| Memuat | Skeleton atau teks memuat yang jelas |
| Gagal | Pesan yang bisa dipahami dan tombol coba lagi bila tersedia |
| Kosong | Judul, penjelasan, dan aksi bila relevan |
| Sukses | Feedback singkat, tidak menutupi konten |

State tambahan: nonaktif dengan alasan, dan kondisi tanpa peran atau tanpa akses.

## 9. Pola layar

- **Landing:** wordmark, satu headline, satu paragraf, tombol **Masuk**, lalu ringkasan dua peran. Tanpa statistik, testimoni, atau logo palsu.
- **Login dan daftar:** kanvas terang, field lavender, CTA navy 56dp nonaktif sampai form valid, banner error di atas tombol.
- **Jadwal:** headline dua baris, tanggal, strip hari, kartu tautan peta, kartu sesi dengan jam, status, dan lokasi.
- **Detail sesi:** judul, badge status, baris meta berikon, penjelasan sesi, lalu area aksi. Tombol nonaktif disertai alasan.
- **Profil:** identitas, peran, aksi beranda, dan keluar akun dengan gaya bahaya.
- **Rekap:** ringkasan angka di atas, daftar peserta di bawah, urut waktu.
- **Izin:** daftar dengan filter status dan kategori, detail pengajuan, keputusan lewat sheet.
- **Kelas:** kartu kelas ringkas, aksi kelola peserta dan sesi, pencarian peserta.

## 10. Larangan

- Dilarang memakai warna hardcode atau arbitrary value.
- Dilarang gradient dekoratif, glassmorphism, dan shadow pada kartu.
- Pengecualian glassmorphism: hanya navbar mengambang yang boleh memakai kaca, karena satu-satunya elemen yang benar-benar mengapung di atas konten. Kartu, sheet, dropdown, dan tombol tetap solid. Keputusan pemilik produk, 2026-11-22.
- Dilarang membuat tombol atau tautan yang tidak punya tujuan nyata.
- Dilarang menduplikasi state sesi, presensi, atau autentikasi di layar. Sumber data tetap hook dan store.
- Dilarang mengubah kosakata status atau label tab tanpa keputusan PM.

## 11. TBD

| Item | Status | Pemilik keputusan |
|---|---|---|
| Type scale dan keluarga font final | TBD | PM dan Figma |
| Mekanisme dark mode (`class` atau `media`) | TBD | P1 |
| Scope dark mode | TBD | PM |
| Kosakata status | TBD | PM |
| Label tab navigasi | TBD | PM |

## 12. Peta rujukan baris lama

Dokumen lama dikutip per nomor baris dari kode. Setelah penyusunan ulang, rujukan itu diganti dengan nama bagian:

| Berkas | Kutipan lama | Bagian pengganti |
|---|---|---|
| `src/components/ui/shadow-style.ts:5` | baris 591 | 4.6 Spacing, radius, elevasi |
| `src/constants/theme.ts:47` | baris 596 | 2 Platform |
| `src/components/ui/status-badge.tsx:10` | baris 615 | 6 Aksesibilitas |
| `src/components/ui/status-badge.tsx:9` | baris 617 | 6 Aksesibilitas |
| `src/components/ui/motion.ts:4` | baris 618 | 7 Motion |

## 13. Riwayat dokumen

| Waktu | Perubahan |
|---|---|
| Sprint 1 | Dokumen arah desain disusun dari analisis Apple.com. |
| Sprint 3, Phase 1.5 | Amandemen navy ditambahkan tanpa menghapus analisis lama, agar rujukan baris tetap sah. |
| Sprint 3, D0 | Dokumen disusun ulang. Spesifikasi visual Apple dihapus, prinsip teknis dipertahankan, navy menjadi arah utama, TBD ditandai. |
| Sprint 3, 2026-11-22 | Navbar mengambang memakai kaca native iOS 26 dengan fallback translusen; pengecualian sempit pada larangan glassmorphism. |
