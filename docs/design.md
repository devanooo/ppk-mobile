# Design System — AntarMuka (AntarPraktikum)

Sumber kebenaran desain untuk Sprint 1. Dibaca bersama `docs/PRD.md` (kebutuhan & acceptance criteria) dan `docs/PEMBAGIAN-TUGAS.md` (kontrak komponen).

> **Urutan otoritas.** Nilai token yang mengikat ada di `src/constants/tokens.js` (dan channel RGB di `src/global.css`). Dokumen ini **mencerminkan** nilai tersebut dan menetapkan **aturan pemakaian**. Bila ada perbedaan angka, `tokens.js` menang dan dokumen ini harus diperbaiki lewat PR ke PM.
>
> **Ini bukan duplikasi PRD.** Teks empty state, alur per peran, dan acceptance criteria tetap di PRD. Dokumen ini hanya mengatur tampilan, token, komponen, dan konsistensi visual.

**Inspirasi:** `material-clean.md` (Material Design 3 ringkas). Yang diadopsi: struktur semantic color roles, disiplin skala tipografi, spacing 4-based, hierarki lewat permukaan. Yang **ditolak**: palet ungu Material, elevation/shadow berlapis, ripple sebagai satu-satunya feedback, dan state loading. Bagian yang merupakan adaptasi ditandai **[Adaptasi]**.

---

## 1. Design principles

1. **Task-first.** Layar utama langsung menampilkan jadwal dan status sesi. Tidak ada onboarding, splash marketing, atau dekorasi yang menunda aksi presensi.
2. **Satu sumber kebenaran.** Status sesi yang tampil di kartu, detail, dan rekap berasal dari store yang sama. Desain tidak boleh menampilkan status yang dihitung ulang di layar.
3. **Status tidak boleh bergantung pada warna saja.** Setiap badge wajib punya label teks. Badge tanpa teks dilarang.
4. **Tenang, bukan ramai.** Satu aksen biru, sisanya netral. Warna jenuh hanya untuk status dan feedback.
5. **Umpan balik jujur.** Tidak ada spinner, skeleton, atau progress palsu. Operasi sinkron → hasil langsung terlihat (PRD §9).
6. **Konsisten di dua peran.** Praktikan dan asisten memakai komponen yang sama; perbedaan hanya pada aksi yang tersedia, bukan pada gaya.

---

## 2. Visual direction

**Karakter:** *campus-clean* — bersih, tenang, mudah dipindai, terasa administratif tanpa terasa kaku.

| Aspek | Arah |
|---|---|
| Palet | Netral putih/hitam dengan satu aksen biru (`primary`). Hijau/merah/kuning hanya untuk status. |
| Permukaan | Hierarki lewat **perbedaan permukaan + border**, bukan shadow. Kartu memakai `bg-backgroundElement`, layar memakai `bg-background`. |
| Sudut | Membulat sedang: kartu `rounded-lg` (16), input & tombol `rounded-md` (12), chip/badge `rounded-pill`. |
| Tipografi | System font. Bobot `semibold` untuk judul, `medium` untuk label, `regular` untuk isi. |
| Kepadatan | Lega. Padding layar 16–24. Baris daftar minimal 56pt. |
| Ikon | `expo-symbols` (`SymbolView`), ukuran 18/24/32. Tidak menambah icon library. |
| Gerak | Minimal. Hanya transisi bottom sheet (150–250 ms) dan feedback pressed. |

**Yang tidak dipakai:** gradien, ilustrasi besar, glassmorphism (walaupun `expo-glass-effect` terpasang), bayangan berlapis, border wireframe 1px di setiap container.

---

## 3. Design tokens

Semua di bawah ini berlaku otomatis sebagai utility NativeWind (`bg-primary`, `p-three`, `text-body`, dst.) karena `tailwind.config.js` memetakan `tokens.js` ke `theme.extend`.

### 3.1 Warna (semantic roles)

Nama token dipakai sebagai class: `bg-<nama>`, `text-<nama>`, `border-<nama>`.

