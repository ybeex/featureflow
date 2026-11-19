export interface TimelineRoadmapConfig {
  filter: 'all' | 'shipped' | 'building' | 'planned';
  showDetail: boolean;
  quarters: number;
  rowHeight: number;
  radius: number;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: TimelineRoadmapConfig = {
  filter: 'all',
  showDetail: true,
  quarters: 4,
  rowHeight: 44,
  radius: 10,
  background: '#f4f6f8',
  textColor: '#13171d',
  accent: '#2563eb',
};
