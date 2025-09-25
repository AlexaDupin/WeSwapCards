import React, { useState } from 'react';
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
import SearchForm from '../../SearchBar/ui/SearchBar';

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
    unreadConv,
    searchTerm,
    setSearchTerm
  } = useDashboardLogic();

  return (
    <PageContainer>
      <h1 className="page-title">Requests dashboard</h1>
    
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
        <><SearchForm searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
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
            searchTerm={searchTerm} /></>
      )}

      <ScrollToTop />
    </ PageContainer>
  );
}

export default React.memo(Dashboard);