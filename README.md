# AntarMuka

**Antar Praktikum** — aplikasi catatan kehadiran praktikum untuk praktikan dan asisten.

Sprint 1 berfokus pada **UI** dengan data dummy dan state lokal (belum ada database). Dua sudut pandang pengguna:

- **Praktikan** — lihat jadwal & detail sesi, melakukan presensi saat sesi dibuka, melihat riwayat kehadiran sendiri.
- **Asisten** — lihat jadwal, membuka & menutup sesi, memantau kehadiran, melihat rekap peserta beserta waktu presensi.

## Demo sprint 1

1. Pilih peran **Asisten** → buka salah satu sesi berstatus *Belum dibuka*.
2. Pindah ke peran **Praktikan** → sesi tampil *Dibuka* → tekan **Presensi** → konfirmasi di bottom sheet.
3. Presensi berhasil (waktu tercatat, tombol berubah jadi *Sudah presensi*). Coba lagi → ditolak.
4. Pindah ke **Asisten** → buka rekap sesi → peserta + waktu kehadiran tampil.
5. Asisten menutup sesi → status berubah di kedua sisi.

## Menjalankan

Prasyarat: Node.js LTS dan aplikasi Expo Go di perangkat, atau simulator/emulator.

```bash
npm install
npx expo start
```

Lalu tekan `i` (iOS), `a` (Android), atau `w` (web). Proyek ini memakai npm (`package-lock.json`).

Perintah lain:

```bash
npx expo lint      # lint
npx tsc --noEmit   # typecheck
npx expo-doctor    # cek dependency & config
```

Menambah library wajib lewat `npx expo install <paket>` dan **harus disetujui PM**.

## Stack

- Expo SDK 58 + React Native 0.88, React 19
- Expo Router (file-based routing, typed routes)
- TypeScript strict
- Tanpa database, tanpa auth, tanpa state library eksternal — data dummy + React state/context

## Struktur folder

```
src/
  app/                     # route saja (screen + _layout)
    _layout.tsx            # root Stack + provider
    index.tsx              # pilih peran & identitas
    (praktikan)/           # tab praktikan
    (asisten)/             # tab asisten
  components/
    ui/                    # komponen reusable (Button, Card, Badge, EmptyState, BottomSheet)
  features/
    praktikan/             # komponen & hook khusus praktikan
    asisten/               # komponen & hook khusus asisten
  types/                   # tipe domain
  data/                    # data dummy
  store/                   # state sesi & presensi (context)
  constants/theme.ts       # token warna, font, spacing
```

Non-route code tidak boleh ditaruh di `src/app/`.

## Peran dalam tim

| Kode | Peran | Area |
|---|---|---|
| PM | Product Manager | docs, backlog, QA, demo |
| P1 | Programmer | navigasi shell + alur praktikan |
| P2 | Programmer | alur asisten |
| P3 | Programmer | design system + data/state |

Matriks ownership file ada di [`docs/PEMBAGIAN-TUGAS.md`](docs/PEMBAGIAN-TUGAS.md). Patuhi `CODEOWNERS`: satu path hanya boleh diubah pemiliknya.

## Dokumentasi

- [`docs/PRD.md`](docs/PRD.md) — kebutuhan, acceptance criteria, peta layar, demo script
- [`docs/PEMBAGIAN-TUGAS.md`](docs/PEMBAGIAN-TUGAS.md) — pembagian kerja & kontrak data
- [`docs/GIT-WORKFLOW.md`](docs/GIT-WORKFLOW.md) — branch, commit, PR, review, merge
- [`AGENTS.md`](AGENTS.md) — aturan kerja untuk developer & AI agent

## Non-goals sprint 1

Backend/database, autentikasi, notifikasi push, presensi berbasis QR/lokasi, multi-semester, export laporan.
