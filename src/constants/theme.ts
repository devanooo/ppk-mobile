/**
 * Token desain bertipe — RE-EXPORT dari `src/constants/tokens.js`.
 *
 * Sumber kebenaran tunggal ada di `tokens.js` karena file itu juga dibaca
 * `tailwind.config.js` (CommonJS). Untuk komponen JSX gunakan className
 * Tailwind; modul ini dipakai untuk logika non-JSX (mis. tintColor dinamis,
 * warna badge per status, atau nilai yang dihitung).
 *
 * Jangan menambah nilai desain baru di sini — tambahkan ke `tokens.js`.
 */

import { Platform } from 'react-native';

import tokens from './tokens';

export const Colors = {
  light: tokens.lightColors,
  dark: tokens.darkColors,
};
export const Spacing = tokens.spacing;
export const Radius = tokens.radius;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;
export type ThemeMode = keyof typeof Colors;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
});

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
