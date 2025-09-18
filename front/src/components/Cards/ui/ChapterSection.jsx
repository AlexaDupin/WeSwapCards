import React from "react";
import ProgressBar from "../../ProgressBar/ui/ProgressBar";
import CardItem from "./CardItem/CardItem";

function ChapterSection({
  chapterId,
  chapterName,
  cards,
  ownedOrDuplicatedCount,
  getChapterDomId,
  onSelectCard,
  onResetCard,
  statuses,
}) {
  return (
    <section id={getChapterDomId(chapterId)} className="chapter">
      <h2 className="chapter-title">{chapterName}</h2>

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
          />
        ))}
      </div>
    </section>
  );
}

export default React.memo(ChapterSection);
