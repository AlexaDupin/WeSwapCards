import React from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ChapterCarousel from "./ChapterCarousel";
import useChapters from "./useChapters";

export const PLACEHOLDER =
  "https://res.cloudinary.com/dwf28prby/image/upload/v1760480793/placeholder.jpg";

function ChapterCard({ chapter, onSelect }) {
  return (
    <article
      className="home-chapter-card"
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(chapter.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect?.(chapter.id);
        }
      }}
    >
      <img
        src={chapter.image_url || PLACEHOLDER}
        alt={chapter.name}
        className="home-chapter-card__image"
        loading="lazy"
        onError={(e) => { e.currentTarget.style.opacity = 0.1; }}
      />
      <div className="home-chapter-card__body">
        <span className="home-chapter-card__title">{chapter.name}</span>
      </div>
    </article>
  );
}

// Rows come either from `chapters` (the caller already fetched them) or from
// this component's own request to `endpoint`.
export default function ChapterCarouselSection({ title, endpoint, params = {}, chapters }) {
  const navigate = useNavigate();
  const fetched = useChapters(chapters ? null : endpoint, params);
  const { items, loading, err } = chapters ?? fetched;

  // Nothing to show: hide the heading too rather than leave it dangling.
  if (!loading && !err && items.length === 0) return null;

  return (
    <section className="home-chapters-row" data-reveal-container aria-label={title}>
      <h3 className="home-chapters-row__title reveal">{title}</h3>

      <div className="reveal">
        {loading && (
          <div className="text-center my-3">
            <Spinner animation="border" />
          </div>
        )}

        {!!err && <p className="text-danger">{err}</p>}

        {!loading && !err && items.length > 0 && (
          <ChapterCarousel
            items={items}
            ariaLabel={title}
            renderItem={(c) => (
              <ChapterCard
                chapter={c}
                onSelect={(id) => navigate(`/swap/card?chapterId=${id}`)}
              />
            )}
          />
        )}
      </div>
    </section>
  );
}
