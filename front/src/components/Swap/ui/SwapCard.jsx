import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PageContainer from '../../PageContainer/PageContainer';
import {
    Form,
	  Row,
    Col,
    Spinner,
    Alert
} from "react-bootstrap";
import {XOctagon} from "react-bootstrap-icons";
import { useUser, useClerk } from "@clerk/clerk-react";
import CardPreview from './CardPreview/CardPreview';
import PaginationControl from '../../Pagination/Pagination';
import ScrollToTop from '../../ScrollToTopButton/ScrollToTop';
import './swapCardStyles.scss';

import useSwapLogic from '../hooks/useSwapLogic';
import LatestChapters from './LatestChapters/LatestChapters';
import MiniLatestChaptersTiles from './LatestChapters/MiniLatestChaptersTiles';
import OpportunityCard from './OpportunityCard/OpportunityCard';

function SwapCard() {
  const [showLatest, setShowLatest] = useState(true);
  const [selectedChapterId, setSelectedChapterId] = useState('');
  const { isLoaded, isSignedIn } = useUser();
  const { openSignIn } = useClerk();  
  const location = useLocation();
  const from = `${location.pathname}${location.search}${location.hash || ''}`;
  const appliedFromURL = useRef(false);

  const { 
    state,
    handleSelectPlace,
    fetchSwapOpportunities,
    swapOpportunities,
    swapCardName,
    isRecentlyActive,
    handleMobileTooltip,
    handleContactButton,
    activePage,
    totalPages,
    handlePageChange
  } = useSwapLogic();

  const items = useMemo(() => swapOpportunities.items ?? [], [swapOpportunities.items]);
  const isSingle = useMemo(() => items.length === 1, [items]);

  useEffect(() => {
    if (appliedFromURL.current) return;
    const params = new URLSearchParams(location.search);
    const chapterId = params.get('chapterId');
    if (!chapterId) return;

    const id = String(chapterId);
    appliedFromURL.current = true;

    setSelectedChapterId(id);
    setShowLatest(false);
    handleSelectPlace(id);
  
    const url = new URL(window.location.href);
    url.searchParams.delete('chapterId');
    window.history.replaceState({}, '', url.toString());
  }, []); 

  const handleShortcutSelect = (placeId) => {
    const id = String(placeId);
    setSelectedChapterId(id);
    setShowLatest(false);
    handleSelectPlace(id);
  };

  const handleDropdownChange = (e) => {
    const selectedValue = String(e.target.value);
    setSelectedChapterId(selectedValue);

    if (selectedValue !== "") {
      setShowLatest(false);
      handleSelectPlace(selectedValue);
    } else {
      setShowLatest(true);
    }
  };

  const gatedFetchSwapOpportunities = (...args) => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      openSignIn({
        forceRedirectUrl: `/login/redirect?from=${encodeURIComponent(from)}`,
      });
      return;
    }

    return fetchSwapOpportunities(...args);
  };

  return (
  <PageContainer>
      <h1 className="page-title">Find a card</h1>

      {state.alert.message && (
          <Alert
            variant='danger' className={state.alert.hidden ? 'hidden-alert' : ''}>
              {state.alert.message}
          </Alert>
      )}

      {!state.alert.message && (
        <>

        <div className="latest-wrapper">
          <MiniLatestChaptersTiles
            visible={!showLatest}
            onSelect={handleShortcutSelect}
          />

          <Form>
            <Form.Group className="mb-3" controlId="formGroupPlace">
              <Form.Label className="visually-hidden">Select a chapter</Form.Label>
              <Form.Select
                value={selectedChapterId} 
                onChange={handleDropdownChange} 
              >
                <option value="">Select</option>
                {state.places?.map((place) => (
                  <option
                    key={place.id}
                    value={String(place.id)}
                  >
                    {place.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </div>

        {showLatest && (
          <LatestChapters onSelect={handleShortcutSelect} />
        )}

        <Form.Group
          className={state.hidden ? 'hidden' : 'mb-5'}
          controlId="formGroupEmail"
        >
          <Form.Label className="visually-hidden report-label">
            Click on the card you are looking for!
          </Form.Label>

          <div className="g-3 cards-list">
            {state.cards && state.cards.length > 0 ? (
              state.cards?.map((card) => (
                <CardPreview
                  key={card.id}
                  card={card}
                  fetchSwapOpportunities={gatedFetchSwapOpportunities}
                  isSelected={state.selectedCardId === card.id} />
              ))
            ) : (
              <div></div>
            )}
          </div>
        </Form.Group>
            
      {isSignedIn && state.loadingOpportunities && state.selectedCardId && (
        <div className="text-center my-4">
          <Spinner animation="border" className="spinner" />
        </div>
      )}

      {isSignedIn && !state.loadingOpportunities && !state.hiddenSwapOpportunities && (
        <div className="opportunity-card-container">
          {swapOpportunities.items?.length > 0 ? (
            <>
            <p>
              Here are the users who can give you this card: <br />
              <span className="swap-cardName">{swapCardName}</span>
            </p>
          
            <Row className={`g-3 align-items-stretch ${isSingle ? 'justify-content-center' : ''}`}>
              {items?.map((opportunity) => (
                <Col xs={12} md={6} key={opportunity.explorer_id} className="d-flex">
                  <OpportunityCard
                    opportunity={opportunity}
                    isRecentlyActive={isRecentlyActive}
                    activeTooltips={state.activeTooltips}
                    onMobileTooltip={handleMobileTooltip}
                    onContact={handleContactButton}
                  />
                </Col>
              ))}
            </Row>

            <div className="mt-3">
              <PaginationControl
                activePage={activePage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
            </>
          ) : (
            <>
              <div>No opportunities available for <span className='swap-cardName'>{swapCardName}</span>, try another card!</div>
              <XOctagon className='lock-icon'/>
            </>
          )}
        </div>
      )}
       </>
      )}

    <ScrollToTop />

  </PageContainer>
 )
}

export default React.memo(SwapCard);