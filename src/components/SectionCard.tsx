import { ArrowUpDown, Columns2, Eye, Heart } from 'lucide-react';
import { SectionThumb } from './SectionThumb';
import { CATEGORY_BY_ID } from '../registry';
import { compareList, favorites, toggleCompare, toggleFavorite } from '../lib/store';
import type { SectionMeta } from '../registry/types';
import { useToast } from './Toast';

export function SectionCard({ meta, onQuickView }: { meta: SectionMeta; onQuickView: (m: SectionMeta) => void }) {
  const favs = favorites.useValue();
  const cmp = compareList.useValue();
  const toast = useToast();
  const fav = favs.includes(meta.id);
  const inCmp = cmp.includes(meta.id);
  const cat = CATEGORY_BY_ID[meta.category];
  return (
    <article className="scard" aria-labelledby={`sc-${meta.id}`}>
      <div className="scard__preview">
        <SectionThumb meta={meta} />
        {meta.scrollDriven && <span className="scard__badge"><ArrowUpDown size={12} aria-hidden="true" /> Scroll interaction</span>}
      </div>
      <div className="scard__body">
        <div className="scard__top">
          <div>
            <p className="eyebrow" style={{ fontSize: '0.66rem' }}>{cat?.label}</p>
            <h3 className="scard__name" id={`sc-${meta.id}`}><a className="scard__link" href={`#/section/${meta.id}`} aria-label={`${meta.name}: open playground`} /> {meta.name}</h3>
          </div>
          <div className="scard__actions">
            <button type="button" className="btn btn--sm btn--icon btn--ghost" onClick={() => onQuickView(meta)} aria-label={`Quick view ${meta.name}`} title="Quick live preview"><Eye size={16} aria-hidden="true" /></button>
            <button type="button" className="btn btn--sm btn--icon btn--ghost" aria-pressed={inCmp} onClick={() => { toggleCompare(meta.id); toast(inCmp ? 'Removed from compare' : 'Added to compare'); }} aria-label={`Compare ${meta.name}`} title="Add to compare (up to 3)"><Columns2 size={16} aria-hidden="true" /></button>
            <button type="button" className="btn btn--sm btn--icon btn--ghost" aria-pressed={fav} onClick={() => { toggleFavorite(meta.id); toast(fav ? 'Removed from favorites' : 'Saved to favorites'); }} aria-label={`Favorite ${meta.name}`} title="Save to favorites"><Heart size={16} aria-hidden="true" fill={fav ? 'var(--accent)' : 'none'} color={fav ? 'var(--accent)' : 'currentColor'} /></button>
          </div>
        </div>
        <p className="scard__desc">{meta.description}</p>
        <div className="scard__meta">
          <span className="chip">{meta.complexity}</span>
          {meta.techniques.slice(0, 2).map((t) => <span className="chip" key={t}>{t.replace(/-/g, ' ')}</span>)}
        </div>
      </div>
    </article>
  );
}
