import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { gayaBayangan } from './shadow-style';

export function FloatingTabBar({
  state,
  descriptors,
  emitter,
  navigateToTab,
  insets,
}: BottomTabBarProps) {
  const theme = useTheme();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <View
      className="px-four pt-two"
      style={{ paddingBottom: insets.bottom + Spacing.two }}
    >
      <View
        className="flex-row items-center rounded-pill bg-backgroundSelected p-twoHalf"
        style={gayaBayangan}
      >
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
              className="min-h-touch flex-1 items-center justify-center gap-one active:opacity-60"
            >
              <View
                style={[
                  s.ikonWrap,
                  terpilih
                    ? { backgroundColor: colors.backgroundElement }
                    : { backgroundColor: 'transparent' },
                ]}
              >
                {options.tabBarIcon?.({ focused: terpilih, color: warna, size: 22 })}
              </View>

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
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  ikonWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
