import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';

import { FloatingTabBar } from '@/components/ui';

export default function PraktikanLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
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
