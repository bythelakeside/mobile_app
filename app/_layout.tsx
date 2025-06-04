import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider } from '@/context/AppContext';
import { useColorScheme, Platform } from 'react-native';

export default function RootLayout() {
  useFrameworkReady();
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="note/[id]" options={{ headerShown: false, presentation: 'card' }} />
            <Stack.Screen name="create" options={{ headerShown: false, presentation: 'card' }} />
          </Stack>
          {Platform.OS !== 'web' && (
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          )}
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}