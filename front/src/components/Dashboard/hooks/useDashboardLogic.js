import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { axiosInstance } from '../../../helpers/axiosInstance';
import { useStateContext } from '../../../contexts/StateContext';
import { useDispatchContext } from '../../../contexts/DispatchContext';
import { usePagination } from '../../../hooks/usePagination';

const useDashboardLogic = () => {
    const state = useStateContext();
    const dispatch = useDispatchContext();
    const explorerId = state.explorer.id;
    const { getToken } = useAuth();
    const navigate = useNavigate();

    const [hiddenAlert, setHiddenAlert] = useState(true);
    const [alertMessage, setAlertMessage] = useState('');

    const { 
        data,
        setData,
        loading, 
        error,
        activePage, 
        totalPages, 
        totalItems,
        handlePageChange,
        refresh: refreshConversations
    } = usePagination(explorerId ? `/conversation/${explorerId}` : null, 40);
    
    // Show alert when error occurs
    useEffect(() => {
      if (error) {
        setHiddenAlert(false);
        setAlertMessage(error);
      }
    }, [error]);
    
    const fetchSwapOpportunitiesForRecipient = async (creatorId, recipientId, conversationId) => {
      try {
        const response = await axiosInstance.get(
            `/conversation/${conversationId}/opportunities/${creatorId}/${recipientId}`
            , {
              headers: {
                Authorization: `Bearer ${await getToken()}`,
              },
            });
        // console.log('response', response, response.data);
        dispatch({
          type: 'dashboard/opportunitiesFetched',
          payload: response.data
        })

      } catch (error) {
        setHiddenAlert(false);
        setAlertMessage("There was an error while fetching the opportunities");
        // console.log(error);
      }
    };

    const handleOpenChat = async (swapCardName, swapExplorerId, swapExplorerName, creatorId, recipientId, conversationId) => {
        // console.log(swapCardName, swapExplorerId, swapExplorerName, creatorId, recipientId, conversationId);
        
        dispatch({
          type: 'dashboard/chatClicked',
          payload: { conversationId, swapExplorerId, swapExplorerName, swapCardName }
        })

        fetchSwapOpportunitiesForRecipient(creatorId, recipientId, conversationId);

        navigate('/swap/card/chat', { state: { from: "/swap/dashboard" } });
    };

    const handleStatusChange = async (conversationId, newStatus) => {
        const updated = data.map((conv) =>
          conv.db_id === conversationId ? { ...conv, status: newStatus } : conv
        );
        setData(updated);
      
        try {
        await axiosInstance.put(
          `/conversation/${conversationId}`,
          { status: newStatus }, 
          {
            headers: {
              Authorization: `Bearer ${await getToken()}`,
            },
          });
        refreshConversations();
      } catch (error) {
        // console.error('Error updating status:', error);
      }
    };

    const getDropdownClass = (status) => {
      switch (status) {
        case 'In progress':
          return 'secondary'; 
        case 'Completed':
          return 'completed';
        case 'Declined':
            return 'declined'; 
          default:
            return 'secondary';
        }
      };
    
    const updateLastActive = async () => {
        try {
          const token = await getToken();

          await axiosInstance.post(
            `/exploreractivity/${explorerId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
          });
          // console.log("Successfully updated last active timestamp");        
          return;
          
        } catch (error) {
            // console.error("Error updating last active:", error);
            return;
        }
        
    };

    useEffect(() => {
      if (!explorerId) {
        navigate('/login/redirect', { state: { from: "/swap/dashboard" } });
        return;
      }
      updateLastActive();
    }, [explorerId]);
    
    return {
      conversations: data,
      loading,
      activePage,
      totalPages,
      totalItems,
      handlePageChange,
      handleOpenChat,
      getDropdownClass,
      handleStatusChange,
      hiddenAlert,
      alertMessage,
    }
}

export default useDashboardLogic;