import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="room/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="room/[id]/live" options={{ animation: 'slide_from_bottom', presentation: 'fullScreenModal' }} />
        <Stack.Screen name="login" options={{ animation: 'slide_from_bottom', presentation: 'modal' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
