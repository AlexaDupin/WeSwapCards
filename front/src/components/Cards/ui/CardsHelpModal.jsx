import React from "react";
import { Modal } from "react-bootstrap";
import { HandIndexThumb, HandIndex, Clock } from "react-bootstrap-icons";
import "./cardsStyles.scss";

export default function CardsHelpModal({ show, onHide }) {
  return (
    <Modal show={show} onHide={onHide} centered aria-labelledby="cards-help-title">
      <Modal.Header closeButton>
        <Modal.Title id="cards-help-title">How to log your cards</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="help-tiles">
          <div className="help-tile" role="group" aria-label="Tap once — You have this card">
            <div className="help-gesture" aria-hidden="true">
              <HandIndexThumb aria-hidden="true" />
            </div>
            <div className="help-card">
              <div className="card-item card-item-owned help-card-mini">
                <div className="card-item-inner">1</div>
              </div>
            </div>
            <div className="help-caption" role="group" aria-label="Tap once — You have this card">
              <div className="help-caption-title">Tap once</div>
              <div className="help-caption-text">You have this card</div>
            </div>          
          </div>

          <div className="help-tile" role="group" aria-label="Tap again — You have this card duplicated">
            <div className="help-gesture" aria-hidden="true">
              <HandIndex aria-hidden="true" />
              <span className="tap-badge" aria-hidden="true">×2</span>
            </div>
            <div className="help-card">
              <div className="card-item card-item-duplicate help-card-mini">
                <div className="card-item-inner">1</div>
              </div>
            </div>
            <div className="help-caption" role="group" aria-label="Tap again — You have this card duplicated">
              <div className="help-caption-title">Tap again</div>
              <div className="help-caption-text">
                You have this card duplicated.<br />
                If you don't have extras anymore, tap again to switch.
              </div>
            </div>

          </div>

          <div className="help-tile" role="group" aria-label="Press & hold — You don’t have this card">
            <div className="help-gesture" aria-hidden="true">
              <HandIndexThumb size={20} aria-hidden="true" />
              <Clock size={12} aria-hidden="true" />
            </div>
            <div className="help-card">
              <div className="card-item help-card-mini">
                <div className="card-item-inner">1</div>
              </div>
            </div>
            <div className="help-caption" role="group" aria-label="Press & hold — You don’t have this card">
              <div className="help-caption-title">Press &amp; hold</div>
              <div className="help-caption-text">You don’t have this card</div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
