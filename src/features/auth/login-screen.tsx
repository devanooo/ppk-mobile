import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Banner } from '@/components/ui';
import { Colors, MaxContentWidth } from '@/constants/theme';
import type { HasilLogin } from '@/store/session-store';
import type { User } from '@/types';

const WARNA_NAVY = Colors.light.loginInk;
const WARNA_MUTED = Colors.light.loginMuted;

const BAYANGAN_LEMBUT: ViewStyle = {
  shadowColor: WARNA_NAVY,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 2,
};

type LoginScreenProps = {
  onMasuk: (email: string, password: string) => Promise<HasilLogin>;
  onBerhasil: (user: User) => void;
  onKembali: () => void;
};

type AuthFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoComplete?: TextInputProps['autoComplete'];
  inputMode?: TextInputProps['inputMode'];
  keyboardType?: TextInputProps['keyboardType'];
  textContentType?: TextInputProps['textContentType'];
  returnKeyType?: TextInputProps['returnKeyType'];
  onSubmitEditing?: TextInputProps['onSubmitEditing'];
  accessibilityLabel?: string;
};

export function LoginScreen({
  onMasuk,
  onBerhasil,
  onKembali,
}: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pesanGagal, setPesanGagal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const bisaMasuk =
    email.trim().length > 0 && password.length > 0 && !loading;

  async function kirim() {
    if (!bisaMasuk) return;

    setLoading(true);
    setPesanGagal(null);

    try {
      const hasil = await onMasuk(email.trim(), password);

      if (!hasil.ok) {
        setPesanGagal(hasil.pesan);
        return;
      }

      onBerhasil(hasil.user);
    } catch {
      setPesanGagal('Terjadi kesalahan. Silakan coba kembali.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-loginBackground">
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerClassName="grow px-four pb-five pt-three"
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View
              className="w-full self-center"
              style={{ maxWidth: MaxContentWidth }}
            >
              <Pressable
                accessibilityLabel="Kembali ke halaman awal"
                accessibilityRole="button"
                onPress={onKembali}
                style={BAYANGAN_LEMBUT}
                className="h-touch w-touch items-center justify-center self-start rounded-pill bg-loginField active:scale-95"
              >
                <SymbolView
                  name={{ ios: 'chevron.left', android: 'arrow_back' }}
                  size={22}
                  tintColor={WARNA_NAVY}
                />
              </Pressable>

              <View className="mt-five">
                <Text
                  accessibilityRole="header"
                  className="text-authTitle font-bold text-loginInk"
                >
                  Masuk
                </Text>
                <Text className="mt-two text-authBody text-loginMuted">
                  Masuk dengan akun praktikan atau asisten laboratorium.
                </Text>
              </View>

              <View className="mt-five gap-three">
                <AuthField
                  accessibilityLabel="Email"
                  autoCapitalize="none"
                  autoComplete="email"
                  inputMode="email"
                  keyboardType="email-address"
                  label="Email"
                  onChangeText={(nilai) => {
                    setEmail(nilai);
                    setPesanGagal(null);
                  }}
                  placeholder="Masukkan email"
                  textContentType="emailAddress"
                  value={email}
                />

                <AuthField
                  accessibilityLabel="Kata sandi"
                  autoComplete="current-password"
                  label="Kata sandi"
                  onChangeText={(nilai) => {
                    setPassword(nilai);
                    setPesanGagal(null);
                  }}
                  onSubmitEditing={kirim}
                  placeholder="Masukkan kata sandi"
                  returnKeyType="go"
                  secureTextEntry
                  showPasswordToggle
                  textContentType="password"
                  value={password}
                />
              </View>

              {pesanGagal ? (
                <Banner
                  className="mt-three"
                  jenis="gagal"
                  pesan={pesanGagal}
                />
              ) : null}

              <Pressable
                accessibilityLabel="Masuk"
                accessibilityRole="button"
                accessibilityState={{ busy: loading, disabled: !bisaMasuk }}
                disabled={!bisaMasuk}
                onPress={kirim}
                className={`mt-four min-h-button flex-row items-center justify-center rounded-pill bg-loginInk px-four active:scale-95 ${
                  bisaMasuk ? '' : 'opacity-40'
                }`}
              >
                {loading ? (
                  <ActivityIndicator
                    className="mr-two"
                    color={Colors.light.loginBackground}
                    size="small"
                  />
                ) : null}
                <Text className="text-authButton font-semibold text-loginBackground">
                  {loading ? 'Memproses...' : 'Masuk'}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function AuthField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  showPasswordToggle = false,
  autoCapitalize = 'none',
  autoComplete,
  inputMode = 'text',
  keyboardType,
  textContentType,
  returnKeyType,
  onSubmitEditing,
  accessibilityLabel,
}: AuthFieldProps) {
  const [terlihat, setTerlihat] = useState(false);
  const [fokus, setFokus] = useState(false);

  const tampilkanToggle = secureTextEntry && showPasswordToggle;

  return (
    <View>
      <Text className="mb-two text-caption font-semibold text-loginInk">
        {label}
      </Text>

      <View>
        <TextInput
          accessibilityLabel={accessibilityLabel ?? label}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          autoCorrect={false}
          inputMode={inputMode}
          keyboardType={keyboardType}
          onBlur={() => setFokus(false)}
          onChangeText={onChangeText}
          onFocus={() => setFokus(true)}
          onSubmitEditing={onSubmitEditing}
          placeholder={placeholder}
          placeholderTextColor={WARNA_MUTED}
          returnKeyType={returnKeyType}
          secureTextEntry={secureTextEntry && !terlihat}
          selectionColor={WARNA_NAVY}
          style={{ textAlignVertical: 'center' }}
          textContentType={textContentType}
          value={value}
          className={`min-h-field rounded-lg border bg-loginField text-body text-loginInk ${
            fokus ? 'border-loginInk' : 'border-loginField'
          } ${tampilkanToggle ? 'pl-fieldPadding pr-six' : 'px-fieldPadding'}`}
        />

        {tampilkanToggle ? (
          <Pressable
            accessibilityLabel={
              terlihat ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'
            }
            accessibilityRole="button"
            onPress={() => setTerlihat((sebelumnya) => !sebelumnya)}
            className="absolute inset-y-0 right-0 w-touch items-center justify-center active:opacity-60"
          >
            <SymbolView
              name={{
                ios: terlihat ? 'eye.slash' : 'eye',
                android: terlihat ? 'visibility_off' : 'visibility',
              }}
              size={20}
              tintColor={WARNA_MUTED}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

export type { LoginScreenProps };
