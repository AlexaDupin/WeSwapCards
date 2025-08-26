import React, { useEffect } from 'react';
import PageContainer from '../PageContainer/PageContainer';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

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


  return (
  <PageContainer>
    <section className="home-section">
      <div className="home-section-left">
        <img src={Logo} alt="WeSwapCards logo" className="home-section-left-image"/>
      </div>

      <div className="home-section-right">
        <h1 className="home-title">Welcome to WeSwapCards!</h1><br />
        <p className="home-text">You use the WeWard app and want to exchange cards easily?<br />This is the place for you!</p>
        <p className="home-text">Create an account and start searching for the cards you need!</p>
        <p className="home-disclaimer">This platform is <strong>not</strong> affiliated in any way with the official WeWard app.</p><br />

        <CustomButton 
            text="Create an account"
            href="/register"
        /><br /><br />
      </div>
    </section>

    <section className="home-steps">     
      <section className="home-image-section">
        <img src={Report} alt="Report icon" className="home-image" />
        <h2 className="home-subtitle">Log all the cards you have</h2>
      </section>

      <section className="home-image-section">
        <img src={Search} alt="Find icon" className="home-image" />
        <h2 className="home-subtitle">Find the card you need</h2>
      </section>

      <section className="home-image-section">
        <img src={Users} alt="Users icon" className="home-image" />
        <h2 className="home-subtitle">Browse users who have this card</h2>
      </section>

      <section className="home-image-section">
        <img src={Chat} alt="Chat icon" className="home-image" />
        <h2 className="home-subtitle">Chat with them and find a deal</h2>
      </section>

      <section className="home-image-section">
        <img src={Dashboard} alt="Dashboard icon" className="home-image"/>
        <h2 className="home-subtitle">Keep track of your requests in a dashboard</h2>
      </section>
    </section>

    <ScrollToTop />
  
  </ PageContainer>
)
}

export default React.memo(Home);
