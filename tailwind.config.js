const tokens = require('./src/constants/tokens');

/** Utility color: `var(--color-<token>)` supaya dark mode cukup menimpa variable. */
const colorUtilities = Object.fromEntries(
  Object.keys(tokens.lightColors).map((name) => [name, `rgb(var(--color-${name}) / <alpha-value>)`])
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'media',
  theme: {
    extend: {
      colors: colorUtilities,
      spacing: tokens.spacing,
      borderRadius: tokens.radius,
      fontSize: tokens.fontSize,
      fontWeight: tokens.fontWeight,
    },
  },
  plugins: [],
};
