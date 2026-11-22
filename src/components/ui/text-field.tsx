
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import {
  Pressable,
  Text,
  TextInput,
  View,
  useColorScheme,
  type TextInputProps,
} from 'react-native';

import { Colors } from '@/constants/theme';

type TextFieldVariant = 'default' | 'auth';
type TextFieldTone = 'default' | 'muted';

type TextFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  inputMode?: TextInputProps['inputMode'];
  accessibilityLabel?: string;
  className?: string;
  inputClassName?: string;
  inputTone?: TextFieldTone;
  error?: string;
  maxLength?: number;
  onFocus?: () => void;
  variant?: TextFieldVariant;
  /** Teks bantuan di bawah field. Tidak tampil bila ada `error`. */
  helper?: string;
  /** Menampilkan `panjang/maxLength` di bawah field. Butuh `maxLength`. */
  showCounter?: boolean;
};

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  showPasswordToggle = false,
  autoCapitalize = 'none',
  inputMode = 'text',
  accessibilityLabel,
  className = '',
  inputClassName = '',
  inputTone = 'default',
  error,
  maxLength,
  onFocus,
  variant = 'default',
  helper,
  showCounter = false,
}: TextFieldProps) {
  const skema = useColorScheme();
  const palet = skema === 'dark' ? Colors.dark : Colors.light;
  const [kataSandiTerlihat, setKataSandiTerlihat] = useState(false);
  const [fokus, setFokus] = useState(false);

  const tampilkanToggle = secureTextEntry && showPasswordToggle;
  const gayaAuth = variant === 'auth';

  const warnaPlaceholder = gayaAuth ? palet.loginMuted : palet.textSecondary;
  const warnaAksen = warnaPlaceholder;

  const kelasLabel = gayaAuth
    ? 'text-caption font-semibold text-loginInk'
    : 'text-caption text-textSecondary';

  const kelasMeta = gayaAuth ? 'text-loginMuted' : 'text-textSecondary';

  const kelasInput = gayaAuth
    ? `min-h-touch rounded-lg text-body text-loginInk ${
        error
          ? 'border-danger'
          : fokus
            ? 'border-loginInk'
            : 'border-loginField'
      } ${tampilkanToggle ? 'pl-fieldPadding pr-six' : 'px-fieldPadding'}`
    : `min-h-touch rounded-md border ${
        inputTone === 'muted' ? 'bg-surfaceMuted' : 'bg-backgroundElement'
      } text-body text-text ${
        error ? 'border-danger' : 'border-border'
      } ${tampilkanToggle ? 'pl-twoHalf pr-six' : 'px-twoHalf'}`;

  const tampilkanCounter = showCounter && Boolean(maxLength);
  const tampilkanMeta = !error && (Boolean(helper) || tampilkanCounter);

  return (
    <View className={className}>
      <Text className={`mb-two ${kelasLabel}`}>{label}</Text>

      <View>
        <TextInput
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityHint={error ?? helper}
          autoCapitalize={autoCapitalize}
          inputMode={inputMode}
          maxLength={maxLength}
          onBlur={() => setFokus(false)}
          onChangeText={onChangeText}
          onFocus={() => {
            setFokus(true);
            onFocus?.();
          }}
          placeholder={placeholder}
          placeholderTextColor={warnaPlaceholder}
          secureTextEntry={secureTextEntry && !kataSandiTerlihat}
          selectionColor={gayaAuth ? palet.loginInk : undefined}
          style={gayaAuth ? { textAlignVertical: 'center' } : undefined}
          value={value}
          className={`${gayaAuth ? `${kelasInput} border bg-loginField` : kelasInput} ${inputClassName}`}
        />

        {tampilkanToggle ? (
          <Pressable
            accessibilityLabel={
              kataSandiTerlihat ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'
            }
            accessibilityRole="button"
            onPress={() => setKataSandiTerlihat((terlihat) => !terlihat)}
            className="absolute inset-y-0 right-0 w-touch items-center justify-center active:opacity-60"
          >
            <SymbolView
              name={{
                ios: kataSandiTerlihat ? 'eye.slash' : 'eye',
                android: kataSandiTerlihat ? 'visibility_off' : 'visibility',
              }}
              size={20}
              tintColor={warnaAksen}
            />
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <Text
          accessibilityRole="alert"
          className="mt-one text-caption text-danger"
        >
          {error}
        </Text>
      ) : tampilkanMeta ? (
        <View className="mt-one flex-row items-start justify-between gap-two">
          {helper ? (
            <Text className={`flex-1 text-caption ${kelasMeta}`}>{helper}</Text>
          ) : (
            <View className="flex-1" />
          )}

          {tampilkanCounter ? (
            <Text className={`shrink-0 text-caption ${kelasMeta}`}>
              {value.length}/{maxLength}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

export type { TextFieldProps, TextFieldTone, TextFieldVariant };
