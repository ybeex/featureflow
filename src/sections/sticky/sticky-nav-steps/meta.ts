import { defineSection } from '../../../registry/define';
import { color, range, select } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'sticky-nav-steps',
  name: 'Sticky Step Navigation',
  description: 'A sticky side navigation tracks the active step, fills a progress line with scroll, and jumps to any step with a smooth, keyboard-friendly scroll.',
  tags: ['sticky', 'navigation', 'steps', 'progress', 'anchor', 'documentation'],
  useCases: ['documentation', 'saas-landing', 'product-site'],
  complexity: 'moderate',
  techniques: ['css-sticky', 'scroll-var', 'intersection-observer'],
  layouts: ['split', 'timeline'],
  styles: ['minimal', 'technical'],
  scrollDriven: true,
  posterProgress: 0.35,
  frameHeight: 720,
  defaults,
  controls: [
    select('navSide', 'Navigation side', 'layout', [['left', 'Left'], ['right', 'Right']]),
    range('stickyOffset', 'Sticky offset', 'layout', 0, 100, 2, 'px', 'Also used to offset where a clicked step lands, so it clears a fixed header.'),
    range('steps', 'Steps', 'layout', 3, 5, 1),
    select('progressStyle', 'Progress style', 'style', [['line', 'Vertical line'], ['bar', 'Horizontal bar'], ['none', 'None']]),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
    select('scrollBehavior', 'Jump behaviour', 'motion', [['smooth', 'Smooth scroll'], ['instant', 'Instant']]),
  ],
  notes: {
    responsive: 'Below ~640px the side nav becomes a compact sticky strip of numbered chips with a thin progress bar; only the current step shows its label, so the strip never wraps.',
    accessibility: 'A real <nav> with an ordered list of links. The current link has aria-current="step", a filled marker and hidden “(current)/(done)” text, so state is never colour-only. Clicking moves focus to the step heading region.',
    motion: 'Jumps are instant when reduced motion is on (or when you choose Instant). The progress fill is a transform driven by scroll and is held at full with reduced motion.',
    browser: 'position: sticky and scrollTo({ behavior }) are supported everywhere. Anchors keep working without JavaScript because each link is a real fragment href.',
    implementation: 'useActiveIndex marks the step crossing a band near the top third of the scroller; useScrollVar writes overall progress to --ff-p for the fill. The click handler computes the target offset against the scrolling container (or window) and scrolls there.',
  },
  component: () => import('./Component'),
});
