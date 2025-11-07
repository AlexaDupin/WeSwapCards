import React from 'react';

import './cardItemStyles.scss';
import useLongPress from "../../hooks/useLongPress";

function CardItem({ item, status, onSelect, onReset, readOnly = false }) {
    const isOwned = status === 'owned';
    const isDuplicated = status === 'duplicated';
    const isDefault = status === "default";
  
    const { onPointerDown, onPointerUp, onPointerLeave, onPointerCancel, wasLongPressRef } =
    useLongPress(() => {
        if (!readOnly && !isDefault) onReset();
    }, { threshold: 450 });

    const handleClick = () => {
      if (!readOnly && wasLongPressRef.current) return;
      onSelect();
    };

    const stop = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleReset = (e) => {
      if (readOnly) return;
      stop(e);
      if (!isDefault) onReset();
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
            style={{ cursor: "pointer", position: "relative" }} 
            aria-label={`Card ${item.number} (${status}) ${readOnly ? ' — sign in to log' : ''}`}
        >
            <div className="card-item-inner">{item.number}</div>

            {!readOnly && !isDefault && (
            <span
              className="card-item-reset"
              role="button"
              aria-label={`Mark card ${item.number} as not owned`}
              title="Mark as not owned"
              onClick={handleReset}
              onPointerDown={stop}
              onPointerUp={stop}
              onContextMenu={(e) => e.preventDefault()}
            />
            )}
        </button>
    );
}

export default React.memo(CardItem);
