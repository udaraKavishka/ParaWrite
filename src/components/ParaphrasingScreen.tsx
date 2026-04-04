/**
 * ParaphrasingScreen Component
 * Main editing interface where users paraphrase sentences one by one
 * Shows current sentence with previous and next for context
 * Includes navigation buttons and progress indicator
 */

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

interface ParaphrasingScreenProps {
  sentences: string[];
  onComplete: (editedSentences: string[]) => void;
  onBack: () => void;
}

const ParaphrasingScreen = ({ sentences, onComplete, onBack }: ParaphrasingScreenProps) => {
  // Track current sentence index
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Store edited versions of all sentences (initialized with originals)
  const [editedSentences, setEditedSentences] = useState<string[]>(sentences);

  // Handle changes to current sentence
  const handleSentenceChange = (value: string) => {
    const updated = [...editedSentences];
    updated[currentIndex] = value;
    setEditedSentences(updated);
  };

  // Navigate to previous sentence
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Navigate to next sentence or complete if on last sentence
  const handleNext = () => {
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // All sentences processed, move to final output
      onComplete(editedSentences);
    }
  };

  const progress = ((currentIndex + 1) / sentences.length) * 100;
  const isFirstSentence = currentIndex === 0;
  const isLastSentence = currentIndex === sentences.length - 1;

  return (
    <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6">
      {/* Progress indicator */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-muted-foreground">
            Sentence {currentIndex + 1} of {sentences.length}
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="surface-card p-4 sm:p-6 space-y-5 sm:space-y-6">
        {/* Previous sentence for context */}
        {!isFirstSentence && (
          <div className="pb-4 border-b border-border">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Previous sentence:
            </p>
            <p className="text-sm text-context italic">
              {editedSentences[currentIndex - 1]}
            </p>
          </div>
        )}

        {/* Current sentence editing area */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">
              Current sentence:
            </p>
            <p className="text-xs text-muted-foreground">
              Original: {sentences[currentIndex].length} chars
            </p>
          </div>
          
          {/* Original sentence display with highlight */}
          <div className="p-3 sm:p-4 rounded-lg bg-highlight border border-border">
            <p className="text-sm sm:text-base leading-relaxed">
              {sentences[currentIndex]}
            </p>
          </div>

          {/* Editable textarea for paraphrasing */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Your paraphrase:
            </p>
            <Textarea
              value={editedSentences[currentIndex]}
              onChange={(e) => handleSentenceChange(e.target.value)}
              className="min-h-[130px] sm:min-h-[140px] text-sm sm:text-base"
              placeholder="Enter your paraphrased version here..."
            />
          </div>
        </div>

        {/* Next sentence for context */}
        {!isLastSentence && (
          <div className="pt-4 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Next sentence:
            </p>
            <p className="text-sm text-context italic">
              {sentences[currentIndex + 1]}
            </p>
          </div>
        )}
      </Card>

      {/* Navigation buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="w-full"
        >
          Start Over
        </Button>
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={isFirstSentence}
          className="gap-2 w-full sm:w-auto"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        <Button
          onClick={handleNext}
          className="gap-2 w-full sm:w-auto"
        >
          {isLastSentence ? 'Complete' : 'Next'}
          {!isLastSentence && <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
};

export default ParaphrasingScreen;
