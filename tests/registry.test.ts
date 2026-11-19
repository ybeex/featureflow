import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import manifest from 'virtual:ff-manifest';
import { SECTIONS } from '../src/registry';
import { CATEGORY_IDS } from '../src/registry/types';

const root = path.resolve(__dirname, '..');
const folderOf = (s: { category: string; id: string }) => path.join(root, 'src/sections', s.category, s.id);
const read = (file: string) => readFileSync(file, 'utf8');
const ALLOWED_PACKAGES = new Set(['react', 'motion', 'lucide-react']);

describe('registry', () => {
  it('discovers sections and every section folder has a meta.ts', () => {
    const dirs: string[] = [];
    for (const cat of readdirSync(path.join(root, 'src/sections'))) {
      for (const id of readdirSync(path.join(root, 'src/sections', cat))) dirs.push(`${cat}/${id}`);
    }
    expect(SECTIONS.length).toBe(dirs.length);
    expect(new Set(SECTIONS.map((s) => s.id)).size).toBe(SECTIONS.length);
  });

  it('covers every category', () => {
    for (const c of CATEGORY_IDS) expect(SECTIONS.some((s) => s.category === c), `category ${c} is empty`).toBe(true);
  });
});

describe.each(SECTIONS.map((s) => [s.id, s] as const))('section %s', (_id, s) => {
  const dir = folderOf(s);

  it('has the required files and metadata', () => {
    for (const f of ['Component.tsx', 'config.ts', 'styles.css', 'meta.ts']) expect(existsSync(path.join(dir, f)), f).toBe(true);
    expect(s.description.length).toBeGreaterThan(30);
    expect(s.tags.length).toBeGreaterThanOrEqual(3);
    expect(s.techniques.length).toBeGreaterThan(0);
    expect(s.layouts.length).toBeGreaterThan(0);
    expect(s.styles.length).toBeGreaterThan(0);
    expect(s.useCases.length).toBeGreaterThan(0);
    for (const k of ['responsive', 'accessibility', 'motion', 'browser', 'implementation'] as const) {
      expect(s.notes[k].length, `notes.${k}`).toBeGreaterThan(40);
    }
  });

  it('only imports allowed packages', () => {
    const m = manifest[`${s.category}/${s.id}`];
    for (const p of m.packages) expect(ALLOWED_PACKAGES.has(p), `unexpected import of "${p}"`).toBe(true);
  });

  it('has controls that match its defaults and are actually used', () => {
    const sources = manifest[`${s.category}/${s.id}`].files
      .filter((f) => /\.tsx?$/.test(f) && f !== 'config.ts')
      .map((f) => read(path.join(dir, f)))
      .join('\n');
    const keys = new Set<string>();
    for (const c of s.controls) {
      expect(keys.has(c.key), `duplicate control ${c.key}`).toBe(false);
      keys.add(c.key);
      expect(c.key in s.defaults, `control "${c.key}" has no default`).toBe(true);
      const d = (s.defaults as Record<string, unknown>)[c.key];
      if (c.type === 'range') {
        expect(typeof d, c.key).toBe('number');
        expect(c.step).toBeGreaterThan(0);
        expect(c.min).toBeLessThan(c.max);
        expect(d as number, `${c.key} default outside range`).toBeGreaterThanOrEqual(c.min);
        expect(d as number, `${c.key} default outside range`).toBeLessThanOrEqual(c.max);
      } else if (c.type === 'color') {
        expect(String(d), c.key).toMatch(/^#[0-9a-fA-F]{6}$/);
      } else if (c.type === 'toggle') {
        expect(typeof d, c.key).toBe('boolean');
      } else {
        expect(c.options.map((o) => o.value), `${c.key} default not in options`).toContain(d);
      }
      expect(new RegExp(`\\b${c.key}\\b`).test(sources), `control "${c.key}" is never read by the component`).toBe(true);
    }
    expect(s.controls.length, 'at least 4 controls').toBeGreaterThanOrEqual(4);
    const groups = new Set(s.controls.map((c) => c.group));
    expect(groups.size, 'controls should span at least two groups').toBeGreaterThanOrEqual(2);
    for (const [k, v] of Object.entries(s.defaults)) expect(['number', 'string', 'boolean'], `default ${k}`).toContain(typeof v);
  });

  it('keeps CSS namespaced, container-based and free of viewport units', () => {
    const css = read(path.join(dir, 'styles.css'));
    const classes = [...css.matchAll(/\.(ff-[\w-]+)/g)].map((m) => m[1]);
    for (const c of classes) {
      const ok = c === 'ff-root' || c === 'ff-visually-hidden' || c === `ff-${s.id}` || c.startsWith(`ff-${s.id}__`) || c.startsWith(`ff-${s.id}--`);
      expect(ok, `class .${c} must start with ff-${s.id}`).toBe(true);
    }
    for (const m of css.matchAll(/@keyframes\s+([\w-]+)/g)) expect(m[1].startsWith(`ff-${s.id}`), `keyframes ${m[1]}`).toBe(true);
    const stripped = css.replace(/var\(--vp-h,\s*100vh\)/g, '');
    expect(/[\d.]\s*(vh|svh|dvh|lvh|vw|svw|dvw)\b/.test(stripped), 'use var(--vp-h, 100vh), cqw/cqh or % instead of viewport units').toBe(false);
    for (const m of css.matchAll(/@media\s*([^{]+)\{/g)) {
      expect(/(min|max)-(width|height)/.test(m[1]), `width/height @media is not allowed (use @container): ${m[1].trim()}`).toBe(false);
    }
    expect(/position:\s*fixed/.test(css), 'position: fixed is not allowed').toBe(false);
  });

  it('uses no `any` and no browser APIs at module scope', () => {
    for (const f of manifest[`${s.category}/${s.id}`].files.filter((f) => /\.tsx?$/.test(f))) {
      const src = read(path.join(dir, f));
      expect(/:\s*any\b|as any\b|<any>/.test(src), `${f} uses any`).toBe(false);
    }
  });

  it('renders on the server (progressive enhancement) with visible content', async () => {
    const mod = await s.component();
    const html = renderToStaticMarkup(createElement(mod.default, { config: s.defaults, scrollRoot: null }));
    expect(html).toContain(`ff-${s.id}`);
    expect(html).toContain('ff-root');
    expect(html.length).toBeGreaterThan(300);
    expect(/style="[^"]*opacity:\s*0[;"]/.test(html), 'server markup must not start hidden').toBe(false);
    expect(/<h[1-6]/.test(html), 'needs at least one heading').toBe(true);
  });
});
