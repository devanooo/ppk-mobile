# Pembagian Tugas: Sprint 1

Tujuan dokumen: setiap file punya **tepat satu pemilik**. Tidak ada dua orang mengedit path yang sama dalam satu sprint.

## 1. Tim

| Kode | Peran | Fokus |
|---|---|---|
| PM | Product Manager | backlog, PRD, QA matrix, review docs, demo |
| P1 | Programmer | navigasi shell, landing page, login, auth guard, seluruh alur praktikan |
| P2 | Programmer | seluruh alur asisten |
| P3 | Programmer | design system, tipe, data dummy, store, komponen UI bersama |

## 2. Matriks ownership

| Path | Owner | Keterangan |
|---|---|---|
| `src/app/_layout.tsx` | P1 | root Stack, provider store, auth guard. **Beku setelah D1** |
| `src/app/index.tsx` | P1 | landing page publik |
| `src/app/login.tsx` | P1 | form login dummy dan redirect peran |
| `src/features/auth/**` | P1 | komponen landing/login, validasi form, pemetaan akun ke beranda |
| `src/app/(praktikan)/**` | P1 | tab, jadwal, detail, kehadiran |
| `src/features/praktikan/**` | P1 | komponen/hook khusus praktikan |
| `src/app/(asisten)/**` | P2 | tab, jadwal, detail, rekap |
| `src/features/asisten/**` | P2 | komponen/hook khusus asisten |
| `src/constants/tokens.js` | P3 | token desain: warna, spacing, radius, tipografi. **Beku setelah D1** |
| `src/constants/theme.ts` | P3 | re-export bertipe dari `tokens.js` untuk kode non-JSX. **Beku setelah D1** |
| `tailwind.config.js`, `src/global.css`, `babel.config.js`, `metro.config.js` | P1 | konfigurasi styling. Perubahan wajib approval PM |
| `src/types/**` | P3 | tipe domain. **Beku setelah D1** |
| `src/data/**` | P3 | data dummy, termasuk `credentials.ts` |
| `src/store/**` | P3 | context sesi, presensi, dan autentikasi |
| `src/components/ui/**` | P3 | primitif UI, termasuk `profile-menu.tsx`, `home-button.tsx`, dan `text-field.tsx`. **Beku setelah D1**, kecuali penambahan ekspor oleh P3 |
| `src/components/app-tabs.tsx` | P1 | dihapus/diganti saat scaffold |
| `README.md`, `docs/**`, `AGENTS.md` | PM | dokumentasi |
| `.github/**` | PM | CODEOWNERS, template PR. **Pengecualian:** `.github/workflows/**` diusulkan P3, disetujui PM |
| `app.json`, `package.json`, `tsconfig.json` | P1 | satu-satunya owner. Perubahan config wajib approval PM **sebelum** PR diajukan/di-merge |

Path yang tidak tercantum: **jangan disentuh** tanpa persetujuan PM.

## 3. Aturan anti-tabrakan

1. **Satu path satu owner.** Butuh perubahan di file orang lain: buka PR ke owner tersebut atau minta owner yang commit.
2. **Presentational vs route.** Komponen layar menerima props; file route hanya memanggil hook store dan merender komponen. Dengan begitu P1/P2 bisa bekerja sebelum store selesai.
3. **File beku D1:** `src/app/_layout.tsx`, `src/constants/theme.ts`, `src/types/index.ts`, `src/components/ui/index.ts`, `src/constants/tokens.js`, `src/data/credentials.ts`. Perubahan setelah beku harus lewat PR kecil ke owner. P3 tetap boleh menambah ekspor komponen baru di `ui/index.ts`.
4. **Dilarang membuat file baru** di area orang lain, termasuk file sementara.
5. **Dilarang menambah dependency.** Usul ke PM; jika disetujui, `npx expo install` dijalankan P1.
6. Konflik merge di file beku: hubungi owner, jangan diselesaikan sendiri.

## 4. Kontrak data (dibuat P3, hari D1)

`src/types/index.ts` memuat salinan tipe dari `docs/PRD.md` bagian 8, tanpa tambahan field:

```ts
type Peran = 'praktikan' | 'asisten';
type StatusSesi = 'belum-dibuka' | 'dibuka' | 'ditutup';

type User = {
  id: string;
  nama: string;
  nomorInduk: string;
  peran: Peran;
};

type Sesi = {
  id: string;
  namaPraktikum: string;
  kelas: string;
  lab: string;
  hari: string;
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
  asistenId: string;
  pesertaIds: string[];
  status: StatusSesi;
  dibukaPada?: string;
  ditutupPada?: string;
};

type Presensi = {
  sesiId: string;
  praktikanId: string;
  waktu: string;
};

type Kredensial = {
  userId: string;
  username: string;
  password: string;
};
```

