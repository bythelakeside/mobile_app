import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Moon, Sun, Fingerprint, Info } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';

export default function SettingsScreen() {
  const { settings, updateSettings, theme } = useApp();
  const { biometricsAvailable, biometricsEnabled, toggleBiometrics } = useAuth();
  const isDark = theme === 'dark';

  const handleThemeChange = (value: 'light' | 'dark' | 'system') => {
    updateSettings({ theme: value });
  };

  const handleFontSizeChange = (value: 'small' | 'medium' | 'large') => {
    updateSettings({ fontSize: value });
  };

  const handleBiometricsChange = (value: boolean) => {
    toggleBiometrics(value);
  };

  return (
    <SafeAreaView style={[
      styles.container, 
      isDark ? styles.containerDark : styles.containerLight
    ]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.titleDark]}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            Appearance
          </Text>
          <View style={[
            styles.sectionContent,
            isDark ? styles.sectionContentDark : styles.sectionContentLight
          ]}>
            <View style={styles.settingItem}>
              <Text style={[styles.settingLabel, isDark && styles.settingLabelDark]}>
                Theme
              </Text>
              <View style={styles.themeButtons}>
                <TouchableOpacity
                  style={[
                    styles.themeButton,
                    settings.theme === 'light' && styles.themeButtonActive,
                  ]}
                  onPress={() => handleThemeChange('light')}
                >
                  <Sun size={20} color={settings.theme === 'light' ? '#FFFFFF' : (isDark ? '#FFFFFF' : '#000000')} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.themeButton,
                    settings.theme === 'dark' && styles.themeButtonActive,
                  ]}
                  onPress={() => handleThemeChange('dark')}
                >
                  <Moon size={20} color={settings.theme === 'dark' ? '#FFFFFF' : (isDark ? '#FFFFFF' : '#000000')} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.themeButton,
                    settings.theme === 'system' && styles.themeButtonActive,
                  ]}
                  onPress={() => handleThemeChange('system')}
                >
                  <Text style={[
                    styles.systemText,
                    settings.theme === 'system' && styles.systemTextActive,
                  ]}>
                    Auto
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.settingItem}>
              <Text style={[styles.settingLabel, isDark && styles.settingLabelDark]}>
                Font Size
              </Text>
              <View style={styles.fontSizeButtons}>
                <TouchableOpacity
                  style={[
                    styles.fontSizeButton,
                    settings.fontSize === 'small' && styles.fontSizeButtonActive,
                  ]}
                  onPress={() => handleFontSizeChange('small')}
                >
                  <Text style={[
                    styles.fontSizeText,
                    settings.fontSize === 'small' && styles.fontSizeTextActive,
                  ]}>
                    Small
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.fontSizeButton,
                    settings.fontSize === 'medium' && styles.fontSizeButtonActive,
                  ]}
                  onPress={() => handleFontSizeChange('medium')}
                >
                  <Text style={[
                    styles.fontSizeText,
                    settings.fontSize === 'medium' && styles.fontSizeTextActive,
                  ]}>
                    Medium
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.fontSizeButton,
                    settings.fontSize === 'large' && styles.fontSizeButtonActive,
                  ]}
                  onPress={() => handleFontSizeChange('large')}
                >
                  <Text style={[
                    styles.fontSizeText,
                    settings.fontSize === 'large' && styles.fontSizeTextActive,
                  ]}>
                    Large
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            Security
          </Text>
          <View style={[
            styles.sectionContent,
            isDark ? styles.sectionContentDark : styles.sectionContentLight
          ]}>
            {biometricsAvailable ? (
              <View style={styles.settingItem}>
                <View style={styles.settingLabelContainer}>
                  <Fingerprint size={20} color={isDark ? '#FFFFFF' : '#000000'} />
                  <Text style={[styles.settingLabel, isDark && styles.settingLabelDark, { marginLeft: 8 }]}>
                    Use Biometrics
                  </Text>
                </View>
                <Switch
                  value={biometricsEnabled}
                  onValueChange={handleBiometricsChange}
                  trackColor={{ false: '#767577', true: '#007AFF' }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor="#3e3e3e"
                />
              </View>
            ) : (
              <View style={styles.settingItem}>
                <View style={styles.settingLabelContainer}>
                  <Fingerprint size={20} color={isDark ? '#98989D' : '#8E8E93'} />
                  <Text style={[styles.settingLabel, { color: isDark ? '#98989D' : '#8E8E93', marginLeft: 8 }]}>
                    Use Biometrics (Not Available)
                  </Text>
                </View>
                <Switch
                  value={false}
                  disabled
                  trackColor={{ false: '#767577', true: '#007AFF' }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor="#3e3e3e"
                />
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            About
          </Text>
          <View style={[
            styles.sectionContent,
            isDark ? styles.sectionContentDark : styles.sectionContentLight
          ]}>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLabelContainer}>
                <Info size={20} color={isDark ? '#FFFFFF' : '#000000'} />
                <Text style={[styles.settingLabel, isDark && styles.settingLabelDark, { marginLeft: 8 }]}>
                  App Version
                </Text>
              </View>
              <Text style={styles.versionText}>1.0.0</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <Text style={[styles.settingLabel, isDark && styles.settingLabelDark]}>
                Privacy Policy
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <Text style={[styles.settingLabel, isDark && styles.settingLabelDark]}>
                Terms of Service
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLight: {
    backgroundColor: '#F2F2F7',
  },
  containerDark: {
    backgroundColor: '#000000',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  sectionContent: {
    borderRadius: 16,
    marginHorizontal: 20,
    overflow: 'hidden',
  },
  sectionContentLight: {
    backgroundColor: '#FFFFFF',
  },
  sectionContentDark: {
    backgroundColor: '#1C1C1E',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: '#000000',
  },
  settingLabelDark: {
    color: '#FFFFFF',
  },
  themeButtons: {
    flexDirection: 'row',
  },
  themeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  themeButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  systemText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  systemTextActive: {
    color: '#FFFFFF',
  },
  fontSizeButtons: {
    flexDirection: 'row',
  },
  fontSizeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  fontSizeButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  fontSizeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  fontSizeTextActive: {
    color: '#FFFFFF',
  },
  versionText: {
    fontSize: 14,
    color: '#8E8E93',
  },
});