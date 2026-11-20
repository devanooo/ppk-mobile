import { Pressable, Text, View } from 'react-native';

import { formatTanggal } from '@/features/praktikan/format-sesi';
import type { SesiPraktikan } from '@/lib/izin-sesi';

import { BadgeStatusIzin } from './badge-status-izin';
import type { Izin } from './types';

type BarisIzinAsistenProps = {
  izin: Izin;
  nama: string;
  sesi?: SesiPraktikan;
  onPress: () => void;
};

/**
 * Baris ringkas untuk daftar pengajuan izin asisten. Alasan lengkap dan saran
 * AI ada di layar detail, jadi daftar tetap mudah dipindai.
 */
export function BarisIzinAsisten({
  izin,
  nama,
  sesi,
  onPress,
}: BarisIzinAsistenProps) {
  const kategori = izin.kategoriAi?.trim() || 'Tanpa kategori';

  return (
    <Pressable
      accessibilityLabel={`Buka pengajuan izin ${nama}, ${sesi?.namaKelas ?? 'sesi tidak ditemukan'}`}
      accessibilityRole="button"
      onPress={onPress}
      className="py-three active:opacity-70"
    >
      <View className="flex-row items-start justify-between gap-two">
        <Text className="flex-1 text-subtitle font-semibold text-text">{nama}</Text>
        <BadgeStatusIzin className="shrink-0" status={izin.status} />
      </View>

      <Text className="mt-one text-small text-textSecondary">
        {sesi?.namaKelas ?? 'Sesi tidak ditemukan'}
      </Text>

      <Text className="mt-half text-small text-textSecondary">
        {sesi ? `${formatTanggal(sesi.tanggal)} · ${kategori}` : kategori}
      </Text>
    </Pressable>
  );
}

export type { BarisIzinAsistenProps };
