import { useEffect, type ReactNode } from 'react';
import { Navigation } from './Navigation';
import { QuickViewProvider } from './QuickViewContext';
import { ToastProvider } from '../components/Toast';
import { themePref } from '../lib/store';
import { SECTIONS } from '../registry';

function useTheme() {
  const pref = themePref.useValue();
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => { document.documentElement.dataset.theme = pref === 'system' ? (mq.matches ? 'dark' : 'light') : pref; };
    apply();
    if (pref !== 'system') return;
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [pref]);
}

export function AppShell({ children }: { children: ReactNode }) {
  useTheme();
  return (
    <ToastProvider>
      <QuickViewProvider>
        <a className="skip-link" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>Skip to content</a>
        <Navigation />
        <main id="main" tabIndex={-1} style={{ outline: 'none' }}>{children}</main>
        <footer className="footer">
          <div className="container footer__row">
            <span>FeatureFlow: {SECTIONS.length} live feature sections. Every preview is the source you copy.</span>
            <span>Built with React, TypeScript, Motion and CSS.</span>
          </div>
        </footer>
      </QuickViewProvider>
    </ToastProvider>
  );
}
