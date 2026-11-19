import type { SectionMetaInput } from './types';

/** Identity helper that gives `meta.ts` files full type-checking. */
export function defineSection<C extends object>(meta: SectionMetaInput<C>): SectionMetaInput<C> {
  return meta;
}
