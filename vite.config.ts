import { transformWithOxc, type Plugin } from 'vite';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { readFile } from 'node:fs/promises';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

/**
 * `?js` import suffix: returns the file's source with TypeScript types stripped
 * (JSX preserved) as a string. The "JavaScript" tab in the code viewer is derived
 * from the very same source files the preview runs, so the two cannot drift apart.
 */
function typeStrippedSource(): Plugin {
  const SUFFIX = '?js';
  return {
    name: 'featureflow:type-stripped-source',
    enforce: 'pre',
    async resolveId(id, importer) {
      if (!id.endsWith(SUFFIX)) return null;
      const resolved = await this.resolve(id.slice(0, -SUFFIX.length), importer, { skipSelf: true });
      return resolved ? resolved.id + SUFFIX : null;
    },
    async load(id) {
      if (!id.endsWith(SUFFIX)) return null;
      const file = id.slice(0, -SUFFIX.length);
      this.addWatchFile(file);
      const source = await readFile(file, 'utf8');
      const out = await transformWithOxc(source, file, {
        lang: file.endsWith('.tsx') ? 'tsx' : 'ts',
        jsx: 'preserve',
        typescript: { onlyRemoveTypeImports: false },
      });
      return `export default ${JSON.stringify(out.code)};`;
    },
  };
}


/**
 * `virtual:ff-manifest`: build-time facts about every section, derived from its real source files:
 * which npm packages it imports, which shared `ff/` utilities it needs (transitively) and which files it ships.
 * The gallery's "technology" filter and the code viewer's dependency lists read this, so they cannot drift
 * from what the component actually imports.
 */
function sectionManifest(): Plugin {
  const VIRTUAL = 'virtual:ff-manifest';
  const RESOLVED = '\0' + VIRTUAL;
  const root = process.cwd();
  const sectionsDir = path.join(root, 'src/sections');
  const ffDir = path.join(root, 'src/ff');

  const IMPORT_RE = /(?:import|export)\s+(?:[^'"]*?\s+from\s+)?['"]([^'"]+)['"]/g;
  const pkgOf = (spec: string) => (spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0]);

  function resolveFf(spec: string): string | null {
    const name = spec.split('/ff/').pop() ?? spec.replace(/^\.\//, '');
    for (const ext of ['', '.ts', '.tsx', '.css']) {
      const file = path.join(ffDir, name + ext);
      if (existsSync(file) && statSync(file).isFile()) return path.basename(file);
    }
    return null;
  }

  function scan(source: string, fromFf: boolean, packages: Set<string>, ff: Set<string>) {
    for (const m of source.matchAll(IMPORT_RE)) {
      const spec = m[1];
      if (spec.startsWith('.')) {
        if (spec.includes('/ff/') || (fromFf && spec.startsWith('./'))) {
          const file = resolveFf(spec);
          if (file && !ff.has(file)) {
            ff.add(file);
            scan(readFileSync(path.join(ffDir, file), 'utf8'), true, packages, ff);
          }
        }
      } else {
        packages.add(pkgOf(spec));
      }
    }
  }

  function build() {
    const out: Record<string, { packages: string[]; ff: string[]; files: string[] }> = {};
    if (!existsSync(sectionsDir)) return out;
    for (const cat of readdirSync(sectionsDir)) {
      const catDir = path.join(sectionsDir, cat);
      if (!statSync(catDir).isDirectory()) continue;
      for (const id of readdirSync(catDir)) {
        const dir = path.join(catDir, id);
        if (!statSync(dir).isDirectory()) continue;
        const files = readdirSync(dir).filter((f) => /\.(tsx?|css)$/.test(f) && f !== 'meta.ts');
        const packages = new Set<string>();
        const ff = new Set<string>();
        for (const f of files) {
          if (f.endsWith('.css')) continue;
          scan(readFileSync(path.join(dir, f), 'utf8'), false, packages, ff);
        }
        out[`${cat}/${id}`] = { packages: [...packages].sort(), ff: [...ff].sort(), files: files.sort() };
      }
    }
    return out;
  }

  return {
    name: 'featureflow:manifest',
    resolveId(id) {
      return id === VIRTUAL ? RESOLVED : null;
    },
    load(id) {
      if (id !== RESOLVED) return null;
      return `export default ${JSON.stringify(build())};`;
    },
    configureServer(server) {
      const reload = (file: string) => {
        if (!file.includes(path.join('src', 'sections')) && !file.includes(path.join('src', 'ff'))) return;
        const mod = server.moduleGraph.getModuleById(RESOLVED);
        if (mod) server.moduleGraph.invalidateModule(mod);
      };
      server.watcher.on('add', reload).on('unlink', reload).on('change', reload);
    },
  };
}


/** Stamps the registry module with the current section listing so cached transforms never hide new folders. */
function registryStamp(): Plugin {
  return {
    name: 'featureflow:registry-stamp',
    enforce: 'pre',
    transform(code, id) {
      if (!id.replace(/\\/g, '/').endsWith('/src/registry/index.ts')) return null;
      const dir = path.join(process.cwd(), 'src/sections');
      const listing: string[] = [];
      if (existsSync(dir)) for (const c of readdirSync(dir)) for (const s of readdirSync(path.join(dir, c))) listing.push(`${c}/${s}`);
      const stamp = listing.sort().join(',').split('').reduce((h, ch) => (Math.imul(h, 31) + ch.charCodeAt(0)) >>> 0, 7).toString(36);
      // The hash rides inside the glob call, so any added or removed section changes the expression Vite expands and caches.
      const next = code.replace("import.meta.glob<SectionMetaInput<ConfigRecord>>('../sections/*/*/meta.ts',", `import.meta.glob<SectionMetaInput<ConfigRecord>>(['../sections/*/*/meta.ts', '!../sections/__stamp_${stamp}__/*'],`);
      return { code: next, map: null };
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), typeStrippedSource(), sectionManifest(), registryStamp()],
  build: { target: 'es2022', chunkSizeWarningLimit: 700 },
  test: { environment: 'jsdom', include: ['tests/**/*.test.ts?(x)'] },
});
