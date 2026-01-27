/**
 * Utility functions for text processing and sentence splitting
 */

import {
  SplitterConfig,
  getAbbreviations,
  isNativeSplitterAvailable,
  splitWithNativeSegmenter,
  MODE_CONFIGS,
} from './splitterConfig';

/**
 * Split text into sentences using robust heuristics with configurable modes.
 *
 * Handles common edge cases:
 * - Abbreviations (e.g., "Dr.", "e.g.", months, company suffixes)
 * - Initials and acronyms (e.g., "U.S.A.", "John A. Smith")
 * - Decimals and numeric patterns (e.g., "3.14")
 * - Mixed punctuation and ellipses (e.g., "?!", "...")
 * - Quotes/brackets around sentence endings (e.g., "Hello!"), ) ] } »
 * - Does not require next sentence to start with a capital (configurable by mode)
 * 
 * @param text - The text to split
 * @param config - Optional configuration for splitting behavior
 */
export const splitIntoSentences = (
  text: string,
  config: SplitterConfig = { mode: 'balanced' }
): string[] => {
  if (!text || text.trim().length === 0) return [];

  // Try native splitter first if enabled and available
  if (config.useNativeSplitter && isNativeSplitterAvailable()) {
    const nativeResult = splitWithNativeSegmenter(text);
    if (nativeResult.length > 0) {
      return nativeResult;
    }
  }

  // Normalize internal whitespace for predictable scanning while keeping content intact
  const cleanedText = text.replace(/\s+/g, ' ').trim();

  // Get abbreviations based on configuration
  const ABBREVIATIONS = getAbbreviations(config);
  const modeConfig = MODE_CONFIGS[config.mode];

  // Characters considered as closing wrappers to include at sentence end
  const CLOSERS = new Set<string>(['"', '\'', '”', '“', '’', ')', ']', '}', '»']);

  const sentences: string[] = [];
  let start = 0;
  let i = 0;

  const sliceSafe = (s: string, from: number, to?: number) => s.slice(Math.max(0, from), to);

  while (i < cleanedText.length) {
    const ch = cleanedText[i];

    if (ch === '.' || ch === '!' || ch === '?') {
      // Extend over consecutive punctuation like ... or ?!
      let end = i;
      while (end + 1 < cleanedText.length && /[.!?]/.test(cleanedText[end + 1])) {
        end++;
      }

      // Include trailing closers like quotes/brackets immediately after punctuation
      let j = end + 1;
      while (j < cleanedText.length && CLOSERS.has(cleanedText[j])) {
        j++;
      }

      // Find the next non-whitespace character after potential boundary
      let k = j;
      while (k < cleanedText.length && /\s/.test(cleanedText[k])) {
        k++;
      }

      const nextChar = cleanedText[k] || '';
      const windowBefore = sliceSafe(cleanedText, i - 50, i + 1); // includes current punctuation
      const windowSmall = sliceSafe(cleanedText, i - 10, i + 1);

      // Heuristics to avoid false sentence boundaries
      const isDecimal = ch === '.' && /\d\.\d/.test(sliceSafe(cleanedText, i - 1, i + 2));
      
      // Check for multi-character abbreviations like "e.g.", "i.e.", "et al."
      // Look back to see if we end with one of these patterns
      const endsWithMultiDotAbbrev = /\b(e\.g|i\.e|et\sal)\.$/.test(windowBefore);
      
      // Also check if we're at the FIRST dot of these abbreviations
      const isFirstDotOfEgIe = /\b[ei]\.$/.test(windowSmall) && 
                                /^[gi]\./.test(sliceSafe(cleanedText, i + 1, i + 3));
      
      // Check for acronym/initials - complete acronyms (like U.S.A.) end when followed by space
      // Multi-letter acronyms: at least 2 capital-dot pairs
      const hasAcronymPattern = /(?:\b[A-Z]\.){2,}$/.test(windowBefore);
      const nextCharAfterPeriod = cleanedText[i + 1] || '';
      const nextTwoChars = sliceSafe(cleanedText, i + 1, i + 3);
      
      // Are we in the middle of an acronym? (next is capital followed by period)
      const isInMiddleOfAcronym = /^[A-Z]\./.test(nextTwoChars);
      
      // Prevent split if we're in middle of acronym OR if we have an acronym pattern and next isn't a space
      const isPartialAcronym = (hasAcronymPattern || isInMiddleOfAcronym) && nextCharAfterPeriod !== ' ' && nextCharAfterPeriod !== '';
      
      // Single initial check - "John A." should not split when followed by capital
      const isSingleInitial = /\b[A-Z]\.$/.test(windowSmall) && 
                               !hasAcronymPattern &&
                               !isInMiddleOfAcronym &&
                               nextCharAfterPeriod === ' ' &&
                               /^[A-Z]/.test(nextChar);
      
      // Check for simple word abbreviations  
      const wordAbbrevMatch = windowBefore.match(/\b([A-Za-z][A-Za-z\-]+)\.$/);
      const isWordAbbrev = wordAbbrevMatch && ABBREVIATIONS.has(wordAbbrevMatch[1].toLowerCase() + '.');
      
      // Simple email/URL guard
      const isEmailLike = /@[A-Za-z0-9_.-]+\.[A-Za-z]{2,}$/.test(sliceSafe(cleanedText, i - 64, i + 1));

      let shouldSplit = false;
      if (ch === '.') {
        shouldSplit = !(
          isDecimal || 
          endsWithMultiDotAbbrev ||
          isFirstDotOfEgIe ||
          isPartialAcronym || 
          isSingleInitial || 
          isWordAbbrev || 
          isEmailLike
        );
      } else {
        // ! or ? normally indicate end of sentence
        shouldSplit = true;
      }

      if (shouldSplit) {
        const sentence = cleanedText.slice(start, j).trim();
        if (sentence.length >= modeConfig.minSentenceLength) {
          sentences.push(sentence);
        }
        start = k; // continue after whitespace
      }

      i = end + 1;
      continue;
    }

    i++;
  }

  // Push any trailing text as the last sentence
  const tail = cleanedText.slice(start).trim();
  if (tail.length) sentences.push(tail);

  return sentences;
};

