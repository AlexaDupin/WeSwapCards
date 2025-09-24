import { useEffect, useReducer, useState, useCallback } from 'react';
import { axiosInstance } from '../../../helpers/axiosInstance';
import { useAuth } from '@clerk/clerk-react';
import { useStateContext } from '../../../contexts/StateContext';
import { initialState, reducer } from '../../../reducers/cardsReducer';
import { useNavigate } from 'react-router-dom';
import { replaceStatuses, snapshotToStatusesMap, statusesMapToSnapshot } from '../../../helpers/statuses';

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

    // const handleBulkSetAllOwned = useCallback(async () => {
    //   const allCardIds = state.cards?.map(card => card.id) ?? [];
    //   if (!explorerId || allCardIds.length === 0) return false;

    //   const snapshotBefore = statusesMapToSnapshot(allCardIds, state.cardStatuses);
  
    //   dispatch({ type: 'bulk/allOwnedStarted' });
    //   dispatch({ type: 'bulk/allOwnedOptimistic', payload: { allCardIds, snapshotBefore } });
  
    //   try {
    //     const token = await getToken();

    //     const statuses = Object.create(null);
    //     for (const id of allCardIds) {
    //       statuses[id] = state.cardStatuses[id] === 'duplicated' ? 'duplicated' : 'owned';
    //     }

    //     const response = await axiosInstance.post(`/cards/statuses/${explorerId}/replace`,
    //       { statuses },
    //       { headers: { Authorization: `Bearer ${token}` } }
    //     );

    //     if (response.status === 200) {
    //       dispatch({ type: 'bulk/allOwnedSuccess' });
    //       return true;
    //     } else {
    //       throw new Error('Bad status');
    //     }
  
    //   } catch (error) {
    //     dispatch({ type: 'bulk/allOwnedFailed', payload: { snapshotBefore } });
    //     return false;
    //   }
    // }, [explorerId, state?.cards, state?.cardStatuses, getToken, dispatch]);

    // const deleteAllCardsBulk = async () => {
    //   try {
    //     setIsLoading(true);
    //     const token = await getToken();
    //     const { data } = await axiosInstance.delete(`/explorercards/${explorerId}/cards`, {
    //       headers: { Authorization: `Bearer ${token}` },
    //     });
  
    //     const snapshot = Array.isArray(data?.snapshot) ? data.snapshot : [];
  
    //     dispatch({
    //       type: 'cards/allDeleted',
    //       payload: { snapshot },
    //     });
    //     return true;

    //   } catch (error) {
    //     console.error(error);
    //     dispatch({ type: 'cards/bulkDeleteError' });
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
  
    // --- Undo last bulk operation (works for Delete-all now, Mark-all-duplicated later) ---
    const undoLastBulk = async () => {
      const snapshot = state.lastUndo?.snapshot;
      if (!Array.isArray(snapshot) || !snapshot.length) return;
  
      try {
        setIsLoading(true);
        const token = await getToken();
        await axiosInstance.post(
          `/explorercards/${explorerId}/cards/restore-bulk`,
          { items: snapshot },
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        // Rebuild map from snapshot and replace via helper
        const restoredMap = snapshotToStatusesMap(snapshot);
        const normalized = replaceStatuses(restoredMap);
        dispatch({ type: 'cards/restoreBulkSuccess', payload: { merged: normalized } });
      } catch (error) {
        console.error(error);
        dispatch({ type: 'cards/restoreBulkError' });
      } finally {
        setIsLoading(false);
      }
    };

    // const handleBulkSetAllDuplicated = useCallback(async () => {
    //   const allCardIds = state.cards?.map(card => card.id) ?? [];
    //   if (!explorerId || allCardIds.length === 0) return false;

    //   const snapshotBefore = statusesMapToSnapshot(allCardIds, state.cardStatuses);

    //   dispatch({ type: 'bulk/allDuplicatedStarted' });
    //   dispatch({ type: 'bulk/allDuplicatedOptimistic', payload: { allCardIds, snapshotBefore } });

    //   try {
    //     const token = await getToken();
    //     const response = await axiosInstance.post(
    //       `/cards/statuses/${explorerId}`,
    //       { cardIds: allCardIds, duplicate: true },
    //       { headers: { Authorization: `Bearer ${token}` } }
    //     );

    //     if (response.status === 200) {
    //       dispatch({ type: 'bulk/allDuplicatedSuccess' });
    //       return true;
    //     } else {
    //       throw new Error('Bad status');
    //     }
    //   } catch (error) {
    //     dispatch({ type: 'bulk/allDuplicatedFailed', payload: { snapshotBefore } });
    //     return false;
    //   }
    // }, [explorerId, state?.cards, state?.cardStatuses, getToken, dispatch]);

    const handleBulkSetAllOwned = useCallback(async () => {
      const allCardIds = state.cards?.map(card => card.id) ?? [];
      if (!explorerId || allCardIds.length === 0) return false;

      const snapshotBefore = statusesMapToSnapshot(allCardIds, state.cardStatuses);
  
      dispatch({ type: 'bulk/allOwnedStarted' });
      dispatch({ type: 'bulk/allOwnedOptimistic', payload: { allCardIds, snapshotBefore } });
  
      try {
        const token = await getToken();

        const response = await axiosInstance.post(
           `/cards/statuses/${explorerId}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
          dispatch({ type: 'bulk/allOwnedSuccess' });
          return true;
        } else {
          throw new Error('Bad status');
        }
  
      } catch (error) {
        dispatch({ type: 'bulk/allOwnedFailed', payload: { snapshotBefore } });
        return false;
      }
    }, [explorerId, state?.cards, state?.cardStatuses, getToken, dispatch]);

    const handleBulkSetAllDuplicated = useCallback(async () => {
      const allCardIds = state.cards?.map(card => card.id) ?? [];
      if (!explorerId || allCardIds.length === 0) return false;

      const snapshotBefore = statusesMapToSnapshot(allCardIds, state.cardStatuses);

      dispatch({ type: 'bulk/allDuplicatedStarted' });
      dispatch({ type: 'bulk/allDuplicatedOptimistic', payload: { allCardIds, snapshotBefore } });

      try {
        const token = await getToken();
        const response = await axiosInstance.post(
          `/cards/statuses/${explorerId}`,
          { duplicate: true },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
          dispatch({ type: 'bulk/allDuplicatedSuccess' });
          return true;
        } else {
          throw new Error('Bad status');
        }
      } catch (error) {
        dispatch({ type: 'bulk/allDuplicatedFailed', payload: { snapshotBefore } });
        return false;
      }
    }, [explorerId, state?.cards, state?.cardStatuses, getToken, dispatch]);

    return {
        state,
        handleSelect,
        reset,
        isLoading,
        handleBulkSetAllOwned,
        handleBulkSetAllDuplicated,
        undoLastBulk,
    }
}

export default useCardsLogic;
