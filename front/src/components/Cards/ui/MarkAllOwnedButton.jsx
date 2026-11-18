import React from "react";
import { PlusCircle } from "react-bootstrap-icons";
import PropTypes from "prop-types";
import './cardsStyles.scss';

// Header button before the A–Z / Latest toggle. It opens the "mark all cards as owned"
// confirmation directly: a one-item menu would only add a step. Blue, like
// the active Latest toggle, so it stands out from the grey info icon.
export default function MarkAllOwnedButton({ onClick, disabled = false }) {
  return (
    <button
      type="button"
      className="cards-header-icon mark-all-owned-button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Mark all cards as owned"
      title="Mark all cards as owned"
    >
      <PlusCircle aria-hidden="true" />
    </button>
  );
}

MarkAllOwnedButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
