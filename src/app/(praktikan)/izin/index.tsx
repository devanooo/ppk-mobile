import { Text, View } from 'react-native';

import { Card, EmptyState, Screen } from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import { MenuProfilPraktikan } from '@/features/praktikan/menu-profil';

import { useSession } from '@/store/session-store';

export default function IzinPraktikanScreen() {
  const { user } = useSession();

  if (!user) {
    return null;
  }

  return (
    <Screen padded={false}>
      <View className="w-full flex-1 self-center px-three" style={{ maxWidth: MaxContentWidth }}>
        <View className="flex-row items-start justify-between gap-three pt-three">
          <View className="flex-1">
            <Text className="text-small text-textSecondary">Halo, {user.nama}</Text>
            <Text accessibilityRole="header" className="mt-one text-title font-semibold text-text">
              Izin
            </Text>
            <Text className="mt-one text-small text-textSecondary">
              Pengajuan izin dan keputusannya akan muncul di sini.
            </Text>
          </View>
          <MenuProfilPraktikan />
        </View>

        <Card className="mt-four">
          <EmptyState
            judul="Belum ada pengajuan izin"
            deskripsi="Pengajuan izin yang kamu kirim akan tercatat di sini."
          />
        </Card>
      </View>
    </Screen>
  );
}
