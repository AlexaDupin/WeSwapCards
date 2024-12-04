import React, { useEffect } from 'react';
import {
    Container,
    Row,
    Col,
} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import CustomButton from '../CustomButton/CustomButton';

import PropTypes from 'prop-types';

import './swapStyles.scss';

function Swap({
    name,
}) {
    const navigate = useNavigate();

  return (
    <Container className="menu">
    <h1 className="menu-title pb-5">What do you want to do, {name}?</h1>
    <Container>
        <Row className="g-5">
            <Col sm={12}>
                <CustomButton
                    text="Find a special card"
                    onClick={() => navigate('/swap/card')}
                    />
            </Col>
            <Col sm={12}>
                    <CustomButton
                    text="Discover all opportunities"
                    onClick={() => navigate('/swap/opportunities')}
                    />
            </Col>
            <Col sm={12}>
                    <CustomButton
                    text="Check my requests"
                    onClick={() => navigate('/swap/requests')}
                    />
            </Col>
        </Row> 
               
    </Container>
    </Container>
)
}

Swap.propTypes = {
    name: PropTypes.string,
    explorerId: PropTypes.number,
};

export default React.memo(Swap);
