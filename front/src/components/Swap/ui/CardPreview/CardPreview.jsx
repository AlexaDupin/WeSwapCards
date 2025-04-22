import React from 'react';
import {Icon1Square, Icon2Square, Icon3Square,Icon4Square,
    Icon5Square,Icon6Square,Icon7Square,Icon8Square,Icon9Square} from "react-bootstrap-icons";

import './cardPreviewStyles.scss';

function CardPreview({
    card,
    fetchSwapOpportunities,
    isSelected
}) {
  if (!card) {
    // console.error('Missing card or selectedCards');
    return null;
  }

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
    
  const handleClick = () => {
    fetchSwapOpportunities(card.id);
  };

  return (
    <div 
      className={isSelected ? "card-square-selected" : ""}
    >
        <SelectedIcon 
          className={"card-square"}
          cardid={card.id}
          onClick={handleClick}
          style={{ cursor: 'pointer' }}
        />    
    </div>
    )
}

export default React.memo(CardPreview);
