const savedExplorer = (() => {
    try {
      return JSON.parse(localStorage.getItem('explorer')) || { name: '', id: '' };
    } catch (e) {
      return { name: '', id: '' };
    }
  })();

export const initialState = {
    userUID: '',
    explorer: savedExplorer,
    swap: {
        explorerId: '',
        explorerName: '',
        cardName: '',
        opportunities: [],
        conversationId: ''
    },    
}

export const reducer = (state, action) => {
    switch (action.type) {
        case 'explorer/reset': {
            return {
                ...state,
                explorer: {
                    name: '',
                    id: '',
                },
            }
        }

        case 'explorer/set': {
            const { explorerName, explorerId } = action.payload;

            return {
                ...state,
                explorer: {
                    name: explorerName,
                    id: explorerId,
                },
            }
        }

        case 'swap/placeSelected': {
            return {
                ...state,
                swap: {
                    explorerId: '',
                    conversationId: '',
                },
            }
        }

        case 'swap/cardNameFetched': {
            const cardName = action.payload;

            return {
                ...state,
                swap: {
                    cardName: cardName,
                },
            }
        }

        case 'swap/ContactClicked': {
            const { swapExplorerId, swapExplorerName, swapExplorerOpportunities } = action.payload;

            return {
                ...state,
                swap: {
                    explorerId: swapExplorerId,
                    explorerName: swapExplorerName,
                    opportunities: swapExplorerOpportunities
                },
            }
        }

        default:
            return state;
    }
}