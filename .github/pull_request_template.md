## Ringkasan

<!-- Apa yang berubah, 1-3 baris. -->

## Kenapa

<!-- Kebutuhan PRD nomor berapa / issue terkait. -->

## Cara tes

1.
2.

## Screenshot

| iOS | Android/Web |
|---|---|
|  |  |

## Ceklis

- [ ] Hanya menyentuh path milik saya (lihat `CODEOWNERS`)
- [ ] `npx tsc --noEmit` hijau
- [ ] `npx expo lint` hijau
- [ ] Memakai `{ ok, pesan }` dari store untuk semua feedback; tidak menebak hasil aksi.
- [ ] Tidak ada state loading palsu pada operasi sinkron.
- [ ] Tidak ada warna hardcode (pakai token di `src/constants/theme.ts`)
- [ ] Layout pakai flexbox + safe area
- [ ] Tidak menambah dependency tanpa approval PM
- [ ] Perubahan file beku (`_layout.tsx`, `theme.ts`, `types`, `ui/index.ts`) sudah disetujui owner

Refs #
