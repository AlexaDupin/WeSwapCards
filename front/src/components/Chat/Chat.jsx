import React, { useState, useEffect, useRef } from 'react';
import {
    Form,
	  Row,
    Container,
    Button,
    Col,
    InputGroup,
    Spinner,
    Alert
} from "react-bootstrap";
import { useNavigate, useLocation } from 'react-router-dom';
import { axiosInstance } from '../../helpers/axiosInstance';
import { useAuth } from '@clerk/clerk-react';
import DOMPurify from 'dompurify';

import PropTypes from 'prop-types';

import './chatStyles.scss';

function Chat({
    explorerId, swapExplorerId, swapExplorerName, swapCardName, setConversationId, conversationId
  }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messageEndRef = useRef(null);
    const navigate = useNavigate();
    const [hiddenAlert, setHiddenAlert] = useState(true);
    const [alertMessage, setAlertMessage] = useState('');

    const location = useLocation(); // Get the current URL
    const previousUrl = location.state?.from;

    console.log("explorerId", explorerId);
    console.log("CHAT JSX swapExplorerId", swapExplorerId);
    console.log("messages", messages);
    console.log("swapCardName", swapCardName);
    console.log("conversationId", conversationId);
    console.log("loading", loading);

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

        console.log("fetchConversation response", response);
        setLoading(false);

        if (!response.data) {
          setConversationId('');
          console.log("CHAT NEW CONV: NO convID set");
        } else {
          setConversationId(response.data.id);
          console.log("CHAT CONV FOUND: convID set");
        }

      } catch (error) {
        setLoading(false);
        setHiddenAlert(false);
        setAlertMessage("There was an error while fetching the conversation");
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const fetchMessages = async () => {
      console.log("FETCHING MESSAGES");

      if (conversationId) {
        try {
          console.log("FETCHING MESSAGES conversationId", conversationId);
  
          const response = await axiosInstance.get(
            `/chat/${conversationId}`
          , {
            headers: {
              Authorization: `Bearer ${await getToken()}`,
            },
          });
          console.log(response.data.allMessages);
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

          console.log("allMessagesFormattedDate", allMessagesFormattedDate);
          setMessages(allMessagesFormattedDate);
          setUnreadMessagestoRead();

        } catch (error) {
          setHiddenAlert(false);
          setAlertMessage("There was an error while retrieving the messages");
          window.scrollTo({ top: 0, behavior: 'smooth' });
          console.log(error);
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
          console.log(error);
        }          
    };

    const sendMessage = async (conversationId) => {
      console.log("INTO CHAT SEND MESSAGE");
      const sanitizedMessage = DOMPurify.sanitize(newMessage);

      const input = {
        id: messages.length + 1,
        content: sanitizedMessage,
        timestamp: new Date(),
        sender_id: explorerId,
        recipient_id: swapExplorerId,
        conversation_id: conversationId,
      };
      console.log("CHAT SEND MESSAGE INPUT", input);

      const maxRetries = 3;
      const delayBetweenRetries = 1000;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const token = await getToken();
          if (!token) {
              console.error("Token is not available!");
              return;
          }

          if (!conversationId) {
            console.log("CHAT SEND MESSAGE NO CONV ID");
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
          console.log("RESPONSE", response);

          if (response.status === 201) {
            fetchMessages();
            setNewMessage('');
            return;
          } else {
            console.error("Failed to send message");
            return;
          }

        } catch (error) {
          console.error(`Attempt ${attempt} to send failed:`, error);
          if (attempt < maxRetries) {
            console.log(`Retrying in ${delayBetweenRetries / 1000} seconds...`);
            await new Promise((resolve) => setTimeout(resolve, delayBetweenRetries));
          } else {
            setHiddenAlert(false);
            setAlertMessage("There was an error while sending the message");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            console.log(error);
            return;
          }
        }
      }
    };

    const handleConversationStatus = async (conversationId, newStatus) => {
        console.log("CHANGING STATUS", newStatus);
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
          console.error('Error updating status:', error);
        }
    };

    const handleSendMessage = async () => {
      if (newMessage.trim() === '') return;

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
                console.error("Token is not available!");
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
              console.log("RESPONSE", response);
            
              if (response.status === 201) {
                setConversationId(response.data.id);
                sendMessage(response.data.id);
                return;
              } else {
                console.error("Failed to create conversation");
                return;
              }
            
          } catch (error) {
            console.error(`Attempt ${attempt} to create conv failed:`, error);
            if (attempt < maxRetries) {
              console.log(`Retrying in ${delayBetweenRetries / 1000} seconds...`);
              await new Promise((resolve) => setTimeout(resolve, delayBetweenRetries));
            } else {
            setHiddenAlert(false);
            setAlertMessage("There was an error while creating the conversation");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            console.log(error);
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
  
  return (
    <Container className="page-container">

      <div className='chat-container'>
      {loading &&
        <><Spinner
          animation="border"
          className="spinner" /><p>Loading the chat...</p>
        </>
      }

      {!loading &&
        <><h1 className="chat-title">Chat with {swapExplorerName} - {swapCardName}</h1>
        <Alert
          variant='danger'
          className={hiddenAlert ? 'hidden-alert' : ''}>
          {alertMessage}
        </Alert>
        <Container fluid className="chat">
            <div>
              <Row className="message-list">
                {messages?.map((message) => (
                  <Col key={message.id} className={`message-bubble ${message.sender_id === explorerId ? 'sent' : 'received'}`}>
                    <div className="message-content">{message.content}</div>
                    <div className="message-timestamp">{message.timestamp.toLocaleString(undefined, { weekday: 'long', hour: '2-digit', minute: '2-digit' })}</div>
                  </Col>
                ))}
                <div ref={messageEndRef} />
              </Row>
            </div>
            <div>
              <Row className="message-status">
                <Col xs={4}>
                  <Button
                    onClick={() => handleConversationStatus(conversationId, 'Completed')}
                    // variant='success'
                    className="chat-completed"
                  >
                    <span className="send-text">Complete</span>
                  </Button>
                </Col>
                <Col xs={4}>
                  <Button
                    onClick={() => handleConversationStatus(conversationId, 'Declined')}
                    variant='danger'
                  >
                    <span className="send-text">Decline</span>
                  </Button>
                </Col>
              </Row>
              <Row className="message-input-container">
                <Col xs={10}>
                  <InputGroup>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          handleSendMessage();
                      } }
                      className="message-input"
                      placeholder="Type a message..." />
                  </InputGroup>
                </Col>
                <Col xs={2}>
                  <Button
                    onClick={handleSendMessage}
                    className="send-button w-100"
                  >
                    <span className="send-text">Send</span>
                    <span className="mobile-symbol"> &gt; </span>
                  </Button>
                </Col>
              </Row>
            </div>
          </Container></>}
    </div>
    </Container>

  );
}

Chat.propTypes = {
  explorerId: PropTypes.number.isRequired,
  name: PropTypes.string,
};

export default React.memo(Chat);