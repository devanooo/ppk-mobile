
import { Stack } from 'expo-router';
import { SessionProvider } from '@/store/session-store';

export default function AsistenLayout() {
  return (
    <SessionProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="jadwal" />
        <Stack.Screen name="jadwal/[id]" />
        <Stack.Screen name="rekap" />
      </Stack>
    </SessionProvider>
  );
}
