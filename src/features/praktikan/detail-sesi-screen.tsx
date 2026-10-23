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
        : sudahHadir
          ? 'Presensi sudah tercatat'
          : undefined;

  function catatKehadiran() {
    const hasil = onCatatKehadiran();
    setKonfirmasiTerbuka(false);
    setUmpanBalik({ jenis: hasil.ok ? 'sukses' : 'gagal', pesan: hasil.pesan });
  }

  return (
    <View className="pt-three">
      <View className="flex-row items-start justify-between gap-two">
        <Text
          accessibilityRole="header"
          className="flex-1 text-title font-semibold text-text"
        >
          {sesi.namaPraktikum}
        </Text>
        <StatusBadge status={sesi.status} />
      </View>

      <Text className="mt-one text-small text-textSecondary">Kelas {sesi.kelas} · {sesi.lab}</Text>

      <Card className="mt-four">
        <BarisInfo label="Jadwal" nilai={labelJadwal(sesi)} />
        <BarisInfo garis label="Waktu" nilai={rentangJam(sesi)} />
        {namaAsisten ? <BarisInfo garis label="Asisten" nilai={namaAsisten} /> : null}
        {sesi.dibukaPada ? (
          <BarisInfo garis label="Dibuka" nilai={`pukul ${formatJam(sesi.dibukaPada)}`} />
        ) : null}
        {sesi.ditutupPada ? (
          <BarisInfo garis label="Ditutup" nilai={`pukul ${formatJam(sesi.ditutupPada)}`} />
        ) : null}
        {waktuHadir ? (
          <BarisInfo garis label="Kehadiran" nilai={`pukul ${formatJam(waktuHadir)}`} />
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
          <View className="items-center">
            <View className="min-h-touch flex-row items-center justify-center gap-two rounded-pill border border-success bg-successSurface px-four">
              <View className="h-two w-two rounded-pill bg-success" />
              <Text className="text-body font-semibold text-text">Sudah hadir</Text>
            </View>
            {alasanNonaktif ? (
              <Text className="mt-two text-center text-caption text-textSecondary">
                {alasanNonaktif}
              </Text>
            ) : null}
          </View>
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
