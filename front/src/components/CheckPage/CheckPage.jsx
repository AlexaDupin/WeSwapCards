import React, { useState, useEffect } from 'react';
import {
    Container,
    Spinner
} from "react-bootstrap";

import axios from 'axios';

import PropTypes from 'prop-types';

import './checkPageStyles.scss';
import Place from '../CheckPage/Place/Place';
import ScrollToTop from '../ScrollToTopButton/ScrollToTop';

function CheckPage({
    explorerId, name, token
  }) {
    const [cardsByPlace, setCardsByPlace] = useState([]);
    const [loading, setLoading] = useState(true);

    const baseUrl = process.env.REACT_APP_BASE_URL;

    const fetchExplorerCardsByPlace = async () => {
        try {
          const response = await axios.get(
            `${baseUrl}/explorercards/${explorerId}`
            , {
              headers: {
                authorization: token,
              },
              withCredentials: true,  // Ensure credentials (cookies) are sent
            });
          const fetchedCardsByPlace = response.data;
          console.log("fetchedCardsByPlace", fetchedCardsByPlace);
          setCardsByPlace(fetchedCardsByPlace);
          setLoading(false);

        } catch (error) {
          console.log(error);
        }
    };

    useEffect(
      () => {
      fetchExplorerCardsByPlace()
      },
      [],
    );

  if (loading) {
    return <Container className="page-container">
        <h1 className="swap-title">All my cards</h1>

       <Spinner 
        animation="border"
        className="spinner" 
       />
       <p>Loading your cards...</p>
      </Container>
    }

  return (
    <Container className="page-container">
    <h1 className="swap-title">All my cards</h1>

        {cardsByPlace && cardsByPlace.length > 0 ? (
          <><p>Here is an overview of all the cards you logged and their duplicate status.</p><p>Tap on a card number to easily update its duplicate status.</p><br />
          {cardsByPlace.map((place) => (
            <Place
              key={place.place_name}
              place={place}
              explorerId={explorerId}
              token={token}
            />
            ))
          }</>)  
           : (
              <div>You don't have any logged cards for the moment, {name}.</div>
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
