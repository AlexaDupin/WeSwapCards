export const initialState = {
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
            }
        }

        case 'chapters/fetchedError': {
            return {
                ...state,
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
            }
        }

        case 'cards/fetchedError': {
            return {
                ...state,
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
            }
        }

        case 'cardStatuses/fetchedError': {
            return {
                ...state,
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
            }
        }

        case 'cardStatuses/updatedToDuplicate': {
            return {
                ...state,
                cardStatuses: {
                    ...state.cardStatuses,
                    [action.payload.cardId]: 'duplicated',
                  },
            }
        }

        case 'cardStatuses/reset': {
            return {
                ...state,
                cardStatuses: {
                    ...state.cardStatuses,
                    [action.payload.cardId]: 'default',
                  },
            }
        }

        case "cards/bulkSetChapterStatus": {
          const { chapterId, status } = action.payload;
          const nextStatuses = { ...state.cardStatuses };
          
          for (const card of state.cards) {
            if (card.place_id === chapterId) {
              nextStatuses[card.id] = status;
            }
          }
    
          return {
            ...state,
            cardStatuses: nextStatuses,
          };
        }

        default: 
        return state;
    }
}