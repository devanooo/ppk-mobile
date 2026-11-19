
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
  error?: string;
  maxLength?: number;
  onFocus?: () => void;
  variant?: TextFieldVariant;
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
  error,
  maxLength,
  onFocus,
  variant = 'default',
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

  const kelasInput = gayaAuth
    ? `min-h-touch rounded-lg text-body text-loginInk ${
        error
          ? 'border-danger'
          : fokus
            ? 'border-loginInk'
            : 'border-loginField'
      } ${tampilkanToggle ? 'pl-fieldPadding pr-six' : 'px-fieldPadding'}`
    : `min-h-touch rounded-md border bg-backgroundElement text-body text-text ${
        error ? 'border-danger' : 'border-border'
      } ${tampilkanToggle ? 'pl-twoHalf pr-six' : 'px-twoHalf'}`;

  return (
    <View className={className}>
      <Text className={`mb-two ${kelasLabel}`}>{label}</Text>

      <View>
        <TextInput
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityHint={error}
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
          className={gayaAuth ? `${kelasInput} border bg-loginField` : kelasInput}
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
      ) : null}
    </View>
  );
}

export type { TextFieldProps };
