import React, { useState, useEffect } from 'react';
import {
    Container
} from "react-bootstrap";

import axios from 'axios';

import PropTypes from 'prop-types';

import './checkPageStyles.scss';
import Place from '../CheckPage/Place/Place';

function CheckPage({
    explorerId, name
  }) {
    const [cardsByPlace, setCardsByPlace] = useState([]);

    const baseUrl = process.env.REACT_APP_BASE_URL;

    const fetchExplorerCardsByPlace = async () => {
        try {
          const response = await axios.get(`${baseUrl}/explorercards/${explorerId}`);
          const fetchedCardsByPlace = response.data;
          console.log("fetchedCardsByPlace", fetchedCardsByPlace);
          setCardsByPlace(fetchedCardsByPlace);
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

  return (
    <Container className="checkpage">

        {cardsByPlace && cardsByPlace.length > 0 ? (
          cardsByPlace.map((place) => (
            <Place
              key={place.place_name}
              place={place}
              explorerId={explorerId}
            />
            ))
            ) : (
              <div>Unable to retrieve your data, {name}.</div>
        )}

    </Container>
)
}

CheckPage.propTypes = {
  explorerId: PropTypes.number.isRequired,
  name: PropTypes.string,
};

export default React.memo(CheckPage);
