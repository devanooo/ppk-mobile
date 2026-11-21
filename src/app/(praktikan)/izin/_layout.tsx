import { Stack } from 'expo-router';

export default function IzinLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="ajukan" />
      <Stack.Screen name="ajukan/[id]" />
    </Stack>
  );
}
