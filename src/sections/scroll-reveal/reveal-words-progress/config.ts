export interface RevealWordsProgressConfig {
  /** Scroll progress (0-1) at which the first word starts to light up. */
  rangeStart: number;
  /** Scroll progress (0-1) by which the last word is fully lit. */
  rangeEnd: number;
  /** Opacity of a word that has not been reached yet. */
  dimLevel: number;
  /** Vertical offset (px) an unread word sits below its resting place. */
  yShift: number;
  fontScale: number;
  /** Scroll length of the pinned section, in multiples of the frame height. */
  screens: number;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: RevealWordsProgressConfig = {
  rangeStart: 0.08,
  rangeEnd: 0.88,
  dimLevel: 0.2,
  yShift: 14,
  fontScale: 1,
  screens: 3.2,
  background: '#0e1116',
  textColor: '#f4f1ea',
  accent: '#ff9566',
};
