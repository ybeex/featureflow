import { useEffect, useMemo, useRef, useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { Check, Copy, Terminal } from 'lucide-react';
import { FORMATS, buildBundle, type CodeBundle, type CodeFormat } from '../lib/sources';
import type { ConfigRecord, SectionMeta } from '../registry/types';
import { useToast } from './Toast';

const ROLE_LABEL: Record<string, string> = { markup: 'markup', logic: 'logic', style: 'styles', config: 'types & defaults', util: 'shared', doc: 'doc' };

async function copyText(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true; } catch { /* fall back */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0;top:0';
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch { return false; }
}

export function CodeViewer({ meta, config }: { meta: SectionMeta; config: ConfigRecord }) {
  const [format, setFormat] = useState<CodeFormat>('react-ts');
  const [bundle, setBundle] = useState<CodeBundle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const toast = useToast();
  const tablist = useRef<HTMLDivElement>(null);

  // HTML export depends on the current config; the React formats ship the defaults plus a usage line with your changes.
  const cfgKey = JSON.stringify(config);
  useEffect(() => {
    let live = true;
    setError(null);
    const t = window.setTimeout(() => {
      buildBundle(meta, format, config).then((b) => { if (live) { setBundle(b); setActive((i) => Math.min(i, b.files.length - 1)); } })
        .catch((e: unknown) => { if (live) setError(e instanceof Error ? e.message : 'Could not build the export'); });
    }, format === 'html' ? 180 : 0);
    return () => { live = false; window.clearTimeout(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta, format, cfgKey]);

  const file = bundle?.files[active];
  const fmtInfo = FORMATS.find((f) => f.id === format)!;
  const allText = useMemo(() => bundle?.files.map((f) => `// ===== ${f.path} =====\n${f.code}`).join('\n\n') ?? '', [bundle]);

  const doCopy = async (key: string, text: string, label: string) => {
    const ok = await copyText(text);
    setCopied(ok ? key : null);
    toast(ok ? `${label} copied` : 'Copy failed. Select the code and copy manually.');
    if (ok) window.setTimeout(() => setCopied((c) => (c === key ? null : c)), 1600);
  };

  const onTabKey = (e: React.KeyboardEvent) => {
    if (!bundle) return;
    const n = bundle.files.length;
    let next = active;
    if (e.key === 'ArrowRight') next = (active + 1) % n;
    else if (e.key === 'ArrowLeft') next = (active - 1 + n) % n;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    else return;
    e.preventDefault();
    setActive(next);
    tablist.current?.querySelectorAll<HTMLElement>('[role=tab]')[next]?.focus();
  };

  return (
    <section className="code" aria-label="Source code">
      <div className="code__bar">
        <div className="seg" role="group" aria-label="Code format">
          {FORMATS.map((f) => <button key={f.id} type="button" aria-pressed={format === f.id} onClick={() => { setFormat(f.id); setActive(0); }}>{f.label}</button>)}
        </div>
        <span style={{ flex: 1 }} />
        <button className="btn btn--sm" type="button" onClick={() => file && doCopy('file', file.code, 'File')} disabled={!file}>{copied === 'file' ? <Check size={14} /> : <Copy size={14} />} Copy file</button>
        <button className="btn btn--sm" type="button" onClick={() => doCopy('all', allText, 'All files')} disabled={!bundle}>{copied === 'all' ? <Check size={14} /> : <Copy size={14} />} Copy all</button>
      </div>
      <div className="code__bar" style={{ paddingBlock: 4 }}>
        <div className="code__tabs" role="tablist" aria-label="Files" ref={tablist} onKeyDown={onTabKey}>
          {bundle?.files.map((f, i) => (
            <button key={f.path} type="button" role="tab" id={`ct-${i}`} aria-selected={active === i} aria-controls="code-panel" tabIndex={active === i ? 0 : -1} className="code__tab" onClick={() => setActive(i)} title={`${ROLE_LABEL[f.role]}: ${f.path}`}>
              {f.path.replace('featureflow/', '')}
            </button>
          ))}
        </div>
      </div>
      <div id="code-panel" role="tabpanel" aria-labelledby={`ct-${active}`}>
        {error && <p className="code__note" role="alert">{error}</p>}
        {!bundle && !error && <p className="code__note">Preparing source…</p>}
        {file && (
          <Highlight theme={themes.vsDark} code={file.code.replace(/\n$/, '')} language={file.lang}>
            {({ tokens, getLineProps, getTokenProps }) => (
              <pre tabIndex={0} aria-label={`Source of ${file.path}`} style={{ background: 'transparent' }}>
                <code>
                  {tokens.map((line, i) => {
                    const { key: _k, ...lp } = getLineProps({ line });
                    void _k;
                    return (
                      <span key={i} {...lp} className="ln" data-n={i + 1}>
                        {line.map((token, ti) => { const { key: _t, ...tp } = getTokenProps({ token }); void _t; return <span key={ti} {...tp} />; })}
                        {'\n'}
                      </span>
                    );
                  })}
                </code>
              </pre>
            )}
          </Highlight>
        )}
      </div>
      <p className="code__note">{fmtInfo.note}</p>
      {bundle && (
        <div className="code__note" style={{ display: 'grid', gap: 10 }}>
          <div className="install" role="group" aria-label="Install command"><Terminal size={14} aria-hidden="true" /><code>{bundle.install}</code><button className="btn btn--sm btn--icon" type="button" aria-label="Copy install command" onClick={() => doCopy('install', bundle.install, 'Install command')}>{copied === 'install' ? <Check size={14} /> : <Copy size={14} />}</button></div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, color: '#cfcde0' }}>
              <strong>Usage{Object.keys(config).length ? ' with your current settings' : ''}</strong>
              <button className="btn btn--sm" type="button" onClick={() => doCopy('usage', bundle.usage, 'Usage')}>{copied === 'usage' ? <Check size={14} /> : <Copy size={14} />} Copy</button>
            </div>
            <Highlight theme={themes.vsDark} code={bundle.usage} language={format === 'html' ? 'markup' : 'tsx'}>
              {({ tokens, getLineProps, getTokenProps }) => (
                <pre style={{ background: 'transparent', padding: 0, maxHeight: 220, overflow: 'auto', font: '12.5px/1.6 var(--font-mono)', margin: 0 }}>
                  {tokens.map((line, i) => { const { key: _k, ...lp } = getLineProps({ line }); void _k; return <div key={i} {...lp}>{line.map((token, ti) => { const { key: _t, ...tp } = getTokenProps({ token }); void _t; return <span key={ti} {...tp} />; })}</div>; })}
                </pre>
              )}
            </Highlight>
          </div>
        </div>
      )}
    </section>
  );
}
