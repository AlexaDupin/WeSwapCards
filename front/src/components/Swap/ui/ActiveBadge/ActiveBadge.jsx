import React, { useMemo } from "react";
import { Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import Lightning from "../../../../images/lightning.svg";
import '../swapCardStyles.scss';

export default function ActiveBadge({ isActive, mobileOpen, onMobileToggle, id }) {
  const overlay = useMemo(
    () => <Tooltip id="active-user-tip">This user has been active recently</Tooltip>,
    []
  );

  if (!isActive) return null;

  return (
    <span className="opportunity-explorer-badge">
      <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={overlay}>
        <Badge className="opportunity-explorer-badge-desktop">Active</Badge>
      </OverlayTrigger>

      <img
        src={Lightning}
        alt="Lightning icon"
        className="opportunity-explorer-badge-mobile"
        onClick={() => onMobileToggle(id)}
      />
      {mobileOpen && (
        <div className="tooltip-mobile">
          <div className="tooltip-content">Active user</div>
        </div>
      )}
    </span>
  );
}
