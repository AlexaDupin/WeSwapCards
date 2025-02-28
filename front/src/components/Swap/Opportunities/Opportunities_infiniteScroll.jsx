import React, { useState, useEffect } from 'react';
import {
    Container,
    Spinner
} from "react-bootstrap";
import Opportunity from './Opportunity/Opportunity';
import OpportunitiesModal from '../Modal/Modal';

import axios from 'axios';

import PropTypes from 'prop-types';
import ScrollToTop from '../ScrollToTopButton/ScrollToTop';

import './opportunitiesStyles.scss';

function Opportunities({
    explorerId, name, token
  }) {
    const [opportunities, setOpportunities] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true); // Track if more data is available

    // console.log("offset", offset);
    const baseUrl = process.env.REACT_APP_BASE_URL;

    const fetchOpportunities = async () => {
      // if (loading || !hasMore) return; // Prevent duplicate requests
      // setLoading(true);

      try {
        // Fetch opportunities
        const response = await axios.get(
          `${baseUrl}/opportunities/${explorerId}?limit=30&offset=${offset}`
          , {
            headers: {
              authorization: token,
            },
          });
        const fetchedOpportunities = response.data;
        // console.log("OPPORTUNITIES", fetchedOpportunities);

        if (fetchedOpportunities.length < 30) {
          setHasMore(false); // No more data to load
        }

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
            let className = 'custom-button';
            if (count >= 8) { // Shiny
              className = 'star-card';
            } else if (count >= 6 && count < 8) { // Green (Orange is 5)
              className = 'key-card';
            } else if (count <= 4) { // White
              className = 'low-card';
            }

            return { ...opportunity, className }; // Add the className to each opportunity
          })
        );

        setOpportunities(prevOpportunities => [...prevOpportunities, ...opportunitiesWithClassNames]);

        // // Update the opportunities state with the class names
        // setOpportunities(opportunitiesWithClassNames);
        setLoading(false);

        // Set the message based on number of opportunities
        if (fetchedOpportunities.length === 1) {
          setMessage(`Cool ${name}, you have 1 opportunity!`);
        } else if (fetchedOpportunities.length > 1) {
          setMessage(`Amazing ${name}, you have ${fetchedOpportunities.length} opportunities!`);
        }
      } catch (error) {
        // console.log('Error fetching opportunities:', error);
      } 
      // finally {
      //   setLoading(false);
      // }
    };

    // Trigger the fetch when the user scrolls to the bottom of the page
  const handleScroll = () => {
    const bottom = document.documentElement.scrollHeight === document.documentElement.scrollTop + window.innerHeight;
    if (bottom) {
      setOffset(prevOffset => prevOffset + 30); // Update the offset for the next scroll
      // fetchOpportunities();
    }
  };

  // Set up scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
    useEffect(() => {
      fetchOpportunities();
    }, [offset]);

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
          opportunities?.map((opportunity) => (
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