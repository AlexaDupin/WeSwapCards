import React, { useEffect, useState } from "react";
import { Row, Col, Card, Spinner } from "react-bootstrap";
import { useAuth } from "@clerk/clerk-react";
import { axiosInstance } from "../../../../helpers/axiosInstance";

const PLACEHOLDER =
  "https://res.cloudinary.com/placeholder/image/upload/places/placeholder.jpg"; // replace with your placeholder if you have one

export default function LatestChapters({ onSelect }) {
  const { getToken } = useAuth();
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setErr("");
        const res = await axiosInstance.get(`/chapters/latest?limit=4`, {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
          withCredentials: true,
        });
        if (!cancelled) {
          const items = Array.isArray(res.data?.items) ? res.data.items : [];
          setLatest(items);
        }
      } catch (e) {
        if (!cancelled) {
          console.error("LatestChapters fetch error:", e);
          setErr("Unable to load latest chapters.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [getToken]);

  if (loading) {
    return (
      <div className="my-3 text-center">
        <Spinner animation="border" className="spinner" />
      </div>
    );
  }

  if (err || latest.length === 0) return null;

  return (
    <section className="latest-chapters my-4" aria-labelledby="latest-chapters-title">
      <h2 id="latest-chapters-title" className="h5 mb-3">
        Latest chapters
      </h2>

      <Row className="g-3 latest-chapters-row">
        {latest.map((chapter) => (
          <Col xs={12} md={6} key={chapter.id}>
            <Card
              className="chapter-card banner-style"
              role="button"
              onClick={() => onSelect?.(chapter.id)}
            >
                <Card.Img
                  src={chapter.image_url || PLACEHOLDER}
                  alt={chapter.name}
                  className="chapter-card-image"
                />
                <div className="chapter-card-overlay">
                    <span className="chapter-card-title">{chapter.name}</span>
                </div>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
}
