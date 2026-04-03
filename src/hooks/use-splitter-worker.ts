/**
 * Hook for using the sentence splitter Web Worker
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { SplitterConfig } from '@/utils/splitterConfig';

interface UseSplitterWorkerResult {
  split: (text: string, config?: SplitterConfig) => Promise<string[]>;
  splitWithParagraphs: (
    text: string,
    config?: SplitterConfig
  ) => Promise<Array<{ sentence: string; paragraphIndex: number; positionInParagraph: number }>>;
  isProcessing: boolean;
  error: string | null;
}

export function useSplitterWorker(): UseSplitterWorkerResult {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);
  
  // Initialize worker
  useEffect(() => {
    try {
      // Note: In production, you'll need to configure Vite to handle workers
      workerRef.current = new Worker(
        new URL('../workers/splitter.worker.ts', import.meta.url),
        { type: 'module' }
      );
    } catch {
      setError('Failed to initialize background processor');
    }
    
    return () => {
      workerRef.current?.terminate();
    };
  }, []);
  
  const split = useCallback(
    (text: string, config?: SplitterConfig): Promise<string[]> => {
      return new Promise((resolve, reject) => {
        if (!workerRef.current) {
          // Fallback to synchronous split if worker not available
          import('@/utils/textProcessing').then(({ splitIntoSentences }) => {
            try {
              const result = splitIntoSentences(text, config);
              resolve(result);
            } catch (err) {
              reject(err);
            }
          });
          return;
        }
        
        setIsProcessing(true);
        setError(null);
        
        const handleMessage = (e: MessageEvent) => {
          setIsProcessing(false);
          
          if (e.data.type === 'success') {
            resolve(e.data.sentences || []);
          } else {
            const errorMsg = e.data.error || 'Unknown error';
            setError(errorMsg);
            reject(new Error(errorMsg));
          }
          
          workerRef.current?.removeEventListener('message', handleMessage);
        };
        
        workerRef.current.addEventListener('message', handleMessage);
        workerRef.current.postMessage({
          type: 'split',
          text,
          config,
        });
      });
    },
    []
  );
  
  const splitWithParagraphs = useCallback(
    (text: string, config?: SplitterConfig) => {
      return new Promise<
        Array<{ sentence: string; paragraphIndex: number; positionInParagraph: number }>
      >((resolve, reject) => {
        if (!workerRef.current) {
          // Fallback
          import('@/utils/textProcessing').then(({ splitWithParagraphs }) => {
            try {
              const result = splitWithParagraphs(text, config);
              resolve(result);
            } catch (err) {
              reject(err);
            }
          });
          return;
        }
        
        setIsProcessing(true);
        setError(null);
        
        const handleMessage = (e: MessageEvent) => {
          setIsProcessing(false);
          
          if (e.data.type === 'success') {
            resolve(e.data.sentencesWithMeta || []);
          } else {
            const errorMsg = e.data.error || 'Unknown error';
            setError(errorMsg);
            reject(new Error(errorMsg));
          }
          
          workerRef.current?.removeEventListener('message', handleMessage);
        };
        
        workerRef.current.addEventListener('message', handleMessage);
        workerRef.current.postMessage({
          type: 'split-with-paragraphs',
          text,
          config,
        });
      });
    },
    []
  );
  
  return {
    split,
    splitWithParagraphs,
    isProcessing,
    error,
  };
}
