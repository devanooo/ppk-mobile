import { Tabs } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { SymbolView } from 'expo-symbols';

import { FloatingTabBar } from '@/components/ui';
import { useTabBarLayout } from '@/hooks/use-tab-bar-layout';

/**
 * Bar hanya tampil di layar utama tab. Layar detail dan pemindai QR memakai
 * seluruh tinggi layar, jadi bar disembunyikan agar tombol aksi di bawah dan
 * panel kamera tidak tertutup pill.
 */
export default function PraktikanLayout() {
  const { layarUtama, sceneStyle } = useTabBarLayout();

  function TabBarPraktikan(props: BottomTabBarProps) {
    if (!layarUtama) {
      return null;
    }

    return <FloatingTabBar {...props} />;
  }

  return (
    <Tabs
      tabBar={(props) => <TabBarPraktikan {...props} />}
      screenOptions={{ headerShown: false, sceneStyle }}
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
