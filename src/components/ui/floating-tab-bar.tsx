import {
  isGlassEffectAPIAvailable,
  isLiquidGlassAvailable,
  GlassView,
} from 'expo-glass-effect';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';

import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { gayaBayangan } from './shadow-style';

/**
 * Bar navigasi mengambang: pill kaca dengan kapsul abu di belakang ikon dan
 * label tab aktif, sesuai referensi layar praktikan dan asisten.
 *
 * Tiga lapisan dipisah karena tiap lapisan punya satu tugas:
 *   1. luar: bayangan, tidak boleh terpotong
 *   2. tengah: `overflow-hidden` supaya radius memotong permukaan kaca
 *   3. permukaan kaca: GlassView native iOS 26, fallback translusen
 *
 * Kaca hanya dipakai di sini (satu elemen), bukan di kartu, sheet, atau
 * dropdown, supaya elevasi tetap punya arti (design.md bagian 4.6).
 */

/** Radius blur Web; platform lain memakai kaca native atau fallback datar. */
const BLUR_WEB = 20;

/**
 * Tinggi kapsul: `py-one` 8 + ikon 22 + `gap-one` 4 + label 18.
 * Dipakai untuk menghitung ruang bawah isi scroller.
 */
const TINGGI_KAPSUL = 52;
const TINGGI_PILL = TINGGI_KAPSUL + Spacing.two * 2;

/**
 * Ruang bawah untuk isi scroller di layar tab, supaya item terakhir bisa
 * digulir melewati pill dan tetap terlihat. `SafeAreaView` di `Screen` sudah
 * menambahkan inset perangkat, jadi angka ini tidak memuat inset.
 * Isi: jarak atas pill 8 + pill 76 + jeda 16.
 */
export const RUANG_BAWAH_KONTEN = Spacing.two + TINGGI_PILL + Spacing.three;

type FloatingTabBarProps = BottomTabBarProps;

export function FloatingTabBar({
  state,
  descriptors,
  emitter,
  navigateToTab,
  insets,
}: FloatingTabBarProps) {
  const theme = useTheme();

  // Sebagian iOS 26 beta punya masalah crash tanpa API ini, jadi keduanya
  // diperiksa sebelum GlassView dirender.
  const kacaAsli =
    Platform.OS === 'ios' &&
    isLiquidGlassAvailable() &&
    isGlassEffectAPIAvailable();

  const gayaBlurWeb: ViewStyle | null =
    Platform.OS === 'web'
      ? ({ backdropFilter: `blur(${BLUR_WEB}px)` } as unknown as ViewStyle)
      : null;

  return (
    // Bar ini overlay: menempel ke tepi bawah dan mengapung di atas konten.
    // Latar wrapper wajib transparan. Kalau diberi `bg-background`, muncul
    // strip solid selebar layar setinggi area bar yang terbaca sebagai panel
    // yang menutupi daftar di atasnya.
    <View
      className="absolute bottom-0 left-0 right-0 bg-transparent px-four pt-two"
      style={{ paddingBottom: insets.bottom }}
    >
      <View
        className={`w-full self-center rounded-pill ${
          kacaAsli ? '' : 'border border-border/70 bg-background/85'
        }`}
        style={[
          { maxWidth: MaxContentWidth },
          kacaAsli ? null : gayaBayangan,
          gayaBlurWeb,
        ]}
      >
        <View className="overflow-hidden rounded-pill">
          {kacaAsli ? (
            <GlassView
              glassEffectStyle="regular"
              isInteractive={false}
              // Radius dipasang langsung di view native. `overflow-hidden` pada
              // induk tidak selalu memotong UIVisualEffectView, sehingga tanpa
              // ini kaca tampil sebagai persegi penuh di belakang pill.
              style={[StyleSheet.absoluteFill, { borderRadius: Radius.pill }]}
            />
          ) : null}

          <View className="flex-row items-center p-two">
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const terpilih = state.index === index;
              const label =
                typeof options.tabBarLabel === 'string'
                  ? options.tabBarLabel
                  : (options.title ?? route.name);
              const warna = terpilih ? theme.primary : theme.textSecondary;

              function tekan() {
                const event = emitter.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!terpilih && !event.defaultPrevented) {
                  navigateToTab(route.key);
                }
              }

              function tekanLama() {
                emitter.emit({ type: 'tabLongPress', target: route.key });
              }

              return (
                <Pressable
                  key={route.key}
                  accessibilityLabel={label}
                  accessibilityRole="button"
                  accessibilityState={{ selected: terpilih }}
                  onLongPress={tekanLama}
                  onPress={tekan}
                  className="flex-1 items-center justify-center active:opacity-60"
                >
                  <View
                    className={`min-h-touch w-full items-center justify-center gap-one rounded-pill px-two py-one ${
                      terpilih ? 'bg-backgroundSelected' : 'bg-transparent'
                    }`}
                  >
                    {options.tabBarIcon?.({
                      focused: terpilih,
                      color: warna,
                      size: 22,
                    })}

                    <Text
                      numberOfLines={1}
                      className={`text-caption ${
                        terpilih
                          ? 'font-semibold text-primary'
                          : 'font-medium text-textSecondary'
                      }`}
                    >
                      {label}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}
