import React, { useState, useEffect } from 'react';
import {
    Form,
	  Row,
    Container,
    Card,
    Col,
    Spinner,
    Badge,
    OverlayTrigger,
    Tooltip,
    Alert
} from "react-bootstrap";
import {XOctagon} from "react-bootstrap-icons";
import Lightning from '../../../images/lightning.svg';

import { useNavigate } from 'react-router-dom';

import PlaceCard from './PlaceCard/PlaceCard';
import CardPreview from './CardPreview/CardPreview';

import { usePagination } from '../../../hooks/usePagination';
import PaginationControl from '../../Pagination/Pagination';
import { axiosInstance } from '../../../helpers/axiosInstance';

import { useAuth } from '@clerk/clerk-react';

import PropTypes from 'prop-types';
import ScrollToTop from '../../ScrollToTopButton/ScrollToTop';

import './swapCardStyles.scss';

function SwapCard({
    explorerId, name, setSwapExplorerId, setSwapCardName, swapCardName, setSwapExplorerName, setConversationId, setSwapExplorerOpportunities
  }) {
    const [places, setPlaces] = useState([]);
    const [cards, setCards] = useState([]);
    const [hidden, setHidden] = useState(true);
    const [hiddenSwapOpportunities, setHiddenSwapOpportunities] = useState(true);
    const [activeTooltips, setActiveTooltips] = useState({});

    const [hiddenAlert, setHiddenAlert] = useState(true);
    const [alertMessage, setAlertMessage] = useState('');

    const [selectedCardId, setSelectedCardId] = useState();
    const [loadingOpportunities, setLoadingOpportunities] = useState(true);

    const { getToken } = useAuth()
    const navigate = useNavigate();
    // console.log('selectedCardId', selectedCardId);

    // Fetch all places to show in dropdown
    const fetchAllPlaces = async () => {
      try {
        const response = await axiosInstance.get(`/places`, {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
          withCredentials: true,
          }
        );
        setPlaces(response.data.places);
      } catch (error) {
        setHiddenAlert(false);
        setAlertMessage('There was an error reaching the server. Try again.');
        // console.log(error);      
      }
    };

    // When a place is selected, fetch all cards in that place
    // + cards and duplicates already logged for this explorer in the db so they are highlighted
    const handleSelectPlace = async (placeId) => {
      try {
        const allCards = await axiosInstance.get(`/cards/${placeId}`, {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
          withCredentials: true,
          }
        );
        // console.log("allCards", allCards);

        setCards(allCards.data.cards);
        setHidden(false);
        setHiddenSwapOpportunities(true);
        setSwapExplorerId('');
        setConversationId('');
      } catch (error) {
        setHiddenAlert(false);
        setAlertMessage('There was an error reaching the server. Try again.');
        // console.log(error);
      }
    };

    const fetchSearchedCardName = async (cardId) => {
      try {
        const response = await axiosInstance.get(
        `/card/${cardId}`, {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
          withCredentials: true,
          }
        );

      const cardName = response.data.name;
      // console.log("cardName", cardName);
      setSwapCardName(cardName);

    } catch (error) {
      setHiddenAlert(false);
      setAlertMessage('There was an error reaching the server. Try again.');
      // console.log(error);
    }
  };

    const { 
      data: swapOpportunities, 
      activePage,
      totalPages,
      setActivePage,
      handlePageChange,
      refresh
    } = usePagination(
      selectedCardId ? `/opportunities/${explorerId}/card/${selectedCardId}` : '', 
      20
    );

    const fetchSwapOpportunities = async (cardId) => {
      setLoadingOpportunities(true);
      setSelectedCardId(cardId);
      fetchSearchedCardName(cardId);
      setActiveTooltips({});
      setHidden(false);

      await refresh();
      setActivePage(1);
      setLoadingOpportunities(false);
      setHiddenSwapOpportunities(false);
    };

    const handleContactButton = (swapExplorerId, swapExplorerName, swapExplorerOpportunities) => {
      setSwapExplorerId(swapExplorerId);
      setSwapExplorerName(swapExplorerName);
      setSwapExplorerOpportunities(swapExplorerOpportunities);
      navigate('/swap/card/chat', { state: { from: "/swap/card" } });
    }

    const isRecentlyActive = (lastActiveAt) => {
      const lastActiveDate = new Date(lastActiveAt); 
    
      const twoDaysAgo = new Date();
      twoDaysAgo.setHours(twoDaysAgo.getHours() - 48);
    
      return lastActiveDate > twoDaysAgo;
    }; 

    const renderTooltip = (props) => (
      <Tooltip id="button-tooltip" {...props}>
        This user has been active recently
      </Tooltip>
    );

    const handleMobileTooltip = (explorerId) => {
      setActiveTooltips((prevState) => ({
        ...Object.keys(prevState).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
        [explorerId]: !prevState[explorerId],
      }));
    };

    useEffect(
      () => {
        if (!explorerId) {
          navigate('/login/redirect', { state: { from: "/swap/card" } });
        } else {
        fetchAllPlaces();
        }
      }, [],
    );

    // console.log("SWAP OPP", swapOpportunities);

  return (
  <Container className="page-container">
      <h1 className="swap-title">Find a card</h1>

      {alertMessage && (
          <Alert
          variant='danger' className={hiddenAlert ? 'hidden-alert' : ''}>
              {alertMessage}
            </Alert>
          )}

      {!alertMessage && (
        <>
      <Form>
        <Form.Group className="mb-5" controlId="formGroupPlace">
          <Form.Label className="report-label">Select a chapter, {name}</Form.Label>
          <Form.Select
            aria-label="Select a chapter"
            onChange={(e) => {
              const selectedValue = e.target.value;
              if (selectedValue !== "") {
                handleSelectPlace(selectedValue);
              }
            } }
          >
            <option value="">Select</option>
            {places?.map((place) => (
              <option
                key={place.id}
                value={place.id}>
                {place.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group
          className={hidden ? 'hidden' : 'mb-5'}
          controlId="formGroupEmail">
          <Form.Label className="report-label">
            Click on the card you are looking for!
          </Form.Label>

          <div className="g-3 cards-list">
            {cards && cards.length > 0 ? (
              cards?.map((card) => (
                <CardPreview
                  key={card.id}
                  card={card}
                  fetchSwapOpportunities={fetchSwapOpportunities}
                  isSelected={selectedCardId === card.id} />
              ))
            ) : (
              <div>No cards available</div>
            )}
          </div>
        </Form.Group>
      </Form>
      
      {loadingOpportunities && selectedCardId && (
        <div className="text-center my-4">
          <Spinner animation="border" className="spinner" />
        </div>
      )}

      {!loadingOpportunities && !hiddenSwapOpportunities && (
      <div>
        <Row className="g-3">
          {swapOpportunities.length > 0 ? (
            <>
            <p>Here are the users who can give you this card: <br />
            <span className='swap-cardName'>{swapCardName}</span></p>

            {swapOpportunities.map((opportunity) => (
                      <Col xs={12} key={opportunity.explorer_id} className="column">
                        <Card className="opportunity-card" id={opportunity.explorer_id}>
                          <Card.Title className="opportunity-title">
                            <span className="opportunity-explorer-name">{opportunity.explorer_name}</span>
                            {isRecentlyActive(opportunity.last_active_at) && (
                              <span className="opportunity-explorer-badge">
                                <OverlayTrigger
                                  placement="right"
                                  delay={{ show: 250, hide: 400 }}
                                  overlay={renderTooltip}
                                >
                                  <Badge className="opportunity-explorer-badge-desktop">Active</Badge>
                                </OverlayTrigger>


                                <img
                                  src={Lightning}
                                  alt="Lightning icon"
                                  className="opportunity-explorer-badge-mobile"
                                  onClick={() => handleMobileTooltip(opportunity.explorer_id)} />
                                {activeTooltips[opportunity.explorer_id] && (
                                  <div className="tooltip-mobile">
                                    <div className="tooltip-content">
                                      Active user
                                    </div>
                                  </div>
                                )}
                              </span>
                            )}
                          </Card.Title>

                          {opportunity.opportunities.length > 0 ? (
                            <Card.Text className="opportunity-text">
                              <span>In exchange, here are the cards you can offer them:</span>
                              <br />
                              {opportunity.opportunities.map((exchange) => (
                                <button key={exchange.card.id} className="swap-tag">
                                  {exchange.card.name}
                                </button>
                              ))}
                            </Card.Text>
                          ) : (
                            <Card.Text className="opportunity-text-empty">
                              <span>You do not have any new cards for this user, but you can still contact them.</span>
                            </Card.Text>
                          )}

                          <button
                            className="contact-button"
                            onClick={() => handleContactButton(opportunity.explorer_id, opportunity.explorer_name, opportunity.opportunities)}
                          >
                            Contact this user to swap
                          </button>

                        </Card>
                      </Col>
                    ))}

          <PaginationControl
            activePage={activePage}
            totalPages={totalPages}
            onPageChange={handlePageChange} 
          />
          </>
          ) : (
            <>
            <div>No opportunities available for <span className='swap-cardName'>{swapCardName}</span>, try another card!</div>
            {/* <div className="swap-disclaimer"><em>Only users that need cards you have in duplicates will be shown at a later stage. So remember to log all your cards!</em></div> */}
            <XOctagon className='lock-icon'/>
            </>
          )}
        </Row>
      </div>
      )}
       </>
      )}

    <ScrollToTop />

  </Container>
  
)
}

SwapCard.propTypes = {
  explorerId: PropTypes.number.isRequired,
  name: PropTypes.string,
};

export default React.memo(SwapCard);