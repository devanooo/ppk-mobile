import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  Animated,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';

import { AppButton } from './app-button';
import { useAnimasiMuncul, useReduceMotion } from './motion';
import { gayaBayangan } from './shadow-style';

const DURASI = 180;

/** Geser turun minimal, bagian dari tinggi sheet, yang dianggap sengaja menutup. */
const AMBANG_GESER = 0.25;

/** Lemparan cepat (pt/ms) menutup sheet walau jaraknya belum melewati ambang geser. */
const AMBANG_LEMPAR = 0.8;

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

  const kurangiGerak = useReduceMotion();
  const [tarikan] = useState(() => new Animated.Value(0));

  // Sheet ditutup tanpa animasi keluar, jadi tarikan cukup direset saat tertutup.
  useEffect(() => {
    if (!visible) tarikan.setValue(0);
  }, [visible, tarikan]);

  const kembalikan = useCallback(() => {
    if (kurangiGerak) {
      tarikan.setValue(0);
      return;
    }

    Animated.spring(tarikan, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 0,
      speed: 18,
    }).start();
  }, [kurangiGerak, tarikan]);

  const penarik = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_peristiwa, gestur) =>
          gestur.dy > Spacing.two && Math.abs(gestur.dy) > Math.abs(gestur.dx),
        onPanResponderMove: (_peristiwa, gestur) => {
          tarikan.setValue(Math.max(0, gestur.dy));
        },
        onPanResponderRelease: (_peristiwa, gestur) => {
          if (gestur.dy > (tinggiSheet || tinggiLayar) * AMBANG_GESER || gestur.vy > AMBANG_LEMPAR) {
            onClose();
            return;
          }

          kembalikan();
        },
        onPanResponderTerminate: () => kembalikan(),
      }),
    [kembalikan, onClose, tarikan, tinggiLayar, tinggiSheet],
  );

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
          className="absolute inset-0 bg-overlay/40"
          onPress={onClose}
        />

        <Animated.View
          accessibilityViewIsModal
          onAccessibilityEscape={onClose}
          onLayout={(peristiwa) => setTinggiSheet(peristiwa.nativeEvent.layout.height)}
          className="max-h-sheetMax rounded-t-xl bg-backgroundElement px-four"
          style={[
            gayaBayangan,
            {
              paddingBottom: inset.bottom + Spacing.three,
              transform: [{ translateY: geser }],
            },
          ]}
        >
          {/* Padding atas sheet dipindah ke sini agar area geser pegangan setinggi mungkin
              tanpa mengubah posisi visual pegangan. Geser turun melewati ambang = tutup. */}
          <Animated.View
            {...penarik.panHandlers}
            className="pt-twoHalf pb-three"
            style={{ transform: [{ translateY: tarikan }] }}
          >
            <View className="mx-auto h-one w-five rounded-pill bg-border" />
          </Animated.View>

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
