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
  onMasuk: (username: string, password: string) => HasilLogin;
  onBerhasil: (user: User) => void;
  onKembali: () => void;
};

export function LoginScreen({ onMasuk, onBerhasil, onKembali }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pesanGagal, setPesanGagal] = useState<string | null>(null);

  const bisaMasuk = username.trim().length > 0 && password.length > 0;

  function ubahUsername(nilai: string) {
    setUsername(nilai);
    if (pesanGagal) setPesanGagal(null);
  }

  function ubahPassword(nilai: string) {
    setPassword(nilai);
    if (pesanGagal) setPesanGagal(null);
  }

  function kirim() {
    if (!bisaMasuk) return;

    const hasil = onMasuk(username.trim(), password);
    if (!hasil.ok) {
      setPesanGagal(hasil.pesan);
      return;
    }

    onBerhasil(hasil.user);
  }

  return (
    <Screen padded={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerClassName="grow px-three pb-five"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full self-center pt-three" style={{ maxWidth: MaxContentWidth }}>
            <Pressable
              accessibilityLabel="Kembali ke halaman awal"
              accessibilityRole="button"
              onPress={onKembali}
              className="-ml-two min-h-touch justify-center self-start px-two active:opacity-60"
            >
              <Text className="text-body text-primary">Kembali</Text>
            </Pressable>

            <View className="mt-four">
              <Text accessibilityRole="header" className="text-title font-semibold text-text">
                Masuk
              </Text>
              <Text className="mt-two text-body text-textSecondary">
                Masuk menggunakan akun praktikum kamu.
              </Text>
            </View>

            <View className="mt-five gap-three">
              <TextField
                accessibilityLabel="Username"
                label="Username"
                onChangeText={ubahUsername}
                placeholder="Masukkan username"
                value={username}
              />
              <TextField
                accessibilityLabel="Kata sandi"
                label="Kata sandi"
                onChangeText={ubahPassword}
                placeholder="Masukkan kata sandi"
                secureTextEntry
                value={password}
              />
            </View>

            {pesanGagal ? <Banner className="mt-three" jenis="gagal" pesan={pesanGagal} /> : null}

            <AppButton
              accessibilityLabel="Masuk"
              className="mt-four"
              disabled={!bisaMasuk}
              disabledReason="Isi username dan kata sandi"
              label="Masuk"
              onPress={kirim}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

export type { LoginScreenProps };
