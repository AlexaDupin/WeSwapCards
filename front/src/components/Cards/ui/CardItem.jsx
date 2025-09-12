import React from 'react';

import './cardItemStyles.scss';
import useLongPress from "../hooks/useLongPress";

function CardItem({ item, status, onSelect, onReset }) {
    const isOwned = status === 'owned';
    const isDuplicated = status === 'duplicated';
    const isDefault = status === "default";
  
    const { onPointerDown, onPointerUp, onPointerLeave, onPointerCancel, wasLongPressRef } =
    useLongPress(() => {
        if (!isDefault) onReset();
    }, { threshold: 450 });

    const handleClick = (e) => {
      if (wasLongPressRef.current) return;
      onSelect();
    };

    return (
        <button 
            type="button"
            className={`card-item ${isOwned ? "card-item-owned" : ""} ${isDuplicated ? "card-item-duplicate" : ""}`}
            cardid={item.id}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerLeave}
            onPointerCancel={onPointerCancel}
            onClick={handleClick}
            onContextMenu={(e) => e.preventDefault()}
            style={{ cursor: "pointer" }}
            aria-label={`Card ${item.number} (${status})`}
        >
            <div className="card-item-inner">{item.number}</div>
        </button>
    );
}

export default React.memo(CardItem);
