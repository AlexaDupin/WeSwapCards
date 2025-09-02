import React, { useEffect } from 'react';
import PageContainer from '../PageContainer/PageContainer';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Container } from "react-bootstrap";

import ScrollToTop from '../ScrollToTopButton/ScrollToTop';
import CustomButton from '../CustomButton/CustomButton';

import Report from '../../images/reportPL.svg';
import Search from '../../images/searchPL.svg';
import Users from '../../images/usersPL.svg';
import Chat from '../../images/chatdealPL.svg';
import Dashboard from '../../images/dashboardPL.svg';
import Logo from '../../images/favImage.png';

import './homeStyles.scss';

function Home() {
    const navigate = useNavigate();
    const { isSignedIn } = useUser();

    useEffect(() => {
      if (!isSignedIn) {
        localStorage.clear();
      } else {
        navigate('/menu');
      }
    }, [isSignedIn]);

    useEffect(() => {
      // optional: stagger delays inside groups
      document.querySelectorAll("[data-reveal-container]").forEach((group) => {
        group.querySelectorAll(".reveal").forEach((el, i) => {
          el.style.setProperty("--delay", `${i * 90}ms`);
        });
      });
  
      // re-animate on scroll up/down: toggle class based on visibility
      const ENTER = 0.25; // add class when >= 25% visible
      const EXIT  = 0.10; // remove class when <= 10% visible
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
  
      const nodes = document.querySelectorAll(".reveal");
      nodes.forEach((el) => io.observe(el));
  
      return () => io.disconnect(); // cleanup
    }, []);

  return (
  <Container className="home">
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

    <ScrollToTop />
  
  </ Container>
)
}

export default React.memo(Home);
