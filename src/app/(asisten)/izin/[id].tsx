import { useLocalSearchParams, useRouter } from 'expo-router';

import { Card, EmptyState, HomeButton, Screen } from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import { View } from 'react-native';

export default function DetailIzinAsistenScreen() {
  const router = useRouter();
  const { praktikanId } = useLocalSearchParams<{ id: string; praktikanId?: string }>();

  return (
    <Screen padded={false}>
      <View className="w-full flex-1 self-center px-three" style={{ maxWidth: MaxContentWidth }}>
        <View className="pt-two">
          <HomeButton onPress={() => router.back()} />
        </View>

        <Card className="mt-three">
          <EmptyState
            judul="Detail izin belum tersedia"
            deskripsi={
              praktikanId
                ? 'Detail pengajuan akan tampil di sini.'
                : 'Pengajuan izin tidak ditemukan.'
            }
          />
        </Card>
      </View>
    </Screen>
  );
}
