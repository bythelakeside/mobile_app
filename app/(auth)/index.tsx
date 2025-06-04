import React, { useState } from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { LoginForm } from '../../components/auth/LoginForm';
import { RegisterForm } from '../../components/auth/RegisterForm';
import { useApp } from '../../context/AppContext';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const { user, login, register, loginAsGuest, isLoading, error, biometricsAvailable, authenticateWithBiometrics } = useAuth();
  const router = useRouter();
  const { theme } = useApp();
  const isDark = theme === 'dark';

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
  };

  const handleRegister = async (email: string, password: string) => {
    await register(email, password);
  };

  const handleGuest = () => {
    loginAsGuest();
  };

  const handleBiometricLogin = async () => {
    const success = await authenticateWithBiometrics();
    if (success) {
      // In a real app, you'd implement a way to get the user's credentials
      // after successful biometric authentication
      // For this example, we'll just use a demo account
      await login('demo@example.com', 'password123');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/636243/pexels-photo-636243.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }}
              style={styles.logo}
            />
          </View>

          {isLogin ? (
            <LoginForm
              onLogin={handleLogin}
              onRegister={() => setIsLogin(false)}
              onGuest={handleGuest}
              onBiometricLogin={handleBiometricLogin}
              error={error}
              isLoading={isLoading}
              biometricsAvailable={biometricsAvailable}
            />
          ) : (
            <RegisterForm
              onRegister={handleRegister}
              onLogin={() => setIsLogin(true)}
              error={error}
              isLoading={isLoading}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLight: {
    backgroundColor: '#FFFFFF',
  },
  containerDark: {
    backgroundColor: '#000000',
  },
  scrollContent: {
    flexGrow: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    borderRadius: 60,
  },
});