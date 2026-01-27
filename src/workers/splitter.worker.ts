/**
 * Web Worker for sentence splitting (runs in background thread)
 * This prevents UI freezing for large documents
 */

import { splitIntoSentences, splitWithParagraphs } from '../utils/textProcessing';
import { SplitterConfig } from '../utils/splitterConfig';
export interface SplitRequest {
  type: 'split' | 'split-with-paragraphs';
  text: string;
  config?: SplitterConfig;
}

export interface SplitResponse {
  type: 'success' | 'error';
  sentences?: string[];
  sentencesWithMeta?: Array<{
    sentence: string;
    paragraphIndex: number;
    positionInParagraph: number;
  }>;
  error?: string;
}

// Worker message handler
self.onmessage = (e: MessageEvent<SplitRequest>) => {
  const { type, text, config } = e.data;
  
  try {
    if (type === 'split') {
      const sentences = splitIntoSentences(text, config);
      const response: SplitResponse = {
        type: 'success',
        sentences,
      };
      self.postMessage(response);
    } else if (type === 'split-with-paragraphs') {
      const sentencesWithMeta = splitWithParagraphs(text, config);
      const response: SplitResponse = {
        type: 'success',
        sentencesWithMeta,
      };
      self.postMessage(response);
    }
  } catch (error) {
    const response: SplitResponse = {
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    self.postMessage(response);
  }
};
