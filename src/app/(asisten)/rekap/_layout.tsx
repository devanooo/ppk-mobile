import { Stack } from 'expo-router';

export default function RekapLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="kelas/[kelasId]" />
      <Stack.Screen name="sesi/[sesiId]" />
    </Stack>
  );
}
