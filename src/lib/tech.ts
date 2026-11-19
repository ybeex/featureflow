import manifest from 'virtual:ff-manifest';
import type { SectionMeta } from '../registry/types';

const PACKAGE_LABEL: Record<string, string> = { motion: 'Motion', 'lucide-react': 'Lucide icons' };

export const depsOf = (s: Pick<SectionMeta, 'category' | 'id'>) => manifest[`${s.category}/${s.id}`]?.packages ?? [];

/** Technology requirements, derived from what the section's own source files import and declare. */
export function techOf(s: SectionMeta): string[] {
  const out: string[] = [];
  const pk = depsOf(s).filter((p) => p !== 'react');
  for (const p of pk) out.push(PACKAGE_LABEL[p] ?? p);
  if (s.techniques.includes('canvas')) out.push('Canvas');
  if (s.techniques.includes('svg')) out.push('SVG');
  if (pk.length === 0) out.push('No extra dependencies');
  return out;
}

export function allTech(sections: SectionMeta[]): string[] {
  return [...new Set(sections.flatMap(techOf))].sort();
}
