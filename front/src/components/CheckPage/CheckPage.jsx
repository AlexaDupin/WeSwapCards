import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Spinner,
    Alert
} from "react-bootstrap";

import { axiosInstance } from '../../helpers/axiosInstance';
import { useAuth } from '@clerk/clerk-react'

import Bulb from '../../images/bulb.svg';

import PropTypes from 'prop-types';

import './checkPageStyles.scss';
import Place from '../CheckPage/Place/Place';
import ScrollToTop from '../ScrollToTopButton/ScrollToTop';

function CheckPage({
    explorerId, name
  }) {
    const [cardsByPlace, setCardsByPlace] = useState([]);
    const [loading, setLoading] = useState(true);
    const { getToken } = useAuth()
    const [hiddenAlert, setHiddenAlert] = useState(true);
    const [alertMessage, setAlertMessage] = useState('');
    const navigate = useNavigate();

    const fetchExplorerCardsByPlace = async () => {
        try {
          const response = await axiosInstance.get(
            `/explorercards/${explorerId}`, {
              headers: {
                Authorization: `Bearer ${await getToken()}`,
              },
            })
          const fetchedCardsByPlace = response.data;
          // console.log("fetchedCardsByPlace", fetchedCardsByPlace);
          setCardsByPlace(fetchedCardsByPlace);
          setLoading(false);

        } catch (error) {
          setLoading(false);
          setHiddenAlert(false);
          setAlertMessage("There was an error while loading your cards");
          // console.log(error);
        }
    };

    useEffect(
      () => {
        if (!explorerId) {
          navigate('/login/redirect', { state: { from: "/check" } });
        } else {
          fetchExplorerCardsByPlace()
        }
      }, [],
    );

  return (
    <Container className="page-container">
    <h1 className="swap-title">All my cards</h1>

    {loading &&
      <><Spinner
          animation="border"
          className="spinner" /><p>Loading your requests...</p></>
    }

    {!loading && (
    <>
    <Alert
        variant='danger'
        className={hiddenAlert ? 'hidden-alert' : ''}>
        {alertMessage}
    </Alert>

        {cardsByPlace && cardsByPlace.length > 0 ? (
          <>
          <div className="check-tip">
            {/* <img src={Bulb} alt="Bulb" className="check-tip-image"/> */}
            <p className="check-tip-text"><img src={Bulb} alt="Bulb" className="check-tip-image"/>Tap on a number to easily update a card's duplicate status.</p><br />
          </div>
          
          {cardsByPlace?.map((place) => (
            <Place
              key={place.place_name}
              place={place}
              explorerId={explorerId}
            />
            ))
          }</>)  
           : (
              <div>You don't have any logged cards for the moment, {name}.</div>
        )}
      </>
      )}
      
      <ScrollToTop />
    </Container>
)
}

CheckPage.propTypes = {
  explorerId: PropTypes.number.isRequired,
  name: PropTypes.string,
};

export default React.memo(CheckPage);
