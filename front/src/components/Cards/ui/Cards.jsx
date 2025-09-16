import React, { useCallback, useMemo, useRef, useLayoutEffect } from "react";
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
import AZNav from "../../AZNav/AZNav";

function normalizeLeadingLetter(name = "") {
  const s = name.trim().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  const first = s.charAt(0).toUpperCase();
  return first >= "A" && first <= "Z" ? first : "";
}

function Cards() {
  const { state, handleSelect, reset, isLoading } = useCardsLogic();

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

      {!isLoading && !state.alert.message && (

      <>
      <header ref={azRef} className="cards-sticky">
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
      </>
      )}

        <ScrollToTop />
    </PageContainer>
  )
}

export default React.memo(Cards);
