import React, { useState, useRef, useEffect } from "react";

const BoardButton = () => {
  const [showCollections, setShowCollections] = useState(false);
  const collectionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        collectionsRef.current &&
        !collectionsRef.current.contains(event.target)
      ) {
        setShowCollections(false);
      }
    };

    if (showCollections) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      z;
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCollections]);

  return (
    <div
      className="container-fluid p-0 d-flex bg-dark-main text-light vh-100 position-relative"
      style={{ backgroundColor: "#2c2c2c" }}
    >
      {/* Sidebar Section */}
      <nav
        className="sidebar p-4 border-end border-secondary"
        style={{ width: "260px", backgroundColor: "#2c2c2c" }}
      >
        <section className="mb-5">
          <h6
            className="sidebar-heading text-secondary small text-uppercase fw-bold"
            style={{ fontSize: "12px" }}
          >
            Personal Settings
          </h6>
          <div className="d-flex flex-column gap-1 mt-3">
            <button className="sidebar-btn-link text-start d-flex align-items-center bg-transparent border-0 text-secondary mb-2">
              <i className="bi bi-person me-2"></i> Profile and Visibilty
            </button>
            <button className="sidebar-btn-link text-start d-flex align-items-center bg-transparent border-0 text-secondary mb-2">
              <i className="bi bi-list-task me-2"></i> Activity
            </button>
            <button className="sidebar-btn-link text-start d-flex align-items-center bg-transparent border-0 text-secondary mb-2">
              <i className="bi bi-card-text me-2"></i> Card
            </button>
            <button className="sidebar-btn-link text-start d-flex align-items-center bg-transparent border-0 text-secondary mb-2">
              <i className="bi bi-gear me-2"></i> Settings
            </button>
          </div>
        </section>

        <section>
          <h6
            className="sidebar-heading text-secondary small text-uppercase fw-bold"
            style={{ fontSize: "12px" }}
          >
            Workspaces
          </h6>
          <button className="sidebar-workspace-btn d-flex align-items-center mt-3 mb-2 w-100 text-start bg-transparent border-0 text-light">
            <span
              className="workspace-icon me-2 d-inline-flex align-items-center justify-content-center bg-warning text-dark fw-bold rounded"
              style={{ width: "24px", height: "24px", fontSize: "14px" }}
            >
              A
            </span>
            <span className="fw-bold">Animate Workplace</span>
          </button>
          <div className="d-flex flex-column gap-1">
            <button
              className="text-start rounded px-3 py-2 border-0 text-white w-100 d-flex align-items-center"
              style={{ backgroundColor: "#5c76e0", fontSize: "14px" }}
            >
              <i className="bi bi-grid-3x3-gap me-2"></i> Boards
            </button>
            <button className="sidebar-btn-link text-start px-5 py-1 bg-transparent border-0 text-secondary mt-1">
              <i className="bi bi-people me-2"></i> Members
            </button>
            <button className="sidebar-btn-link text-start px-5 py-1 bg-transparent border-0 text-secondary mt-1">
              <i className="bi bi-gear me-2"></i> Settings
            </button>
          </div>
        </section>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow-1 p-5 position-relative">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold">Boards</h4>
          <div className="position-relative">
            <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-2 text-secondary"></i>
            <input
              type="text"
              className="form-control bg-transparent border-secondary text-light ps-5"
              placeholder="Search boards"
              style={{ width: "250px", borderRadius: "4px" }}
            />
          </div>
        </div>

        <div className="d-flex gap-3 mb-5">
          <div style={{ width: "200px" }}>
            <label
              className="small text-secondary mb-1"
              style={{ fontSize: "11px" }}
            >
              Sort by
            </label>
            <select
              className="form-select bg-transparent border-secondary text-light shadow-none"
              style={{ fontSize: "13px" }}
            >
              <option>Most recently active</option>
            </select>
          </div>
          <div style={{ width: "200px" }}>
            <label
              className="small text-secondary mb-1"
              style={{ fontSize: "11px" }}
            >
              Filter by
            </label>
            <select
              className="form-select bg-transparent border-secondary text-light shadow-none"
              style={{ fontSize: "13px" }}
            >
              <option>Choose a collection</option>
            </select>
          </div>
        </div>

        <div className="d-flex gap-4 align-items-start">
          {/* Create New Board Card */}
          <div
            className="d-flex align-items-center justify-content-center text-secondary rounded"
            style={{
              width: "280px",
              height: "160px",
              backgroundColor: "#3e3e3e",
              cursor: "pointer",
            }}
          >
            <span>Create new board</span>
          </div>

          {/* Existing Board Card */}
          <div className="position-relative">
            <div
              className="rounded overflow-hidden"
              style={{
                width: "280px",
                height: "160px",
                background: "linear-gradient(135deg, #a855f7 0%, #d946ef 100%)",
              }}
            >
              <div
                className="position-absolute bottom-0 w-100 p-2 fw-bold"
                style={{ backgroundColor: "rgba(0,0,0,0.5)", fontSize: "14px" }}
              >
                My board
              </div>
            </div>

            {/* The Plus Button */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevents immediate close from the useEffect
                setShowCollections(!showCollections);
              }}
              className="btn btn-sm btn-secondary position-absolute bottom-0 end-0 translate-middle-x mb-1 me-1 rounded"
              style={{
                width: "20px",
                height: "20px",
                padding: 0,
                fontSize: "14px",
                backgroundColor: "#5a5a5a",
                border: "none",
                transform: "translateY(110%)",
              }}
            >
              +
            </button>

            {/* Collections Overlay Popover */}
            {showCollections && (
              <div
                ref={collectionsRef}
                className="position-absolute shadow-lg rounded p-4 text-center"
                style={{
                  width: "300px",
                  backgroundColor: "#444",
                  top: "100%",
                  left: "50%",
                  zIndex: 1000,
                  marginTop: "20px",
                }}
              >
                <div className="d-flex justify-content-end">
                  <button
                    onClick={() => setShowCollections(false)}
                    className="btn-close btn-close-white"
                    style={{ fontSize: "10px" }}
                  ></button>
                </div>
                <p className="small text-secondary mb-1">Collections</p>
                <h5 className="fw-bold mb-3" style={{ fontSize: "18px" }}>
                  Organize your boards with collections
                </h5>
                <p className="text-secondary mb-4" style={{ fontSize: "13px" }}>
                  Group your boards by department, topic, team, and more.
                </p>
                <button
                  className="btn btn-primary w-100 fw-bold py-2"
                  style={{ backgroundColor: "#5c76e0", border: "none" }}
                >
                  Create a collection
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Top Right Close Button */}
      <div className="position-absolute top-0 end-0 m-4">
        <div
          className="rounded-circle d-flex align-items-center justify-content-center"
          style={{
            width: "40px",
            height: "40px",
            backgroundColor: "#444",
            cursor: "pointer",
          }}
        >
          <i className="bi bi-x-lg text-secondary"></i>
        </div>
      </div>
    </div>
  );
};

export default BoardButton;
