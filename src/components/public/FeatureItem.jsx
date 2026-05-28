import React from "react";
import { Card } from "react-bootstrap";

const FeatureItem = ({ icon: Icon, title, desc }) => {
  return (
    <Card className="text-center border-0 shadow-sm h-100 feature-card">
      <Card.Body className="d-flex flex-column align-items-center p-4">
        <div
          className="rounded-circle d-flex align-items-center justify-content-center mb-3"
          style={{
            width: 64,
            height: 64,
            backgroundColor: "rgba(0,0,0,0.05)",
          }}
        >
          <Icon size={28} style={{ color: "#FFB6C1" }} />
        </div>

        <Card.Title className="mb-2 fw-medium">{title}</Card.Title>
        <Card.Text className="text-muted small">{desc}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default FeatureItem;
