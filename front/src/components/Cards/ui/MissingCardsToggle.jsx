import React from "react";
import PropTypes from "prop-types";

export default function MissingCardsToggle({ checked, onChange }) {
  return (
    <button
      type="button"
      className={`btn btn-sm rounded-pill ${checked ? "btn-primary" : "btn-outline-primary"}`}
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      aria-label="Toggle missing cards filter"
    >
      {checked ? "Showing Missing Only" : "Missing cards"}
    </button>
  );
}

MissingCardsToggle.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};