| Token | Peran | Light | Dark |
|---|---|---|---|
| `background` | Latar layar | `#FFFFFF` | `#000000` |
| `backgroundElement` | Kartu, input filled, chip | `#F0F0F3` | `#212225` |
| `backgroundSelected` | Baris/opsi terpilih | `#E0E1E6` | `#2E3135` |
| `text` | Teks utama | `#000000` | `#FFFFFF` |
| `textSecondary` | Teks pendukung, helper | `#60646C` | `#B0B4BA` |
| `textInverse` | Teks di atas permukaan gelap/terang terbalik | `#FFFFFF` | `#000000` |
| `border` | Garis pemisah, outline | `#D9DBE0` | `#3A3D42` |
| `primary` | Aksen, CTA, focus ring | `#1470C8` | `#5CA8F5` |
| `primaryText` | Teks/ikon di atas `primary` | `#FFFFFF` | `#00131F` |
| `success` | Teks status berhasil/dibuka | `#147D4F` | `#5FD39B` |
| `successSurface` | Latar banner/badge sukses | `#E4F5EC` | `#10291E` |
| `danger` | Teks galat/ditolak | `#B42318` | `#FF8B80` |
| `dangerSurface` | Latar banner/badge gagal | `#FDECEA` | `#2E1715` |
| `warning` | Teks status menunggu | `#8A5A00` | `#F0C070` |
| `warningSurface` | Latar badge menunggu | `#FFF4E0` | `#2B2213` |

**Aturan:**
- Dilarang memakai palet default Tailwind (`bg-blue-500`, `text-gray-700`).
- Dilarang hex/`rgb()` literal di komponen.
- `primary` selalu berpasangan dengan `primaryText`. Jangan menaruh `text` di atas `primary`.
- Warna status **hanya** dari pasangan `success/successSurface`, `danger/dangerSurface`, `warning/warningSurface`.

### 3.2 Spacing

| Token | Nilai (pt) | Class | Pemakaian umum |
|---|---|---|---|
| `half` | 2 | `p-half` | Hairline offset |
| `one` | 4 | `p-one` | Jarak ikon–teks kecil |
| `two` | 8 | `p-two` / `gap-two` | Jarak antar elemen dalam komponen |
| `three` | 16 | `p-three` / `gap-three` | **Padding default** kartu, layar, bottom sheet |
| `four` | 24 | `p-four` | Padding layar lebar, jarak antar section |
| `five` | 32 | `p-five` | Jarak section besar, padding empty state |
| `six` | 64 | `p-six` | Ruang ikon empty state |

**Tidak ada token 12.** Jarak 12pt tidak tersedia; gunakan `two` (rapat) atau `three` (normal). `12` hanya muncul sebagai nilai `rounded-md`.

### 3.3 Radius

| Token | Nilai | Class | Dipakai untuk |
|---|---|---|---|
| `sm` | 8 | `rounded-sm` | Chip kecil, badge inner |
| `md` | 12 | `rounded-md` | Tombol, input, banner |
| `lg` | 16 | `rounded-lg` | Kartu, bottom sheet (atas) |
| `pill` | 999 | `rounded-pill` | Badge status, avatar |

### 3.4 Tipografi

| Token | Size / lineHeight | Class | Weight default | Peran |
|---|---|---|---|---|
| `caption` | 12 / 16 | `text-caption` | `medium` | Helper, meta, timestamp |
| `small` | 14 / 20 | `text-small` | `regular` | Isi sekunder, label form |
| `body` | 16 / 24 | `text-body` | `regular` | Isi utama |
| `subtitle` | 20 / 28 | `text-subtitle` | `semibold` | Judul layar, judul section |
| `title` | 28 / 36 | `text-title` | `semibold` | Judul halaman utama |
| `display` | 34 / 42 | `text-display` | `bold` | Angka besar (jumlah hadir) |

Weight: `font-regular` 400, `font-medium` 500, `font-semibold` 600, `font-bold` 700.

### 3.5 Elevation — **[Adaptasi: tidak ada token shadow]**

Referensi Material memakai elevation 0–3. Project ini **tidak punya token shadow** dan **tidak akan memakainya**.

| Lapisan | Representasi |
|---|---|
| 0 — layar | `bg-background` |
| 1 — kartu/section | `bg-backgroundElement` + `rounded-lg` |
| 2 — terpilih/aktif | `bg-backgroundSelected` |
| 3 — overlay (bottom sheet) | scrim overlay gelap (lihat §5.6) + panel `bg-background` `rounded-t-lg` |

