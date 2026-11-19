import { useCallback, useEffect, useRef, useState } from 'react';
import { Suspense } from 'react';
import { lazySection } from '../lib/lazy';
import type { SectionMeta } from '../registry/types';

const W = 1200;
const H = 750;

/**
 * Gallery preview: a real, scaled-down render of the component, parked at a meaningful scroll position.
 * It mounts only while near the viewport and is paused (no ambient motion) to keep large galleries light.
 */
export function SectionThumb({ meta }: { meta: SectionMeta }) {
  const host = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [scale, setScale] = useState(0.3);
  const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { setNear(e.isIntersecting); if (!e.isIntersecting) setReady(false); }, { rootMargin: '300px 0px' });
    io.observe(el);
    const ro = new ResizeObserver(() => setScale(el.clientWidth / W));
    ro.observe(el);
    return () => { io.disconnect(); ro.disconnect(); };
  }, []);

  const setScroller = useCallback((el: HTMLDivElement | null) => { scroller.current = el; setScrollEl(el); }, []);

  const onReady = useCallback(() => {
    // Wait for layout (fonts, Motion) to settle, then park the scroll at the poster position.
    window.setTimeout(() => {
      const el = scroller.current;
      if (el) el.scrollTop = (meta.posterProgress ?? 0) * Math.max(0, el.scrollHeight - el.clientHeight);
      setReady(true);
    }, 140);
  }, [meta.posterProgress]);

  const Section = lazySection(meta);
  return (
    <div className="thumb" ref={host} aria-hidden="true">
      {near && (
        <div className="thumb__inner" style={{ width: W, height: H, transform: `scale(${scale})` }}>
          <div ref={setScroller} className="thumb__scroll" style={{ ['--vp-h' as string]: `${H}px` }}>
            {scrollEl && (
              <Suspense fallback={null}>
                <Section config={meta.defaults as never} scrollRoot={scrollEl} paused reducedMotion={false} />
                <Mark onReady={onReady} />
              </Suspense>
            )}
          </div>
        </div>
      )}
      {(!near || !ready) && <div className="thumb__skeleton" />}
    </div>
  );
}

function Mark({ onReady }: { onReady: () => void }) {
  useEffect(() => { onReady(); }, [onReady]);
  return null;
}
