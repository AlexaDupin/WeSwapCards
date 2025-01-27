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

import { axiosInstance } from '../../../helpers/axiosInstance';
import { useAuth } from '@clerk/clerk-react';

import PropTypes from 'prop-types';
import ScrollToTop from '../../ScrollToTopButton/ScrollToTop';

import './swapCardStyles.scss';

function SwapCard({
    explorerId, name, setSwapExplorerId, setSwapCardName, swapCardName, setSwapExplorerName, setConversationId
  }) {
    const [places, setPlaces] = useState([]);
    const [cards, setCards] = useState([]);
    const [hidden, setHidden] = useState(true);
    const [hiddenSwapOpportunities, setHiddenSwapOpportunities] = useState(true);
    const [swapOpportunities, setSwapOpportunities] = useState([]);
    const [selectedCardId, setSelectedCardId] = useState();
    const { getToken } = useAuth()
    const navigate = useNavigate();

    console.log('selectedCardId', selectedCardId);

    // Fetch all places to show in dropdown
    const fetchAllPlaces = async () => {
      try {
        const response = await axiosInstance.get(`/places`, {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        });
        setPlaces(response.data.places);
      } catch (error) {
        console.log(error);
      }
    };

    // When a place is selected, fetch all cards in that place
    // + cards and duplicates already logged for this explorer in the db so they are highlighted
    const handleSelectPlace = async (placeId) => {
      try {
        const allCards = await axiosInstance.get(`/cards/${placeId}`, {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        });
        // console.log("allCards", allCards);

        setCards(allCards.data.cards);
        setHidden(false);
        setHiddenSwapOpportunities(true);
        setSwapExplorerId('');
        setConversationId('');

      } catch (error) {
        console.log(error);
      }
    };

    const fetchSearchedCardName = async (cardId) => {
      try {
        const response = await axiosInstance.get(
        `/card/${cardId}`, {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        });

      const cardName = response.data.name;
      console.log("cardName", cardName);
      setSwapCardName(cardName);

    } catch (error) {
      console.log(error);
    }
    }

    const fetchSwapOpportunities = async (cardId) => {
      console.log("FETCH OPP");
      setSelectedCardId(cardId);

      // Fetch card name
      fetchSearchedCardName(cardId);

      try {
          const response = await axiosInstance.get(
          `/opportunities/${explorerId}/card/${cardId}`, {
            headers: {
              Authorization: `Bearer ${await getToken()}`,
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

    const handleContactButton = (swapExplorerId, swapExplorerName) => {
      setSwapExplorerId(swapExplorerId);
      setSwapExplorerName(swapExplorerName);
      navigate('/swap/card/chat');
    }
  
    useEffect(
      () => {
        fetchAllPlaces();
        },
      [],
    );

    console.log("SWAP OPP", swapOpportunities);

  return (
    <Container className="page-container">
    <h1 className="swap-title">Find a card</h1>
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
          {places?.map((place) => (
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
          cards?.map((card) => (
            <PlaceCard
              key={card.id}
              card={card}
              fetchSwapOpportunities={fetchSwapOpportunities} 
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
            <span className='swap-cardName'>{swapCardName}</span></p>

            {swapOpportunities?.map((opportunity) => (
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
              {opportunity.opportunities.length > 0 ? (
                <>
                <span>In exchange, here are the cards you can offer them:</span>
                <br />
                {opportunity.opportunities?.map((exchange) => (
                <button 
                  key={exchange.card.id}
                  className="swap-tag"
                >
                  {exchange.card.name}
                </button>
              ))}
                </>
              ) : (
                <span>You do not have any card they don't already have but you can still contact them.</span>
              )}
            </Card.Text>

            <button 
              className="contact-button"
              onClick={() => handleContactButton(opportunity.explorer_id, opportunity.explorer_name)}
            >
              Contact this user to swap
            </button>

          </Card>
          </Col>
          ))}
          </>
          ) : (
            <>
            <div>No opportunities available for <span className='swap-cardName'>{swapCardName}</span>, try another one!</div>
            <div className="swap-disclaimer"><em>Remember that only users that need cards you have in duplicates will be shown at a later stage. So log all your cards!</em></div>
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