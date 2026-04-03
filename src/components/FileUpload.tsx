/**
 * FileUpload Component
 * Handles file upload for TXT, DOCX, DOC, and PDF files
 * Displays upload area with drag-and-drop support
 */

import { useCallback, useState } from 'react';
import { Upload, FileText, File } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;

const FileUpload = ({ onFileSelect }: FileUploadProps) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);

  // Handle file selection via input or drag-and-drop
  const handleFileChange = useCallback((file: File | null) => {
    if (!file) return;

    const allowedTypes = ['txt', 'docx', 'pdf', 'doc', 'md', 'mdx'];
    const fileType = file.name.split('.').pop()?.toLowerCase();

    if (!fileType || !allowedTypes.includes(fileType)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a TXT, DOCX, DOC, PDF, MD, or MDX file.',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast({
        title: 'File too large',
        description: 'Please upload a file smaller than 15MB.',
        variant: 'destructive',
      });
      return;
    }

    onFileSelect(file);
  }, [onFileSelect, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  }, [handleFileChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  return (
    <Card
      className={`border-2 border-dashed transition-all cursor-pointer p-12 ${
        isDragging 
          ? 'border-primary bg-primary/5 scale-105' 
          : 'border-border hover:border-primary hover:bg-accent/50'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onClick={() => document.getElementById('file-input')?.click()}
    >
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className={`p-4 rounded-full transition-all ${
          isDragging ? 'bg-primary/20' : 'bg-primary/10'
        }`}>
          {isDragging ? (
            <File className="w-8 h-8 text-primary animate-pulse" />
          ) : (
            <Upload className="w-8 h-8 text-primary" />
          )}
        </div>
        <div>
          <p className="text-lg font-medium text-foreground">
            {isDragging ? 'Drop your file here' : 'Drop your file here or click to browse'}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Supports TXT, DOCX, DOC, PDF, MD, and MDX files
          </p>
        </div>
        <input
          id="file-input"
          type="file"
          accept=".txt,.docx,.doc,.pdf,.md,.mdx"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleFileChange(file);
            }
            // Reset input value to allow selecting the same file again
            e.target.value = '';
          }}
        />
      </div>
    </Card>
  );
};

export default FileUpload;
