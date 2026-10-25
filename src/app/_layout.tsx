import '@/global.css';

import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { berandaUntuk } from '@/features/auth/beranda';
import { SessionProvider, useSession } from '@/store/session-store';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SessionProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <NavigasiAkar />
      </ThemeProvider>
    </SessionProvider>
  );
}

function NavigasiAkar() {
  const { user } = useSession();
  const beranda = user ? berandaUntuk(user.peran) : '/';

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={user === null} redirectTo={beranda}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
      </Stack.Protected>

      <Stack.Protected guard={user?.peran === 'praktikan'} redirectTo={beranda}>
        <Stack.Screen name="(praktikan)" />
      </Stack.Protected>

      <Stack.Protected guard={user?.peran === 'asisten'} redirectTo={beranda}>
        <Stack.Screen name="(asisten)" />
      </Stack.Protected>
    </Stack>
  );
}
