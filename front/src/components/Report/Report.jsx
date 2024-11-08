import React, { useState, useEffect } from 'react';
import {
	Form,
	Row,
  Container
} from "react-bootstrap";

import axios from 'axios';

import CustomButton from '../CustomButton/CustomButton';

// import PropTypes from 'prop-types';

import './reportStyles.scss';
import PlaceCard from '../PlaceCard/PlaceCard';

function Report() {
  const [places, setPlaces] = useState([]);
  const [placeId, setPlaceId] = useState();
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [duplicates, setDuplicates] = useState([]);

  const baseUrl = process.env.REACT_APP_BASE_URL;

  const fetchAllPlaces = async () => {
    try {
      const response = await axios.get(`${baseUrl}/places`);
      setPlaces(response.data.places);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectPlace = async () => {
    try {
      const response = await axios.get(`${baseUrl}/cards/${placeId}`);
      setCards(response.data.cards);
      setSelectedCards([]);
      setDuplicates([]);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCardSelection = (card) => {
    setSelectedCards((prevSelectedCards) => {
      // Check if the card is already selected (by matching the id)
      const isCardSelected = prevSelectedCards.some(selectedCard => selectedCard.id === card.id);

      if (isCardSelected) {
        // If already selected, remove the card from the array (deselect)
        return prevSelectedCards.filter(selectedCard => selectedCard.id !== card.id);
      } else {
        // If not selected, add the card to the array (select)
        return [...prevSelectedCards, card];
      }
    });
  };

  // Sort selected cards so that they can show in proper order in duplicate section
  const sortedCards = selectedCards.slice().sort((a, b) => a.id - b.id);

  const handleCardDuplicate = (card) => {
    setDuplicates((prevDuplicates) => {
      // Check if the card is already selected (by matching the id)
      const isCardSelected = prevDuplicates.some(duplicate => duplicate.id === card.id);

      if (isCardSelected) {
        // If already selected, remove the card from the array (deselect)
        return prevDuplicates.filter(duplicate => duplicate.id !== card.id);
      } else {
        // If not selected, add the card to the array (select)
        return [...prevDuplicates, card];
      }
    });
  };

  console.log("placeId", placeId);
  console.log("cards", cards);  
  console.log("selectedCards", selectedCards);
  console.log("duplicates", duplicates);

  // useEffect so that data is fetched on mount
  useEffect(
    () => {
      fetchAllPlaces();
      handleSelectPlace();
    },
    [placeId],
  );

  return (
    <Container className="report">
    <Form className="">
              
      <Form.Group className="mb-3" controlId="formGroupPlace">
        <Form.Label className="report-label">Select a place, Alexa</Form.Label>
        <Form.Select 
          aria-label="Select a place" 
          onChange={(e) => {setPlaceId(e.target.value)}}
        >
          <option>Select</option>
          {places.map((place) => (
            <option 
              key={place.id}
              value={place.id}>
              {place.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formGroupEmail">
        <Form.Label className="report-label">Click on the cards you have</Form.Label>

        <Row className="d-flex g-3">
        {cards && cards.length > 0 ? (
          cards.map((card) => (
            <PlaceCard
              key={card.id}
              card={card}
              selectedCards={selectedCards} // Pass the selectedCards array
              handleCardSelection={handleCardSelection} // Pass the selection handler
              />
              ))
            ) : (
              <div>No cards available</div>  // Fallback UI if no cards
            )}
        </Row>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formGroupEmail">
        <Form.Label className="report-label">Click on the cards you have duplicates for (2 or more)</Form.Label>
        
        <Row className="d-flex g-3">
        {sortedCards.map((selectedCard) => (
            <PlaceCard
              key={selectedCard.id}
              card={selectedCard}
              selectedCards={selectedCards} // Pass the selectedCards array
              handleCardSelection={handleCardSelection} // Pass the selection handler
              isDuplicateSection={true} // Pass a prop to identify if it's in the second section
              handleCardDuplicate={handleCardDuplicate}
              duplicates={duplicates}
            />
          ))}
        </Row>
      </Form.Group>
    
      <CustomButton 
        text="Submit these cards"
      />

    </Form>
    </Container>
)
}

Report.propTypes = {
};

export default React.memo(Report);
