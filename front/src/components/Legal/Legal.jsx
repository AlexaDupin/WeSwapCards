import React from 'react';
import PageContainer from '../PageContainer/PageContainer';
import {
    Container,
    Row,
    Col,
} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

import CustomButton from '../CustomButton/CustomButton';

function Legal() {
    const navigate = useNavigate();

  return (
    <PageContainer>
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

    </PageContainer>
    )   
}

export default React.memo(Legal);
