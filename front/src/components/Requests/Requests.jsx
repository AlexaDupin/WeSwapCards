import React, { useState, useEffect } from 'react';
import {
    Container,
    Table,
    Badge,
    Spinner
} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import PropTypes from 'prop-types';

import './requestsStyles.scss';
import CustomButton from '../CustomButton/CustomButton';

// import ScrollToTop from '../ScrollToTopButton/ScrollToTop';

function Requests({
  explorerId, name, token, setSwapExplorerId, setSwapCardName, setSwapExplorerName, setConversationId
}) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();

  const fetchAllConversations = async () => {
    try {
      const response = await axios.get(
          `${baseUrl}/conversation/${explorerId}`
          , {
            headers: {
              authorization: token,
            },
          });
      setConversations(response.data.allConversations);
      setLoading(false);

    } catch (error) {
      console.log(error);
    }
  };

  const handleExplorerClick = async (cardName, swapExplorerId, swapExplorerName) => {
      setConversationId('');
      setSwapExplorerId(swapExplorerId);
      setSwapCardName(cardName);
      setSwapExplorerName(swapExplorerName);
      navigate('/swap/card/chat');
  };

  useEffect(
    () => {
      fetchAllConversations();
      },
    [],
  );

  return (
    <Container className="requests">

    {loading &&
      <><Spinner
          animation="border"
          className="spinner" /><p>Loading your requests...</p></>
    }

    {!loading &&

    <Table striped>
      <thead>
        <tr>
          <th>#</th>
          <th>Card</th>
          <th>User</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {conversations.map((conversation) => (
        <tr 
            key={conversation.id}
        >
            <td>{conversation.id}</td>
            <td>{conversation.card_name}</td>
            <td
                className='requests-swapexplorer'
                onClick={() => handleExplorerClick(conversation.card_name, conversation.swap_explorer_id, conversation.swap_explorer)}
            >{conversation.swap_explorer}</td>
            <td><Badge bg="success">{conversation.status}</Badge></td>
        </tr>
        ))}
      </tbody>
    </Table>
    }
    
    </Container>
  );
}

Requests.propTypes = {
  explorerId: PropTypes.number.isRequired,
  name: PropTypes.string,
};

export default React.memo(Requests);
