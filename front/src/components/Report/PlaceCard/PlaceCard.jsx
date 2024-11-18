import React from 'react';
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
    return null;
  }
  const isSelected = selectedCards.some(selectedCard => selectedCard.id === card.id);
  const hasDuplicates = duplicates?.some(duplicate => duplicate.id === card.id);

  // Setting card classname depending on status and section
  let cardClassName = 'report-card'
    if (isDuplicateSection) {
      if (isSelected) {
        cardClassName = 'report-card';
        if (hasDuplicates) {
          cardClassName = 'report-card-selected';
        }
      } else {
        cardClassName = 'report-card report-card-unclickable';
      }
    } else {
      if (isSelected) {
        cardClassName = 'report-card-selected';
      }
    }

  // Setting icon classname to make it unclickable on duplicate section if not selected
  let iconClassName = "report-icon";
  if (isDuplicateSection) {
    if (!isSelected) {
      iconClassName = 'report-icon-unclickable';
    }
  }

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
          onClick={cardAction}
        >
          <SelectedIcon 
            className={iconClassName} 
          />    
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
