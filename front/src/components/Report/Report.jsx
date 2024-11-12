import React, { useState, useEffect } from 'react';
import {
	Form,
	Row,
  Container
} from "react-bootstrap";

import axios from 'axios';

import PropTypes from 'prop-types';

import './reportStyles.scss';
import PlaceCard from '../PlaceCard/PlaceCard';

function Report({
  explorerId, name
}) {
  const [places, setPlaces] = useState([]);
  const [placeId, setPlaceId] = useState();
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  const [hidden, setHidden] = useState(true);

  const baseUrl = process.env.REACT_APP_BASE_URL;

  // Fetch all places to show in dropdown
  const fetchAllPlaces = async () => {
    try {
      const response = await axios.get(`${baseUrl}/places`);
      setPlaces(response.data.places);
    } catch (error) {
      console.log(error);
    }
  };

  // When a place is selected, fetch all cards in that place
  // + cards and duplicates already logged for this explorer in the db so they are highlighted
  const handleSelectPlace = async () => {
    try {
      const [allCards, explorerCards, explorerDuplicates] = await Promise.all([
        axios.get(`${baseUrl}/cards/${placeId}`), 
        axios.get(`${baseUrl}/cards/${placeId}/${explorerId}`),
        axios.get(`${baseUrl}/cards/${placeId}/${explorerId}/duplicates`),
      ]);
      // console.log("allCards", allCards);
      // console.log('explorerCards', explorerCards);
      // console.log('explorerDuplicates', explorerDuplicates);

      setCards(allCards.data.cards);
      setSelectedCards(explorerCards.data.cards);
      setDuplicates(explorerDuplicates.data.cards);

    } catch (error) {
      console.log(error);
    }
  };

  // Add card to selected cards if not in it
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

  // Handle Select All in cards section
  const handleSelectAllCards = (event) => {
    event.preventDefault();
    setSelectedCards(cards)
  };

  // Sort selected cards so that they can show in proper order in duplicate section
  const sortedCards = selectedCards.slice().sort((a, b) => a.id - b.id);

  // Add card to duplicate selection array if not in it
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

  // Handle Select All in duplicates section
  const handleSelectAllDuplicates = (event) => {
    event.preventDefault();
    setDuplicates(cards)
  };

  console.log("placeId", placeId);
  console.log("cards", cards);  
  console.log("selectedCards", selectedCards);
  console.log("duplicates", duplicates);

  // On submit, send selected cards and duplicate selection to db
  const handleSubmit = async () => {
      // Extracting ids of selected cards and duplicates
      const selectedCardsIds = selectedCards.map(item => item.id);
      const duplicatesIds = duplicates.map(item => item.id);
      console.log('LOGGING selectedCardsIds', selectedCardsIds);
      // Combine the data to send
      const payload = {
        selectedCardsIds,
        duplicatesIds,     
      };

      try {
        const response = await axios.post(
          `${baseUrl}/declare/${explorerId}`,
          payload,
        )
        console.log(response.data);

      } catch (error) {
        console.log(error.data);
    }
  };

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
    <Form onSubmit={handleSubmit}>
              
      <Form.Group className="mb-5" controlId="formGroupPlace">
        <Form.Label className="report-label">Select a place, {name}</Form.Label>
        <Form.Select 
          aria-label="Select a place" 
          onChange={(e) => {
            setPlaceId(e.target.value)
            setHidden(false)
          }}
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

      <Form.Group 
        className={hidden ? 'hidden' : 'mb-5'} 
        controlId="formGroupEmail">
        <Form.Label className="report-label">Click on the cards you have</Form.Label>

        <button 
          className={hidden ? 'hidden' : 'selectall-button mb-3'}
          onClick={handleSelectAllCards}
        >
          Select all
        </button>

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

      <Form.Group 
        className={hidden ? 'hidden' : 'mb-5'}  
        controlId="formGroupEmail">
        <Form.Label className="report-label">Click on the cards you have duplicates for (2 or more)</Form.Label>
        
        <button 
          className={hidden ? 'hidden' : 'selectall-button mb-3'}
          onClick={handleSelectAllDuplicates}
        >
          Select all
        </button>

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
    
      <button 
        className={hidden ? 'hidden' : 'custom-button'}>
        Submit these cards
      </button>

    </Form>
    </Container>
)
}

Report.propTypes = {
  explorerId: PropTypes.number.isRequired,
  name: PropTypes.string,
};

export default React.memo(Report);
