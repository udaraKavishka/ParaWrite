/**
 * Use Cases and Solutions
 * Real-world scenarios and how ParaWrite handles them
 */

export interface UseCase {
  id: string;
  category: string;
  title: string;
  problem: string;
  solution: string;
  example?: {
    input: string;
    output: string;
  };
  features: string[];
}

export const useCases: UseCase[] = [
  {
    id: "academic-writing",
    category: "Academic",
    title: "Academic Paper Editing",
    problem: "Academic papers contain complex abbreviations (e.g., et al., i.e., Ph.D.) that often get split incorrectly, disrupting the editing flow.",
    solution: "ParaWrite's academic domain profile recognizes 50+ scholarly abbreviations and preserves them as single units, maintaining proper sentence boundaries.",
    example: {
      input: "Dr. Smith et al. published their findings. The results showed statistical significance (p < 0.05). Further research is needed.",
      output: "✓ 3 sentences correctly identified\n✓ All abbreviations preserved\n✓ Statistical notation intact"
    },
    features: [
      "Academic abbreviation profile",
      "Citation preservation",
      "Statistical notation handling",
      "Latin phrase recognition"
    ]
  },
  {
    id: "legal-documents",
    category: "Legal",
    title: "Legal Document Review",
    problem: "Legal texts use specialized abbreviations (Inc., Corp., Ltd., v., U.S.C.) and complex punctuation that traditional tools misinterpret.",
    solution: "Legal domain mode handles case citations, company suffixes, and section references with precision, ensuring accurate sentence segmentation.",
    example: {
      input: "Smith v. Jones, Inc. was decided in 2023. The court ruled in favor of XYZ Corp. Section 12.5.3 applies.",
      output: "✓ 3 sentences correctly parsed\n✓ Case citation preserved\n✓ Company names intact\n✓ Section numbers maintained"
    },
    features: [
      "Legal abbreviation profile",
      "Case citation handling",
      "Section reference preservation",
      "Company entity recognition"
    ]
  },
  {
    id: "technical-docs",
    category: "Technical",
    title: "Technical Documentation",
    problem: "Technical documentation includes version numbers (v2.5.1), file paths (config.json), and decimals (3.14159) that shouldn't trigger sentence splits.",
    solution: "Technical mode preserves numeric patterns, file extensions, and technical abbreviations while maintaining logical sentence boundaries.",
    example: {
      input: "Install Node.js v18.2.0 or higher. Configure the package.json file. Set timeout to 30.5 seconds.",
      output: "✓ 3 sentences identified\n✓ Version numbers preserved\n✓ File names intact\n✓ Decimal values maintained"
    },
    features: [
      "Technical abbreviation profile",
      "Version number handling",
      "File path preservation",
      "Decimal notation support"
    ]
  },
  {
    id: "medical-records",
    category: "Medical",
    title: "Medical Record Transcription",
    problem: "Medical records contain dosages (e.g., 2.5 mg), vital signs (98.6°F), and medical abbreviations (Dr., MD, BP) requiring careful handling.",
    solution: "Medical domain profile recognizes clinical abbreviations and numeric measurements, ensuring accurate transcription and editing.",
    example: {
      input: "Patient temp: 98.6°F. Dr. Johnson prescribed 2.5 mg aspirin. BP: 120/80 mmHg.",
      output: "✓ 3 sentences parsed\n✓ Measurements preserved\n✓ Dosages intact\n✓ Vital signs maintained"
    },
    features: [
      "Medical abbreviation profile",
      "Dosage preservation",
      "Vital sign handling",
      "Unit recognition"
    ]
  },
  {
    id: "multi-language",
    category: "International",
    title: "Multi-Language Content",
    problem: "Content with acronyms (U.S.A., U.K.), initials (John A. Smith), and mixed punctuation creates splitting ambiguity.",
    solution: "Pattern recognition distinguishes between mid-word periods (acronyms, initials) and sentence-ending periods using context analysis.",
    example: {
      input: "John A. Smith visited the U.S.A. He met with officials in Washington, D.C. The trip lasted 3.5 days.",
      output: "✓ 3 sentences identified\n✓ All initials preserved\n✓ Acronyms intact\n✓ Decimal days maintained"
    },
    features: [
      "Acronym detection",
      "Initial preservation",
      "Geographic abbreviation handling",
      "Context-aware splitting"
    ]
  },
  {
    id: "quotation-handling",
    category: "Publishing",
    title: "Editorial Content with Quotes",
    problem: "Quoted material with internal punctuation ('Is this correct?' she asked.) often creates incorrect sentence boundaries.",
    solution: "Quote-aware splitting recognizes dialogue patterns and preserves quoted sentences as part of the containing sentence.",
    example: {
      input: "She asked, 'Are you ready?' He responded immediately. The conversation ended there.",
      output: "✓ 3 sentences correctly parsed\n✓ Quoted dialogue preserved\n✓ Attribution maintained"
    },
    features: [
      "Quote boundary detection",
      "Dialogue preservation",
      "Attribution handling",
      "Nested punctuation support"
    ]
  },
  {
    id: "ellipsis-handling",
    category: "Creative Writing",
    title: "Creative Writing with Ellipses",
    problem: "Ellipses (...) and trailing punctuation (?!, ...) create ambiguity about sentence endings.",
    solution: "Multi-punctuation detection treats ellipses and combined punctuation as single units, preserving author intent.",
    example: {
      input: "Wait... What happened next?! The story continued...",
      output: "✓ 3 sentences identified\n✓ Ellipses preserved\n✓ Combined punctuation intact\n✓ Dramatic pauses maintained"
    },
    features: [
      "Ellipsis detection",
      "Multi-punctuation support",
      "Dramatic pause preservation",
      "Author style retention"
    ]
  },
  {
    id: "large-documents",
    category: "Enterprise",
    title: "Large Document Processing",
    problem: "Processing documents with 10,000+ sentences freezes the UI and creates poor user experience.",
    solution: "Web Worker background processing handles up to 88,000 sentences/second without blocking the interface.",
    example: {
      input: "30,000-sentence document uploaded",
      output: "✓ Processed in <1 second\n✓ UI remains responsive\n✓ All edge cases handled\n✓ 100% accuracy maintained"
    },
    features: [
      "Web Worker processing",
      "Non-blocking UI",
      "Performance optimization",
      "Progress indicators"
    ]
  },
  {
    id: "crash-recovery",
    category: "Reliability",
    title: "Session Crash Recovery",
    problem: "Browser crashes or accidental closures lose hours of editing work with no recovery option.",
    solution: "Auto-save system backs up work every 30 seconds to localStorage, enabling instant recovery on page reload.",
    example: {
      input: "Browser crashes after 2 hours of editing",
      output: "✓ Work recovered on reload\n✓ All edits preserved\n✓ History intact\n✓ No data loss"
    },
    features: [
      "30-second auto-save",
      "localStorage backup",
      "Crash recovery",
      "History preservation"
    ]
  },
  {
    id: "consistency-checking",
    category: "Quality Assurance",
    title: "Term Consistency Checking",
    problem: "Long documents often have inconsistent terminology (e.g., 'user interface' vs 'UI' vs 'interface') reducing clarity.",
    solution: "Context analysis tracks key terms and acronyms, flagging inconsistencies for review and correction.",
    example: {
      input: "Document uses 'AI', 'A.I.', and 'artificial intelligence' interchangeably",
      output: "⚠️ Inconsistent terms detected\n✓ Suggestions provided\n✓ Usage statistics shown\n✓ Quick fix available"
    },
    features: [
      "Term frequency tracking",
      "Acronym detection",
      "Consistency warnings",
      "Entity recognition"
    ]
  },
  {
    id: "readability-analysis",
    category: "Content Marketing",
    title: "Content Readability Optimization",
    problem: "Marketing content needs specific reading levels, but manual assessment is time-consuming and subjective.",
    solution: "Built-in readability metrics (Flesch Reading Ease, Flesch-Kincaid Grade) provide instant feedback before and after editing.",
    example: {
      input: "Blog post edited for general audience",
      output: "📊 Reading Ease: 65.2 (Standard)\n📊 Grade Level: 8.5\n✓ Target audience match\n✓ Improvement suggestions"
    },
    features: [
      "Flesch Reading Ease",
      "Flesch-Kincaid Grade Level",
      "Before/after comparison",
      "Target audience matching"
    ]
  },
  {
    id: "export-flexibility",
    category: "Workflow Integration",
    title: "Multi-Format Export",
    problem: "Different stakeholders need different formats (Word for editors, Markdown for developers, TXT for APIs).",
    solution: "Export to TXT, DOCX, or Markdown with full paragraph preservation and formatting retention.",
    example: {
      input: "Edited document needs distribution",
      output: "✓ DOCX for MS Word users\n✓ Markdown for GitHub/docs\n✓ TXT for plain text needs\n✓ Paragraph structure preserved"
    },
    features: [
      "TXT export",
      "DOCX generation",
      "Markdown output",
      "Paragraph preservation"
    ]
  }
];

export const categories = [
  "All",
  "Academic",
  "Legal",
  "Technical",
  "Medical",
  "International",
  "Publishing",
  "Creative Writing",
  "Enterprise",
  "Reliability",
  "Quality Assurance",
  "Content Marketing",
  "Workflow Integration"
];
