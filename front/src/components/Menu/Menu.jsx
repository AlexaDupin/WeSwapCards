import React, { useEffect } from 'react';
import { Container, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../contexts/StateContext';

// Bootstrap icons (no local images needed)
import { Search, ListCheck, Speedometer2 } from 'react-bootstrap-icons';

import CarouselModal from '../Carousel/Carousel'; // keep if you still use it
import './menuStyles.scss';

function Menu() {
  const state = useStateContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state.explorer.id) {
      navigate('/login/redirect', { state: { from: "/menu" } });
      return;
    }
  }, [state.explorer.id, navigate]);

  const name = state?.explorer?.name ?? '';

  return (
    <>
      <Container className="page-container menu-container">
        <div className="menu-head">
          <h1 className="page-title">Welcome {name}!</h1>
          <Button
            variant="link"
            className="menu-legal-desktop"
            onClick={() => navigate('/legal')}
          >
            Legal
          </Button>
        </div>

        <div className="menu-grid" role="navigation" aria-label="Primary actions">
          <button
            type="button"
            className="action-card"
            onClick={() => navigate('/swap/card')}
            aria-label="Find a card"
            title="Find a card"
          >
            <div className="action-card__icon" aria-hidden="true"><Search /></div>
            <div className="action-card__content">
              <h2 className="action-card__title">Find a card</h2>
              <p className="action-card__desc">Search your missing cards and chat with users who have them.</p>
            </div>
          </button>

          <button
            type="button"
            className="action-card"
            onClick={() => navigate('/cards')}
            aria-label="My cards"
            title="My cards"
          >
            <div className="action-card__icon" aria-hidden="true"><ListCheck /></div>
            <div className="action-card__content">
              <h2 className="action-card__title">My cards</h2>
              <p className="action-card__desc">Keep your list up to date to make successful deals.</p>
            </div>
          </button>

          <button
            type="button"
            className="action-card"
            onClick={() => navigate('/swap/dashboard')}
            aria-label="Dashboard"
            title="Dashboard"
          >
            <div className="action-card__icon" aria-hidden="true"><Speedometer2 /></div>
            <div className="action-card__content">
              <h2 className="action-card__title">Dashboard</h2>
              <p className="action-card__desc">Check new messages and keep track of all your requests.</p>
            </div>
          </button>
        </div>

        {/* Optional: keep your tips carousel below */}
        <section className="menu-tips">
          <CarouselModal />
        </section>
      </Container>

      {/* Mobile-only floating Legal pill */}
      <Button
        className="menu-legal-floating d-md-none"
        onClick={() => navigate('/legal')}
        aria-label="Open legal information"
      >
        Legal
      </Button>
    </>
  );
}

export default React.memo(Menu);



// import React, { useEffect } from 'react';
// import {
//     Button,
//     Container,
//     OverlayTrigger,
//     Tooltip  
// } from "react-bootstrap";
// import { useNavigate } from 'react-router-dom';
// import CarouselModal from '../Carousel/Carousel';

// import Search from '../../images/searchPL.svg';
// import Check from '../../images/checkPL.svg';
// import Dashboard from '../../images/dashboardPL.svg';
// import Info from '../../images/info-circle.svg';

// import { useStateContext } from '../../contexts/StateContext';

// import './menuStyles.scss';

// function Menu() {
//     const state = useStateContext();

//     const navigate = useNavigate();
//     // console.log("MENU explorerId", explorerId);
    
//     useEffect(() => {
//         if (!state.explorer.id) {
//             navigate('/login/redirect', { state: { from: "/menu" } });
//             return;
//         } 
//      }, []);

//   return (
//     <>
//     <Container className="page-container menu-container">
//           <h1 className="page-title" style={{ fontSize: '1.2rem' }}>
//               Welcome {state.explorer.name}!
//           </h1>
//           <div className="menu">

//           <section className="menu-steps">

//               <section className="menu-image-section">
//                   <a href="/swap/card" className="menu-link">
//                       <img src={Search} alt="Search icon" className="menu-image" />
//                   </a>
//                   <Button
//                       onClick={() => navigate('/swap/card')}
//                       className="menu-button"
//                   >
//                       Find a card
//                   </Button>
//               </section>
//               <section className="menu-image-section">
//                   <div className="menu-link menu-image-container">
//                     <a href="/cards" className="menu-link">
//                         <img src={Check} alt="Check icon" className="menu-image" />
//                     </a>
//                     <OverlayTrigger trigger="click" placement="top" 
//                         overlay={
//                                 <Tooltip id={`tooltip-top`}>
//                                   Keep your cards up-to-date to make successful deals and avoid unnecessary messages.
//                                 </Tooltip>
//                         }
//                     >
//                         <img src={Info} alt="Info icon" className="menu-info-check" />
//                     </OverlayTrigger>  
//                   </div>   
//                   <Button
//                       onClick={() => navigate('/cards')}
//                       className="menu-button"
//                   >
//                       Check my cards
//                   </Button>
//               </section>
//               <section className="menu-image-section">
//                   <div className="menu-link menu-image-container">
//                     <a href="/swap/dashboard" className="menu-link">
//                         <img src={Dashboard} alt="Dashboard icon" className="menu-image" />
//                     </a>
//                     <OverlayTrigger trigger="click" placement="top" 
//                         overlay={
//                                 <Tooltip id={`tooltip-top`}>
//                                   Open this section regularly to see if you have new messages.
//                                 </Tooltip>
//                         }
//                     >
//                         <img src={Info} alt="Info icon" className="menu-info" />
//                     </OverlayTrigger>  
//                   </div>   
//                   <Button
//                       onClick={() => navigate('/swap/dashboard')}
//                       className="menu-button"
//                   >
//                       View all requests
//                   </Button>
//               </section>
//           </section>

//           <button className="btn btn-primary btn-legal menu-button">Legal</button>
// </div>

//     </Container>
      
//     <section className="modal">
//       <CarouselModal/>
//     </section>
//     </> 
//     )
// }

// export default React.memo(Menu);
