import { useSyncExternalStore } from 'react';
import { readJSON, writeJSON } from './storage';

/** Tiny persisted external store (favorites, compare list, saved configs, preferences). */
export function createStore<T>(key: string, initial: T) {
  let value = readJSON<T>(key, initial);
  const listeners = new Set<() => void>();
  const subscribe = (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn); }; };
  const get = () => value;
  const set = (next: T | ((prev: T) => T)) => {
    value = typeof next === 'function' ? (next as (p: T) => T)(value) : next;
    writeJSON(key, value);
    listeners.forEach((l) => l());
  };
  // Keep tabs in sync.
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      if (e.key !== key) return;
      value = readJSON<T>(key, initial);
      listeners.forEach((l) => l());
    });
  }
  const useValue = () => useSyncExternalStore(subscribe, get, get);
  return { get, set, useValue };
}

export const favorites = createStore<string[]>('ff:favorites', []);
export const compareList = createStore<string[]>('ff:compare', []);
export const savedConfigs = createStore<Record<string, Record<string, number | string | boolean>>>('ff:configs', {});
export type ThemePref = 'light' | 'dark' | 'system';
export const themePref = createStore<ThemePref>('ff:theme', 'system');

export const toggleFavorite = (id: string) => favorites.set((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
export const toggleCompare = (id: string) => compareList.set((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length >= 3 ? [...c.slice(1), id] : [...c, id]));
