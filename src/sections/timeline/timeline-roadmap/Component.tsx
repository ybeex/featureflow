import { useEffect, useId, useState, type CSSProperties } from 'react';
import type { SectionProps } from '../../../ff/types';
import { defaults, type TimelineRoadmapConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

type Status = 'shipped' | 'building' | 'planned';
interface Item { id: string; lane: string; label: string; from: number; to: number; status: Status; detail: string }
const LANES = ['Platform', 'Product', 'Growth'];
const ITEMS: Item[] = [
  { id: 'a', lane: 'Platform', label: 'Regional data residency', from: 0, to: 1, status: 'shipped', detail: 'EU, US and Asia-Pacific regions with per-workspace pinning.' },
  { id: 'b', lane: 'Platform', label: 'Public API v2', from: 1, to: 3, status: 'building', detail: 'Typed endpoints, cursor pagination and signed webhooks.' },
  { id: 'c', lane: 'Platform', label: 'Bring-your-own-key', from: 3, to: 4, status: 'planned', detail: 'Customer-managed encryption keys for regulated teams.' },
  { id: 'd', lane: 'Product', label: 'Automations dry-run', from: 0, to: 1, status: 'shipped', detail: 'Preview what a rule would have done last week before switching it on.' },
  { id: 'e', lane: 'Product', label: 'Dashboards that answer back', from: 1, to: 2, status: 'shipped', detail: 'Ask a question in a sentence and pin the resulting chart.' },
  { id: 'f', lane: 'Product', label: 'Offline mobile app', from: 2, to: 4, status: 'planned', detail: 'Read and comment without a connection; sync when you are back.' },
  { id: 'g', lane: 'Growth', label: 'Template gallery', from: 0, to: 2, status: 'shipped', detail: 'Start from workflows that already run in real companies.' },
  { id: 'h', lane: 'Growth', label: 'Partner marketplace', from: 2, to: 3, status: 'building', detail: 'Third-party integrations, listed and reviewed in one place.' },
];
const LABEL: Record<Status, string> = { shipped: 'Shipped', building: 'In progress', planned: 'Planned' };

export default function TimelineRoadmap({ config, className }: SectionProps<TimelineRoadmapConfig>) {
  const c = { ...defaults, ...config };
  const uid = useId();
  const q = Math.max(2, Math.min(4, Math.round(c.quarters)));
  const [filter, setFilter] = useState<TimelineRoadmapConfig['filter']>(c.filter);
  const [sel, setSel] = useState<string | null>(null);
  useEffect(() => setFilter(c.filter), [c.filter]);
  const visible = ITEMS.filter((i) => i.from < q && (filter === 'all' || i.status === filter));
  const selected = ITEMS.find((i) => i.id === sel && visible.includes(i)) ?? null;
  const style = { '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-q': q, '--ff-row': `${c.rowHeight}px`, '--ff-radius': `${c.radius}px` } as CSSProperties;
  const filters: [TimelineRoadmapConfig['filter'], string][] = [['all', 'All'], ['shipped', 'Shipped'], ['building', 'In progress'], ['planned', 'Planned']];
  return (
    <section className={`ff-root ff-timeline-roadmap ${className ?? ''}`} style={style} aria-labelledby={`${uid}-h`}>
      <header className="ff-timeline-roadmap__head">
        <h2 id={`${uid}-h`}>2026 roadmap</h2>
        <div role="group" aria-label="Filter by status" className="ff-timeline-roadmap__filters">
          {filters.map(([k, l]) => <button key={k} type="button" aria-pressed={filter === k} onClick={() => setFilter(k)}>{l}</button>)}
        </div>
      </header>
      <div className="ff-timeline-roadmap__board" role="list" aria-label="Roadmap items">
        <div className="ff-timeline-roadmap__quarters" aria-hidden="true"><span />{Array.from({ length: q }, (_, i) => <span key={i}>Q{i + 1}</span>)}</div>
        {LANES.map((lane) => {
          const rows = visible.filter((i) => i.lane === lane);
          // Greedy row packing: an item goes on the first row whose last item ends before it starts.
          const ends: number[] = [];
          const rowOf = new Map<string, number>();
          for (const it of rows) {
            let r = ends.findIndex((e) => e <= it.from);
            if (r < 0) { r = ends.length; ends.push(0); }
            ends[r] = Math.min(it.to, q);
            rowOf.set(it.id, r);
          }
          return (
            <div key={lane} className="ff-timeline-roadmap__lane" role="listitem" aria-label={`${lane}, ${rows.length} items`}>
              <h3>{lane}</h3>
              <div className="ff-timeline-roadmap__track">
                {rows.length === 0 && <p className="ff-timeline-roadmap__none">Nothing {filter === 'all' ? '' : LABEL[filter as Status].toLowerCase() + ' '}in this lane.</p>}
                {rows.map((it) => (
                  <button key={it.id} type="button" className="ff-timeline-roadmap__bar" data-status={it.status} data-sel={sel === it.id || undefined} aria-pressed={sel === it.id}
                    style={{ gridColumn: `${it.from + 1} / ${Math.min(it.to, q) + 1}`, gridRow: (rowOf.get(it.id) ?? 0) + 1 } as CSSProperties} onClick={() => setSel(sel === it.id ? null : it.id)}>
                    <span className="ff-timeline-roadmap__dot" aria-hidden="true" />
                    <span className="ff-timeline-roadmap__name">{it.label}</span>
                    <span className="ff-visually-hidden">, {LABEL[it.status]}, quarters {it.from + 1} to {Math.min(it.to, q)}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {c.showDetail && (
        <aside className="ff-timeline-roadmap__detail" aria-live="polite">
          {selected ? <><p data-status={selected.status}>{LABEL[selected.status]} · {selected.lane}</p><h3>{selected.label}</h3><p>{selected.detail}</p></> : <p className="ff-timeline-roadmap__hint">Select an item to see what it includes.</p>}
        </aside>
      )}
      <ul className="ff-timeline-roadmap__legend" aria-label="Legend">{(Object.keys(LABEL) as Status[]).map((s) => <li key={s} data-status={s}>{LABEL[s]}</li>)}</ul>
    </section>
  );
}
