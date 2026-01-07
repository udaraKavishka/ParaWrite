/**
 * FileUpload Component
 * Handles file upload for TXT, DOCX, and PDF files
 * Displays upload area with drag-and-drop support
 */

import { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload = ({ onFileSelect }: FileUploadProps) => {
  const { toast } = useToast();

  // Handle file selection via input or drag-and-drop
  const handleFileChange = useCallback((file: File | null) => {
    if (!file) return;

    const allowedTypes = ['txt', 'docx', 'pdf'];
    const fileType = file.name.split('.').pop()?.toLowerCase();

    if (!fileType || !allowedTypes.includes(fileType)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a TXT, DOCX, or PDF file.',
        variant: 'destructive',
      });
      return;
    }

    onFileSelect(file);
  }, [onFileSelect, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  }, [handleFileChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <Card
      className="border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer p-12"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => document.getElementById('file-input')?.click()}
    >
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="p-4 rounded-full bg-primary/10">
          <Upload className="w-8 h-8 text-primary" />
        </div>
        <div>
          <p className="text-lg font-medium text-foreground">
            Drop your file here or click to browse
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Supports TXT, DOCX, and PDF files
          </p>
        </div>
        <input
          id="file-input"
          type="file"
          accept=".txt,.docx,.pdf"
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        />
      </div>
    </Card>
  );
};

export default FileUpload;
