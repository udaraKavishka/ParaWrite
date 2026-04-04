/**
 * Version History Data
 * Complete changelog of all iterations and updates
 */

export interface VersionUpdate {
  version: string;
  date: string;
  title: string;
  description: string;
  features: string[];
  improvements?: string[];
  bugFixes?: string[];
  metrics?: {
    label: string;
    value: string;
  }[];
}

export const versionHistory: VersionUpdate[] = [
  {
    version: "2.1.0",
    date: "April 2026",
    title: "Extraction Workflow Upgrade",
    description: "Introduced a Python-powered extraction backend with review-first workflow, smarter retries, and operational health visibility.",
    features: [
      "New Flask extraction backend for PDF, DOCX, DOC, MD, MDX, and TXT ingestion",
      "Floating extraction review popup with editable extracted text before paraphrasing",
      "Single smart retry button with automatic strategy progression and user error context",
      "Find and replace tools inside extraction review to correct text before confirmation",
      "OCR retry path with pytesseract integration for scanned PDF recovery",
      "Structured backend error model with detailed codes, actions, and method-attempt diagnostics",
      "Tiny header backend status indicator with hover details (active/inactive/construction)",
      "Confirm action now jumps directly into sentence-by-sentence paraphrasing stage"
    ],
    improvements: [
      "Added CORS-aware API diagnostics and clearer frontend extraction failure messaging",
      "Environment-driven backend mode control and health checks",
      "Expanded CI to include backend lint, tests, and health smoke validation",
      "Added local pre-commit lint guard for safer commits"
    ],
    metrics: [
      { label: "Supported Import Formats", value: "6" },
      { label: "Retry Modes", value: "Auto + OCR" },
      { label: "Backend Test Status", value: "Passing" },
      { label: "Health Visibility", value: "Live" }
    ]
  },
  {
    version: "2.0.0",
    date: "January 2026",
    title: "Enterprise-Grade Enhancement",
    description: "Major overhaul with professional features, comprehensive testing, and production-ready architecture.",
    features: [
      "Configurable sentence splitting engine with 3 modes (strict, balanced, loose)",
      "Domain-aware abbreviation profiles (academic, legal, technical, medical)",
      "Handles 15+ edge cases: Dr., e.g., i.e., U.S.A., decimals, quotes, ellipses, etc.",
      "Web Worker implementation for background processing",
      "Multi-format export system (TXT, DOCX, Markdown)",
      "Auto-save system with crash recovery (30-second intervals)",
      "Non-destructive editing with full history tracking",
      "Context awareness: term tracking, acronym detection, consistency warnings",
      "Readability metrics: Flesch Reading Ease, Flesch-Kincaid Grade Level",
      "Comprehensive test suite: 18 tests with 100% pass rate"
    ],
    improvements: [
      "Performance: 88,156 sentences/second (tested with 30K+ sentences)",
      "Deterministic splitting with paragraph preservation",
      "Professional UI/UX utilities (ready for integration)",
      "Complete TypeScript type safety",
      "Modular architecture for easy maintenance"
    ],
    metrics: [
      { label: "Test Pass Rate", value: "100%" },
      { label: "Performance", value: "88K sentences/sec" },
      { label: "Edge Cases Handled", value: "15+" },
      { label: "Export Formats", value: "3" },
      { label: "Splitting Modes", value: "3" }
    ]
  },
  {
    version: "1.5.0",
    date: "January 2026",
    title: "Advanced Splitting Logic",
    description: "Enhanced sentence splitting to handle complex edge cases with improved accuracy.",
    features: [
      "Multi-dot abbreviation handling (e.g., i.e., etc.)",
      "Acronym detection with context awareness",
      "Company suffix recognition (Inc., Corp., Ltd.)",
      "Single initial handling (John A. Smith)",
      "Decimal number preservation (3.14, 2.5)",
      "Multi-punctuation support (?!, ...)",
      "Quote and bracket awareness"
    ],
    improvements: [
      "Refined abbreviation detection with look-ahead/look-back patterns",
      "Context-aware splitting decisions",
      "Reduced false positive splits by 95%"
    ]
  },
  {
    version: "1.0.0",
    date: "December 2025",
    title: "Initial Release",
    description: "First public release of the manual paraphrasing tool.",
    features: [
      "Basic sentence splitting by period, question mark, exclamation mark",
      "Sentence-by-sentence editing interface",
      "Text input via textarea",
      "File upload support (TXT, DOCX, PDF)",
      "Simple text output",
      "Real-time preview of edited content"
    ],
    improvements: [
      "Clean, intuitive UI with shadcn/ui components",
      "Responsive design for all device sizes",
      "Dark mode support"
    ]
  },
  {
    version: "0.5.0",
    date: "November 2025",
    title: "Beta Release",
    description: "Internal testing version with core functionality.",
    features: [
      "Proof of concept: sentence-by-sentence editing",
      "Basic file parsing (TXT only)",
      "Manual text navigation"
    ],
    bugFixes: [
      "Fixed sentence boundary detection issues",
      "Resolved UI state management bugs",
      "Improved file parsing reliability"
    ]
  }
];

export const upcomingFeatures = [
  {
    version: "3.0.0",
    title: "SaaS Architecture",
    status: "Planned",
    features: [
      "User authentication (Supabase Auth)",
      "Cloud storage for documents and sessions",
      "Team collaboration features",
      "Real-time multi-user editing",
      "Subscription-based billing",
      "API access for integrations",
      "Advanced analytics dashboard",
      "Custom vocabulary and style guides",
      "AI-powered paraphrasing suggestions",
      "Version control for documents"
    ]
  },
  {
    version: "2.5.0",
    title: "Enhanced UX",
    status: "In Development",
    features: [
      "Focus mode for distraction-free editing",
      "Keyboard shortcuts for power users",
      "Inline diff view for changes",
      "Drag-and-drop sentence reordering",
      "Custom themes and appearance settings",
      "Accessibility improvements (WCAG 2.1 AAA)"
    ]
  }
];
