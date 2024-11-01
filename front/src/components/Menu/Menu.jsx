import React from 'react';
import {
    Container,
    Row,
    Col,
} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

import CustomButton from '../CustomButton/CustomButton';

// import PropTypes from 'prop-types';

import './menuStyles.scss';

function Menu() {
    const navigate = useNavigate();

  return (
    <Container className="menu">
    <h1 className="menu-title pb-5">Welcome Alexa!</h1>
    <Container>
        <Row className="g-5">
            <Col sm={12}>
                <CustomButton
                    text="Report my cards"
                    onClick={() => navigate('/report')}
                    />
            </Col>
            <Col sm={12}>
                    <CustomButton
                    text="Discover my opportunities"
                    onClick={() => navigate('/login')}
                    />
            </Col>
            <Col sm={12}>
                    <CustomButton
                    text="Check my cards"
                    onClick={() => navigate('/login')}
                    />
            </Col>
            <Col sm={12}>
                    <CustomButton
                    text="Sign out"
                    onClick={() => navigate('/login')}
                    />
            </Col>
        </Row> 
               
    </Container>
    </Container>
)
}

Menu.propTypes = {

};

export default React.memo(Menu);
