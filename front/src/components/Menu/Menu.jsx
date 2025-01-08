import React, { useEffect } from 'react';
import {
    Container,
    Row,
    Col,
} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import supabase from '../../helpers/Supabase';

import CustomButton from '../CustomButton/CustomButton';

import PropTypes from 'prop-types';

import './menuStyles.scss';

function Menu({
    name,
    explorerId,
    setName,
    setIsLogged
}) {
    const navigate = useNavigate();

    console.log("MENU explorerId", explorerId);
    
    const handleSignOut = async () => {
        setName('');
        setIsLogged(false);
        const { error } = await supabase.auth.signOut()
        localStorage.clear();
        navigate('/');    
      }

    // If user quitted after registering without entering username
    // const checkUsername = () => {
    //     if (name === undefined || !name) {
    //         setName("");
    //         setExplorerId("");
    //         navigate('/register/user');
    //     }    
    // }

    // useEffect(() => {
    //     checkUsername();
    // }, []);

  return (
    <Container className="menu">
    <h1 className="menu-title pb-5" style={{fontSize: '1.2rem'}}>Welcome {name}!</h1>
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
                    text="Sign out"
                    onClick={handleSignOut}
                    />
            </Col>
        </Row> 
               
    </Container>
    </Container>
)
}

Menu.propTypes = {
    name: PropTypes.string,
    explorerId: PropTypes.number,
};

export default React.memo(Menu);