Dilarang: `shadow-*`, `elevation-*`, border tebal dekoratif. Pemisah daftar memakai `border-b border-border` setipis `border` bawaan, hanya di antara baris yang memang perlu.

---

## 4. Typography

**Hierarki wajib per layar:**

1. Satu `text-title` **atau** `text-subtitle` sebagai judul utama. Tidak boleh dua judul selevel.
2. Judul section memakai `text-subtitle` + `font-semibold`; jarak ke isi `gap-two`.
3. Isi `text-body`. Jangan menurunkan isi ke `text-small` hanya agar "muat".
4. Meta (waktu, jumlah, NIM/NIP) memakai `text-small text-textSecondary`.
5. Label tombol: `text-body font-semibold` untuk `size="lg"`, `text-small font-semibold` untuk `size="md"`.

**Aturan:**
- Tidak ada `text-2xl`, `text-xl`, `text-lg`, `text-sm`, `text-xs` — pakai skala token.
- `lineHeight` selalu ikut token; jangan menambah `leading-*` manual.
- Jangan memakai `uppercase` pada isi. Hanya boleh untuk label badge pendek (`text-caption font-semibold uppercase`).
- Maksimal **dua** ukuran font per komponen (mis. judul + isi). Lebih dari itu tanda komponen terlalu ramai.
- Angka penting (jumlah hadir) boleh `text-display`; jangan pakai `display` untuk teks biasa.

---

## 5. Component specifications

Semua komponen di `src/components/ui/`, diekspor lewat `index.ts`, **dimiliki P3**. Prop di bawah adalah kontrak beku setelah D1.

### 5.1 `Screen`

Wrapper tiap layar.

```ts
type ScreenProps = {
  children: React.ReactNode;
  scroll?: boolean;      // default true
  padded?: boolean;      // default true → px-three + py-three
  edges?: ('top' | 'bottom' | 'left' | 'right')[]; // default ['top','left','right']
};
```

- Root: `flex-1 bg-background`.
- Safe area lewat `SafeAreaView` dari `react-native-safe-area-context`.
- `scroll` → `ScrollView` dengan `contentContainerStyle` yang memakai padding token, bukan `style`.
- Konten dibatasi `maxWidth` (`MaxContentWidth` 800) dan `self-center` di tablet/web.

### 5.2 `AppButton`

```ts
type AppButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; // default 'primary'
  size?: 'md' | 'lg';   // md = 44 tinggi, lg = 48
  disabled?: boolean;
  disabledReason?: string; // dirender sebagai teks di bawah tombol
  fullWidth?: boolean;     // default false
  icon?: React.ReactNode;
  testID?: string;
};
```

| Variant | Class | Kapan |
|---|---|---|
| `primary` | `bg-primary text-primaryText` | Aksi utama layar (Presensi, Buka sesi, Masuk) |
| `secondary` | `bg-backgroundElement text-text border border-border` | Aksi alternatif (Batal, Lihat rekap) |
| `ghost` | `bg-transparent text-primary` | Aksi tersier (Ganti peran, tautan) |
| `danger` | `bg-dangerSurface text-danger border border-danger` | Tutup sesi (destruktif, tidak bisa dibuka ulang) |

- Tinggi `md` 44, `lg` 48 → memenuhi target sentuh PRD (44pt) **dan** Material (48dp).
- Radius `rounded-md`, padding horizontal `p-three`, label `font-semibold`.
- **Satu** `primary` per layar. Bila butuh dua aksi setara, salah satunya `secondary`.
- `disabled` → `opacity-40` + `disabledReason` wajib ditampilkan (`text-caption text-textSecondary`).
- `android_ripple` aktif; iOS memakai `active:opacity-80` lewat `Pressable` style function.

### 5.3 `Card`

```ts
type CardProps = {
  children: React.ReactNode;
  onPress?: () => void;
  selected?: boolean;
};
```

- `bg-backgroundElement rounded-lg p-three gap-two`.
- `selected` → `bg-backgroundSelected`.
- Bila `onPress`: `Pressable` dengan `accessibilityRole="button"`, riak Android, `active:opacity-80`.
- Kartu jadwal **wajib** memuat: nama praktikum, kelas, lab, hari & tanggal, jam, `StatusBadge` (PRD FR-02).
- Jarak antar kartu `gap-two` (8) di dalam daftar.

