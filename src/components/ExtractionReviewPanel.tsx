import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import FindReplaceToolbar from '@/components/FindReplaceToolbar';
import type { RetryMode } from '@/types/extraction';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ExtractionReviewPanelProps {
  open: boolean;
  fileName: string;
  fileType: string;
  text: string;
  method: string;
  isLoading: boolean;
  onTextChange: (value: string) => void;
  onConfirm: () => void;
  onRetry: (mode: RetryMode, reason: string) => void;
  onOpenChange: (open: boolean) => void;
}

const ExtractionReviewPanel = ({
  open,
  fileName,
  fileType,
  text,
  method,
  isLoading,
  onTextChange,
  onConfirm,
  onRetry,
  onOpenChange,
}: ExtractionReviewPanelProps) => {
  const handleRetry = () => {
    const input = document.getElementById('error-reason') as HTMLInputElement | null;
    onRetry('auto', input?.value.trim() || 'user_reported_issue');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review Extracted Text</DialogTitle>
          <DialogDescription>
            {fileName} ({fileType.toUpperCase()}) • Method: {method}
          </DialogDescription>
        </DialogHeader>

        <FindReplaceToolbar value={text} onChange={onTextChange} />

        <div className="space-y-2">
          <Label htmlFor="extracted-text">Extracted text (editable)</Label>
          <Textarea
            id="extracted-text"
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            className="min-h-[320px] text-base"
          />
        </div>

        <ErrorReporter isLoading={isLoading} />

        <div className="grid gap-3 md:grid-cols-2">
          <Button disabled={isLoading} onClick={handleRetry} variant="outline">
            Retry Extraction
          </Button>
          <Button disabled={isLoading} onClick={onConfirm}>
            Confirm and Use Text
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ErrorReporter = ({
  isLoading,
}: {
  isLoading: boolean;
}) => {
  return (
    <div className="space-y-2 rounded-md border border-border p-4">
      <Label htmlFor="error-reason">What is wrong with the extraction?</Label>
      <Input
        id="error-reason"
        placeholder="Example: symbols are garbled, missing pages, wrong language"
        disabled={isLoading}
      />
      <p className="text-xs text-muted-foreground">This note helps choose the next extraction strategy.</p>
    </div>
  );
};

export default ExtractionReviewPanel;
