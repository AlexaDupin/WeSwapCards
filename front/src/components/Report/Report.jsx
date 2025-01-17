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
import PlaceCard from './PlaceCard/PlaceCard';
import ScrollToTop from '../ScrollToTopButton/ScrollToTop';

function Report({
  explorerId, name, token
}) {
  const [places, setPlaces] = useState([]);
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  const [toBeDeleted, setToBeDeleted] = useState([]);

  // Showing sections at a time
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
      setHidden(false);

 
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
      setHiddenDuplicates(true)
    }
  };

  // Add card to selected cards if not in it
  const handleCardSelection = (card) => {
    console.log("handleCardSelection", card);

    setSelectedCards((prevSelectedCards) => {
      // Check if the card is already selected (by matching the id)
      const isCardSelected = prevSelectedCards.some(alreadySelectedCard => alreadySelectedCard.id === card.id);

      if (isCardSelected) {
        // If already selected, remove the card from the array (deselect)
        console.log("TO REMOVE IN DATABASE")
        setToBeDeleted((prevToBeDeleted) => { 
          return [...prevToBeDeleted, card]
        });
        return prevSelectedCards.filter(alreadySelectedCard => alreadySelectedCard.id !== card.id);
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

  console.log("selectedCards", selectedCards);
  console.log("duplicates", duplicates);
  console.log("toBeDeleted", toBeDeleted);

  // On submit, log selected cards and duplicate selection into db
  const handleSubmit = async (event) => {
      event.preventDefault();
      // Extracting ids of selected cards and duplicates
      const selectedCardsIds = selectedCards.map(item => item.id);
      const duplicatesIds = duplicates.map(item => item.id);
      const toBeDeletedIds = toBeDeleted.map(item => item.id);

      // Combine the data to send
      const payload = {
        selectedCardsIds,
        duplicatesIds,
        toBeDeletedIds     
      };
      console.log('SUBMIT payload', payload);

      try {
        const response = await axios.post(
          `${baseUrl}/report/${explorerId}`,
          payload
        , {
          headers: {
            authorization: token,
          },
        });
        console.log("RESPONSE", response);

        if (response.status === 201) {
          setVariant("success");
          setMessage("Your cards have been logged!");
          setHiddenAlert(false);
          setHidden(true);
          setHiddenDuplicates(true);
        } else {
          setVariant("danger");
          setMessage("Oops, there was an issue and your cards haven't been logged");
          setHiddenAlert(false);
          setHidden(true);
          setHiddenDuplicates(true);
          console.error("Failed to submit cards");
        }

      } catch (error) {
        setVariant("danger");
        setMessage("Oops, there was an issue and your cards haven't been logged");
        setHiddenAlert(false);
        setHidden(true);
        setHiddenDuplicates(true);
        console.log(error.data);
    }
  };

  useEffect(
    () => {
      fetchAllPlaces();
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
    <Container className="page-container">
    <h1 className="swap-title">Report my cards</h1>

    <Form onSubmit={handleSubmit}>
              
      <Form.Group className="mb-5" controlId="formGroupPlace">
        <Form.Label className="report-label">Select a chapter, {name}</Form.Label>
        <Form.Select 
          aria-label="Select a place" 
          onChange={(e) => {
            const selectedValue = e.target.value;
            if (selectedValue !== "") {
              handleSelectPlace(selectedValue);
            }
          }}
        >
          <option value="">Select</option>
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
        <Form.Label className="report-label">
          Click on the cards you have
        </Form.Label>

        <button 
          className={hidden ? 'hidden' : 'selectall-button mb-3'}
          onClick={handleSelectAllCards}
        >
          Select all
        </button>

        <Row className="g-3">
        {cards && cards.length > 0 ? (
          cards.map((card) => (
            <PlaceCard
              key={card.id}
              card={card}
              selectedCards={selectedCards} 
              handleCardSelection={handleCardSelection} 
            />
            ))
            ) : (
              <div>No cards available</div> 
        )}
        </Row>
      </Form.Group>

      <Form.Group 
        className={hiddenDuplicates ? 'hidden' : 'mb-5'}  
        controlId="formGroupEmail">
        <Form.Label className="report-label">
          Click on the cards you have duplicates for (2 or more)
        </Form.Label>
        
        <button 
          className={hidden ? 'hidden' : 'selectall-button mb-3'}
          onClick={handleSelectAllDuplicates}
        >
          Select all
        </button>

        <Row className="d-flex g-3">
        {cards && cards.length > 0 ? (
          cards.map((duplicateCard) => (            
          <PlaceCard
              key={duplicateCard.id}
              card={duplicateCard}
              selectedCards={selectedCards} 
              handleCardSelection={handleCardSelection}
              isDuplicateSection={true} 
              handleCardDuplicate={handleCardDuplicate}
              duplicates={duplicates}
            />
          ))
          ) : (
            <div>No duplicates available</div> 
        )}
        </Row>
      </Form.Group>
    
      <button 
        className={hidden ? 'hidden' : 'custom-button' && hiddenDuplicates ? 'hidden' : 'custom-button'}>
        Submit these cards
      </button>

    </Form>
    <ScrollToTop />

    </Container>
)
}

Report.propTypes = {
  explorerId: PropTypes.number.isRequired,
  name: PropTypes.string,
};

export default React.memo(Report);
