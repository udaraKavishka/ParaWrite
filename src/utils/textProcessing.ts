/**
 * Utility functions for text processing and sentence splitting
 */

/**
 * Split text into sentences while preserving paragraph structure
 * Uses multiple sentence-ending patterns to handle various cases
 */
export const splitIntoSentences = (text: string): string[] => {
  if (!text || text.trim().length === 0) return [];
  
  // Replace multiple spaces with single space and trim
  const cleanedText = text.replace(/\s+/g, ' ').trim();
  
  // Split on sentence-ending punctuation followed by space and capital letter
  // or end of string, while preserving the punctuation
  const sentencePattern = /[.!?]+(?=\s+[A-Z]|$)/g;
  
  const sentences = cleanedText
    .split(sentencePattern)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  // Add back the punctuation that was used as delimiter
  const matches = cleanedText.match(sentencePattern) || [];
  const result: string[] = [];
  
  sentences.forEach((sentence, index) => {
    if (matches[index]) {
      result.push(sentence + matches[index]);
    } else {
      result.push(sentence);
    }
  });
  
  return result.filter(s => s.trim().length > 0);
};

/**
 * Combine edited sentences back into paragraphs
 * Preserves basic paragraph structure by adding line breaks
 */
export const combineSentences = (sentences: string[]): string => {
  if (!sentences || sentences.length === 0) return '';
  
  return sentences
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .join(' ');
};

/**
 * Read and parse text from uploaded file
 * Supports TXT, DOCX, and PDF (via Gemini API)
 */
export const parseFile = async (file: File): Promise<string> => {
  const fileType = file.name.split('.').pop()?.toLowerCase();
  
  if (fileType === 'txt') {
    return await file.text();
  }
  
  if (fileType === 'docx') {
    // Dynamic import to reduce bundle size
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }
  
  if (fileType === 'pdf') {
    // Use Gemini API to extract text from PDF
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/extract-text`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || 'Failed to extract text from PDF');
    }
    
    const data = await response.json();
    return data.text;
  }
  
  throw new Error(`Unsupported file type: ${fileType}`);
};
