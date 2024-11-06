import React, { useState, useEffect } from 'react';
import {
	Form,
	Row,
	Card,
	Col,
  Container
} from "react-bootstrap";
import {Icon1Square, Icon2Square, Icon3Square,Icon4Square,
  Icon5Square,Icon6Square,Icon7Square,Icon8Square,Icon9Square} from "react-bootstrap-icons";

import axios from 'axios';

import CustomButton from '../CustomButton/CustomButton';

// import PropTypes from 'prop-types';

import './reportStyles.scss';

function Report() {
  const [checked, setChecked] = useState(false);
  const [places, setPlaces] = useState([]);

  const baseUrl = process.env.REACT_APP_BASE_URL;

  const handleCheckboxChange = () => {
    setChecked(!checked);
  };

  const fetchAllPlaces = async () => {
    try {
      const response = await axios.get(`${baseUrl}/places`);
      setPlaces(response.data.places);
    } catch (error) {
      console.log(error);
    }
    console.log(places);

  };

  // useEffect so that data is fetched on mount
  useEffect(
    () => {
      fetchAllPlaces();
    },
    [],
  );

  return (
    <Container className="report">
    <Form className="">
              
      <Form.Group className="mb-3" controlId="formGroupPlace">
        <Form.Label className="report-label">Select a place, Alexa</Form.Label>
        <Form.Select aria-label="Select a place">
          <option>Select</option>
          {places.map((place) => (
            <option value={place.id}>{place.name}</option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formGroupEmail">
        <Form.Label className="report-label">Click on the cards you have</Form.Label>

        <Row className="d-flex g-3">
        <Col xs={4}>
          <Card
            className="report-card"
            onClick={handleCheckboxChange}
            style={{ cursor: 'pointer' }}
          >
            <Icon1Square className="report-icon" />
            <Card.Title className="report-icon-title">Brussels1</Card.Title>
          </Card>
        </Col>

        <Col xs={4}>
        <Card
            className="report-card"
            onClick={handleCheckboxChange}
            style={{ cursor: 'pointer' }}
          >          <Icon2Square className="report-icon" />
            <Card.Title className="report-icon-title">Brussels2</Card.Title>
        </Card>
        </Col>

        <Col xs={4}>
        <Card
            className="report-card"
            onClick={handleCheckboxChange}
            style={{ cursor: 'pointer' }}
          >          <Icon3Square className="report-icon" />
            <Card.Title className="report-icon-title">Brussels3</Card.Title>
        </Card>
        </Col>

        <Col xs={4}>
        <Card
            className="report-card"
            onClick={handleCheckboxChange}
            style={{ cursor: 'pointer' }}
          >          <Icon4Square className="report-icon" />
            <Card.Title className="report-icon-title">Brussels4</Card.Title>
        </Card>
        </Col>

        <Col xs={4}>
        <Card
            className="report-card"
            onClick={handleCheckboxChange}
            style={{ cursor: 'pointer' }}
          >          <Icon5Square className="report-icon" />
            <Card.Title className="report-icon-title">Brussels5</Card.Title>
        </Card>
        </Col>

        <Col xs={4}>
        <Card
            className="report-card"
            onClick={handleCheckboxChange}
            style={{ cursor: 'pointer' }}
          >          <Icon6Square className="report-icon" />
            <Card.Title className="report-icon-title">Brussels6</Card.Title>
        </Card>
        </Col>

        <Col xs={4}>
        <Card
            className="report-card"
            onClick={handleCheckboxChange}
            style={{ cursor: 'pointer' }}
          >          <Icon7Square className="report-icon" />
            <Card.Title className="report-icon-title">Brussels7</Card.Title>
        </Card>
        </Col>

        <Col xs={4}>
        <Card
            className="report-card"
            onClick={handleCheckboxChange}
            style={{ cursor: 'pointer' }}
          >          <Icon8Square className="report-icon" />
            <Card.Title className="report-icon-title">Brussels8</Card.Title>
        </Card>
        </Col>

        <Col xs={4}>
          <Card
            className="report-card"
            onClick={handleCheckboxChange}
            style={{ cursor: 'pointer' }}
          >          <Icon9Square className="report-icon" />
            <Card.Title className="report-icon-title">Brussels9</Card.Title>
        </Card>
        </Col>

        </Row>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formGroupEmail">
        <Form.Label className="report-label">Click on the cards you have duplicates for (2 or more)</Form.Label>
        <Row className="g-3">
        <Col xs={4}>
        <Card
          className="report-card"
          onClick={handleCheckboxChange}
          style={{ cursor: 'pointer' }}
        >
          <Icon1Square className="report-icon" />
          <Card.Title className="report-icon-title">Brussels1</Card.Title>
        </Card>
        </Col>

        <Col xs={4}>
        <Card>
          <Icon2Square className="report-icon" />
            <Card.Title className="report-icon-title">Brussels2</Card.Title>
        </Card>
        </Col>

        <Col xs={4}>
        <Card>
          <Icon3Square className="report-icon" />
            <Card.Title className="report-icon-title">Brussels3</Card.Title>
        </Card>
        </Col>

        <Col xs={4}>
        <Card>
          <Icon4Square className="report-icon" />
            <Card.Title className="report-icon-title">Brussels4</Card.Title>
        </Card>
        </Col>

        <Col xs={4}>
        <Card>
          <Icon5Square className="report-icon" />
            <Card.Title className="report-icon-title">Brussels5</Card.Title>
        </Card>
        </Col>

        <Col xs={4}>
        <Card>
          <Icon6Square className="report-icon" />
            <Card.Title className="report-icon-title">Brussels6</Card.Title>
        </Card>
        </Col>

        <Col xs={4}>
        <Card>
          <Icon7Square className="report-icon" />
            <Card.Title className="report-icon-title">Brussels7</Card.Title>
        </Card>
        </Col>

        <Col xs={4}>
        <Card>
          <Icon8Square className="report-icon" />
            <Card.Title className="report-icon-title">Brussels8</Card.Title>
        </Card>
        </Col>

        <Col xs={4}>
        <Card>
          <Icon9Square className="report-icon" />
            <Card.Title className="report-icon-title">Brussels9</Card.Title>
        </Card>
        </Col>

        </Row>
      </Form.Group>
    
      <CustomButton 
        text="Submit these cards"
      />

    </Form>
    </Container>
)
}

Report.propTypes = {
};

export default React.memo(Report);
