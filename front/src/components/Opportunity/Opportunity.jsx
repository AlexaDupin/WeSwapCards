import React, { useState, useEffect } from 'react';
import axios from 'axios';

import PropTypes from 'prop-types';

import './opportunityStyles.scss';

function Opportunity({
    opportunity,
    explorerId
}) {
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const placeId = opportunity.place_id;
    const [className, setClassName] = useState('custom-button');

    const fetchCountByPlaceForExplorer = async () => {
        try {
            const response = await axios.get(`${baseUrl}/opportunities/${explorerId}/${placeId}`);
            const count = response.data[0].count;
            console.log("COUNT", count);
            console.log("className", className);

            if (count >= 8) { // Shiny
                setClassName("star-card");
            }
            if (count >= 6 && count < 8) { // Green (Orange is 5)
                setClassName("key-card");
            }
            if (count <= 4) { // White
                setClassName("low-card");
            }
  
          } catch (error) {
            console.log(error);
          }
        
    };

    useEffect(
        () => {
        fetchCountByPlaceForExplorer()
        },
        [className],
      );
 
  return (
    
        <button 
          className={className}
          key={opportunity.id}
        //   onClick={handleMessageAnExplorer}   
        >
            {opportunity.card_name} ({opportunity.explorer_name})
        </button>
)
}

Opportunity.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    number: PropTypes.number.isRequired,
    place_id: PropTypes.number.isRequired
  }),  
  selectedCards: PropTypes.array,
  handleCardSelection: PropTypes.func,
  duplicates: PropTypes.array,
};

// PlaceCard.defaultProps = {
//   card: { id: 0, name: 'Default Card', number: 0, place_id: 0 },  // Default card data
//   selectedCards: [],  // Default empty array for selectedCards
// };

export default React.memo(Opportunity);
