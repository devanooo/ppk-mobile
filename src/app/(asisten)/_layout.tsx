import { Tabs } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { SymbolView } from 'expo-symbols';

import { FloatingTabBar } from '@/components/ui';
import { useTabBarLayout } from '@/hooks/use-tab-bar-layout';

/**
 * Bar hanya tampil di layar utama tab. Layar detail memakai seluruh tinggi
 * layar, jadi bar disembunyikan agar tombol aksi di bawah tidak tertutup pill.
 */
export default function AsistenLayout() {
  const { layarUtama, sceneStyle } = useTabBarLayout();

  function TabBarAsisten(props: BottomTabBarProps) {
    if (!layarUtama) {
      return null;
    }

    return <FloatingTabBar {...props} />;
  }

  return (
    <Tabs
      tabBar={(props) => <TabBarAsisten {...props} />}
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
        name="kelas"
        options={{
          title: 'Kelas',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'person.3', android: 'groups' }}
              tintColor={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="rekap"
        options={{
          title: 'Rekap',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'chart.bar', android: 'bar_chart' }}
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
              name={{ ios: 'checklist', android: 'checklist' }}
              tintColor={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
