import React, { useEffect } from 'react';
import { useClerk } from '@clerk/clerk-react';

import {
    Container,
    Button
} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import CarouselSlides from '../Carousel/Carousel';

import Report from '../../images/reportPL.svg';
import Search from '../../images/searchPL.svg';
import Check from '../../images/checkPL.svg';
import Dashboard from '../../images/dashboardPL.svg';

import './menuStyles.scss';

function Menu({
    name,
    explorerId,
}) {
    const navigate = useNavigate();
    const { signOut } = useClerk();
    // console.log("MENU explorerId", explorerId);
    
    useEffect(() => {
        if (!explorerId) {
            navigate('/login/redirect', { state: { from: "/menu" } });
            return;
        } 
     }, []);

  return (
    <><Container className="page-container">
          <h1 className="menu-title" style={{ fontSize: '1.2rem' }}>
              Welcome {name}!
          </h1>

          <section className="menu-steps">

              <section className="menu-image-section">
                  <a href="/report" className="menu-link">
                      <img src={Report} alt="Report icon" className="menu-image" />
                  </a>
                  <Button
                      onClick={() => navigate('/report')}
                      className="menu-button"
                  >
                      Report my cards
                  </Button>
              </section>
              <section className="menu-image-section">
                  <a href="/swap/card" className="menu-link">
                      <img src={Search} alt="Search icon" className="menu-image" />
                  </a>
                  <Button
                      onClick={() => navigate('/swap/card')}
                      className="menu-button"
                  >
                      Find a card
                  </Button>
              </section>
              <section className="menu-image-section">
                  <a href="/check" className="menu-link">
                      <img src={Check} alt="Check icon" className="menu-image" />
                  </a>
                  <Button
                      onClick={() => navigate('/check')}
                      className="menu-button"
                  >
                      Check my cards
                  </Button>
              </section>
              <section className="menu-image-section">
                  <a href="/swap/dashboard" className="menu-link">
                      <img src={Dashboard} alt="Dashboard icon" className="menu-image" />
                  </a>
                  <Button
                      onClick={() => navigate('/swap/dashboard')}
                      className="menu-button"
                  >
                      View all requests
                  </Button>
              </section>
              <section className="btn-legal">
                  <Button
                      onClick={() => navigate('/legal')}
                      className="menu-button"
                  >
                      Legal
                  </Button>
              </section>

          </section>

      </Container>
      
      <section className="">
              <CarouselSlides />
          </section></>

    )
}

export default React.memo(Menu);
