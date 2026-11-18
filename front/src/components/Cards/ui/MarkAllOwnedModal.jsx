import React from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { PlusCircle } from "react-bootstrap-icons";
import PropTypes from "prop-types";
import './cardsStyles.scss';

// Confirmation before marking every card as owned. There is no undo, so the
// dialog spells out what changes, what is kept, and what is left to do.
// Laid out like the mobile dialog: icon, centred title, stacked buttons.
export default function MarkAllOwnedModal({ show, cardCount, pending = false, onConfirm, onHide }) {
  return (
    <Modal
      show={show}
      onHide={pending ? undefined : onHide}
      centered
      contentClassName="mark-all-modal"
      aria-labelledby="mark-all-modal-title"
    >
      <Modal.Body>
        <div className="mark-all-modal__icon" aria-hidden="true">
          <PlusCircle />
        </div>

        <h2 id="mark-all-modal-title" className="mark-all-modal__title">
          Mark <span className="mark-all-modal__emphasis">ALL</span> cards as owned?
        </h2>

        <p className="mark-all-modal__text">
          <strong>All {cardCount} cards</strong> in every chapter will be marked as owned.
        </p>
        <p className="mark-all-modal__text">
          Cards you already logged, including your duplicates, stay as they are.
        </p>

        <div className="mark-all-modal__reminder">
          <p className="mark-all-modal__reminder-title">
            Remember, you will still need to check all your cards:
          </p>
          <ul>
            <li>Remove the ones you’re missing</li>
            <li>Tap your duplicates again to mark them</li>
          </ul>
        </div>

        <Button
          variant="primary"
          className="mark-all-modal__confirm"
          onClick={onConfirm}
          disabled={pending}
        >
          {pending ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Marking…
            </>
          ) : (
            'Mark all as owned'
          )}
        </Button>
        <Button
          variant="link"
          className="mark-all-modal__cancel"
          onClick={onHide}
          disabled={pending}
        >
          Cancel
        </Button>
      </Modal.Body>
    </Modal>
  );
}

MarkAllOwnedModal.propTypes = {
  show: PropTypes.bool.isRequired,
  cardCount: PropTypes.number.isRequired,
  pending: PropTypes.bool,
  onConfirm: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
};
