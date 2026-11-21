import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';

import { FloatingTabBar } from '@/components/ui';

export default function AsistenLayout() {
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
