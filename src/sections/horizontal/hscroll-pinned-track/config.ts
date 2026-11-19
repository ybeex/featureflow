export interface HscrollPinnedTrackConfig {
  panelCount: number;
  /** Panel width in cqw (percent of the section width). */
  panelWidth: number;
  /** Gap between panels in cqw. */
  gap: number;
  /** Extra scroll distance while pinned, in multiples of the scroller height. */
  scrollLength: number;
  showProgress: boolean;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: HscrollPinnedTrackConfig = {
  panelCount: 5,
  panelWidth: 60,
  gap: 4,
  scrollLength: 3,
  showProgress: true,
  background: '#f4f1ea',
  textColor: '#17171c',
  accent: '#c2410c',
};
