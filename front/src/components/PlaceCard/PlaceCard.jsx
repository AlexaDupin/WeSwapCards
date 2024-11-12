import React, { useState, useEffect } from 'react';
import {
	Card,
	Col,
} from "react-bootstrap";

import {Icon1Square, Icon2Square, Icon3Square,Icon4Square,
  Icon5Square,Icon6Square,Icon7Square,Icon8Square,Icon9Square} from "react-bootstrap-icons";

import PropTypes from 'prop-types';

import './placeCardStyles.scss';

function PlaceCard({
  card,
  selectedCards, 
  handleCardSelection,
  isDuplicateSection,
  handleCardDuplicate,
  duplicates
}) {
  if (!card) {
    console.error('Missing card or selectedCards');
    return null;  // Return null or some fallback UI
  }

  const isSelected = selectedCards.some(selectedCard => selectedCard.id === card.id);
  const hasDuplicates = duplicates?.some(duplicate => duplicate.id === card.id);

  const cardClassName = isDuplicateSection 
    ? isSelected && hasDuplicates ? 'report-card-selected' : 'report-card' // In the second section, toggling between classes
    : isSelected ? 'report-card-selected' : 'report-card'; // Same logic for the first section

  const cardAction = isDuplicateSection 
    ? () => handleCardDuplicate(card) // In the second section, 
    : () => handleCardSelection(card); // Same logic for the first section

  // Setting icon based on number of the card
  const iconMap = {
    1: Icon1Square,
    2: Icon2Square,
    3: Icon3Square,
    4: Icon4Square,
    5: Icon5Square,
    6: Icon6Square,
    7: Icon7Square,
    8: Icon8Square,
    9: Icon9Square,
  };

  const SelectedIcon = iconMap[card.number] || Icon1Square;

  return (
    
        <Col xs={4} key={card.id}>
        <Card
          className={cardClassName}
          id={card.id}
          style={{ cursor: 'pointer' }}
          onClick={cardAction}
        >
          <SelectedIcon className="report-icon"/>    
          <Card.Title className="report-icon-title">{card.name}</Card.Title>
        </Card>
        </Col>
)
}

PlaceCard.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    number: PropTypes.number.isRequired,
    place_id: PropTypes.number.isRequired
  }),  
  selectedCards: PropTypes.array,
  handleCardSelection: PropTypes.func,
  duplicates: PropTypes.array,
};

// PlaceCard.defaultProps = {
//   card: { id: 0, name: 'Default Card', number: 0, place_id: 0 },  // Default card data
//   selectedCards: [],  // Default empty array for selectedCards
// };

export default React.memo(PlaceCard);
