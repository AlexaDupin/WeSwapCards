import React from "react";
import ProgressBar from "../../ProgressBar/ui/ProgressBar";
import CardItem from "./CardItem/CardItem";
import ChapterKebabMenu from "./ChapterKebabMenu";

function ChapterSection({
  chapterId,
  chapterName,
  cards,
  ownedOrDuplicatedCount,
  getChapterDomId,
  onSelectCard,
  onResetCard,
  statuses,
  onMarkAllOwned,
  onMarkAllDuplicated,
  isPending = false,
  readOnly = false, 
}) {
  return (
    <section id={getChapterDomId(chapterId)} className="chapter">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h2 className="chapter-title m-0">{chapterName}</h2>
  
        <div className="d-flex align-items-center gap-2">
          <ChapterKebabMenu
            disabled={isPending}
            onMarkAllOwned={() => onMarkAllOwned?.(chapterId)}
            onMarkAllDuplicated={() => onMarkAllDuplicated?.(chapterId)}
          />
        </div>
      </div>

      <ProgressBar
        value={ownedOrDuplicatedCount}
        max={9}
        className="chapter-progress"
      />

      <div className="cards-list" role="list" aria-label={`${chapterName} cards`}>
        {cards.map((card) => (
          <CardItem
            key={card.id}
            item={card}
            status={statuses[card.id] || "default"}
            onSelect={() => onSelectCard(card.id)}
            onReset={() => onResetCard(card.id)}
            readOnly={readOnly}
          />
        ))}
      </div>
    </section>
  );
}

export default React.memo(ChapterSection);
