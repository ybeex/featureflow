import { defineSection } from '../../../registry/define';
import { color, range, select, toggle } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'interactive-accordion-feature',
  name: 'Accordion With Live Preview',
  description: 'A disclosure accordion beside a preview pane: opening an item crossfades the matching illustration, which stays visible even when every item is collapsed.',
  tags: ['interactive', 'accordion', 'preview', 'disclosure', 'split', 'crossfade'],
  useCases: ['saas-landing', 'product-site', 'documentation'],
  complexity: 'moderate',
  techniques: ['css-transition', 'state-machine'],
  layouts: ['split'],
  styles: ['minimal', 'editorial'],
  scrollDriven: false,
  frameHeight: 620,
  defaults,
  controls: [
    select('previewSide', 'Preview side', 'layout', [['right', 'Right'], ['left', 'Left']]),
    range('previewRatio', 'Preview width', 'layout', 30, 70, 1, '%'),
    toggle('collapsible', 'Allow closing the open item', 'layout'),
    toggle('showNumbers', 'Show numbers', 'style'),
    range('radius', 'Preview radius', 'style', 0, 36, 1, 'px'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
  ],
  notes: {
    responsive: 'Below ~640px the preview moves above the list as a 16:10 banner and the accordion takes the full width. The preview width control only applies when both columns fit.',
    accessibility: 'Standard disclosure pattern with buttons inside headings, aria-expanded and aria-controls, labelled region panels and hidden-after-animation collapsed content. The preview is decorative and aria-hidden, because the same information is in the text.',
    motion: 'Panels open with a grid-rows height transition and the preview crossfades with a slight scale settle. Under reduced motion both are instant.',
    browser: 'Animating grid-template-rows works in current Chrome, Safari and Firefox; elsewhere panels snap, which is functionally identical.',
    implementation: 'Open state and shown-preview state are separate: the preview index only changes when an item is chosen, so closing the open item (when allowed) does not blank the preview. By default one item is always open, which avoids an empty accordion.',
  },
  component: () => import('./Component'),
});
