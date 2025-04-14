import React, { useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';

import {
	Form,
	Row,
  Container,
  Alert,
  Spinner
} from "react-bootstrap";
import { axiosInstance } from '../../helpers/axiosInstance';
import { useAuth } from '@clerk/clerk-react';

import PlaceCard from './PlaceCard/PlaceCard';
import ScrollToTop from '../ScrollToTopButton/ScrollToTop';

import PropTypes from 'prop-types';

import './reportStyles.scss';
import { initialState, reducer } from '../../reducers/reportReducer';

function Report({
  explorerId, name
}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { getToken } = useAuth()
  const navigate = useNavigate();

  // Fetch all places to show in dropdown
  const fetchAllPlaces = async () => {

    try {
      const placesFetched = await axiosInstance.get(`/places`, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      dispatch({
        type: 'places/fetched',
        payload: placesFetched.data.places
      })
    } catch (error) {
      // console.log(error);
      dispatch({
        type: 'places/error',
      })
    }
  };

  // When a place is selected, fetch all cards in that place
  // + cards and duplicates already logged for this explorer in the db so they are highlighted
  const handleSelectPlace = async (placeId) => {

    try {
      const [allCards, explorerCards, explorerDuplicates] = await Promise.all([
        axiosInstance.get(`/cards/${placeId}`, {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }),
        axiosInstance.get(`/cards/${placeId}/${explorerId}`, {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }),
        axiosInstance.get(`/cards/${placeId}/${explorerId}/duplicates`, {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        })
      ]);

      dispatch({
        type: 'place/selected',
        payload: {
          cards: allCards.data.cards,
          selectedCards: explorerCards.data.cards,
          duplicates: explorerDuplicates.data.cards
        }
      })

    } catch (error) {
      dispatch({
        type: 'places/error',
      })
    }
  };

  const showDuplicateSection = () => {
    if (state.selectedCards.length > 0) {
      dispatch({
        type: 'duplicates/show',
      })
    } else {
      dispatch({
        type: 'duplicates/notshow',
      })
    }
  };

  // Add card to selected cards if not in it
  const handleCardSelection = (card) => {
    dispatch({
      type: 'cards/selected',
      payload: card,
    })
  };

  // Handle Select All in cards section
  const handleSelectAllCards = (event) => {
    event.preventDefault();
    dispatch({
      type: 'cards/selectedAll',
      payload: state.cards,
    })
  };

  // Add card to duplicate selection array if not in it
  const handleCardDuplicate = (card) => {
    dispatch({
      type: 'cards/duplicates',
      payload: card,
    })
  };

  // Handle Select All in duplicates section
  const handleSelectAllDuplicates = (event) => {
    event.preventDefault();
    dispatch({
      type: 'duplicates/selectedAll',
      payload: state.cards,
    })
  };

  // On submit, log selected cards and duplicate selection into db
  const handleSubmit = async (event) => {

      event.preventDefault();
      // Extracting ids of selected cards and duplicates
      const selectedCardsIds = state.selectedCards.map(item => item.id);
      const duplicatesIds = state.duplicates.map(item => item.id);
      const toBeDeletedIds = state.toBeDeleted.map(item => item.id);

      // Combine the data to send
      const payload = {
        selectedCardsIds,
        duplicatesIds,
        toBeDeletedIds
      };

      const maxRetries = 3;
      const delayBetweenRetries = 1000;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const token = await getToken();
              if (!token) {
                  // console.error("Token is not available!");
                  return;
              }

            const response = await axiosInstance.post(
                `/report/${explorerId}`,
                payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

          if (response.status === 201) {
            dispatch({
              type: 'cards/reported',
            })
            return;
          } else {
            dispatch({
              type: 'cards/notReported',
            })
            return;
          }

        } catch (error) {
          // console.error(`Attempt ${attempt} to log cards:`, error);
          if (attempt < maxRetries) {
            // console.log(`Retrying in ${delayBetweenRetries / 1000} seconds...`);
            await new Promise((resolve) => setTimeout(resolve, delayBetweenRetries));
          } else {
            dispatch({
              type: 'cards/notReported',
            })
          return;
          }
        }
      }
  };

  useEffect(
    () => { 
      if (!explorerId) {
        navigate('/login/redirect', { state: { from: "/report" } });
      } else {
        fetchAllPlaces();
      }
    }, [],
  );

  useEffect(
    () => {
      showDuplicateSection();
      },
    [state.selectedCards],
  );

  // Render loading state or content
  if (state.loadingPlaces) {
    return <Container className="page-container">
      <Spinner
        animation="border"
        className="spinner" /> 
    </Container>
  }

  return (
    <Container className="page-container">
    <h1 className="swap-title">Report my cards</h1>

    {state.alert.message && (
    <Alert
      variant={state.alert.variant}
      className={state.alert.hidden ? 'hidden-alert' : ''}>
        {state.alert.message}
      </Alert>
    )}

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
          {state.places?.map((place) => (
            <option
              key={place.id}
              value={place.id}>
              {place.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group
        className={state.hidden ? 'hidden' : 'mb-5'}
        controlId="formGroupEmail">
        <Form.Label className="report-label">
          Click on the cards you have
        </Form.Label>

        <button
          className={state.hidden ? 'hidden' : 'selectall-button mb-3'}
          onClick={handleSelectAllCards}
        >
          Select all
        </button>

        <Row className="g-3">
        {state.cards && state.cards.length > 0 ? (
          state.cards?.map((card) => (
            <PlaceCard
              key={card.id}
              card={card}
              selectedCards={state.selectedCards}
              handleCardSelection={handleCardSelection}
            />
            ))
            ) : (
              <div>No cards available</div>
        )}
        </Row>
      </Form.Group>

      <Form.Group
        className={state.hiddenDuplicates ? 'hidden' : 'mb-5'}
        controlId="formGroupEmail">
        <Form.Label className="report-label">
          Click on the cards for which you have duplicates
        </Form.Label>

        <button
          className={state.hidden ? 'hidden' : 'selectall-button mb-3'}
          onClick={handleSelectAllDuplicates}
        >
          Select all
        </button>

        <Row className="d-flex g-3">
        {state.cards && state.cards.length > 0 ? (
          state.cards.map((duplicateCard) => (
          <PlaceCard
              key={duplicateCard.id}
              card={duplicateCard}
              selectedCards={state.selectedCards}
              handleCardSelection={handleCardSelection}
              isDuplicateSection={true}
              handleCardDuplicate={handleCardDuplicate}
              duplicates={state.duplicates}
            />
          ))
          ) : (
            <div>No duplicates available</div>
        )}
        </Row>
      </Form.Group>

      <button
        className={state.hidden ? 'hidden' : 'custom-button' && state.hiddenDuplicates ? 'hidden' : 'custom-button'}>
        Submit these cards
      </button>

    </Form>

    <ScrollToTop />
    </Container>
  );
}

Report.propTypes = {
  explorerId: PropTypes.number.isRequired,
  name: PropTypes.string,
};

export default React.memo(Report);
