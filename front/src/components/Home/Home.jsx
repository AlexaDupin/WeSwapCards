import React, { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

import {
  Container
} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import ScrollToTop from '../ScrollToTopButton/ScrollToTop';

import CustomButton from '../CustomButton/CustomButton';

import './homeStyles.scss';

function Home() {
    const navigate = useNavigate();
    const { isSignedIn } = useUser(); // Get user's sign-in status from Clerk

    useEffect(() => {
      if (!isSignedIn) {
        localStorage.clear();
      }
    }, [isSignedIn]);


  return (
  <Container className="page-container">
    <section>
      <h1 className="home-title">Welcome to WeSwapCards!</h1><br />
      <p>This platform aims to facilitate exchange of cards between users of the WeWard app. </p>
      <p>It is <strong>not</strong> linked in any way to the official WeWard app.</p>

      <p>You first need to create an account. Then you can start searching for the cards you need!</p><br />
      <CustomButton 
          text="Create an account"
          onClick={() => navigate('/register')}
      /><br />
      <CustomButton 
          text="Login"
          onClick={() => navigate('/login')}
      /><br /><br /><br />
    </section>

    <section>
      <h1 className="home-title">How it works?</h1><br />
      <p>Once you are logged in, follow these steps:</p>
      <div>

      <ul className="home-list">
        <li>
          <h2 className="home-subtitle">1. Log all the cards you have</h2>
          <p>Start by reporting your own cards.</p>
        </li>
        <li>
          <h2 className="home-subtitle">2. Find a card</h2>
          <p>You will then be able to search for a specific card.</p>
        </li>
        <li>
          <h2 className="home-subtitle">3. Browse users</h2>
          <p>You will see a list of all users who have this card as a duplicate.</p>   
        </li>
        <li>
          <h2 className="home-subtitle">4. Chat with users</h2>
          <p>Chat with any user in the list to find an agreement on cards to swap.</p>
        </li>
      </ul>
      <p>You will also be able to keep track of all your swap requests in a practical dashboard so register to start swapping!</p>

      </div>
    </section>

    <ScrollToTop />
  
  </Container>
)
}

export default React.memo(Home);
