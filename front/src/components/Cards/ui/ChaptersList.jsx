import React from "react";
import ChapterSection from "./ChapterSection";

function ChaptersList({
  chaptersData = [],
  getChapterDomId,
  onSelectCard,
  onResetCard,
  statuses,
}) {
  return (
    <section className="chapter-list">
      {chaptersData.map(({ chapterId, chapterName, cards, ownedOrDuplicatedCount }) => (
        <ChapterSection
          key={chapterId}
          chapterId={chapterId}
          chapterName={chapterName}
          cards={cards}
          ownedOrDuplicatedCount={ownedOrDuplicatedCount}
          getChapterDomId={getChapterDomId}
          onSelectCard={onSelectCard}
          onResetCard={onResetCard}
          statuses={statuses}
        />
      ))}
    </section>
  );
}

export default React.memo(ChaptersList);
