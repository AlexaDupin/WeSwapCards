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
        const res = await axiosInstance.get(endpoint, { params }); // public
        const rows = Array.isArray(res.data?.items) ? res.data.items : [];
        if (!cancelled) setItems(rows);
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

      {loading && (
        <div className="text-center reveal my-3">
          <Spinner animation="border" />
        </div>
      )}

      {err && <p className="text-danger text-center reveal">{err}</p>}

      <div className="reveal">
      {!loading && !err && items.length > 0 ? (
            <ChapterCarousel
              items={items}
              ariaLabel={title}
              renderItem={(c) => (
                <ChapterCard chapter={c} onSelect={(id) => navigate(`/swap/card?chapterId=${id}`)} />
              )}
            />
        ) : null}
      </div>
    </section>
  );
}
