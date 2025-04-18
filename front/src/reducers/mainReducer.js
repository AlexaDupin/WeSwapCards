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
                    ...state.swap,
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
                    ...state.swap,
                    cardName: cardName,
                },
            }
        }

        case 'swap/ContactClicked': {
            const { swapExplorerId, swapExplorerName, swapExplorerOpportunities } = action.payload;

            return {
                ...state,
                swap: {
                    ...state.swap,
                    explorerId: swapExplorerId,
                    explorerName: swapExplorerName,
                    opportunities: swapExplorerOpportunities
                },
            }
        }

        case 'dashboard/opportunitiesFetched': {
            const swapExplorerOpportunities = action.payload;

            return {
                ...state,
                swap: {
                    ...state.swap,
                    opportunities: swapExplorerOpportunities
                },
            }
        }

        case 'dashboard/chatClicked': {
            const { conversationId, swapExplorerId, swapExplorerName, swapCardName } = action.payload;

            return {
                ...state,
                swap: {
                    ...state.swap,
                    conversationId: conversationId,
                    explorerId: swapExplorerId,
                    explorerName: swapExplorerName,
                    cardName: swapCardName
                },
            }
        }

        case 'chat/conversationFetched': {
            const fetchedConversationId = action.payload;

            return {
                ...state,
                swap: {
                    ...state.swap,
                    conversationId: fetchedConversationId,
                },
            }
        }

        case 'chat/conversationNotFetched': {
            return {
                ...state,
                swap: {
                    ...state.swap,
                    conversationId: '',
                },
            }
        }

        case 'explorer/created': {
            const {fetchedExplorerId , fetchedExplorerName} = action.payload;

            return {
                ...state,
                explorer: {
                    id: fetchedExplorerId,
                    name: fetchedExplorerName
                } 
            }
        }

        case 'user/fetched': {
            const fetchedUserUID = action.payload;

            return {
                ...state,
                userUID: fetchedUserUID
            }
        }

        default:
            return state;
    }
}