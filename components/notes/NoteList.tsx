import React, { useState } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Search, Plus, X } from 'lucide-react-native';
import { Note } from '../../types';
import { NoteCard } from './NoteCard';
import { useApp } from '../../context/AppContext';
import { useRouter } from 'expo-router';

interface NoteListProps {
  notes: Note[];
  isLoading: boolean;
  onDeleteNote: (id: string) => void;
  onTogglePinNote: (id: string) => void;
}

export const NoteList: React.FC<NoteListProps> = ({ 
  notes, 
  isLoading,
  onDeleteNote,
  onTogglePinNote,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const router = useRouter();
  
  const filteredNotes = searchQuery
    ? notes.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.tags && note.tags.some(tag => 
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      )
    : notes;
  
  const pinnedNotes = filteredNotes.filter(note => note.isPinned);
  const unpinnedNotes = filteredNotes.filter(note => !note.isPinned);
  
  const combinedNotes = [...pinnedNotes, ...unpinnedNotes];
  
  const handleCreateNote = () => {
    router.push('/create');
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={isDark ? '#FFFFFF' : '#007AFF'} />
      </View>
    );
  }
  
  const renderSectionHeader = (title: string) => {
    if ((title === 'Pinned' && pinnedNotes.length === 0) || 
        (title === 'Notes' && unpinnedNotes.length === 0)) {
      return null;
    }
    
    return (
      <Text style={[
        styles.sectionHeader, 
        isDark && styles.sectionHeaderDark
      ]}>
        {title}
      </Text>
    );
  };
  
  return (
    <View style={[
      styles.container, 
      isDark ? styles.containerDark : styles.containerLight
    ]}>
      <View style={styles.header}>
        {showSearch ? (
          <View style={[
            styles.searchContainer,
            isDark ? styles.searchContainerDark : styles.searchContainerLight
          ]}>
            <Search size={20} color={isDark ? '#98989D' : '#8E8E93'} />
            <TextInput
              style={[styles.searchInput, isDark && styles.searchInputDark]}
              placeholder="Search notes..."
              placeholderTextColor={isDark ? '#98989D' : '#8E8E93'}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            <TouchableOpacity onPress={() => {
              setSearchQuery('');
              setShowSearch(false);
            }}>
              <X size={20} color={isDark ? '#98989D' : '#8E8E93'} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={() => setShowSearch(true)}
            >
              <Search size={24} color={isDark ? '#FFFFFF' : '#000000'} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.iconButton, styles.createButton]} 
              onPress={handleCreateNote}
            >
              <Plus size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {combinedNotes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
            {searchQuery ? 'No notes match your search' : 'No notes yet'}
          </Text>
          {!searchQuery && (
            <TouchableOpacity 
              style={styles.createNoteButton}
              onPress={handleCreateNote}
            >
              <Text style={styles.createNoteText}>Create a note</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={combinedNotes}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => {
            const isPinned = item.isPinned;
            const isPrevItemPinned = index > 0 ? combinedNotes[index - 1].isPinned : false;
            
            // Add section headers
            if (index === 0 && isPinned) {
              return (
                <>
                  {renderSectionHeader('Pinned')}
                  <NoteCard 
                    note={item}
                    onDelete={onDeleteNote}
                    onTogglePin={onTogglePinNote}
                  />
                </>
              );
            } else if (!isPinned && isPrevItemPinned) {
              return (
                <>
                  {renderSectionHeader('Notes')}
                  <NoteCard 
                    note={item}
                    onDelete={onDeleteNote}
                    onTogglePin={onTogglePinNote}
                  />
                </>
              );
            }
            
            return (
              <NoteCard 
                note={item}
                onDelete={onDeleteNote}
                onTogglePin={onTogglePinNote}
              />
            );
          }}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  createButton: {
    backgroundColor: '#007AFF',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E5EA',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
  },
  searchContainerDark: {
    backgroundColor: '#1C1C1E',
  },
  searchContainerLight: {
    backgroundColor: '#E5E5EA',
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginHorizontal: 8,
    fontSize: 16,
    color: '#000000',
  },
  searchInputDark: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000000',
  },
  sectionHeaderDark: {
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyTextDark: {
    color: '#98989D',
  },
  createNoteButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#007AFF',
    borderRadius: 10,
  },
  createNoteText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});