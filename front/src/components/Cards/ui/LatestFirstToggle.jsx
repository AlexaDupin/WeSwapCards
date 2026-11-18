import React from "react";
import PropTypes from "prop-types";
import './cardsStyles.scss';

const OPTIONS = [
  { latest: false, label: "A–Z" },
  { latest: true, label: "Latest" },
];

// "A–Z | Latest" segmented control, matching the mobile app's SegmentedToggle:
// a grey track, and the selected option as a white pill with a blue border.
export default function LatestFirstToggle({ checked, onChange }) {
  return (
    <div className="sort-toggle" role="radiogroup" aria-label="Sort chapters">
      {OPTIONS.map(({ latest, label }) => {
        const active = checked === latest;
        return (
          <button
            key={label}
            type="button"
            role="radio"
            aria-checked={active}
            className={`sort-toggle__option${active ? " sort-toggle__option--active" : ""}`}
            onClick={() => {
              if (!active) onChange(latest);
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

LatestFirstToggle.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};
