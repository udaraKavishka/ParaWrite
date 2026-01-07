/**
 * FinalOutput Component
 * Displays the complete paraphrased text after all sentences are edited
 * Provides options to copy or download the final text
 */

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { combineSentences } from '@/utils/textProcessing';

interface FinalOutputProps {
  editedSentences: string[];
  onStartOver: () => void;
}

const FinalOutput = ({ editedSentences, onStartOver }: FinalOutputProps) => {
  const { toast } = useToast();
  const finalText = combineSentences(editedSentences);

  // Copy text to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(finalText);
      toast({
        title: 'Copied!',
        description: 'Text copied to clipboard successfully.',
      });
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Failed to copy text to clipboard.',
        variant: 'destructive',
      });
    }
  };

  // Download text as a file
  const handleDownload = () => {
    const blob = new Blob([finalText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `paraphrased-text-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Downloaded!',
      description: 'Your paraphrased text has been downloaded.',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Success message */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">
          Paraphrasing Complete! 🎉
        </h2>
        <p className="text-muted-foreground">
          Your text has been successfully paraphrased. Review it below and download or copy as needed.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-primary">{editedSentences.length}</p>
          <p className="text-sm text-muted-foreground">Sentences</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-primary">{finalText.split(' ').length}</p>
          <p className="text-sm text-muted-foreground">Words</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-primary">{finalText.length}</p>
          <p className="text-sm text-muted-foreground">Characters</p>
        </Card>
      </div>

      {/* Final text display */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Your Paraphrased Text
            </h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-muted border border-border max-h-[500px] overflow-y-auto">
            <p className="text-base leading-relaxed whitespace-pre-wrap">
              {finalText}
            </p>
          </div>
        </div>
      </Card>

      {/* Action buttons */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={onStartOver}
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Start New Paraphrasing
        </Button>
      </div>
    </div>
  );
};

export default FinalOutput;
