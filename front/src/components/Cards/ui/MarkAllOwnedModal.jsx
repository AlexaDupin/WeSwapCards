import React from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import PropTypes from "prop-types";

// Confirmation before marking every card as owned. There is no undo, so the
// dialog spells out what changes, what is kept, and what is left to do.
export default function MarkAllOwnedModal({ show, cardCount, pending = false, onConfirm, onHide }) {
  return (
    <Modal show={show} onHide={pending ? undefined : onHide} centered>
      <Modal.Header closeButton={!pending}>
        <Modal.Title>Mark all cards as owned?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          All {cardCount} cards in every chapter will be marked as owned.
          Cards you already logged, including your duplicates, stay as they are.
        </p>
        <p className="mb-0">
          Then remove the cards you’re missing, and tap your duplicates again
          to mark them as duplicated.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide} disabled={pending}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm} disabled={pending}>
          {pending ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Marking…
            </>
          ) : (
            'Mark all as owned'
          )}
        </Button>
      </Modal.Footer>
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
