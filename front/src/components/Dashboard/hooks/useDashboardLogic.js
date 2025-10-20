import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { axiosInstance } from '../../../helpers/axiosInstance';
import { useStateContext } from '../../../contexts/StateContext';
import { useDispatchContext } from '../../../contexts/DispatchContext';
import { usePagination } from '../../../hooks/usePagination';
import { useDebounce } from '../../../hooks/useDebounce';
import { DEMO_CONVERSATIONS } from '../demo/publicConversations';

const useDashboardLogic = () => {
    const state = useStateContext();
    const dispatch = useDispatchContext();
    const explorerId = state.explorer.id;
    const { getToken } = useAuth();
    const navigate = useNavigate();

    const [hiddenAlert, setHiddenAlert] = useState(true);
    const [alertMessage, setAlertMessage] = useState('');
    const [activeTab, setActiveTab] = useState('in-progress');
    const [unreadConv, setUnreadConv] = useState({ inProgress: 0, past: 0});
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 300);

    const isPublicDemo = !explorerId;

    const baseFetchUrl =
    activeTab === 'in-progress'
      ? `/conversation/${explorerId}`
      : `/conversation/past/${explorerId}`;

    const serverPagination = usePagination(
      isPublicDemo ? null : baseFetchUrl,
      40,
      { searchTerm: debouncedSearch, includeSearch: true }
    );

    const { 
      data: serverData,
      setData: setServerData,
      loading: serverLoading,
      error: serverError,
      activePage: serverActivePage,
      setActivePage: setServerActivePage,
      totalPages: serverTotalPages,
      totalItems: serverTotalItems,
      handlePageChange: serverHandlePageChange,
      refresh: refreshConversations
    } = serverPagination;

    const [demoData, setDemoData] = useState({ conversations: [], total: 0 });

    useEffect(() => {
      if (!isPublicDemo) return;
  
      const list = DEMO_CONVERSATIONS;
  
      const filtered = debouncedSearch
        ? list.filter(
            (c) =>
              c.card_name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
              c.swap_explorer.toLowerCase().includes(debouncedSearch.toLowerCase())
          )
        : list;
  
      const visible =
        activeTab === 'in-progress'
          ? filtered.filter((c) => c.status === 'In progress')
          : filtered.filter((c) => c.status !== 'In progress');
  
      setDemoData({ conversations: visible, total: visible.length });
  
      // unread counts for badges (computed on the full list, not just visible)
      setUnreadConv({
        inProgress: list.filter((c) => c.status === 'In progress' && c.unread > 0).length,
        past: list.filter((c) => c.status !== 'In progress' && c.unread > 0).length
      });
    }, [isPublicDemo, activeTab, debouncedSearch]);

    const handleTabChange = (tab) => {
      if (tab !== activeTab) {
        setActiveTab(tab);
        if (isPublicDemo) return;
        setServerActivePage?.(1);        
        fetchUnreadConversations();
      }
    }
    
    // // Show alert when error occurs
    // useEffect(() => {
    //   if (error) {
    //     setHiddenAlert(false);
    //     setAlertMessage(error);
    //   }
    // }, [error]);
    
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
        if (isPublicDemo) {
          navigate('/login/redirect', { state: { from: '/swap/dashboard' } });
          return;
        }

        dispatch({
          type: 'dashboard/chatClicked',
          payload: { conversationId, swapExplorerId, swapExplorerName, swapCardName }
        })

        fetchSwapOpportunitiesForRecipient(creatorId, recipientId, conversationId);

        navigate('/swap/card/chat', { state: { from: "/swap/dashboard" } });
    };

    const handleStatusChange = async (conversationId, newStatus) => {
        if (isPublicDemo) return;

        const updated = serverData.conversations.map((conv) =>
          conv.db_id === conversationId ? { ...conv, status: newStatus } : conv
        );
        setServerData(updated);
      
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
        fetchUnreadConversations();
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
      if (isPublicDemo) return;
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

    const fetchUnreadConversations = async () => {
      if (isPublicDemo) return;

      try {
        const token = await getToken();

        const response = await axiosInstance.get(
          `/conversation/unread/${explorerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        });
        setUnreadConv(response.data);        
        
      } catch (error) {
        // console.error("Error fetching unread counts", error);
      }
    }

    useEffect(() => {
      if (isPublicDemo) return;

      updateLastActive();
      fetchUnreadConversations();
    }, [isPublicDemo, explorerId, activeTab, debouncedSearch]);

    if (isPublicDemo) {
      return {
        data: demoData,
        loading: false,
        error: null,
        activePage: 1,
        totalPages: 1,
        totalItems: demoData.total,
        handlePageChange: () => {},
        handleOpenChat,
        getDropdownClass,
        handleStatusChange,
        hiddenAlert,
        alertMessage,
        activeTab,
        handleTabChange,
        unreadConv,
        searchTerm,
        setSearchTerm,
        isPublicDemo: true
      };
    }

    return {
      data: serverData,
      loading: serverLoading,
      error: serverError,
      activePage: serverActivePage,
      totalPages: serverTotalPages,
      totalItems: serverTotalItems,
      handlePageChange: serverHandlePageChange,
      handleOpenChat,
      getDropdownClass,
      handleStatusChange,
      hiddenAlert,
      alertMessage,
      activeTab,
      handleTabChange,
      unreadConv,
      searchTerm,
      setSearchTerm,
      isPublicDemo: false
    };
}

export default useDashboardLogic;