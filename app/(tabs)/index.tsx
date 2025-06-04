import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { useNotes } from '../../hooks/useNotes';
import { NoteList } from '../../components/notes/NoteList';
import { useApp } from '../../context/AppContext';

export default function NotesScreen() {
  const { user } = useAuth();
  const { notes, isLoading, deleteNote, togglePinNote } = useNotes(user?.id || null);
  const router = useRouter();
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const handleDeleteNote = useCallback((id: string) => {
    deleteNote(id);
  }, [deleteNote]);

  const handleTogglePinNote = useCallback((id: string) => {
    togglePinNote(id);
  }, [togglePinNote]);

  return (
    <SafeAreaView style={[
      styles.container,
      isDark ? styles.containerDark : styles.containerLight
    ]}>
      <View style={styles.header}>
      </View>
      <NoteList
        notes={notes}
        isLoading={isLoading}
        onDeleteNote={handleDeleteNote}
        onTogglePinNote={handleTogglePinNote}
      />
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
    paddingHorizontal: 16,
  },
});