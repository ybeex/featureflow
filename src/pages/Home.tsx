import { ArrowDown, ArrowRight, Layers } from 'lucide-react';
import { CATEGORIES, SECTIONS, getSection, sectionsInCategory } from '../registry';
import { LiveFrame } from '../components/LiveFrame';
import { SectionCard } from '../components/SectionCard';
import { useQuickView } from '../app/QuickViewContext';
import { useReducedMotion } from '../ff/useReducedMotion';
import { useEffect, useState } from 'react';

export function Home() {
  const quick = useQuickView();
  const reduced = useReducedMotion();
  const heroSection = getSection('stack-sticky-cards');
  const scrollCount = SECTIONS.filter((s) => s.scrollDriven).length;

  // One standout per category, so the featured row shows range instead of repetition.
  const featured = CATEGORIES.map((c) => {
    const list = sectionsInCategory(c.id);
    return list.find((s) => s.featured) ?? list[0];
  }).filter(Boolean);

  const [mountDemo, setMountDemo] = useState(false);
  useEffect(() => { setMountDemo(true); }, []);

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__bg" aria-hidden="true" />
        <div className="container hero__grid">
          <div>
            <p className="eyebrow">Feature section library</p>
            <h1 className="display hero__title" id="hero-title">Feature sections that <em>move</em> with the reader.</h1>
            <p className="hero__lead">A working library of scroll-driven, interactive feature sections. Preview each one live, tune it in a playground, and copy the exact source behind it.</p>
            <div className="hero__actions">
              <a className="btn btn--primary" href="#/explore">Explore Sections <ArrowRight size={16} aria-hidden="true" /></a>
              <a className="btn" href="#/explore?scroll=1">View Scroll Effects</a>
            </div>
            <dl className="hero__stats">
              <div className="hero__stat"><dd style={{ margin: 0 }}><b>{SECTIONS.length}</b></dd><dt><span>live sections</span></dt></div>
              <div className="hero__stat"><dd style={{ margin: 0 }}><b>{scrollCount}</b></dd><dt><span>scroll-driven</span></dt></div>
              <div className="hero__stat"><dd style={{ margin: 0 }}><b>{CATEGORIES.length}</b></dd><dt><span>categories</span></dt></div>
            </dl>
          </div>
          <div className="hero__demo">
            <div className="hero__demo-frame">
              {heroSection && mountDemo && <LiveFrame meta={heroSection} config={{ ...heroSection.defaults, cardCount: 4, stickyTop: 18 }} height="100%" reducedMotion={reduced ? true : undefined} />}
            </div>
            <p className="hero__demo-hint"><span><Layers size={13} aria-hidden="true" style={{ verticalAlign: '-2px' }} /> This is the real “Sticky Card Stack” section. Scroll inside the frame.</span><a href="#/section/stack-sticky-cards">Open it <ArrowDown size={12} aria-hidden="true" style={{ transform: 'rotate(-90deg)', verticalAlign: '-1px' }} /></a></p>
          </div>
        </div>
      </section>

      <section className="block" aria-labelledby="featured-title">
        <div className="container">
          <div className="block__head">
            <div><p className="eyebrow">Featured</p><h2 className="block__title" id="featured-title">One standout from every category</h2><p className="block__lead">Different layouts, different techniques, each running live. Use the eye button for a full interactive preview without leaving the page.</p></div>
            <a className="btn" href="#/explore">All {SECTIONS.length} sections <ArrowRight size={16} aria-hidden="true" /></a>
          </div>
          <div className="grid grid--wide">{featured.map((s) => <SectionCard key={s.id} meta={s} onQuickView={quick} />)}</div>
        </div>
      </section>

      <section className="block" id="categories" aria-labelledby="cat-title" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="block__head"><div><p className="eyebrow">Browse</p><h2 className="block__title" id="cat-title">Category explorer</h2></div></div>
          <div className="cat-grid">
            {CATEGORIES.map((c) => (
              <a key={c.id} className="cat" href={`#/category/${c.id}`} style={{ ['--h' as string]: c.hue }}>
                <span className="cat__count">{sectionsInCategory(c.id).length}</span>
                <span className="cat__name">{c.label}</span>
                <span className="cat__blurb">{c.blurb}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
