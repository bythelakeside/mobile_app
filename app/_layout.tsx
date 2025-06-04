import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider } from '@/context/AppContext';
import { useColorScheme, Platform, View } from 'react-native';

export default function RootLayout() {
  useFrameworkReady();
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <View style={{ flex: 1 }}>
            <Stack>
              <Stack.Screen 
                name="(auth)" 
                options={{ 
                  headerShown: false,
                  animation: Platform.OS === 'web' ? 'none' : 'default'
                }} 
              />
              <Stack.Screen 
                name="(tabs)" 
                options={{ 
                  headerShown: false,
                  animation: Platform.OS === 'web' ? 'none' : 'default'
                }} 
              />
              <Stack.Screen 
                name="note/[id]" 
                options={{ 
                  headerShown: false,
                  presentation: Platform.OS === 'web' ? 'card' : 'modal',
                  animation: Platform.OS === 'web' ? 'none' : 'default'
                }} 
              />
              <Stack.Screen 
                name="create" 
                options={{ 
                  headerShown: false,
                  presentation: Platform.OS === 'web' ? 'card' : 'modal',
                  animation: Platform.OS === 'web' ? 'none' : 'default'
                }} 
              />
            </Stack>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          </View>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}