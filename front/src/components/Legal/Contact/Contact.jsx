import React from 'react';
import {
  Container
} from "react-bootstrap";

import './contactStyles.scss';

function Contact() {

  return (
  <Container className="page-container">
    <section>
      <h1 className="page-title">Contact us</h1>
      
      <p>We’d love to hear from you! Whether you have a question, need support, or want to provide feedback, feel free to contact us!</p>
        <ul className="privacy-list">
          <li>
            <p><strong>Email:</strong> contact@weswapcards.com</p>
          </li>
        </ul>
    </section>
  
  </Container>
)
}

export default React.memo(Contact);
