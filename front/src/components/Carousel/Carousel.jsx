import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import {
  Carousel, Modal 
} from "react-bootstrap";

import Report from '../../images/reportPL.svg';
import Search from '../../images/searchPL.svg';
import Dashboard from '../../images/dashboardPL.svg';
import Check from '../../images/checkPL.svg';

import './carouselStyles.scss';

const CustomCarousel = () => {
    const [index, setIndex] = useState(0);
    const [show, setShow] = useState(false);
    const location = useLocation();
  
    useEffect(() => {
      if (location.state?.from === "/register/user") {
        setShow(true);
      }
    }, [location.state]);
  
    const handleClose = () => setShow(false);
  
    const handleSelect = (selectedIndex, e) => {
      setIndex(selectedIndex);
    };

  return (

    <div
      className="modal show"
      style={{ display: 'block', position: 'initial' }}
    >
    <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title className="modal-title text-center w-100">Welcome to WeSwapCards!</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <Carousel activeIndex={index} onSelect={handleSelect} controls={true} indicators={false} interval={null} className="custom-carousel">
              <Carousel.Item>
                <div className="carousel-content text-center">
                  <img src={Report} alt="Report icon" className="carousel-image" />
                  <div className="caption-container">
                    <h3 className="caption-title">Log all your cards</h3>
                    <p className="caption-text">Go to "Report my cards", log the cards you have and specify if you have duplicates.</p>
                  </div>
                </div>
              </Carousel.Item>
              <Carousel.Item>
                <div className="carousel-content text-center">
                  <img src={Search} alt="Search icon" className="carousel-image" />
                  <div className="caption-container">
                    <h3 className="caption-title">Search for the cards you need</h3>
                    <p className="caption-text">Go to "Find a card", select a chapter and a card number and see who has it.</p>
                  </div>
                </div>
              </Carousel.Item>
              <Carousel.Item>
                <div className="carousel-content text-center">
                  <img src={Dashboard} alt="Dashboard icon" className="carousel-image" />
                  <div className="caption-container">
                    <h3 className="caption-title">Check all your conversations</h3>
                    <p className="caption-text">Make sure to regularly go to "View all requests" to see if you have new messages.</p>
                  </div>
                </div>
              </Carousel.Item>
              <Carousel.Item>
                <div className="carousel-content text-center">
                  <img src={Check} alt="Check icon" className="carousel-image" />
                  <div className="caption-container">
                    <h3 className="caption-title">Check your cards' status</h3>
                    <p className="caption-text">Go to "Check my cards" to ensure your cards are up-to-date and edit their duplicate status.</p>
                  </div>
                </div>
              </Carousel.Item>
            </Carousel>

        </Modal.Body>
        </Modal>
    </div>
  );
};

export default CustomCarousel;