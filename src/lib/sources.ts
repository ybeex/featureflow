import { createElement } from 'react';
import manifest from 'virtual:ff-manifest';
import type { ConfigRecord, SectionMeta } from '../registry/types';

type Loader = () => Promise<string>;
const cast = (g: Record<string, unknown>) => g as Record<string, Loader>;

const sectionRaw = cast(import.meta.glob(['../sections/*/*/*.{ts,tsx,css}', '!../sections/*/*/meta.ts'], { query: '?raw', import: 'default' }));
const sectionJs = cast(import.meta.glob(['../sections/*/*/*.{ts,tsx}', '!../sections/*/*/meta.ts'], { query: '?js', import: 'default' }));
const ffRaw = cast(import.meta.glob('../ff/*.{ts,tsx,css}', { query: '?raw', import: 'default' }));
const ffJs = cast(import.meta.glob('../ff/*.{ts,tsx}', { query: '?js', import: 'default' }));

export type CodeFormat = 'react-ts' | 'react-js' | 'next' | 'html';
export const FORMATS: { id: CodeFormat; label: string; note: string }[] = [
  { id: 'react-ts', label: 'React + TypeScript', note: 'The exact source files this preview renders, with fully typed config.' },
  { id: 'react-js', label: 'React + JavaScript', note: 'The same files with TypeScript types removed by the compiler (not re-written by hand).' },
  { id: 'next', label: 'Next.js', note: 'App Router: identical logic with "use client" added to every file that uses hooks, plus a server page that renders it.' },
  { id: 'html', label: 'HTML + CSS', note: 'A static snapshot: the component server-rendered with your current settings, plus its CSS. Scroll-linked and interactive behaviour needs the React version; no script is included.' },
];

export interface CodeFile { path: string; code: string; lang: 'tsx' | 'typescript' | 'jsx' | 'javascript' | 'css' | 'markup' | 'bash' | 'json'; role: 'markup' | 'logic' | 'style' | 'config' | 'util' | 'doc' }
export interface CodeBundle { componentName: string; files: CodeFile[]; install: string; usage: string; deps: string[]; entry: string }


function roleOf(file: string): CodeFile['role'] {
  if (file.endsWith('.css')) return 'style';
  if (file === 'config.ts' || file === 'config.js') return 'config';
  if (file.startsWith('Component')) return 'markup';
  if (/^use[A-Z]/.test(file) || file.startsWith('easing')) return 'logic';
  return 'util';
}

const langOf = (file: string, js: boolean): CodeFile['lang'] =>
  file.endsWith('.css') ? 'css' : file.endsWith('.tsx') ? (js ? 'jsx' : 'tsx') : js ? 'javascript' : 'typescript';

const rename = (file: string, js: boolean) => (js ? file.replace(/\.tsx$/, '.jsx').replace(/\.ts$/, '.js') : file);

