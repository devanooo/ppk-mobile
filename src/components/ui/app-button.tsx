import { ActivityIndicator, Pressable, Text, View, useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

type AppButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'dangerFilled'
  | 'auth';
type AppButtonSize = 'sm' | 'md' | 'lg';
type WarnaIndikator = 'primaryText' | 'primary' | 'danger' | 'loginBackground' | 'textInverse';

type AppButtonProps = {
  label: string;
  onPress: () => void;
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  accessibilityLabel?: string;
  className?: string;
  loading?: boolean;
};

/**
 * Warna dan isi tombol per varian. Tinggi dan ukuran teks diatur `size`, bukan
 * varian, supaya satu varian bisa dipakai pada tinggi berbeda.
 *
 * `danger` adalah aksi destruktif sekunder di dalam layar (teks merah, tanpa
 * isi), sesuai referensi 16, 19, dan 26. `dangerFilled` adalah aksi destruktif
 * pada konfirmasi, mis. tombol tolak di bottom sheet, sesuai referensi 21.
 */
const VARIANTS: Record<
  AppButtonVariant,
  { wadah: string; teks: string; indikator: WarnaIndikator }
> = {
  primary: {
    wadah: 'bg-primary',
    teks: 'text-primaryText',
    indikator: 'primaryText',
  },
  secondary: {
    wadah: 'border border-primary bg-transparent',
    teks: 'text-primary',
    indikator: 'primary',
  },
  ghost: {
    wadah: 'bg-transparent',
    teks: 'text-primary',
    indikator: 'primary',
  },
  danger: {
    wadah: 'bg-transparent',
    teks: 'text-danger',
    indikator: 'danger',
  },
  dangerFilled: {
    wadah: 'bg-danger',
    teks: 'text-textInverse',
    indikator: 'textInverse',
  },
  auth: {
    wadah: 'bg-loginInk',
    teks: 'text-authButton font-semibold text-loginBackground',
    indikator: 'loginBackground',
  },
};

/**
 * `lg` adalah default dan memberi tinggi 56dp sesuai referensi aksi utama.
 * `md` dan `sm` tetap 44dp untuk konteks padat seperti baris aksi di kartu.
 */
const SIZES: Record<AppButtonSize, { wadah: string; teks: string }> = {
  sm: { wadah: 'min-h-touch px-three', teks: 'text-small' },
  md: { wadah: 'min-h-touch px-four', teks: 'text-body' },
  lg: { wadah: 'min-h-button px-four', teks: 'text-body' },
};

/** Varian auth memakai tinggi dan tipografi sendiri agar layar auth tidak berubah. */
const UKURAN_AUTH = { wadah: 'min-h-button px-four', teks: '' };

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  fullWidth = false,
  disabled = false,
  disabledReason,
  accessibilityLabel,
  className = '',
  loading = false,
}: AppButtonProps) {
  const skema = useColorScheme();
  const palet = skema === 'dark' ? Colors.dark : Colors.light;
  const gaya = VARIANTS[variant];
  const ukuran = variant === 'auth' ? UKURAN_AUTH : SIZES[size];

  return (
    <View className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      <Pressable
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityRole="button"
        accessibilityState={{ busy: loading, disabled }}
        disabled={disabled}
        onPress={onPress}
        className={`flex-row items-center justify-center rounded-pill active:scale-95 ${ukuran.wadah} ${gaya.wadah} ${disabled ? 'opacity-40' : ''}`}
      >
        {loading ? (
          <ActivityIndicator
            className="mr-two"
            color={palet[gaya.indikator]}
            size="small"
          />
        ) : null}
        <Text className={`${ukuran.teks} ${gaya.teks}`}>{label}</Text>
      </Pressable>

      {disabled && disabledReason ? (
        <Text className="mt-two text-center text-caption text-textSecondary">{disabledReason}</Text>
      ) : null}
    </View>
  );
}

export type { AppButtonProps, AppButtonSize, AppButtonVariant };
