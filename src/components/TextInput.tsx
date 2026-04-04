/**
 * TextInput Component
 * Provides a textarea for users to paste text directly
 * Alternative to file upload
 */

import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

const TextInput = ({ value, onChange }: TextInputProps) => {
  return (
    <Card className="surface-card p-4 sm:p-6">
      <div className="space-y-3">
        <Label htmlFor="text-input" className="text-base font-medium">
          Paste your text here
        </Label>
        <Textarea
          id="text-input"
          placeholder="Paste your text here to start paraphrasing..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[180px] sm:min-h-[220px] resize-y text-sm sm:text-base"
        />
      </div>
    </Card>
  );
};

export default TextInput;
