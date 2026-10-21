# PraktikumKU

Aplikasi catatan kehadiran praktikum untuk praktikan dan asisten.

Aplikasi ini **mobile-only untuk iOS dan Android**. Web bukan target rilis, bukan platform uji, dan bukan alasan untuk menambah komponen atau konfigurasi web.

Sprint 1 berfokus pada UI dengan data dummy, state lokal, dan autentikasi dummy (belum ada database). Pengguna masuk lewat landing page dan login, lalu diarahkan ke antarmuka sesuai peran. Dua sudut pandang pengguna:

- **Praktikan**: lihat jadwal dan detail sesi, melakukan presensi saat sesi dibuka, melihat riwayat kehadiran sendiri.
- **Asisten**: lihat jadwal, membuka dan menutup sesi, memantau kehadiran, melihat rekap peserta beserta waktu presensi.

## Akun demo

| Username | Password | Peran |
|---|---|---|
| `ahmad` | `praktikan123` | Praktikan |
| `citra` | `praktikan123` | Praktikan |
| `eko` | `praktikan123` | Praktikan |
| `fani` | `praktikan123` | Praktikan |
| `budi` | `asisten123` | Asisten |
| `siti` | `asisten123` | Asisten |

Ketik username dan password secara manual. Halaman login tidak menyediakan kartu pengisi otomatis. Kredensial hanya data dummy dan tidak dipakai untuk autentikasi nyata.

## Demo sprint 1

1. Buka aplikasi. Landing page tampil. Tekan **Masuk**.
2. Login sebagai `budi` / `asisten123`. Aplikasi masuk ke tab asisten.
3. Buka salah satu sesi berstatus *Belum dibuka*, lalu tekan **Buka sesi** dan konfirmasi. Status berubah menjadi *Dibuka* dengan waktu buka.
4. Buka menu profil di header, pilih **Ganti peran (demo)** ke praktikan (Ahmad).
5. Sesi tampil *Dibuka* tanpa reload. Tekan **Presensi**, konfirmasi di bottom sheet. Jam kehadiran tercatat.
6. Coba presensi lagi pada sesi yang sama. Presensi ditolak dengan pesan jelas (AC-06).
7. Ganti peran kembali ke asisten (Budi). Buka rekap sesi. Peserta dan waktu kehadiran tampil.
8. Asisten menutup sesi. Status menjadi *Ditutup* dengan waktu tutup.
9. Ganti peran ke praktikan (Ahmad). Coba presensi pada sesi yang sudah ditutup. Presensi ditolak dengan feedback jelas (AC-07).
10. Buka profil, pilih **Keluar akun**, lalu konfirmasi. Landing page tampil. Login ulang sebagai `ahmad` / `praktikan123`. Sesi dan presensi yang dibuat sebelumnya masih ada selama aplikasi belum ditutup.

Konsistensi data lintas peran wajib saat berpindah peran dalam satu instance aplikasi (AC-12). Alur demo end-to-end diuji pada AC-15. Daftar acceptance criteria lengkap ada di [`docs/PRD.md`](docs/PRD.md).

## Menjalankan

Prasyarat: Node.js LTS dan aplikasi Expo Go di perangkat, atau simulator/emulator.

```bash
npm install
npx expo start
```

Lalu tekan `i` (iOS) atau `a` (Android). Proyek ini mobile-only dan memakai npm (`package-lock.json`).

Perintah lain:

```bash
npx expo lint      # lint
npx tsc --noEmit   # typecheck
npx expo-doctor    # cek dependency & config
```

Menambah library wajib lewat `npx expo install <paket>` dan **harus disetujui PM**.

## Stack

- Target platform: iOS dan Android (Expo Go, simulator, atau emulator)
- Expo SDK 58 + React Native 0.88, React 19
- Expo Router (file-based routing, typed routes, `Stack.Protected` untuk auth guard)
- TypeScript strict
- NativeWind 4 (Tailwind CSS 3) untuk styling, token terpusat di `src/constants/tokens.js`
- Tanpa database dan tanpa backend. Autentikasi dummy in-memory, data dummy, dan React state/context

## Struktur folder

```
src/
  app/                     # route saja (screen + _layout)
    _layout.tsx            # root Stack, provider, auth guard
    index.tsx              # landing page publik
    login.tsx              # login dummy
    (praktikan)/           # tab praktikan
    (asisten)/             # tab asisten
  components/
    ui/                    # komponen reusable (Button, Card, Badge, EmptyState, BottomSheet, ProfileMenu, HomeButton, TextField)
  features/
    auth/                  # komponen landing & login
    praktikan/             # komponen & hook khusus praktikan
    asisten/               # komponen & hook khusus asisten
  types/                   # tipe domain
  data/                    # data dummy + credentials.ts
  store/                   # state sesi, presensi, dan autentikasi (context)
  constants/theme.ts       # token warna, font, spacing
```

Non-route code tidak boleh ditaruh di `src/app/`.

## Styling

Styling memakai **NativeWind 4** (Tailwind CSS 3). Komponen JSX memakai `className`:

```tsx
<View className="flex-1 bg-background p-three">
  <Text className="text-body font-semibold text-primary">Jadwal</Text>
</View>
```

- Arah visual mengikuti analisis Apple di [`docs/design.md`](docs/design.md), dengan adaptasi mobile yang dicatat di dokumen desain. Analisis web di dokumen itu hanya referensi visual; target aplikasi tetap iOS dan Android.
- Token desain: [`src/constants/tokens.js`](src/constants/tokens.js), sumber tunggal, dibaca `tailwind.config.js` dan di-re-export oleh `src/constants/theme.ts`.
- `src/global.css` diimpor sekali di `src/app/_layout.tsx`; berisi directive Tailwind + CSS variable warna untuk dark mode.
- Dilarang hardcode warna dan dilarang arbitrary value (`p-[13px]`, `text-[#123456]`).

## Peran dalam tim

| Kode | Peran | Area |
|---|---|---|
| PM | Product Manager | docs, backlog, QA, demo |
| P1 | Programmer | navigasi shell, landing, login, auth guard, alur praktikan |
| P2 | Programmer | alur asisten |
| P3 | Programmer | design system, data, state, komponen UI bersama |

Matriks ownership file ada di [`docs/PEMBAGIAN-TUGAS.md`](docs/PEMBAGIAN-TUGAS.md). Patuhi `CODEOWNERS`: satu path hanya boleh diubah pemiliknya.

## Dokumentasi

- [`docs/PRD.md`](docs/PRD.md): kebutuhan, acceptance criteria, peta layar, demo script
- [`docs/PEMBAGIAN-TUGAS.md`](docs/PEMBAGIAN-TUGAS.md): pembagian kerja & kontrak data
- [`docs/GIT-WORKFLOW.md`](docs/GIT-WORKFLOW.md): branch, commit, PR, review, merge
- [`docs/design.md`](docs/design.md): referensi visual Apple dan catatan adaptasi mobile iOS/Android
- [`AGENTS.md`](AGENTS.md): aturan kerja untuk developer & AI agent

## Non-goals sprint 1

Backend/database, autentikasi nyata, registrasi, lupa password, persistensi login dan data setelah aplikasi ditutup, notifikasi push, presensi berbasis QR/lokasi, multi-semester, export laporan, serta aplikasi web/desktop.
