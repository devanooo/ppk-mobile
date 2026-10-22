import { useEffect, useLayoutEffect, useState, type ReactNode } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Shadow, Spacing } from '@/constants/theme';

import { AppButton } from './app-button';

const DURASI = 180;

const GAYA_BAYANGAN = {
  shadowColor: Shadow.color,
  shadowOffset: { width: Shadow.offsetX, height: Shadow.offsetY },
  shadowOpacity: Shadow.opacity,
  shadowRadius: Shadow.radius,
  elevation: Shadow.elevation,
};

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
  const [progres] = useState(() => new Animated.Value(0));
  const [kurangiGerak, setKurangiGerak] = useState(false);
  const { height: tinggiLayar } = useWindowDimensions();
  const inset = useSafeAreaInsets();

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setKurangiGerak);
    const langganan = AccessibilityInfo.addEventListener('reduceMotionChanged', setKurangiGerak);
    return () => langganan.remove();
  }, []);

  useLayoutEffect(() => {
    if (!visible) return;

    if (kurangiGerak) {
      progres.setValue(1);
      return;
    }

    progres.setValue(0);
    Animated.timing(progres, {
      toValue: 1,
      duration: DURASI,
      useNativeDriver: true,
    }).start();
  }, [visible, kurangiGerak, progres]);

  const geser = progres.interpolate({
    inputRange: [0, 1],
    outputRange: [tinggiLayar * 0.5, 0],
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
          className="max-h-sheetMax rounded-t-xl bg-backgroundElement px-four pt-twoHalf"
          style={[
            GAYA_BAYANGAN,
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
