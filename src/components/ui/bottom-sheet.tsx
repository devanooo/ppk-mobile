import { useState, type ReactNode } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';

import { AppButton } from './app-button';
import { useAnimasiMuncul } from './motion';
import { gayaBayangan } from './shadow-style';

const DURASI = 180;

type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  judul: string;
  deskripsi?: string;
  children?: ReactNode;
  labelKonfirmasi: string;
  labelBatal?: string;
  onKonfirmasi: () => void;
  bahaya?: boolean;
};

export function BottomSheet({
  visible,
  onClose,
  judul,
  deskripsi,
  children,
  labelKonfirmasi,
  labelBatal = 'Batal',
  onKonfirmasi,
  bahaya = false,
}: BottomSheetProps) {
  const [tinggiSheet, setTinggiSheet] = useState(0);
  const { height: tinggiLayar } = useWindowDimensions();
  const inset = useSafeAreaInsets();
  const progres = useAnimasiMuncul(visible, DURASI);

  // Sebelum tinggi sheet terukur, geser sejauh tinggi layar supaya sheet benar-benar
  // masuk dari tepi bawah, bukan dari tengah layar.
  const geser = progres.interpolate({
    inputRange: [0, 1],
    outputRange: [tinggiSheet || tinggiLayar, 0],
  });

  return (
    <Modal
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <View className="flex-1 justify-end">
        <Pressable
          accessibilityLabel="Tutup"
          accessibilityRole="button"
          className="absolute inset-0"
          onPress={onClose}
        />

        <Animated.View
          accessibilityViewIsModal
          onAccessibilityEscape={onClose}
          onLayout={(peristiwa) => setTinggiSheet(peristiwa.nativeEvent.layout.height)}
          className="max-h-sheetMax rounded-t-xl bg-backgroundElement px-four pt-twoHalf"
          style={[
            gayaBayangan,
            {
              paddingBottom: inset.bottom + Spacing.three,
              transform: [{ translateY: geser }],
            },
          ]}
        >
          <View className="mx-auto mb-three h-one w-five rounded-pill bg-border" />

          <ScrollView bounces={false} className="shrink">
            <Text className="text-subtitle font-semibold text-text">{judul}</Text>

            {deskripsi ? (
              <Text className="mt-two text-small text-textSecondary">{deskripsi}</Text>
            ) : null}

            {children ? <View className="mt-three">{children}</View> : null}
          </ScrollView>

          <View className="mt-four flex-row gap-two">
            <AppButton className="flex-1" label={labelBatal} onPress={onClose} variant="ghost" />
            <AppButton
              className="flex-1"
              label={labelKonfirmasi}
              onPress={onKonfirmasi}
              variant={bahaya ? 'danger' : 'primary'}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

export type { BottomSheetProps };
