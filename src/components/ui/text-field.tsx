import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, Text, TextInput, View, useColorScheme, type TextInputProps } from 'react-native';

import { Colors } from '@/constants/theme';

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
}: TextFieldProps) {
  const skema = useColorScheme();
  const warnaSekunder = (skema === 'dark' ? Colors.dark : Colors.light).textSecondary;
  const [kataSandiTerlihat, setKataSandiTerlihat] = useState(false);
  const tampilkanToggle = secureTextEntry && showPasswordToggle;

  return (
    <View className={className}>
      <Text className="mb-two text-caption text-textSecondary">{label}</Text>
      <View>
        <TextInput
          accessibilityLabel={accessibilityLabel ?? label}
          autoCapitalize={autoCapitalize}
          inputMode={inputMode}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={warnaSekunder}
          secureTextEntry={secureTextEntry && !kataSandiTerlihat}
          value={value}
          className={`min-h-touch rounded-md border border-border bg-backgroundElement text-body text-text ${
            tampilkanToggle ? 'pl-twoHalf pr-six' : 'px-twoHalf'
          }`}
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
              tintColor={warnaSekunder}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

export type { TextFieldProps };
