import { useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePagination } from '../../../hooks/usePagination';
import { axiosInstance } from '../../../helpers/axiosInstance';
import { useAuth } from '@clerk/clerk-react';

import { initialState, reducer } from '../../../reducers/swapReducer';
import { useStateContext } from '../../../contexts/StateContext';
import { useDispatchContext } from '../../../contexts/DispatchContext';

const useSwapLogic = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const stateContext = useStateContext();
    const mainDispatch = useDispatchContext();
    const explorerId = stateContext.explorer.id;
    const name = stateContext.explorer.name;
    const swapCardName = stateContext.swap.cardName;

    const { getToken } = useAuth()
    const navigate = useNavigate();

    // Fetch all places to show in dropdown
    const fetchAllPlaces = async () => {
      try {
        const response = await axiosInstance.get(`/places`, {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
          withCredentials: true,
          }
        );

        dispatch({
          type: 'places/fetched',
          payload: response.data.places
        })

      } catch (error) {
        dispatch({
          type: 'places/fetchedError',
        })

        // console.log(error);      
      }
    };

    // When a place is selected, fetch all cards in that place
    // + cards and duplicates already logged for this explorer in the db so they are highlighted
    const handleSelectPlace = async (placeId) => {
      try {
        const allCards = await axiosInstance.get(`/cards/${placeId}`, {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
          withCredentials: true,
          }
        );
        dispatch({
          type: 'places/selected',
          payload: allCards.data.cards
        })

        mainDispatch({
          type: 'swap/placeSelected',
        })

      } catch (error) {
        dispatch({
          type: 'places/selectedError',
        })

        // console.log(error);
      }
    };

    const fetchSearchedCardName = async (cardId) => {
      try {
        const response = await axiosInstance.get(
        `/card/${cardId}`, {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
          withCredentials: true,
          }
        );

      const cardName = response.data.name;
      // console.log("cardName", cardName);
      mainDispatch({
        type: 'swap/cardNameFetched',
        payload: cardName
      })

    } catch (error) {
      dispatch({
        type: 'cardName/fetchedError',
      })
      // console.log(error);
    }
  };

    const { 
      data: swapOpportunities, 
      activePage,
      totalPages,
      setActivePage,
      handlePageChange,
      refresh
    } = usePagination(
      state.selectedCardId ? `/opportunities/${explorerId}/card/${state.selectedCardId}` : '', 
      20
    );

    const fetchSwapOpportunities = async (cardId) => {
      dispatch({
        type: 'swapOpportunities/fetched',
        payload: cardId
      })
      fetchSearchedCardName(cardId);

      await refresh();
      setActivePage(1);
      dispatch({
        type: 'swapOpportunities/fetchedRefresh',
      })
    };

    const handleContactButton = (swapExplorerId, swapExplorerName, swapExplorerOpportunities) => {
      mainDispatch({
        type: 'swap/ContactClicked',
        payload:  { swapExplorerId, swapExplorerName, swapExplorerOpportunities }
      })
      
      navigate('/swap/card/chat', { state: { from: "/swap/card" } });
    }

    const isRecentlyActive = (lastActiveAt) => {
      const lastActiveDate = new Date(lastActiveAt); 
    
      const twoDaysAgo = new Date();
      twoDaysAgo.setHours(twoDaysAgo.getHours() - 48);
    
      return lastActiveDate > twoDaysAgo;
    }; 

    const handleMobileTooltip = (explorerId) => {
      dispatch({
        type: 'activeTooltips/set',
        payload: explorerId
      })
    };

    useEffect(
      () => {
        if (!explorerId) {
          navigate('/login/redirect', { state: { from: "/swap/card" } });
        } else {
        fetchAllPlaces();
        }
      }, [],
    );

    return {
        state,
        name,
        handleSelectPlace,
        fetchSwapOpportunities,
        swapOpportunities,
        swapCardName,
        isRecentlyActive,
        handleMobileTooltip,
        handleContactButton,
        activePage,
        totalPages,
        handlePageChange
    }
}

export default useSwapLogic;