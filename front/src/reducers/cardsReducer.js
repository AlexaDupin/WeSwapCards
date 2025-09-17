import { replaceStatuses, snapshotToStatusesMap, makeAllOwned } from "../helpers/statuses";

export const initialState = {
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

        case 'bulk/allOwnedStarted': {
            return {
              ...state,
              bulkUpdating: true,
            };
          }
      
          case 'bulk/allOwnedOptimistic': {
            const allCardIds = action.payload?.allCardIds ?? [];
            const snapshotBefore = action.payload?.snapshotBefore ?? [];
          
            // Optimistically set every card to 'owned'
            const allOwnedMap = makeAllOwned(allCardIds);
          
            return {
              ...state,
              cardStatuses: replaceStatuses(allOwnedMap),
              lastUndo: { type: 'allOwned', snapshot: snapshotBefore },
              bulkUpdating: true,
            };
          }
          
          case 'bulk/allOwnedFailed': {
            const snapshotBefore = action.payload?.snapshotBefore ?? [];
            const rollbackMap = snapshotToStatusesMap(snapshotBefore);
            return {
              ...state,
              cardStatuses: replaceStatuses(rollbackMap),
              lastUndo: null,
              bulkUpdating: false,
            };
          }
      
          case 'bulk/allOwnedSuccess': {
            return {
              ...state,
              bulkUpdating: false,
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