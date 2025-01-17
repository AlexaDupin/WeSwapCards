import React from 'react';

import {
    Container,
    Row,
    Col,
} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

import CustomButton from '../CustomButton/CustomButton';

import './menuStyles.scss';

function Menu({
    name,
    explorerId,
}) {
    const navigate = useNavigate();

    console.log("MENU explorerId", explorerId);
    

  return (
    <Container className="page-container">
    <h1 className="menu-title pb-5" style={{fontSize: '1.2rem'}}>
        Welcome {name}!
    </h1>
    <Container>
        <Row className="g-4">
            <Col sm={12}>
                <CustomButton
                    text="Report my cards"
                    onClick={() => navigate('/report')}
                    />
            </Col>
            <Col sm={12}>
                    <CustomButton
                    text="Swap my cards"
                    onClick={() => navigate('/swap/card')}
                    />
            </Col>
            <Col sm={12}>
                    <CustomButton
                    text="Check my cards"
                    onClick={() => navigate('/check')}
                    />
            </Col>
            <Col sm={12}>
                    <CustomButton
                    text="Check all swap requests"
                    onClick={() => navigate('/swap/requests')}
                    />
            </Col>
            <Col sm={12} id="btn-legal">
                    <CustomButton
                    text="Legal"
                    onClick={() => navigate('/legal')}
                    />
            </Col>
            {/* <Col sm={12} id="btn-signout">
                    <CustomButton
                    text="Sign out"
                    onClick={handleSignOut}
                    />
            </Col> */}
        </Row> 
               
    </Container>
    </Container>
)
}

export default React.memo(Menu);
