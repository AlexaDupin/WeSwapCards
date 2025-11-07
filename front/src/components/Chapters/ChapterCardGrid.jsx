import React from "react";
import { Row, Col, Card } from "react-bootstrap";

const PLACEHOLDER =
  "https://res.cloudinary.com/dwf28prby/image/upload/v1760480793/placeholder.jpg";

export default function ChapterCardGrid({ chapters = [], onSelect }) {
  if (!chapters.length) return null;

  return (
    <Row className="g-3 mt-4 latest-chapters-row">
      {chapters.map((chapter) => (
        <Col xs={12} sm={6} md={4} lg={3} key={chapter.id}>
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
        </Col>
      ))}
    </Row>
  );
}
