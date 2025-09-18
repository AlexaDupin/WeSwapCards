import React from "react";
import { Button } from "react-bootstrap";

function QuickActions({ order = [], registry, context, onAction, activeKeys }) {
  const activeSet =
    activeKeys instanceof Set
      ? activeKeys
      : new Set(Array.isArray(activeKeys) ? activeKeys : []);

  return (
    <div className="quick-actions mb-1" role="group" aria-label="Quick actions">
      {order.map((key) => {
        const config = registry[key];
        if (!config) return null;

        const isDisabled = config.isDisabled ? config.isDisabled(context) : false;
        const isPressed = activeSet.has(key);
        const variant =
          isPressed ? "primary" : (config.button?.variant ?? "outline-primary");

        return (
          <Button
            key={key}
            variant={variant}
            size="sm"
            className="rounded-pill quick-pill quick-button"
            onClick={() => onAction(key)}
            disabled={isDisabled}
            aria-pressed={isPressed ? "true" : "false"}
          >
            {config.label}
          </Button>
        );
      })}
    </div>
  );
}

export default React.memo(QuickActions);
