import { describe, expect, it } from 'vitest';
import { SECTIONS } from '../src/registry';
import { EMPTY_FILTERS, applyFilters, filtersFromParams, filtersToParams } from '../src/registry/filters';

describe('filters', () => {
  it('returns everything for empty filters', () => {
    expect(applyFilters(SECTIONS, EMPTY_FILTERS).length).toBe(SECTIONS.length);
  });

  it('combines facets with AND across facets and OR within one', () => {
    const cats = ['scroll-stack', 'scroll-reveal'] as const;
    const either = applyFilters(SECTIONS, { ...EMPTY_FILTERS, categories: [...cats] });
    expect(either.every((s) => cats.includes(s.category as (typeof cats)[number]))).toBe(true);
    const narrowed = applyFilters(SECTIONS, { ...EMPTY_FILTERS, categories: [...cats], complexity: ['simple'] });
    expect(narrowed.length).toBeLessThanOrEqual(either.length);
    expect(narrowed.every((s) => s.complexity === 'simple')).toBe(true);
  });

  it('searches names, tags and technique words, requiring every token', () => {
    const hit = applyFilters(SECTIONS, { ...EMPTY_FILTERS, query: 'sticky stack' });
    expect(hit.length).toBeGreaterThan(0);
    const none = applyFilters(SECTIONS, { ...EMPTY_FILTERS, query: 'zzzz-nonexistent' });
    expect(none).toHaveLength(0);
  });

  it('filters scroll-driven sections only', () => {
    const r = applyFilters(SECTIONS, { ...EMPTY_FILTERS, scrollOnly: true });
    expect(r.every((s) => s.scrollDriven)).toBe(true);
  });

  it('sorts by name and complexity', () => {
    const byName = applyFilters(SECTIONS, { ...EMPTY_FILTERS, sort: 'name' }).map((s) => s.name);
    expect(byName).toEqual([...byName].sort((a, b) => a.localeCompare(b)));
    const rank = { simple: 0, moderate: 1, advanced: 2 } as const;
    const desc = applyFilters(SECTIONS, { ...EMPTY_FILTERS, sort: 'complexity-desc' }).map((s) => rank[s.complexity]);
    expect(desc).toEqual([...desc].sort((a, b) => b - a));
  });

  it('round-trips through URL params', () => {
    const f = { ...EMPTY_FILTERS, query: 'hero', categories: ['bento' as const], complexity: ['advanced' as const], scrollOnly: true, sort: 'name' as const };
    expect(filtersFromParams(filtersToParams(f))).toEqual(f);
  });
});
