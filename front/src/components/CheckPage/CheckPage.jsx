import React, { useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Spinner,
    Alert
} from "react-bootstrap";

import { axiosInstance } from '../../helpers/axiosInstance';
import { useAuth } from '@clerk/clerk-react'

import Bulb from '../../images/bulb.svg';

import PropTypes from 'prop-types';

import './checkPageStyles.scss';
import Place from '../CheckPage/Place/Place';
import ScrollToTop from '../ScrollToTopButton/ScrollToTop';
import { initialState, reducer } from '../../reducers/checkReducer';

function CheckPage({
    explorerId, name
  }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { getToken } = useAuth()
    const navigate = useNavigate();

    const fetchExplorerCardsByPlace = async () => {
        try {
          const response = await axiosInstance.get(
            `/explorercards/${explorerId}`, {
              headers: {
                Authorization: `Bearer ${await getToken()}`,
              },
            })
          const fetchedCardsByPlace = response.data;

          dispatch({
            type: 'cards/fetched',
            payload: fetchedCardsByPlace
          })

        } catch (error) {
          dispatch({
            type: 'cards/fetchedError',
          })
          // console.log(error);
        }
    };

    useEffect(
      () => {
        if (!explorerId) {
          navigate('/login/redirect', { state: { from: "/check" } });
        } else {
          fetchExplorerCardsByPlace()
        }
      }, [],
    );

  return (
    <Container className="page-container">
    <h1 className="swap-title">All my cards</h1>

    {state.loading &&
      <><Spinner
          animation="border"
          className="spinner" /><p>Loading your cards...</p></>
    }

    {state.alert.message && (
    <Alert
      variant='danger'
      className={state.alert.hidden ? 'hidden-alert' : ''}>
      {state.alert.message}
    </Alert>
      )}

    {!state.loading && !state.alert.message && (
      <>
        {state.cardsByPlace && state.cardsByPlace.length > 0 ? (
          <>
          <div className="check-tip">
            <p className="check-tip-text"><img src={Bulb} alt="Bulb icon" className="check-tip-image"/>Tap on a number to easily update a card's duplicate status.</p><br />
          </div>
          
          {state.cardsByPlace?.map((place) => (
            <Place
              key={place.place_name}
              place={place}
              explorerId={explorerId}
              dispatch={dispatch}
              progressClassNames={state.progressClassNames}
            />
            ))
          }</>)  
           : (
              <div>You don't have any logged cards for the moment, {name}.</div>
        )}
      </>
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
