import React, { useState, useEffect } from 'react';
import {
    Container,
    Table,
    Dropdown,
    DropdownButton,
    Spinner,
    Alert
} from "react-bootstrap";
import {Envelope} from "react-bootstrap-icons";
import { useNavigate } from 'react-router-dom';

import { axiosInstance } from '../../helpers/axiosInstance';
import { useAuth } from '@clerk/clerk-react';

import PropTypes from 'prop-types';

import './dashboardStyles.scss';

import ScrollToTop from '../ScrollToTopButton/ScrollToTop';

function Dashboard({
  explorerId, setSwapExplorerId, setSwapCardName, setSwapExplorerName, setConversationId, setSwapExplorerOpportunities
}) {
  const [conversations, setConversations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [hiddenAlert, setHiddenAlert] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  // console.log('conversations', conversations);

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
      setLoading(false);
      setHiddenAlert(false);
      setAlertMessage("There was an error while loading your requests");
      // console.log(error);
    }
  };

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
      setSwapExplorerOpportunities(response.data);

    } catch (error) {
      setLoading(false);
      setHiddenAlert(false);
      setAlertMessage("There was an error while fetching the opportunities");
      console.log(error);
    }
  };

  const handleOpenChat = async (cardName, swapExplorerId, swapExplorerName, creatorId, recipientId, conversationId) => {
      setConversationId('');
      setSwapExplorerId(swapExplorerId);
      setSwapCardName(cardName);
      setSwapExplorerName(swapExplorerName);
      fetchSwapOpportunitiesForRecipient(creatorId, recipientId, conversationId);

      navigate('/swap/card/chat', { state: { from: "/swap/dashboard" } });
  };

  const handleStatusChange = async (conversationId, newStatus) => {
    // console.log("CHANGING STATUS", newStatus);
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

  useEffect(
    () => {
      if (!explorerId) {
        navigate('/login/redirect', { state: { from: "/swap/dashboard" } });
      } else {
      fetchAllConversations();
      }
    }, [],
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
      <><Alert
          variant='danger'
          className={hiddenAlert ? 'hidden-alert' : ''}>
          {alertMessage}
        </Alert><Table>
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
                <tr key={conversation.row_id}>
                  <td
                    className={conversation.unread > 0 ? 'requests-table-unread' : 'requests-table'}
                  >{conversation.row_id}</td>
                  <td
                    className={conversation.unread > 0 ? 'requests-chat requests-table-unread' : 'requests-chat requests-table'}
                    onClick={() => handleOpenChat(conversation.card_name, conversation.swap_explorer_id, conversation.swap_explorer, conversation.creator_id, conversation.recipient_id, conversation.db_id)}
                  >
                    {conversation.unread > 0 &&
                      <Envelope />}
                  </td>
                  <td
                    className={conversation.unread > 0 ? 'requests-chat requests-table-unread' : 'requests-chat requests-table'}
                    onClick={() => handleOpenChat(conversation.card_name, conversation.swap_explorer_id, conversation.swap_explorer, conversation.creator_id, conversation.recipient_id, conversation.db_id)}
                  >
                    {conversation.card_name}
                  </td>
                  <td
                    className={conversation.unread > 0 ? 'requests-chat requests-table-unread' : 'requests-chat requests-table'}
                    onClick={() => handleOpenChat(conversation.card_name, conversation.swap_explorer_id, conversation.swap_explorer, conversation.creator_id, conversation.recipient_id, conversation.db_id)}
                  >{conversation.swap_explorer}</td>
                  <td className={conversation.unread > 0 ? 'requests-table-unread' : 'requests-table'}>
                    <DropdownButton
                      id={`dropdown-status-${conversation.row_id}`}
                      title={conversation.status}
                      className={getDropdownClass(conversation.status)}
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
          </Table></>
    }

    <ScrollToTop />
    </Container>
  );
}

Dashboard.propTypes = {
  explorerId: PropTypes.number.isRequired,
  name: PropTypes.string,
};

export default React.memo(Dashboard);