`src/data/dummy.ts` berisi 2 asisten (A mengampu 5 sesi, B tidak mengampu sesi), 4 praktikan (`mhs-1`, `mhs-2`, `mhs-3` terdaftar pada tiap sesi, `mhs-4` tanpa sesi), 5 sesi (2 `belum-dibuka`, 2 `dibuka`, 1 `ditutup`) dengan 3 peserta per sesi, dan 2 presensi awal. Presensi awal hanya berada pada sesi `dibuka` atau `ditutup`.

`src/data/credentials.ts` berisi enam akun dummy:

| Username | Password | Peran | User |
|---|---|---|---|
| `ahmad` | `praktikan123` | Praktikan | `mhs-1` |
| `citra` | `praktikan123` | Praktikan | `mhs-2` |
| `eko` | `praktikan123` | Praktikan | `mhs-3` |
| `fani` | `praktikan123` | Praktikan | `mhs-4` |
| `budi` | `asisten123` | Asisten | `asisten-1` |
| `siti` | `asisten123` | Asisten | `asisten-2` |

`src/store/session-store.tsx` memakai API minimal:

```ts
type HasilAksi = { ok: boolean; pesan: string };

type HasilLogin =
  | { ok: true; user: User }
  | { ok: false; pesan: string };

type Store = {
  user: User | null;
  sesi: Sesi[];
  presensi: Presensi[];
  login: (username: string, password: string) => HasilLogin;
  logout: () => void;
  setUser: (u: User | null) => void;
  sesiById: (sesiId: string) => Sesi | undefined;
  sesiUntuk: (user: User) => Sesi[];
  bukaSesi: (sesiId: string) => HasilAksi;
  tutupSesi: (sesiId: string) => HasilAksi;
  catatPresensi: (sesiId: string, praktikanId: string) => HasilAksi;
  presensiSaya: (praktikanId: string) => Presensi[];
  rekapSesi: (sesiId: string) => Array<{ praktikan: User; waktu: string }>;
  sudahPresensi: (sesiId: string, praktikanId: string) => boolean;
};
```

Aturan:

- `login` mencocokkan username tanpa peka huruf besar/kecil dan password secara persis. Kredensial salah mengembalikan `{ ok: false, pesan: 'Username atau kata sandi salah' }`.
- `logout` mengosongkan `user` tanpa mengubah `sesi` atau `presensi`.
- `setUser` hanya untuk ganti peran demo, bukan jalur login normal. Ganti peran demo memetakan asisten ke `mhs-1` dan praktikan ke `asisten-1`.
- Mutasi sesi dan presensi (`bukaSesi`, `tutupSesi`, `catatPresensi`) mengembalikan `{ ok, pesan }`.
- `bukaSesi` hanya valid dari `belum-dibuka`; `tutupSesi` hanya valid dari `dibuka`.
- `catatPresensi` menolak bila sesi tidak `dibuka`, praktikan tidak ada di `pesertaIds`, atau presensi untuk pasangan `sesiId + praktikanId` sudah ada.
- Pesan penolakan memakai teks pada PRD bagian 10.
- Semua mutasi hanya lewat store. Tidak ada state lokal duplikat di layar.

`src/components/ui/` minimal memuat:

| Komponen | Dipakai oleh | Catatan |
|---|---|---|
| `Screen` | P1, P2 | safe area, padding, background |
| `AppButton` | P1, P2 | varian primary/secondary/ghost, state disabled dan alasan |
| `Card` | P1, P2 | kartu jadwal dan ringkasan |
| `StatusBadge` | P1, P2 | label teks status, bukan warna saja |
| `EmptyState` | P1, P2 | ikon, judul, deskripsi |
| `BottomSheet` | P1, P2 | konfirmasi buka/tutup sesi, presensi, logout, ganti peran |
| `TextField` | P1 | input username dan password, dukungan `secureTextEntry` |
| `Banner` | P1, P2 | feedback sukses/gagal |
| `ProfileMenu` | P1, P2 | dropdown identitas, Beranda, Ganti peran demo, Keluar akun |
| `HomeButton` | P1, P2 | tombol kembali ke beranda di header halaman non-home |

Semua komponen memakai NativeWind (`className`) dengan token dari `tokens.js`. Jangan hardcode warna atau memakai arbitrary value.

Kontrak `ProfileMenu`:

```ts
type ProfileMenuProps = {
  user: User;
  onHome: () => void;
  onSwitchRole: () => void;
  onLogout: () => void;
};
```

Kontrak `HomeButton`:

```ts
type HomeButtonProps = {
  onPress: () => void;
};
```

Kontrak auth guard (P1):

- Root stack memakai `Stack.Protected` dari Expo Router SDK 58.
- Route `index` dan `login` hanya tersedia saat `user === null`.
- Route `(praktikan)` hanya tersedia saat `user.peran === 'praktikan'`.
- Route `(asisten)` hanya tersedia saat `user.peran === 'asisten'`.
- P1 menguji redirect setelah login, logout, dan akses route peran lain (AC-02, AC-14).
- Login asisten tidak boleh diarahkan ke route yang belum dibuat. P2 wajib menyediakan `(asisten)` pada D1.

## 5. Timeline

