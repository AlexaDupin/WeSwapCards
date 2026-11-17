import React from "react";
import { Dropdown } from "react-bootstrap";
import { ThreeDotsVertical } from "react-bootstrap-icons";
import PropTypes from "prop-types";
import './cardsStyles.scss';

// Page-level actions for My cards, next to the filter toggles.
export default function CardsPageMenu({ onMarkAllCardsOwned, disabled = false }) {
  return (
    <Dropdown align="end" className="cards-page-menu">
      <Dropdown.Toggle
        as="button"
        className="btn p-0 border-0 bg-transparent"
        aria-label="Collection actions"
        style={{ lineHeight: 0, width: 32, height: 32 }}
        disabled={disabled}
      >
        <ThreeDotsVertical size={18} />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={onMarkAllCardsOwned}>
          Mark all cards as owned
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

CardsPageMenu.propTypes = {
  onMarkAllCardsOwned: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
