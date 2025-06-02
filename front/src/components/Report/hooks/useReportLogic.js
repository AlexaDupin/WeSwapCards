import { useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useStateContext } from '../../../contexts/StateContext';
import { initialState, reducer } from '../../../reducers/reportReducer';

import { fetchPlaces, fetchCardsForPlace, fetchExplorerCards, fetchExplorerDuplicates, submitReport } from '../api/reportApi';

const useReportLogic = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const stateContext = useStateContext();
    const explorerId = stateContext.explorer.id;
    const name = stateContext.explorer.name;
    const navigate = useNavigate();
    const { getToken } = useAuth()

    // Fetch all places to show in dropdown
    const fetchAllPlaces = async () => {
      const token = await getToken();

      try {
        const placesFetched = await fetchPlaces(token);

        dispatch({
          type: 'places/fetched',
          payload: placesFetched
        })
      } catch (error) {
        // console.log(error);
        dispatch({
          type: 'places/error',
        })
      }
    };

    // When a place is selected, fetch all cards in that place
    // + cards and duplicates already logged for this explorer in the db so they are highlighted
    const handleSelectPlace = async (placeId) => {
      const token = await getToken();

      try {
        const [cards, selectedCards, duplicates] = await Promise.all([
            fetchCardsForPlace(placeId, token),
            fetchExplorerCards(placeId, explorerId, token),
            fetchExplorerDuplicates(placeId, explorerId, token)
        ]);

        dispatch({
          type: 'place/selected',
          payload: { cards, selectedCards, duplicates }
        })

      } catch (error) {
        dispatch({
          type: 'places/error',
        })
      }
    };

    // On submit, log selected cards and duplicate selection into db
    const handleSubmit = async (event) => {
      event.preventDefault();
      // Extracting ids of selected cards and duplicates
      const selectedCardsIds = state.selectedCards.map(item => item.id);
      const duplicatesIds = state.duplicates.map(item => item.id);
      const toBeDeletedIds = state.toBeDeleted.map(item => item.id);

      // Combine the data to send
      const payload = {
        selectedCardsIds,
        duplicatesIds,
        toBeDeletedIds
      };

      const maxRetries = 3;
      const delayBetweenRetries = 1000;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const token = await getToken();
              if (!token) {
                  // console.error("Token is not available!");
                  return;
              }

            const response = await submitReport(explorerId, payload, token);

            dispatch({ type: response.status === 201 ? "cards/reported" : "cards/notReported" });


        } catch (error) {
          // console.error(`Attempt ${attempt} to log cards:`, error);
          if (attempt < maxRetries) {
            // console.log(`Retrying in ${delayBetweenRetries / 1000} seconds...`);
            await new Promise((resolve) => setTimeout(resolve, delayBetweenRetries));
          } else {
            dispatch({
              type: 'cards/notReported',
            })
          return;
          }
        }
      }
    };  

    // Add card to selected cards if not in it
    const handleCardSelection = (card) => {
      dispatch({
        type: 'cards/selected',
        payload: card,
      })
    };

    // Handle Select All in cards section
    const handleSelectAllCards = (event) => {
      event.preventDefault();
      dispatch({
        type: 'cards/selectedAll',
        payload: state.cards,
      })
    };

    // Add card to duplicate selection array if not in it
    const handleCardDuplicate = (card) => {
      dispatch({
        type: 'cards/duplicates',
        payload: card,
      })
    };

    // Handle Select All in duplicates section
    const handleSelectAllDuplicates = (event) => {
      event.preventDefault();
      dispatch({
        type: 'duplicates/selectedAll',
        payload: state.cards,
      })
    };

    const showDuplicateSection = () => {
        if (state.selectedCards.length > 0) {
          dispatch({
            type: 'duplicates/show',
          })
        } else {
          dispatch({
            type: 'duplicates/notshow',
          })
        }
    };
      
    useEffect(
      () => { 
        if (!explorerId) {
          navigate('/login/redirect', { state: { from: "/report" } });
        } else {
          fetchAllPlaces();
        }
      }, [],
    );

    useEffect(
      () => {
        showDuplicateSection();
        },
      [state.selectedCards],
    );

    return {
        state,
        name,
        handleSelectPlace,
        handleSubmit,
        handleCardSelection,
        handleSelectAllCards,
        handleCardDuplicate,
        handleSelectAllDuplicates
    }
}

export default useReportLogic;
