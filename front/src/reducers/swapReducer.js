export const initialState = {
    places: [],
    cards: [],
    hidden: true,
    hiddenSwapOpportunities: true,
    activeTooltips: {},
    alert: {
        hidden: true,
        message: ''
    },
    selectedCardId: '',
    loadingOpportunities: true
}

export const reducer = (state, action) => {
    switch (action.type) {
        case 'places/fetched': {
            const fetchedPlaces = action.payload;

            return {
                ...state,
                places: fetchedPlaces
            }
        }

        case 'places/fetchedError': {
            return {
                ...state,
                alert: {
                    hidden: false,
                    message: 'There was an error reaching the server. Try again.'
                }
            }
        }

        case 'places/selected': {
            const fetchedCards = action.payload;

            return {
                ...state,
                cards: fetchedCards,
                hidden: false,
                hiddenSwapOpportunities: true,
                // setSwapExplorerId + setConversationId
            }
        }

        case 'places/selectedError': {
            return {
                ...state,
                alert: {
                    hidden: false,
                    message: 'There was an error reaching the server. Try again.'
                }
            }
        }

        case 'cardName/fetchedError': {
            return {
                ...state,
                alert: {
                    hidden: false,
                    message: 'There was an error reaching the server. Try again.'
                }
            }
        }

        case 'swapOpportunities/fetched': {
            const cardId = action.payload;

            return {
                ...state,
                loadingOpportunities: true,
                selectedCardId: cardId,
                activeTooltips: {},
                hidden: false
            }
        }

        case 'swapOpportunities/fetchedRefresh': {
            return {
                ...state,
                loadingOpportunities: false,
                hiddenSwapOpportunities: false,
                // setActivePage 
            }
        }

        case 'activeTooltips/set': {
            const explorerId = action.payload;

            return {
                ...state,
                activeTooltips: {
                    ...Object.keys(state.activeTooltips).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
                    [explorerId]: !state.activeTooltips[explorerId],
                }
            }
        }

        default: 
            return state
    }
}