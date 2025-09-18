import { useMemo, useCallback } from "react";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function normalizeFirstLetterOfName(name = "") {
  const withoutDiacritics = name.trim().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  const firstCharacter = withoutDiacritics.charAt(0).toUpperCase();
  const isLatinLetter = firstCharacter >= "A" && firstCharacter <= "Z";
  return isLatinLetter ? firstCharacter : "";
}

export default function useAZIndex(chapters = []) {
  const letterToFirstChapterId = useMemo(() => {
    const mapping = {};
    for (const letter of ALPHABET) mapping[letter] = null;

    for (const chapter of chapters) {
      const firstLetter = normalizeFirstLetterOfName(chapter.name);
      if (firstLetter && !mapping[firstLetter]) {
        mapping[firstLetter] = chapter.id;
      }
    }
    return mapping;
  }, [chapters]);

  const lettersWithChapters = useMemo(() => {
    const result = new Set();
    for (const [letter, chapterId] of Object.entries(letterToFirstChapterId)) {
      if (chapterId) result.add(letter);
    }
    return result;
  }, [letterToFirstChapterId]);

  const getChapterDomId = useCallback(
    (chapterId) => `chapter-${chapterId}`,
    []
  );

  const scrollToLetter = useCallback(
    (letter) => {
      const letterIndex = ALPHABET.indexOf(letter);
      if (letterIndex === -1) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const directChapterId = letterToFirstChapterId[letter];

      const findNearestChapterId = () => {
        for (let i = letterIndex + 1; i < ALPHABET.length; i++) {
          const nextId = letterToFirstChapterId[ALPHABET[i]];
          if (nextId) return nextId;
        }
        for (let i = letterIndex - 1; i >= 0; i--) {
          const prevId = letterToFirstChapterId[ALPHABET[i]];
          if (prevId) return prevId;
        }
        return null;
      };

      const targetChapterId = directChapterId || findNearestChapterId();
      if (!targetChapterId) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const targetElementId = getChapterDomId(targetChapterId);
      const targetElement = document.getElementById(targetElementId);

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [letterToFirstChapterId, getChapterDomId]
  );

  return { lettersWithChapters, scrollToLetter, getChapterDomId };
}
