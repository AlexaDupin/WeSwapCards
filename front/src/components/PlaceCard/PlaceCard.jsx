import React, { useState } from 'react';
import {
	Form,
	Row,
	Card,
	Col,
	FormControl,
    Container
} from "react-bootstrap";
import { Link } from 'react-router-dom';

import CustomButton from '../CustomButton/CustomButton';

import {Icon1Square, Icon2Square, Icon3Square,Icon4Square,
  Icon5Square,Icon6Square,Icon7Square,Icon8Square,Icon9Square} from "react-bootstrap-icons";

// import PropTypes from 'prop-types';

import './cardStyles.scss';

function placeCard() {
  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = () => {
    setChecked(!checked);
  };

  return (
    
        <Col xs={4}>
        <Card
          className="report-card"
          id={Card.id}
          onClick={handleCheckboxChange}
          style={{ cursor: 'pointer' }}
        >
          <Icon1Square className="report-icon" />
          <Card.Title className="report-icon-title">{Card.name}{Card.number}</Card.Title>
        </Card>
        </Col>
)
}

placeCard.propTypes = {

};

export default React.memo(placeCard);
