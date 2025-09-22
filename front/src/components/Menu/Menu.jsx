import React, { useEffect } from 'react';
import { Container, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../contexts/StateContext';

import { Search, ListCheck, ChatDots } from 'react-bootstrap-icons';

import CarouselModal from '../Carousel/Carousel';
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
            <div className="action-card__icon" aria-hidden="true"><ChatDots /></div>
            <div className="action-card__content">
              <h2 className="action-card__title">Dashboard</h2>
              <p className="action-card__desc">Check new messages and keep track of all your requests.</p>
            </div>
          </button>
        </div>

        <section className="menu-tips">
          <CarouselModal />
        </section>
      </Container>

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