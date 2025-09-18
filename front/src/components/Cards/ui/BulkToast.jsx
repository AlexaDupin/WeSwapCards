import React from "react";
import { Toast, Button } from "react-bootstrap";

function BulkToast({
  show,
  message,
  canUndo = false,
  onUndo,
  onClose,
  delay = 4500,
}) {
  if (!message) return null;

  return (
    <Toast
      bg="success"
      onClose={onClose}
      show={show}
      delay={delay}
      autohide
      role="status"
      aria-live="polite"
    >
      <Toast.Body className="text-white d-flex align-items-center justify-content-between gap-3">
        <span>{message}</span>
        {canUndo && (
          <Button size="sm" variant="light" onClick={onUndo}>
            Undo
          </Button>
        )}
      </Toast.Body>
    </Toast>
  );
}

export default React.memo(BulkToast);
