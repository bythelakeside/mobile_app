import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthState } from '../types';
import { 
  signUp, 
  signIn, 
  signOut, 
  getCurrentUser, 
  onAuthChange,
  getUserData
} from '../services/firebase';

const BIOMETRICS_ENABLED_KEY = '@notes_app:biometrics_enabled';

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  // Check if biometrics are available
  useEffect(() => {
    const checkBiometrics = async () => {
      if (Platform.OS === 'web') {
        setBiometricsAvailable(false);
        return;
      }
      
      try {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setBiometricsAvailable(compatible && enrolled);
        
        // Check if user has enabled biometrics
        const storedValue = await AsyncStorage.getItem(BIOMETRICS_ENABLED_KEY);
        setBiometricsEnabled(storedValue === 'true');
      } catch (error) {
        console.error('Error checking biometrics:', error);
        setBiometricsAvailable(false);
      }
    };
    
    checkBiometrics();
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setState(prev => ({ ...prev, isLoading: true }));
      
      if (firebaseUser) {
        try {
          const userData = await getUserData(firebaseUser.uid);
          setState({
            user: userData,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error('Error getting user data:', error);
          setState({
            user: null,
            isLoading: false,
            error: 'Failed to load user data',
          });
        }
      } else {
        setState({
          user: null,
          isLoading: false,
          error: null,
        });
      }
    });
    
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await signIn(email, password);
      // Auth state listener will update the state
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message || 'Failed to login'
      }));
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const user = await signUp(email, password);
      setState({
        user,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message || 'Failed to register'
      }));
    }
  };

  const logout = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await signOut();
      // Auth state listener will update the state
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message || 'Failed to logout'
      }));
    }
  };

  const authenticateWithBiometrics = async (): Promise<boolean> => {
    if (Platform.OS === 'web' || !biometricsAvailable) {
      return false;
    }
    
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access your notes',
        fallbackLabel: 'Use passcode',
      });
      
      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  };

  const toggleBiometrics = async (enabled: boolean) => {
    try {
      await AsyncStorage.setItem(BIOMETRICS_ENABLED_KEY, enabled ? 'true' : 'false');
      setBiometricsEnabled(enabled);
    } catch (error) {
      console.error('Error toggling biometrics:', error);
    }
  };

  const loginAsGuest = () => {
    const guestUser: User = {
      id: 'guest',
      email: 'guest@example.com',
      displayName: 'Guest User',
      createdAt: Date.now(),
    };
    
    setState({
      user: guestUser,
      isLoading: false,
      error: null,
    });
  };

  return {
    ...state,
    login,
    register,
    logout,
    loginAsGuest,
    biometricsAvailable,
    biometricsEnabled,
    authenticateWithBiometrics,
    toggleBiometrics,
  };
};