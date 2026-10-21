# Git Workflow: PraktikumKU

Berlaku untuk 1 PM + 3 programmer yang bekerja paralel. Tujuan: `main` selalu bisa dijalankan dan setiap perubahan punya pemilik jelas.

## 1. Branch

`main` = branch produksi/demo. **Dilarang push langsung ke `main`.**

Format:

```
<type>/<owner>-<area>-<slug>
```

| Segmen | Nilai | Contoh |
|---|---|---|
| `type` | `feat`, `fix`, `refactor`, `style`, `docs`, `chore` | `feat` |
| `owner` | `p1`, `p2`, `p3`, `pm` | `p1` |
| `area` | `shell`, `praktikan`, `asisten`, `ui`, `data`, `docs`, `config` | `praktikan` |
| `slug` | kebab-case, 3–40 char, `a-z0-9-` | `jadwal-list` |

Regex validasi:

```
^(feat|fix|refactor|style|docs|chore)\/(p1|p2|p3|pm)-(shell|praktikan|asisten|ui|data|docs|config)-[a-z0-9-]{3,40}$
```

Benar: `feat/p1-praktikan-jadwal-list`, `feat/p2-asisten-sesi-control`, `feat/p3-ui-empty-state`, `docs/pm-sprint-1`, `fix/p2-asisten-rekap-crash`.
Salah: `feature/jadwal`, `fix-bug`, `p1/jadwal`, `feat/Praktikan-Jadwal`.

Aturan:

- Selalu branch dari `main` terbaru.
- Satu branch satu tujuan; umur maksimal 2 hari kerja.
- Rebase harian ke `main` (`git pull --rebase origin main`), jangan merge `main` ke branch.
- Hapus branch setelah merge.

## 2. Commit message

Format Conventional Commits, **scope wajib**:

```
<type>(<scope>): <subject>

[body opsional, wrap 72 char]

[footer: Refs #12]
```

| Type | Dipakai untuk |
|---|---|
| `feat` | fitur/layar baru |
| `fix` | perbaikan bug |
| `refactor` | ubah struktur tanpa ubah perilaku |
| `style` | styling/token, tanpa ubah logika |
| `docs` | dokumentasi |
| `chore` | config, dependency, tooling |

Scope: `shell`, `praktikan`, `asisten`, `ui`, `data`, `docs`, `config`.

Aturan subject: imperative, lowercase, tanpa titik akhir, maksimal 72 karakter, satu commit = satu perubahan logis.

Benar:

```
feat(shell): tambah landing page dan login dummy
feat(praktikan): tambah bottom sheet konfirmasi presensi
fix(asisten): status sesi tidak berubah setelah ditutup
style(ui): samakan radius kartu jadwal dengan token
docs(docs): tulis acceptance criteria sprint 1
```

Salah: `update`, `fix bug`, `WIP`, `Feat(Praktikan): Nambahin Fitur.`

Tambahan:

- `fix` wajib menyebut gejala di subject, bukan dugaan penyebab.
- Perubahan kontrak `src/types` memakai footer `BREAKING CHANGE: <detail>`.
- Commit `WIP` boleh lokal tetapi wajib di-squash sebelum merge.
- Perubahan di file beku (`_layout.tsx`, `tokens.js`, `theme.ts`, `types`, `ui/index.ts`, `credentials.ts`) wajib menyebut owner file di body, misalnya `Owner: P1` atau `Owner: P3`.

## 3. Pull request

### Sebelum membuka PR

```bash
npx tsc --noEmit
npx expo lint
```

Keduanya harus hijau. PR yang gagal typecheck/lint tidak direview.

> CI otomatis belum tersedia pada Sprint 1 (tidak ada workflow). Syarat kelulusan memakai hasil cek lokal di atas; reviewer mengecek bukti di deskripsi PR.

### Ukuran

- Maksimal **400 baris berubah** dan **10 file** (di luar lockfile).
- Satu topik per PR. Lebih besar → pecah.
- Buka **draft PR** di hari pertama supaya progres terlihat.
- Wajib screenshot (iOS + Android) untuk PR yang mengubah UI.

### Judul

Judul PR = commit message utama, misalnya `feat(asisten): kelola buka tutup sesi`.

### Body

Wajib memakai `.github/pull_request_template.md`:

```markdown
## Ringkasan
<apa yang berubah, 1-3 baris>

## Kenapa
<kebutuhan PRD nomor berapa>

## Cara tes
1. ...
2. ...

## Screenshot
| iOS | Android |
|---|---|
| ... | ... |

## Ceklis
- [ ] Hanya menyentuh path milik saya (lihat CODEOWNERS)
- [ ] `npx tsc --noEmit` hijau
- [ ] `npx expo lint` hijau
- [ ] Ada empty state bila relevan; tidak ada loading state palsu
- [ ] Tidak ada warna hardcode atau arbitrary value (pakai token NativeWind)
- [ ] Layout pakai flexbox + safe area
- [ ] Tidak menambah dependency tanpa approval PM
- [ ] Semua feedback diambil dari hasil `{ ok, pesan }` store; tidak ada loading palsu

Refs #<issue>
```

### Review

- Minimal **1 approval**. Reviewer default: pemilik path yang bersinggungan; bila tidak ada, PM.
- Review SLA: 1 hari kerja. Komentar wajib dijawab atau di-resolve.
- PR yang menyentuh path orang lain wajib mendapat approval dari owner path tersebut.
- Label: `ui`, `praktikan`, `asisten`, `data`, `docs`, `blocked`.

## 4. Merge

- Hanya **squash merge**. Pesan squash = judul PR.
- Syarat: cek lokal `npx tsc --noEmit` + `npx expo lint` hijau (dilaporkan di deskripsi PR), 1 approval, branch up-to-date dengan `main`, tanpa konflik.
- Branch sumber dihapus otomatis.
- Dilarang force push ke `main` dan dilarang merge PR milik sendiri tanpa reviewer.

## 5. Freeze & rilis

- **D5 freeze:** hanya `fix/*` untuk bug demo. Fitur baru masuk backlog Sprint 2.
- Setelah demo lulus, PM menandai `main` dengan tag `sprint-1` (annotated).
- Tidak ada deployment wajib di sprint ini; demo cukup lewat `npx expo start`.

## 6. Kalau ada konflik

1. `git pull --rebase origin main`.
2. Konflik di file biasa: selesaikan, `git rebase --continue`.
3. Konflik di file beku atau path orang lain: **berhenti**, hubungi owner, sepakati isi final, lalu owner yang commit.
4. Setelah rebase: jalankan ulang `npx tsc --noEmit` dan `npx expo lint` sebelum push (`git push --force-with-lease` hanya untuk branch sendiri).

## 7. Skills pendukung (opsional)

`resolving-merge-conflicts` dan `code-review` dari skills.sh membantu mengikuti aturan di atas. Daftar lengkap ada di `AGENTS.md`.
