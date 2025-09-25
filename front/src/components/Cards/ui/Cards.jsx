import React, { useRef, useState } from "react";
import PageContainer from '../../PageContainer/PageContainer';
import { Spinner, Alert, Button } from "react-bootstrap";
import './cardsStyles.scss';
import ScrollToTop from '../../ScrollToTopButton/ScrollToTop';

import useChapterBuckets from "../hooks/useChapterBuckets";
import useCardsLogic from '../hooks/useCardsLogic';
import useStickyVars from "../../../hooks/useStickyVars";
import ChaptersList from "./ChaptersList";
import EmptyChaptersHint from "./EmptyChaptersHint";

import useAZIndex from "../hooks/useAZIndex";
import AZNav from "./AZNav";

import MissingCardsToggle from "./MissingCardsToggle";
import { InfoCircle } from "react-bootstrap-icons";
import CardsHelpModal from "./CardsHelpModal"; 

function Cards() {
  const { state, handleSelect, reset, isLoading, markAllOwnedInChapter, markAllDuplicatedInChapter, isChapterPending } = useCardsLogic();
  const { chaptersData } = useChapterBuckets(state.chapters, state.cards, state.cardStatuses);

  const [showMissingOnly, setShowMissingOnly] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const visibleChaptersData = showMissingOnly
  ? chaptersData.filter(({ cards, ownedOrDuplicatedCount }) => (cards.length - ownedOrDuplicatedCount) > 0)
  : chaptersData;

  const chaptersForAZ = visibleChaptersData.map(({ chapterId, chapterName }) => ({
    id: chapterId,
    name: chapterName,
  }));
  const { lettersWithChapters, scrollToLetter, getChapterDomId } = useAZIndex(chaptersForAZ);
  const azBarRef = useRef(null);
  useStickyVars({ ref: azBarRef, cssVarName: "--az-bar-h", dimension: "height" });
  
  return (
    <PageContainer className="cards-page">
      <div className="page-header d-flex align-items-center justify-content-between gap-3 mb-2">
        <div className="d-flex align-items-center gap-2">
          <h1 className="page-title mb-0">My cards</h1>

          <Button
              variant="link"
              className="p-0 ms-1 align-baseline"
              onClick={() => setShowHelp(true)}
              aria-label="How it works"
              title="How it works"
            >
              <InfoCircle />
              <span className="visually-hidden">How it works</span>
            </Button>
          </div>

          <MissingCardsToggle checked={showMissingOnly} onChange={setShowMissingOnly} />
      </div>

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

      {!isLoading && !state.alert.message && (
      <>           
      <section ref={azBarRef} className="cards-sticky mb-3">
        <AZNav 
          onSelect={scrollToLetter} 
          lettersWithContent={lettersWithChapters} 
          className="equalized"
        />
      </section>
      
      {visibleChaptersData.length === 0 ? (
        <EmptyChaptersHint onClearFilter={() => setShowMissingOnly(false)} />
      ) : (
        <ChaptersList
          chaptersData={visibleChaptersData}
          getChapterDomId={getChapterDomId}
          onSelectCard={handleSelect}
          onResetCard={reset}
          statuses={state.cardStatuses}
          onMarkAllOwned={markAllOwnedInChapter}
          onMarkAllDuplicated={markAllDuplicatedInChapter}
          isChapterPending={isChapterPending}
        />
      )}
      </>
      )}

        <ScrollToTop />
      <CardsHelpModal show={showHelp} onHide={() => setShowHelp(false)} />
    </PageContainer>
  )
}

export default React.memo(Cards);
