import React, { useEffect } from 'react';
import {
    Container,
    Row,
    Col,
} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

import CustomButton from '../CustomButton/CustomButton';

import './legalStyles.scss';

function Legal() {
    const navigate = useNavigate();

  return (
    <Container className="page-container">
    <h1 className="swap-title">Legal</h1>

    <Container>
        <Row className="g-4">
            <Col sm={12}>
                <CustomButton
                    text="Privacy Policy"
                    onClick={() => navigate('/privacy')}
                    />
            </Col>
            <Col sm={12}>
                    <CustomButton
                    text="Terms and Conditions"
                    onClick={() => navigate('/terms')}
                    />
            </Col>
            <Col sm={12}>
                    <CustomButton
                    text="Cookie Policy"
                    onClick={() => navigate('/cookies')}
                    />
            </Col>
            <Col sm={12}>
                    <CustomButton
                    text="Contact"
                    onClick={() => navigate('/contact')}
                    />
            </Col>
        </Row> 
               
    </Container>
    </Container>
)
}

export default React.memo(Legal);
