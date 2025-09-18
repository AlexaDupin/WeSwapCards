import { useMemo } from "react";

function isOwnedOrDuplicated(status) {
  return status === "owned" || status === "duplicated";
}

export default function useChapterBuckets(
  chapters = [],
  cards = [],
  cardStatuses = {}
) {
  return useMemo(() => {
    const cardsByChapterId = new Map();
    for (const chapter of chapters) cardsByChapterId.set(chapter.id, []);
    for (const card of cards) {
      const bucket = cardsByChapterId.get(card.place_id);
      if (bucket) bucket.push(card);
    }

    const chaptersData = chapters.map((chapter) => {
      const cardsInChapter = cardsByChapterId.get(chapter.id) || [];
      let ownedOrDuplicatedCount = 0;
      for (const card of cardsInChapter) {
        const status = cardStatuses[card.id] || "default";
        if (isOwnedOrDuplicated(status)) ownedOrDuplicatedCount++;
      }
      return {
        chapterId: chapter.id,
        chapterName: chapter.name,
        cards: cardsInChapter,
        ownedOrDuplicatedCount,
      };
    });

    return { chaptersData, cardsByChapterId };
  }, [chapters, cards, cardStatuses]);
}
