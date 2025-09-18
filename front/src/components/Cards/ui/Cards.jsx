import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import PageContainer from '../../PageContainer/PageContainer';
import { Spinner, Alert, Button, ToastContainer } from "react-bootstrap";
import './cardsStyles.scss';
import ScrollToTop from '../../ScrollToTopButton/ScrollToTop';

import useCardsLogic from '../hooks/useCardsLogic';
import CardItem from './CardItem/CardItem';
import ProgressBar from '../../ProgressBar/ui/ProgressBar';
import AZNav from "../../AZNav/AZNav";
import ConfirmModal from "./ConfirmModal";
import BulkToast from "./BulkToast";
import useBulkUI from "../hooks/useBulkUI";
import useAZIndex from "../hooks/useAZIndex";

const BULK_CONFIRM_COPY = {
  allOwned: {
    title: "Mark all cards as owned?",
    confirmLabel: "Yes, mark all as owned",
    confirmVariant: "primary",
    body: (count) => (
      <>
        <p>Do you really want to mark all <strong>{count}</strong> cards as owned?</p>
        <p className="mb-0">This is useful for new users. You can update them individually afterwards.</p>
      </>
    ),
  },
  allDuplicated: {
    title: "Mark all cards as duplicated?",
    confirmLabel: "Yes, mark all as duplicated",
    confirmVariant: "primary",
    body: (count) => (
      <>
        <p>Do you really want to mark all <strong>{count}</strong> cards as <em>duplicated</em>?</p>
        <p className="mb-0">This is useful for new users. You can update them individually afterwards.</p>
      </>
    ),
  },
  deleteAll: {
    title: "Delete all cards?",
    confirmLabel: "Yes, delete all",
    confirmVariant: "danger",
    body: (count) => (
      <>
        <p>This will remove all <strong>{count}</strong> cards.</p>
        <p className="mb-0">You’ll get an <strong>Undo</strong> option right after.</p>
      </>
    ),
  },
};

function Cards() {
  const { state, handleSelect, reset, isLoading, handleBulkSetAllOwned, handleBulkSetAllDuplicated, deleteAllCardsBulk, undoLastBulk } = useCardsLogic();
  const { toast, showToast, hideToast } = useBulkUI();
  const { lettersWithChapters, scrollToLetter, getChapterDomId } = useAZIndex(state.chapters);

  const [confirm, setConfirm] = useState({ open: false, type: null });
  const openConfirm = (type) => setConfirm({ open: true, type });
  const closeConfirm = () => setConfirm({ open: false, type: null });

  const totalCards = state.cards?.length ?? 0;

  const runConfirm = async () => {
    if (!confirm.type) return;
  
    let ok = false;
    if (confirm.type === "allOwned") {
      ok = await handleBulkSetAllOwned();
      if (ok) showToast("allOwned");
    } else if (confirm.type === "allDuplicated") {
      ok = await handleBulkSetAllDuplicated();
      if (ok) showToast("allDuplicated");
    } else if (confirm.type === "deleteAll") {
      ok = await deleteAllCardsBulk();
      if (ok) showToast("deleteAll");
    }
  
    closeConfirm();
  };

  useEffect(() => {
    if (state?.lastUndo?.type) {
      showToast(state.lastUndo.type);
    }
  }, [state.lastUndo, showToast]);

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
        onClick={() => openConfirm('allOwned')}
        disabled={state.bulkUpdating || totalCards === 0}
      >
        Mark all cards as owned
      </Button>

      <Button
        variant="outline-primary"
        size="sm"
        className="rounded-pill quick-pill"
        onClick={() => openConfirm('deleteAll')}
        disabled={state.bulkUpdating || totalCards === 0}
      >
        Delete all cards
      </Button>

      <Button
        variant="outline-primary"
        size="sm"
        className="rounded-pill quick-pill"
        onClick={() => openConfirm('allDuplicated')}
        disabled={state.bulkUpdating || totalCards === 0}
      >
        Mark all as duplicated
      </Button>

      <Button
        variant="outline-primary"
        size="sm"
        className="rounded-pill quick-pill"
        // onClick={openConfirm}
        disabled={state.bulkUpdating || totalCards === 0}
      >
        Missing cards
      </Button>
      {/* (Future) "Report all as duplicated" pill goes here */}
      </div>

      {confirm.open && (
        <ConfirmModal
          show
          title={BULK_CONFIRM_COPY[confirm.type].title}
          body={BULK_CONFIRM_COPY[confirm.type].body(totalCards)}
          confirmLabel={BULK_CONFIRM_COPY[confirm.type].confirmLabel}
          confirmVariant={BULK_CONFIRM_COPY[confirm.type].confirmVariant}
          busy={state.bulkUpdating}
          onCancel={closeConfirm}
          onConfirm={runConfirm}
        />
      )}
            
      <section ref={azRef} className="cards-sticky mb-3">
        <AZNav 
          onSelect={scrollToLetter} 
          lettersWithContent={lettersWithChapters} 
          className="equalized"/>
      </section>
      
      <section className="chapter-list">
        {state.chapters.map((chapter) => {
        const chapterCards = state.cards.filter(card => card.place_id === chapter.id);
        const cardsOwned = chapterCards.filter(card => state.cardStatuses[card.id] === "owned" || state.cardStatuses[card.id] === "duplicated");

        return (
          <section key={chapter.id} id={getChapterDomId(chapter.id)} className="chapter">
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
        <BulkToast
          show={toast.visible}
          type={toast.type}
          total={totalCards}
          canUndo={state?.lastUndo?.type === toast.type}
          onClose={hideToast}
          onUndo={async () => {
            await undoLastBulk();
            hideToast();
          }}
        />
      </ToastContainer>

      </>
      )}

        <ScrollToTop />
    </PageContainer>
  )
}

export default React.memo(Cards);
