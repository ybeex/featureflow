import { useEffect, useMemo, useState } from 'react';
import { Filter, RotateCcw, Search, X } from 'lucide-react';
import { CATEGORIES, CATEGORY_BY_ID, SECTIONS } from '../registry';
import { EMPTY_FILTERS, activeFilterCount, applyFilters, facetCounts, filtersFromParams, filtersToParams, type FilterState, type SortKey } from '../registry/filters';
import { LAYOUTS, STYLES, TECHNIQUES, USE_CASES } from '../registry/types';
import { allTech, techOf } from '../lib/tech';
import { navigate } from '../lib/router';
import { SectionCard } from '../components/SectionCard';
import { useQuickView } from '../app/QuickViewContext';

type ListKey = 'categories' | 'techniques' | 'layouts' | 'styles' | 'complexity' | 'useCases' | 'tech';
const label = (s: string) => s.replace(/-/g, ' ');
const TECH = allTech(SECTIONS);

function Facet({ title, k, options, f, counts, labels, onToggle }: { title: string; k: ListKey; options: string[]; f: FilterState; counts: Record<string, number>; labels?: Record<string, string>; onToggle: (k: ListKey, v: string) => void }) {
  return (
    <fieldset style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
      <legend style={{ padding: 0 }}><h3>{title}</h3></legend>
      <div className="chips">
        {options.map((o) => {
          const on = (f[k] as string[]).includes(o);
          const n = counts[o] ?? 0;
          return (
            <button key={o} type="button" className="chip" aria-pressed={on} disabled={!on && n === 0} style={!on && n === 0 ? { opacity: 0.4, cursor: 'not-allowed' } : undefined} onClick={() => onToggle(k, o)}>
              <span style={{ textTransform: 'capitalize' }}>{labels?.[o] ?? label(o)}</span><span className="count">{n}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function Explore({ params }: { params: URLSearchParams }) {
  const f = useMemo(() => filtersFromParams(params), [params]);
  const [open, setOpen] = useState(false);
  const quick = useQuickView();
  const results = useMemo(() => applyFilters(SECTIONS, f, techOf), [f]);
  const n = activeFilterCount(f);

  const update = (next: FilterState) => { const q = filtersToParams(next).toString(); navigate(`/explore${q ? `?${q}` : ''}`, { replace: true }); };
  const toggle = (k: ListKey, v: string) => { const cur = f[k] as string[]; update({ ...f, [k]: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] } as FilterState); };

  const facet = (k: ListKey, options: string[]) => facetCounts(SECTIONS, f, k, options, techOf);
  const catLabels = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]));
  const only = f.categories.length === 1 ? CATEGORY_BY_ID[f.categories[0]] : null;

  useEffect(() => { document.title = only ? `${only.label} · FeatureFlow` : 'Explore · FeatureFlow'; }, [only]);

  return (
    <div className="container">
      <header className="pagehead">
        <p className="eyebrow">{only ? 'Category' : 'Explore'}</p>
        <h1>{only ? only.label : 'All feature sections'}</h1>
        <p className="muted" style={{ maxWidth: '40rem', marginTop: 10 }}>{only ? only.blurb : 'Search by name or pattern, then narrow with any combination of filters. Counts show how many sections each option would return.'}</p>
      </header>
      <div className="explore">
        <aside className={'filters'} data-open={open} aria-label="Filters">
          <div className="search" role="search">
            <Search size={16} aria-hidden="true" />
            <label className="sr-only" htmlFor="q">Search sections</label>
            <input id="q" type="search" placeholder="Search: sticky, reveal, canvas…" value={f.query} onChange={(e) => update({ ...f, query: e.target.value })} autoComplete="off" />
            {f.query && <button type="button" className="btn btn--sm btn--icon btn--ghost" onClick={() => update({ ...f, query: '' })} aria-label="Clear search"><X size={14} aria-hidden="true" /></button>}
          </div>
          <div className="switch"><span id="so">Scroll-driven only</span><button type="button" role="switch" aria-checked={f.scrollOnly} aria-labelledby="so" onClick={() => update({ ...f, scrollOnly: !f.scrollOnly })} /></div>
          <Facet title="Category" k="categories" options={CATEGORIES.map((c) => c.id)} labels={catLabels} f={f} counts={facet('categories', CATEGORIES.map((c) => c.id))} onToggle={toggle} />
          <Facet title="Animation technique" k="techniques" options={[...TECHNIQUES]} f={f} counts={facet('techniques', [...TECHNIQUES])} onToggle={toggle} />
          <Facet title="Layout pattern" k="layouts" options={[...LAYOUTS]} f={f} counts={facet('layouts', [...LAYOUTS])} onToggle={toggle} />
          <Facet title="Visual style" k="styles" options={[...STYLES]} f={f} counts={facet('styles', [...STYLES])} onToggle={toggle} />
          <Facet title="Complexity" k="complexity" options={['simple', 'moderate', 'advanced']} f={f} counts={facet('complexity', ['simple', 'moderate', 'advanced'])} onToggle={toggle} />
          <Facet title="Use case" k="useCases" options={[...USE_CASES]} f={f} counts={facet('useCases', [...USE_CASES])} onToggle={toggle} />
          <Facet title="Technology" k="tech" options={TECH} labels={Object.fromEntries(TECH.map((t) => [t, t]))} f={f} counts={facet('tech', TECH)} onToggle={toggle} />
        </aside>
        <div>
          <div className="toolbar">
            <button className="btn btn--sm filters-toggle" type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)}><Filter size={14} aria-hidden="true" /> Filters{n > 0 ? ` (${n})` : ''}</button>
            <p className="toolbar__count" role="status" aria-live="polite">{results.length} {results.length === 1 ? 'section' : 'sections'}{results.length !== SECTIONS.length ? ` of ${SECTIONS.length}` : ''}</p>
            {n > 0 && <button className="btn btn--sm" type="button" onClick={() => update({ ...EMPTY_FILTERS, sort: f.sort })}><RotateCcw size={14} aria-hidden="true" /> Reset filters</button>}
            <span style={{ flex: 1 }} />
            <label className="muted" htmlFor="sort" style={{ fontSize: 'var(--text-sm)' }}>Sort</label>
            <select id="sort" className="select" value={f.sort} onChange={(e) => update({ ...f, sort: e.target.value as SortKey })}>
              <option value="featured">Featured first</option><option value="name">Name A–Z</option><option value="complexity-asc">Simplest first</option><option value="complexity-desc">Most advanced first</option><option value="category">Category</option>
            </select>
          </div>
          {results.length ? (
            <div className="grid">{results.map((s) => <SectionCard key={s.id} meta={s} onQuickView={quick} />)}</div>
          ) : (
            <div className="empty" role="status">
              <Search size={28} aria-hidden="true" />
              <h2 style={{ fontSize: 'var(--text-lg)', color: 'var(--ink)' }}>No sections match these filters</h2>
              <p>{f.query ? <>Nothing matches “{f.query}” with the other filters applied.</> : 'That combination of filters has no matches.'}</p>
              <button className="btn btn--primary" type="button" onClick={() => update({ ...EMPTY_FILTERS })}>Clear all filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
