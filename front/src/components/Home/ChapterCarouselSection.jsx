import React, { useEffect, useState } from "react";
import { Spinner, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../helpers/axiosInstance";
import ChapterCarousel from "./ChapterCarousel";

const PLACEHOLDER =
  "https://res.cloudinary.com/dwf28prby/image/upload/v1760480793/placeholder.jpg";

function ChapterCard({ chapter, onSelect }) {
  return (
    <Card
      className="chapter-card banner-style"
      role="button"
      onClick={() => onSelect?.(chapter.id)}
    >
      <Card.Img
        src={chapter.image_url || PLACEHOLDER}
        alt={chapter.name}
        className="chapter-card-image"
        loading="lazy"
        onError={(e) => { e.currentTarget.style.opacity = 0.1; }}
      />
      <div className="chapter-card-overlay">
        <span className="chapter-card-title">{chapter.name}</span>
      </div>
    </Card>
  );
}

// /chapters/by-ids has no ORDER BY, so the caller's id order is applied here.
function orderByIds(rows, ids) {
  const position = new Map(
    String(ids)
      .split(",")
      .map((id, index) => [Number(id.trim()), index])
  );
  return [...rows].sort(
    (a, b) =>
      (position.get(a.id) ?? Infinity) - (position.get(b.id) ?? Infinity)
  );
}

export default function ChapterCarouselSection({ title, endpoint, params = {} }) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await axiosInstance.get(endpoint, { params });
        const rows = Array.isArray(res.data?.items) ? res.data.items : [];
        if (!cancelled) setItems(params.ids ? orderByIds(rows, params.ids) : rows);
      } catch (e) {
        if (!cancelled) {
          console.error(`[Home ${title}] fetch error:`, e);
          setErr("Unable to load data.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, JSON.stringify(params), title]);

  return (
    <section className="latest-chapters my-5" data-reveal-container aria-label={title}>
      <h2 className="home-section-title reveal mb-3">{title}</h2>

      <div className="reveal">
        {loading && (
          <div className="text-center my-3">
            <Spinner animation="border" />
          </div>
        )}

      {!!err && <p className="text-danger text-center">{err}</p>}

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
