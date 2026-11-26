
# PraktikumKU

Aplikasi catatan kehadiran praktikum untuk praktikan dan asisten.

Aplikasi ini berjalan di **iOS, Android, dan Web** dari satu codebase Expo.

Pengembangan aplikasi dilakukan melalui empat sprint:

- **Sprint 1:** Pengembangan UI, navigasi, dan alur dasar aplikasi menggunakan data dummy.
- **Sprint 2:** Integrasi Firebase Authentication, Cloud Firestore, dan pengajuan izin dengan klasifikasi AI.
- **Sprint 3:** Pengembangan presensi berbasis lokasi dan QR Code, Maps, serta push notification.
- **Sprint 4:** Integrasi data dinamis Firebase, pengelolaan akun berdasarkan role, seed data, dan Firestore Security Rules.

Saat ini fokus pengembangan berada pada implementasi Sprint 4, yaitu memastikan autentikasi, pengelolaan data, dan hak akses pengguna terintegrasi dengan Firebase.

## Akun Demo Sprint 4

Aplikasi menyediakan tiga jenis akun untuk pengujian berdasarkan role pengguna, yaitu Praktikan, Asprak, dan Aslab.

Berikut akun yang dapat digunakan untuk mencoba aplikasi:

### Praktikan

**Jumlah akun:** 20 akun

| Nama | Email | Password |
|---|---|---|
| Aditya Pratama | `aditya@praktikumku.test` | `praktikan123` |

### Asprak

**Jumlah akun:** 8 akun

| Nama | Email | Password |
|---|---|---|
| Raka Pradana | `raka@praktikumku.test` | `asprak123` |

### Aslab

**Jumlah akun:** 4 akun

| Nama | Email | Password |
|---|---|---|
| Arman Setiawan | `arman@praktikumku.test` | `aslab123` |

**Informasi akun:**

- Login menggunakan email dan password melalui Firebase Authentication.
- Setiap akun memiliki hak akses sesuai role masing-masing.
- Total tersedia 32 akun testing.
- Akun merupakan data sintetis untuk keperluan pengujian.

**Firebase Development Project ID:** `praktikumku-dcfc0`

Akun tambahan untuk setiap role dapat dilihat pada `data/seed-data.json`.

> Catatan: Gunakan akun tersebut pada konfigurasi Firebase Development, bukan Production.

## Menjalankan

Prasyarat: Node.js LTS dan aplikasi Expo Go di perangkat, atau simulator/emulator.

```bash
npm install
npx expo start
```

Lalu tekan `i` (iOS) atau `a` (Android). Untuk web: `npx expo start --web`.

Proyek ini memakai npm (`package-lock.json`).

Perintah lain:

```bash
npx expo lint      # lint
npx tsc --noEmit   # typecheck
npx expo-doctor    # cek dependency & config
```

Menambah library lewat `npx expo install <paket>` dan dikoordinasikan dengan PM; perubahan dependency dijelaskan di deskripsi PR (`docs/GIT-WORKFLOW.md`).

## Stack

- Target platform: iOS, Android, dan Web.
- Expo SDK 58 + React Native 0.88, React 19.
- Expo Router (file-based routing, typed routes, `Stack.Protected` untuk auth guard).
- TypeScript strict.
- NativeWind 4 (Tailwind CSS 3) untuk styling, token terpusat di `src/constants/tokens.js`.
- Firebase Authentication untuk autentikasi pengguna.
- Cloud Firestore untuk penyimpanan dan sinkronisasi data.
- Firebase Admin SDK untuk administrasi dan seed data.
- Firebase Cloud Messaging untuk push notification.
- Jest dan Firebase Emulator untuk pengujian Security Rules.

### Ringkasan Pengembangan Sprint

**Sprint 2 — Firebase Authentication & Cloud Firestore**

Mengintegrasikan autentikasi pengguna dan penyimpanan data menggunakan Firebase. Sprint ini juga mencakup pengembangan pengajuan izin praktikan dengan klasifikasi AI.

**Sprint 3 — Location, QR Code & Notification**

Mengembangkan mekanisme presensi berbasis lokasi dan QR Code, integrasi Maps, serta push notification.

**Sprint 4 — Firebase Dynamic Data & Security**

Menjadi fokus implementasi saat ini, meliputi:

- Integrasi Firebase Authentication untuk tiga role pengguna.
- Pengelolaan data dinamis menggunakan Cloud Firestore.
- Sinkronisasi profil pengguna, kelas, dan sesi praktikum.
- Pengelolaan dataset seed untuk Development.
- Firestore Security Rules berdasarkan autentikasi dan role.
- Backup dan pengelolaan data Firebase Development.
- Pengujian Security Rules menggunakan Firebase Emulator dan Jest.

## Struktur folder

```text
src/
  app/                     # route saja (screen + _layout)
    _layout.tsx            # root Stack, provider, auth guard
    index.tsx              # landing page publik
    login.tsx              # halaman login
    (praktikan)/           # tab praktikan
    (asisten)/             # tab asisten
  components/
    ui/                    # komponen reusable (Button, Card, Badge, EmptyState, BottomSheet, ProfileMenu, HomeButton, TextField)
  features/
    auth/                  # komponen & hook autentikasi
    praktikan/             # komponen & hook praktikan
    asisten/               # komponen & hook asisten
  types/                   # tipe domain
  data/                    # data aplikasi
  store/                   # state dan pengelolaan data
  constants/               # token desain

data/
  seed-data.json           # dataset seed Sprint 4

scripts/
  seed.js                  # Firebase seed importer
  backup-development.js    # backup Firestore Development

tests/
  firestore.rules.test.js  # pengujian Firestore Security Rules

docs/
  database/                # dokumentasi database
  references/              # referensi teknis
  sprints/                 # dokumentasi setiap sprint

firestore.rules             # Firestore Security Rules
firebase.emulator.json      # konfigurasi Firebase Emulator
README.md
README-seed.md
```

