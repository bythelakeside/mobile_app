import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '../types';
import { createNote, getNotes, updateNote, deleteNote } from './firebase';
import { Platform } from 'react-native';

// Keys for AsyncStorage
const NOTES_STORAGE_KEY = '@notes_app:notes';
const SYNC_STATUS_KEY = '@notes_app:sync_status';

// Interface for sync status
interface SyncStatus {
  lastSynced: number;
  pendingChanges: {
    create: string[];
    update: string[];
    delete: string[];
  };
}

// Initialize sync status
const initSyncStatus = async (): Promise<SyncStatus> => {
  try {
    const storedStatus = await AsyncStorage.getItem(SYNC_STATUS_KEY);
    if (storedStatus) {
      return JSON.parse(storedStatus);
    }
    const initialStatus: SyncStatus = {
      lastSynced: 0,
      pendingChanges: {
        create: [],
        update: [],
        delete: []
      }
    };
    await AsyncStorage.setItem(SYNC_STATUS_KEY, JSON.stringify(initialStatus));
    return initialStatus;
  } catch (error) {
    console.error('Error initializing sync status:', error);
    throw error;
  }
};

// Update sync status
const updateSyncStatus = async (status: SyncStatus): Promise<void> => {
  try {
    await AsyncStorage.setItem(SYNC_STATUS_KEY, JSON.stringify(status));
  } catch (error) {
    console.error('Error updating sync status:', error);
    throw error;
  }
};

// Get local notes
export const getLocalNotes = async (userId: string): Promise<Note[]> => {
  try {
    const storedNotes = await AsyncStorage.getItem(`${NOTES_STORAGE_KEY}_${userId}`);
    if (storedNotes) {
      return JSON.parse(storedNotes);
    }
    return [];
  } catch (error) {
    console.error('Error getting local notes:', error);
    return [];
  }
};

// Save notes locally
export const saveLocalNotes = async (userId: string, notes: Note[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(`${NOTES_STORAGE_KEY}_${userId}`, JSON.stringify(notes));
  } catch (error) {
    console.error('Error saving local notes:', error);
    throw error;
  }
};

// Create a note (local and cloud if online)
export const createNoteService = async (note: Omit<Note, 'id'>, isOnline: boolean): Promise<Note> => {
  try {
    // Generate a local ID
    const localId = `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const newNote: Note = { 
      ...note, 
      id: localId,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    // Get existing notes and add the new one
    const existingNotes = await getLocalNotes(note.userId);
    const updatedNotes = [newNote, ...existingNotes];
    await saveLocalNotes(note.userId, updatedNotes);
    
    // If online, try to sync with Firebase
    if (isOnline && Platform.OS !== 'web') {
      try {
        const cloudId = await createNote(newNote);
        // Update the local note with the cloud ID
        const noteWithCloudId: Note = { ...newNote, id: cloudId };
        const notesWithUpdatedId = updatedNotes.map(n => 
          n.id === localId ? noteWithCloudId : n
        );
        await saveLocalNotes(note.userId, notesWithUpdatedId);
        return noteWithCloudId;
      } catch (error) {
        console.error('Error creating note in cloud:', error);
        // Update sync status to retry later
        const syncStatus = await initSyncStatus();
        syncStatus.pendingChanges.create.push(localId);
        await updateSyncStatus(syncStatus);
      }
    }
    
    return newNote;
  } catch (error) {
    console.error('Error in createNoteService:', error);
    throw error;
  }
};

// Update a note (local and cloud if online)
export const updateNoteService = async (
  noteId: string, 
  data: Partial<Note>,
  userId: string,
  isOnline: boolean
): Promise<Note> => {
  try {
    // Get existing notes
    const existingNotes = await getLocalNotes(userId);
    const noteIndex = existingNotes.findIndex(n => n.id === noteId);
    
    if (noteIndex === -1) {
      throw new Error('Note not found');
    }
    
    // Update the note locally
    const updatedNote: Note = { 
      ...existingNotes[noteIndex],
      ...data,
      updatedAt: Date.now()
    };
    
    existingNotes[noteIndex] = updatedNote;
    await saveLocalNotes(userId, existingNotes);
    
    // If online, try to sync with Firebase
    if (isOnline && Platform.OS !== 'web' && !noteId.startsWith('local_')) {
      try {
        await updateNote(noteId, data);
      } catch (error) {
        console.error('Error updating note in cloud:', error);
        // Update sync status to retry later
        const syncStatus = await initSyncStatus();
        if (!syncStatus.pendingChanges.update.includes(noteId)) {
          syncStatus.pendingChanges.update.push(noteId);
          await updateSyncStatus(syncStatus);
        }
      }
    }
    
    return updatedNote;
  } catch (error) {
    console.error('Error in updateNoteService:', error);
    throw error;
  }
};

// Delete a note (local and cloud if online)
export const deleteNoteService = async (
  noteId: string,
  userId: string,
  isOnline: boolean
): Promise<void> => {
  try {
    // Get existing notes
    const existingNotes = await getLocalNotes(userId);
    const updatedNotes = existingNotes.filter(n => n.id !== noteId);
    await saveLocalNotes(userId, updatedNotes);
    
    // If online, try to sync with Firebase
    if (isOnline && Platform.OS !== 'web' && !noteId.startsWith('local_')) {
      try {
        await deleteNote(noteId);
      } catch (error) {
        console.error('Error deleting note in cloud:', error);
        // Update sync status to retry later
        const syncStatus = await initSyncStatus();
        if (!syncStatus.pendingChanges.delete.includes(noteId)) {
          syncStatus.pendingChanges.delete.push(noteId);
          await updateSyncStatus(syncStatus);
        }
      }
    }
  } catch (error) {
    console.error('Error in deleteNoteService:', error);
    throw error;
  }
};

// Sync notes with cloud
export const syncNotes = async (userId: string, isOnline: boolean): Promise<Note[]> => {
  if (!isOnline || Platform.OS === 'web') {
    return await getLocalNotes(userId);
  }
  
  try {
    // Get sync status
    const syncStatus = await initSyncStatus();
    
    // Process pending changes
    // This is a simplified version - a real implementation would handle conflicts
    
    // Get cloud notes
    const cloudNotes = await getNotes(userId);
    
    // Get local notes
    const localNotes = await getLocalNotes(userId);
    
    // Merge notes (simple strategy - cloud wins)
    const mergedNotes = [...cloudNotes];
    
    // Add local notes that don't exist in cloud
    localNotes.forEach(localNote => {
      if (localNote.id.startsWith('local_')) {
        mergedNotes.push(localNote);
      }
    });
    
    // Save merged notes locally
    await saveLocalNotes(userId, mergedNotes);
    
    // Update sync status
    syncStatus.lastSynced = Date.now();
    syncStatus.pendingChanges = {
      create: [],
      update: [],
      delete: []
    };
    await updateSyncStatus(syncStatus);
    
    return mergedNotes;
  } catch (error) {
    console.error('Error syncing notes:', error);
    return await getLocalNotes(userId);
  }
};