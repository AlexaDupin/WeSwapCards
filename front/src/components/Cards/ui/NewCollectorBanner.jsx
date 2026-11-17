import React from "react";
import { Alert, Button } from "react-bootstrap";
import PropTypes from "prop-types";

// Shown while a signed-in explorer has not logged any card yet, so new users
// can start from a full collection instead of tapping every card.
export default function NewCollectorBanner({ onMarkAllCardsOwned, disabled = false }) {
  return (
    <Alert variant="info" className="mb-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
      <span>
        New here? Mark all cards as owned, then remove the ones you’re missing
        and tap your duplicates again to mark them.
      </span>
      <Button
        variant="primary"
        size="sm"
        onClick={onMarkAllCardsOwned}
        disabled={disabled}
      >
        Mark all as owned
      </Button>
    </Alert>
  );
}

NewCollectorBanner.propTypes = {
  onMarkAllCardsOwned: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
