import { useState, useEffect, useCallback } from 'react';
import { Platform, NetInfo } from 'react-native';
import { Note, NotesState } from '../types';
import { 
  getLocalNotes, 
  saveLocalNotes, 
  createNoteService, 
  updateNoteService, 
  deleteNoteService,
  syncNotes
} from '../services/noteService';

export const useNotes = (userId: string | null) => {
  const [state, setState] = useState<NotesState>({
    notes: [],
    isLoading: true,
    error: null,
  });
  const [isOnline, setIsOnline] = useState(true);

  // Check network status (simplified, as NetInfo is complex in RN)
  useEffect(() => {
    // Just setting to true for this example
    // In a real app, you'd use NetInfo to check network status
    setIsOnline(Platform.OS !== 'web');
    
    // This would be the actual implementation
    // const unsubscribe = NetInfo.addEventListener(state => {
    //   setIsOnline(state.isConnected);
    // });
    
    // return () => unsubscribe();
  }, []);

  // Load notes
  useEffect(() => {
    if (!userId) {
      setState({
        notes: [],
        isLoading: false,
        error: null,
      });
      return;
    }
    
    const loadNotes = async () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        // If online, sync with cloud
        // If offline, get from local storage
        const notes = await syncNotes(userId, isOnline);
        
        setState({
          notes,
          isLoading: false,
          error: null,
        });
      } catch (error: any) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error.message || 'Failed to load notes',
        }));
      }
    };
    
    loadNotes();
  }, [userId, isOnline]);

  const createNote = useCallback(async (note: Omit<Note, 'id'>) => {
    if (!userId) return null;
    
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const newNote = await createNoteService(
        { ...note, userId }, 
        isOnline
      );
      
      setState(prev => ({
        notes: [newNote, ...prev.notes],
        isLoading: false,
        error: null,
      }));
      
      return newNote;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to create note',
      }));
      return null;
    }
  }, [userId, isOnline]);

  const updateNote = useCallback(async (noteId: string, data: Partial<Note>) => {
    if (!userId) return null;
    
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const updatedNote = await updateNoteService(
        noteId,
        data,
        userId,
        isOnline
      );
      
      setState(prev => ({
        notes: prev.notes.map(note => 
          note.id === noteId ? updatedNote : note
        ),
        isLoading: false,
        error: null,
      }));
      
      return updatedNote;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to update note',
      }));
      return null;
    }
  }, [userId, isOnline]);

  const deleteNote = useCallback(async (noteId: string) => {
    if (!userId) return;
    
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await deleteNoteService(
        noteId,
        userId,
        isOnline
      );
      
      setState(prev => ({
        notes: prev.notes.filter(note => note.id !== noteId),
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to delete note',
      }));
    }
  }, [userId, isOnline]);

  const togglePinNote = useCallback(async (noteId: string) => {
    if (!userId) return;
    
    const noteToUpdate = state.notes.find(note => note.id === noteId);
    if (!noteToUpdate) return;
    
    await updateNote(noteId, { isPinned: !noteToUpdate.isPinned });
  }, [userId, state.notes, updateNote]);

  return {
    ...state,
    createNote,
    updateNote,
    deleteNote,
    togglePinNote,
    isOnline,
  };
};