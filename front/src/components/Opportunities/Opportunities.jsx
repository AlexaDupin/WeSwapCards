import React, { useState, useEffect } from 'react';
import {
    Container
} from "react-bootstrap";
import Opportunity from '../Opportunity/Opportunity';

import axios from 'axios';

import PropTypes from 'prop-types';

import './opportunitiesStyles.scss';

function Opportunities({
    explorerId, name
  }) {
    const [opportunities, setOpportunities] = useState([]);
    const [message, setMessage] = useState('');
    console.log(explorerId);

    const baseUrl = process.env.REACT_APP_BASE_URL;

    const fetchOpportunities = async () => {
        try {
          const response = await axios.get(`${baseUrl}/opportunities/${explorerId}`);
          const fetchedOpportunities = response.data;
          console.log("OPPORTUNITIES", fetchedOpportunities);
          setOpportunities(fetchedOpportunities);

          if (fetchedOpportunities.length === 1) {
            setMessage(`Cool ${name}, you have 1 opportunity!`)
          } else if (fetchedOpportunities.length > 1) {
            setMessage(`Amazing ${name}, you have ${fetchedOpportunities.length} opportunities!`)
          }

        } catch (error) {
          console.log(error);
        }
    };



    useEffect(
      () => {
      fetchOpportunities()
      },
      [],
    );


  return (
    <Container className="opportunities">
        <p>{message}</p>

        {opportunities && opportunities.length > 0 ? (
          opportunities.map((opportunity) => (
            <Opportunity
              key={opportunity.id}
              opportunity={opportunity}
              explorerId={explorerId}
            />
            ))
            ) : (
              <div>Unfortunately, you don't have any opportunities at the moment, {name}.</div>
        )}

    </Container>
)
}

Opportunities.propTypes = {
  explorerId: PropTypes.number.isRequired,
  name: PropTypes.string,
};

export default React.memo(Opportunities);