### 5.4 `StatusBadge`

```ts
type StatusBadgeProps = {
  tone: 'neutral' | 'success' | 'warning' | 'danger';
  label: string;   // WAJIB — badge tanpa teks dilarang
};
```

| Tone | Class | Status sesi |
|---|---|---|
| `neutral` | `bg-backgroundElement text-textSecondary` | `belum-dibuka` → "Belum dibuka" |
| `success` | `bg-successSurface text-success` | `dibuka` → "Dibuka" |
| `danger` | `bg-dangerSurface text-danger` | `ditutup` → "Ditutup" |
| `warning` | `bg-warningSurface text-warning` | cadangan (belum dipakai di Sprint 1) |

- `rounded-pill`, padding `px-two py-one`, `text-caption font-semibold uppercase`.
- **Pemetaan status → tone adalah satu fungsi** (`statusTone()`), jangan diulang di layar.

### 5.5 `EmptyState`

```ts
type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: React.ReactNode;      // SymbolView 32
  action?: React.ReactNode;    // biasanya AppButton secondary
};
```

- Layout: `flex-1 items-center justify-center gap-three p-five`.
- Ikon dalam lingkaran `bg-backgroundElement rounded-pill p-four`.
- Teks: `title` → `text-subtitle font-semibold text-center`; `description` → `text-body text-textSecondary text-center`.
- Teks wajib dari PRD §10 — jangan mengarang teks baru.

### 5.6 `BottomSheet`

```ts
type BottomSheetProps = {
  visible: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel?: string;   // default 'Batal'
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;  // confirm memakai variant danger
};
```

- Implementasi **`Modal` React Native** (`transparent`, `animationType="fade"`), bukan library. Dilarang menambah `@gorhom/bottom-sheet`.
- Struktur: scrim overlay (lihat catatan di bawah) → panel `bg-background rounded-t-lg p-four gap-three`.
- **Scrim [Adaptasi]:** `border` dan palet default tidak dipakai. Scrim memakai `<Pressable>` dengan `style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}` karena Tailwind tanpa token opacity tidak bisa menyatakan overlay. Ini satu-satunya pengecualian warna literal yang diizinkan, dan **hanya** di dalam `BottomSheet` — jangan ditiru di komponen lain.
- `accessibilityViewIsModal`, `onRequestClose={onCancel}` (tombol back Android).
- Tombol: `cancelLabel` = `secondary`, `confirmLabel` = `primary` (atau `danger` bila `destructive`). Urut vertikal, konfirmasi di atas.
- Wajib untuk **buka sesi, tutup sesi, presensi** (PRD §9). Bukan opsional.

### 5.7 `Field`

```ts
type FieldProps = {
  label: string;
  value: string | null;
  onChange: (value: string) => void;
  type?: 'text' | 'picker';   // default 'text'
  placeholder?: string;
  options?: { label: string; value: string }[]; // wajib untuk picker
  helper?: string;
  error?: string;
  disabled?: boolean;
};
```

- Gaya **filled**, bukan outlined: `bg-backgroundElement rounded-md p-three` + tinggi minimum 44pt (lihat §5.2).
- Label di atas (`text-small font-medium text-textSecondary`), helper/error di bawah (`text-caption`).
- `error` → `border border-danger` + teks `text-danger`.
- Focus → `border-2 border-primary`.
- Karena `border` hanya 1.39:1, **jangan** mengandalkan outline sebagai satu-satunya penanda field. Latar filled wajib.
- Picker dirender sebagai `Pressable` yang membuka `BottomSheet` berisi daftar opsi.

### 5.8 `Banner`

```ts
type BannerProps = {
  tone: 'success' | 'danger' | 'info';
  message: string;
  onDismiss?: () => void;
};
```

| Tone | Class |
|---|---|
| `success` | `bg-successSurface text-success` |
| `danger` | `bg-dangerSurface text-danger` |
| `info` | `bg-backgroundElement text-textSecondary` |

- `rounded-md p-three flex-row gap-two items-start`.
- Inline di layar, **bukan** `Alert` (PRD §9).
- Pesan berasal dari `{ ok, pesan }` store. Layar tidak menulis ulang teks penolakan.
- Auto-dismiss tidak wajib; bila ada, sediakan `onDismiss` sebagai tombol tutup dengan `accessibilityLabel`.

