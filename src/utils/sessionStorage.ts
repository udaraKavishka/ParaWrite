/**
 * Auto-save and session recovery utilities
 */

import { EditorState, SentenceState, ParagraphInfo } from '@/types/sentence';

const STORAGE_KEY = 'parawrite-session';
const AUTOSAVE_INTERVAL = 30000; // 30 seconds

export interface SavedSession {
  sentences: SentenceState[];
  paragraphs: ParagraphInfo[];
  currentIndex: number;
  savedAt: number;
  inputText?: string;
}

/**
 * Save current session to localStorage
 */
export function saveSession(
  sentences: SentenceState[],
  paragraphs: ParagraphInfo[],
  currentIndex: number,
  inputText?: string
): void {
  try {
    const session: SavedSession = {
      sentences,
      paragraphs,
      currentIndex,
      savedAt: Date.now(),
      inputText,
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Failed to save session:', error);
  }
}

/**
 * Load session from localStorage
 */
export function loadSession(): SavedSession | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    
    const session = JSON.parse(data) as SavedSession;
    
    // Check if session is too old (> 7 days)
    const MAX_AGE = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - session.savedAt > MAX_AGE) {
      clearSession();
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Failed to load session:', error);
    return null;
  }
}

/**
 * Clear saved session
 */
export function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear session:', error);
  }
}

/**
 * Check if a session exists
 */
export function hasSession(): boolean {
  return loadSession() !== null;
}

/**
 * Auto-save hook setup (returns cleanup function)
 */
export function setupAutosave(
  getSentences: () => SentenceState[],
  getParagraphs: () => ParagraphInfo[],
  getCurrentIndex: () => number,
  getInputText?: () => string
): () => void {
  const intervalId = setInterval(() => {
    saveSession(
      getSentences(),
      getParagraphs(),
      getCurrentIndex(),
      getInputText?.()
    );
  }, AUTOSAVE_INTERVAL);
  
  // Save on page unload
  const handleBeforeUnload = () => {
    saveSession(
      getSentences(),
      getParagraphs(),
      getCurrentIndex(),
      getInputText?.()
    );
  };
  
  window.addEventListener('beforeunload', handleBeforeUnload);
  
  // Return cleanup function
  return () => {
    clearInterval(intervalId);
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}

/**
 * Format saved time for display
 */
export function formatSavedTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
}