| Hari | PM | P1 | P2 | P3 |
|---|---|---|---|---|
| D1 | finalkan PRD, jobdesk, akun demo, CODEOWNERS | scaffold root layout, landing, login, `(praktikan)` kosong; hapus `app-tabs*` | scaffold `(asisten)` kosong: layout tab + layar placeholder yang bisa dibuka | tulis types, dummy, credentials, store login/logout, token Apple, `TextField`; **freeze di akhir hari** |
| D2 | cek progres, unblock, review PR docs | UI landing + login, auth guard, redirect peran | layar jadwal + detail asisten (presentational) | `ProfileMenu`, `HomeButton`, polish primitif, empty state |
| D3 | QA matrix awal | integrasi profil di header + alur presensi praktikan | aksi buka/tutup sesi + rekap | test login/store, dokumentasi komponen |
| D4 | review UI vs acceptance criteria | wiring store sisi praktikan | wiring store sisi asisten | perbaikan bug store/komponen |
| D5 | QA final, demo script, tag `sprint-1` | bugfix + rehearsal | bugfix + rehearsal | bugfix + rehearsal |

## 6. Definition of Done per orang

**P1**
- [ ] Landing page dan login berjalan; tombol Masuk nonaktif sampai form terisi.
- [ ] Login mengarahkan praktikan ke `(praktikan)/jadwal` dan asisten ke `(asisten)/jadwal`.
- [ ] Auth guard menolak akses route peran lain dan route publik saat sudah login (AC-14).
- [ ] Profil di header membuka dropdown; Beranda, Ganti peran demo, dan Keluar akun berfungsi (AC-13).
- [ ] Logout meminta konfirmasi dan kembali ke landing tanpa menghapus sesi/presensi.
- [ ] Jadwal dan detail praktikan lulus AC-03; presensi lulus AC-05, AC-06, AC-07, dan AC-10.
- [ ] Tombol Beranda tampil di halaman detail dan halaman non-home.

**P2**
- [ ] Tab asisten: jadwal, detail, rekap.
- [ ] Buka/tutup sesi lulus AC-04 dan AC-09, dengan konfirmasi dan tanpa aksi ilegal.
- [ ] Rekap urut waktu, jumlah hadir, dan empty state.
- [ ] Status sesi konsisten di daftar dan detail setelah aksi.
- [ ] Login asisten dapat diuji karena route `(asisten)` sudah ada.
- [ ] Profil di header asisten memakai komponen P3 dan menampilkan identitas yang benar.

**P3**
- [ ] `tsc --noEmit` bersih untuk types/store/dummy/credentials.
- [ ] `login`, `logout`, dan `setUser` berjalan sesuai kontrak.
- [ ] Tidak ada warna hardcode di komponen UI.
- [ ] Semua komponen UI punya state disabled/empty bila relevan; tidak ada loading palsu.
- [ ] Store menolak presensi ganda, sesi tidak aktif, dan peserta tidak terdaftar (AC-06, AC-07, AC-08).
- [ ] `ui/index.ts` mengekspor seluruh komponen yang dipakai P1/P2.

**PM**
- [ ] PRD, pembagian tugas, git workflow, README, AGENTS.md lengkap dan saling konsisten.
- [ ] CODEOWNERS + template PR aktif; `src/app/login.tsx` dan `src/features/auth/**` tercantum.
- [ ] QA matrix AC-01 sampai AC-15 terisi status lulus/gagal.
- [ ] Demo script dijalankan 2 kali tanpa error dan tanpa reload (AC-15).

## 7. Handoff

- **PM ke semua (D1):** PRD final, akun demo, matriks ownership, dan CODEOWNERS.
- **P3 ke P1/P2 (akhir D1):** types, credentials, store `login`/`logout`, `TextField`, token, dan primitif UI. Perubahan setelah freeze lewat PR.
- **P3 ke P1/P2 (D2):** `ProfileMenu` dan `HomeButton` siap dipakai.
- **P1 ke P2 (D1):** root layout, landing, login, dan auth guard sudah bisa dijalankan; route `(asisten)` milik P2 sudah tersedia sebagai placeholder.
- **P2 (D1):** memastikan `(asisten)` bisa dibuka, sehingga login asisten tidak mengarah ke route kosong.
- **Semua ke PM (D4):** screenshot tiap layar, daftar empty state, dan status AC untuk QA matrix.

## 8. Branch per orang

| Owner | Contoh branch |
|---|---|
| P1 | `feat/p1-shell-landing-login`, `feat/p1-shell-auth-guard`, `feat/p1-praktikan-profile-header` |
| P2 | `feat/p2-asisten-sesi-control`, `feat/p2-asisten-profile-header` |
| P3 | `feat/p3-data-auth-store`, `feat/p3-ui-profile-menu`, `feat/p3-ui-apple-tokens` |
| PM | `docs/pm-auth-prd`, `chore/pm-pr-template` |

Area `shell` dipakai untuk landing, login, dan auth guard. Aturan branch lengkap ada di [`GIT-WORKFLOW.md`](GIT-WORKFLOW.md).
