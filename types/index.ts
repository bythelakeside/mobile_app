export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  tags: string[];
  category?: string;
  isPinned: boolean;
  color?: string;
  userId: string;
}

export type AuthState = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
};

export type NotesState = {
  notes: Note[];
  isLoading: boolean;
  error: string | null;
};

export type AppSettings = {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  useBiometrics: boolean;
};