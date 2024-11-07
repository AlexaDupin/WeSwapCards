import React, { useState, useEffect } from 'react';
import {
	Card,
	Col,
  Form
} from "react-bootstrap";

import {Icon1Square, Icon2Square, Icon3Square,Icon4Square,
  Icon5Square,Icon6Square,Icon7Square,Icon8Square,Icon9Square} from "react-bootstrap-icons";

import PropTypes from 'prop-types';

import './placeCardStyles.scss';

function PlaceCard({
  id,
  name,
  number, 
  selectedCards, 
  handleCardSelection
}) {

  // Setting icon based on number of the card
  const iconMap = {
    1: Icon1Square,
    2: Icon2Square,
    3: Icon3Square,
    4: Icon4Square,
    5: Icon5Square,
    6: Icon6Square,
    7: Icon7Square,
    8: Icon8Square,
    9: Icon9Square,
  };

  const SelectedIcon = iconMap[number] || Icon1Square;

  return (
    
        <Col xs={4} key={id}>
        <Card
          // className="report-card"
          className={`${selectedCards.includes(id) ? 'report-card-selected' : 'report-card'}`}
          id={id}
          style={{ cursor: 'pointer' }}
          onClick={() => handleCardSelection(id)}
        >
          <SelectedIcon className="report-icon"/>    
          <Card.Title className="report-icon-title">{name}</Card.Title>
        </Card>
        </Col>
)
}

PlaceCard.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  selectedCards: PropTypes.array,
  handleCardSelection: PropTypes.func,
};

export default React.memo(PlaceCard);
