import { Pressable, Text, View } from 'react-native';

type AppButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

type AppButtonProps = {
  label: string;
  onPress: () => void;
  variant?: AppButtonVariant;
  disabled?: boolean;
  disabledReason?: string;
  accessibilityLabel?: string;
  className?: string;
};

const VARIANTS: Record<AppButtonVariant, { wadah: string; teks: string }> = {
  primary: { wadah: 'bg-primary', teks: 'text-primaryText' },
  secondary: { wadah: 'border border-primary bg-transparent', teks: 'text-primary' },
  ghost: { wadah: 'bg-transparent', teks: 'text-primary' },
  danger: { wadah: 'bg-transparent', teks: 'text-danger' },
};

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  disabledReason,
  accessibilityLabel,
  className = '',
}: AppButtonProps) {
  const gaya = VARIANTS[variant];

  return (
    <View className={className}>
      <Pressable
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        className={`min-h-touch flex-row items-center justify-center rounded-pill px-four active:scale-95 ${gaya.wadah} ${disabled ? 'opacity-40' : ''}`}
      >
        <Text className={`text-body ${gaya.teks}`}>{label}</Text>
      </Pressable>

      {disabled && disabledReason ? (
        <Text className="mt-two text-center text-caption text-textSecondary">{disabledReason}</Text>
      ) : null}
    </View>
  );
}

export type { AppButtonProps, AppButtonVariant };
