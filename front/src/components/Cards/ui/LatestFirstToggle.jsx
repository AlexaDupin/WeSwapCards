import React from "react";
import PropTypes from "prop-types";

export default function LatestFirstToggle({ checked, onChange }) {
  return (
    <button
      type="button"
      className={`btn btn-sm rounded-pill ${checked ? "btn-primary" : "btn-outline-primary"}`}
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      aria-label="Toggle latest-first sorting"
    >
      {checked ? "Latest first" : "Sort By Latest"}
    </button>
  );
}

LatestFirstToggle.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};
