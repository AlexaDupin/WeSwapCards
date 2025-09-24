import { useEffect, useReducer, useState, useCallback } from 'react';
import { axiosInstance } from '../../../helpers/axiosInstance';
import { useAuth } from '@clerk/clerk-react';
import { useStateContext } from '../../../contexts/StateContext';
import { initialState, reducer } from '../../../reducers/cardsReducer';
import { useNavigate } from 'react-router-dom';

const useCardsLogic = () => {
    const stateContext = useStateContext();
    const { explorer } = stateContext;
    const { id: explorerId } = explorer;

    const [state, dispatch] = useReducer(reducer, initialState);
    const { getToken } = useAuth()
    const [isLoading, setIsLoading] = useState(true);
    const isNetworkError = (error) =>
    !navigator.onLine || error?.code === 'ERR_NETWORK' || error?.message === 'Network Error';
    const navigate = useNavigate();

    const [pendingChapters, setPendingChapters] = useState(new Set());
    const isChapterPending = useCallback((id) => pendingChapters.has(id), [pendingChapters]);

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
  
    const fetchAllCardStatuses = async () => {
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
        if (!explorerId) {
          navigate('/login/redirect', { state: { from: "/cards" } });
        } else {
          try {
            await Promise.all([fetchAllChapters(), fetchAllCards(), fetchAllCardStatuses()]);
          } finally {
            setIsLoading(false);
          }
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
    
    const upsertCard = useCallback(async (cardId, duplicate) => {
      const token = await getToken();
      const response = await axiosInstance.put(`/explorercards/${explorerId}/cards/${cardId}`,
        { duplicate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // console.log(`Card ${cardId} status updated`, response.data);
  
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
    }, [explorerId, getToken, dispatch]);

    const handleSelect = useCallback(async (cardId) =>  {
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
    }, [state.cardStatuses, upsertCard]);

    const reset = useCallback(async (cardId) => {
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
          // console.log(`Card ${cardId} has been deleted`);
        }

      } catch (error) {
        console.error("Error during card deletion", error);
      }
    }, [state.cardStatuses, explorerId, getToken, dispatch]);

    const markAllOwnedInChapter = useCallback(
      async (chapterId) => {
        if (pendingChapters.has(chapterId)) return;

        setPendingChapters((prev) => {
          const next = new Set(prev);
          next.add(chapterId);
          return next;
        });
  
        try {
          const token = await getToken();
          await axiosInstance.post(
            `/bulk/explorercards/${explorerId}/chapters/${chapterId}/mark`,
            { status: 'owned' },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          dispatch({ type: 'cards/bulkSetChapterStatus', payload: { chapterId, status: 'owned' } });

        } catch (e) {
          dispatch({
            type: 'cardStatuses/fetchedError',
            payload: { message: 'Could not mark this chapter as owned. Try again.' },
          });
        } finally {
          setPendingChapters((prev) => {
            const next = new Set(prev);
            next.delete(chapterId);
            return next;
          });
        }
      },
      [dispatch, explorerId, getToken, pendingChapters]
    );
  
    const markAllDuplicatedInChapter = useCallback(
      async (chapterId) => {
        if (pendingChapters.has(chapterId)) return;

        setPendingChapters((prev) => {
          const next = new Set(prev);
          next.add(chapterId);
          return next;
        });

        try {
          const token = await getToken();
          await axiosInstance.post(
            `/bulk/explorercards/${explorerId}/chapters/${chapterId}/mark`,
            { status: 'duplicated' },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          dispatch({ type: 'cards/bulkSetChapterStatus', payload: { chapterId, status: 'duplicated' } });

         } catch (e) {
           dispatch({
             type: 'cardStatuses/fetchedError',
             payload: { message: 'Could not mark this chapter as duplicated. Try again.' },
           });
         } finally {
           setPendingChapters((prev) => {
             const next = new Set(prev);
             next.delete(chapterId);
             return next;
           });
         }
       },
       [dispatch, explorerId, getToken, pendingChapters]
    );

    return {
        state,
        handleSelect,
        reset,
        isLoading,
        markAllOwnedInChapter,
        markAllDuplicatedInChapter,
        isChapterPending,
    }
}

export default useCardsLogic;
