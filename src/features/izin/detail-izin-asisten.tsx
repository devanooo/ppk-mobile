import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import {
  AppButton,
  Banner,
  BottomSheet,
  Card,
  EmptyState,
  HomeButton,
  Screen,
} from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import { BadgeKlasifikasiAi, BadgeStatusIzin } from './badge-status-izin';
import { formatWaktuIzin } from './format-izin';
import type { Izin } from '@/features/izin/types';
import type { SesiPraktikan } from '@/lib/izin-sesi';

type DetailIzinAsistenProps = {
  izin?: Izin;
  sesi?: SesiPraktikan;
  namaPraktikan?: string;
  nomorInduk?: string;
  status: 'memuat' | 'siap' | 'gagal';
  pesanGalat?: string;
  sedangPutuskan: boolean;
  umpanBalik?: { jenis: 'sukses' | 'gagal'; pesan: string } | null;
  onSetujui: () => void;
  onTolak: () => void;
  onKembali: () => void;
  onTutupUmpanBalik?: () => void;
};

export function DetailIzinAsisten({
  izin,
  sesi,
  namaPraktikan,
  nomorInduk,
  status,
  pesanGalat,
  sedangPutuskan,
  umpanBalik,
  onSetujui,
  onTolak,
  onKembali,
  onTutupUmpanBalik,
}: DetailIzinAsistenProps) {
  const [lembar, setLembar] = useState<'setujui' | 'tolak' | null>(null);
  const bisaDiputuskan = izin?.status === 'menunggu';
  const waktuKirim = formatWaktuIzin(izin?.dibuatPada);
  const waktuPutus = formatWaktuIzin(izin?.diputuskanPada);

  return (
    <Screen padded={false}>
      <ScrollView contentContainerClassName="pb-five" showsVerticalScrollIndicator={false}>
        <View className="w-full self-center px-three" style={{ maxWidth: MaxContentWidth }}>
          <View className="pt-two">
            <HomeButton onPress={onKembali} />
          </View>

          {status === 'memuat' ? (
            <Text className="mt-four text-small text-textSecondary">Memuat detail izin...</Text>
          ) : null}

          {status === 'gagal' ? (
            <Banner className="mt-three" jenis="gagal" pesan={pesanGalat ?? 'Detail izin gagal dimuat'} />
          ) : null}

          {status === 'siap' && !izin ? (
            <Card className="mt-three">
              <EmptyState
                judul="Pengajuan izin tidak ditemukan"
                deskripsi="Pengajuan ini mungkin sudah dihapus atau bukan bagian dari sesimu."
              />
            </Card>
          ) : null}

          {izin ? (
            <>
              <View className="mt-three flex-row items-start justify-between gap-two">
                <View className="flex-1">
                  <Text accessibilityRole="header" className="text-title font-semibold text-text">
                    {namaPraktikan ?? 'Praktikan'}
                  </Text>
                  {nomorInduk ? (
                    <Text className="mt-one text-small text-textSecondary">{nomorInduk}</Text>
                  ) : null}
                </View>
                <BadgeStatusIzin className="shrink-0" status={izin.status} />
              </View>

              {sesi ? (
                <Text className="mt-two text-small text-textSecondary">
                  {sesi.namaKelas} · {sesi.hari}, {sesi.tanggal} · {sesi.jamMulai}–{sesi.jamSelesai}
                </Text>
              ) : null}

              <Card className="mt-four">
                <Text className="text-caption text-textSecondary">Alasan</Text>
                <Text className="mt-two text-body text-text">{izin.alasan}</Text>
                {waktuKirim ? (
                  <Text className="mt-three text-small text-textSecondary">
                    Diajukan pukul {waktuKirim}
                  </Text>
                ) : null}
              </Card>

              <View className="mt-four">
                <BadgeKlasifikasiAi kategori={izin.kategoriAi} status={izin.klasifikasiStatus} />
                <Text className="mt-two text-small text-textSecondary">
                  Hasil AI hanya saran. Keputusan tetap milikmu.
                </Text>
              </View>

              {umpanBalik ? (
                <Banner
                  className="mt-four"
                  jenis={umpanBalik.jenis}
                  onTutup={onTutupUmpanBalik}
                  pesan={umpanBalik.pesan}
                />
              ) : null}

              {bisaDiputuskan ? (
                <View className="mt-four flex-row gap-two">
                  <AppButton
                    className="flex-1"
                    disabled={sedangPutuskan}
                    label="Tolak"
                    onPress={() => setLembar('tolak')}
                    variant="danger"
                  />
                  <AppButton
                    className="flex-1"
                    disabled={sedangPutuskan}
                    label="Setujui"
                    onPress={() => setLembar('setujui')}
                  />
                </View>
              ) : (
                <Text className="mt-four text-small text-textSecondary">
                  Pengajuan ini sudah diputuskan
                  {waktuPutus ? ` pukul ${waktuPutus}` : ''} dan tidak dapat diubah.
                </Text>
              )}
            </>
          ) : null}
        </View>
      </ScrollView>

      <BottomSheet
        bahaya
        deskripsi="Praktikan akan melihat keputusan ini. Pengajuan yang sudah diputuskan tidak dapat diubah."
        judul="Tolak pengajuan izin?"
        labelBatal="Batal"
        labelKonfirmasi="Tolak"
        onClose={() => setLembar(null)}
        onKonfirmasi={() => {
          setLembar(null);
          onTolak();
        }}
        visible={lembar === 'tolak'}
      >
        <Text className="text-body text-text">{izin?.alasan}</Text>
      </BottomSheet>

      <BottomSheet
        deskripsi="Praktikan akan melihat keputusan ini. Pengajuan yang sudah diputuskan tidak dapat diubah."
        judul="Setujui pengajuan izin?"
        labelBatal="Batal"
        labelKonfirmasi="Setujui"
        onClose={() => setLembar(null)}
        onKonfirmasi={() => {
          setLembar(null);
          onSetujui();
        }}
        visible={lembar === 'setujui'}
      >
        <Text className="text-body text-text">{izin?.alasan}</Text>
      </BottomSheet>
    </Screen>
  );
}
