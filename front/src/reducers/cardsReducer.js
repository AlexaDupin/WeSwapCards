import { replaceStatuses } from "../helpers/statuses";

export const initialState = {
    loading: true,
    cardStatuses: {},
    chapters: [],
    cards: [],
    bulkUpdating: false,
    alert: {
        hidden: true,
        message: ''
    },
    lastUndo: null,
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

        case 'bulk/allOwnedStarted': {
            return {
              ...state,
              bulkUpdating: true,
              alert: { hidden: true, message: '' },
            };
          }
      
          case 'bulk/allOwnedOptimistic': {
            const { cardIds } = action.payload;
            const next = { ...state.cardStatuses };
            for (const id of cardIds) {
              next[id] = next[id] === 'duplicated' ? 'duplicated' : 'owned';
            }
            return { ...state, cardStatuses: next };
          }
          
          case 'bulk/allOwnedFailed': {
            const { rollbackTo } = action.payload;
            return {
              ...state,
              bulkUpdating: false,
              cardStatuses: rollbackTo,
              alert: {
                hidden: false,
                message: 'Bulk update failed. Nothing was changed.',
              },
            };
          }
      
          case 'bulk/allOwnedSuccess': {
            return {
              ...state,
              bulkUpdating: false,
            };
          }

          case 'statuses/bulkReplace': {
            return {
              ...state,
              cardStatuses: action.payload,
            };
          }

          case 'bulk/undoFailed': {
            return {
              ...state,
              alert: {
                hidden: false,
                message: action.payload?.message || 'Undo failed to persist on server.',
              },
            };
          }

          case 'cards/allDeleted': {
            const snapshot = action.payload?.snapshot || [];

            return {
              ...state,
              cardStatuses: replaceStatuses({}), // or {}
              lastUndo: { type: 'deleteAll', snapshot },
            };
          }
      
          case 'cards/bulkDeleteError': {
            return {
              ...state,
              alert: { hidden: false, message: 'There was an error clearing your cards. Try again.' },
            };
          }
      
          case 'cards/restoreBulkSuccess': {
            // merged was already produced in the hook via replaceStatuses
            return {
              ...state,
              cardStatuses: action.payload.merged,
              lastUndo: null,
            };
          }
      
          case 'cards/restoreBulkError': {
            return {
              ...state,
              alert: { hidden: false, message: 'Undo failed. Your cards were not restored.' },
            };
          }

        default: 
        return state;
    }
}