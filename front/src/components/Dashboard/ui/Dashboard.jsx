import React from 'react';
import PageContainer from '../../PageContainer/PageContainer';
import DashboardList from './DashboardList';
import {
    Spinner,
    Alert,
    Nav,
    Badge
} from "react-bootstrap";

import './dashboardStyles.scss';
import ScrollToTop from '../../ScrollToTopButton/ScrollToTop';

import useDashboardLogic from '../hooks/useDashboardLogic';

function Dashboard() {
  const { 
    data,
    loading,
    error,
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
    handleTabChange,
    unreadConv
  } = useDashboardLogic();
  return (
    <PageContainer>
      <h1 className="swap-title">Requests dashboard</h1>

    <Nav
      activeKey={activeTab}
      onSelect={handleTabChange}
      variant="underline"
    >
      <Nav.Item>
        <Nav.Link className="dashboard-nav" eventKey="in-progress">In Progress <Badge bg="secondary">{unreadConv.inProgress}</Badge></Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link className="dashboard-nav" eventKey="past">Past Requests <Badge bg="secondary">{unreadConv.past}</Badge></Nav.Link>
      </Nav.Item>
    </Nav>

      {loading && (
        <><Spinner animation="border" className="spinner" /><p>Loading your requests...</p></>
      )}

      {error && (
        <div className="error-container">
          <Alert variant='danger' className={hiddenAlert ? 'hidden-alert' : ''}>
            {alertMessage}
          </Alert>
        </div>
      )}

      {!loading && !error && (
        <DashboardList 
          data={data}
          activePage={activePage}
          totalPages={totalPages}
          totalItems={totalItems}
          handlePageChange={handlePageChange}
          handleOpenChat={handleOpenChat}
          getDropdownClass={getDropdownClass}
          handleStatusChange={handleStatusChange}
          hiddenAlert={hiddenAlert}
          alertMessage={alertMessage}
          activeTab={activeTab}
        />
      )}

      <ScrollToTop />
    </ PageContainer>
  );
}

export default React.memo(Dashboard);