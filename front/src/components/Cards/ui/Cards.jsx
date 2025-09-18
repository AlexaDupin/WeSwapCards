import React, { useRef, useState, useEffect } from "react";
import PageContainer from '../../PageContainer/PageContainer';
import { Spinner, Alert, ToastContainer } from "react-bootstrap";
import './cardsStyles.scss';
import ScrollToTop from '../../ScrollToTopButton/ScrollToTop';

import useChapterBuckets from "../hooks/useChapterBuckets";
import useCardsLogic from '../hooks/useCardsLogic';
import useStickyVars from "../../../hooks/useStickyVars";
import ChaptersList from "./ChaptersList";
import EmptyChaptersHint from "./EmptyChaptersHint";

import useAZIndex from "../hooks/useAZIndex";
import AZNav from "./AZNav";

import { BULK_ACTION, BULK_ACTIONS, BULK_ACTION_ORDER } from "../config/bulkActions.config";
import QuickActions from "./QuickActions";
import ConfirmModal from "./ConfirmModal";
import BulkToast from "./BulkToast";
import useBulkUI from "../hooks/useBulkUI";

function Cards() {
  const { state, handleSelect, reset, isLoading, handleBulkSetAllOwned, handleBulkSetAllDuplicated, deleteAllCardsBulk, undoLastBulk } = useCardsLogic();
  const { chaptersData } = useChapterBuckets(state.chapters, state.cards, state.cardStatuses);
  
  const [showMissingOnly, setShowMissingOnly] = useState(false);
  const { toast, showToast, hideToast } = useBulkUI();
  const [confirm, setConfirm] = useState({ open: false, type: null });
  const openConfirm = (type) => setConfirm({ open: true, type });
  const closeConfirm = () => setConfirm({ open: false, type: null });

  const totalCards = state.cards?.length ?? 0;

  const visibleChaptersData = showMissingOnly
  ? chaptersData.filter(({ cards, ownedOrDuplicatedCount }) => (cards.length - ownedOrDuplicatedCount) > 0)
  : chaptersData;

  const chaptersForAZ = visibleChaptersData.map(({ chapterId, chapterName }) => ({
    id: chapterId,
    name: chapterName,
  }));
  const { lettersWithChapters, scrollToLetter, getChapterDomId } = useAZIndex(chaptersForAZ);

  async function executeConfirmedAction(actionKey) {
    try {
      let result;
  
      if (actionKey === BULK_ACTION.ALL_OWNED) {
        result = await handleBulkSetAllOwned();
      } else if (actionKey === BULK_ACTION.ALL_DUPLICATED) {
        result = await handleBulkSetAllDuplicated();
      } else if (actionKey === BULK_ACTION.DELETE_ALL) {
        result = await deleteAllCardsBulk();
      } else {
        return false;
      }
  
      const config = BULK_ACTIONS[actionKey];
      const isSuccess = config?.isSuccess ? !!config.isSuccess(result) : result !== false;
  
      if (isSuccess) {
        const message = config.toast ? config.toast(totalCards) : "";
        if (message) showToast({ type: actionKey, message });
      }
  
      return isSuccess;
    } catch (e) {
      return false;
    }
  }
  
  function handleQuickAction(actionKey) {
    const config = BULK_ACTIONS[actionKey];
    if (!config) return;
  
    if (config.interaction === "toggleFilter") {
      setShowMissingOnly((prev) => !prev);
      return;
    }

    openConfirm(actionKey);
  }

  const azBarRef = useRef(null);
  useStickyVars({ ref: azBarRef, cssVarName: "--az-bar-h", dimension: "height" });
  
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
      <QuickActions
        order={BULK_ACTION_ORDER}
        registry={BULK_ACTIONS}
        context={{ busy: state.bulkUpdating, total: totalCards }}
        onAction={handleQuickAction}
        activeKeys={showMissingOnly ? [BULK_ACTION.SHOW_MISSING] : []}
      />

      {confirm.open && (() => {
        const config = BULK_ACTIONS[confirm.type];
        const { title, body, confirmLabel, confirmVariant } = config.confirm;
        return (
          <ConfirmModal
            show
            title={title}
            body={body(totalCards)}
            confirmLabel={confirmLabel}
            confirmVariant={confirmVariant}
            busy={state.bulkUpdating}
            onCancel={closeConfirm}
            onConfirm={async () => {
              await executeConfirmedAction(confirm.type);
              closeConfirm();
            }}
          />
        );
      })()}
            
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
        />
      )}

      <ToastContainer position="bottom-end" className="p-3 cards-toast-container">
        <BulkToast
          show={toast.visible}
          message={toast.message}
          canUndo={state?.lastUndo?.type === toast.type}
          onClose={hideToast}
          onUndo={async () => { await undoLastBulk(); hideToast(); }}
        />
      </ToastContainer>

      </>
      )}

        <ScrollToTop />
    </PageContainer>
  )
}

export default React.memo(Cards);
