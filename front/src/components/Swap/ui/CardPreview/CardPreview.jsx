import React from 'react';
import { LockFill } from 'react-bootstrap-icons';
import './cardPreviewStyles.scss';

function CardPreview({
    card,
    fetchSwapOpportunities,
    isSelected,
    isMissing = false
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
      aria-label={isMissing ? `${card.number}, missing` : undefined}
    >
      {isMissing && (
        <LockFill
          className="swap-card-lock"
          data-testid={`card-lock-${card.id}`}
          aria-hidden="true"
        />
      )}
      {card.number}
    </button>
    )
}

export default React.memo(CardPreview);
