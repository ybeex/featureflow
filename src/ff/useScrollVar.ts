import { useEffect, type RefObject } from 'react';

export interface ScrollVarOptions {
  /** The scrolling element. Omit for the window. */
  scrollRoot?: HTMLElement | null;
  /**
   * "pinned": 0 → 1 while a tall section scrolls past a sticky stage
   *           (0 when its top reaches the viewport top, 1 when its bottom reaches the viewport bottom).
   * "pass":   0 when the element's top enters at the viewport bottom, 1 when its bottom leaves at the top.
   */
  span?: 'pinned' | 'pass';
  /** CSS custom property written on the element. Default "--ff-p". */
  varName?: string;
  /** Optional imperative callback, called at most once per animation frame. */
  onProgress?: (progress: number) => void;
  /** When true no listeners are attached and the variable is set to `staticValue`. */
  disabled?: boolean;
  /** Value written when disabled (reduced motion). Default 1 = "fully revealed / resolved". */
  staticValue?: number;
}

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/**
 * Writes the scroll progress of `ref` into a CSS custom property, without re-rendering React.
 * CSS does the rest: `transform: translateY(calc(var(--ff-p) * -80px))`.
 *
 * Layout is measured once (and again on resize), never inside the scroll handler,
 * so scrolling only reads `scrollTop` and writes one style property per frame.
 */
export function useScrollVar<T extends HTMLElement>(
  ref: RefObject<T | null>,
  {
    scrollRoot = null,
    span = 'pinned',
    varName = '--ff-p',
    onProgress,
    disabled = false,
    staticValue = 1,
  }: ScrollVarOptions = {},
): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (disabled) {
      el.style.setProperty(varName, String(staticValue));
      onProgress?.(staticValue);
      return;
    }

    let top = 0;
    let height = 0;
    let viewport = 1;
    let raf = 0;

    const scrollY = () => (scrollRoot ? scrollRoot.scrollTop : window.scrollY);

    const measure = () => {
      const r = el.getBoundingClientRect();
      if (scrollRoot) {
        const rr = scrollRoot.getBoundingClientRect();
        // Previews can be CSS-scaled; convert on-screen deltas back to layout pixels.
        const k = scrollRoot.clientHeight ? rr.height / scrollRoot.clientHeight : 1;
        top = (r.top - rr.top) / k + scrollRoot.scrollTop;
        height = r.height / k;
        viewport = scrollRoot.clientHeight;
      } else {
        top = r.top + window.scrollY;
        height = r.height;
        viewport = window.innerHeight;
      }
    };

    const compute = () => {
      raf = 0;
      const y = scrollY();
      const p =
        span === 'pinned'
          ? clamp01((y - top) / Math.max(1, height - viewport))
          : clamp01((y + viewport - top) / Math.max(1, height + viewport));
      el.style.setProperty(varName, p.toFixed(4));
      onProgress?.(p);
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };

    const remeasure = () => {
      measure();
      schedule();
    };

    measure();
    compute();

    const target: HTMLElement | Window = scrollRoot ?? window;
    target.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', remeasure);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(remeasure) : null;
    ro?.observe(el);
    if (scrollRoot) ro?.observe(scrollRoot);
    // Web fonts change text height; measure again once they settle.
    document.fonts?.ready.then(remeasure).catch(() => {});

    return () => {
      target.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', remeasure);
      ro?.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, scrollRoot, span, varName, onProgress, disabled, staticValue]);
}
