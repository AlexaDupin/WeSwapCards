import React from 'react';
import {Icon1Square, Icon2Square, Icon3Square,Icon4Square,
    Icon5Square,Icon6Square,Icon7Square,Icon8Square,Icon9Square} from "react-bootstrap-icons";

import PropTypes from 'prop-types';

import './cardPreviewStyles.scss';

function CardPreview({
    card,
    handleDuplicateStatus
}) {
  // Conditionally apply the className based on the duplicate status
  const className = card.duplicate ? "card-square-duplicate" : "card-square";

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
    <div 
      className="placeCards-container d-inline-flex"
    >
        <SelectedIcon 
          className={className}
          cardId={card.id}
          duplicate={card.duplicate}
          onClick={() => handleDuplicateStatus(card.id, card.duplicate)}
          style={{ cursor: 'pointer' }}
        />    
    </div>
    )
}

CardPreview.propTypes = {

};

// PlaceCard.defaultProps = {
//   card: { id: 0, name: 'Default Card', number: 0, place_id: 0 },  // Default card data
//   selectedCards: [],  // Default empty array for selectedCards
// };

export default React.memo(CardPreview);
