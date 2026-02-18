// BoardTemplate.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

const BoardTemplate = ({ boards = [] }) => {
  const navigate = useNavigate();

  const boardTileStyle = {
    width: "180px",
    height: "100px",
    borderRadius: "10px",
    position: "relative",
    cursor: "pointer",
    overflow: "hidden",
    transition: "transform 0.2s, box-shadow 0.2s",
  };

  const boardTitleOverlayStyle = {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    background: "rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(4px)",
    padding: "10px 12px",
    color: "#fff",
    fontWeight: "600",
    fontSize: "0.9rem",
  };

  return (
    <>
      <style>{`
        .board-tile-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.3);
        }
      `}</style>

      <Row className="g-2">
        {boards.length > 0 ? (
          boards.map((board) => (
            <Col xs="auto" key={board.board_id}>
              <div
                style={{
                  ...boardTileStyle,
                  backgroundColor: board.board_background || "#0079bf",
                }}
                className="board-tile-hover"
                onClick={() => navigate(`/cardboards/${board.board_id}`)}
              >
                <div style={boardTitleOverlayStyle}>{board.board_title}</div>
              </div>
            </Col>
          ))
        ) : (
          <div className="text-secondary">No boards found.</div>
        )}
      </Row>
    </>
  );
};

export default BoardTemplate;
