import { Heart, X } from 'lucide-react';
import { SECTIONS, getSection, CATEGORY_BY_ID } from '../registry';
import { SectionCard } from '../components/SectionCard';
import { LiveFrame } from '../components/LiveFrame';
import { compareList, favorites, savedConfigs, toggleCompare } from '../lib/store';
import { useQuickView } from '../app/QuickViewContext';
import { depsOf } from '../lib/tech';
import { storageAvailable } from '../lib/storage';

export function FavoritesPage() {
  const favs = favorites.useValue();
  const cmp = compareList.useValue();
  const saved = savedConfigs.useValue();
  const quick = useQuickView();
  const list = favs.map((id) => getSection(id)).filter((s): s is NonNullable<typeof s> => !!s);
  const compared = cmp.map((id) => getSection(id)).filter((s): s is NonNullable<typeof s> => !!s);
  const savedIds = Object.keys(saved).filter((id) => getSection(id));

  return (
    <div className="container" style={{ paddingBottom: 80 }}>
      <header className="pagehead"><p className="eyebrow">Your library</p><h1>Favorites &amp; compare</h1>
        <p className="muted" style={{ maxWidth: '40rem', marginTop: 10 }}>Saved sections, compare selections and customised settings live in this browser. {storageAvailable() ? 'No account needed.' : 'Browser storage is unavailable here, so they will last only until you close this tab.'}</p>
      </header>

      <section aria-labelledby="cmp-h" style={{ marginTop: 28 }}>
        <h2 id="cmp-h" className="block__title" style={{ fontSize: '1.6rem', marginBottom: 14 }}>Compare ({compared.length}/3)</h2>
        {compared.length === 0 ? (
          <div className="empty"><p>Use the compare button on any section to line up to three of them side by side, each live and scrollable.</p><a className="btn" href="#/explore">Browse sections</a></div>
        ) : (
          <>
            <div className="cmp">
              {compared.map((s) => (
                <div className="cmp__cell" key={s.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <h3 style={{ fontSize: 'var(--text-md)' }}><a href={`#/section/${s.id}`}>{s.name}</a></h3>
                    <button className="btn btn--sm btn--icon btn--ghost" type="button" onClick={() => toggleCompare(s.id)} aria-label={`Remove ${s.name} from compare`}><X size={14} aria-hidden="true" /></button>
                  </div>
                  <div className="cmp__frame"><LiveFrame meta={s} config={{ ...s.defaults, ...(saved[s.id] ?? {}) }} height="100%" /></div>
                </div>
              ))}
            </div>
            <div className="table-wrap" style={{ marginTop: 18 }}>
              <table className="facts">
                <caption className="sr-only">Comparison of selected sections</caption>
                <thead><tr><th scope="col"><span className="sr-only">Property</span></th>{compared.map((s) => <th key={s.id} scope="col" style={{ color: 'var(--ink)' }}>{s.name}</th>)}</tr></thead>
                <tbody>
                  <tr><th scope="row">Category</th>{compared.map((s) => <td key={s.id}>{CATEGORY_BY_ID[s.category].label}</td>)}</tr>
                  <tr><th scope="row">Complexity</th>{compared.map((s) => <td key={s.id}>{s.complexity}</td>)}</tr>
                  <tr><th scope="row">Scroll-driven</th>{compared.map((s) => <td key={s.id}>{s.scrollDriven ? 'Yes' : 'No'}</td>)}</tr>
                  <tr><th scope="row">Techniques</th>{compared.map((s) => <td key={s.id}>{s.techniques.map((t) => t.replace(/-/g, ' ')).join(', ')}</td>)}</tr>
                  <tr><th scope="row">Packages</th>{compared.map((s) => <td key={s.id}>{depsOf(s).filter((p) => p !== 'react').join(', ') || 'None beyond React'}</td>)}</tr>
                  <tr><th scope="row">Settings</th>{compared.map((s) => <td key={s.id}>{s.controls.length} controls</td>)}</tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      <section aria-labelledby="fav-h" style={{ marginTop: 56 }}>
        <h2 id="fav-h" className="block__title" style={{ fontSize: '1.6rem', marginBottom: 14 }}>Saved sections ({list.length})</h2>
        {list.length === 0 ? (
          <div className="empty"><Heart size={26} aria-hidden="true" /><p>Nothing saved yet. Tap the heart on any section.</p><a className="btn btn--primary" href="#/explore">Explore sections</a></div>
        ) : <div className="grid">{list.map((s) => <SectionCard key={s.id} meta={s} onQuickView={quick} />)}</div>}
      </section>

      {savedIds.length > 0 && (
        <section aria-labelledby="cfg-h" style={{ marginTop: 56 }}>
          <h2 id="cfg-h" className="block__title" style={{ fontSize: '1.6rem', marginBottom: 14 }}>Saved settings</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
            {savedIds.map((id) => (
              <li key={id} className="doccard" style={{ gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
                <span><a href={`#/section/${id}`}><strong>{SECTIONS.find((s) => s.id === id)?.name}</strong></a> <span className="muted">{Object.keys(saved[id]).length} settings</span></span>
                <button className="btn btn--sm" type="button" onClick={() => savedConfigs.set((s) => { const { [id]: _drop, ...rest } = s; void _drop; return rest; })}>Delete</button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
