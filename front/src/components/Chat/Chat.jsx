import React, { useState, useEffect, useRef } from 'react';
import {
    Form,
	  Row,
    Container,
    Button,
    Col,
    InputGroup
} from "react-bootstrap";

import axios from 'axios';

import PropTypes from 'prop-types';
// import ScrollToTop from '../../ScrollToTopButton/ScrollToTop';

import './chatStyles.scss';

function Chat({
    explorerId, name, token, swapExplorerId
  }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messageEndRef = useRef(null);
    console.log("explorerId", explorerId);
    console.log("CHAT JSX swapExplorerId", swapExplorerId);
    console.log("messages", messages);

    const baseUrl = process.env.REACT_APP_BASE_URL;

    useEffect(() => {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(
            `${baseUrl}/chat/${explorerId}/${swapExplorerId}`
          , {
            headers: {
              authorization: token,
            },
          });
          console.log(response.data.allMessages);
          const allFetchedMessages = response.data.allMessages;
          const allMessagesFormattedDate = allFetchedMessages.map((message) => {
            return {
            ...message, 
              timestamp: new Date(message.timestamp).toLocaleString(undefined, { 
                weekday: 'long', hour: '2-digit', minute: '2-digit' 
              }),
            };
          });
          console.log("allMessagesFormattedDate", allMessagesFormattedDate);
          setMessages(allMessagesFormattedDate);
        } catch (error) {
          console.log(error);
        }
      

        // const fetchedMessages = [
        //   { id: 1, senderId: explorerId, content: "Hello!", timestamp: "10:00 AM" },
        //   { id: 2, senderId: swapExplorerId, content: "Hi, how are you?", timestamp: "10:01 AM" },
        //   { id: 3, senderId: explorerId, 
        //     content: "I'm good, thanks! And you? I'm good, thanks! And you? I'm good, thanks! And you? I'm good, thanks! And you? I'm good, thanks! And you? I'm good, thanks! And you?", 
        //     timestamp: "10:02 AM" },
        //   { id: 4, senderId: explorerId, content: "Hello!", timestamp: "10:00 AM" },
        //   { id: 5, senderId: swapExplorerId, content: "Hi, how are you?", timestamp: "10:01 AM" },
        //   { id: 6, senderId: explorerId, content: "I'm good, thanks! And you?", timestamp: "10:02 AM" },
        //   { id: 7, senderId: explorerId, content: "Hello!", timestamp: "10:00 AM" },
        //   { id: 8, senderId: swapExplorerId, content: "Hi, how are you?", timestamp: "10:01 AM" },
        //   { id: 9, senderId: explorerId, content: "I'm good, thanks! And you?", timestamp: "10:02 AM" },
        //   { id: 10, senderId: explorerId, content: "Hello!", timestamp: "10:00 AM" },
        //   { id: 11, senderId: swapExplorerId, content: "Hi, how are you?", timestamp: "10:01 AM" },
        //   { id: 12, senderId: explorerId, content: "I'm good, thanks! And you?", timestamp: "10:02 AM" },
        //   { id: 3, senderId: explorerId, 
        //     content: "I'm good, thanks! And you? I'm good, thanks! And you? I'm good, thanks! And you? I'm good, thanks! And you? I'm good, thanks! And you? I'm good, thanks! And you?", 
        //     timestamp: "10:02 AM" },
        //   { id: 4, senderId: explorerId, content: "Hello!", timestamp: "10:00 AM" },
        //   { id: 5, senderId: swapExplorerId, content: "Hi, how are you?", timestamp: "10:01 AM" },
        //   { id: 6, senderId: explorerId, content: "I'm good, thanks! And you?", timestamp: "10:02 AM" },
        //   { id: 7, senderId: explorerId, content: "Hello!", timestamp: "10:00 AM" },
        //   { id: 8, senderId: swapExplorerId, content: "Hi, how are you?", timestamp: "10:01 AM" },
        //   { id: 9, senderId: explorerId, content: "I'm good, thanks! And you?", timestamp: "10:02 AM" },
        //   { id: 10, senderId: explorerId, content: "Hello!", timestamp: "10:00 AM" },
        //   { id: 11, senderId: swapExplorerId, content: "Hi, how are you?", timestamp: "10:01 AM" },
        //   { id: 12, senderId: explorerId, content: "I'm good, thanks! And you?", timestamp: "10:02 AM" },
        // ];
        // setMessages(fetchedMessages);
      };
      fetchMessages();
    }, [explorerId, swapExplorerId]);
  
    // Scroll to the bottom of the chat after sending a new message
    useEffect(() => {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
  
    const handleSendMessage = async () => {
      if (newMessage.trim() === '') return;
  
      const message = {
        id: messages.length + 1,
        content: newMessage,
        // timestamp: new Date().toLocaleString(undefined, { weekday: 'long', hour: '2-digit', minute: '2-digit' }),
        timestamp: new Date(),
        sender_id: explorerId,
        recipient_id: swapExplorerId,
      };
  
      try {
        const response = await axios.post(
          `${baseUrl}/chat`,
          message
        , {
          headers: {
            authorization: token,
          },
        });
        console.log("RESPONSE", response);

        if (response.status === 201) {
          setMessages((prevMessages) => [...prevMessages, message]);
          setNewMessage('');
        } else {
          console.error("Failed to send message");
        }

      } catch (error) {
        console.log(error.data);
    }

    };

  return (
    <Container fluid className="chat">
      <Row className="message-list">
        {messages.map((message) => (
          <Col key={message.id} className={`message-bubble ${message.sender_id === explorerId ? 'sent' : 'received'}`}>
            <div className="message-content">{message.content}</div>
            <div className="message-timestamp">{message.timestamp.toLocaleString(undefined, { weekday: 'long', hour: '2-digit', minute: '2-digit' })}</div>
          </Col>
        ))}
        <div ref={messageEndRef} />
      </Row>

      <Row className="message-input-container">
        <Col xs={10}>
          <InputGroup>
            <Form.Control
              as="textarea"
              rows={3}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="message-input"
              placeholder="Type a message..."
            />
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
    </Container>
  );
};

Chat.propTypes = {
  explorerId: PropTypes.number.isRequired,
  name: PropTypes.string,
};

export default React.memo(Chat);