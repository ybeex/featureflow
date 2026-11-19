import { defineSection } from '../../../registry/define';
import { easingControl, range, select } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'sticky-theme-panels',
  name: 'Theme-Shifting Panels',
  description: 'A pinned stage with a counter and progress bar whose entire palette transitions to a new theme as each narrative panel takes over.',
  tags: ['sticky', 'theme', 'palette', 'counter', 'progress', 'storytelling'],
  useCases: ['saas-landing', 'agency', 'portfolio'],
  complexity: 'simple',
  techniques: ['css-sticky', 'intersection-observer', 'css-transition'],
  layouts: ['split', 'timeline'],
  styles: ['editorial', 'gradient'],
  scrollDriven: true,
  posterProgress: 0.45,
  frameHeight: 720,
  featured: true,
  defaults,
  controls: [
    select('palette', 'Palette set', 'style', [['editorial', 'Editorial (light and dark)'], ['neon', 'Neon (all dark)'], ['earth', 'Earth tones']], 'Every palette pair is checked for at least 4.5:1 body-text contrast.'),
    range('panels', 'Panels', 'layout', 2, 4, 1),
    range('stickyOffset', 'Sticky offset', 'layout', 0, 100, 2, 'px'),
    range('textScale', 'Text size', 'style', 0.7, 1.4, 0.05, '×'),
    range('duration', 'Transition duration', 'motion', 0, 1600, 50, 'ms'),
    easingControl(),
  ],
  notes: {
    responsive: 'On wide containers the stage pins beside the panels. Below ~640px it collapses to a slim pinned bar (heading, counter and progress) so it never uses more than a few lines of the screen.',
    accessibility: 'The counter is an aria-live="polite" region that announces the current part. The active panel carries aria-current="step", and the large word is decorative (aria-hidden). No palette ever pairs text and background below 4.5:1.',
    motion: 'With reduced motion the palette still changes with the active panel but instantly, with no colour or bar transition. Without JavaScript the first palette and the full panel text are shown.',
    browser: 'CSS custom properties driving background-color/color transitions and position: sticky work in all current browsers.',
    implementation: 'useActiveIndex reports the panel crossing the middle of the scroller. The component writes that panel’s palette into --ff-bg/--ff-fg/--ff-accent on the section root, and plain CSS transitions on background-color and color animate the change.',
  },
  component: () => import('./Component'),
});
