import { useEffect, useState, type RefObject } from 'react';

export interface InViewOptions {
  /** Scrolling ancestor used as the observation root. null/undefined = the viewport. */
  root?: Element | null;
  /** 0–1: fraction of the element that must be visible. */
  threshold?: number;
  /** Grow or shrink the observation box, e.g. "0px 0px -10% 0px". */
  rootMargin?: string;
  /** Stop observing after the first time the element is visible ("reveal once"). */
  once?: boolean;
  /** Skip observing entirely and report `true` (reduced motion, no-JS parity). */
  disabled?: boolean;
}

/**
 * IntersectionObserver wrapper. Reports `true` while the element is visible.
 * With `once`, it latches to `true` and disconnects. Without it, the value
 * flips back to `false` on exit, which is what enables "replay" behaviour.
 */
export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  { root = null, threshold = 0.2, rootMargin = '0px', once = true, disabled = false }: InViewOptions = {},
): boolean {
  const [inView, setInView] = useState(disabled);

  useEffect(() => {
    if (disabled) {
      setInView(true);
      return;
    }
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) io.disconnect();
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { root, threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, root, threshold, rootMargin, once, disabled]);

  return inView;
}
