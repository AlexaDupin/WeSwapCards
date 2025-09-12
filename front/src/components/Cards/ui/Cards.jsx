import React from 'react';
import PageContainer from '../../PageContainer/PageContainer';
import {
    Spinner,
    Alert
} from "react-bootstrap";
import './cardsStyles.scss';
import ScrollToTop from '../../ScrollToTopButton/ScrollToTop';

import useCardsLogic from '../hooks/useCardsLogic';
import CardItem from './CardItem';

function Cards() {
  const { state, cardStatuses, cards, chapters, handleSelect, reset, isLoading } = useCardsLogic();

  return (
    <PageContainer>
      <h1 className="page-title">My cards</h1>

      {isLoading &&
        <><Spinner
            animation="border"
            className="spinner" /><p>Loading your cards...</p></>
      }

      {state.alert.message && (
      <Alert
        variant='danger'
        className={state.alert.hidden ? 'hidden-alert' : ''}>
        {state.alert.message}
      </Alert>
        )}

      {!state.loading && !state.alert.message && (
        <>
        {chapters.map((chapter) => {
        const chapterCards = cards.filter(card => card.place_id === chapter.id);

        return (
          <section key={chapter.id} style={{ marginBottom: 30 }}>
              <h2 className="chapter-title">{chapter.name}</h2>

              <div className="cards-list" role="list">
                {chapterCards.map((item) => (
                  <CardItem
                    key={item.id}
                    item={item}
                    status={cardStatuses[item.id] || "default"}
                    onSelect={() => handleSelect(item.id)}
                    onReset={() => reset(item.id)}
                  />
                ))}
              </div>
          </section>
        );
    })}
        </>
        )}

        <ScrollToTop />
    </PageContainer>
  )
}

export default React.memo(Cards);
