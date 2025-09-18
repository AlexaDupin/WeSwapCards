import React from "react";
import './cardsStyles.scss';

export default function EmptyChaptersHint({ onClearFilter }) {
  return (
    <div className="empty-chapters text-center py-4">
      <p className="mb-3">No chapters have missing cards.</p>
      <button
        type="button"
        className="link-button"
        onClick={onClearFilter}
      >
        Show all chapters
      </button>
    </div>
  );
}