### 5.9 `GantiPeranButton`

```ts
type GantiPeranButtonProps = { onPress: () => void; label?: string }; // default 'Ganti peran'
```

- Varian `ghost`, ukuran `md`, dipakai sebagai `headerRight` di **kedua** tab layout.
- Alasan dibuat komponen: header dimiliki P1 (`(praktikan)`) dan P2 (`(asisten)`); tanpa komponen bersama akan ada dua implementasi berbeda.
- Tidak ada di PRD §9 sebelumnya → **sudah diamendemen**: PRD §9 kini menyebut `GantiPeranButton` sebagai komponen reusable di header kedua tab.

---

## 6. Interaction states

| State | Representasi | Catatan |
|---|---|---|
| Default | token normal | — |
| Pressed | `active:opacity-80` + `android_ripple` | Wajib untuk semua `Pressable` |
| Selected | `bg-backgroundSelected` | Untuk opsi picker |
| Disabled | `opacity-40` + **alasan teks** | Alasan wajib; tanpa alasan dilarang |
| Focus | `border-2 border-primary` | Hanya untuk input |
| Success | `Banner tone="success"` + perubahan state nyata | — |
| Error | `Banner tone="danger"` berisi `pesan` dari store | — |
| **Loading** | **tidak ada** | PRD §9: operasi sinkron. Spinner/skeleton palsu dilarang |

**Aturan feedback:** setiap aksi yang mengubah status sesi atau presensi harus menghasilkan (a) perubahan data yang terlihat, **dan** (b) `Banner` berisi pesan hasil. Tombol yang hanya "berubah warna" tanpa perubahan data dianggap gagal desain.

**Kontras (terukur):**

| Pasangan | Rasio | Status |
|---|---|---|
| `primaryText` di atas `primary` (light) | **5.02:1** | Lulus AA teks normal |
| `primaryText` di atas `primary` (dark) | 7.52:1 | Lulus |
| `success` di `successSurface` (light) | 4.56:1 | Lulus |
| `danger` di `dangerSurface` (light) | 5.75:1 | Lulus |
| `warning` di `warningSurface` (light) | 5.44:1 | Lulus |
| `textSecondary` di `background` (light) | 5.94:1 | Lulus |
| `border` di `background` (light) | **1.39:1** | Gagal 1.4.11 — border bukan pembatas tunggal |

---

## 7. Domain-specific UI

### 7.1 Status sesi

State machine `belum-dibuka → dibuka → ditutup` (PRD §7). Tampilan **selalu** badge + label:

| Status | Badge | Aksi asisten | Aksi praktikan |
|---|---|---|---|
| `belum-dibuka` | `neutral` "Belum dibuka" | `AppButton primary` "Buka sesi" | Tombol presensi disabled + "Sesi belum dibuka" |
| `dibuka` | `success` "Dibuka" | `AppButton danger` "Tutup sesi" | `AppButton primary` "Presensi" atau disabled "Sudah presensi" |
| `ditutup` | `danger` "Ditutup" | Tidak ada tombol aksi | Tombol disabled + "Sesi sudah ditutup" |

- Aksi yang tidak valid **tidak dirender** atau dirender `disabled` dengan alasan. Jangan merender tombol aktif yang pasti gagal.
- Tombol buka/tutup **selalu** lewat `BottomSheet` konfirmasi.

### 7.2 Tombol buka/tutup sesi

- Buka: `variant="primary"`, label "Buka sesi", konfirmasi "Lanjutkan".
- Tutup: `variant="danger"`, label "Tutup sesi", konfirmasi "Tutup sesi", `destructive`. Deskripsi sheet menyebut sesi tidak dapat dibuka kembali.
- Setelah sukses: badge berubah + waktu buka/tutup tampil (`text-small text-textSecondary`) + banner sukses.

### 7.3 Presensi praktikan

- Alur: tombol "Presensi" → `BottomSheet` berisi **nama sesi + nama praktikan** → "Konfirmasi".
- Setelah sukses: banner "Presensi tercatat pukul HH:mm", jam tampil di detail, tombol jadi "Sudah presensi" + `disabled` **tanpa** alasan tambahan (statusnya sudah jelas dari label).
- Penolakan ganda: banner `danger` dari store, tombol kembali `disabled`, jam awal tidak berubah.

