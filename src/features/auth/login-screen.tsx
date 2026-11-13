
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { AppButton, Banner, Screen, TextField } from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import type { HasilLogin } from '@/store/session-store';
import type { User } from '@/types';

type LoginScreenProps = {
  onMasuk: (email: string, password: string) => Promise<HasilLogin>;
  onBerhasil: (user: User) => void;
  onKembali: () => void;
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
    <Screen padded={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerClassName="grow px-three pb-five"
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            className="w-full self-center pt-three"
            style={{ maxWidth: MaxContentWidth }}
          >
            <Pressable
              accessibilityLabel="Kembali ke halaman awal"
              accessibilityRole="button"
              onPress={onKembali}
              className="-ml-one min-h-touch flex-row items-center self-start pl-one pr-two active:scale-95"
            >
              <Text className="text-body text-primary">‹</Text>
              <Text className="ml-one text-body text-primary">Kembali</Text>
            </Pressable>

            <View className="mt-four">
              <Text
                accessibilityRole="header"
                className="text-title font-semibold text-text"
              >
                Masuk
              </Text>
              <Text className="mt-two text-body text-textSecondary">
                Masuk dengan akun praktikan atau asisten laboratorium.
              </Text>
            </View>

            <View className="mt-five gap-three">
              <TextField
                accessibilityLabel="Email"
                label="Email"
                onChangeText={(nilai) => {
                  setEmail(nilai);
                  setPesanGagal(null);
                }}
                placeholder="Masukkan email"
                value={email}
              />

              <TextField
                accessibilityLabel="Kata sandi"
                label="Kata sandi"
                onChangeText={(nilai) => {
                  setPassword(nilai);
                  setPesanGagal(null);
                }}
                placeholder="Masukkan kata sandi"
                secureTextEntry
                showPasswordToggle
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

            <AppButton
              accessibilityLabel="Masuk"
              className="mt-four"
              disabled={!bisaMasuk}
              label={loading ? 'Memproses...' : 'Masuk'}
              onPress={kirim}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

export type { LoginScreenProps };
