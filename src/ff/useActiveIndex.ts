import { useEffect, useState, type RefObject } from 'react';

export interface ActiveIndexOptions {
  /** Scrolling ancestor used as the observation root (omit for the viewport). */
  root?: Element | null;
  /** Elements to track inside the container. Each may carry data-step="n"; otherwise DOM order is used. */
  itemSelector?: string;
  /** A thin band around this line decides which item is "active". Default: the vertical centre. */
  rootMargin?: string;
  initial?: number;
  disabled?: boolean;
}

/**
 * Tracks which child of `containerRef` currently crosses the middle of the scroller.
 * Event-driven (IntersectionObserver), so there is no scroll listener.
 */
export function useActiveIndex<T extends HTMLElement>(
  containerRef: RefObject<T | null>,
  { root = null, itemSelector = '[data-step]', rootMargin = '-45% 0px -45% 0px', initial = 0, disabled = false }: ActiveIndexOptions = {},
): [number, (i: number) => void] {
  const [active, setActive] = useState(initial);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || disabled || typeof IntersectionObserver === 'undefined') return;
    const items = Array.from(container.querySelectorAll<HTMLElement>(itemSelector));
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          const declared = el.dataset.step;
          setActive(declared !== undefined ? Number(declared) : items.indexOf(el));
        }
      },
      { root, rootMargin, threshold: 0 },
    );
    items.forEach((item) => io.observe(item));
    return () => io.disconnect();
  }, [containerRef, root, itemSelector, rootMargin, disabled]);

  return [active, setActive];
}
