import { Tabs, usePathname } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { SymbolView } from 'expo-symbols';

import { FloatingTabBar } from '@/components/ui';

/**
 * Pemindai QR memakai seluruh layar: navbar disembunyikan agar panel kamera
 * tidak terpotong dan tidak ada tab yang bisa ditekan di tengah pemindaian.
 */
function TabBarPraktikan(props: BottomTabBarProps) {
  const pathname = usePathname();

  if (pathname.includes('pindai')) {
    return null;
  }

  return <FloatingTabBar {...props} />;
}

export default function PraktikanLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBarPraktikan {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen
        name="jadwal"
        options={{
          title: 'Jadwal',
          popToTopOnBlur: true,
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'calendar', android: 'calendar_today' }}
              tintColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="riwayat"
        options={{
          title: 'Riwayat',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'clock.arrow.circlepath', android: 'history' }}
              tintColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="izin"
        options={{
          title: 'Izin',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'doc.text', android: 'description' }}
              tintColor={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
