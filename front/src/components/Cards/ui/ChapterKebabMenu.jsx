import React from "react";
import { Dropdown } from "react-bootstrap";
import { PlusCircle } from "react-bootstrap-icons";
import PropTypes from "prop-types";
import './cardsStyles.scss';

// Grey + next to the chapter name: the same sign as the blue page-level
// "mark all owned" button, since both add cards in bulk.
export default function ChapterKebabMenu({ onMarkAllOwned, onMarkAllDuplicated, disabled = false, }) {
  return (
    <Dropdown align="start" className="chapter-kebab">
      <Dropdown.Toggle
        as="button"
        className="btn p-0 border-0 bg-transparent"
        aria-label="Chapter actions"
        style={{ lineHeight: 0, width: 32, height: 32 }}
        disabled={disabled}
      >
        <PlusCircle size={18} />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={onMarkAllOwned}>
          Mark all as owned
        </Dropdown.Item>
        <Dropdown.Item onClick={onMarkAllDuplicated}>
          Mark all as duplicated
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

ChapterKebabMenu.propTypes = {
  onMarkAllOwned: PropTypes.func.isRequired,
  onMarkAllDuplicated: PropTypes.func.isRequired,
};
