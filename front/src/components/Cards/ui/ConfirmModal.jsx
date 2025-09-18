import React from "react";
import { Modal, Button, Spinner } from "react-bootstrap";

function ConfirmModal({
  show,
  title,
  body,
  confirmLabel,
  confirmVariant = "primary",
  busy = false,
  onCancel,
  onConfirm,
}) {
  const labelledById = "confirm-modal-title";
  const describedById = "confirm-modal-body";

  return (
    <Modal
      show={show}
      onHide={onCancel}
      centered
      aria-labelledby={labelledById}
      aria-describedby={describedById}
      animation
      restoreFocus
    >
      <Modal.Header closeButton>
        <Modal.Title id={labelledById}>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body id={describedById}>
        {body}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
        <Button
          variant={confirmVariant}
          onClick={onConfirm}
          disabled={busy}
          autoFocus
        >
          {busy && <Spinner size="sm" className="me-2" />}
          {confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default React.memo(ConfirmModal);
