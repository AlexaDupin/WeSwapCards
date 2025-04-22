import React from 'react';
import PageContainer from '../../PageContainer/PageContainer';
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
import './chatStyles.scss';

import useChatLogic from '../hooks/useChatLogic';

function Chat() {
  const {
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
   } = useChatLogic();
  
  return (
    <PageContainer>

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

        <div className="chat-opportunity">
          {swapExplorerOpportunities.length > 0 ? (
            <>
          <span>Cards that can be exchanged for this one:</span>
          <br />
            {swapExplorerOpportunities.map((exchange) => (
                <button
                  key={exchange.card.id}
                  className="chat-opportunity-button"
                >
                  {exchange.card.name}
                </button>
              ))}
            </>
              ) : (
                <span>No new cards to exchange for this one</span>
              )}
        </div>

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
                      ref={messageInputRef}
                      rows={3}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          handleSendMessage();
                      } }
                      className="message-input"
                      placeholder="Type a message..."
                      disabled={isSending}
                    />
                  </InputGroup>
                </Col>
                <Col xs={2}>
                  <Button
                    onClick={handleSendMessage}
                    className="send-button w-100"
                    disabled={isSending || !newMessage.trim()}
                  >
                    <span className="send-text">Send</span>
                    <span className="mobile-symbol"> &gt; </span>
                  </Button>
                </Col>
              </Row>
            </div>
        </Container></>}

      </div>
    </PageContainer>

  );
}

export default React.memo(Chat);