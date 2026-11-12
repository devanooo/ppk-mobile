import { Text, View } from 'react-native';

import { Card } from '@/components/ui';
import { formatTanggal } from '@/features/praktikan/format-sesi';

import type { SesiPraktikan } from '@/lib/izin-sesi';

import { labelStatusSesi } from './label-sesi';

type PemilihSesiProps = {
  daftarSesi: SesiPraktikan[];
  sesiTerpilih?: string;
  onPilih: (sesiId: string) => void;
  className?: string;
};

export function PemilihSesi({
  daftarSesi,
  sesiTerpilih,
  onPilih,
  className = '',
}: PemilihSesiProps) {
  if (daftarSesi.length === 0) {
    return (
      <View className={className}>
        <Text className="text-caption text-textSecondary">Sesi</Text>
        <Text className="mt-two text-small text-textSecondary">
          Belum ada sesi yang bisa diajukan izin.
        </Text>
      </View>
    );
  }

  return (
    <View className={className}>
      <Text className="mb-two text-caption text-textSecondary">Sesi</Text>

      <View className="gap-two">
        {daftarSesi.map((sesi) => {
          const dipilih = sesi.id === sesiTerpilih;
          const ditutup = sesi.status === 'ditutup';

          return (
            <Card
              key={sesi.id}
              accessibilityLabel={`${dipilih ? 'Sesi terpilih' : 'Pilih sesi'} ${sesi.namaKelas}, ${formatTanggal(sesi.tanggal)}, ${labelStatusSesi(sesi.status)}`}
              className={dipilih ? 'border-primary' : ''}
              onPress={() => onPilih(sesi.id)}
            >
              <View className="flex-row items-start justify-between gap-two">
                <View className="flex-1">
                  <Text className="text-body font-semibold text-text">
                    {sesi.namaKelas || 'Sesi praktikum'}
                  </Text>
                  <Text className="mt-one text-small text-textSecondary">
                    {sesi.hari}, {formatTanggal(sesi.tanggal)} · {sesi.jamMulai}–{sesi.jamSelesai}
                  </Text>
                  <Text className="mt-half text-small text-textSecondary">
                    {labelStatusSesi(sesi.status)}
                    {ditutup ? ' · tidak dapat diajukan' : ''}
                  </Text>
                </View>

                <Text className="shrink-0 text-small text-textSecondary">
                  {dipilih ? 'Dipilih' : 'Pilih'}
                </Text>
              </View>
            </Card>
          );
        })}
      </View>
    </View>
  );
}
