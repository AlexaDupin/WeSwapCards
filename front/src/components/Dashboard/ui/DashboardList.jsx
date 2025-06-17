import React, { useMemo } from 'react';
import {
    Table,
    Dropdown,
    DropdownButton,
    Alert
} from "react-bootstrap";
import {Envelope} from "react-bootstrap-icons";
import PaginationControl from '../../Pagination/Pagination';
import './dashboardStyles.scss';

function DashboardList({
    data,
    activePage,
    totalPages,
    totalItems,
    handlePageChange,
    handleOpenChat,
    getDropdownClass,
    handleStatusChange,
    hiddenAlert,
    alertMessage,
    activeTab,
    searchTerm
  }) {

  const noResultsMessage = 
  activeTab === 'in-progress'
    ? "You do not have any ongoing requests. Start swapping!"
    : "You do not have any past requests yet.";

  // const filteredConversations = useMemo(() => {
  //   if (!searchTerm) {
  //     return data.conversations;
  //   }

  //   return data.conversations.filter(cv =>
  //     cv.card_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     cv.swap_explorer.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  // }, [searchTerm, data.conversations]);

    return (
        <>
          <Alert variant='danger' className={hiddenAlert ? 'hidden-alert' : ''}>
            {alertMessage}
          </Alert>
          
          {totalItems > 0 ? (
            <>
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
              {data.conversations?.map((conversation) => (
                <tr key={conversation.db_id || conversation.row_id}>
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
              </Table>
              
              <PaginationControl 
                activePage={activePage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <p>{noResultsMessage}</p>
          )}
        </>
    )
}

export default React.memo(DashboardList);