import React from 'react';
import {
    Table,
    Dropdown,
    DropdownButton,
    Alert
} from "react-bootstrap";
import {Envelope} from "react-bootstrap-icons";
import PaginationControl from '../../Pagination/Pagination';
import { DEMO_CONVERSATIONS_INPROGRESS, DEMO_CONVERSATIONS_PAST } from '../demo/publicConversations';
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
    readOnly = false,
    requireLogin,
  }) {

  const noResultsMessage = 
  activeTab === 'in-progress'
    ? "You do not have any ongoing requests. Start swapping!"
    : "You do not have any past requests yet.";

  const blurredStatuses = activeTab === 'past'
    ? ['Completed', 'Completed', 'Completed', 'Declined']
    : ['In progress', 'In progress', 'In progress', 'In progress'];

  const DemoRowReadable = ({ row, statusOverride }) => (
    <tr className="demo-row demo-real" key="demo-real">
      <td className={row.unread > 0 ? 'requests-table-unread' : 'requests-table'}>{row.row_id}</td>
      <td
        className={row.unread > 0 ? 'requests-chat requests-table-unread' : 'requests-chat requests-table'}
        onClick={requireLogin}
        role="button"
      >
        {row.unread > 0 && <Envelope />}
      </td>
      <td
        className={row.unread > 0 ? 'requests-chat requests-table-unread' : 'requests-chat requests-table'}
        onClick={requireLogin}
        role="button"
      >
        {row.card_name}
      </td>
      <td
        className={row.unread > 0 ? 'requests-chat requests-table-unread' : 'requests-chat requests-table'}
        onClick={requireLogin}
        role="button"
      >
        {row.swap_explorer}
      </td>
      <td className={activeTab === 'past' ? "requests-table" : "requests-table-unread"}>
        <DropdownButton
          id={`dropdown-status-demo-${row.row_id}`}
          title={statusOverride}
          className={getDropdownClass(statusOverride)}
          onSelect={() => requireLogin()}
        >
          <Dropdown.Item eventKey="Completed">Completed</Dropdown.Item>
          <Dropdown.Item eventKey="In progress">In progress</Dropdown.Item>
          <Dropdown.Item eventKey="Declined">Declined</Dropdown.Item>
        </DropdownButton>        
      </td>
    </tr>
  );

  const DemoRowBlurred = ({ index, status }) => (
    <tr className="demo-row demo-blurred" key={`demo-blur-${index}`}>
      <td className="requests-table">{index}</td>
      <td className="requests-table">
        <span className="blur-text" aria-hidden="true" />
      </td>
      <td className="requests-table">
        <span className="blur-text" aria-hidden="true">Hidden</span>
      </td>
      <td className="requests-table">
        <span className="blur-text" aria-hidden="true">Hidden</span>
      </td>
      <td className="requests-table">
        <DropdownButton
          id={`dropdown-status-demo`}
          title={status}
          className={`blur-badge ${getDropdownClass(status)}`}
          onSelect={() => requireLogin()}
        >
          <Dropdown.Item eventKey="Completed">Completed</Dropdown.Item>
          <Dropdown.Item eventKey="In progress">In progress</Dropdown.Item>
          <Dropdown.Item eventKey="Declined">Declined</Dropdown.Item>
        </DropdownButton>        
      </td>
    </tr>
  );
  
  return (
    <>
      <Alert variant='danger' className={hiddenAlert ? 'hidden-alert' : ''}>
        {alertMessage}
      </Alert>

      {readOnly ? (
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
              {activeTab === 'past' ? (
                <DemoRowReadable row={DEMO_CONVERSATIONS_PAST[0]} statusOverride="Completed" />
              ) : (
                <DemoRowReadable row={DEMO_CONVERSATIONS_INPROGRESS[0]} statusOverride="In progress" />
              )}
              <DemoRowBlurred index={2} status={blurredStatuses[0]} />
              <DemoRowBlurred index={3} status={blurredStatuses[1]} />
              <DemoRowBlurred index={4} status={blurredStatuses[2]} />
              <DemoRowBlurred index={5} status={blurredStatuses[3]} />
            </tbody>
          </Table>
        </>
      ) : totalItems > 0 ? (
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
                    {conversation.unread > 0 && <Envelope />}
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
  );
}

export default React.memo(DashboardList);