Non-route code tidak boleh ditaruh di `src/app/`.

## Styling

Styling memakai **NativeWind 4** (Tailwind CSS 3). Komponen JSX memakai `className`:

```tsx
<View className="flex-1 bg-background p-three">
  <Text className="text-body font-semibold text-primary">Jadwal</Text>
</View>
```

- Arah visual mengikuti analisis Apple di [`docs/design.md`](docs/design.md), dengan adaptasi mobile yang dicatat di dokumen desain.
- Token desain: [`src/constants/tokens.js`](src/constants/tokens.js), sumber tunggal, dibaca `tailwind.config.js` dan di-re-export oleh `src/constants/theme.ts`.
- `src/global.css` diimpor sekali di `src/app/_layout.tsx`; berisi directive Tailwind + CSS variable warna untuk dark mode.
- Dilarang hardcode warna dan dilarang arbitrary value (`p-[13px]`, `text-[#123456]`).

## Peran dalam tim

Pembagian peran dapat berubah pada setiap sprint sesuai kebutuhan pengembangan.

| Kode | Peran | Area |
|---|---|---|
| PM | Product Manager | docs, backlog, QA, demo |
| P1 | Programmer | navigasi shell, landing, login, auth guard, alur praktikan |
| P2 | Programmer | alur asisten |
| P3 | Programmer | design system, data, state, komponen UI bersama |

Matriks ownership file ada di [`docs/PEMBAGIAN-TUGAS.md`](docs/PEMBAGIAN-TUGAS.md). Patuhi `CODEOWNERS`: satu path hanya boleh diubah pemiliknya.

## Dokumentasi

- [`docs/PRD.md`](docs/PRD.md): kebutuhan, acceptance criteria, peta layar, demo script.
- [`docs/PEMBAGIAN-TUGAS.md`](docs/PEMBAGIAN-TUGAS.md): pembagian kerja & kontrak data.
- [`docs/sprints/sprint-2.md`](docs/sprints/sprint-2.md): ringkasan pengembangan Firebase Authentication, Firestore, dan izin dengan AI.
- [`docs/sprints/sprint-3.md`](docs/sprints/sprint-3.md): ringkasan presensi lokasi dan QR, Maps, serta push notification.
- [`docs/sprints/sprint-4.md`](docs/sprints/sprint-4.md): implementasi Firebase dinamis, seed data, dan Security Rules.
- [`docs/GIT-WORKFLOW.md`](docs/GIT-WORKFLOW.md): branch, commit, PR, review, merge.
- [`docs/design.md`](docs/design.md): referensi visual Apple dan catatan adaptasi mobile iOS/Android.
- [`docs/database/`](docs/database/): dokumentasi struktur dan migrasi Firestore.
- [`README-seed.md`](README-seed.md): panduan seed dan backup Firebase Development.
- [`AGENTS.md`](AGENTS.md): aturan kerja untuk developer & AI agent.

## Seed Data Sprint 4

Seed data digunakan untuk menyiapkan akun Firebase Authentication dan dokumen Firestore pada environment Development.

Dataset mencakup:

- 20 akun Praktikan.
- 8 akun Asprak.
- 4 akun Aslab.
- 4 mata kuliah.
- 4 kelas.
- 4 laboratorium.
- 8 sesi praktikum.

Script seed tersedia pada `scripts/seed.js`.

Fitur seed:

- Validasi dataset sebelum import.
- Pembuatan atau sinkronisasi akun Firebase Authentication.
- Pembuatan dan pembaruan dokumen Firestore.
- Penggunaan UID Authentication sebagai Document ID pada collection `users`.
- Validasi NIM sebagai String dengan tepat 14 digit.
- Pembersihan indeks `nomorInduk` yatim yang UID-nya tidak memiliki dokumen `users`.
- Pembuatan otomatis field `dibuatPada` pada dokumen kelas baru.
- Mempertahankan akun Authentication dan profil pengguna yang sudah tersedia.

Script menggunakan mode dry-run secara default. Backup harus dilakukan sebelum menjalankan import.

Panduan lengkap tersedia pada [`README-seed.md`](README-seed.md).

## Firebase Security Rules

Firestore Security Rules digunakan untuk membatasi akses berdasarkan autentikasi, role, dan relasi pengguna.

Pengujian dilakukan menggunakan Firebase Emulator dan Jest.

Skenario pengujian awal Sprint 4:

1. Praktikan dapat membaca profil sendiri.
2. Praktikan tidak dapat mengubah role sendiri.
3. Akun tanpa profil tidak dapat membaca kelas.
4. Praktikan terdaftar dapat membaca kelas.
5. Praktikan di luar kelas tidak dapat membaca kelas.

Hasil pengujian awal: **5/5 test passed**.

Jalankan pengujian dengan:

```powershell
$env:RULES_FILE="firestore.rules"

npx firebase emulators:exec --only firestore --project demo-praktikumku --config firebase.emulator.json "npx jest tests/firestore.rules.test.js --runInBand"
```

## Non-goals

Fitur yang belum termasuk dalam cakupan implementasi Sprint 4 perlu mengikuti backlog dan acceptance criteria sprint terkait.

Pengembangan selanjutnya harus mempertahankan kompatibilitas struktur database, hak akses, serta fitur yang telah dikembangkan pada sprint sebelumnya.
