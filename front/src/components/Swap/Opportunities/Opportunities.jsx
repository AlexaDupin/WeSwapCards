import React, { useState, useEffect } from 'react';
import {
    Container,
    Spinner
} from "react-bootstrap";
import Opportunity from './Opportunity/Opportunity';
import OpportunitiesModal from '../../Modal/Modal';

import axios from 'axios';

import PropTypes from 'prop-types';
import ScrollToTop from '../../ScrollToTopButton/ScrollToTop';

import './opportunitiesStyles.scss';

function Opportunities({
    explorerId, name, token
  }) {
    const [opportunities, setOpportunities] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const baseUrl = process.env.REACT_APP_BASE_URL;

    const fetchOpportunities = async () => {
      try {
        // Fetch opportunities
        const response = await axios.get(
          `${baseUrl}/opportunities/${explorerId}`
          , {
            headers: {
              authorization: token,
            },
          });
        const fetchedOpportunities = response.data;
        console.log("OPPORTUNITIES", fetchedOpportunities);
  
        // Fetch the count for each opportunity and determine the className
        const opportunitiesWithClassNames = await Promise.all(
          fetchedOpportunities.map(async (opportunity) => {
            const countResponse = await axios.get(
              `${baseUrl}/opportunities/${explorerId}/${opportunity.place_id}`
              , {
                headers: {
                  authorization: token,
                },
              });
            const count = countResponse.data[0].count;
            
            // Determine className based on count
            let className = 'opportunity-tag';
            if (count >= 8) { // Shiny
              className = 'opportunity-tag-star';
            } else if (count >= 6 && count < 8) { // Green (Orange is 5)
              className = 'opportunity-tag-key';
            } else if (count <= 4) { // White
              className = 'opportunity-tag-low';
            }

            return { ...opportunity, className }; // Add the className to each opportunity
          })
        );
  
        // Update the opportunities state with the class names
        setOpportunities(opportunitiesWithClassNames);
        setLoading(false);

        // Set the message based on number of opportunities
        if (fetchedOpportunities.length === 1) {
          setMessage(`Cool ${name}, you have 1 opportunity!`);
        } else if (fetchedOpportunities.length > 1) {
          setMessage(`Amazing ${name}, you have ${fetchedOpportunities.length} opportunities!`);
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    useEffect(() => {
      fetchOpportunities();
    }, []);

  return (
    <Container className="opportunities">

    {loading &&
      <><Spinner
          animation="border"
          className="spinner" /><p>Looking for your opportunities...</p></>
    }

    {!loading &&

      <><OpportunitiesModal /><p>{message}</p>

        {opportunities && opportunities.length > 0 ? (
          opportunities.map((opportunity) => (
            <Opportunity
              key={opportunity.id}
              opportunity={opportunity}
              explorerId={explorerId}
              className={opportunity.className}
            />
            ))
            ) : (
              <div>Unfortunately, you don't have any opportunities at the moment, {name}.</div>
        )}
        
      <ScrollToTop />
      </>
    }
    </Container>
)
}

Opportunities.propTypes = {
  explorerId: PropTypes.number.isRequired,
  name: PropTypes.string,
};

export default React.memo(Opportunities);