/**
 * Split text into paragraphs, preserving structure
 */
export const splitIntoParagraphs = (text: string): string[] => {
  if (!text || text.trim().length === 0) return [];
  
  // Split on double newlines or paragraph markers
  return text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0);
};

/**
 * Split text preserving paragraph boundaries
 * Returns sentences with paragraph metadata
 */
export const splitWithParagraphs = (
  text: string,
  config: SplitterConfig = { mode: 'balanced' }
): Array<{ sentence: string; paragraphIndex: number; positionInParagraph: number }> => {
  const paragraphs = splitIntoParagraphs(text);
  const result: Array<{ sentence: string; paragraphIndex: number; positionInParagraph: number }> = [];
  
  paragraphs.forEach((paragraph, paragraphIndex) => {
    const sentences = splitIntoSentences(paragraph, config);
    sentences.forEach((sentence, positionInParagraph) => {
      result.push({
        sentence,
        paragraphIndex,
        positionInParagraph,
      });
    });
  });
  
  return result;
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
 * Supports TXT, DOCX, DOC, and PDF (via Supabase function)
 */
export const parseFile = async (file: File): Promise<string> => {
  const fileType = file.name.split('.').pop()?.toLowerCase();
  
  console.log('Parsing file:', file.name, 'Type:', fileType, 'MIME:', file.type);
  
  if (fileType === 'txt') {
    try {
      const text = await file.text();
      console.log('TXT file parsed, length:', text.length);
      return text;
    } catch (error) {
      console.error('Error reading TXT file:', error);
      throw new Error('Failed to read TXT file');
    }
  }
  
  if (fileType === 'docx' || fileType === 'doc') {
    try {
      console.log('Loading mammoth library...');
      const mammoth = await import('mammoth');
      console.log('Converting file to array buffer...');
      const arrayBuffer = await file.arrayBuffer();
      console.log('Extracting text from DOCX...');
      const result = await mammoth.extractRawText({ arrayBuffer });
      console.log('DOCX text extracted, length:', result.value.length);
      
      if (!result.value || result.value.trim().length === 0) {
        throw new Error('No text found in the document');
      }
      
      return result.value;
    } catch (error) {
      console.error('Error parsing DOCX file:', error);
      throw new Error(`Failed to parse DOCX file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  if (fileType === 'pdf') {
    console.log('Processing PDF file...');
    
    // Client-side PDF parsing with pdf-parse
    try {
      console.log('Loading pdf-parse library...');
      const { PDFParse } = await import('pdf-parse');
      console.log('Converting file to array buffer...');
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      console.log('Extracting text from PDF with pdf-parse...');
      const parser = new PDFParse({ data: uint8Array });
      const result = await parser.getText();
      console.log('PDF text extracted, length:', result.text?.length || 0);
      
      if (!result.text || result.text.trim().length === 0) {
        throw new Error('No text found in the PDF');
      }
      
      return result.text;
    } catch (clientError) {
      console.error('PDF parsing failed:', clientError);
      throw new Error(`Failed to parse PDF: ${clientError instanceof Error ? clientError.message : 'Unknown error'}. Try converting to DOCX format.`);
      
      /* SUPABASE FALLBACK - DISABLED FOR NOW (Future Enhancement)
      // Fall back to Supabase edge function if client-side fails
      console.warn('Client-side PDF parsing failed, trying Supabase function...', clientError);
      
      try {
        // Check if Supabase URL is configured
        if (!import.meta.env.VITE_SUPABASE_URL) {
          throw new Error('PDF parsing failed. Please ensure your PDF is text-based (not scanned) or set up Supabase integration.');
        }
        
        console.log('Sending PDF to Supabase function...');
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/parse-pdf`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: formData,
          }
        );
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error('PDF extraction failed:', errorData);
          throw new Error(errorData.error || 'Failed to extract text from PDF');
        }
        
        const data = await response.json();
        console.log('PDF text extracted via Supabase, length:', data.text?.length || 0);
        
        if (!data.text || data.text.trim().length === 0) {
          throw new Error('No text found in the PDF');
        }
      
        return data.text;
      } catch (supabaseError) {
        console.error('Supabase PDF parsing also failed:', supabaseError);
        throw new Error(`Failed to parse PDF: ${supabaseError instanceof Error ? supabaseError.message : 'Unknown error'}. Try converting to DOCX format.`);
      }
      */
    }
  }
  
  throw new Error(`Unsupported file type: ${fileType}. Please upload TXT, DOCX, or PDF files.`);
};
