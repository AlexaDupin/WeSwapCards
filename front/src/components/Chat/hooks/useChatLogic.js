import { useState, useEffect, useRef } from 'react';
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
    const { explorerId: swapExplorerId, explorerName: swapExplorerName, cardName: swapCardName, opportunities: swapExplorerOpportunities, conversationId } = swap;

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const messageEndRef = useRef(null);
    const messageInputRef = useRef(null);

    const navigate = useNavigate();
    const [hiddenAlert, setHiddenAlert] = useState(true);
    const [alertMessage, setAlertMessage] = useState('');

    const location = useLocation();
    const previousUrl = location.state?.from;

    const { getToken } = useAuth()

    const fetchConversation = async () => {
      try {
        const response = await axiosInstance.get(
          `/conversation/${explorerId}/${swapExplorerId}/${swapCardName}`
        , {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        });

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
      if (conversationId) {
        try {
          const response = await axiosInstance.get(
            `/chat/${conversationId}`
          , {
            headers: {
              Authorization: `Bearer ${await getToken()}`,
            },
          });
          const allFetchedMessages = response.data.allMessages;

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
      } else {
        return
      }
      
    };

    const setUnreadMessagestoRead = async () => {
        try {
          const response = await axiosInstance.put(
            `/conversation/${conversationId}/${explorerId}`,
            {},
          {
            headers: {
              Authorization: `Bearer ${await getToken()}`,
            },
          });

        } catch (error) {
          // console.log(error);
        }          
    };

    const handleConversationStatus = async (conversationId, newStatus) => {
      try {
        await axiosInstance.put(
          `/conversation/${conversationId}`,
          { status: newStatus }, 
          {
            headers: {
              Authorization: `Bearer ${await getToken()}`,
            },
          });

          navigate('/swap/dashboard');    

      } catch (error) {
        // console.error('Error updating status:', error);
      }
    };

    const sendMessage = async (conversationId) => {
      const sanitizedMessage = DOMPurify.sanitize(newMessage);

      const input = {
        id: messages.length + 1,
        content: sanitizedMessage,
        timestamp: new Date(),
        sender_id: explorerId,
        recipient_id: swapExplorerId,
        conversation_id: conversationId,
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

          if (!conversationId) {
            fetchConversation();
          }

          const response = await axiosInstance.post(
            `/chat/${conversationId}`,
            input
          , {
            headers: {
              Authorization: `Bearer ${token}`,
            },
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
      if (newMessage.trim() === '') return;

      if (isSending) return;
      setIsSending(true);

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
            const token = await getToken();
            if (!token) {
                // console.error("Token is not available!");
                return;
            }
            const response = await axiosInstance.post(
                `/conversation/${explorerId}/${swapExplorerId}/${swapCardName}`,
                conversation
              , {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
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
                // console.error("Failed to create conversation");
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
      if (!explorerId) {
        navigate('/login/redirect', { state: { from: previousUrl } });
      } else {
        fetchConversation();    
      };
    }, []);
    
    // Scroll to the bottom of the chat after sending a new message
    useEffect(() => {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
      fetchMessages();
    }, [conversationId, setMessages]);

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