/** Keep one deterministic transform: sections import shared code from ../../../ff/, the export puts ff/ next to the section folder. */
const rewriteImports = (code: string) => code.replaceAll("'../../../ff/", "'../ff/").replaceAll('"../../../ff/', '"../ff/');
const withUseClient = (code: string) => (/from ['"](react|motion\/react)['"]/.test(code) && !/^['"]use client['"]/.test(code) ? `'use client';\n\n${code}` : code);

export function diffConfig(meta: SectionMeta, config: ConfigRecord): ConfigRecord {
  const out: ConfigRecord = {};
  for (const [k, v] of Object.entries(config)) if (v !== (meta.defaults as ConfigRecord)[k]) out[k] = v;
  return out;
}

const literal = (cfg: ConfigRecord) => {
  const entries = Object.entries(cfg);
  if (!entries.length) return '';
  return `\n      config={{ ${entries.map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(', ')} }}\n    `;
};

export function installCommand(meta: SectionMeta): string {
  const deps = (manifest[`${meta.category}/${meta.id}`]?.packages ?? []).filter((p) => p !== 'react');
  return deps.length ? `npm install ${deps.join(' ')}` : '# No packages beyond React are required';
}

async function loadText(loader: Loader | undefined, label: string): Promise<string> {
  if (!loader) throw new Error(`Missing source for ${label}`);
  return loader();
}

export async function buildBundle(meta: SectionMeta, format: CodeFormat, config: ConfigRecord): Promise<CodeBundle> {
  const key = `${meta.category}/${meta.id}`;
  const m = manifest[key];
  const dir = `../sections/${meta.category}/${meta.id}`;
  const pre = (rel: string) => `featureflow/${rel}`;

  const sectionFiles = m.files.slice().sort((a, b) => (a === 'Component.tsx' ? -1 : b === 'Component.tsx' ? 1 : a === 'config.ts' ? -1 : b === 'config.ts' ? 1 : a.localeCompare(b)));
  const ffFiles = m.ff.slice().sort();
  const deps = m.packages.filter((p) => p !== 'react');

  const read = async (loaders: Record<string, Loader>, path: string) => loadText(loaders[path], path);

  const sourceFor = async (kind: 'section' | 'ff', file: string, js: boolean) => {
    const base = kind === 'section' ? `${dir}/${file}` : `../ff/${file}`;
    const isCss = file.endsWith('.css');
    const loaders = isCss ? (kind === 'section' ? sectionRaw : ffRaw) : js ? (kind === 'section' ? sectionJs : ffJs) : kind === 'section' ? sectionRaw : ffRaw;
    return read(loaders, base);
  };

  const name = (await sourceFor('section', 'Component.tsx', false)).match(/export default function (\w+)/)?.[1] ?? 'Section';
  const used = diffConfig(meta, config);

  if (format === 'html') {
    const [{ renderToStaticMarkup }, mod] = await Promise.all([import('react-dom/server'), meta.component()]);
    const markup = renderToStaticMarkup(createElement(mod.default as never, { config: { ...meta.defaults, ...config }, scrollRoot: null, reducedMotion: false }));
    const cssParts: string[] = [];
    for (const f of ffFiles.filter((f) => f.endsWith('.css'))) cssParts.push(`/* ff/${f} */\n${await sourceFor('ff', f, false)}`);
    for (const f of sectionFiles.filter((f) => f.endsWith('.css'))) cssParts.push(`/* ${meta.id}/${f} */\n${await sourceFor('section', f, false)}`);
    const css = `/* Fonts: the demo uses Inter. Add it, or rely on the system sans stack below. */\n${cssParts.join('\n\n')}`;
    const html = `<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="utf-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1" />\n  <title>${meta.name}</title>\n  <link rel="stylesheet" href="styles.css" />\n  <style>html,body{margin:0}</style>\n</head>\n<body>\n${markup.replace(/></g, '>\n<')}\n</body>\n</html>\n`;
    return {
      componentName: name,
      deps: [],
      entry: pre('index.html'),
      install: '# Static files: open index.html in a browser or copy the markup into your page',
      usage: `<!-- Copy the <section class="ff-root ff-${meta.id}"> element into your page and include styles.css.\n     The markup is the server-rendered state of the component with your current settings.\n     Scroll-linked effects, pinning transitions and interactions come from the React version. -->`,
      files: [
        { path: pre('index.html'), code: html, lang: 'markup', role: 'markup' },
        { path: pre('styles.css'), code: css, lang: 'css', role: 'style' },
      ],
    };
  }

  const js = format === 'react-js';
  const next = format === 'next';
  const files: CodeFile[] = [];
  for (const f of sectionFiles) {
    let code = rewriteImports(await sourceFor('section', f, js));
    if (next && f !== 'config.ts') code = withUseClient(code);
    files.push({ path: pre(`${meta.id}/${rename(f, js)}`), code, lang: langOf(f, js), role: roleOf(f) });
  }
  for (const f of ffFiles) {
    let code = await sourceFor('ff', f, js);
    if (next) code = withUseClient(code);
    files.push({ path: pre(`ff/${rename(f, js)}`), code, lang: langOf(f, js), role: roleOf(f) === 'markup' ? 'util' : roleOf(f) });
  }

  const ext = js ? 'jsx' : 'tsx';
  const cfg = literal(used);
  const usage = next
    ? `// app/page.${ext}  (Server Component: the section itself is a client component)\nimport ${name} from '@/featureflow/${meta.id}/Component';\n\nexport default function Page() {\n  return (\n    <main>\n      <${name}${cfg} />\n    </main>\n  );\n}`
    : `import ${name} from './featureflow/${meta.id}/Component';\n\nexport default function Page() {\n  return (\n    <main>\n      <${name}${cfg} />\n    </main>\n  );\n}`;

  return {
    componentName: name,
    deps,
    entry: pre(`${meta.id}/Component.${ext}`),
    install: installCommand(meta),
    usage,
    files,
  };
}

