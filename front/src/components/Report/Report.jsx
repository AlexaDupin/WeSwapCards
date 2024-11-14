import React, { useState, useEffect } from 'react';
import {
	Form,
	Row,
  Container,
  Alert
} from "react-bootstrap";

import axios from 'axios';

import PropTypes from 'prop-types';

import './reportStyles.scss';
import PlaceCard from '../PlaceCard/PlaceCard';

function Report({
  explorerId, name
}) {
  const [places, setPlaces] = useState([]);
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  const [hidden, setHidden] = useState(true);
  const [hiddenDuplicates, setHiddenDuplicates] = useState(true);

  // Alert states
  const [hiddenAlert, setHiddenAlert] = useState(true);
  const [variant, setVariant] = useState('success');
  const [message, setMessage] = useState('');

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
  const handleSelectPlace = async (placeId) => {
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

  const showDuplicateSection = () => {
    if (selectedCards.length > 0) {
      setHidden(false)
      setHiddenAlert(true);
      setHiddenDuplicates(false);
    } else {
      console.log("NO SELECTED CARDS!!!!!");
      setHiddenDuplicates(true)
    }
  }

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

  // console.log("placeId", placeId);
  // console.log("cards", cards);  
  console.log("selectedCards", selectedCards);
  console.log("duplicates", duplicates);

  // On submit, send selected cards and duplicate selection to db
  const handleSubmit = async (event) => {
      event.preventDefault();
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
          `${baseUrl}/report/${explorerId}`,
          payload,
        )
        console.log("RESPONSE", response);

        if (response.status === 201) {
          setVariant("success");
          setMessage("Your cards have been logged!");
          setHiddenAlert(false);
          setHidden(true);
        } else {
          setVariant("danger");
          setMessage("Oops, there was an issue and your cards haven't been logged");
          setHiddenAlert(false);
          setHidden(true);
          console.error("Failed to submit cards");
        }

      } catch (error) {
        setVariant("danger");
        setMessage("Oops, there was an issue and your cards haven't been logged");
        setHiddenAlert(false);
        setHidden(true);
        console.log(error.data);
    }
  };

  useEffect(
    () => {
      fetchAllPlaces();
      showDuplicateSection();
      },
    [],
  );

  useEffect(
    () => {
      showDuplicateSection();
      },
    [selectedCards],
  );



  return (
    <Container className="report">
    <Form onSubmit={handleSubmit}>
              
      <Form.Group className="mb-5" controlId="formGroupPlace">
        <Form.Label className="report-label">Select a place, {name}</Form.Label>
        <Form.Select 
          aria-label="Select a place" 
          onChange={(e) => {
            handleSelectPlace(e.target.value)
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

      <Alert 
      variant={variant}
      className={hiddenAlert ? 'hidden-alert' : ''}>
        {message}      
      </Alert>

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
        className={hiddenDuplicates ? 'hidden' : 'mb-5'}  
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
        className={hidden ? 'hidden' : 'custom-button' && hiddenDuplicates ? 'hidden' : 'custom-button'}>
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
