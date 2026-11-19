
import { SymbolView } from 'expo-symbols';
import { useRef, useState, type ComponentRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  type ViewStyle,
} from 'react-native';

import { AppButton, Banner, Screen, TextField } from '@/components/ui';
import { Colors, MaxContentWidth } from '@/constants/theme';
import { useSession } from '@/store/session-store';
import type { Peran } from '@/types';

const WARNA_NAVY = Colors.light.loginInk;

const BAYANGAN_LEMBUT: ViewStyle = {
  shadowColor: WARNA_NAVY,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 2,
};

const PILIHAN_PERAN: { nilai: Peran; judul: string; deskripsi: string }[] = [
  {
    nilai: 'praktikan',
    judul: 'Praktikan',
    deskripsi: 'Mengikuti kegiatan praktikum.',
  },
  {
    nilai: 'asisten',
    judul: 'Asisten',
    deskripsi: 'Mengelola kegiatan praktikum.',
  },
];

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
  const scrollRef = useRef<ComponentRef<typeof ScrollView> | null>(null);
  const { daftarAkun } = useSession();

  const [nama, setNama] = useState('');
  const [nomorInduk, setNomorInduk] = useState('');
  const [peran, setPeran] = useState<Peran>('praktikan');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [konfirmasiPassword, setKonfirmasiPassword] = useState('');

  const [errors, setErrors] = useState<ErrorForm>({});
  const [pesanGagal, setPesanGagal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function fokusInputBawah() {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({
        animated: true,
      });
    }, 300);
  }

  function validasi(): boolean {
    const errorBaru: ErrorForm = {};

    if (!nama.trim()) {
      errorBaru.nama = 'Nama lengkap wajib diisi.';
    }

    if (!/^\d{14}$/.test(nomorInduk)) {
      errorBaru.nomorInduk =
        'NIM harus terdiri dari tepat 14 digit angka.';
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

  function ubahNama(nilai: string) {
    setNama(nilai);
    setErrors((sebelumnya) => ({
      ...sebelumnya,
      nama: undefined,
    }));
    setPesanGagal(null);
  }

  function ubahNim(nilai: string) {
    const angka = nilai.replace(/\D/g, '').slice(0, 14);

    setNomorInduk(angka);
    setErrors((sebelumnya) => ({
      ...sebelumnya,
      nomorInduk: undefined,
    }));
    setPesanGagal(null);
  }

  function ubahPeran(nilai: Peran) {
    setPeran(nilai);
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

  async function kirim() {
    if (loading || !validasi()) return;

    setLoading(true);
    setPesanGagal(null);

    try {
      const hasil = await daftarAkun({
        nama: nama.trim(),
        nomorInduk,
        email: email.trim().toLowerCase(),
        password,
        peran,
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

  return (
    <Screen
      padded={false}
      backgroundClassName="bg-loginBackground"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerClassName="grow px-four pb-five pt-three"
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
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
                Buat Akun
              </Text>

              <Text className="mt-two text-authBody text-loginMuted">
                Daftarkan akun untuk menggunakan PraktikumKU sebagai praktikan atau asisten.
              </Text>
            </View>

            <View className="mt-five gap-two">
              <Text className="text-caption font-semibold text-loginInk">
                Daftar sebagai
              </Text>

              <View accessibilityRole="radiogroup" className="flex-row gap-three">
                {PILIHAN_PERAN.map((pilihan) => {
                  const aktif = peran === pilihan.nilai;

                  return (
                    <Pressable
                      key={pilihan.nilai}
                      accessibilityLabel={`Pilih peran ${pilihan.judul}`}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: aktif }}
                      onPress={() => ubahPeran(pilihan.nilai)}
                      className={`min-h-authChoice flex-1 justify-center rounded-authCard border p-three active:opacity-80 ${
                        aktif
                          ? 'border-loginInk bg-loginField'
                          : 'border-loginMuted/30 bg-loginBackground'
                      }`}
                    >
                      <Text className="text-body font-semibold text-loginInk">
                        {pilihan.judul}
                      </Text>
                      <Text className="mt-one text-caption text-loginMuted">
                        {pilihan.deskripsi}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View className="mt-five gap-three">
              <TextField
                variant="auth"
                label="Nama lengkap"
                placeholder="Masukkan nama lengkap"
                value={nama}
                onChangeText={ubahNama}
                error={errors.nama}
                autoCapitalize="words"
                accessibilityLabel="Nama lengkap"
              />

              <TextField
                variant="auth"
                label="NIM"
                placeholder="Masukkan NIM (14 digit)"
                value={nomorInduk}
                onChangeText={ubahNim}
                error={errors.nomorInduk}
                inputMode="numeric"
                maxLength={14}
                accessibilityLabel="NIM"
              />

              <TextField
                variant="auth"
                label="Email"
                placeholder="Masukkan email"
                value={email}
                onChangeText={ubahEmail}
                error={errors.email}
                inputMode="email"
                accessibilityLabel="Email"
              />

              <TextField
                variant="auth"
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
                variant="auth"
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

            <View className="mt-three gap-three">
              <Text className="text-small text-loginMuted">
                Password minimal 8 karakter dan harus mengandung huruf serta angka.
              </Text>

              {pesanGagal ? (
                <Banner
                  jenis="gagal"
                  pesan={pesanGagal}
                />
              ) : null}
            </View>

            <AppButton
              variant="auth"
              accessibilityLabel="Daftar akun"
              className="mt-five"
              disabled={loading}
              loading={loading}
              label={loading ? 'Mendaftarkan...' : 'Daftar'}
              onPress={kirim}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
