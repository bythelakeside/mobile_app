import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings } from '../types';
import { useColorScheme } from 'react-native';

type AppContextType = {
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  theme: 'light' | 'dark';
};

const AppContext = createContext<AppContextType | null>(null);

const SETTINGS_STORAGE_KEY = '@notes_app:settings';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceTheme = useColorScheme() as 'light' | 'dark';
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'system',
    fontSize: 'medium',
    useBiometrics: false,
  });

  // Load settings from AsyncStorage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
        if (storedSettings) {
          setSettings(JSON.parse(storedSettings));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    
    loadSettings();
  }, []);

  // Update settings
  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  // Determine the active theme
  const theme = settings.theme === 'system' ? deviceTheme : settings.theme;

  return (
    <AppContext.Provider value={{ settings, updateSettings, theme }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};