import React, { useState, useEffect } from 'react';
import {
    Container,
    Table,
    Dropdown,
    DropdownButton,
    Spinner
} from "react-bootstrap";
import {Envelope} from "react-bootstrap-icons";
import { useNavigate } from 'react-router-dom';

import { axiosInstance } from '../../helpers/axiosInstance';
import { useAuth } from '@clerk/clerk-react';

import PropTypes from 'prop-types';

import './requestsStyles.scss';

// import ScrollToTop from '../ScrollToTopButton/ScrollToTop';

function Requests({
  explorerId, setSwapExplorerId, setSwapCardName, setSwapExplorerName, setConversationId
}) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log('conversations', conversations);

  const { getToken } = useAuth()
  const navigate = useNavigate();

  const fetchAllConversations = async () => {
    try {
      const response = await axiosInstance.get(
          `/conversation/${explorerId}`
          , {
            headers: {
              Authorization: `Bearer ${await getToken()}`,
            },
          });
      setConversations(response.data.allConversations);
      setLoading(false);

    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenChat = async (cardName, swapExplorerId, swapExplorerName) => {
      setConversationId('');
      setSwapExplorerId(swapExplorerId);
      setSwapCardName(cardName);
      setSwapExplorerName(swapExplorerName);
      navigate('/swap/card/chat');
  };

  const handleStatusChange = async (conversationId, newStatus) => {
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
      setConversations(prevConversations =>
        prevConversations.map(conversation =>
          conversation.db_id === conversationId ? { ...conversation, status: newStatus } : conversation
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getDropdownVariant = (status) => {
    switch (status) {
      case 'In progress':
        return 'secondary'; 
      case 'Completed':
        return 'success';
      case 'Declined':
        return 'danger'; 
      default:
        return 'secondary';
    }
  };

  useEffect(
    () => {
      fetchAllConversations();
      },
    [],
  );

  return (
    <Container className="page-container">
    <h1 className="swap-title">Requests dashboard</h1>

    {loading &&
      <><Spinner
          animation="border"
          className="spinner" /><p>Loading your requests...</p></>
    }

    {!loading &&

    <Table>
      <thead>
        <tr>
          <th style={{ width: '10%' }}>#</th>
          <th style={{ width: '10%' }}></th>
          <th style={{ width: '30%' }}>Card</th>
          <th style={{ width: '25%' }}>User</th>
          <th style={{ width: '25%' }}>Status</th>
        </tr>
      </thead>
      <tbody>
        {conversations?.map((conversation) => (
        <tr key={conversation.row_id} >
            <td 
              className={conversation.unread > 0 ? 'requests-table-unread' : 'requests-table'}
            >{conversation.row_id}</td>
            <td 
              className={conversation.unread > 0 ? 'requests-chat requests-table-unread' : 'requests-chat requests-table'}
              onClick={() => handleOpenChat(conversation.card_name, conversation.swap_explorer_id, conversation.swap_explorer)}
            >
              {conversation.unread > 0 &&
                <Envelope />
              }
            </td>
            <td 
              className={conversation.unread > 0 ? 'requests-chat requests-table-unread' : 'requests-chat requests-table'}
              onClick={() => handleOpenChat(conversation.card_name, conversation.swap_explorer_id, conversation.swap_explorer)}
            >
              {conversation.card_name}
            </td>
            <td
                className={conversation.unread > 0 ? 'requests-chat requests-table-unread' : 'requests-chat requests-table'}
                onClick={() => handleOpenChat(conversation.card_name, conversation.swap_explorer_id, conversation.swap_explorer)}
            >{conversation.swap_explorer}</td>
            <td className={conversation.unread > 0 ? 'requests-table-unread' : 'requests-table'}> 
              <DropdownButton 
                id={`dropdown-status-${conversation.row_id}`} 
                title={conversation.status}
                variant={getDropdownVariant(conversation.status)}
                onSelect={(selectedStatus) => handleStatusChange(conversation.db_id, selectedStatus)}
              >
                <Dropdown.Item eventKey="Completed">Completed</Dropdown.Item>
                <Dropdown.Item eventKey="In progress">In progress</Dropdown.Item>
                <Dropdown.Item eventKey="Declined">Declined</Dropdown.Item>
              </DropdownButton>
            </td>
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
