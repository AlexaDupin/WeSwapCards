import React from "react";
import { Toast, Button } from "react-bootstrap";

const COPY = {
  allOwned: (number) => `Marked all ${number} cards as owned.`,
  allDuplicated: (number) => `Marked all ${number} cards as duplicated.`,
  deleteAll: () => "All cards have been deleted.",
};

function BulkToast({
  show,
  type,
  total = 0,
  canUndo = false,
  onUndo,
  onClose,
  delay = 4500,
}) {
  if (!type) return null;

  const message = COPY[type](total);

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
