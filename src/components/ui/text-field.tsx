import { Text, TextInput, View, useColorScheme, type TextInputProps } from 'react-native';

import { Colors } from '@/constants/theme';

type TextFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
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
  autoCapitalize = 'none',
  inputMode = 'text',
  accessibilityLabel,
  className = '',
}: TextFieldProps) {
  const skema = useColorScheme();
  const warnaPlaceholder = (skema === 'dark' ? Colors.dark : Colors.light).textSecondary;

  return (
    <View className={className}>
      <Text className="mb-two text-caption text-textSecondary">{label}</Text>
      <TextInput
        accessibilityLabel={accessibilityLabel ?? label}
        autoCapitalize={autoCapitalize}
        inputMode={inputMode}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={warnaPlaceholder}
        secureTextEntry={secureTextEntry}
        value={value}
        className="min-h-touch rounded-md border border-border bg-backgroundElement px-twoHalf text-body text-text"
      />
    </View>
  );
}

export type { TextFieldProps };
