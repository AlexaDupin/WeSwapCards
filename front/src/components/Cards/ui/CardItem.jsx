import React from 'react';

import './cardItemStyles.scss';

function CardItem({ item, status, onSelect, reset }) {
    const isOwned = status === 'owned';
    const isDuplicated = status === 'duplicated';
  
    return (
        <button 
            type="button"
            className={`card-item ${isOwned ? "card-item-owned" : ""} ${isDuplicated ? "card-item-duplicate" : ""}`}
            cardid={item.id}
            // duplicate={isDuplicated.toString()}
            onClick={onSelect}
            style={{ cursor: 'pointer' }}
        >
            <div className="card-item-inner">{item.number}</div>
        </button>
    );
}

export default React.memo(CardItem);
