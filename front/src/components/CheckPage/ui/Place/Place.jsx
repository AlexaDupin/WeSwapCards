import React, { useEffect, useReducer } from 'react';
import CardPreview from '../Place/CardPreview/CardPreview';

import { axiosInstance } from '../../../../helpers/axiosInstance';
import { useAuth } from '@clerk/clerk-react'

import './placeStyles.scss';

function Place({
    place,
    explorerId,
    dispatch, 
    progressClassNames
  }) {
    const { getToken } = useAuth()
    
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
                dispatch({
                  type: 'duplicate/toggled',
                  payload: { placeName: place.place_name, cardId, updatedDuplicateStatus },
                })
            } else {
              // console.error('Failed to update duplicate status');
            }
        } catch (error) {
          dispatch({
            type: 'duplicate/toggledError'
          })
        }
    };

    const percentage = (place.cards.length / 9) * 100;

    useEffect(() => {
      dispatch({
        type: percentage === 100 ? 'progress/classNameFull' : 'progress/classNameNotFull',
        payload: { placeName: place.place_name },
      });
    }, [percentage, dispatch, place.place_name]);

  return (
    
    <div className="d-flex flex-column align-items-center">
    <h1 className="explorerCard-title">
        {place.place_name}
    </h1>

    <div className="container d-flex flex-row justify-content-center">
        <div className="progress w-25 mb-3">
            <div role="progressbar" className={progressClassNames[place.place_name] || 'progress-bar'} aria-valuenow={percentage} 
            aria-valuemin="0" aria-valuemax="100" style={{width: `${percentage}%`}}>
            </div>
        </div>

        <div className="progress-bar-label">{place.cards.length}/9</div> 
    </div>

    <div className="explorerCard-numbers" id="">
    {place.cards && place.cards.length > 0 ? (
          place.cards?.map((card) => (
            <CardPreview
              key={card.card.id}
              card={card.card}
              duplicate={card.duplicate}
              handleDuplicateStatus={handleDuplicateStatus}
            />
            ))
            ) : (
              <div>You did not enter any cards for this chapter.</div>
        )}
    </div>
    </div>
)
}

export default React.memo(Place);
