import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';
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
  const { openSignIn } = useClerk();
  const location = useLocation();
  const from = useMemo(
    () => `${location.pathname}${location.search}${location.hash || ""}`,
    [location.pathname, location.search, location.hash]
  );

  const requireLogin = () => {
    openSignIn({
      forceRedirectUrl: `/login/redirect?from=${encodeURIComponent(from)}`
    });
  };

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
    setSearchTerm,
    isPublicDemo
  } = useDashboardLogic();

  return (
    <PageContainer>
      <h1 className="page-title">
        Requests dashboard
      </h1>

      {isPublicDemo && (
        <Alert variant="info" className="mb-3">
          You’re viewing a preview.{" "}
          <button
            className="btn btn-link p-0 align-baseline fw-bold alert-link"
            onClick={requireLogin}
          >
            Sign in
          </button>{" "} 
          to see your real requests.
        </Alert>
      )}

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
            searchTerm={searchTerm} 
            readOnly={isPublicDemo}
            requireLogin={requireLogin}
        />
        </>
      )}

      <ScrollToTop />
    </ PageContainer>
  );
}

export default React.memo(Dashboard);