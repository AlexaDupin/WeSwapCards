import React, { useCallback, useMemo, useRef, useLayoutEffect, useState } from "react";
import PageContainer from '../../PageContainer/PageContainer';
import { Spinner, Alert, Button, Modal, Toast, ToastContainer } from "react-bootstrap";
import './cardsStyles.scss';
import ScrollToTop from '../../ScrollToTopButton/ScrollToTop';

import useCardsLogic from '../hooks/useCardsLogic';
import CardItem from './CardItem';
import ProgressBar from '../../ProgressBar/ui/ProgressBar';
import AZNav from "../../AZNav/AZNav";

function normalizeLeadingLetter(name = "") {
  const s = name.trim().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  const first = s.charAt(0).toUpperCase();
  return first >= "A" && first <= "Z" ? first : "";
}

function Cards() {
  const { state, handleSelect, reset, isLoading, handleBulkSetAllOwned, restoreStatuses } = useCardsLogic();

  const [showConfirmAllOwned, setShowConfirmAllOwned] = useState(false);

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [prevSnapshot, setPrevSnapshot] = useState(null);

  const { totalCards } = useMemo(() => {
    const total = state.cards?.length ?? 0;

    return {
      totalCards: total,
    };
  }, [state.cards]);

  const openConfirm = () => setShowConfirmAllOwned(true);
  const closeConfirm = () => setShowConfirmAllOwned(false);

  const onConfirmAllOwned = async () => {
    const snapshot = { ...state.cardStatuses };
    const ok = await handleBulkSetAllOwned();
    if (ok) {
      setPrevSnapshot(snapshot);
      setShowSuccessToast(true);
    }
    closeConfirm();
  };

  const onUndoBulk = async () => {
    if (!prevSnapshot) return;
    await restoreStatuses(prevSnapshot);
    setPrevSnapshot(null);
    setShowSuccessToast(false);
  };

  const chapterRefs = useRef(new Map());
  const getChapterRef = (id) => {
    if (!chapterRefs.current.has(id)) {
      chapterRefs.current.set(id, React.createRef());
    }
    return chapterRefs.current.get(id);
  };

  // Map first letter -> first chapter id with that letter (preserves original order)
  const letterToChapterId = useMemo(() => {
    const map = {};
    for (const L of "ABCDEFGHIJKLMNOPQRSTUVWXYZ") map[L] = null;
    for (const ch of state.chapters) {
      const L = normalizeLeadingLetter(ch.name);
      if (L && !map[L]) map[L] = ch.id;
    }
    return map;
  }, [state.chapters]);

  const lettersWithContent = useMemo(() => {
    const set = new Set();
    for (const [L, id] of Object.entries(letterToChapterId)) if (id) set.add(L);
    return set;
  }, [letterToChapterId]);

  // Jump to exact letter; if none, nearest next, then previous; else go top
  const jumpToLetter = useCallback(
    (letter) => {
      const AZ = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const idx = AZ.indexOf(letter);
      const direct = letterToChapterId[letter];

      const findNearest = () => {
        for (let i = idx + 1; i < AZ.length; i++) if (letterToChapterId[AZ[i]]) return letterToChapterId[AZ[i]];
        for (let i = idx - 1; i >= 0; i--) if (letterToChapterId[AZ[i]]) return letterToChapterId[AZ[i]];
        return null;
      };

      const targetId = direct || findNearest();
      const node = targetId ? chapterRefs.current.get(targetId)?.current : null;

      if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [letterToChapterId]
  );

  const azRef = useRef(null);
  useLayoutEffect(() => {
    const el = azRef.current;
    if (!el) return;
    const setVar = () =>
      document.documentElement.style.setProperty("--az-bar-h", `${el.offsetHeight}px`);
    setVar();
    const ro = new ResizeObserver(setVar);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  
  return (
    <PageContainer className="cards-page">
      <h1 className="page-title mb-3">My cards</h1>

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
      <div className="quick-actions mb-1">
      <Button
        variant="outline-primary"
        size="sm"
        className="rounded-pill quick-pill"
        onClick={openConfirm}
        disabled={state.bulkUpdating || (state.cards?.length ?? 0) === 0}
      >
        Select all cards
      </Button>
      <Button
        variant="outline-primary"
        size="sm"
        className="rounded-pill quick-pill"
        // onClick={openConfirm}
        disabled={state.bulkUpdating || (state.cards?.length ?? 0) === 0}
      >
        Delete all cards
      </Button>
      <Button
        variant="outline-primary"
        size="sm"
        className="rounded-pill quick-pill"
        // onClick={openConfirm}
        disabled={state.bulkUpdating || (state.cards?.length ?? 0) === 0}
      >
        Mark all as duplicated
      </Button>
      <Button
        variant="outline-primary"
        size="sm"
        className="rounded-pill quick-pill"
        // onClick={openConfirm}
        disabled={state.bulkUpdating || (state.cards?.length ?? 0) === 0}
      >
        Missing cards
      </Button>
      {/* (Future) "Report all as duplicated" pill goes here */}
      </div>

      <Modal show={showConfirmAllOwned} onHide={closeConfirm} centered>
      <Modal.Header closeButton>
        <Modal.Title>Mark all cards as owned?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Do you really want to mark all <strong>{totalCards}</strong> cards as owned?
        </p>
        <p className="mb-0">
          This is useful for new users. You will be able to update them individually after.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeConfirm}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={onConfirmAllOwned}
          disabled={state.bulkUpdating}
        >
          {state.bulkUpdating && <Spinner size="sm" className="me-2" />}
          Yes, mark all as owned
        </Button>
      </Modal.Footer>
      </Modal>
            
      <header ref={azRef} className="cards-sticky mb-3">
        <AZNav onSelect={jumpToLetter} lettersWithContent={lettersWithContent} className="equalized"/>
      </header>
      
      <section className="chapter-list">
        {state.chapters.map((chapter) => {
        const chapterCards = state.cards.filter(card => card.place_id === chapter.id);
        const cardsOwned = chapterCards.filter(card => state.cardStatuses[card.id] === "owned" || state.cardStatuses[card.id] === "duplicated");

        return (
          <section key={chapter.id} ref={getChapterRef(chapter.id)} className="chapter">
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

      <ToastContainer
            position="bottom-end"
            className="p-3 cards-toast-container"
          >
            <Toast
              bg="success"
              onClose={() => setShowSuccessToast(false)}
              show={showSuccessToast}
              delay={4500}
              autohide
              role="status"
              aria-live="polite"
            >
              <Toast.Body className="text-white d-flex align-items-center justify-content-between gap-3">
                <span>Marked all {totalCards} cards as owned.</span>
                {prevSnapshot && (
                  <Button size="sm" variant="light" onClick={onUndoBulk}>
                    Undo
                  </Button>
                )}
              </Toast.Body>
            </Toast>
          </ToastContainer>
      </>
      )}

        <ScrollToTop />
    </PageContainer>
  )
}

export default React.memo(Cards);
