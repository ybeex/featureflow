/**
 * Props every FeatureFlow section accepts.
 *
 * - `config`        Partial overrides merged over the section's defaults.
 * - `scrollRoot`    The element that scrolls. Omit it to use the window (normal page usage).
 * - `reducedMotion` Force reduced-motion rendering (omit to follow the OS preference).
 * - `paused`        Pause looping/ambient motion (aurora, particles, marquees, live metrics).
 */
export interface SectionProps<C> {
  config?: Partial<C>;
  scrollRoot?: HTMLElement | null;
  reducedMotion?: boolean;
  paused?: boolean;
  className?: string;
}
