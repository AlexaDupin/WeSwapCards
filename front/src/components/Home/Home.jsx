import React, { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

import {
  Container
} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

import ScrollToTop from '../ScrollToTopButton/ScrollToTop';
import CustomButton from '../CustomButton/CustomButton';

import Report from '../../images/report.svg';
import Search from '../../images/search.svg';
import Users from '../../images/users.svg';
import Chat from '../../images/chatdeal.svg';
import Dashboard from '../../images/dashboard.svg';

import './homeStyles.scss';

function Home() {
    const navigate = useNavigate();
    const { isSignedIn } = useUser();

    useEffect(() => {
      if (!isSignedIn) {
        localStorage.clear();
      }
    }, [isSignedIn]);


  return (
  <Container className="page-container">
    <section>
      <h1 className="home-title">Welcome to WeSwapCards!</h1><br />
      <p>You use the WeWard app and want to exchange cards easily? This is the place for you!</p>
      <p>Create an account and start searching for the cards you need!</p>
      <p className="home-disclaimer">This platform is <strong>not</strong> affiliated in any way with the official WeWard app.</p><br />

      <CustomButton 
          text="Create an account"
          onClick={() => navigate('/register')}
      /><br /><br />
    </section>

    <section className="home-steps">     
      <section className="home-image-section">
        <img src={Report} alt="accueil" className="home-image" />
        <h2 className="home-subtitle">Log all the cards you have</h2>
      </section>

      <section className="home-image-section">
        <img src={Search} alt="accueil" className="home-image" />
        <h2 className="home-subtitle">Find the card you need</h2>
      </section>

      <section className="home-image-section">
        <img src={Users} alt="accueil" className="home-image" />
        <h2 className="home-subtitle">Browse users who have this card</h2>
      </section>

      <section className="home-image-section">
        <img src={Chat} alt="accueil" className="home-image" />
        <h2 className="home-subtitle">Chat with them and find a deal</h2>
      </section>

      <section className="home-image-section">
        <img src={Dashboard} alt="accueil" className="home-image"/>
        <h2 className="home-subtitle">Keep track of your requests in a dashboard</h2>
      </section>
    </section>

    <ScrollToTop />
  
  </Container>
)
}

export default React.memo(Home);
