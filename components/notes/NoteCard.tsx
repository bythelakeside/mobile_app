import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Pin, Trash2 } from 'lucide-react-native';
import { Note } from '../../types';
import { useApp } from '../../context/AppContext';
import { Swipeable } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ 
  note, 
  onDelete,
  onTogglePin 
}) => {
  const router = useRouter();
  const { theme } = useApp();
  const isDark = theme === 'dark';
  
  const handlePress = () => {
    router.push(`/note/${note.id}`);
  };
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };
  
  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    
    return (
      <View style={styles.rightActions}>
        <Animated.View style={[styles.rightAction, styles.pinAction, { transform: [{ translateX: trans }] }]}>
          <TouchableOpacity 
            onPress={() => {
              triggerHaptic();
              onTogglePin(note.id);
            }}
            style={styles.actionButton}
          >
            <Pin size={24} color="#FFFFFF" />
            <Text style={styles.actionText}>{note.isPinned ? 'Unpin' : 'Pin'}</Text>
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View style={[styles.rightAction, styles.deleteAction, { transform: [{ translateX: trans }] }]}>
          <TouchableOpacity 
            onPress={() => {
              triggerHaptic();
              onDelete(note.id);
            }}
            style={styles.actionButton}
          >
            <Trash2 size={24} color="#FFFFFF" />
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };
  
  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity 
        onPress={handlePress}
        style={[
          styles.container, 
          isDark ? styles.containerDark : styles.containerLight,
          note.isPinned && styles.pinnedNote,
          { backgroundColor: note.color || (isDark ? '#1C1C1E' : '#FFFFFF') }
        ]}
      >
        <View style={styles.header}>
          <Text 
            style={[
              styles.title, 
              isDark && styles.textDark,
              !note.title && styles.untitled
            ]}
            numberOfLines={1}
          >
            {note.title || 'Untitled Note'}
          </Text>
          {note.isPinned && (
            <Pin 
              size={16} 
              color={isDark ? '#0A84FF' : '#007AFF'} 
            />
          )}
        </View>
        
        <Text 
          style={[styles.preview, isDark && styles.textDark]} 
          numberOfLines={2}
        >
          {note.content || 'No content'}
        </Text>
        
        <View style={styles.footer}>
          <Text style={[styles.date, isDark && styles.dateDark]}>
            {formatDate(note.updatedAt)}
          </Text>
          
          {note.tags && note.tags.length > 0 && (
            <View style={styles.tags}>
              {note.tags.slice(0, 2).map((tag, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.tag, 
                    isDark ? styles.tagDark : styles.tagLight
                  ]}
                >
                  <Text 
                    style={[
                      styles.tagText, 
                      isDark && styles.tagTextDark
                    ]}
                    numberOfLines={1}
                  >
                    {tag}
                  </Text>
                </View>
              ))}
              {note.tags.length > 2 && (
                <Text style={[styles.moreTag, isDark && styles.moreTagDark]}>
                  +{note.tags.length - 2}
                </Text>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  containerLight: {
    backgroundColor: '#FFFFFF',
  },
  containerDark: {
    backgroundColor: '#1C1C1E',
  },
  pinnedNote: {
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
    marginRight: 8,
  },
  untitled: {
    fontStyle: 'italic',
    opacity: 0.7,
  },
  preview: {
    fontSize: 15,
    color: '#000000',
    opacity: 0.7,
    marginBottom: 12,
  },
  textDark: {
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#8E8E93',
  },
  dateDark: {
    color: '#98989D',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    maxWidth: width * 0.4,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginLeft: 4,
  },
  tagLight: {
    backgroundColor: '#E5E5EA',
  },
  tagDark: {
    backgroundColor: '#2C2C2E',
  },
  tagText: {
    fontSize: 11,
    color: '#000000',
    maxWidth: 60,
  },
  tagTextDark: {
    color: '#FFFFFF',
  },
  moreTag: {
    fontSize: 11,
    color: '#8E8E93',
    marginLeft: 4,
    paddingTop: 3,
  },
  moreTagDark: {
    color: '#98989D',
  },
  rightActions: {
    flexDirection: 'row',
    width: 160,
    height: '100%',
  },
  rightAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinAction: {
    backgroundColor: '#0A84FF',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  deleteAction: {
    backgroundColor: '#FF453A',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});