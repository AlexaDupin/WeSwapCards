import React from 'react';
import PageContainer from '../PageContainer/PageContainer';
import {PatchQuestion} from "react-bootstrap-icons";

import './notFoundStyles.scss';

function NotFound() {
  return (
    <PageContainer>
      <PatchQuestion 
        className='notfound'
      />
      <p>Oops, looks like this page was not found</p>
    </PageContainer>
  );
}

export default React.memo(NotFound);
