/**
 * Readability and text analysis utilities
 */

export interface ReadabilityMetrics {
  fleschReadingEase: number;
  fleschKincaidGrade: number;
  averageSentenceLength: number;
  averageWordLength: number;
  syllableCount: number;
  wordCount: number;
  sentenceCount: number;
  readingLevel: string;
}

/**
 * Count syllables in a word (approximation)
 */
function countSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  
  // Remove non-letters
  word = word.replace(/[^a-z]/g, '');
  
  // Count vowel groups
  const vowels = word.match(/[aeiouy]+/g);
  let syllables = vowels ? vowels.length : 1;
  
  // Adjust for silent e
  if (word.endsWith('e')) {
    syllables--;
  }
  
  // Adjust for le ending
  if (word.endsWith('le') && word.length > 2) {
    syllables++;
  }
  
  return Math.max(syllables, 1);
}

/**
 * Calculate readability metrics for text
 */
export function calculateReadability(text: string): ReadabilityMetrics {
  // Split into sentences
  const sentences = text
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  const sentenceCount = sentences.length || 1;
  
  // Split into words
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 0);
  
  const wordCount = words.length || 1;
  
  // Calculate syllables
  const syllableCount = words.reduce((sum, word) => sum + countSyllables(word), 0);
  
  // Average lengths
  const averageSentenceLength = wordCount / sentenceCount;
  const averageWordLength = text.replace(/\s/g, '').length / wordCount;
  const averageSyllablesPerWord = syllableCount / wordCount;
  
  // Flesch Reading Ease (0-100, higher is easier)
  const fleschReadingEase = 206.835 - 1.015 * averageSentenceLength - 84.6 * averageSyllablesPerWord;
  
  // Flesch-Kincaid Grade Level
  const fleschKincaidGrade = 0.39 * averageSentenceLength + 11.8 * averageSyllablesPerWord - 15.59;
  
  // Determine reading level
  let readingLevel = 'Unknown';
  if (fleschReadingEase >= 90) readingLevel = 'Very Easy (5th grade)';
  else if (fleschReadingEase >= 80) readingLevel = 'Easy (6th grade)';
  else if (fleschReadingEase >= 70) readingLevel = 'Fairly Easy (7th grade)';
  else if (fleschReadingEase >= 60) readingLevel = 'Standard (8th-9th grade)';
  else if (fleschReadingEase >= 50) readingLevel = 'Fairly Difficult (10th-12th grade)';
  else if (fleschReadingEase >= 30) readingLevel = 'Difficult (College)';
  else readingLevel = 'Very Difficult (College graduate)';
  
  return {
    fleschReadingEase: Math.max(0, Math.min(100, fleschReadingEase)),
    fleschKincaidGrade: Math.max(0, fleschKincaidGrade),
    averageSentenceLength,
    averageWordLength,
    syllableCount,
    wordCount,
    sentenceCount,
    readingLevel,
  };
}

/**
 * Compare readability before and after editing
 */
export function compareReadability(
  originalText: string,
  editedText: string
): {
  original: ReadabilityMetrics;
  edited: ReadabilityMetrics;
  improvement: {
    readingEase: number;
    gradeLevel: number;
  };
} {
  const original = calculateReadability(originalText);
  const edited = calculateReadability(editedText);
  
  return {
    original,
    edited,
    improvement: {
      readingEase: edited.fleschReadingEase - original.fleschReadingEase,
      gradeLevel: original.fleschKincaidGrade - edited.fleschKincaidGrade,
    },
  };
}
