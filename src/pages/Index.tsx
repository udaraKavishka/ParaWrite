/**
 * Main Index Page
 * Orchestrates the entire paraphrasing workflow:
 * 1. Upload/Input screen
 * 2. Paraphrasing screen (sentence-by-sentence editing)
 * 3. Final output screen
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import FileUpload from '@/components/FileUpload';
import TextInput from '@/components/TextInput';
import ParaphrasingScreen from '@/components/ParaphrasingScreen';
import FinalOutput from '@/components/FinalOutput';
import VersionHistory from '@/components/VersionHistory';
import UseCases from '@/components/UseCases';
import About from '@/components/About';
import { parseFile, splitIntoSentences } from '@/utils/textProcessing';
import { FileText, History, BookOpen, Info } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

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
    console.log('File selected in Index:', file.name, file.type, file.size);
    
    try {
      console.log('Starting file parsing...');
      const text = await parseFile(file);
      console.log('File parsed successfully, text length:', text.length);
      
      if (!text || text.trim().length === 0) {
        throw new Error('The file appears to be empty or contains no readable text.');
      }
      
      setInputText(text);
      toast({
        title: 'File loaded successfully',
        description: `Successfully loaded ${file.name} (${text.length} characters)`,
      });
    } catch (error) {
      console.error('Error loading file:', error);
      toast({
        title: 'Error loading file',
        description: error instanceof Error ? error.message : 'Failed to load file. Please try again.',
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
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  ParaWrite
                </h1>
                <p className="text-sm text-muted-foreground">
                  Professional sentence-by-sentence paraphrasing tool
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="tool" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="tool" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Tool
            </TabsTrigger>
            <TabsTrigger value="version-history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Version History
            </TabsTrigger>
            <TabsTrigger value="use-cases" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Use Cases
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              About
            </TabsTrigger>
          </TabsList>

          {/* Tool Tab */}
          <TabsContent value="tool">
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

                <FileUpload onFileSelect={handleFileSelect} />

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
          </TabsContent>

          {/* Version History Tab */}
          <TabsContent value="version-history">
            <VersionHistory />
          </TabsContent>

          {/* Use Cases Tab */}
          <TabsContent value="use-cases">
            <UseCases />
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about">
            <About />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>ParaWrite v2.0.0 - Professional sentence-by-sentence paraphrasing</p>
            <div className="flex items-center gap-4">
              <a
                href="1.5.0 https://github.com/udaraKavishka/ParaWrite"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                GitHub
              </a>
              <span>•</span>
              <a
                href="mailto:hello@udaradev.me"
                className="hover:text-foreground transition-colors"
              >
                Contact
              </a>
              <span>•</span>
              <span>MIT License</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
