export const initialState = {
    cardsByPlace: [],
    loading: true,
    alert: {
        hidden: true,
        message: ''
    },
    progressClassNames:  {},
}

export const reducer = (state, action) => {
    switch (action.type) {
        case 'cards/fetched': {
            const fetchedCardsByPlace = action.payload;

            return {
                ...state,
                cardsByPlace: fetchedCardsByPlace,
                loading: false
            }
        }

        case 'cards/fetchedError': {
            return {
                ...state,
                loading: false,
                alert: {
                    hidden: false,
                    message: "There was an error reaching the server. Try again."
                }
            }
        }

        case 'progress/classNameFull': 
            return {
                ...state,
                progressClassNames: {
                  ...state.progressClassNames,
                  [action.payload.placeName]: 'progress-bar-full',
                },
        }
        
        case 'progress/classNameNotFull':
          return {
            ...state,
            progressClassNames: {
              ...state.progressClassNames,
              [action.payload.placeName]: 'progress-bar',
            },
        }
  
        case 'duplicate/toggled': {
            const { placeName, cardId, updatedDuplicateStatus } = action.payload;

            return {
                ...state,
                cardsByPlace: state.cardsByPlace.map((place) =>
                    place.place_name === placeName
                      ? {
                        ...place,
                        cards: place.cards.map((cardObj) =>
                          cardObj.card.id === cardId
                            ? { ...cardObj, duplicate: updatedDuplicateStatus }
                            : cardObj
                        ),
                        }
                      : place
                    ),
            };
        }

        case 'duplicate/toggledError': {
            return {
                ...state,
                alert: {
                    hidden: false,
                    message: "Oops, the update did not go through. Try again.",
                }
            }
        }


        default: 
            return state;
    }
}