import React from "react";
import { useNavigate } from "react-router-dom";
import { Col } from "react-bootstrap";

const BoardTemplate = ({ boards = [], showSharedPill = false }) => {
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
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  // Visibility icon — top right
  const VisibilityBadge = ({ visibility }) => {
    const iconMap = {
      private:   { icon: "bi-lock-fill",   title: "Private"   },
      public:    { icon: "bi-globe",        title: "Public"    },
      workspace: { icon: "bi-people-fill",  title: "Workspace" },
    };
    const entry = iconMap[visibility];
    if (!entry) return null;
    return (
      <div
        title={entry.title}
        style={{
          position: "absolute",
          top: "6px",
          right: "8px",
          color: "rgba(255,255,255,0.85)",
          fontSize: "0.68rem",
        }}
      >
        <i className={`bi ${entry.icon}`}></i>
      </div>
    );
  };

  // Shared pill — top left (only rendered when showSharedPill is true)
  const SharedPill = () => (
    <div
      style={{
        position: "absolute",
        top: "6px",
        left: "8px",
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(3px)",
        color: "#cfe2ff",
        fontSize: "0.65rem",
        fontWeight: "700",
        padding: "2px 7px",
        borderRadius: "20px",
        display: "flex",
        alignItems: "center",
        gap: "3px",
      }}
    >
      <i className="bi bi-person-fill" style={{ fontSize: "0.6rem" }}></i>
      Shared
    </div>
  );

  return (
    <>
      <style>{`
        .board-tile-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.3);
        }
      `}</style>

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
              <VisibilityBadge visibility={board.board_visibility} />

              {showSharedPill && <SharedPill />}

              <div style={boardTitleOverlayStyle}>
                {board.board_title}
              </div>
            </div>
          </Col>
        ))
      ) : (
        <Col>
          <div className="text-secondary" style={{ fontSize: "0.82rem", fontStyle: "italic" }}>
            No boards found.
          </div>
        </Col>
      )}
    </>
  );
};

export default BoardTemplate;