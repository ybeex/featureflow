import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Columns2, Copy, Heart, Save, Undo2 } from 'lucide-react';
import { CATEGORY_BY_ID, SECTIONS, getSection } from '../registry';
import type { ConfigRecord, ConfigValue } from '../registry/types';
import { Controls } from '../components/Controls';
import { PreviewStage, DEFAULT_STAGE, type StageState } from '../components/PreviewStage';
import { CodeViewer } from '../components/CodeViewer';
import { useToast } from '../components/Toast';
import { compareList, favorites, savedConfigs, toggleCompare, toggleFavorite } from '../lib/store';
import { depsOf } from '../lib/tech';
import { diffConfig } from '../lib/sources';

export function SectionPage({ id }: { id: string }) {
  const meta = getSection(id);
  if (!meta) return (
    <div className="container detail"><div className="empty"><h1 style={{ fontSize: 'var(--text-xl)', color: 'var(--ink)' }}>Section not found</h1><p>There is no section called “{id}”.</p><a className="btn btn--primary" href="#/explore">Browse sections</a></div></div>
  );
  return <Playground key={meta.id} id={meta.id} />;
}

function Playground({ id }: { id: string }) {
  const meta = getSection(id)!;
  const saved = savedConfigs.useValue();
  const favs = favorites.useValue();
  const cmp = compareList.useValue();
  const toast = useToast();
  const [config, setConfig] = useState<ConfigRecord>(() => ({ ...(meta.defaults as ConfigRecord), ...(saved[id] ?? {}) }));
  const [stage, setStage] = useState<StageState>(DEFAULT_STAGE);
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => { document.title = `${meta.name} · FeatureFlow`; }, [meta.name]);
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setExpanded(false); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [expanded]);

  const idx = SECTIONS.findIndex((s) => s.id === id);
  const prev = SECTIONS[(idx - 1 + SECTIONS.length) % SECTIONS.length];
  const next = SECTIONS[(idx + 1) % SECTIONS.length];
  const cat = CATEGORY_BY_ID[meta.category];
  const changed = useMemo(() => diffConfig(meta, config), [meta, config]);
  const dirty = Object.keys(changed).length > 0;
  const fav = favs.includes(id);
  const inCmp = cmp.includes(id);
  const hasSaved = !!saved[id];
  const related = SECTIONS.filter((s) => s.category === meta.category && s.id !== id).slice(0, 3);

  const reset = () => { setConfig({ ...(meta.defaults as ConfigRecord) }); toast('Settings restored to defaults'); };
  const copyConfig = async () => {
    const text = JSON.stringify(config, null, 2);
    try { await navigator.clipboard.writeText(text); setCopied(true); toast('Configuration copied'); window.setTimeout(() => setCopied(false), 1500); }
    catch { toast('Copy failed. Open the usage snippet below instead.'); }
  };

  const stageEl = (
    <PreviewStage meta={meta} config={config} state={stage} onState={setStage} expanded={expanded} onExpand={() => setExpanded((e) => !e)} onReset={dirty ? reset : undefined} />
  );

  return (
    <div className="container detail">
      <nav className="crumbs" aria-label="Breadcrumb">
        <a href="#/explore">Explore</a><span aria-hidden="true">/</span><a href={`#/category/${meta.category}`}>{cat.label}</a><span aria-hidden="true">/</span><span aria-current="page">{meta.name}</span>
      </nav>
      <div className="detail__head">
        <div>
          <h1 className="detail__title">{meta.name}</h1>
          <p className="detail__desc">{meta.description}</p>
          <div className="scard__meta" style={{ marginTop: 14 }}>
            <span className="chip">{meta.complexity}</span>
            {meta.techniques.map((t) => <span className="chip" key={t}>{t.replace(/-/g, ' ')}</span>)}
            {meta.styles.map((t) => <span className="chip" key={t}>{t}</span>)}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn" type="button" aria-pressed={fav} onClick={() => { toggleFavorite(id); toast(fav ? 'Removed from favorites' : 'Saved to favorites'); }}><Heart size={16} aria-hidden="true" fill={fav ? 'var(--accent)' : 'none'} color={fav ? 'var(--accent)' : 'currentColor'} /> {fav ? 'Saved' : 'Save'}</button>
          <button className="btn" type="button" aria-pressed={inCmp} onClick={() => { toggleCompare(id); toast(inCmp ? 'Removed from compare' : 'Added to compare'); }}><Columns2 size={16} aria-hidden="true" /> Compare</button>
        </div>
      </div>

      {expanded ? <div className="expanded" role="dialog" aria-label="Expanded preview"><div style={{ maxWidth: 1500, margin: '0 auto' }}>{stageEl}</div></div> : null}
      <div className="play">
        {expanded ? <div className="stage" style={{ minHeight: 120, display: 'grid', placeItems: 'center', color: 'var(--ink-3)' }}>Preview is expanded. Press Esc to return.</div> : stageEl}
        <aside className="panel" aria-label="Customize">
          <div className="panel__sec">
            <div className="panel__h"><span>Customize</span>{dirty && <span className="chip">{Object.keys(changed).length} changed</span>}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <button className="btn btn--sm" type="button" onClick={reset} disabled={!dirty}><Undo2 size={14} aria-hidden="true" /> Reset</button>
              <button className="btn btn--sm" type="button" onClick={copyConfig}>{copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />} Copy config</button>
              <button className="btn btn--sm" type="button" onClick={() => { savedConfigs.set((s) => ({ ...s, [id]: config as Record<string, ConfigValue> })); toast('Settings saved in this browser'); }}><Save size={14} aria-hidden="true" /> Save</button>
              {hasSaved && <button className="btn btn--sm btn--ghost" type="button" onClick={() => { setConfig({ ...(meta.defaults as ConfigRecord), ...saved[id] }); toast('Saved settings loaded'); }}>Load saved</button>}
            </div>
          </div>
          <Controls controls={meta.controls} values={config} onChange={(k, v) => setConfig((c) => ({ ...c, [k]: v }))} />
        </aside>
      </div>

      <div className="below">
        <section aria-labelledby="code-h">
          <h2 id="code-h" className="block__title" style={{ fontSize: '1.7rem', marginBottom: 14 }}>Code</h2>
          <CodeViewer meta={meta} config={changed} />
        </section>

        <section aria-labelledby="guide-h">
          <h2 id="guide-h" className="block__title" style={{ fontSize: '1.7rem', marginBottom: 14 }}>Implementation guide</h2>
          <div className="docgrid">
            <article className="doccard"><h3>How it works</h3><p>{meta.notes.implementation}</p></article>
            <article className="doccard"><h3>Responsive behaviour</h3><p>{meta.notes.responsive}</p></article>
            <article className="doccard"><h3>Accessibility</h3><p>{meta.notes.accessibility}</p></article>
            <article className="doccard"><h3>Motion preferences</h3><p>{meta.notes.motion}</p></article>
            <article className="doccard"><h3>Browser support</h3><p>{meta.notes.browser}</p></article>
            <article className="doccard"><h3>Dependencies</h3>
              <ul><li><span className="kbd">react</span> 18 or newer</li>{depsOf(meta).filter((p) => p !== 'react').map((p) => <li key={p}><span className="kbd">{p}</span></li>)}</ul>
              <p>Section-specific settings: {meta.controls.map((c) => c.key).join(', ')}.</p>
            </article>
          </div>
          <div className="table-wrap" style={{ marginTop: 20 }}>
            <table className="facts">
              <caption className="sr-only">Technical facts</caption>
              <tbody>
                <tr><th scope="row">Techniques</th><td>{meta.techniques.map((t) => t.replace(/-/g, ' ')).join(', ')}</td></tr>
                <tr><th scope="row">Layouts</th><td>{meta.layouts.join(', ')}</td></tr>
                <tr><th scope="row">Best for</th><td>{meta.useCases.map((u) => u.replace(/-/g, ' ')).join(', ')}</td></tr>
                <tr><th scope="row">Scroll-driven</th><td>{meta.scrollDriven ? 'Yes. Reacts to the scroll position of its container.' : 'No. Driven by pointer, keyboard and state.'}</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <nav aria-label="More sections" style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <a className="btn" href={`#/section/${prev.id}`}><ArrowLeft size={16} aria-hidden="true" /> {prev.name}</a>
          {related.length > 0 && <span className="muted" style={{ alignSelf: 'center', fontSize: 'var(--text-sm)' }}>Also in {cat.label}: {related.map((r, i) => <span key={r.id}>{i > 0 && ', '}<a href={`#/section/${r.id}`}>{r.name}</a></span>)}</span>}
          <a className="btn" href={`#/section/${next.id}`}>{next.name} <ArrowRight size={16} aria-hidden="true" /></a>
        </nav>
      </div>
    </div>
  );
}
