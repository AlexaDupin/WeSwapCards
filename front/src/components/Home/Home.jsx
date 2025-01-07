import React from 'react';
import {
  Container
} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import ScrollToTop from '../ScrollToTopButton/ScrollToTop';

import CustomButton from '../CustomButton/CustomButton';
import step1 from '../../images/1step.png';
import step2 from '../../images/2step.png';
import step3 from '../../images/3step.png';
import step4 from '../../images/4step.png';

import './homeStyles.scss';

function Home() {
    const navigate = useNavigate();

  return (
    <Container className="page-container">
    <h1 className="home-title">Welcome to WeSwapCards!</h1><br />
    <p>This website aims to facilitate exchange of cards between users of the WeWard app. </p>
    <p>It is <strong>not</strong> linked in any way to the official WeWard app.</p>

    <p>You first need to create an account. This will enable you to find other users and keep track of all your requests.</p><br />
    <CustomButton 
        text="Create an account"
        onClick={() => navigate('/register')}
    /><br /><br /><br />
    <p>Once you are logged in, follow these steps:</p>

        <ol>
          <li>
            <h2 className="home-subtitle">1. Log all the cards you have</h2>
            <p>This website is based on exchange, so you need to first enter your own cards to find a match.</p>
            <img src={step1} alt="" />
          </li><br />
          <li>
            <h2 className="home-subtitle">2. Find a card</h2>
            <p>You will then be able to search for a specific card.</p>
            <img src={step2} alt="" />
          </li><br />
          <li>
            <h2 className="home-subtitle">3. Browse users</h2>
            <p>Only users that need cards you have will be shown so you can help them as well.</p>   
            <img src={step3} alt="" />
          </li><br /><br />
          <li>
            <h2 className="home-subtitle">4. Chat with users</h2>
            <p>You can now chat with users to find an agreement.</p>
            <img src={step4} alt="" />
          </li><br />
    </ol>    

    <p>You will also be able to keep track of all your requests in a dashboard, so register now to start swapping!</p>
    
    <ScrollToTop />

    </Container>
)
}

export default React.memo(Home);
