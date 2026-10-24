import { SymbolView } from 'expo-symbols';
import { useState, type ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';

import {
  AppButton,
  Banner,
  BottomSheet,
  Card,
  EmptyState,
  HomeButton,
  Screen,
  StatusBadge,
} from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatJam, type HasilAksi } from '@/store/session-logic';
import type { Sesi, User } from '@/types';

import { labelJadwal, rentangJam } from './format-sesi';

type DetailSesiScreenProps = {
  sesi: Sesi | null;
  namaAsisten?: string;
  praktikan: User;
  waktuHadir?: string;
  onCatatKehadiran: () => HasilAksi;
  onKembali: () => void;
  profil?: ReactNode;
};

type UmpanBalik = { jenis: 'sukses' | 'gagal'; pesan: string };

export function DetailSesiScreen({
  sesi,
  namaAsisten,
  praktikan,
  waktuHadir,
  onCatatKehadiran,
  onKembali,
  profil,
}: DetailSesiScreenProps) {
  return (
    <Screen padded={false}>
      <ScrollView contentContainerClassName="pb-five" showsVerticalScrollIndicator={false}>
        <View className="w-full self-center px-three" style={{ maxWidth: MaxContentWidth }}>
          <View className="flex-row items-center justify-between gap-two pt-two">
            <HomeButton onPress={onKembali} />
            {profil}
          </View>

          {sesi ? (
            <DetailSesi
              key={sesi.id}
              namaAsisten={namaAsisten}
              onCatatKehadiran={onCatatKehadiran}
              praktikan={praktikan}
              sesi={sesi}
              waktuHadir={waktuHadir}
            />
          ) : (
            <EmptyState
              judul="Sesi tidak ditemukan"
              deskripsi="Jadwal sesi ini mungkin sudah berubah."
            />
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

function DetailSesi({
  sesi,
  namaAsisten,
  praktikan,
  waktuHadir,
  onCatatKehadiran,
}: {
  sesi: Sesi;
  namaAsisten?: string;
  praktikan: User;
  waktuHadir?: string;
  onCatatKehadiran: () => HasilAksi;
}) {
  const [konfirmasiTerbuka, setKonfirmasiTerbuka] = useState(false);
  const [umpanBalik, setUmpanBalik] = useState<UmpanBalik | null>(null);

  const sudahHadir = Boolean(waktuHadir);
  const bisaPresensi = sesi.status === 'dibuka' && !sudahHadir;
  const alasanNonaktif =
    sesi.status === 'belum-dibuka'
      ? 'Sesi belum dibuka'
      : sesi.status === 'ditutup'
        ? 'Sesi sudah ditutup'
        : undefined;

  function catatKehadiran() {
    const hasil = onCatatKehadiran();
    setKonfirmasiTerbuka(false);
    setUmpanBalik({ jenis: hasil.ok ? 'sukses' : 'gagal', pesan: hasil.pesan });
  }

  return (
    <View className="pt-three">
      <Text accessibilityRole="header" className="text-title font-semibold text-text">
        {sesi.namaPraktikum}
      </Text>

      <StatusBadge className="mt-two" status={sesi.status} />

      <Card className="mt-four">
        <BarisInfo label="Jadwal" nilai={labelJadwal(sesi)} />
        <BarisInfo garis label="Waktu" nilai={rentangJam(sesi)} />
        <BarisInfo garis label="Kelas" nilai={sesi.kelas} />
        <BarisInfo garis label="Lab" nilai={sesi.lab} />
        {namaAsisten ? <BarisInfo garis label="Asisten" nilai={namaAsisten} /> : null}
        {sesi.dibukaPada ? (
          <BarisInfo garis label="Dibuka" nilai={`pukul ${formatJam(sesi.dibukaPada)}`} />
        ) : null}
        {sesi.ditutupPada ? (
          <BarisInfo garis label="Ditutup" nilai={`pukul ${formatJam(sesi.ditutupPada)}`} />
        ) : null}
      </Card>

      <View className="mt-four gap-two">
        {umpanBalik ? (
          <Banner
            jenis={umpanBalik.jenis}
            onTutup={() => setUmpanBalik(null)}
            pesan={umpanBalik.pesan}
          />
        ) : null}

        {sudahHadir ? (
          <StatusHadir waktu={waktuHadir} />
        ) : (
          <AppButton
            disabled={!bisaPresensi}
            disabledReason={alasanNonaktif}
            label="Catat Kehadiran"
            onPress={() => {
              setUmpanBalik(null);
              setKonfirmasiTerbuka(true);
            }}
          />
        )}
      </View>

      <BottomSheet
        deskripsi="Kehadiran hanya dapat dicatat satu kali untuk sesi ini."
        judul="Catat kehadiran?"
        labelBatal="Batal"
        labelKonfirmasi="Konfirmasi"
        onClose={() => setKonfirmasiTerbuka(false)}
        onKonfirmasi={catatKehadiran}
        visible={konfirmasiTerbuka}
      >
        <View className="rounded-md bg-backgroundSelected px-three py-twoHalf">
          <Text className="text-body font-semibold text-text">{sesi.namaPraktikum}</Text>
          <Text className="mt-one text-small text-textSecondary">
            {praktikan.nama} · {praktikan.nomorInduk}
          </Text>
        </View>
      </BottomSheet>
    </View>
  );
}

function StatusHadir({ waktu }: { waktu?: string }) {
  const theme = useTheme();
  const keterangan = waktu
    ? `Presensi tercatat pukul ${formatJam(waktu)}.`
    : 'Presensi tercatat untuk sesi ini.';

  return (
    <View
      accessible
      accessibilityLabel={`Sudah hadir. ${keterangan}`}
      className="min-h-touch flex-row items-center gap-two rounded-md border border-success bg-successSurface px-three py-two"
    >
      <SymbolView
        name={{ ios: 'checkmark.circle.fill', android: 'check_circle' }}
        size={20}
        tintColor={theme.success}
      />
      <View className="flex-1">
        <Text className="text-body font-semibold text-text">Sudah hadir</Text>
        <Text className="mt-half text-small text-text">{keterangan}</Text>
      </View>
    </View>
  );
}

function BarisInfo({ label, nilai, garis = false }: { label: string; nilai: string; garis?: boolean }) {
  return (
    <View
      className={`flex-row items-start justify-between gap-three py-two ${
        garis ? 'border-t border-border' : ''
      }`}
    >
      <Text className="text-small text-textSecondary">{label}</Text>
      <Text className="flex-1 text-right text-body text-text">{nilai}</Text>
    </View>
  );
}

export type { DetailSesiScreenProps };
