import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { useNotes } from '../../hooks/useNotes';
import { NoteEditor } from '../../components/notes/NoteEditor';
import { useApp } from '../../context/AppContext';

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { notes, updateNote, isLoading } = useNotes(user?.id || null);
  const router = useRouter();
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const note = notes.find(n => n.id === id);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (title: string, content: string) => {
    if (!note || !user) return;
    
    setIsSaving(true);
    await updateNote(note.id, { title, content });
    setIsSaving(false);
  };

  const handleGoBack = () => {
    router.back();
  };

  if (!note && !isLoading) {
    // Note not found, go back
    router.replace('/');
    return null;
  }

  return (
    <SafeAreaView style={[
      styles.container,
      isDark ? styles.containerDark : styles.containerLight
    ]}>
      {note && (
        <NoteEditor
          note={note}
          onSave={handleSave}
          onGoBack={handleGoBack}
        />
      )}
    </SafeAreaView>
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
});