import { Text, View } from 'react-native';

import { Card } from '@/components/ui';
import { formatTanggal } from '@/features/praktikan/format-sesi';
import type { SesiPraktikan } from '@/lib/izin-sesi';
import type { Izin } from '@/features/izin/types';

import { BadgeKlasifikasiAi, BadgeStatusIzin } from './badge-status-izin';
import { formatWaktuIzin } from './format-izin';

type KartuIzinProps = {
  izin: Izin;
  /** Diisi di sisi asisten; kosong berarti kartu milik praktikan sendiri. */
  namaPraktikan?: string;
  sesi?: SesiPraktikan;
  onPress?: () => void;
};

export function KartuIzin({ izin, namaPraktikan, sesi, onPress }: KartuIzinProps) {
  const judul = namaPraktikan ?? sesi?.namaKelas ?? 'Pengajuan izin';
  const waktuKirim = formatWaktuIzin(izin.dibuatPada);
  const waktuPutus = formatWaktuIzin(izin.diputuskanPada);

  const isi = (
    <>
      <View className="flex-row items-start justify-between gap-two">
        <View className="flex-1">
          <Text className="text-subtitle font-semibold text-text">{judul}</Text>
          {sesi ? (
            <Text className="mt-one text-small text-textSecondary">
              {sesi.hari}, {formatTanggal(sesi.tanggal)} · {sesi.jamMulai}–{sesi.jamSelesai}
            </Text>
          ) : null}
        </View>
        <BadgeStatusIzin className="shrink-0" status={izin.status} />
      </View>

      <Text className="mt-three text-body text-text">{izin.alasan}</Text>

      {waktuKirim ? (
        <Text className="mt-two text-small text-textSecondary">Diajukan pukul {waktuKirim}</Text>
      ) : null}

      <BadgeKlasifikasiAi className="mt-three" kategori={izin.kategoriAi} status={izin.klasifikasiStatus} />

      {waktuPutus ? (
        <Text className="mt-three border-t border-border pt-three text-small text-textSecondary">
          Diputuskan pukul {waktuPutus}
          {izin.diputuskanOleh ? ' oleh asisten pengampu' : ''}
        </Text>
      ) : null}
    </>
  );

  if (onPress) {
    return (
      <Card accessibilityLabel={`Buka pengajuan izin ${judul}`} onPress={onPress}>
        {isi}
      </Card>
    );
  }

  return <Card>{isi}</Card>;
}
