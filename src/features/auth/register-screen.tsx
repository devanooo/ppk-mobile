
import { useRef, useState, type ComponentRef } from 'react';
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
import { daftarPraktikan } from '@/lib/auth';

type RegisterScreenProps = {
  onBerhasil: () => void;
  onKembali: () => void;
};

type ErrorForm = {
  nama?: string;
  nomorInduk?: string;
  email?: string;
  password?: string;
  konfirmasiPassword?: string;
};

export function RegisterScreen({
  onBerhasil,
  onKembali,
}: RegisterScreenProps) {
  // Ref untuk mengontrol ScrollView.
  const scrollRef = useRef<ComponentRef<typeof ScrollView> | null>(null);

  const [nama, setNama] = useState('');
  const [nomorInduk, setNomorInduk] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [konfirmasiPassword, setKonfirmasiPassword] = useState('');

  const [errors, setErrors] = useState<ErrorForm>({});
  const [pesanGagal, setPesanGagal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Menggeser form ketika input password difokuskan.
  function fokusInputBawah() {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({
        animated: true,
      });
    }, 300);
  }

  // ========================================
  // VALIDASI FORM

  function validasi(): boolean {
    const errorBaru: ErrorForm = {};

    if (!nama.trim()) {
      errorBaru.nama = 'Nama lengkap wajib diisi.';
    }

    if (!/^\d{10}$/.test(nomorInduk)) {
      errorBaru.nomorInduk =
        'NIM harus terdiri dari tepat 10 digit angka.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errorBaru.email = 'Masukkan alamat email yang valid.';
    }

    if (password.length < 8) {
      errorBaru.password = 'Password minimal 8 karakter.';
    } else if (!/[a-zA-Z]/.test(password)) {
      errorBaru.password =
        'Password harus memiliki minimal satu huruf.';
    } else if (!/\d/.test(password)) {
      errorBaru.password =
        'Password harus memiliki minimal satu angka.';
    }

    if (!konfirmasiPassword) {
      errorBaru.konfirmasiPassword =
        'Konfirmasi password wajib diisi.';
    } else if (password !== konfirmasiPassword) {
      errorBaru.konfirmasiPassword = 'Password tidak sama.';
    }

    setErrors(errorBaru);

    return Object.keys(errorBaru).length === 0;
  }

  // ========================================
  // INPUT HANDLERS

  function ubahNama(nilai: string) {
    setNama(nilai);
    setErrors((sebelumnya) => ({
      ...sebelumnya,
      nama: undefined,
    }));
    setPesanGagal(null);
  }

  function ubahNim(nilai: string) {
    const angka = nilai.replace(/\D/g, '').slice(0, 10);

    setNomorInduk(angka);
    setErrors((sebelumnya) => ({
      ...sebelumnya,
      nomorInduk: undefined,
    }));
    setPesanGagal(null);
  }

  function ubahEmail(nilai: string) {
    setEmail(nilai);
    setErrors((sebelumnya) => ({
      ...sebelumnya,
      email: undefined,
    }));
    setPesanGagal(null);
  }

  function ubahPassword(nilai: string) {
    setPassword(nilai);
    setErrors((sebelumnya) => ({
      ...sebelumnya,
      password: undefined,
      konfirmasiPassword: undefined,
    }));
    setPesanGagal(null);
  }

  function ubahKonfirmasiPassword(nilai: string) {
    setKonfirmasiPassword(nilai);
    setErrors((sebelumnya) => ({
      ...sebelumnya,
      konfirmasiPassword: undefined,
    }));
    setPesanGagal(null);
  }

  // ========================================
  // REGISTRASI FIREBASE

  async function kirim() {
    if (loading || !validasi()) return;

    setLoading(true);
    setPesanGagal(null);

    try {
      const hasil = await daftarPraktikan({
        nama: nama.trim(),
        nomorInduk,
        email: email.trim().toLowerCase(),
        password,
      });

      if (!hasil.ok) {
        setPesanGagal(hasil.pesan);
        return;
      }

      onBerhasil();
    } catch {
      setPesanGagal(
        'Terjadi kesalahan. Silakan coba kembali.',
      );
    } finally {
      setLoading(false);
    }
  }

  // ========================================
  // UI

  return (
    <Screen padded={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 48,
          }}
          contentContainerClassName="px-three pt-three"
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
          showsVerticalScrollIndicator
        >
          <View
            className="w-full self-center"
            style={{ maxWidth: MaxContentWidth }}
          >
            <Pressable
              accessibilityLabel="Kembali ke halaman awal"
              accessibilityRole="button"
              onPress={onKembali}
              className="-ml-one min-h-touch flex-row items-center self-start pl-one pr-two active:scale-95"
            >
              <Text className="text-body text-primary">‹</Text>
              <Text className="ml-one text-body text-primary">
                Kembali
              </Text>
            </Pressable>

            <View className="mt-four">
              <Text
                accessibilityRole="header"
                className="text-title font-semibold text-text"
              >
                Buat Akun
              </Text>

              <Text className="mt-two text-body text-textSecondary">
                Daftarkan akun praktikan untuk menggunakan PraktikumKU.
              </Text>
            </View>

            <View className="mt-five gap-three">
              <TextField
                label="Nama lengkap"
                placeholder="Masukkan nama lengkap"
                value={nama}
                onChangeText={ubahNama}
                error={errors.nama}
                autoCapitalize="words"
                accessibilityLabel="Nama lengkap"
              />

              <TextField
                label="NIM"
                placeholder="10 digit angka"
                value={nomorInduk}
                onChangeText={ubahNim}
                error={errors.nomorInduk}
                inputMode="numeric"
                maxLength={10}
                accessibilityLabel="Nomor induk mahasiswa"
              />

              <TextField
                label="Email"
                placeholder="Masukkan email"
                value={email}
                onChangeText={ubahEmail}
                error={errors.email}
                inputMode="email"
                accessibilityLabel="Email"
              />

              <TextField
                label="Kata sandi"
                placeholder="Minimal 8 karakter, huruf dan angka"
                value={password}
                onChangeText={ubahPassword}
                error={errors.password}
                secureTextEntry
                showPasswordToggle
                onFocus={fokusInputBawah}
                accessibilityLabel="Kata sandi"
              />

              <TextField
                label="Konfirmasi kata sandi"
                placeholder="Ulangi kata sandi"
                value={konfirmasiPassword}
                onChangeText={ubahKonfirmasiPassword}
                error={errors.konfirmasiPassword}
                secureTextEntry
                showPasswordToggle
                onFocus={fokusInputBawah}
                accessibilityLabel="Konfirmasi kata sandi"
              />
            </View>

            <View className="mt-three gap-two">
              <Text className="text-caption text-textSecondary">
                Password minimal 8 karakter dan harus mengandung
                huruf serta angka.
              </Text>

              {pesanGagal ? (
                <Banner
                  jenis="gagal"
                  pesan={pesanGagal}
                />
              ) : null}
            </View>

            <AppButton
              accessibilityLabel="Daftar akun"
              className="mt-four"
              disabled={loading}
              label={loading ? 'Mendaftarkan...' : 'Daftar'}
              onPress={kirim}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
