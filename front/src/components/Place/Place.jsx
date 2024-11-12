import React, { useState, useEffect } from 'react';
import CardPreview from '../CardPreview/CardPreview';

import PropTypes from 'prop-types';

import './placeStyles.scss';

function Place({
    place,
    placeCards,
    explorerId
}) {
    const percentage = placeCards.length/9*100;
    const [className, setClassName] = useState('progress-bar');

    const progressClassName = () => {
        if (percentage === 100) {
            setClassName("progress-bar-full");
        } else {
            setClassName("progress-bar");
        }
    };

    useEffect(
        () => {
        progressClassName()
        },
        [],
      );

  return (
    
    <div className="d-flex flex-column align-items-center">
    <h1 className="explorerCard-title">
        {place.place_name}
    </h1>

    <div className="container d-flex flex-row justify-content-center">
        {/* <ProgressBar className="progress w-25 mb-3" now={now}/> */}
        <div className="progress w-25 mb-3">
            <div role="progressbar" className={className} aria-valuenow={percentage} 
            aria-valuemin="0" aria-valuemax="100" style={{width: `${percentage}%`}}>
            </div>
        </div>

        <div className="progress-bar-label">{place.cards.length}/9</div> 
    </div>

    <div class="explorerCard-numbers" id="">
    {placeCards && placeCards.length > 0 ? (
          placeCards.map((card) => (
            <CardPreview
              key={card.id}
              card={card}
              explorerId={explorerId}
            />
            ))
            ) : (
              <div>Unable to retrieve your data.</div>
        )}
    </div>
    </div>
)
}

Place.propTypes = {

};

// PlaceCard.defaultProps = {
//   card: { id: 0, name: 'Default Card', number: 0, place_id: 0 },  // Default card data
//   selectedCards: [],  // Default empty array for selectedCards
// };

export default React.memo(Place);
