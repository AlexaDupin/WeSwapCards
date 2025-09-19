import React, { useId } from "react";
import { Button } from "react-bootstrap";

export default function QuickActionsCollapsible({
  open,
  onOpenChange,
  toggleLabel = "Actions",
  controlsId,
}) {
  const autoId = useId();
  const collapseId = controlsId || `qa-collapse-${autoId}`;

  return (
    <Button
      type="button"
      variant="outline-secondary"
      size="sm"
      className="rounded-pill"
      aria-expanded={open ? "true" : "false"}
      aria-controls={collapseId}
      onClick={() => onOpenChange(!open)}
    >
      {toggleLabel} {open ? "▴" : "▾"}
    </Button>
  );
}
