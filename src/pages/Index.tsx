/**
 * Main Index Page
 * Orchestrates the entire paraphrasing workflow:
 * 1. Upload/Input screen
 * 2. Paraphrasing screen (sentence-by-sentence editing)
 * 3. Final output screen
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import FileUpload from '@/components/FileUpload';
import TextInput from '@/components/TextInput';
import ParaphrasingScreen from '@/components/ParaphrasingScreen';
import FinalOutput from '@/components/FinalOutput';
import { parseFile, splitIntoSentences } from '@/utils/textProcessing';
import { FileText } from 'lucide-react';

// Define different stages of the workflow
type Stage = 'input' | 'paraphrasing' | 'output';

const Index = () => {
  const { toast } = useToast();
  
  // Current workflow stage
  const [stage, setStage] = useState<Stage>('input');
  
  // User input text (from file or textarea)
  const [inputText, setInputText] = useState('');
  
  // Array of sentences split from input text
  const [sentences, setSentences] = useState<string[]>([]);
  
  // Final edited sentences after paraphrasing
  const [editedSentences, setEditedSentences] = useState<string[]>([]);
  
  // Loading state for file processing
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle file selection and parsing
  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    try {
      const text = await parseFile(file);
      setInputText(text);
      toast({
        title: 'File loaded',
        description: `Successfully loaded ${file.name}`,
      });
    } catch (error) {
      toast({
        title: 'Error loading file',
        description: error instanceof Error ? error.message : 'Failed to load file',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Start paraphrasing by splitting text into sentences
  const handleStartParaphrasing = () => {
    if (!inputText.trim()) {
      toast({
        title: 'No text provided',
        description: 'Please upload a file or paste some text first.',
        variant: 'destructive',
      });
      return;
    }

    const splitSentences = splitIntoSentences(inputText);
    
    if (splitSentences.length === 0) {
      toast({
        title: 'No sentences found',
        description: 'Could not split the text into sentences.',
        variant: 'destructive',
      });
      return;
    }

    setSentences(splitSentences);
    setStage('paraphrasing');
  };

  // Handle completion of paraphrasing
  const handleParaphrasingComplete = (edited: string[]) => {
    setEditedSentences(edited);
    setStage('output');
  };

  // Reset to initial state
  const handleStartOver = () => {
    setStage('input');
    setInputText('');
    setSentences([]);
    setEditedSentences([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Manual Paraphrasing Tool
              </h1>
              <p className="text-sm text-muted-foreground">
                Edit your text sentence by sentence with full context
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="container mx-auto px-4 py-8">
        {/* Stage 1: Input (Upload or Paste) */}
        {stage === 'input' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                Get Started
              </h2>
              <p className="text-muted-foreground">
                Upload a document or paste your text to begin paraphrasing
              </p>
            </div>

            {/* <FileUpload onFileSelect={handleFileSelect} /> */}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>

            <TextInput value={inputText} onChange={setInputText} />

            <div className="flex justify-center">
              <Button
                onClick={handleStartParaphrasing}
                disabled={!inputText.trim() || isProcessing}
                size="lg"
                className="min-w-[200px]"
              >
                {isProcessing ? 'Processing...' : 'Start Paraphrasing'}
              </Button>
            </div>
          </div>
        )}

        {/* Stage 2: Paraphrasing */}
        {stage === 'paraphrasing' && (
          <ParaphrasingScreen
            sentences={sentences}
            onComplete={handleParaphrasingComplete}
            onBack={handleStartOver}
          />
        )}

        {/* Stage 3: Final Output */}
        {stage === 'output' && (
          <FinalOutput
            editedSentences={editedSentences}
            onStartOver={handleStartOver}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Manual Paraphrasing Tool - Edit text with context and precision</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
