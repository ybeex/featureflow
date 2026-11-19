import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import type { SectionProps } from '../ff/types';
import type { ConfigRecord, SectionMeta } from '../registry/types';

type Loaded = LazyExoticComponent<ComponentType<SectionProps<ConfigRecord>>>;
const cache = new Map<string, Loaded>();

/** One lazy component per section id, so re-renders never remount or re-fetch. */
export function lazySection(meta: SectionMeta): Loaded {
  let c = cache.get(meta.id);
  if (!c) {
    c = lazy(meta.component as unknown as () => Promise<{ default: ComponentType<SectionProps<ConfigRecord>> }>);
    cache.set(meta.id, c);
  }
  return c;
}

export const preload = (meta: SectionMeta) => { void meta.component(); };
