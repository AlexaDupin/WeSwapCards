import React, { useState, useEffect } from 'react';
import {
    Form,
	  Row,
    Container,
    Card,
    Col
} from "react-bootstrap";
import {Lock} from "react-bootstrap-icons";
import { useNavigate } from 'react-router-dom';

import PlaceCard from './PlaceCard/PlaceCard';

import axios from 'axios';

import PropTypes from 'prop-types';
import ScrollToTop from '../../ScrollToTopButton/ScrollToTop';

import './swapCardStyles.scss';

function SwapCard({
    explorerId, name, token
  }) {
    const [places, setPlaces] = useState([]);
    const [cards, setCards] = useState([]);
    const [hidden, setHidden] = useState(true);
    const [hiddenSwapOpportunities, setHiddenSwapOpportunities] = useState(true);
    const [swapOpportunities, setSwapOpportunities] = useState([]);
    const [selectedCardId, setSelectedCardId] = useState();
    const [selectedCardName, setSelectedCardName] = useState();

    console.log(selectedCardId);

    const baseUrl = process.env.REACT_APP_BASE_URL;
    const navigate = useNavigate();

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
        const allCards = await axios.get(`${baseUrl}/cards/${placeId}`);
        // console.log("allCards", allCards);

        setCards(allCards.data.cards);
        setHidden(false);
        setHiddenSwapOpportunities(true);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSearchedCardName = async (cardId) => {
      try {
        const response = await axios.get(
        `${baseUrl}/card/${cardId}`
        , {
          headers: {
            authorization: token,
          },
        });

      const cardName = response.data.name;
      console.log("cardName", cardName);
      setSelectedCardName(cardName);

    } catch (error) {
      console.log(error);
    }
    }

    const fetchOpportunity = async (cardId) => {
      console.log("FETCH OPP");
      setSelectedCardId(cardId);

      // Fetch card name
      fetchSearchedCardName(cardId);

      try {
          const response = await axios.get(
          `${baseUrl}/opportunities/${explorerId}/card/${cardId}`
          , {
            headers: {
              authorization: token,
            },
          });

        const swapOpportunities = response.data;
        console.log("swapOpportunities", swapOpportunities);
        setSwapOpportunities(swapOpportunities);
        setHidden(true);
        setHiddenSwapOpportunities(false);

      } catch (error) {
        console.log(error);
      }
    };

    const handleContactButton = () => {
      navigate('/swap/card/chat')
    }
  
    useEffect(
      () => {
        fetchAllPlaces();
        },
      [],
    );

    console.log("SWAP OPP", swapOpportunities);

  return (
    <Container className="opportunities">

      <Form>
              
      <Form.Group className="mb-5" controlId="formGroupPlace">
        <Form.Label className="report-label">Select a chapter, {name}</Form.Label>
        <Form.Select 
          aria-label="Select a chapter" 
          onChange={(e) => {
            const selectedValue = e.target.value;
            console.log(selectedValue);

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

      <Form.Group 
        className={hidden ? 'hidden' : 'mb-5'} 
        controlId="formGroupEmail">
        <Form.Label className="report-label">
          Click on the card you are looking for!
        </Form.Label>

        <Row className="g-3">
        {cards && cards.length > 0 ? (
          cards.map((card) => (
            <PlaceCard
              key={card.id}
              card={card}
              fetchOpportunity={fetchOpportunity} 
            />
            ))
            ) : (
              <div>No cards available</div> 
        )}
        </Row>
      </Form.Group>
      </Form>

      <div 
        className={hiddenSwapOpportunities ? 'hidden' : ''}
      >        

        <Row className="g-3">
          {swapOpportunities && swapOpportunities.length > 0 ? (
            <>
            <p>Here are the users that can give you this card: <br /><br />
            <span className='swap-cardName'>{selectedCardName}</span></p>

            {swapOpportunities.map((opportunity) => (
          <Col xs={12} 
            key={opportunity.explorer_id}
            className="column"
          >
          <Card
            className="opportunity-card"
            id={opportunity.explorer_id}
          >
            <Card.Title 
              className="opportunity-title"
            >
              {opportunity.explorer_name}
            </Card.Title>
            <Card.Text
              className="opportunity-text"
            >
              In exchange, here are the cards you can offer them: <br />
              {opportunity.opportunities.map((exchange) => (
                <button 
                  key={exchange.card.id}
                  className="swap-tag"
                >
                  {exchange.card.name}
                </button>
              ))}
            </Card.Text>

            <button 
              className="contact-button"
              onClick={handleContactButton}
            >
              Contact this user to swap
            </button>

          </Card>
          </Col>
          ))}
          </>
          ) : (
            <>
            <div>No opportunities available for <span className='swap-cardName'>{selectedCardName}</span>, try another one!</div>
            <Lock className='lock-icon'/>
            </>
          )}
        </Row>
      </div>        
      
      <ScrollToTop />
      
    </Container>
)
}

SwapCard.propTypes = {
  explorerId: PropTypes.number.isRequired,
  name: PropTypes.string,
};

export default React.memo(SwapCard);