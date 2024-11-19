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
      return <Container className="opportunities">
       <Spinner 
        animation="border"
        className="spinner" 
       />
      </Container>
    }
  return (
    <Container className="checkpage">

        {cardsByPlace && cardsByPlace.length > 0 ? (
          cardsByPlace.map((place) => (
            <Place
              key={place.place_name}
              place={place}
              explorerId={explorerId}
              token={token}
            />
            ))
            ) : (
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
