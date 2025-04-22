export const initialState = {
    places: [],
    cards: [],
    selectedCards: [],
    duplicates: [],
    toBeDeleted: [],
    loadingPlaces: true,
    hidden: true,
    hiddenDuplicates: true,
    alert: {
        hidden: true,
        variant: '',
        message: ''
    }
}

export const reducer = (state, action) => {
    switch (action.type) {
        case 'places/fetched': {
            const placesFetched = action.payload;

            const newState = {
                ...state,
                places: placesFetched,
                loadingPlaces: false,
            };

            return newState;
        }

        case 'places/error': {
            const newState = {
                ...state,
                hiddenAlert: false,
                alert: {
                    variant: 'danger',
                    message: 'There was an error reaching the server. Try again.',
                },
                loadingPlaces: false
            };

            return newState;
        }

        case 'place/selected': {
            const newState = {
                ...state,
                cards: action.payload.cards,
                selectedCards: action.payload.selectedCards,
                duplicates: action.payload.duplicates,
                hidden: false
            };

            return newState;
        }

        case 'place/error': {
            const newState = {
                ...state,
                alert: {
                    hidden: false,
                    variant: 'danger',
                    message: 'There was an error while loading the cards.'
                }
            };

            return newState;
        }

        case 'duplicates/show': {
            const newState = {
                ...state,
                hidden: false,
                hiddenAlert: true,
                hiddenDuplicates: false
            };

            return newState;
        }

        case 'duplicates/notshow': {
            const newState = {
                ...state,
                hiddenDuplicates: true
            };

            return newState;
        }

        case 'cards/selected': {
            const card = action.payload;

            const isCardSelected = state.selectedCards.some(
                (alreadySelectedCard) => alreadySelectedCard.id === card.id
            );
        
            if (isCardSelected) {
              return {
                ...state,
                selectedCards: state.selectedCards.filter(
                  (c) => c.id !== card.id
                ),
                toBeDeleted: [...state.toBeDeleted, card],
              };
            } else {
              return {
                ...state,
                selectedCards: [...state.selectedCards, card],
              };
            }
        }

        case 'cards/selectedAll': {
            const cards = action.payload;

            const newState = {
                ...state,
                selectedCards: cards
            };

            return newState;
        }

        case 'cards/duplicates': {
            const card = action.payload;

            const isCardSelected = state.duplicates.some(
                (duplicate) => duplicate.id === card.id
              );
        
              if (isCardSelected) {
                return {
                  ...state,
                  duplicates: state.duplicates.filter(
                    (duplicate) => duplicate.id !== card.id
                  ),
                };
              } else {
                return {
                  ...state,
                  duplicates: [...state.duplicates, card],
                };
              }
        }

        case 'duplicates/selectedAll': {
            const cards = action.payload;

            const newState = {
                ...state,
                duplicates: cards
            };

            return newState;
        }

        case 'cards/reported': {
            const newState = {
                ...state,
                alert: {
                    hidden: false,
                    variant: 'success',
                    message: "Your cards have been logged!",
                },
                hidden: true,
                hiddenDuplicates: true,
            };

            return newState;
        }

        case 'cards/notReported': {
            const newState = {
                ...state,
                alert: {
                    hidden: false,
                    variant: 'danger',
                    message: "Oops, there was an issue and your cards haven't been logged",
                },
                hidden: true,
                hiddenDuplicates: true,
            };

            return newState;
        }

        default:
         return state;
    }
}