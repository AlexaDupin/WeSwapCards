import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { axiosInstance } from '../../../helpers/axiosInstance';
import { useAuth } from '@clerk/clerk-react';
import { useStateContext } from '../../../contexts/StateContext';
import { useDispatchContext } from '../../../contexts/DispatchContext';
import DOMPurify from 'dompurify';

const useChatLogic = () => {
    const state = useStateContext();
    const dispatch = useDispatchContext();
    const { explorer, swap } = state;
    const { id: explorerId } = explorer;
    const { explorerId: swapExplorerId, explorerName: swapExplorerName, cardName: swapCardName, opportunities: swapExplorerOpportunities, conversationId } = swap || {};

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const messageEndRef = useRef(null);
    const messageInputRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();
    const [hiddenAlert, setHiddenAlert] = useState(true);
    const [alertMessage, setAlertMessage] = useState('');
    
    const from = useMemo(() => {
      const search = location.search || '';
      const hash = location.hash || '';
      return `${location.pathname}${search}${hash}`;
    }, [location.pathname, location.search, location.hash]);
    const { isLoaded: isClerkLoaded, isSignedIn, getToken } = useAuth();

    const hasExplorer = Boolean(explorerId);
    const hasSwapContext = Boolean(swapExplorerId && swapCardName);

    const authHeader = async () => {
      if (!isClerkLoaded || !isSignedIn) return {};
      const token = await getToken();
      return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const fetchConversation = async () => {
      if (!isClerkLoaded || !isSignedIn || !hasExplorer || !hasSwapContext) return;

      try {
        const headers = await authHeader();
        const response = await axiosInstance.get(
          `/conversation/${explorerId}/${swapExplorerId}/${encodeURIComponent(swapCardName)}`,
          { headers }
        );

        setLoading(false);

        if (!response.data) {
          dispatch({
            type: 'chat/conversationNotFetched'
          })
        } else {
          dispatch({
            type: 'chat/conversationFetched',
            payload: response.data.id
          })
        }

      } catch (error) {
        setLoading(false);
        setHiddenAlert(false);
        setAlertMessage("There was an error while fetching the conversation");
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const fetchMessages = async () => {
      if (!isClerkLoaded || !isSignedIn || !conversationId) return;

      try {
        const headers = await authHeader();

        const response = await axiosInstance.get(
          `/chat/${conversationId}`
        , { headers }
        );

        const allFetchedMessages = response.data.allMessages || [];

        const allMessagesFormattedDate = allFetchedMessages.map((message) => {
          const messageDate = new Date(message.timestamp);
          const today = new Date();
          const daysDifference = (today - messageDate) / (1000 * 3600 * 24); // difference in days
        
          // Define a formatting function for messages older than 7 days
          const formattedDate = daysDifference > 7
            ? messageDate.toLocaleString(undefined, { 
                weekday: 'long', 
                day: '2-digit', 
                month: 'long',
                hour: '2-digit', 
                minute: '2-digit',
              }) // For older than 7 days: Weekday, Day, Month, Hour, Minute
            : messageDate.toLocaleString(undefined, { 
                weekday: 'long', 
                hour: '2-digit', 
                minute: '2-digit' 
              }); // For messages within 7 days: Weekday, Hour, Minute
        
          return {
            ...message, 
            timestamp: formattedDate,
            sender_id: String(message.sender_id ?? message.senderId ?? ""),
            recipient_id: String(message.recipient_id ?? message.recipientId ?? ""),
          };
        });

          setMessages(allMessagesFormattedDate);
          setUnreadMessagestoRead();

        } catch (error) {
          setHiddenAlert(false);
          setAlertMessage("There was an error while retrieving the messages");
          window.scrollTo({ top: 0, behavior: 'smooth' });
          // console.log(error);
        }
    };

    const setUnreadMessagestoRead = async () => {
      if (!isClerkLoaded || !isSignedIn || !conversationId || !hasExplorer) return;

        try {
          const headers = await authHeader();
          await axiosInstance.put(
            `/conversation/${conversationId}/${explorerId}`,
            {},
            { headers }
          );

        } catch (error) {
          // console.log(error);
        }          
    };

    const handleConversationStatus = async (conversationId, newStatus) => {
      if (!isClerkLoaded || !isSignedIn) return;

      try {
        const headers = await authHeader();

        await axiosInstance.put(
          `/conversation/${conversationId}`,
          { status: newStatus }, 
          { headers }
        );

        navigate('/swap/dashboard');    

      } catch (error) {
        // console.error('Error updating status:', error);
      }
    };

    const sendMessage = async (conversationId) => {
      if (!isClerkLoaded || !isSignedIn || !hasExplorer || !hasSwapContext) return;

      const sanitizedMessage = DOMPurify.sanitize(newMessage);

      const input = {
        id: messages.length + 1,
        content: sanitizedMessage,
        timestamp: new Date(),
        sender_id: Number(explorerId),
        recipient_id: Number(swapExplorerId),
        conversation_id: conversationId,
      };

      const maxRetries = 3;
      const delayBetweenRetries = 1000;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const headers = await authHeader();
          if (!headers.Authorization) return;

          if (!conversationId) {
            await fetchConversation();
            return;
          }

          const response = await axiosInstance.post(
            `/chat/${conversationId}`,
            input
          , {
              headers,
              withCredentials: true,
            } 
          );

          if (response.status === 201) {
            fetchMessages();
            setNewMessage('');
            setHiddenAlert(true);
            setIsSending(false);

            setTimeout(() => {
              if (messageInputRef.current) {
                messageInputRef.current.focus();
              }
            }, 0);

            return;
          }

        } catch (error) {
          // console.error(`Attempt ${attempt} to send failed:`, error);
          if (attempt < maxRetries) {
            // console.log(`Retrying in ${delayBetweenRetries / 1000} seconds...`);
            await new Promise((resolve) => setTimeout(resolve, delayBetweenRetries));
          } else {
            if (error.status === 400) {
              setHiddenAlert(false);
              setAlertMessage("There was an error with the format of your message. Review it and retry.");
              setIsSending(false);
              return;
            }
            setHiddenAlert(false);
            setAlertMessage("There was an error while sending the message");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setIsSending(false);
            // console.log(error);
            return;
          }
        }
      }

    };

    const handleSendMessage = async () => {
      if (!newMessage.trim()) return;
      if (isSending) return;
      setIsSending(true);

      if (!isClerkLoaded || !isSignedIn) {
        navigate('/login/redirect', { state: { from } });
        setIsSending(false);
        return;
      }

      if (!hasExplorer || !hasSwapContext) {
        setIsSending(false);
        return;
      }

      // If no previous conversation, create one and send message
      if (!conversationId) {
        const conversation = {
          card_name: swapCardName,
          creator_id: explorerId,
          recipient_id: swapExplorerId,
          timestamp: new Date(),
        }

        const maxRetries = 3;
        const delayBetweenRetries = 1000;

        // Retries in case of server inactivity
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            const headers = await authHeader();
            if (!headers.Authorization) return;

            const response = await axiosInstance.post(
              `/conversation/${explorerId}/${swapExplorerId}/${encodeURIComponent(swapCardName)}`,
                conversation
              , {
                  headers,
                  withCredentials: true,
                }
            );
            
              if (response.status === 201) {
                dispatch({
                  type: 'chat/conversationFetched',
                  payload: response.data.id
                })
                sendMessage(response.data.id);
                return;
              } else {
                setIsSending(false);
                return;
              }
            
          } catch (error) {
            // console.error(`Attempt ${attempt} to create conv failed:`, error);
            if (attempt < maxRetries) {
              // console.log(`Retrying in ${delayBetweenRetries / 1000} seconds...`);
              await new Promise((resolve) => setTimeout(resolve, delayBetweenRetries));
            } else {
            setHiddenAlert(false);
            setAlertMessage("There was an error while creating the conversation");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            // console.log(error);
            setIsSending(false);
            return;
            }
          }
        } 

      // If existing conversation, just send message
      } else {
        sendMessage(conversationId);
      }

    };

    // In case of missing explorerId in localStorage, retrieve it again
    useEffect(() => {
      if (!isClerkLoaded) return;

      if (!isSignedIn) {
        navigate('/login/redirect', { state: { from } });
        return;
      }
  
      if (!hasExplorer) {
        return;
      }
  
      if (hasSwapContext) {
        fetchConversation();
      } else {
        setLoading(false);
      }
    }, [isClerkLoaded, isSignedIn, hasExplorer, hasSwapContext, explorerId, swapExplorerId, swapCardName]);
  
    
    // Scroll to the bottom of the chat after sending a new message
    useEffect(() => {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
      if (!isClerkLoaded || !isSignedIn || !conversationId) return;
      fetchMessages();
    }, [isClerkLoaded, isSignedIn, conversationId]);

    return {
        loading,
        explorerId,
        swapExplorerName,
        swapCardName,
        swapExplorerOpportunities,
        hiddenAlert,
        alertMessage,
        messages,
        messageEndRef,
        messageInputRef,
        newMessage,
        isSending,
        setNewMessage,
        handleSendMessage,
        handleConversationStatus,
        conversationId,
    }
}

export default useChatLogic;