/**
 * Export utilities for multiple formats
 */

import { SentenceState, ParagraphInfo } from '@/types/sentence';

export type ExportFormat = 'txt' | 'docx' | 'markdown';

export interface ExportOptions {
  format: ExportFormat;
  preserveParagraphs: boolean;
  includeMetadata?: boolean;
  filename?: string;
}

/**
 * Combine sentences back into text, respecting paragraph boundaries
 */
export function combineSentencesWithParagraphs(
  sentences: SentenceState[],
  paragraphs: ParagraphInfo[]
): string {
  if (!sentences || sentences.length === 0) return '';
  
  const paragraphMap = new Map<number, string[]>();
  
  // Group sentences by paragraph
  sentences.forEach(sentence => {
    const paraSentences = paragraphMap.get(sentence.paragraphIndex) || [];
    paraSentences.push(sentence.current.trim());
    paragraphMap.set(sentence.paragraphIndex, paraSentences);
  });
  
  // Combine paragraphs
  const paragraphTexts: string[] = [];
  paragraphs.forEach(para => {
    const paraSentences = paragraphMap.get(para.index) || [];
    if (paraSentences.length > 0) {
      paragraphTexts.push(paraSentences.join(' '));
    }
  });
  
  return paragraphTexts.join('\n\n');
}

/**
 * Export as plain text
 */
export function exportAsText(sentences: SentenceState[], paragraphs?: ParagraphInfo[]): string {
  if (paragraphs && paragraphs.length > 0) {
    return combineSentencesWithParagraphs(sentences, paragraphs);
  }
  
  return sentences
    .map(s => s.current.trim())
    .filter(s => s.length > 0)
    .join(' ');
}

/**
 * Export as Markdown
 */
export function exportAsMarkdown(sentences: SentenceState[], paragraphs?: ParagraphInfo[]): string {
  const text = paragraphs && paragraphs.length > 0
    ? combineSentencesWithParagraphs(sentences, paragraphs)
    : sentences.map(s => s.current.trim()).join(' ');
  
  // Simple markdown formatting
  return `# Paraphrased Document

${text}

---

*Exported from ParaWrite*
`;
}

/**
 * Export as DOCX (requires docx library)
 */
export async function exportAsDocx(
  sentences: SentenceState[],
  paragraphs?: ParagraphInfo[]
): Promise<Blob> {
  // Dynamic import to reduce bundle size
  const { Document, Paragraph, TextRun, Packer } = await import('docx');
  
  const docParagraphs: InstanceType<typeof Paragraph>[] = [];
  
  if (paragraphs && paragraphs.length > 0) {
    const paragraphMap = new Map<number, string[]>();
    
    sentences.forEach(sentence => {
      const paraSentences = paragraphMap.get(sentence.paragraphIndex) || [];
      paraSentences.push(sentence.current.trim());
      paragraphMap.set(sentence.paragraphIndex, paraSentences);
    });
    
    paragraphs.forEach(para => {
      const paraSentences = paragraphMap.get(para.index) || [];
      if (paraSentences.length > 0) {
        docParagraphs.push(
          new Paragraph({
            children: [new TextRun(paraSentences.join(' '))],
            spacing: { after: 200 },
          })
        );
      }
    });
  } else {
    // Simple flat structure
    sentences.forEach(sentence => {
      docParagraphs.push(
        new Paragraph({
          children: [new TextRun(sentence.current.trim())],
        })
      );
    });
  }
  
  const doc = new Document({
    sections: [{
      properties: {},
      children: docParagraphs,
    }],
  });
  
  return await Packer.toBlob(doc);
}

/**
 * Download exported content
 */
export function downloadFile(content: string | Blob, filename: string, mimeType: string) {
  const blob = typeof content === 'string'
    ? new Blob([content], { type: mimeType })
    : content;
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Main export function
 */
export async function exportDocument(
  sentences: SentenceState[],
  options: ExportOptions,
  paragraphs?: ParagraphInfo[]
): Promise<void> {
  const timestamp = Date.now();
  const baseFilename = options.filename || `paraphrased-${timestamp}`;
  
  switch (options.format) {
    case 'txt': {
      const content = exportAsText(sentences, options.preserveParagraphs ? paragraphs : undefined);
      downloadFile(content, `${baseFilename}.txt`, 'text/plain');
      break;
    }
    
    case 'markdown': {
      const content = exportAsMarkdown(sentences, options.preserveParagraphs ? paragraphs : undefined);
      downloadFile(content, `${baseFilename}.md`, 'text/markdown');
      break;
    }
    
    case 'docx': {
      const blob = await exportAsDocx(sentences, options.preserveParagraphs ? paragraphs : undefined);
      downloadFile(blob, `${baseFilename}.docx`, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      break;
    }
  }
}
