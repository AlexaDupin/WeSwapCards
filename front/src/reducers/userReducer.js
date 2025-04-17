export const initialState = {
    userUID: '',
    explorer: {
        name: '',
        id: '',
    },
    alert: {
        hidden: true,
        message: 'You already have an account. Please log in.'
    }
}

export const reducer = (state, action) => {
    switch (action.type) {
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

        case 'explorer/notCreated': {
            return {
                ...state,
                alert: {
                    hidden: false,
                    message: 'There was an issue while submitting your username.'
                } 
            }
        }

        case 'explorer/errorAlreadyRegistered': {
            return {
                ...state,
                explorer: {
                    id: '',
                    name: ''
                }, 
                alert: {
                    hidden: false,
                    message: 'You already chose a username. You can go back to the menu.'
                } 
            }
        }

        case 'explorer/errorAlreadyTaken': {
            return {
                ...state,
                explorer: {
                    id: '',
                    name: ''
                }, 
                alert: {
                    hidden: false,
                    message: 'This username is already taken. Please try another one.'
                } 
            }
        }

        case 'explorer/errorGeneral': {
            return {
                ...state,
                explorer: {
                    id: '',
                    name: ''
                }, 
                alert: {
                    hidden: false,
                    message: 'There was an issue with your request. Please try again.'
                } 
            }
        }

        case 'explorer/errorUnexpected': {
            return {
                ...state,
                explorer: {
                    id: '',
                    name: ''
                }, 
                alert: {
                    hidden: false,
                    message: 'An unexpected error occurred. Please try again later.'
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

        case 'user/notFetched': {
            return {
                ...state,
                explorer: {
                    id: '',
                    name: ''
                }             
            }
        }

        default: 
            return state;
    }
}