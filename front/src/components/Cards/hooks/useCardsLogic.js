import { useEffect, useReducer, useState, useCallback } from 'react';
import { axiosInstance } from '../../../helpers/axiosInstance';
import { useAuth } from '@clerk/clerk-react';
import { useStateContext } from '../../../contexts/StateContext';
import { initialState, reducer } from '../../../reducers/cardsReducer';

const useCardsLogic = () => {
    const { explorer } = useStateContext();
    const { id: explorerId } = explorer || {};
    const { isLoaded: isClerkLoaded, isSignedIn, getToken } = useAuth();

    const isPublic = !isSignedIn || !explorerId;

    const [state, dispatch] = useReducer(reducer, initialState);
    const [isLoading, setIsLoading] = useState(true);

    const [pendingChapters, setPendingChapters] = useState(new Set());
    const isChapterPending = useCallback((id) => pendingChapters.has(id), [pendingChapters]);

    const isNetworkError = (err) =>
      !navigator.onLine || err?.code === 'ERR_NETWORK' || err?.message === 'Network Error';

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
        const response = await axiosInstance.get('/cards');
        dispatch({
          type: 'cards/fetched',
          payload: response.data.cards
        })
      } catch (error) {
        dispatch({
          type: 'cards/fetchedError',
        })    
      }
    };
  
    const fetchAllCardStatuses = async () => {
      // console.log('explorerId', explorerId);
      if (isPublic) {
        dispatch({ type: 'cardStatuses/fetched', payload: {} });
        return;
      }
      
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
      if (!isClerkLoaded) return;

      const load = async () => {
        try {
          await Promise.all([
            fetchAllChapters(),
            fetchAllCards(),
            fetchAllCardStatuses(),
          ]);
        } finally {
          setIsLoading(false);
        }
      };
      load();
    }, [isClerkLoaded, explorerId, isSignedIn]);

    const getNextStatus = (current) => {
      switch (current) {
        case 'default': return 'owned';
        case 'owned': return 'duplicated';
        case 'duplicated': return 'owned';
        default: return 'owned';
      }
    };
    
    const upsertCard = useCallback(async (cardId, duplicate) => {
      if (isPublic) return;
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
    }, [isPublic, explorerId, getToken, dispatch]);

    const handleSelect = useCallback(async (cardId) =>  {
      if (isPublic) return;
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
    }, [isPublic, state.cardStatuses, upsertCard]);

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

    const markAllOwnedInChapter = useCallback( async (chapterId) => {
        if (isPublic || pendingChapters.has(chapterId)) return;

        setPendingChapters((prev) => new Set(prev).add(chapterId));
  
        try {
          const token = await getToken();
          await axiosInstance.post(
            `/explorercards/${explorerId}/chapters/${chapterId}/status`,
            { status: 'owned' },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
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
      [isPublic, dispatch, explorerId, getToken, pendingChapters]
    );
  
    const markAllDuplicatedInChapter = useCallback(async (chapterId) => {
        if (isPublic || pendingChapters.has(chapterId)) return;

        setPendingChapters((prev) => new Set(prev).add(chapterId));

        try {
          const token = await getToken();
          await axiosInstance.post(
            `/explorercards/${explorerId}/chapters/${chapterId}/status`,
            { status: 'duplicated' },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
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
       [isPublic, dispatch, explorerId, getToken, pendingChapters]
    );

    return {
        state,
        isLoading,
        isPublic,
        handleSelect,
        reset,
        markAllOwnedInChapter,
        markAllDuplicatedInChapter,
        isChapterPending,
    }
}

export default useCardsLogic;
