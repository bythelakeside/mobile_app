import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { StickyNote, User, Settings } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';

export default function TabLayout() {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: [
          styles.tabBar,
          isDark ? styles.tabBarDark : styles.tabBarLight
        ],
        tabBarActiveTintColor: isDark ? '#0A84FF' : '#007AFF',
        tabBarInactiveTintColor: isDark ? '#98989D' : '#8E8E93',
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Notes',
          tabBarIcon: ({ color, size }) => (
            <StickyNote size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    height: 80,
    paddingBottom: 20,
  },
  tabBarLight: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E5E5EA',
  },
  tabBarDark: {
    backgroundColor: '#1C1C1E',
    borderTopColor: '#38383A',
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});