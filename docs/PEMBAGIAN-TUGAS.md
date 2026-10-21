# Pembagian Tugas — Sprint 1

Tujuan dokumen: setiap file punya **tepat satu pemilik**. Tidak ada dua orang mengedit path yang sama dalam satu sprint.

## 1. Tim

| Kode | Peran | Fokus |
|---|---|---|
| PM | Product Manager | backlog, PRD, QA matrix, review docs, demo |
| P1 | Programmer | navigasi shell + seluruh alur praktikan |
| P2 | Programmer | seluruh alur asisten |
| P3 | Programmer | design system, tipe, data dummy, store |

## 2. Matriks ownership

| Path | Owner | Keterangan |
|---|---|---|
| `src/app/_layout.tsx` | P1 | root Stack + provider store. **Beku setelah D1** |
| `src/app/index.tsx` | P1 | pilih peran + identitas |
| `src/app/(praktikan)/**` | P1 | tab, jadwal, detail, kehadiran |
| `src/features/praktikan/**` | P1 | komponen/hook khusus praktikan |
| `src/app/(asisten)/**` | P2 | tab, jadwal, detail, rekap |
| `src/features/asisten/**` | P2 | komponen/hook khusus asisten |
| `src/constants/theme.ts` | P3 | token warna/font/spacing. **Beku setelah D1** |
| `src/types/**` | P3 | tipe domain. **Beku setelah D1** |
| `src/data/**` | P3 | data dummy |
| `src/store/**` | P3 | context sesi & presensi |
| `src/components/ui/**` | P3 | primitif UI. **Beku setelah D1**, kecuali perbaikan via PR |
| `src/components/app-tabs.tsx`, `src/components/app-tabs.web.tsx` | P1 | dihapus/diganti saat scaffold |
| `README.md`, `docs/**`, `AGENTS.md` | PM | dokumentasi |
| `.github/**` | PM | CODEOWNERS, template PR |
| `app.json`, `package.json`, `tsconfig.json` | PM (approval) + P1 (eksekusi) | perubahan config harus disetujui PM |

Path yang tidak tercantum: **jangan disentuh** tanpa persetujuan PM.

## 3. Aturan anti-tabrakan

1. **Satu path satu owner.** Butuh perubahan di file orang lain → buka PR ke owner tersebut atau minta owner yang commit.
2. **Presentational vs route.** Komponen layar menerima props; file route hanya memanggil hook store dan merender komponen. Dengan begitu P1/P2 bisa bekerja sebelum store selesai.
3. **File beku D1:** `src/app/_layout.tsx`, `src/constants/theme.ts`, `src/types/index.ts`, `src/components/ui/index.ts`. Perubahan setelah beku harus lewat PR kecil ke owner.
4. **Dilarang membuat file baru** di area orang lain, termasuk file "sementara".
5. **Dilarang menambah dependency.** Usul ke PM; jika disetujui, `npx expo install` dijalankan P1.
6. Konflik merge di file beku → hubungi owner, jangan diselesaikan sendiri.

## 4. Kontrak data (dibuat P3, hari D1)

`src/types/index.ts` — salinan tipe dari `docs/PRD.md` bagian 9, tanpa tambahan field.
`src/data/dummy.ts` — 2 asisten + 4 praktikan + 5 sesi (2 `belum-dibuka`, 2 `dibuka`, 1 `ditutup`) + 2 presensi awal.
`src/store/session-store.tsx` — API minimal:

```ts
type Store = {
  user: User | null;
  sesi: Sesi[];
  presensi: Presensi[];
  setUser: (u: User | null) => void;
  bukaSesi: (sesiId: string) => void;
  tutupSesi: (sesiId: string) => void;
  catatPresensi: (sesiId: string, praktikanId: string) => { ok: boolean; pesan: string };
  presensiSaya: (praktikanId: string) => Presensi[];
  rekapSesi: (sesiId: string) => Array<{ praktikan: User; waktu: string }>;
  sudahPresensi: (sesiId: string, praktikanId: string) => boolean;
};
```

