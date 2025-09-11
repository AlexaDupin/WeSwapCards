import React, {useState} from 'react';

import './cardPreviewStyles.scss';

function CardPreview({
    card,
    duplicate,
    handleDuplicateStatus,
}) {
  const [hasDuplicate, setHasDuplicate] = useState(duplicate);

  const handleClick = () => {
    // Toggle the local state for duplicate
    const newDuplicateStatus = !hasDuplicate;
    setHasDuplicate(newDuplicateStatus);
    
    // Notify the parent about the change
    handleDuplicateStatus(card.id, newDuplicateStatus);
  };

  return (
    <button 
      type="button"
      className={hasDuplicate ? "check-card-square-duplicate" : "check-card-square"}
      cardid={card.id}
      duplicate={hasDuplicate.toString()}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
    {card.number}
    </button>
  )
}

export default React.memo(CardPreview);
