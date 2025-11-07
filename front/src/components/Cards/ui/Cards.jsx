import React, { useRef, useState, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
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
import LatestFirstToggle from "./LatestFirstToggle";
import { InfoCircle } from "react-bootstrap-icons";
import CardsHelpModal from "./CardsHelpModal"; 

const toNumericId = (value) => {
  if (typeof value === "number") return value;
  const parsedValue = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsedValue) ? parsedValue : -Infinity;
};

function Cards() { 
  const { state, isLoading, isPublic, handleSelect, reset, markAllOwnedInChapter, markAllDuplicatedInChapter, isChapterPending } = useCardsLogic();
  const { chaptersData } = useChapterBuckets(state.chapters, state.cards, state.cardStatuses);

  const [showMissingOnly, setShowMissingOnly] = useState(false);
  const [latestFirst, setLatestFirst] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const visibleChaptersData = useMemo(() => {
    if (!showMissingOnly) return chaptersData;
    return chaptersData.filter(({ cards, ownedOrDuplicatedCount }) => {
      const missingCardsCount = cards.length - ownedOrDuplicatedCount;
      return missingCardsCount > 0;
    });
  }, [chaptersData, showMissingOnly]);
 
  const sortedChaptersData = useMemo(() => {
    if (!latestFirst) return visibleChaptersData;
  
    const sortedCopy = [...visibleChaptersData];
    sortedCopy.sort((chapterA, chapterB) => {
      const chapterAId = toNumericId(chapterA.chapterId);
      const chapterBId = toNumericId(chapterB.chapterId);
      return chapterBId - chapterAId;
    });
  
    return sortedCopy;
  }, [visibleChaptersData, latestFirst]);

  const chaptersForAZ = useMemo(
    () =>
      sortedChaptersData.map(({ chapterId, chapterName }) => ({
        id: chapterId,
        name: chapterName,
      })),
    [sortedChaptersData]
  );

  const { lettersWithChapters, scrollToLetter, getChapterDomId } = useAZIndex(chaptersForAZ);
  const azBarRef = useRef(null);
  useStickyVars({ ref: azBarRef, cssVarName: "--az-bar-h", dimension: "height" });
  
  const { openSignIn } = useClerk();
  const location = useLocation();
  const from = useMemo(
    () => `${location.pathname}${location.search}${location.hash || ""}`,
    [location.pathname, location.search, location.hash]
  );
  const loginRedirect = useCallback(
    () => 
      openSignIn({
        forceRedirectUrl: `/login/redirect?from=${encodeURIComponent(from)}`
      }),
    [openSignIn, from]
  );
  
  const onSelectCard = isPublic ? () => loginRedirect() : handleSelect;
  const onResetCard = isPublic ? undefined : reset;
  const onMarkAllOwned = isPublic ? () => loginRedirect() : markAllOwnedInChapter;
  const onMarkAllDuplicated = isPublic ? () => loginRedirect() : markAllDuplicatedInChapter;
  
  return (
    <PageContainer className="cards-page">
      <div className="page-header d-flex align-items-center justify-content-between gap-3 mb-2">
        <div className="d-flex align-items-center gap-2 mb-3">
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

        <div className="d-flex align-items-center gap-2">
          <LatestFirstToggle checked={latestFirst} onChange={setLatestFirst} />
          <MissingCardsToggle checked={showMissingOnly} onChange={setShowMissingOnly} />
        </div>
      </div>

      {isPublic && (
        <Alert variant="info" className="mb-3">
          You’re viewing a preview.{" "}
          <button
            className="btn btn-link p-0 align-baseline fw-bold alert-link"
            onClick={loginRedirect}
          >
            Sign in
          </button>{" "}
          to see your saved owned/duplicated cards.
        </Alert>
      )}

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
      
      {sortedChaptersData.length === 0 ? (
        <EmptyChaptersHint onClearFilter={() => setShowMissingOnly(false)} />
      ) : (
        <ChaptersList
          chaptersData={sortedChaptersData}
          getChapterDomId={getChapterDomId}
          onSelectCard={onSelectCard}
          onResetCard={onResetCard}
          statuses={state.cardStatuses}
          onMarkAllOwned={onMarkAllOwned}
          onMarkAllDuplicated={onMarkAllDuplicated}
          isChapterPending={isChapterPending}
          readOnly={isPublic}
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
