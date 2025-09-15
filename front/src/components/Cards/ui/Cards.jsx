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
import ProgressBar from '../../ProgressBar/ui/ProgressBar';

function Cards() {
  const { state, handleSelect, reset, isLoading } = useCardsLogic();

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
      <section className="chapter-list">
        {state.chapters.map((chapter) => {
        const chapterCards = state.cards.filter(card => card.place_id === chapter.id);
        const cardsOwned = chapterCards.filter(card => state.cardStatuses[card.id] === "owned" || state.cardStatuses[card.id] === "duplicated");

        return (
          <section key={chapter.id} className="chapter">
              <h2 className="chapter-title">{chapter.name}</h2>
              <ProgressBar value={cardsOwned.length} max={9} className="chapter-progress" />

              <div className="cards-list" role="list">
                {chapterCards.map((item) => (
                  <CardItem
                    key={item.id}
                    item={item}
                    status={state.cardStatuses[item.id] || "default"}
                    onSelect={() => handleSelect(item.id)}
                    onReset={() => reset(item.id)}
                  />
                ))}
              </div>
          </section>
        );
    })}
      </section>
      )}

        <ScrollToTop />
    </PageContainer>
  )
}

export default React.memo(Cards);
