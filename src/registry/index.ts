// Section discovery: every src/sections/<category>/<id>/meta.ts registers itself.
import { CATEGORIES, CATEGORY_BY_ID } from './categories';
import { CATEGORY_IDS, type CategoryId, type ConfigRecord, type SectionMeta, type SectionMetaInput } from './types';

const metaModules = import.meta.glob<SectionMetaInput<ConfigRecord>>('../sections/*/*/meta.ts', { eager: true, import: 'default' });

function build(): SectionMeta[] {
  const list: SectionMeta[] = [];
  for (const [path, meta] of Object.entries(metaModules)) {
    const m = path.match(/sections\/([^/]+)\/([^/]+)\/meta\.ts$/);
    if (!m) continue;
    const [, category, folder] = m;
    if (!(CATEGORY_IDS as readonly string[]).includes(category)) {
      console.error(`[featureflow] Unknown category folder "${category}" for ${path}`);
      continue;
    }
    if (meta.id !== folder) console.error(`[featureflow] Section id "${meta.id}" must equal its folder name "${folder}"`);
    list.push({ ...meta, category: category as CategoryId, folder });
  }
  const order = (c: CategoryId) => CATEGORY_IDS.indexOf(c);
  return list.sort((a, b) => order(a.category) - order(b.category) || Number(!!b.featured) - Number(!!a.featured) || a.name.localeCompare(b.name));
}

export const SECTIONS: SectionMeta[] = build();
const BY_ID = new Map(SECTIONS.map((s) => [s.id, s]));

export const getSection = (id: string): SectionMeta | undefined => BY_ID.get(id);
export const sectionsInCategory = (cat: CategoryId) => SECTIONS.filter((s) => s.category === cat);
export const categoryLabel = (id: CategoryId) => CATEGORY_BY_ID[id]?.label ?? id;
export { CATEGORIES, CATEGORY_BY_ID };
// listing: usbaxf (60) @mvxgd1vt
