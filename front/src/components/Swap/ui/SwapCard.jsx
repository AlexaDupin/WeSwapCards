import React from 'react';
import PageContainer from '../../PageContainer/PageContainer';
import {
    Form,
	  Row,
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
import CardPreview from './CardPreview/CardPreview';
import PaginationControl from '../../Pagination/Pagination';
import ScrollToTop from '../../ScrollToTopButton/ScrollToTop';
import './swapCardStyles.scss';

import useSwapLogic from '../hooks/useSwapLogic';

function SwapCard() {
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
  // console.log(swapOpportunities);
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      This user has been active recently
    </Tooltip>
  );

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
      <Form>
        <Form.Group className="mb-3" controlId="formGroupPlace">
          <Form.Label className="visually-hidden">Select a chapter</Form.Label>
          <Form.Select
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
          <Form.Label className="visually-hidden report-label">
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
              <div></div>
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
        <div className="opportunity-card-container">
  {swapOpportunities.items?.length > 0 ? (
    <>
      <p>
        Here are the users who can give you this card: <br />
        <span className="swap-cardName">{swapCardName}</span>
      </p>

      <Row className="g-3 justify-content-center align-items-stretch">
        {swapOpportunities.items?.map((opportunity) => (
          <Col xs={12} md={6} key={opportunity.explorer_id} className="d-flex">
            <Card className="opportunity-card h-100 d-flex flex-column" id={opportunity.explorer_id}>
              <Card.Body className="d-flex flex-column">
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
                        
                          <div className="mt-auto">
                            <button
                              className="contact-button"
                              onClick={() => handleContactButton(opportunity.explorer_id, opportunity.explorer_name, opportunity.opportunities)}
                            >
                              Contact this user to swap
                            </button>
                          </div>
                          </Card.Body>
                        </Card>
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
            {/* <div className="swap-disclaimer"><em>Only users that need cards you have in duplicates will be shown at a later stage. So remember to log all your cards!</em></div> */}
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