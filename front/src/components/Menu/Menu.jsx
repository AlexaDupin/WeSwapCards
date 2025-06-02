import React, { useEffect } from 'react';
import PageContainer from '../PageContainer/PageContainer';
import {
    Button,
    OverlayTrigger,
    Tooltip  
} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import CarouselModal from '../Carousel/Carousel';

import Report from '../../images/reportPL.svg';
import Search from '../../images/searchPL.svg';
import Check from '../../images/checkPL.svg';
import Dashboard from '../../images/dashboardPL.svg';
import Info from '../../images/info-circle.svg';

import { useStateContext } from '../../contexts/StateContext';

import './menuStyles.scss';

function Menu() {
    const state = useStateContext();

    const navigate = useNavigate();
    // console.log("MENU explorerId", explorerId);
    
    useEffect(() => {
        if (!state.explorer.id) {
            navigate('/login/redirect', { state: { from: "/menu" } });
            return;
        } 
     }, []);

  return (
    <>
    <PageContainer>
          <h1 className="menu-title" style={{ fontSize: '1.2rem' }}>
              Welcome {state.explorer.name}!
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
                  <div className="menu-link menu-image-container">
                    <a href="/check" className="menu-link">
                        <img src={Check} alt="Check icon" className="menu-image" />
                    </a>
                    <OverlayTrigger trigger="click" placement="top" 
                        overlay={
                                <Tooltip id={`tooltip-top`}>
                                  Keep your cards up-to-date to make successful deals and avoid unnecessary messages.
                                </Tooltip>
                        }
                    >
                        <img src={Info} alt="Info icon" className="menu-info-check" />
                    </OverlayTrigger>  
                  </div>   
                  <Button
                      onClick={() => navigate('/check')}
                      className="menu-button"
                  >
                      Check my cards
                  </Button>
              </section>
              <section className="menu-image-section">
                  <div className="menu-link menu-image-container">
                    <a href="/swap/dashboard" className="menu-link">
                        <img src={Dashboard} alt="Dashboard icon" className="menu-image" />
                    </a>
                    <OverlayTrigger trigger="click" placement="top" 
                        overlay={
                                <Tooltip id={`tooltip-top`}>
                                  Open this section regularly to see if you have new messages.
                                </Tooltip>
                        }
                    >
                        <img src={Info} alt="Info icon" className="menu-info" />
                    </OverlayTrigger>  
                  </div>   
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

    </PageContainer>
      
    <section className="modal">
      <CarouselModal/>
    </section>
    </> 
    )
}

export default React.memo(Menu);