### 7.4 Waktu presensi

- Disimpan ISO 8601, ditampilkan `HH:mm` (PRD §8.3).
- Tidak ada label "terlambat"/"tepat waktu" di Sprint 1.
- Selalu `text-small text-textSecondary` saat jadi meta; `text-body` saat jadi bukti utama (setelah presensi).

### 7.5 Rekap kehadiran

- Ringkasan "N hadir dari M peserta" → `text-body`, dengan N memakai `font-semibold`.
- Daftar peserta: baris `flex-row justify-between py-two border-b border-border`, nama `text-body`, jam `text-small text-textSecondary`.
- Urut naik berdasarkan waktu.
- Kosong → `EmptyState` dengan teks PRD §10.

### 7.6 Pencegahan presensi ganda di UI

- Sumber kebenaran tetap store (`{ ok, pesan }`). UI hanya mencerminkan `sudahPresensi(sesiId, praktikanId)`.
- Dilarang menyimpan flag lokal "sudah presensi" di state layar.
- Tombol tidak boleh hilang setelah presensi — ubah ke `disabled` + label "Sudah presensi" agar pengguna tahu alasannya.

---

## 8. Navigation and layout

### 8.1 Struktur

```
Root Stack (src/app/_layout.tsx)   ← P1, provider store + import global.css
└── index                          ← pilih peran + identitas (P1)
├── (praktikan) Tabs               ← P1
│   ├── jadwal                     daftar sesi
│   ├── jadwal/[id]                detail + Presensi
│   └── kehadiran                  riwayat
└── (asisten) Tabs                 ← P2
    ├── jadwal                     daftar sesi diampu
    ├── jadwal/[id]                detail + Buka/Tutup + rekap sesi
    └── rekap                      ringkasan per sesi
```

- Detail sesi adalah **stack** di dalam tab, bukan modal.
- Bottom sheet hanya untuk konfirmasi, bukan navigasi.
- `GantiPeranButton` di `headerRight` kedua tab. Aksi: `setUser(null)` lalu kembali ke `index`.
- Guard: bila `user === null`, root me-redirect ke `index`.

### 8.2 Perbedaan peran

| Aspek | Praktikan | Asisten |
|---|---|---|
| Tab | Jadwal, Kehadiran (2) | Jadwal, Rekap (2) |
| Aksi di detail | Presensi | Buka/Tutup sesi + rekap peserta |
| Header | Judul tab + Ganti peran | sama |
| Gaya visual | **identik** — dibedakan hanya oleh label & aksi | sama |

Jumlah tab maksimal 3 agar label tidak terpotong (Material: 3–5).

### 8.3 Safe area & layout

- `Screen` menangani safe area; jangan menambah `SafeAreaView` di layar anak.
- Tab bar tidak boleh menutupi konten terakhir → padding bawah `BottomTabInset + spacing.three`.
- Semua layout `flexbox`; dilarang `position: absolute` kecuali scrim & badge overlay.
- Konten `self-center` + `maxWidth` 800 pada layar lebar (web/tablet).

### 8.4 Scrolling & keyboard

- Daftar jadwal & rekap wajib `FlatList` (bukan `map` di `ScrollView`) agar performa tetap baik.
- Form hanya di `index` (pilih peran/identitas) — gunakan `KeyboardAvoidingView` dengan `behavior` `padding` (iOS) / `height` (Android).
- Input tidak boleh tertutup keyboard; pastikan aksi utama tetap terlihat.
- Saat `BottomSheet` terbuka, konten di belakang tidak di-scroll (scrim menutup).

---

## 9. Light / dark mode

- Sumber: `darkMode: 'media'` di `tailwind.config.js` → mengikuti `prefers-color-scheme`. Tidak ada toggle manual di dalam aplikasi.
- Nilai dark di-override lewat `@media (prefers-color-scheme: dark)` pada CSS variable `--color-*` di `src/global.css`.
- **Jangan** memakai prefix `dark:` di komponen. Semua perbedaan tema sudah ditangani variable; `dark:bg-black` akan menduplikasi logika dan melanggar satu sumber.

