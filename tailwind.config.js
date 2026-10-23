const tokens = require('./src/constants/tokens');

/** Utility color: `var(--color-<token>)` supaya dark mode cukup menimpa variable. */
const colorUtilities = Object.fromEntries(
  Object.keys(tokens.lightColors).map((name) => [name, `rgb(var(--color-${name}) / <alpha-value>)`])
);

/** Scrim modal: warna dasar dari CSS variable, alpha diatur lewat `bg-overlay/<opacity>`. */
const overlayUtility = { overlay: 'rgb(var(--color-overlay) / <alpha-value>)' };

/**
 * Tailwind menulis lineHeight angka tanpa satuan, lalu NativeWind membacanya
 * sebagai em (40 menjadi 40em). Pakai px agar ukuran baris tetap sesuai token.
 */
const fontSizes = Object.fromEntries(
  Object.entries(tokens.fontSize).map(([name, [size, lineHeight]]) => [
    name,
    [`${size}px`, { lineHeight: `${lineHeight}px` }],
  ])
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'media',
  theme: {
    extend: {
      colors: { ...colorUtilities, ...overlayUtility },
      spacing: tokens.spacing,
      borderRadius: tokens.radius,
      fontSize: fontSizes,
      fontWeight: tokens.fontWeight,
    },
  },
  plugins: [],
};
