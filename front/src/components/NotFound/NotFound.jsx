import React from 'react';
import {
  Container,
} from "react-bootstrap";
import {PatchQuestion} from "react-bootstrap-icons";

import './notFoundStyles.scss';

function NotFound() {
  return (
    <Container className="page-container">
      <PatchQuestion 
        className='notfound'
      />
      <p>Oops, looks like this page was not found</p>
    </Container>
  );
}

export default React.memo(NotFound);
