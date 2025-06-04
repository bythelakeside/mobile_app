import React, { useState, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { Note } from '../../types';
import { ArrowLeft, MoreVertical, Mic } from 'lucide-react-native';
import * as Speech from 'expo-speech';

interface NoteEditorProps {
  note?: Note;
  onSave: (title: string, content: string) => void;
  onGoBack: () => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ 
  note, 
  onSave,
  onGoBack 
}) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [isRecording, setIsRecording] = useState(false);
  const { theme } = useApp();
  const isDark = theme === 'dark';
  
  // Auto-save when typing stops
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      if (title !== note?.title || content !== note?.content) {
        onSave(title, content);
      }
    }, 1000);
    
    return () => clearTimeout(saveTimeout);
  }, [title, content, note, onSave]);
  
  const startSpeechToText = async () => {
    if (Platform.OS === 'web') {
      alert('Speech to text is not available on the web platform');
      return;
    }
    
    setIsRecording(true);
    
    // This is a simplified simulation of speech-to-text
    // In a real app, you'd use a proper speech recognition API
    setTimeout(() => {
      setIsRecording(false);
      const newText = content + " [Voice note transcription would appear here]";
      setContent(newText);
    }, 2000);
  };
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <View style={[
        styles.container,
        isDark ? styles.containerDark : styles.containerLight
      ]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={onGoBack}
          >
            <ArrowLeft size={24} color={isDark ? '#FFFFFF' : '#000000'} />
          </TouchableOpacity>
          
          <View style={styles.actions}>
            <TouchableOpacity 
              style={[
                styles.actionButton, 
                isRecording && styles.recordingButton
              ]}
              onPress={startSpeechToText}
            >
              <Mic 
                size={22} 
                color={isRecording ? '#FFFFFF' : (isDark ? '#FFFFFF' : '#000000')} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <MoreVertical size={22} color={isDark ? '#FFFFFF' : '#000000'} />
            </TouchableOpacity>
          </View>
        </View>
        
        <ScrollView 
          style={styles.editorContainer}
          keyboardShouldPersistTaps="handled"
        >
          <TextInput
            style={[
              styles.titleInput, 
              isDark && styles.textDark
            ]}
            placeholder="Title"
            placeholderTextColor={isDark ? '#98989D' : '#8E8E93'}
            value={title}
            onChangeText={setTitle}
          />
          
          <TextInput
            style={[
              styles.contentInput, 
              isDark && styles.textDark
            ]}
            placeholder="Start typing..."
            placeholderTextColor={isDark ? '#98989D' : '#8E8E93'}
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            autoFocus={!note?.content}
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    padding: 8,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 16,
  },
  recordingButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 16,
  },
  editorContainer: {
    flex: 1,
    padding: 16,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000000',
    padding: 0,
  },
  contentInput: {
    fontSize: 17,
    lineHeight: 24,
    color: '#000000',
    padding: 0,
    minHeight: 300,
  },
  textDark: {
    color: '#FFFFFF',
  },
});