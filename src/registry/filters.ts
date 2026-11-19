import { CATEGORY_BY_ID } from './categories';
import type { CategoryId, Complexity, LayoutPattern, SectionMeta, Technique, UseCase, VisualStyle } from './types';

export type SortKey = 'featured' | 'name' | 'complexity-asc' | 'complexity-desc' | 'category';

export interface FilterState {
  query: string;
  categories: CategoryId[];
  techniques: Technique[];
  layouts: LayoutPattern[];
  styles: VisualStyle[];
  complexity: Complexity[];
  useCases: UseCase[];
  /** Technology requirements derived from the section's real imports, e.g. "motion", "canvas". */
  tech: string[];
  scrollOnly: boolean;
  sort: SortKey;
}

export const EMPTY_FILTERS: FilterState = {
  query: '',
  categories: [],
  techniques: [],
  layouts: [],
  styles: [],
  complexity: [],
  useCases: [],
  tech: [],
  scrollOnly: false,
  sort: 'featured',
};

const COMPLEXITY_RANK: Record<Complexity, number> = { simple: 0, moderate: 1, advanced: 2 };

/** Packages and capabilities a section needs, derived from its own declarations (see technologyOf). */
export type TechLookup = (section: SectionMeta) => string[];

export function searchText(s: SectionMeta): string {
  return [
    s.name, s.description, s.tags.join(' '), s.techniques.join(' '), s.layouts.join(' '), s.styles.join(' '), s.useCases.join(' '),
    CATEGORY_BY_ID[s.category]?.label ?? '', s.category,
  ].join(' ').toLowerCase().replace(/-/g, ' ');
}

function scoreQuery(s: SectionMeta, q: string): number {
  const tokens = q.toLowerCase().trim().replace(/-/g, ' ').split(/\s+/).filter(Boolean);
  if (!tokens.length) return 1;
  const haystack = searchText(s);
  const name = s.name.toLowerCase();
  let score = 0;
  for (const t of tokens) {
    if (!haystack.includes(t)) return 0; // every token must match somewhere (AND search)
    score += 1;
    if (name.includes(t)) score += 3;
    if (s.tags.some((tag) => tag.toLowerCase().includes(t))) score += 1.5;
  }
  return score;
}

const anyOf = <T,>(selected: T[], values: T[]) => selected.length === 0 || selected.some((v) => values.includes(v));

export function applyFilters(sections: SectionMeta[], f: FilterState, techOf: TechLookup = () => []): SectionMeta[] {
  const scored: { s: SectionMeta; score: number; i: number }[] = [];
  sections.forEach((s, i) => {
    if (f.categories.length && !f.categories.includes(s.category)) return;
    if (!anyOf(f.techniques, s.techniques)) return;
    if (!anyOf(f.layouts, s.layouts)) return;
    if (!anyOf(f.styles, s.styles)) return;
    if (!anyOf(f.useCases, s.useCases)) return;
    if (f.complexity.length && !f.complexity.includes(s.complexity)) return;
    if (f.scrollOnly && !s.scrollDriven) return;
    if (f.tech.length && !f.tech.every((t) => techOf(s).includes(t))) return; // requirements are cumulative
    const score = scoreQuery(s, f.query);
    if (score === 0) return;
    scored.push({ s, score, i });
  });

  const hasQuery = f.query.trim().length > 0;
  scored.sort((a, b) => {
    if (hasQuery && b.score !== a.score && f.sort === 'featured') return b.score - a.score;
    switch (f.sort) {
      case 'name': return a.s.name.localeCompare(b.s.name);
      case 'complexity-asc': return COMPLEXITY_RANK[a.s.complexity] - COMPLEXITY_RANK[b.s.complexity] || a.i - b.i;
      case 'complexity-desc': return COMPLEXITY_RANK[b.s.complexity] - COMPLEXITY_RANK[a.s.complexity] || a.i - b.i;
      case 'category': return a.s.category.localeCompare(b.s.category) || a.s.name.localeCompare(b.s.name);
      default: return Number(!!b.s.featured) - Number(!!a.s.featured) || a.i - b.i;
    }
  });
  return scored.map((x) => x.s);
}

export function activeFilterCount(f: FilterState): number {
  return (
    f.categories.length + f.techniques.length + f.layouts.length + f.styles.length + f.complexity.length +
    f.useCases.length + f.tech.length + (f.scrollOnly ? 1 : 0) + (f.query.trim() ? 1 : 0)
  );
}

/** How many sections each option would yield if added to the current filters (other facets stay applied). */
export function facetCounts<K extends keyof FilterState>(sections: SectionMeta[], f: FilterState, key: K, options: string[], techOf: TechLookup): Record<string, number> {
  const out: Record<string, number> = {};
  for (const opt of options) {
    const next = { ...f, [key]: Array.isArray(f[key]) ? [opt] : f[key] } as FilterState;
    out[opt] = applyFilters(sections, next, techOf).length;
  }
  return out;
}

// ---- URL <-> state (hash query string) ----
const LIST_KEYS = ['categories', 'techniques', 'layouts', 'styles', 'complexity', 'useCases', 'tech'] as const;
const SHORT: Record<(typeof LIST_KEYS)[number], string> = { categories: 'cat', techniques: 'tq', layouts: 'lay', styles: 'sty', complexity: 'cx', useCases: 'use', tech: 'req' };

export function filtersToParams(f: FilterState): URLSearchParams {
  const p = new URLSearchParams();
  if (f.query.trim()) p.set('q', f.query.trim());
  for (const k of LIST_KEYS) if (f[k].length) p.set(SHORT[k], (f[k] as string[]).join(','));
  if (f.scrollOnly) p.set('scroll', '1');
  if (f.sort !== 'featured') p.set('sort', f.sort);
  return p;
}

export function filtersFromParams(p: URLSearchParams): FilterState {
  const f: FilterState = { ...EMPTY_FILTERS };
  f.query = p.get('q') ?? '';
  for (const k of LIST_KEYS) {
    const raw = p.get(SHORT[k]);
    (f[k] as string[]) = raw ? raw.split(',').filter(Boolean) : [];
  }
  f.scrollOnly = p.get('scroll') === '1';
  const sort = p.get('sort') as SortKey | null;
  if (sort && ['featured', 'name', 'complexity-asc', 'complexity-desc', 'category'].includes(sort)) f.sort = sort;
  return f;
}
