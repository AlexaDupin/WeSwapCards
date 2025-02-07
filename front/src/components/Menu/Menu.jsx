import React, { useEffect } from 'react';
import { useClerk } from '@clerk/clerk-react';

import {
    Container,
    Button
} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

import Report from '../../images/report.svg';
import Search from '../../images/search.svg';
import Check from '../../images/check.svg';
import Dashboard from '../../images/dashboard.svg';

import './menuStyles.scss';

function Menu({
    name,
    explorerId,
}) {
    const navigate = useNavigate();
    const { signOut } = useClerk();
    console.log("MENU explorerId", explorerId);
    
    const handleSignOut = async () => {
        try {
          await signOut();
          console.log('Signed out successfully');
        //   navigate('/login');
        navigate('/login', { replace: true });
        } catch (error) {
          console.error('Error signing out:', error);
        }
      };

    useEffect(() => {
        if (!explorerId || !name || name === "") {
            handleSignOut();
        }
     }, []);

  return (
    <Container className="page-container">
    <h1 className="menu-title" style={{fontSize: '1.2rem'}}>
        Welcome {name}!
    </h1>

    <section className="home-steps">     
    <section className="image-section">
        <img src={Report} alt="accueil" className="home-image" />
        <Button
            onClick={() => navigate('/report')}
            className="menu-button"
        >
        Report my cards
        </Button>
    </section>
    <section className="image-section">
        <img src={Search} alt="accueil" className="home-image" />
        <Button
            onClick={() => navigate('/swap/card')}
            className="menu-button"
        >
        Find a card
        </Button>
    </section>
    <section className="image-section">
        <img src={Check} alt="accueil" className="home-image" />
        <Button
            onClick={() => navigate('/check')}
            className="menu-button"
        >
        Check my cards
        </Button>
    </section>
    <section className="image-section">
        <img src={Dashboard} alt="accueil" className="home-image" />
        <Button
            onClick={() => navigate('/swap/requests')}
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
)
}

export default React.memo(Menu);
