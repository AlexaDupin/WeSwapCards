import React from 'react';
import PageContainer from '../../PageContainer/PageContainer';
import {
	Form,
	Row,
  Alert,
  Spinner
} from "react-bootstrap";
import PlaceCard from './PlaceCard/PlaceCard';
import ScrollToTop from '../../ScrollToTopButton/ScrollToTop';
import './reportStyles.scss';

import useReportLogic from '../hooks/useReportLogic';

function Report() {
  const {
    state,
    name,
    handleSubmit,
    handleSelectPlace,
    handleCardSelection,
    handleSelectAllCards,
    handleCardDuplicate,
    handleSelectAllDuplicates,
  } = useReportLogic(); 

  // Render loading state or content
  if (state.loadingPlaces) {
    return (
    <PageContainer>
      <Spinner
        animation="border"
        className="spinner" /> 
    </PageContainer>
    )
  }

  return (
    <PageContainer>
      <h1 className="page-title">Report my cards</h1>
    
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
    </PageContainer>
  );
}

export default React.memo(Report);
