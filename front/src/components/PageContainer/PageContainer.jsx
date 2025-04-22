import React from 'react';
import {
    Container,
} from "react-bootstrap";

import './pageContainerStyles.scss';

function PageContainer({ children }) {
    
  return (
    <Container className="page-container">
      {children}
    </Container>
  )
}

export default React.memo(PageContainer);