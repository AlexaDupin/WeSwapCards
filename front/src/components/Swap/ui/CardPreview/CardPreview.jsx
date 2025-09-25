import React from 'react';
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
    
  const handleClick = () => {
    fetchSwapOpportunities(card.id);
  };

  return (
    <button 
      type="button"
      className={isSelected ? "swap-card-square-selected" : "swap-card-square"}
      cardid={card.id}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      {card.number}
    </button>
    )
}

export default React.memo(CardPreview);
