import { Text, View } from 'react-native';

import { labelKlasifikasi, labelStatusIzin } from './format-izin';
import type { KlasifikasiStatus, StatusIzin } from './types';

/**
 * Status izin selalu terbaca dari katanya, bukan dari warna saja. Alasan yang
 * sama dengan `src/components/ui/status-badge.tsx`: label memakai token `text`
 * karena `success` di atas `successSurface` tidak lolos kontras 4.5:1.
 */
const GAYA_STATUS: Record<StatusIzin, string> = {
  menunggu: 'bg-warningSurface',
  disetujui: 'bg-successSurface',
  ditolak: 'bg-dangerSurface',
};

const GAYA_KLASIFIKASI: Record<KlasifikasiStatus, string> = {
  menunggu: 'bg-backgroundSelected',
  selesai: 'bg-backgroundSelected',
  gagal: 'bg-warningSurface',
};

export function BadgeStatusIzin({
  status,
  className = '',
}: {
  status: StatusIzin;
  className?: string;
}) {
  return (
    <View className={`self-start rounded-pill px-twoHalf py-one ${GAYA_STATUS[status]} ${className}`}>
      <Text className="text-caption text-text">{labelStatusIzin(status)}</Text>
    </View>
  );
}

/**
 * Hasil klasifikasi AI adalah saran, bukan keputusan. Label "Saran AI" ada di
 * sini supaya asisten tidak membacanya sebagai vonis (AC US-10 nomor 6).
 */
export function BadgeKlasifikasiAi({
  status,
  kategori,
  className = '',
}: {
  status: KlasifikasiStatus;
  kategori?: string;
  className?: string;
}) {
  const isi = status === 'selesai' && kategori ? kategori : labelKlasifikasi(status);

  return (
    <View
      accessible
      accessibilityLabel={`Saran AI: ${isi}`}
      className={`self-start rounded-md px-twoHalf py-two ${GAYA_KLASIFIKASI[status]} ${className}`}
    >
      <Text className="text-caption font-semibold text-text">Saran AI</Text>
      <Text className="mt-half text-small text-text">{isi}</Text>
    </View>
  );
}
