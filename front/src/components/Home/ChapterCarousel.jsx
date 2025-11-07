import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import "./homeStyles.scss";

export default function ChapterCarousel({ items = [], renderItem, ariaLabel = "Chapters" }) {
  const scrollerRef = useRef(null);

  // index-based state
  const [index, setIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const [stepWidth, setStepWidth] = useState(0); // card width + gap

  // measure card width + gap and compute maxIndex
  const measure = () => {
    const el = scrollerRef.current;
    if (!el) return;

    const item = el.querySelector(".chapter-carousel__item");
    if (!item) {
      setStepWidth(0);
      setIndex(0);
      setMaxIndex(0);
      return;
    }

    // card width
    const cardWidth = item.offsetWidth;

    // grid gap lives on the scroller (CSS Grid)
    const style = window.getComputedStyle(el);
    const gap = parseFloat(style.columnGap || style.gap || "0") || 0;

    const step = cardWidth + gap;
    const visibleCount = Math.max(1, Math.floor((el.clientWidth + gap) / step));
    const maxIdx = Math.max(0, (items.length || 0) - visibleCount);

    // derive current index from current scrollLeft
    const currentIdx = step > 0 ? Math.round(el.scrollLeft / step) : 0;

    setStepWidth(step);
    setMaxIndex(maxIdx);
    setIndex(Math.min(Math.max(0, currentIdx), maxIdx));
  };

  // keep index in sync while scrolling
  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el || stepWidth <= 0) return;
    const idx = Math.round(el.scrollLeft / stepWidth);
    setIndex((prev) => (prev === idx ? prev : idx));
  };

  // re-measure on mount/resize/content changes
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    measure();

    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);

    const ro = new ResizeObserver(measure);
    ro.observe(el);

    // also re-measure once images settle (first time)
    const imgs = Array.from(el.querySelectorAll("img"));
    let awaiting = imgs.length;
    const done = () => {
      awaiting -= 1;
      if (awaiting <= 0) measure();
    };
    if (awaiting === 0) {
      measure();
    } else {
      imgs.forEach((img) => {
        if (img.complete) done();
        else {
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
        }
      });
    }

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  // go to a specific index, clamped
  const goTo = (nextIdx) => {
    const el = scrollerRef.current;
    if (!el || stepWidth <= 0) return;
    const clamped = Math.min(Math.max(0, nextIdx), maxIndex);
    setIndex(clamped);
    el.scrollTo({ left: clamped * stepWidth, behavior: "smooth" });
  };

  const canScrollLeft = index > 0;
  const canScrollRight = index < maxIndex;

  if (!items?.length) return null;

  return (
    <div className="chapter-carousel" aria-label={ariaLabel}>
      {canScrollLeft && (
        <button
          type="button"
          className="chapter-carousel__nav chapter-carousel__nav--prev"
          aria-label="Scroll left"
          onClick={() => goTo(index - 1)}
        >
          <ChevronLeft />
        </button>
      )}

      <div className="chapter-carousel__scroller" ref={scrollerRef}>
        {items.map((it) => (
          <div key={it.id} className="chapter-carousel__item">
            {renderItem(it)}
          </div>
        ))}
      </div>

      {canScrollRight && (
        <button
          type="button"
          className="chapter-carousel__nav chapter-carousel__nav--next"
          aria-label="Scroll right"
          onClick={() => goTo(index + 1)}
        >
          <ChevronRight />
        </button>
      )}
    </div>
  );
}