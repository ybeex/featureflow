export interface HscrollTimelineConfig {
  milestones: number;
  spacing: number;
  cardWidth: number;
  lineThickness: number;
  dragEnabled: boolean;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: HscrollTimelineConfig = {
  milestones: 7,
  spacing: 230,
  cardWidth: 200,
  lineThickness: 4,
  dragEnabled: true,
  background: '#0f1419',
  textColor: '#eef2f6',
  accent: '#34d399',
};
