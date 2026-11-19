import { useCallback, useEffect, useRef, useState } from 'react';
import { Expand, Minimize2, Monitor, MousePointer2, Pause, Play, RotateCcw, Smartphone, Tablet, Zap, ZapOff, Accessibility } from 'lucide-react';
import { LiveFrame, type LiveFrameHandle } from './LiveFrame';
import type { ConfigRecord, SectionMeta } from '../registry/types';

export type Viewport = 'desktop' | 'tablet' | 'mobile';
export type FrameBg = 'light' | 'dark' | 'checker';
const WIDTHS: Record<Viewport, number | null> = { desktop: null, tablet: 820, mobile: 390 };

export interface StageState { viewport: Viewport; bg: FrameBg; reduced: boolean; animate: boolean; paused: boolean }
export const DEFAULT_STAGE: StageState = { viewport: 'desktop', bg: 'light', reduced: false, animate: true, paused: false };

interface Props {
  meta: SectionMeta;
  config: ConfigRecord;
  state: StageState;
  onState: (s: StageState) => void;
  expanded?: boolean;
  onExpand?: () => void;
  onReset?: () => void;
}

/** Playground stage: viewport switcher, backgrounds, replay, pause, reduced-motion simulation and a scroll scrubber. */
export function PreviewStage({ meta, config, state, onState, expanded, onExpand, onReset }: Props) {
  const handle = useRef<LiveFrameHandle>(null);
  const [progress, setProgress] = useState(0);
  const [scrollable, setScrollable] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const dragging = useRef(false);
  const set = (patch: Partial<StageState>) => onState({ ...state, ...patch });

  const onProgress = useCallback((p: number, s: boolean) => { if (!dragging.current) setProgress(p); setScrollable(s); }, []);
  const frameWidth = WIDTHS[state.viewport];
  const height = expanded ? 'calc(100vh - 230px)' : state.viewport === 'mobile' ? Math.max(560, meta.frameHeight ?? 720) : meta.frameHeight ?? 720;
  // Animation off = render exactly like reduced motion, which every section guarantees is a complete, readable layout.
  const reduced = state.reduced || !state.animate;

  useEffect(() => { handle.current?.reset(); setProgress(0); }, [replayKey]);
  useEffect(() => { handle.current?.reset(); }, [state.viewport]);

  return (
    <div className="stage">
      <div className="stage__bar">
        <div className="seg" role="group" aria-label="Preview viewport">
          {([['desktop', Monitor, 'Desktop'], ['tablet', Tablet, 'Tablet'], ['mobile', Smartphone, 'Mobile']] as const).map(([v, Icon, label]) => (
            <button key={v} type="button" aria-pressed={state.viewport === v} onClick={() => set({ viewport: v })} aria-label={`${label} viewport`}><Icon size={14} aria-hidden="true" /><span className="sr-only-sm">{label}</span></button>
          ))}
        </div>
        <div className="seg" role="group" aria-label="Preview background">
          {(['light', 'dark', 'checker'] as const).map((b) => <button key={b} type="button" aria-pressed={state.bg === b} onClick={() => set({ bg: b })}>{b === 'checker' ? 'Grid' : b[0].toUpperCase() + b.slice(1)}</button>)}
        </div>
        <span style={{ flex: 1 }} />
        <button className="btn btn--sm" type="button" onClick={() => setReplayKey((k) => k + 1)}><RotateCcw size={14} aria-hidden="true" /> Replay</button>
        <button className="btn btn--sm" type="button" aria-pressed={state.paused} onClick={() => set({ paused: !state.paused })} title="Pause ambient and looping motion">{state.paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />} {state.paused ? 'Resume' : 'Pause'}</button>
        <button className="btn btn--sm" type="button" aria-pressed={!state.animate} onClick={() => set({ animate: !state.animate })} title="Disable animation (renders the static layout)">{state.animate ? <Zap size={14} aria-hidden="true" /> : <ZapOff size={14} aria-hidden="true" />} Animation {state.animate ? 'on' : 'off'}</button>
        <button className="btn btn--sm" type="button" aria-pressed={state.reduced} onClick={() => set({ reduced: !state.reduced })} title="Simulate prefers-reduced-motion"><Accessibility size={14} aria-hidden="true" /> Reduced motion</button>
        {onReset && <button className="btn btn--sm" type="button" onClick={onReset}>Reset settings</button>}
        {onExpand && <button className="btn btn--sm btn--icon" type="button" onClick={onExpand} aria-label={expanded ? 'Exit expanded preview' : 'Expand preview'}>{expanded ? <Minimize2 size={14} aria-hidden="true" /> : <Expand size={14} aria-hidden="true" />}</button>}
      </div>
      <div className="stage__canvas">
        <div className="frame" data-bg={state.bg} data-scrolling={scrolling || undefined} style={{ maxWidth: frameWidth ?? undefined, width: '100%' }}>
          <LiveFrame
            key={`${meta.id}-${replayKey}-${state.viewport}`}
            handle={handle}
            meta={meta}
            config={config}
            height={height}
            reducedMotion={reduced}
            paused={state.paused}
            onProgress={onProgress}
            onScrollingChange={setScrolling}
          />
          <div className="frame__boundary" aria-hidden="true" />
          {scrollable && <span className="frame__label" aria-hidden="true"><MousePointer2 size={11} /> Scroll inside this frame</span>}
        </div>
      </div>
      {scrollable ? (
        <div className="scrub">
          <label htmlFor="scrub-range" style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>Scroll progress</label>
          <input
            id="scrub-range" type="range" min={0} max={1} step={0.001} value={progress}
            onPointerDown={() => { dragging.current = true; }}
            onPointerUp={() => { dragging.current = false; }}
            onBlur={() => { dragging.current = false; }}
            onChange={(e) => { const p = Number(e.target.value); setProgress(p); handle.current?.scrollToProgress(p); }}
            aria-valuetext={`${Math.round(progress * 100)} percent`}
          />
          <output htmlFor="scrub-range">{Math.round(progress * 100)}%</output>
        </div>
      ) : (
        <div className="scrub"><span className="muted" style={{ fontSize: 'var(--text-xs)' }}>This section is not scroll-driven. It responds to pointer and keyboard input.</span></div>
      )}
    </div>
  );
}
