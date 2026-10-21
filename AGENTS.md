This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Project: AntarMuka (AntarPraktikum)

Sistem informasi praktikum untuk mencatat kehadiran, dengan 2 peran: **praktikan** dan **asisten**. Sprint 1 fokus UI; data dummy + state in-memory, tanpa backend/auth/database.

Baca sebelum mengubah kode:

- `docs/PRD.md` — kebutuhan dan acceptance criteria
- `docs/PEMBAGIAN-TUGAS.md` — pemilik setiap path
- `docs/GIT-WORKFLOW.md` — branch, commit, PR

## Ownership (wajib)

| Path | Owner |
|---|---|
| `src/app/_layout.tsx`, `src/app/index.tsx`, `src/app/(praktikan)/**`, `src/features/praktikan/**` | P1 |
| `src/app/(asisten)/**`, `src/features/asisten/**` | P2 |
| `src/constants/theme.ts`, `src/types/**`, `src/data/**`, `src/store/**`, `src/components/ui/**` | P3 |
| `README.md`, `docs/**`, `AGENTS.md`, `.github/**` | PM |

- Satu path satu owner. Perubahan di path orang lain hanya lewat PR ke owner tersebut.
- File beku setelah D1 (jangan diubah tanpa persetujuan owner): `src/app/_layout.tsx`, `src/constants/theme.ts`, `src/types/index.ts`, `src/components/ui/index.ts`.
- Jangan menambah dependency tanpa persetujuan PM.
- Jangan membuat file sementara di area orang lain.

## Aturan implementasi

- **Route:** `src/app/**` hanya berisi screen dan `_layout.tsx`. Komponen, hook, util di luar `src/app/`. Gunakan `Tabs` dari `expo-router` untuk tab di dalam route group; jangan pakai `NativeTabs` untuk group bersarang.
- **Layar:** pisahkan presentational component (menerima props) dari route file (memanggil hook store). Route file harus tipis.
- **State:** satu sumber kebenaran di `src/store/session-store.tsx`. Dilarang menduplikasi state sesi/presensi secara lokal di layar. Mutasi hanya lewat aksi store (`bukaSesi`, `tutupSesi`, `catatPresensi`).
- **Data:** dummy di `src/data/`, tipe di `src/types/`. Jangan invent field baru di layar; kontrak dibekukan setelah D1.
- **Styling:** NativeWind (Tailwind CSS) untuk komponen JSX. Token desain ada di `src/constants/tokens.js` — satu-satunya sumber nilai, dibaca oleh `tailwind.config.js` dan di-re-export bertipe oleh `src/constants/theme.ts`. Dilarang hardcode warna/ukuran font dan dilarang arbitrary value (`p-[13px]`, `text-[#123456]`). Layout wajib flexbox + safe area; target sentuh minimal 44×44 pt.
- **Interaksi:** konfirmasi perubahan status/presensi lewat modal atau bottom sheet; setiap aksi memberi feedback sukses/gagal; tombol nonaktif harus punya alasan yang terlihat.
- **Empty state:** wajib untuk daftar kosong, rekap kosong, dan riwayat kehadiran kosong.
- **Aksesibilitas:** semua tombol punya `accessibilityLabel`; teks status tidak hanya dibedakan lewat warna.

## Verifikasi sebelum selesai

```bash
npx tsc --noEmit
npx expo lint
```

Keduanya harus hijau, dan alur demo di `docs/PRD.md` bagian 12 (Testing dan demo script) harus tetap berjalan. PR wajib memakai `.github/pull_request_template.md`.

## Skills

Install sekali dari skills.sh (butuh `npx`), lalu gunakan sesuai area:

| Skill | Install | Untuk |
|---|---|---|
| `expo-router` | `npx skills add https://github.com/expo/skills --skill expo-router` | struktur route, tab, modal/form sheet |
| `expo-design-system` | `npx skills add https://github.com/expo/skills --skill expo-design-system` | token & komponen reusable (P3) |
| `building-native-ui` | `npx skills add https://github.com/expo/skills --skill building-native-ui` | list, bottom sheet, safe area, HIG |
| `vercel-react-native-skills` | `npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-native-skills` | performa list, `Pressable`, `expo-image` |
| `to-spec` | `npx skills add https://github.com/mattpocock/skills --skill to-spec` | menyusun PRD/spec (PM) |
| `code-review` | `npx skills add https://github.com/mattpocock/skills --skill code-review` | review PR |
| `resolving-merge-conflicts` | `npx skills add https://github.com/mattpocock/skills --skill resolving-merge-conflicts` | konflik merge |
| `find-skills` | `npx skills add https://github.com/vercel-labs/skills --skill find-skills` | mencari skill baru |

Jangan install `native-data-fetching` (data dummy) atau `git-guardrails-claude-code` (hook khusus Claude Code). `expo-tailwind-setup` tidak diperlukan karena proyek sudah memakai NativeWind secara manual (lihat `tailwind.config.js`, `babel.config.js`, `metro.config.js`).

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Styling dengan NativeWind

- Semua komponen JSX memakai prop `className` berisi utility Tailwind. `StyleSheet.create` hanya untuk nilai dinamis yang tidak bisa jadi class (mis. `tintColor` dari store) atau animasi.
- `src/global.css` **wajib** diimpor sekali di `src/app/_layout.tsx`. Tanpa import ini tidak ada utility class yang dihasilkan.
- Token desain: `src/constants/tokens.js` (sumber tunggal) → `tailwind.config.js` (utility) dan `src/constants/theme.ts` (re-export bertipe). Jangan menulis nilai desain di tempat lain.
- Token warna memakai CSS variable `--color-<nama>` di `src/global.css`; dark mode mengikuti `prefers-color-scheme` (`darkMode: 'media'`). Bila mengubah nilai warna di `tokens.js`, ubah channel RGB di `global.css` juga.
- Dilarang arbitrary value: `p-[13px]`, `text-[#123456]`, `bg-[#fff]`. Tambahkan token baru ke `tokens.js` bila memang perlu.
- Konfigurasi terkait: `babel.config.js` (`jsxImportSource: 'nativewind'`), `metro.config.js` (`withNativeWind`), `nativewind-env.d.ts` (tipe `className`). Jangan mengubah ketiganya tanpa persetujuan PM.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md