**Aturan kontras:**
- Teks utama harus ≥ 7:1 (AAA) bila memungkinkan; minimum 4.5:1.
- Teks sekunder minimum 4.5:1 — semua pasangan `textSecondary` terukur lulus (5.2–10.1:1).
- Warna status **tidak boleh** dipakai di atas `background` polos; selalu di dalam `*Surface` pasangannya.
- Komponen baru wajib diuji di kedua mode; screenshot PR memuat iOS **dan** Android/web (GIT-WORKFLOW §3).

---

## 10. Accessibility

| Aspek | Aturan |
|---|---|
| Target sentuh | Minimal 44×44 pt. Tombol `md` = 44, `lg` = 48. Baris daftar minimal 56pt. |
| Label | Semua `Pressable` punya `accessibilityRole`; tombol ikon wajib `accessibilityLabel`. |
| Status | Badge selalu berlabel teks; jangan membedakan status hanya dengan warna (PRD §13.7). |
| Kontras teks | Min 4.5:1 (normal), 3:1 (≥18.66px bold / ≥24px). |
| Kontras UI | Border/outline min 3:1 — **`border` saat ini 1.39:1**, jadi border bukan satu-satunya pembatas. |
| Skala font | Jangan mematikan `allowFontScaling`. Layout harus tetap utuh pada font size besar (uji 1.3×). |
| Urutan baca | Urutan elemen mengikuti urutan visual; jangan memakai `position: absolute` untuk konten informatif. |
| Bottom sheet | `accessibilityViewIsModal`; fokus awal ke judul atau tombol konfirmasi. |

**Kontras `primary` (sudah diperbaiki):** `primary` light `#1470C8` dengan `primaryText` putih = **5.02:1**, lulus AA untuk teks normal. Nilai sebelumnya `#208AEF` hanya 3.53:1 dan gagal; perubahan ini disetujui PM (lihat §13, D-1). Karena itu `primary` **selalu** dipasangkan dengan `primaryText` — jangan menaruh `text` atau hex lain di atasnya.

---

## 11. NativeWind conventions

1. **`className` dulu.** `StyleSheet.create` hanya untuk nilai yang tidak bisa menjadi class: nilai dinamis dari store (mis. `tintColor`), animasi, dan style callback `Pressable`.
2. **Gunakan token semantik**, bukan skala default: `bg-background` (bukan `bg-white`), `text-textSecondary` (bukan `text-gray-500`), `p-three` (bukan `p-4`).
3. **Dilarang arbitrary value:** `p-[13px]`, `text-[#123456]`, `bg-[rgb(...)]`, `w-[347px]`. Bila butuh nilai baru, tambahkan token ke `tokens.js` (butuh approval P3 + PM).
4. **Warna baru butuh 3 langkah:** `tokens.js` (light+dark) → channel RGB di `global.css` (light+dark) → dokumentasikan di §3.1. Tanpa ketiganya, warna tidak akan konsisten di dark mode.
5. **Jangan pakai prefix `dark:`** (lihat §9).
6. **Urutan utility:** layout → spacing → warna → tipografi → state. Konsisten walaupun Tailwind tidak mewajibkan.
7. **`global.css` hanya diimpor di `_layout.tsx`.** Menambah import di tempat lain menyebabkan urutan CSS rusak.
8. **Jangan mengubah** `babel.config.js`, `metro.config.js`, `tailwind.config.js`, `nativewind-env.d.ts` tanpa approval PM (CODEOWNERS: P1).
9. **Prettier plugin** `prettier-plugin-tailwindcss` sudah terpasang; biarkan ia mengurutkan class, jangan mengurutkan manual.
10. **Config memakai `extend`**, sehingga skala default Tailwind (mis. `p-4`, `text-base`) masih valid secara teknis. Itu **bukan** alasan memakainya — aturan #2 tetap berlaku.

---

## 12. Do / Don't

### Do

```tsx
// Kartu jadwal: status selalu berlabel
<Card onPress={() => router.push(`/jadwal/${sesi.id}`)}>
  <View className="flex-row items-start justify-between gap-two">
    <View className="flex-1 gap-one">
      <Text className="text-body font-semibold text-text">{sesi.namaPraktikum}</Text>
      <Text className="text-small text-textSecondary">
        {sesi.kelas} · {sesi.lab}
      </Text>
    </View>
    <StatusBadge tone="success" label="Dibuka" />
  </View>
</Card>
```

