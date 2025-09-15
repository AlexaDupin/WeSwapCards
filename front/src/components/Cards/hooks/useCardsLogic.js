import { useEffect, useReducer, useState } from 'react';
import { axiosInstance } from '../../../helpers/axiosInstance';
import { useAuth } from '@clerk/clerk-react';
import { useStateContext } from '../../../contexts/StateContext';
import { initialState, reducer } from '../../../reducers/cardsReducer';

const useCardsLogic = () => {
    const stateContext = useStateContext();
    const { explorer } = stateContext;
    const { id: explorerId } = explorer;

    const [state, dispatch] = useReducer(reducer, initialState);
    const { getToken } = useAuth()
    const [isLoading, setIsLoading] = useState(true);
    const isNetworkError = (error) =>
      !navigator.onLine || error?.code === 'ERR_NETWORK' || error?.message === 'Network Error';


    const fetchAllChapters = async () => {
        try {
          const response = await axiosInstance.get('/places');
          const fetchedChapters = response.data.places;

          dispatch({
            type: 'chapters/fetched',
            payload: fetchedChapters
          })

        } catch (error) {
          dispatch({
            type: 'chapters/fetchedError',
          })        
        }
      };
      
      const fetchAllCards = async () => {
        try {
          const token = await getToken();
          const response = await axiosInstance.get('/cards', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const fetchedCards = response.data.cards;

          dispatch({
            type: 'cards/fetched',
            payload: fetchedCards
          })

        } catch (error) {
          dispatch({
            type: 'cards/fetchedError',
          })    
        }
      };
    
      const fetchAllCardStatuses = async (explorerId) => {
        // console.log('explorerId', explorerId);
        
        try {
          const token = await getToken();
          const response = await axiosInstance.get(`/cards/statuses/${explorerId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          // console.log('statuses', response.data.statuses);
          const fetchedCardStatuses = response.data.statuses;

          dispatch({
            type: 'cardStatuses/fetched',
            payload: fetchedCardStatuses
          })
        } catch (error) {
          dispatch({
            type: 'cardStatuses/fetchedError',
            payload: isNetworkError(error) ? { message: "There was an error reaching the server. Try again." } : undefined
          }) 
        }
      }
      
      useEffect(() => {
        const fetchData = async () => {
          try {
            await Promise.all([fetchAllChapters(), fetchAllCards(), fetchAllCardStatuses(explorerId)]);
          } finally {
            setIsLoading(false);
          }
        };
      
        fetchData();
      }, []);

      const getNextStatus = (current) => {
        switch (current) {
          case 'default': return 'owned';
          case 'owned': return 'duplicated';
          case 'duplicated': return 'owned';
          default: return 'owned';
        }
      };
    
      const upsertCard = async (cardId, duplicate) => {
        const token = await getToken();
        const response = await axiosInstance.put(`/explorercards/${explorerId}/cards/${cardId}`,
          { duplicate },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(`Card ${cardId} status updated`, response.data);
    
        if (response.status === 200 && response.data.duplicate === false) { 
          dispatch({
            type: 'cardStatuses/updatedToOwned',
            payload: { cardId },
          })
        } 
    
        if (response.status === 200 && response.data.duplicate === true) { 
          dispatch({
            type: 'cardStatuses/updatedToDuplicate',
            payload: { cardId },
          })
        } 
      };
    
    const handleSelect = async (cardId) =>  {
      const currentStatus = state.cardStatuses[cardId] || 'default';
      const nextStatus = getNextStatus(currentStatus);

      switch (nextStatus) {
        case 'owned':
          await upsertCard(cardId, false)
          break;
        case 'duplicated':
          await upsertCard(cardId, true)
          break;
        default: await upsertCard(cardId, false);
      }
    };

    const reset = async (cardId) => {  
      const current = state.cardStatuses[cardId] || 'default';
      if (current === 'default') return; 

      try {
        const token = await getToken();

        const response = await axiosInstance.delete(`/explorercards/${explorerId}/cards/${cardId}`,
        { headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          dispatch({
            type: 'cardStatuses/reset',
            payload: { cardId },
          })
          console.log(`Card ${cardId} has been deleted`);
        }

      } catch (error) {
        console.error("Error during card deletion", error);
      }
    };

  //   const fetchExplorerCardsByChapter = async () => {
  //     try {
  //       const response = await axiosInstance.get(
  //         `/explorercards/${explorerId}`, {
  //           headers: {
  //             Authorization: `Bearer ${await getToken()}`,
  //           },
  //         })
  //       const fetchedCardsByPlace = response.data;

  //       dispatch({
  //         type: 'cards/fetched',
  //         payload: fetchedCardsByPlace
  //       })

  //     } catch (error) {
  //       dispatch({
  //         type: 'cards/fetchedError',
  //       })
  //       // console.log(error);
  //     }
  // };

    return {
        state,
        handleSelect,
        reset,
        isLoading
    }
}

export default useCardsLogic;
