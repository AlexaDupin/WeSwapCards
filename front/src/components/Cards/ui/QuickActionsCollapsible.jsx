import React, { useState, useId } from "react";
import { Collapse, Button } from "react-bootstrap";
import QuickActions from "./QuickActions";

export default function QuickActionsCollapsible({
  order,
  registry,
  context,
  onAction,
  activeKeys,
  defaultOpen = false,
  toggleLabel = "Actions",
  open: controlledOpen,
  onOpenChange,
  renderInline = true,
  controlsId,
}) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const autoId = useId();
  const collapseId = controlsId || `qa-collapse-${autoId}`;

  return (
    <div>
      <Button
        type="button"
        variant="outline-secondary"
        size="sm"
        className="rounded-pill"
        aria-expanded={open ? "true" : "false"}
        aria-controls={collapseId}
        onClick={() => setOpen(!open)}
      >
        {toggleLabel} {open ? "▴" : "▾"}
      </Button>

      {renderInline && (
        <Collapse in={open}>
          <div id={collapseId} className="mt-2">
            <QuickActions
              order={order}
              registry={registry}
              context={context}
              onAction={onAction}
              activeKeys={activeKeys}
            />
          </div>
        </Collapse>
      )}
    </div>
  );
}
