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
  text: '#000000',
  textSecondary: '#60646C',
  textInverse: '#FFFFFF',
  background: '#FFFFFF',
  backgroundElement: '#F0F0F3',
  backgroundSelected: '#E0E1E6',
  border: '#D9DBE0',
  primary: '#208AEF',
  primaryText: '#FFFFFF',
  success: '#147D4F',
  successSurface: '#E4F5EC',
  danger: '#B42318',
  dangerSurface: '#FDECEA',
  warning: '#8A5A00',
  warningSurface: '#FFF4E0',
};

const darkColors = {
  text: '#FFFFFF',
  textSecondary: '#B0B4BA',
  textInverse: '#000000',
  background: '#000000',
  backgroundElement: '#212225',
  backgroundSelected: '#2E3135',
  border: '#3A3D42',
  primary: '#5CA8F5',
  primaryText: '#00131F',
  success: '#5FD39B',
  successSurface: '#10291E',
  danger: '#FF8B80',
  dangerSurface: '#2E1715',
  warning: '#F0C070',
  warningSurface: '#2B2213',
};

/** Skala spacing (pt). 4-based. */
const spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
};

/** Radius (pt). */
const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
};

/** Skala tipografi. `lineHeight` selalu eksplisit. */
const fontSize = {
  caption: [12, 16],
  small: [14, 20],
  body: [16, 24],
  subtitle: [20, 28],
  title: [28, 36],
  display: [34, 42],
};

const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

module.exports = { lightColors, darkColors, spacing, radius, fontSize, fontWeight };

