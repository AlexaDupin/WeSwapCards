import React, { useEffect, useReducer } from 'react';
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

import ScrollToTop from '../../ScrollToTopButton/ScrollToTop';

import './swapCardStyles.scss';
import { initialState, reducer } from '../../../reducers/swapReducer';
import { useStateContext } from '../../../contexts/StateContext';
import { useDispatchContext } from '../../../contexts/DispatchContext';

function SwapCard() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const stateContext = useStateContext();
    const mainDispatch = useDispatchContext();
    const explorerId = stateContext.explorer.id;
    const name = stateContext.explorer.name;
    const swapCardName = stateContext.swap.cardName;

    const { getToken } = useAuth()
    const navigate = useNavigate();

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

        dispatch({
          type: 'places/fetched',
          payload: response.data.places
        })

      } catch (error) {
        dispatch({
          type: 'places/fetchedError',
        })

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
        dispatch({
          type: 'places/selected',
          payload: allCards.data.cards
        })

        mainDispatch({
          type: 'swap/placeSelected',
        })

        // setSwapExplorerId('');
        // setConversationId('');
      } catch (error) {
        dispatch({
          type: 'places/selectedError',
        })

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
      mainDispatch({
        type: 'swap/cardNameFetched',
        payload: cardName
      })
      // setSwapCardName(cardName);

    } catch (error) {
      dispatch({
        type: 'cardName/fetchedError',
      })
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
      state.selectedCardId ? `/opportunities/${explorerId}/card/${state.selectedCardId}` : '', 
      20
    );

    const fetchSwapOpportunities = async (cardId) => {
      dispatch({
        type: 'swapOpportunities/fetched',
        payload: cardId
      })
      fetchSearchedCardName(cardId);

      await refresh();
      setActivePage(1);
      dispatch({
        type: 'swapOpportunities/fetchedRefresh',
      })
    };

    const handleContactButton = (swapExplorerId, swapExplorerName, swapExplorerOpportunities) => {
      mainDispatch({
        type: 'swap/ContactClicked',
        payload:  { swapExplorerId, swapExplorerName, swapExplorerOpportunities }
      })
      
      // setSwapExplorerId(swapExplorerId);
      // setSwapExplorerName(swapExplorerName);
      // setSwapExplorerOpportunities(swapExplorerOpportunities);
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
      dispatch({
        type: 'activeTooltips/set',
        payload: explorerId
      })
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

  return (
  <Container className="page-container">
      <h1 className="swap-title">Find a card</h1>

      {state.alert.message && (
          <Alert
          variant='danger' className={state.alert.hidden ? 'hidden-alert' : ''}>
              {state.alert.message}
            </Alert>
          )}

      {!state.alert.message && (
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
            {state.places?.map((place) => (
              <option
                key={place.id}
                value={place.id}>
                {place.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group
          className={state.hidden ? 'hidden' : 'mb-5'}
          controlId="formGroupEmail">
          <Form.Label className="report-label">
            Click on the card you are looking for!
          </Form.Label>

          <div className="g-3 cards-list">
            {state.cards && state.cards.length > 0 ? (
              state.cards?.map((card) => (
                <CardPreview
                  key={card.id}
                  card={card}
                  fetchSwapOpportunities={fetchSwapOpportunities}
                  isSelected={state.selectedCardId === card.id} />
              ))
            ) : (
              <div>No cards available</div>
            )}
          </div>
        </Form.Group>
      </Form>
      
      {state.loadingOpportunities && state.selectedCardId && (
        <div className="text-center my-4">
          <Spinner animation="border" className="spinner" />
        </div>
      )}

      {!state.loadingOpportunities && !state.hiddenSwapOpportunities && (
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
                                {state.activeTooltips[opportunity.explorer_id] && (
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

export default React.memo(SwapCard);