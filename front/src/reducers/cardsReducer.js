export const initialState = {
    loading: true,
    cardStatuses: {},
    chapters: [],
    cards: [],
    alert: {
        hidden: true,
        message: ''
    },
}

export const reducer = (state, action) => {
    switch (action.type) {
        case 'chapters/fetched': {
            const fetchedChapters = action.payload;

            return {
                ...state,
                chapters: fetchedChapters,
                loading: false
            }
        }

        case 'chapters/fetchedError': {
            return {
                ...state,
                loading: false,
                alert: {
                    hidden: false,
                    message: "There was an error fetching chapters. Try again."
                }
            }
        }

        case 'cards/fetched': {
            const fetchedCards = action.payload;

            return {
                ...state,
                cards: fetchedCards,
                loading: false
            }
        }

        case 'cards/fetchedError': {
            return {
                ...state,
                loading: false,
                alert: {
                    hidden: false,
                    message: "There was an error fetching cards. Try again."
                }
            }
        }

        case 'cardStatuses/fetched': {
            const fetchedCardStatuses = action.payload;

            return {
                ...state,
                cardStatuses: fetchedCardStatuses,
                loading: false
            }
        }

        case 'cardStatuses/fetchedError': {
            return {
                ...state,
                loading: false,
                alert: {
                    hidden: false,
                    message: action.payload?.message ?? "There was an error fetching statuses. Try again."
                }
            }
        }

        case 'cardStatuses/updatedToOwned': {
            return {
                ...state,
                cardStatuses: {
                    ...state.cardStatuses,
                    [action.payload.cardId]: 'owned',
                  },
                loading: false
            }
        }

        case 'cardStatuses/updatedToDuplicate': {
            return {
                ...state,
                cardStatuses: {
                    ...state.cardStatuses,
                    [action.payload.cardId]: 'duplicated',
                  },
                loading: false
            }
        }

        case 'cardStatuses/reset': {
            return {
                ...state,
                cardStatuses: {
                    ...state.cardStatuses,
                    [action.payload.cardId]: 'default',
                  },
                loading: false
            }
        }

        default: 
        return state;
    }
}