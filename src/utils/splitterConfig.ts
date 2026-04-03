/**
 * Configuration and profiles for sentence splitting
 */

export type SplitMode = 'strict' | 'balanced' | 'loose';

export interface SplitterConfig {
  mode: SplitMode;
  domain?: string;
  useNativeSplitter?: boolean;
}

// Base abbreviations (always included)
const BASE_ABBREVIATIONS = [
  'mr.', 'mrs.', 'ms.', 'dr.', 'prof.', 'sr.', 'jr.', 'st.', 'mt.',
  'capt.', 'cpt.', 'col.', 'gen.', 'lt.', 'maj.', 'sgt.',
  'fig.', 'eq.', 'dept.', 'univ.', 'no.', 'pp.', 'viz.', 'vs.',
  // Note: "etc." removed - it commonly ends sentences
  'e.g.', 'i.e.', 'rev.', 'inc.', 'ltd.', 'co.', 'corp.', 'est.', 'al.', 'ca.', 'approx.',
  'jan.', 'feb.', 'mar.', 'apr.', 'jun.', 'jul.', 'aug.', 'sep.', 'sept.', 'oct.', 'nov.', 'dec.',
];

// Domain-specific abbreviation profiles
const DOMAIN_ABBREVIATIONS: Record<string, string[]> = {
  academic: [
    'phd.', 'ph.d.', 'b.a.', 'b.s.', 'm.a.', 'm.s.', 'ed.d.', 'j.d.', 'm.d.',
    'cf.', 'et al.', 'ibid.', 'op. cit.', 'ed.', 'eds.', 'vol.', 'ch.', 'p.', 'pp.',
    'proc.', 'conf.', 'symp.', 'trans.', 'repr.', 'suppl.',
  ],
  legal: [
    'esq.', 'j.d.', 'llb.', 'llm.', 'atty.', 'aff.', 'dep.', 'pl.', 'def.', 'ct.',
    'art.', 'sec.', 'para.', 'subd.', 'app.', 'dist.', 'div.', 'cir.',
  ],
  technical: [
    'eng.', 'tech.', 'mfg.', 'std.', 'spec.', 'ver.', 'rev.', 'vol.',
    'max.', 'min.', 'avg.', 'approx.', 'temp.', 'freq.', 'cap.',
  ],
  medical: [
    'm.d.', 'd.o.', 'r.n.', 'l.p.n.', 'pharm.d.', 'pt.', 'pts.', 'pt.', 
    'admin.', 'prn.', 'stat.', 'a.m.', 'p.m.', 'q.d.', 'b.i.d.',
  ],
};

/**
 * Get abbreviation list for a given configuration
 */
export function getAbbreviations(config: SplitterConfig): Set<string> {
  const abbreviations = [...BASE_ABBREVIATIONS];
  
  if (config.domain && DOMAIN_ABBREVIATIONS[config.domain]) {
    abbreviations.push(...DOMAIN_ABBREVIATIONS[config.domain]);
  }
  
  return new Set(abbreviations);
}

/**
 * Check if native Intl.Segmenter is available
 */
export function isNativeSplitterAvailable(): boolean {
  return typeof Intl !== 'undefined' && 'Segmenter' in Intl;
}

/**
 * Split using native Intl.Segmenter (when available)
 */
export function splitWithNativeSegmenter(text: string): string[] {
  if (!isNativeSplitterAvailable()) {
    return [];
  }
  
  try {
    // @ts-expect-error - Intl.Segmenter may not be in all TypeScript versions
    const segmenter = new Intl.Segmenter('en', { granularity: 'sentence' });
    const segments = segmenter.segment(text);
    
    return Array.from(segments)
      .map((segment: { segment: string }) => segment.segment.trim())
      .filter(s => s.length > 0);
  } catch (error) {
    console.warn('Native segmenter failed:', error);
    return [];
  }
}

/**
 * Mode-specific behavior configurations
 */
export const MODE_CONFIGS = {
  strict: {
    requireCapital: true,
    allowSingleInitial: false,
    minSentenceLength: 10,
  },
  balanced: {
    requireCapital: false,
    allowSingleInitial: true,
    minSentenceLength: 3,
  },
  loose: {
    requireCapital: false,
    allowSingleInitial: true,
    minSentenceLength: 1,
  },
} as const;