```tsx
// Tombol nonaktif selalu punya alasan
<AppButton
  label="Presensi"
  variant="primary"
  size="lg"
  fullWidth
  onPress={bukaKonfirmasi}
  disabled={sesi.status !== 'dibuka'}
  disabledReason={
    sesi.status === 'belum-dibuka' ? 'Sesi belum dibuka' : 'Sesi sudah ditutup'
  }
/>
```

```tsx
// Feedback dari store, bukan tebakan layar
const hasil = catatPresensi(sesi.id, user.id);
setBanner(hasil); // { ok, pesan }
```

### Don't

```tsx
// ❌ Warna hardcode + palet default Tailwind
<View className="bg-blue-500 p-4">
  <Text className="text-white text-base">Presensi</Text>
</View>

// ❌ Status hanya lewat warna
<View className="w-two h-two rounded-pill bg-green-500" />

// ❌ Loading palsu
{loading && <ActivityIndicator />}

// ❌ Prefix dark: menduplikasi logika tema
<View className="bg-white dark:bg-black" />

// ❌ Arbitrary value
<Text className="text-[#1470C8] mt-[13px]">Jam</Text>

// ❌ Alert sistem untuk feedback
Alert.alert('Berhasil', 'Presensi tercatat');

// ❌ State lokal duplikat
const [sudahPresensi, setSudahPresensi] = useState(false);

// ❌ Dua tombol primary bersaing
<AppButton label="Batal" variant="primary" />
<AppButton label="Lanjutkan" variant="primary" />
```

---

## 13. Keputusan desain & status persetujuan PM

| # | Isu | Dampak | Status |
|---|---|---|---|
| D-1 | Kontras `primary`/`primaryText` light | Semua tombol utama | **Disetujui.** `lightColors.primary` → `#1470C8` (putih = 5.02:1, lulus AA). Opsi (b) `primaryText` → `#00131F` dan (c) terima deviasi tidak dipakai. Sinkron di `tokens.js`, `global.css`, splash `app.json` |
| D-2 | Tidak ada token elevation/shadow | Tampilan lebih flat dari referensi Material | **Disetujui.** Hierarki lewat surface + border. Shadow tidak ditambahkan |
| D-3 | `GantiPeranButton` tidak ada di PRD §9 | Komponen baru di luar PRD | **Disetujui.** Komponen reusable; PRD §9 diamendemen |
| D-4 | Tidak ada token spacing 12 | Tidak bisa mengikuti `md:12` Material | **Disetujui.** Token spacing tetap 7; jarak memakai 8/16 |
| D-5 | `border` 1.39:1 tidak bisa jadi pembatas tunggal | Input wajib filled | **Disetujui.** Input filled, bukan outlined |
| D-6 | Skala default Tailwind masih aktif (config `extend`) | `p-4`/`text-base` bisa lolos | **Tertunda.** `extend` dipertahankan; butuh PR terpisah bila ingin theme tertutup |
| D-7 | `warning` belum dipakai di Sprint 1 | Token tidak terpakai | **Disetujui.** Biarkan sebagai cadangan; jangan hapus |
| D-8 | Bottom sheet = `Modal` RN, bukan library | Kualitas animasi lebih rendah dari library | **Disetujui.** Tanpa dependency baru |
| D-9 | `src/components/animated-icon.tsx:143` masih `#208AEF` (overlay splash) | Selisih biru sesaat saat splash | **Tertunda.** File template, akan dihapus P1 saat scaffold. Tidak diubah di tindak lanjut ini |

---

## 14. Ringkasan token & komponen

**Token:** 15 warna semantik (light+dark), 7 spacing, 4 radius, 6 tipografi, 4 weight. **Tidak ada** token shadow/elevation.

**Komponen (9):** `Screen`, `AppButton`, `Card`, `StatusBadge`, `EmptyState`, `BottomSheet`, `Field`, `Banner`, `GantiPeranButton`.

**Pemilik:** semua di `src/components/ui/**` → P3 (CODEOWNERS). Token di `src/constants/tokens.js` → P3. Konfigurasi styling → P1.
