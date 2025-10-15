import React from "react";
import { Card } from "react-bootstrap";
import ActiveBadge from "../ActiveBadge/ActiveBadge";

export default function OpportunityCard({
  opportunity,
  isRecentlyActive,
  activeTooltips,
  onMobileTooltip,
  onContact,
}) {
  return (
    <Card className="opportunity-card h-100 d-flex flex-column" id={opportunity.explorer_id}>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="opportunity-title">
          <span className="opportunity-explorer-name">{opportunity.explorer_name}</span>
          <ActiveBadge
            id={opportunity.explorer_id}
            isActive={isRecentlyActive(opportunity.last_active_at)}
            mobileOpen={activeTooltips[opportunity.explorer_id]}
            onMobileToggle={onMobileTooltip}
          />
        </Card.Title>

        {opportunity.opportunities.length > 0 ? (
          <Card.Text className="opportunity-text">
            <span>In exchange, here are the cards you can offer them:</span>
            <br />
            {opportunity.opportunities.map((ex) => (
              <button key={ex.card.id} className="swap-tag" type="button">
                {ex.card.name}
              </button>
            ))}
          </Card.Text>
        ) : (
          <Card.Text className="opportunity-text-empty">
            <span>You do not have any new cards for this user, but you can still contact them.</span>
          </Card.Text>
        )}

        <div className="mt-auto">
          <button
            className="contact-button"
            type="button"
            onClick={() => onContact(opportunity.explorer_id, opportunity.explorer_name, opportunity.opportunities)}
          >
            Contact this user to swap
          </button>
        </div>
      </Card.Body>
    </Card>
  );
}
