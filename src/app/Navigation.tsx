import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, Heart, Menu, Monitor, Moon, Sun, X } from 'lucide-react';
import { CATEGORIES } from '../registry';
import { LAYOUTS } from '../registry/types';
import { favorites, themePref, type ThemePref } from '../lib/store';
import { useRoute } from '../lib/router';

function NavMenu({ label, active, children }: { label: string; active: boolean; children: (close: () => void) => React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); root.current?.querySelector('button')?.focus(); } };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);
  return (
    <div className="menu" ref={root}>
      <button type="button" className="nav__link" aria-expanded={open} aria-controls={id} aria-current={active ? 'page' : undefined} onClick={() => setOpen((o) => !o)}>{label}<ChevronDown size={14} aria-hidden="true" /></button>
      {open && <div className="menu__panel" id={id}>{children(() => setOpen(false))}</div>}
    </div>
  );
}

const THEME_ICON = { light: Sun, dark: Moon, system: Monitor } as const;
const NEXT_THEME: Record<ThemePref, ThemePref> = { light: 'dark', dark: 'system', system: 'light' };

export function Navigation() {
  const route = useRoute();
  const [open, setOpen] = useState(false);
  const favs = favorites.useValue();
  const pref = themePref.useValue();
  const Icon = THEME_ICON[pref];

  useEffect(() => { setOpen(false); }, [route]);

  const current = (name: string) => (route.name === name ? 'page' : undefined);
  const scrollMode = route.name === 'explore' && route.params.get('scroll') === '1';

  return (
    <header className="nav">
      <div className="container nav__row">
        <a className="brand" href="#/" aria-label="FeatureFlow home">
          <span className="brand__mark" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 12l5-8 5 8" stroke="#ff6a3d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
          FeatureFlow
        </a>
        <nav className="nav__links" aria-label="Primary" data-open={open}>
          <a className="nav__link" href="#/explore" aria-current={route.name === 'explore' && !scrollMode && !route.params.get('cat') ? 'page' : undefined}>Explore</a>
          <NavMenu label="Categories" active={route.name === 'explore' && !!route.params.get('cat')}>
            {(close) => CATEGORIES.map((c) => <a key={c.id} href={`#/category/${c.id}`} onClick={close}>{c.label}</a>)}
          </NavMenu>
          <a className="nav__link" href="#/explore?scroll=1" aria-current={scrollMode ? 'page' : undefined}>Scroll Effects</a>
          <NavMenu label="Layouts" active={route.name === 'explore' && !!route.params.get('lay')}>
            {(close) => LAYOUTS.map((l) => <a key={l} href={`#/explore?lay=${l}`} onClick={close} style={{ textTransform: 'capitalize' }}>{l.replace('-', ' ')}</a>)}
          </NavMenu>
          <a className="nav__link" href="#/favorites" aria-current={current('favorites')}>Favorites{favs.length > 0 && <span className="badge" aria-label={`${favs.length} saved`}>{favs.length}</span>}</a>
          <a className="nav__link" href="#/docs" aria-current={current('docs')}>Documentation</a>
        </nav>
        <span className="nav__spacer" />
        <button className="btn btn--icon btn--ghost" type="button" onClick={() => themePref.set(NEXT_THEME[pref])} aria-label={`Theme: ${pref}. Switch to ${NEXT_THEME[pref]}`} title={`Theme: ${pref}`}><Icon size={18} aria-hidden="true" /></button>
        <a className="btn btn--icon btn--ghost" href="#/favorites" aria-label="Favorites"><Heart size={18} aria-hidden="true" /></a>
        <button className="btn btn--icon btn--ghost nav__menu-btn" type="button" aria-expanded={open} aria-label="Menu" onClick={() => setOpen((o) => !o)}>{open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}</button>
      </div>
    </header>
  );
}
