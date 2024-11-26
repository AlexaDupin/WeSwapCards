import React from 'react';

import PropTypes from 'prop-types';

import './opportunityStyles.scss';


function Opportunity({
    opportunity,
    className 
}) {

  return (
    
        <button 
          className={className}
        //   onClick={handleMessageAnExplorer}   
        >
            {opportunity.card_name} ({opportunity.explorer_name})
        </button>
)
}

Opportunity.propTypes = {
  // card: PropTypes.shape({
  //   id: PropTypes.number.isRequired,
  //   name: PropTypes.string.isRequired,
  //   number: PropTypes.number.isRequired,
  //   place_id: PropTypes.number.isRequired
  // }),  
  // selectedCards: PropTypes.array,
  // handleCardSelection: PropTypes.func,
  // duplicates: PropTypes.array,
};

// PlaceCard.defaultProps = {
//   card: { id: 0, name: 'Default Card', number: 0, place_id: 0 },  // Default card data
//   selectedCards: [],  // Default empty array for selectedCards
// };

export default React.memo(Opportunity);
