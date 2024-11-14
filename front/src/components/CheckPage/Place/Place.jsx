import React, { useState, useEffect } from 'react';
import CardPreview from '../Place/CardPreview/CardPreview';

import axios from 'axios';

import PropTypes from 'prop-types';

import './placeStyles.scss';

function Place({
    place,
    explorerId
}) {
    const [placeCards, setPlaceCards] = useState(place.cards);
    const [className, setClassName] = useState('progress-bar');

    const percentage = place.cards.length/9*100;
    const baseUrl = process.env.REACT_APP_BASE_URL;

    // console.log(placeCards);

    const progressClassName = () => {
        if (percentage === 100) {
            setClassName("progress-bar-full");
        } else {
            setClassName("progress-bar");
        }
    };

    const handleDuplicateStatus = async (cardId, currentDuplicateStatus) => {
        const updatedDuplicateStatus = !currentDuplicateStatus;

        try {
            const response = await axios.patch(
              `${baseUrl}/explorercards/${explorerId}/cards/${cardId}/duplicate`, {
                duplicate: updatedDuplicateStatus,
              });
  
            //   setHasDuplicate(!hasDuplicate);
            if (response.status === 200) {
                const updatedCard = response.data;  // Assuming the server returns the updated card object
                console.log("handleDuplicateStatus", updatedCard);

                // Update the local state to reflect the change
                setPlaceCards((prevPlaceCards) => {
                    return prevPlaceCards.map((card) =>
                    card.id === cardId ? { ...card, duplicate: updatedDuplicateStatus } : card
                    );
                });
            } else {
              console.error('Failed to update duplicate status');
            }
        } catch (error) {
          console.log(error);
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

    <div className="explorerCard-numbers" id="">
    {placeCards && placeCards.length > 0 ? (
          placeCards.map((card) => (
            <CardPreview
              key={card.card.id}
              card={card.card}
              duplicate={card.duplicate}
              handleDuplicateStatus={handleDuplicateStatus}
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
