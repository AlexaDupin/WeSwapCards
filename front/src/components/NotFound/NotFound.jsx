import React from 'react';
import {
  Container,
} from "react-bootstrap";

import './notFoundStyles.scss';

function NotFound() {
  return (
    <Container className="notfound">
      <p>Not Found</p>
    </Container>
  );
}

export default React.memo(NotFound);