Aturan: `catatPresensi` menolak bila sesi tidak `dibuka` atau presensi sudah ada. Semua mutasi hanya lewat store — tidak ada state lokal duplikat di layar.

`src/components/ui/` minimal: `Screen`, `AppButton`, `Card`, `StatusBadge`, `EmptyState`, `BottomSheet`, `Field` (picker/teks), `Banner` (feedback). Diekspor lewat `index.ts`.

## 5. Timeline

| Hari | PM | P1 | P2 | P3 |
|---|---|---|---|---|
| D1 | install skills, finalkan PRD & backlog, siapkan CODEOWNERS | scaffold route + `index.tsx` + tab praktikan kosong; hapus `app-tabs*`; serahkan folder `(asisten)` ke P2 | baca PRD + kontrak, siapkan daftar komponen presentational yang dibutuhkan | tulis types, dummy, store, token, primitif UI; **freeze di akhir hari** |
| D2 | cek progres, unblock, review PR docs | layar jadwal + detail (presentational) | layar jadwal + detail asisten (presentational) | polish primitif + empty state, bantu wiring |
| D3 | QA matrix awal | alur presensi + bottom sheet + feedback | aksi buka/tutup sesi + rekap | dokumentasi komponen, review pemakaian token |
| D4 | review UI vs acceptance criteria | wiring store sisi praktikan | wiring store sisi asisten | perbaikan bug store/komponen |
| D5 | QA final, demo script, tag `sprint-1` | bugfix + rehearsal | bugfix + rehearsal | bugfix + rehearsal |

## 6. Definition of Done per orang

**P1**
- [ ] Root layout + pemilihan peran berjalan; tab praktikan muncul setelah masuk.
- [ ] Jadwal & detail praktikan sesuai F1; presensi sesuai F3 & F5.
- [ ] Bottom sheet konfirmasi + feedback sukses/gagal berfungsi.
- [ ] Empty state & status nonaktif punya alasan.

**P2**
- [ ] Tab asisten: jadwal, detail, rekap.
- [ ] Buka/tutup sesi sesuai F2 (dengan konfirmasi, tanpa aksi ilegal).
- [ ] Rekap sesuai F4 (urut waktu, jumlah hadir, empty state).
- [ ] Status sesi terlihat konsisten setelah aksi.

**P3**
- [ ] `tsc --noEmit` bersih untuk types/store/dummy.
- [ ] Tidak ada warna hardcode di komponen UI.
- [ ] Semua komponen UI punya state disabled/loading/empty bila relevan.
- [ ] Store menolak presensi ganda dan sesi tidak valid (diuji manual + satu cek assert).
- [ ] `ui/index.ts` mengekspor seluruh komponen yang dipakai P1/P2.

**PM**
- [ ] PRD, pembagian tugas, git workflow, README, AGENTS.md lengkap dan saling konsisten.
- [ ] CODEOWNERS + template PR aktif.
- [ ] QA matrix F1–F7 terisi status lulus/gagal.
- [ ] Demo script dijalankan 2× tanpa error.

## 7. Handoff

- **P1 → P2 (D1):** folder `(asisten)/` + `_layout.tsx` tab asisten sudah ada dan bisa dibuka, walau isinya placeholder.
- **P3 → P1/P2 (akhir D1):** types, store, primitif UI ter-freeze; perubahan hanya lewat PR.
- **Semua → PM (D4):** screenshot tiap layar + daftar empty state untuk QA matrix.

## 8. Branch per orang

| Owner | Contoh branch |
|---|---|
| P1 | `feat/p1-shell-role-picker`, `feat/p1-praktikan-presensi` |
| P2 | `feat/p2-asisten-sesi-control`, `feat/p2-asisten-rekap` |
| P3 | `feat/p3-data-store`, `feat/p3-ui-empty-state` |
| PM | `docs/pm-sprint-1`, `chore/pm-pr-template` |

Aturan lengkap di [`GIT-WORKFLOW.md`](GIT-WORKFLOW.md).
