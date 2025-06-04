import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { useNotes } from '../../hooks/useNotes';
import { Button } from '../../components/ui/Button';
import { LogOut, User } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';

export default function ProfileScreen() {
  const { user, logout, isLoading } = useAuth();
  const { notes } = useNotes(user?.id || null);
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const totalNotes = notes.length;
  const pinnedNotes = notes.filter(note => note.isPinned).length;

  const stats = [
    { label: 'Total Notes', value: totalNotes },
    { label: 'Pinned Notes', value: pinnedNotes },
    { label: 'Created', value: user ? new Date(user.createdAt).toLocaleDateString() : '-' },
  ];

  return (
    <SafeAreaView style={[
      styles.container, 
      isDark ? styles.containerDark : styles.containerLight
    ]}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={[styles.title, isDark && styles.titleDark]}>Profile</Text>
        </View>

        <View style={[
          styles.profileCard, 
          isDark ? styles.profileCardDark : styles.profileCardLight
        ]}>
          <View style={styles.profileHeader}>
            {user?.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={styles.avatar} />
            ) : (
              <View style={[
                styles.avatarPlaceholder,
                isDark ? styles.avatarPlaceholderDark : styles.avatarPlaceholderLight
              ]}>
                <User size={40} color={isDark ? '#FFFFFF' : '#000000'} />
              </View>
            )}
            <View style={styles.profileInfo}>
              <Text style={[styles.name, isDark && styles.nameDark]}>
                {user?.displayName || 'User'}
              </Text>
              <Text style={styles.email}>{user?.email}</Text>
            </View>
          </View>
          
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <Text style={[styles.statValue, isDark && styles.statValueDark]}>
                  {stat.value}
                </Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            Account
          </Text>
          <View style={[
            styles.sectionContent,
            isDark ? styles.sectionContentDark : styles.sectionContentLight
          ]}>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={[styles.menuText, isDark && styles.menuTextDark]}>
                Edit Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={[styles.menuText, isDark && styles.menuTextDark]}>
                Notification Preferences
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={[styles.menuText, isDark && styles.menuTextDark]}>
                Privacy Settings
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.logoutContainer}>
          <Button
            title="Log Out"
            variant="danger"
            leftIcon={<LogOut size={20} color="#FFFFFF" />}
            onPress={logout}
            isLoading={isLoading}
          />
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
  profileCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  profileCardLight: {
    backgroundColor: '#FFFFFF',
  },
  profileCardDark: {
    backgroundColor: '#1C1C1E',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderDark: {
    backgroundColor: '#2C2C2E',
  },
  avatarPlaceholderLight: {
    backgroundColor: '#E5E5EA',
  },
  profileInfo: {
    marginLeft: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  nameDark: {
    color: '#FFFFFF',
  },
  email: {
    fontSize: 14,
    color: '#8E8E93',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5EA',
    paddingTop: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  statValueDark: {
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
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
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  menuText: {
    fontSize: 16,
    color: '#000000',
  },
  menuTextDark: {
    color: '#FFFFFF',
  },
  logoutContainer: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
});