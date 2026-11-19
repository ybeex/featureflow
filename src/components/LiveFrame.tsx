import { Suspense, useCallback, useEffect, useImperativeHandle, useRef, useState, type CSSProperties, type Ref } from 'react';
import { lazySection } from '../lib/lazy';
import type { ConfigRecord, SectionMeta } from '../registry/types';

export interface LiveFrameHandle {
  scrollToProgress: (p: number) => void;
  reset: () => void;
  scroller: () => HTMLDivElement | null;
}

interface Props {
  meta: SectionMeta;
  config: ConfigRecord;
  height: number | string;
  reducedMotion?: boolean;
  paused?: boolean;
  /** Called (rAF-throttled) with 0–1 scroll progress and whether the frame can scroll at all. */
  onProgress?: (progress: number, scrollable: boolean) => void;
  onScrollingChange?: (scrolling: boolean) => void;
  onReady?: () => void;
  handle?: Ref<LiveFrameHandle>;
  className?: string;
  style?: CSSProperties;
}

/**
 * The one place a section is rendered with a real scroll container.
 * It owns the scroller element, publishes its pixel height as --vp-h (what sections size against)
 * and reports scroll progress for the scrubber.
 */
export function LiveFrame({ meta, config, height, reducedMotion, paused, onProgress, onScrollingChange, onReady, handle, className, style }: Props) {
  const [scroller, setScroller] = useState<HTMLDivElement | null>(null);
  const elRef = useRef<HTMLDivElement | null>(null);
  const setRef = useCallback((el: HTMLDivElement | null) => { elRef.current = el; setScroller(el); }, []);
  const Section = lazySection(meta);

  useImperativeHandle(handle, () => ({
    scrollToProgress: (p: number) => {
      const el = elRef.current;
      if (el) el.scrollTop = p * Math.max(0, el.scrollHeight - el.clientHeight);
    },
    reset: () => { if (elRef.current) elRef.current.scrollTop = 0; },
    scroller: () => elRef.current,
  }), []);

  // Publish the real pixel height so `var(--vp-h)` inside sections matches what the user sees.
  useEffect(() => {
    if (!scroller) return;
    const apply = () => scroller.style.setProperty('--vp-h', `${scroller.clientHeight}px`);
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(scroller);
    return () => ro.disconnect();
  }, [scroller]);

  useEffect(() => {
    if (!scroller) return;
    let raf = 0;
    let idle = 0;
    const report = () => {
      raf = 0;
      const range = scroller.scrollHeight - scroller.clientHeight;
      onProgress?.(range > 0 ? scroller.scrollTop / range : 0, range > 1);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(report);
      onScrollingChange?.(true);
      window.clearTimeout(idle);
      idle = window.setTimeout(() => onScrollingChange?.(false), 700);
    };
    scroller.addEventListener('scroll', onScroll, { passive: true });
    const ro = new ResizeObserver(report);
    ro.observe(scroller);
    if (scroller.firstElementChild) ro.observe(scroller.firstElementChild);
    report();
    return () => {
      scroller.removeEventListener('scroll', onScroll);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      window.clearTimeout(idle);
    };
  }, [scroller, onProgress, onScrollingChange]);

  return (
    <div ref={setRef} className={`frame__scroll ${className ?? ''}`} style={{ height, ...style }} tabIndex={0} role="region" aria-label={`${meta.name} live preview. Scroll inside this area.`}>
      {scroller && (
        <Suspense fallback={<div className="thumb__skeleton" style={{ position: 'absolute', inset: 0 }} aria-hidden="true" />}>
          <Section config={config} scrollRoot={scroller} reducedMotion={reducedMotion} paused={paused} />
          {onReady && <Ready onReady={onReady} />}
        </Suspense>
      )}
    </div>
  );
}

function Ready({ onReady }: { onReady: () => void }) {
  useEffect(() => { onReady(); }, [onReady]);
  return null;
}
