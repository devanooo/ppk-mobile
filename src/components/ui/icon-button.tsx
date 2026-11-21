import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

type IconButtonVariant = 'plain' | 'filled';

type IconButtonProps = {
  ikon: ReactNode;
  onPress: () => void;
  /** Label aksesibilitas, wajib karena tombol ini hanya berisi ikon. */
  label: string;
  variant?: IconButtonVariant;
  /** Titik notifikasi kecil di sudut kanan atas. */
  badge?: boolean;
  className?: string;
};

/** Tombol ikon 44dp, dipakai untuk kembali, lonceng, dan tombol tutup. */
export function IconButton({
  ikon,
  onPress,
  label,
  variant = 'plain',
  badge = false,
  className = '',
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      className={`h-touch w-touch items-center justify-center rounded-pill active:scale-95 ${
        variant === 'filled' ? 'bg-backgroundSelected' : 'bg-transparent'
      } ${className}`}
    >
      {ikon}

      {badge ? (
        <View
          accessible={false}
          className="absolute right-two top-two h-two w-two rounded-pill bg-danger"
        />
      ) : null}
    </Pressable>
  );
}

export type { IconButtonProps, IconButtonVariant };
