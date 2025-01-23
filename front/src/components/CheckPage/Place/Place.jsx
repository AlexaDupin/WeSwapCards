import React, { useState, useEffect } from 'react';
import CardPreview from '../Place/CardPreview/CardPreview';

import { axiosInstance } from '../../../helpers/axiosInstance';
import { useAuth } from '@clerk/clerk-react'

import PropTypes from 'prop-types';

import './placeStyles.scss';

function Place({
    place,
    explorerId,
}) {
    const [placeCards, setPlaceCards] = useState(place.cards);
    const [progressClassName, setProgressClassName] = useState('progress-bar');
    const { getToken } = useAuth()

    const percentage = place.cards.length/9*100;
    const attributeProgressClassName = () => {
        if (percentage === 100) {
          setProgressClassName("progress-bar-full");
        } else {
          setProgressClassName("progress-bar");
        }
    };

    const handleDuplicateStatus = async (cardId, updatedDuplicateStatus) => {
        // Update duplicate status in database
        try {
            const response = await axiosInstance.patch(
              `/explorercards/${explorerId}/cards/${cardId}/duplicate`, {
                duplicate: updatedDuplicateStatus,
              },
              {headers: {
                Authorization: `Bearer ${await getToken()}`,
              },
              });

            if (response.status === 200) {
                const confirmation = response.data;
                console.log("handleDuplicateStatus", confirmation);

                // Update duplicate status in state
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
        attributeProgressClassName()
        },
        [],
      );

    // console.log("placeCards", placeCards);

  return (
    
    <div className="d-flex flex-column align-items-center">
    <h1 className="explorerCard-title">
        {place.place_name}
    </h1>

    <div className="container d-flex flex-row justify-content-center">
        <div className="progress w-25 mb-3">
            <div role="progressbar" className={progressClassName} aria-valuenow={percentage} 
            aria-valuemin="0" aria-valuemax="100" style={{width: `${percentage}%`}}>
            </div>
        </div>

        <div className="progress-bar-label">{place.cards.length}/9</div> 
    </div>

    <div className="explorerCard-numbers" id="">
    {placeCards && placeCards.length > 0 ? (
          placeCards?.map((card) => (
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
