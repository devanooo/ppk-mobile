import { Text, View } from 'react-native';

import { AppButton, StatusBadge } from '@/components/ui';

import { tanggalPanjang } from './format-edit-sesi';
import type { SesiAsisten } from './use-sesi-asisten';

type KartuSesiProps = {
  sesi: SesiAsisten;
  lab: string;
  menghapus: boolean;
  onEdit: () => void;
  onHapus: () => void;
};

/**
 * Referensi 11 memakai kuning untuk sesi yang sedang dibuka dan abu netral
 * untuk sesi terjadwal atau tertutup. Peta tone ini lokal supaya badge di
 * layar lain tidak ikut berubah.
 */
const BADGE: Record<
  SesiAsisten['status'],
  { label: string; tone: 'warning' | 'neutral' }
> = {
  dibuka: { label: 'Dibuka', tone: 'warning' },
  'belum-dibuka': { label: 'Belum dibuka', tone: 'neutral' },
  ditutup: { label: 'Ditutup', tone: 'neutral' },
};

export function KartuSesi({
  sesi,
  lab,
  menghapus,
  onEdit,
  onHapus,
}: KartuSesiProps) {
  const bisaDiubah = sesi.status === 'belum-dibuka';
  const badge = BADGE[sesi.status];

  // `background` membuat kartu lebih terang dari tombol di dalamnya, sesuai
  // referensi 11. Tone `muted` pada `Card` terlalu dekat dengan tombol.
  return (
    <View className="rounded-lg bg-background p-three">
      <View className="flex-row items-start justify-between gap-two">
        <Text className="flex-1 text-body font-semibold text-text">
          {tanggalPanjang(sesi.tanggal)}
        </Text>

        <StatusBadge label={badge.label} tone={badge.tone} />
      </View>

      <Text className="mt-one text-small text-textSecondary">
        {sesi.jamMulai}–{sesi.jamSelesai} · {lab}
      </Text>

      <View className="mt-three flex-row gap-two">
        <View className="flex-1">
          <AppButton
            className="rounded-pill bg-backgroundSelected"
            disabled={!bisaDiubah || menghapus}
            label="Edit"
            onPress={onEdit}
            size="sm"
            variant="ghost"
          />
        </View>

        <View className="flex-1">
          <AppButton
            className="rounded-pill bg-backgroundSelected"
            disabled={!bisaDiubah || menghapus}
            label={menghapus ? 'Menghapus...' : 'Hapus'}
            onPress={onHapus}
            size="sm"
            variant="danger"
          />
        </View>
      </View>
    </View>
  );
}
