/**
 * Type definitions for sentence editing and history
 */

export interface SentenceState {
  /** Unique identifier for the sentence */
  id: string;
  /** Original text from the source */
  original: string;
  /** Current edited version */
  current: string;
  /** Edit history (chronological) */
  history: string[];
  /** Paragraph index this sentence belongs to */
  paragraphIndex: number;
  /** Position within the paragraph */
  positionInParagraph: number;
  /** Timestamp of last edit */
  lastEditedAt?: Date;
}

export interface ParagraphInfo {
  index: number;
  startSentenceId: string;
  endSentenceId: string;
  originalText: string;
}

export interface ContextMetadata {
  /** Frequently used terms */
  keyTerms: Map<string, number>;
  /** Acronyms found in the text */
  acronyms: Set<string>;
  /** Named entities (people, places, etc.) */
  entities: Set<string>;
}

export interface EditorState {
  sentences: SentenceState[];
  paragraphs: ParagraphInfo[];
  currentIndex: number;
  metadata: ContextMetadata;
  canUndo: boolean;
  canRedo: boolean;
}
