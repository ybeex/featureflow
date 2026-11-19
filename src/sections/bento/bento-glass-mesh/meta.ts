import { defineSection } from '../../../registry/define';
import { color, range, toggle } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'bento-glass-mesh',
  name: 'Glass Mesh Bento',
  description: 'Frosted-glass bento tiles floating over a slowly drifting gradient mesh, each with a pointer-following highlight that tracks the cursor.',
  tags: ['bento', 'glass', 'mesh', 'gradient', 'spotlight', 'backdrop-filter'],
  useCases: ['saas-landing', 'product-site', 'agency'],
  complexity: 'moderate',
  techniques: ['pointer-tracking', 'css-animation'],
  layouts: ['grid', 'layered'],
  styles: ['glass', 'gradient', 'dark'],
  scrollDriven: false,
  frameHeight: 600,
  defaults,
  controls: [
    range('gap', 'Gap', 'layout', 4, 32, 2, 'px'),
    range('radius', 'Corner radius', 'style', 0, 40, 1, 'px'),
    range('blur', 'Glass blur', 'style', 0, 40, 1, 'px'),
    range('glassOpacity', 'Glass fill', 'style', 0.02, 0.4, 0.01),
    range('meshIntensity', 'Mesh intensity', 'style', 0.2, 1, 0.05),
    color('colorA', 'Mesh colour 1'),
    color('colorB', 'Mesh colour 2'),
    color('colorC', 'Mesh colour 3'),
    color('textColor', 'Text'),
    toggle('spotlight', 'Pointer highlight', 'motion'),
    toggle('drift', 'Drifting mesh', 'motion'),
  ],
  notes: {
    responsive: 'Six columns become two below ~720px, with the larger tiles spanning the full width. The pointer highlight is not used for touch pointers.',
    accessibility: 'Text is white on a dark base with glass fills kept low-opacity, so contrast does not depend on the mesh colour behind a tile (verify when changing colours). Tiles are plain list items with headings; the mesh and highlight are decorative.',
    motion: 'The mesh drifts with a slow CSS animation that stops under reduced motion or when the preview is paused. The pointer highlight only appears on hover-capable devices and its fade is removed under reduced motion.',
    browser: 'backdrop-filter is supported in current Chrome, Safari and Firefox; an @supports fallback gives tiles a solid translucent fill where it is not.',
    implementation: 'The pointer handler writes --mx/--my directly on the hovered tile (no React state), and a radial-gradient pseudo-element reads them. Blur, fill and mesh opacity are CSS variables, so the controls change the preview without re-rendering the tiles.',
  },
  component: () => import('./Component'),
});
