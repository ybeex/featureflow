export interface InteractiveAccordionFeatureConfig {
  previewSide: 'right' | 'left';
  collapsible: boolean;
  showNumbers: boolean;
  previewRatio: number;
  radius: number;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: InteractiveAccordionFeatureConfig = {
  previewSide: 'right',
  collapsible: false,
  showNumbers: true,
  previewRatio: 55,
  radius: 18,
  background: '#fbfaf8',
  textColor: '#1b1814',
  accent: '#c2410c',
};
