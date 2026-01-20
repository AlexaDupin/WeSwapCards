import React, { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../PageContainer/PageContainer';

import ChapterCarouselSection from './ChapterCarouselSection';
import ScrollToTop from '../ScrollToTopButton/ScrollToTop';
import CustomButton from '../CustomButton/CustomButton';

import Report from '../../images/reportPL.svg';
import Search from '../../images/searchPL.svg';
import Users from '../../images/usersPL.svg';
import Chat from '../../images/chatdealPL.svg';
import Dashboard from '../../images/dashboardPL.svg';
import Logo from '../../images/favImage.png';

import './homeStyles.scss';

const VINTAGE_COLLECTOR_IDS = [47, 39, 71, 35, 42, 60];
// const VINTAGE_COLLECTOR_IDS = [1, 2, 3, 4, 5];

function Home() {
    const navigate = useNavigate();
    const { isSignedIn } = useUser();

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
  <PageContainer className="home">
    <section data-reveal-container className="home-section">
      <div className="home-section-left reveal">
        <img src={Logo} alt="WeSwapCards logo" className="home-section-left-image"/>
      </div>

      <div className="home-section-right reveal">
        <h1 className="home-title">Welcome to WeSwapCards!</h1><br />
        <p className="home-text">You use WeWard and want to exchange WeCards easily?<br />This is the place for you!</p>
        <p className="home-text">Create an account and start searching for the cards you need!</p>
        <p className="home-disclaimer">This platform is <strong>not</strong> affiliated in any way with the official WeWard app.</p><br />

        <CustomButton 
            text="Create an account"
            href="/register"
        />
      </div>
    </section>

    <section data-reveal-container> 
    <div className='reveal home-steps'>    
      <section className="home-image-section ">
        <img src={Report} alt="Report icon" className="home-image" />
        <h2 className="home-subtitle">Log all the cards you have</h2>
      </section>

      <section className="home-image-section ">
        <img src={Search} alt="Find icon" className="home-image" />
        <h2 className="home-subtitle">Find the card you need</h2>
      </section>

      <section className="home-image-section ">
        <img src={Users} alt="Users icon" className="home-image" />
        <h2 className="home-subtitle">Browse users who have this card</h2>
      </section>

      <section className="home-image-section ">
        <img src={Chat} alt="Chat icon" className="home-image" />
        <h2 className="home-subtitle">Chat with them and find a deal</h2>
      </section>

      <section className="home-image-section reveal">
        <img src={Dashboard} alt="Dashboard icon" className="home-image"/>
        <h2 className="home-subtitle">Keep track of your requests in a dashboard</h2>
      </section>
      </div>
    </section>

    <ChapterCarouselSection
      title="Browse all the latest chapters"
      endpoint="/chapters/latest"
      params={{ limit: 10 }}
    />

    {VINTAGE_COLLECTOR_IDS.length > 0 && (
      <ChapterCarouselSection
        title="All ephemeral vintage series"
        endpoint="/chapters/by-ids"
        params={{ ids: VINTAGE_COLLECTOR_IDS.join(',') }}
      />
    )}

    <section className="latest-chapters my-5" data-reveal-container aria-label="And all the other chapters!">
      <h2 className="home-section-title home-section-title--center">And all the other chapters!</h2>
    </section>

    <ScrollToTop />
  
  </ PageContainer>
)
}

export default React.memo(Home);
