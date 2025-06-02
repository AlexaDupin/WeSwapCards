import React from 'react';
import PageContainer from '../../PageContainer/PageContainer';
import {
    Spinner,
    Alert
} from "react-bootstrap";
import Bulb from '../../../images/bulb.svg';
import './checkPageStyles.scss';
import Place from '../ui/Place/Place';
import ScrollToTop from '../../ScrollToTopButton/ScrollToTop';

import useCheckLogic from '../hooks/useCheckLogic';

function CheckPage() {
  const { state, name, explorerId, dispatch } = useCheckLogic(); 

  return (
    <PageContainer>
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
    </PageContainer>
  )
}

export default React.memo(CheckPage);
