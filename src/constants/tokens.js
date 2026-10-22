/**
 * Token desain — SUMBER TUNGGAL.
 *
 * File ini sengaja CommonJS (.js) supaya bisa dibaca dua konsumen sekaligus:
 *   1. `tailwind.config.js`  → menghasilkan utility class (sumber kebenaran styling)
 *   2. `src/constants/theme.ts` → re-export bertipe untuk logika non-JSX
 *
 * Arah dependensi hanya satu: tokens.js → config/theme. Jangan menulis nilai
 * desain langsung di tailwind.config.js atau theme.ts.
 *
 * Aturan proyek: warna/tipografi/radius HARUS berasal dari sini. Dilarang
 * memakai hex atau arbitrary value di komponen.
 */

/**
 * Palet semantik. NativeWind/Tailwind hanya membaca warna pada level atas,
 * jadi token warna memakai CSS variable yang nilainya di-override saat dark mode.
 * Nama variabel = nama token (dipakai lagi oleh `theme.ts`).
 */
const lightColors = {
  text: '#1d1d1f',
  textSecondary: '#6e6e73',
  textInverse: '#ffffff',
  background: '#f5f5f7',
  backgroundElement: '#ffffff',
  backgroundSelected: '#e8e8ed',
  border: '#d2d2d7',
  primary: '#0066cc',
  primaryText: '#ffffff',
  success: '#248a3d',
  successSurface: '#E4F5EC',
  danger: '#d70015',
  dangerSurface: '#FDECEA',
  warning: '#b25000',
  warningSurface: '#FFF4E0',
};

const darkColors = {
  text: '#f5f5f7',
  textSecondary: '#cccccc',
  textInverse: '#1d1d1f',
  background: '#000000',
  backgroundElement: '#272729',
  backgroundSelected: '#2a2a2c',
  border: '#3a3a3c',
  primary: '#2997ff',
  primaryText: '#00131F',
  success: '#30d158',
  successSurface: '#10291E',
  danger: '#ff453a',
  dangerSurface: '#2E1715',
  warning: '#ff9f0a',
  warningSurface: '#2B2213',
};

/**
 * Skala spacing (pt). 4-based. `touch` = tinggi minimum target sentuh,
 * `sheetMax` = tinggi maksimum bottom sheet (relatif terhadap layar).
 */
const spacing = {
  half: 2,
  one: 4,
  two: 8,
  twoHalf: 12,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
  touch: 44,
  sheetMax: '85%',
};

/** Satu-satunya bayangan: dropdown profil dan bottom sheet. */
const shadow = {
  color: '#000000',
  opacity: 0.22,
  offsetX: 3,
  offsetY: 5,
  radius: 30,
  elevation: 24,
};

/** Radius (pt). Kartu 16, input 12, sheet 24, tombol dan badge pill. */
const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
};

/** Skala tipografi. `lineHeight` selalu eksplisit. */
const fontSize = {
  caption: [13, 18],
  small: [15, 20],
  body: [17, 24],
  subtitle: [22, 26],
  title: [28, 36],
  display: [34, 40],
};

const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

module.exports = { lightColors, darkColors, spacing, radius, fontSize, fontWeight, shadow };

