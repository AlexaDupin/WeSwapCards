import React, { useEffect, useState } from "react";
import { Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useAuth } from "@clerk/clerk-react";
import { axiosInstance } from "../../../../helpers/axiosInstance";

const PLACEHOLDER =
  "https://res.cloudinary.com/placeholder/image/upload/places/placeholder.jpg"; // replace with your placeholder

export default function MiniLatestChaptersTiles({ onSelect, visible }) {
  const { getToken } = useAuth();
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchLatestChapters() {
      try {
        setLoading(true);
        setErr("");
        const res = await axiosInstance.get(`/chapters/latest?limit=4`, {
          headers: { Authorization: `Bearer ${await getToken()}` },
          withCredentials: true,
        });
        if (!cancelled) {
          const items = Array.isArray(res.data?.items) ? res.data.items : [];
          setLatest(items);
        }
      } catch (e) {
        if (!cancelled) {
          console.error("MiniLatestChaptersTiles fetch error:", e);
          setErr("Unable to load latest chapters.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchLatestChapters();
    return () => {
      cancelled = true;
    };
  }, [getToken]);

  if (loading || err || latest.length === 0) {
    return (
      <div className={`mini-tiles ${visible ? "is-open" : ""}`}>
        {loading ? (
          <div className="mini-tiles__loading">
            <Spinner animation="border" className="spinner" />
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className={`mini-tiles ${visible ? "is-open" : ""}`} aria-label="Latest chapters quick access">
      <div className="mb-2 mini-tiles__row">
        {latest.map((chapter) => (
            <button
              type="button"
              className="mini-tiles__item"
              onClick={() => onSelect?.(chapter.id)}
              aria-label={`Open ${chapter.name}`}
              title={chapter.name}
            >
              <img
                src={chapter.image_url || PLACEHOLDER}
                alt={chapter.name}
                className="mini-tiles__img"
              />
              <span className="mini-tiles__label">{chapter.name}</span>
            </button>
        ))}
      </div>
    </div>
  );
}
