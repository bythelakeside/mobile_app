import React from 'react';
import { useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { useNotes } from '../hooks/useNotes';
import { NoteEditor } from '../components/notes/NoteEditor';
import { useApp } from '../context/AppContext';

export default function CreateNoteScreen() {
  const { user } = useAuth();
  const { createNote } = useNotes(user?.id || null);
  const router = useRouter();
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const handleSave = async (title: string, content: string) => {
    if (!user) return;
    
    const newNote = await createNote({
      title,
      content,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tags: [],
      isPinned: false,
      userId: user.id,
    });
    
    if (newNote) {
      router.replace(`/note/${newNote.id}`);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[
      styles.container,
      isDark ? styles.containerDark : styles.containerLight
    ]}>
      <NoteEditor
        onSave={handleSave}
        onGoBack={handleGoBack}
      />
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