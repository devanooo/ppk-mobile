import { ActivityIndicator, Pressable, Text, View, useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

type AppButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'auth';
type WarnaIndikator = 'primaryText' | 'primary' | 'danger' | 'loginBackground';

type AppButtonProps = {
  label: string;
  onPress: () => void;
  variant?: AppButtonVariant;
  disabled?: boolean;
  disabledReason?: string;
  accessibilityLabel?: string;
  className?: string;
  loading?: boolean;
};

const VARIANTS: Record<
  AppButtonVariant,
  { wadah: string; teks: string; indikator: WarnaIndikator }
> = {
  primary: {
    wadah: 'min-h-touch bg-primary',
    teks: 'text-body text-primaryText',
    indikator: 'primaryText',
  },
  secondary: {
    wadah: 'min-h-touch border border-primary bg-transparent',
    teks: 'text-body text-primary',
    indikator: 'primary',
  },
  ghost: {
    wadah: 'min-h-touch bg-transparent',
    teks: 'text-body text-primary',
    indikator: 'primary',
  },
  danger: {
    wadah: 'min-h-touch bg-transparent',
    teks: 'text-body text-danger',
    indikator: 'danger',
  },
  auth: {
    wadah: 'min-h-button bg-loginInk',
    teks: 'text-authButton font-semibold text-loginBackground',
    indikator: 'loginBackground',
  },
};

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  disabledReason,
  accessibilityLabel,
  className = '',
  loading = false,
}: AppButtonProps) {
  const skema = useColorScheme();
  const palet = skema === 'dark' ? Colors.dark : Colors.light;
  const gaya = VARIANTS[variant];

  return (
    <View className={className}>
      <Pressable
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityRole="button"
        accessibilityState={{ busy: loading, disabled }}
        disabled={disabled}
        onPress={onPress}
        className={`flex-row items-center justify-center rounded-pill px-four active:scale-95 ${gaya.wadah} ${disabled ? 'opacity-40' : ''}`}
      >
        {loading ? (
          <ActivityIndicator
            className="mr-two"
            color={palet[gaya.indikator]}
            size="small"
          />
        ) : null}
        <Text className={gaya.teks}>{label}</Text>
      </Pressable>

      {disabled && disabledReason ? (
        <Text className="mt-two text-center text-caption text-textSecondary">{disabledReason}</Text>
      ) : null}
    </View>
  );
}

export type { AppButtonProps, AppButtonVariant };
