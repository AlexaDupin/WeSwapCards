import React, { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link, useNavigate } from 'react-router-dom';

import ChapterCarouselSection, { PLACEHOLDER } from './ChapterCarouselSection';
import ScrollToTop from '../ScrollToTopButton/ScrollToTop';
import CustomButton from '../CustomButton/CustomButton';
import useChapters from './useChapters';

import './homeStyles.scss';

const LATEST_PARAMS = { limit: 10 };

const STEPS = [
  {
    title: 'Log all the cards you have',
    text: 'Mark owned, missing, and duplicate cards across every chapter in a couple of taps.',
  },
  {
    title: 'Find the card you need',
    text: 'Search any card and see instantly who has a spare copy sitting in their collection.',
  },
  {
    title: 'Browse users who have it',
    text: 'Collectors who also need one of your duplicates come first.',
  },
  {
    title: 'Chat with them and find a deal',
    text: 'Negotiate directly in the app until both sides are happy with the swap.',
    tone: 'teal',
  },
  {
    title: 'Keep track in a dashboard',
    text: 'Every request, pending trade, and completed swap in one place.',
    tone: 'teal',
  },
];

function Home() {
    const navigate = useNavigate();
    const { isSignedIn } = useUser();

    // One request for /chapters/latest, shared by the hero and the carousel.
    const latest = useChapters('/chapters/latest', LATEST_PARAMS);
    const heroCards = latest.items.slice(0, 2);

    useEffect(() => {
      if (!isSignedIn) {
        localStorage.clear();
      } else {
        navigate('/menu');
      }
    }, [isSignedIn, navigate]);

    useEffect(() => {
      const ENTER = 0.25;
      const EXIT  = 0.10;
      const state = new WeakMap();

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            const isOn = state.get(e.target) || false;
            if (!isOn && e.intersectionRatio >= ENTER) {
              e.target.classList.add("is-visible");
              state.set(e.target, true);
            } else if (isOn && e.intersectionRatio <= EXIT) {
              e.target.classList.remove("is-visible");
              state.set(e.target, false);
            }
          });
        },
        { threshold: [0, EXIT, ENTER, 1], rootMargin: "-10% 0% -10% 0%" }
      );

      const applyDelays = () => {
        document.querySelectorAll("[data-reveal-container]").forEach((group) => {
          const children = Array.from(group.querySelectorAll(".reveal"));
          children.forEach((el, i) => {
            el.style.setProperty("--delay", `${i * 90}ms`);
          });
        });
      };

      const observeAll = () => {
        document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
      };

      // initial pass
      applyDelays();
      observeAll();

      // observe future additions/changes
      const mo = new MutationObserver(() => {
        applyDelays();
        observeAll();
      });
      mo.observe(document.body, { childList: true, subtree: true });

      // Fallback: if IO not supported, just show all
      if (!("IntersectionObserver" in window)) {
        document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
      }

      return () => {
        io.disconnect();
        mo.disconnect();
      };
    }, []);

  return (
  <main className="home">

    <section className="home-hero" data-reveal-container>
      <div className="home-hero__inner">

        <div className="home-hero__copy reveal">
          <p className="home-pill">
            <span className="home-pill__dot" />
            1,000+ collectors joined already &middot; 16,000+ swaps so far
          </p>

          <h1 className="home-hero__title">
            Your duplicates are someone else&rsquo;s{' '}
            <span className="home-hero__title-accent">missing card.</span>
          </h1>

          <p className="home-hero__lede">
            Track the WeCards you own, spot the ones you&rsquo;re missing, and get matched
            with collectors whose spares fill your gaps. Then work out the trade together.
          </p>

          <div className="home-hero__actions">
            <CustomButton text="Create an account" to="/register" size="lg" />
            <a href="#how" className="home-link-quiet">See how it works &rarr;</a>
          </div>

          <p className="home-hero__fineprint">
            Free to join. Not affiliated with the official WeWard app.
          </p>
        </div>

        <div className="home-hero__art reveal" aria-hidden="true">
          <div className="home-hero__glow" />
          <div className="home-hero__stack">
            {[0, 1].map((i) => (
              <div key={i} className={`home-hero__card home-hero__card--${i + 1}`}>
                <div className="home-hero__card-art">
                  {heroCards[i] && (
                    <img src={heroCards[i].image_url || PLACEHOLDER} alt="" />
                  )}
                </div>
                <div className="home-hero__card-label">
                  {heroCards[i]?.name || ' '}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>

    <section id="how" className="home-how" data-reveal-container>
      <div className="home-how__inner">
        <div className="home-section-head reveal">
          <p className="home-eyebrow">How it works</p>
          <h2 className="home-section-title">
            From a pile of duplicates to a completed collection.
          </h2>
        </div>

        <div className="home-how__grid">
          {STEPS.map((step, i) => (
            <article key={step.title} className="home-step reveal">
              <div className={`home-step__badge${step.tone === 'teal' ? ' home-step__badge--teal' : ''}`}>
                {i + 1}
              </div>
              <h3 className="home-step__title">{step.title}</h3>
              <p className="home-step__text">{step.text}</p>
            </article>
          ))}

          <article className="home-step home-step--cta reveal">
            <h3 className="home-step__title">Ready to fill the gaps in your collection?</h3>
            <CustomButton text="Create an account" to="/register" />
          </article>
        </div>
      </div>
    </section>

    <section id="chapters" className="home-chapters" data-reveal-container>
      <div className="home-chapters__inner">
        <div className="home-section-head home-section-head--split reveal">
          <div>
            <p className="home-eyebrow">Chapters</p>
            <h2 className="home-section-title">
              Every chapter, all swappable.
            </h2>
          </div>
          <Link to="/register" className="home-link">Browse all chapters &rarr;</Link>
        </div>

        <ChapterCarouselSection
          title="The latest chapters"
          chapters={latest}
        />

        <ChapterCarouselSection
          title="Ephemeral vintage series"
          endpoint="/chapters/vintage"
        />

        <div className="home-catalogue reveal">
          <h3 className="home-catalogue__title">And all the other chapters</h3>
          <p className="home-catalogue__text">
            New chapters are added as they land in WeWard, so your tracker never falls behind.
          </p>
          <CustomButton
            text="Explore the catalogue"
            to="/register"
            variant="outline"
          />
        </div>
      </div>
    </section>

    <ScrollToTop />

  </main>
)
}

export default React.memo(Home);
