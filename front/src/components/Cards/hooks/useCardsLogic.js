import { useEffect, useReducer, useState } from 'react';
import { axiosInstance } from '../../../helpers/axiosInstance';
import { useAuth } from '@clerk/clerk-react';
import { useStateContext } from '../../../contexts/StateContext';
import { initialState, reducer } from '../../../reducers/cardsReducer';

const useCardsLogic = () => {
    const stateContext = useStateContext();
    const { explorer } = stateContext;
    const { id: explorerId, name } = explorer;

    const [state, dispatch] = useReducer(reducer, initialState);
    const { getToken } = useAuth()
    const [cardStatuses, setCardStatuses] = useState({});
    const [chapters, setChapters] = useState([]);
    const [cards, setCards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAllChapters = async () => {
        try {
          const response = await axiosInstance.get('/places');
          setChapters(response.data.places);
        } catch (error) {
          console.error("Error fetching chapters", error);
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
          setCards(response.data.cards);
        } catch (error) {
          console.error("Error fetching cards", error);
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
          setCardStatuses(response.data.statuses);
        } catch (error) {
          console.error("Error fetching statuses", error);
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
          setCardStatuses(prev => ({ ...prev, [cardId]: 'owned' }));
        } 
    
        if (response.status === 200 && response.data.duplicate === true) { 
          setCardStatuses(prev => ({ ...prev, [cardId]: 'duplicated' }));
        } 
      };
    
    const handleSelect = async (cardId) =>  {
      const currentStatus = cardStatuses[cardId] || 'default';
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
      try {
        const token = await getToken();

        const response = await axiosInstance.delete(`/explorercards/${explorerId}/cards/${cardId}`,
        { headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setCardStatuses(prev => ({ ...prev, [cardId]: 'default' }));
          console.log(`Card ${cardId} has been deleted`);
        }

      } catch (error) {
        console.error("Error during card deletion", error);
      }
    };

    return {
        state,
        name,
        explorerId,
        dispatch,
        cardStatuses,
        cards,
        chapters,
        handleSelect,
        reset,
        isLoading
    }
}

export default useCardsLogic;
