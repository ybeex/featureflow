import { useSyncExternalStore } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'explore'; params: URLSearchParams }
  | { name: 'section'; id: string }
  | { name: 'favorites' }
  | { name: 'docs'; topic?: string };

function parse(hash: string): Route {
  const raw = hash.replace(/^#/, '') || '/';
  const [pathPart, query = ''] = raw.split('?');
  const parts = pathPart.split('/').filter(Boolean);
  const params = new URLSearchParams(query);
  switch (parts[0]) {
    case 'explore': return { name: 'explore', params };
    case 'category': {
      const p = new URLSearchParams(params);
      if (parts[1]) p.set('cat', parts[1]);
      return { name: 'explore', params: p };
    }
    case 'section': return { name: 'section', id: parts[1] ?? '' };
    case 'favorites': return { name: 'favorites' };
    case 'docs': return { name: 'docs', topic: parts[1] };
    default: return { name: 'home' };
  }
}

let cached = { hash: '', route: parse(typeof location !== 'undefined' ? location.hash : '') };
function snapshot(): Route {
  const h = location.hash;
  if (h !== cached.hash) cached = { hash: h, route: parse(h) };
  return cached.route;
}
const subscribe = (fn: () => void) => { window.addEventListener('hashchange', fn); return () => window.removeEventListener('hashchange', fn); };

export const useRoute = (): Route => useSyncExternalStore(subscribe, snapshot, snapshot);

export function navigate(to: string, opts?: { replace?: boolean }) {
  const target = to.startsWith('#') ? to : `#${to}`;
  if (opts?.replace) history.replaceState(null, '', target);
  else location.hash = target;
  if (opts?.replace) window.dispatchEvent(new HashChangeEvent('hashchange'));
}
