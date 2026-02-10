import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const BoardButton = () => {
  const [showCollections, setShowCollections] = useState(false);
  const collectionsRef = useRef(null);

  // Close overlay when clicking outside
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
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCollections]);

  return (
    <>
      <style>{`
        .bg-dark-main { background-color: #1d2125; }
        .sidebar-btn-link:hover {
          background-color: #333c44 !important;
          color: #fff !important;
        }
      `}</style>

      <div
        className="container-fluid p-0 d-flex bg-dark-main text-light vh-100 position-relative"
        style={{ backgroundColor: "#1d2125" }}
      >
        {/* Sidebar Section */}
        <nav
          className="sidebar p-3 border-end border-secondary border-opacity-25"
          style={{ width: "260px", backgroundColor: "#1d2125" }}
        >
          <section className="mb-4">
            <h6
              className="sidebar-heading px-2"
              style={{ 
                color: "#a8b4c1",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase"
              }}
            >
              Personal Settings
            </h6>
            <div className="d-flex flex-column gap-1 mt-3">
              <button 
                className="sidebar-btn-link text-start"
                style={{
                  background: "none",
                  border: "none",
                  color: "#9fadbc",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  fontSize: "0.9rem",
                  transition: "0.2s",
                  width: "100%"
                }}
              >
                <i className="bi bi-person me-2"></i> Profile and Visibility
              </button>
              <button 
                className="sidebar-btn-link text-start"
                style={{
                  background: "none",
                  border: "none",
                  color: "#9fadbc",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  fontSize: "0.9rem",
                  transition: "0.2s",
                  width: "100%"
                }}
              >
                <i className="bi bi-activity me-2"></i> Activity
              </button>
              <button 
                className="sidebar-btn-link text-start"
                style={{
                  background: "none",
                  border: "none",
                  color: "#9fadbc",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  fontSize: "0.9rem",
                  transition: "0.2s",
                  width: "100%"
                }}
              >
                <i className="bi bi-card-text me-2"></i> Card
              </button>
              <button 
                className="sidebar-btn-link text-start"
                style={{
                  background: "none",
                  border: "none",
                  color: "#9fadbc",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  fontSize: "0.9rem",
                  transition: "0.2s",
                  width: "100%"
                }}
              >
                <i className="bi bi-gear me-2"></i> Settings
              </button>
            </div>
          </section>

          <section>
            <h6 
              className="sidebar-heading px-2"
              style={{ 
                color: "#a8b4c1",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase"
              }}
            >
              Workspaces
            </h6>
            <button 
              className="sidebar-workspace-btn d-flex align-items-center mt-3 mb-2 w-100 text-start"
              style={{
                background: "none",
                border: "none",
                color: "#9fadbc",
                padding: "4px 8px"
              }}
            >
              <span
                className="workspace-icon me-2 d-inline-flex align-items-center justify-content-center fw-bold rounded"
                style={{ 
                  width: "24px", 
                  height: "24px", 
                  background: "linear-gradient(#e2b203, #ff9f1a)",
                  color: "#1d2125",
                  borderRadius: "3px"
                }}
              >
                A
              </span>
              <span className="fw-bold">Animate Workspace</span>
            </button>
            <div className="d-flex flex-column gap-1 ps-4">
              <button
                className="sidebar-btn-link text-start active"
                style={{
                  background: "#579dff29",
                  border: "none",
                  color: "#579dff",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  transition: "0.2s",
                  width: "100%"
                }}
              >
                <i className="bi bi-kanban me-2"></i> Boards
              </button>
              <button 
                className="sidebar-btn-link text-start"
                style={{
                  background: "none",
                  border: "none",
                  color: "#9fadbc",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  fontSize: "0.9rem",
                  transition: "0.2s",
                  width: "100%"
                }}
              >
                <i className="bi bi-people me-2"></i> Members
              </button>
              <button 
                className="sidebar-btn-link text-start"
                style={{
                  background: "none",
                  border: "none",
                  color: "#9fadbc",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  fontSize: "0.9rem",
                  transition: "0.2s",
                  width: "100%"
                }}
              >
                <i className="bi bi-gear me-2"></i> Settings
              </button>
            </div>
          </section>
        </nav>

        {/* Main Content Area */}
        <main className="flex-grow-1 p-4" style={{ maxWidth: "1200px" }}>
          {/* Top bar: Search + X */}
          <div className="d-flex align-items-center justify-content-end gap-2 mb-4" style={{ marginTop: "60px" }}>
            <div className="input-group" style={{ maxWidth: "300px" }}>
              <span
                className="input-group-text border-secondary"
                style={{ backgroundColor: "#282e33" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  fill="#9ea3ac"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85zm-5.242.656a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
                </svg>
              </span>
              <input
                type="search"
                className="form-control border-secondary text-light"
                placeholder="Search boards"
                style={{ backgroundColor: "#282e33" }}
              />
            </div>

            <button
  className="btn d-flex align-items-center justify-content-center rounded-circle"
  style={{
    width: "32px",
    height: "32px",
    backgroundColor: "#282e33",
    border: "none",
    color: "#9fadbc",
    padding: 0,
    marginTop: "-100px"  // Adjust the value as needed
  }}
>
  <i className="bi bi-x-lg" style={{ fontSize: "14px" }}></i>
</button>
          </div>

          <div className="d-flex gap-3 align-items-start">
            {/* Create New Board Card */}
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                width: "180px",
                height: "100px",
                backgroundColor: "#282e33",
                color: "#9fadbc",
                cursor: "pointer",
                fontSize: "0.85rem",
                borderRadius: "10px",
                transition: "transform 0.2s, background-color 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#333c44";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#282e33";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <span>Create new board</span>
            </div>

            {/* Existing Board Card */}
            <div className="position-relative" style={{ width: "180px" }}>
              <div
                style={{
                  width: "180px",
                  height: "100px",
                  background: "linear-gradient(180deg, #a855f7 0%, #7c3aed 100%)",
                  borderRadius: "10px",
                  position: "relative",
                  cursor: "pointer",
                  overflow: "hidden",
                  transition: "transform 0.2s, box-shadow 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  className="position-absolute bottom-0 w-100 fw-bold"
                  style={{ 
                    background: "rgba(0, 0, 0, 0.4)",
                    backdropFilter: "blur(4px)",
                    padding: "10px 12px",
                    color: "#fff",
                    fontSize: "0.9rem"
                  }}
                >
                  My board
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default BoardButton;