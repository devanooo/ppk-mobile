## Ringkasan

<!-- Apa yang berubah, 1-3 baris. -->

## Kenapa

<!-- Kebutuhan PRD nomor berapa / issue terkait. -->

## Cara tes

1.
2.

## Screenshot

| iOS | Android |
|---|---|
|  |  |

## Ceklis

- [ ] Hanya menyentuh path milik saya (lihat `CODEOWNERS`)
- [ ] `npx tsc --noEmit` hijau
- [ ] `npx expo lint` hijau
- [ ] Memakai `{ ok, pesan }` dari store untuk semua feedback; tidak menebak hasil aksi.
- [ ] Tidak ada state loading palsu pada operasi sinkron.
- [ ] Tidak ada warna hardcode atau arbitrary value (`p-[13px]`, `text-[#123456]`); semua dari token NativeWind
- [ ] Layout pakai flexbox + safe area
- [ ] Tidak menambah dependency tanpa approval PM
- [ ] Perubahan file beku (`_layout.tsx`, `tokens.js`, `theme.ts`, `types`, `ui/index.ts`, `credentials.ts`) sudah disetujui owner
- [ ] Auth memakai `Stack.Protected`; route publik dan route peran tidak saling bocor
- [ ] Logout tidak menghapus `sesi` atau `presensi`

Refs #
