/**
 * Context analysis utilities for term tracking and consistency
 */

import { ContextMetadata, SentenceState } from '@/types/sentence';

/**
 * Extract key terms from text (simple frequency-based)
 */
export function extractKeyTerms(text: string, minFrequency = 2): Map<string, number> {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3); // Skip short words
  
  const frequency = new Map<string, number>();
  words.forEach(word => {
    frequency.set(word, (frequency.get(word) || 0) + 1);
  });
  
  // Filter by minimum frequency
  return new Map(
    Array.from(frequency.entries()).filter(([_, count]) => count >= minFrequency)
  );
}

/**
 * Extract acronyms (all caps words 2-6 characters)
 */
export function extractAcronyms(text: string): Set<string> {
  const acronymPattern = /\b[A-Z]{2,6}\b/g;
  const matches = text.match(acronymPattern) || [];
  return new Set(matches);
}

/**
 * Extract simple named entities (capitalized words/phrases)
 */
export function extractEntities(text: string): Set<string> {
  // Match capitalized words (but not sentence starts)
  const entityPattern = /(?<!^|[.!?]\s+)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g;
  const matches = text.match(entityPattern) || [];
  return new Set(matches);
}

/**
 * Build context metadata from sentences
 */
export function buildContextMetadata(sentences: SentenceState[]): ContextMetadata {
  const allText = sentences.map(s => s.current).join(' ');
  
  return {
    keyTerms: extractKeyTerms(allText),
    acronyms: extractAcronyms(allText),
    entities: extractEntities(allText),
  };
}

/**
 * Check if key terms have been removed in edited version
 */
export function checkTermConsistency(
  original: string,
  edited: string,
  metadata: ContextMetadata
): string[] {
  const warnings: string[] = [];
  
  // Check for removed key terms
  const originalLower = original.toLowerCase();
  const editedLower = edited.toLowerCase();
  
  metadata.keyTerms.forEach((count, term) => {
    if (originalLower.includes(term) && !editedLower.includes(term)) {
      warnings.push(`Key term "${term}" was removed`);
    }
  });
  
  // Check for removed acronyms
  metadata.acronyms.forEach(acronym => {
    if (original.includes(acronym) && !edited.includes(acronym)) {
      warnings.push(`Acronym "${acronym}" was removed`);
    }
  });
  
  return warnings;
}

/**
 * Get word-level diff between two strings
 */
export function getWordDiff(original: string, edited: string): {
  added: string[];
  removed: string[];
  unchanged: string[];
} {
  const originalWords = original.split(/\s+/);
  const editedWords = edited.split(/\s+/);
  
  const originalSet = new Set(originalWords);
  const editedSet = new Set(editedWords);
  
  return {
    added: editedWords.filter(w => !originalSet.has(w)),
    removed: originalWords.filter(w => !editedSet.has(w)),
    unchanged: editedWords.filter(w => originalSet.has(w)),
  };
}
