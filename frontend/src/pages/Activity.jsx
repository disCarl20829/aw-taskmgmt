import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/dashboard.css";

const Activity = () => {
  // State for toggling the Filter overlay
  const [showFilterOverlay, setShowFilterOverlay] = useState(false);

  // State for checklist items
  const [filters, setFilters] = useState({
    markedComplete: false,
    notMarkedComplete: false,
    noDates: false,
    overdue: false,
    nextSevenDays: false,
    nextMonth: false,
    activeDay: false,
    activeWeek: false,
    activeMonth: false,
    activeLast: false,
  });

  const filterRef = useRef(null);

  // Close overlay on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterOverlay(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCheck = (name) => {
    setFilters((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="container-fluid vh-100 bg-dark-main text-light d-flex p-0">
      <nav className="sidebar p-4 border-end border-secondary">
        <section className="mb-5">
          <h6 className="sidebar-heading">Personal Settings</h6>
          <div className="d-flex flex-column gap-1 mt-3">
            <button className="sidebar-btn-link text-start">
              <i className="bi bi-person me-2"></i> Profile and Visibilty
            </button>
            <button className="sidebar-btn-link text-start active">
              <i className="bi bi-list-task me-2"></i> Activity
            </button>
            <button className="sidebar-btn-link text-start">
              <i className="bi bi-card-text me-2"></i> Card
            </button>
            <button className="sidebar-btn-link text-start">
              <i className="bi bi-gear me-2"></i> Settings
            </button>
          </div>
        </section>

        <section>
          <h6 className="sidebar-heading">Workspaces</h6>
          <button className="sidebar-workspace-btn d-flex align-items-center mt-3 mb-2 w-100 text-start">
            <span className="workspace-icon me-2">A</span>
            <span className="fw-bold">Animate Workplace</span>
          </button>
          <div className="d-flex flex-column gap-1 ps-4">
            <button className="sidebar-btn-link text-start">Boards</button>
            <button className="sidebar-btn-link text-start">Members</button>
            <button className="sidebar-btn-link text-start">Settings</button>
          </div>
        </section>
      </nav>

      <main className="flex-grow-1 p-5 position-relative">
        <button className="btn-close btn-close-white position-absolute top-0 end-0 m-4"></button>

        <div className="d-flex justify-content-between align-items-center mb-5">
          <h2 className="fw-bold mb-0">Activity</h2>
          <div className="position-relative" ref={filterRef}>
            <button
              className="btn btn-secondary-custom btn-sm text-secondary"
              onClick={() => setShowFilterOverlay(!showFilterOverlay)}
            >
              <i className="bi bi-filter me-1"></i> Filter cards
            </button>

            {/* Filter Overlay - Exactly like Screenshot 2026-02-05 090939.png */}
            {showFilterOverlay && (
              <div
                className="position-absolute rounded shadow-lg border border-secondary p-3"
                style={{
                  backgroundColor: "#222222",
                  width: "280px",
                  top: "100%",
                  right: "0",
                  zIndex: 1050,
                  marginTop: "10px",
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="small fw-bold text-secondary w-100 text-center">
                    Filter cards
                  </span>
                  <i
                    className="bi bi-x lg cursor-pointer"
                    onClick={() => setShowFilterOverlay(false)}
                  ></i>
                </div>

                <div className="filter-section mb-3">
                  <label className="smaller fw-bold text-secondary mb-1 d-block">
                    Card
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm bg-dark border-secondary text-light mb-1"
                    placeholder="Enter card name..."
                  />
                  <span className="smaller text-secondary">
                    Filter by card name keyword.
                  </span>
                </div>

                <div className="filter-section mb-3">
                  <label className="smaller fw-bold text-secondary mb-2 d-block">
                    Card status
                  </label>
                  <div className="form-check mb-1">
                    <input
                      className="form-check-input bg-transparent border-secondary"
                      type="checkbox"
                      checked={filters.markedComplete}
                      onChange={() => handleCheck("markedComplete")}
                      id="f1"
                    />
                    <label className="form-check-label smaller" htmlFor="f1">
                      Marked as complete
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input bg-transparent border-secondary"
                      type="checkbox"
                      checked={filters.notMarkedComplete}
                      onChange={() => handleCheck("notMarkedComplete")}
                      id="f2"
                    />
                    <label className="form-check-label smaller" htmlFor="f2">
                      Not marked as complete
                    </label>
                  </div>
                </div>

                <div className="filter-section mb-3">
                  <label className="smaller fw-bold text-secondary mb-2 d-block">
                    Due date
                  </label>
                  {["noDates", "overdue", "nextSevenDays", "nextMonth"].map(
                    (item, idx) => (
                      <div className="form-check mb-1" key={item}>
                        <input
                          className="form-check-input bg-transparent border-secondary"
                          type="checkbox"
                          checked={filters[item]}
                          onChange={() => handleCheck(item)}
                          id={`d${idx}`}
                        />
                        <label
                          className="form-check-label smaller text-capitalize"
                          htmlFor={`d${idx}`}
                        >
                          {item.replace(/([A-Z])/g, " $1").trim()}
                        </label>
                      </div>
                    ),
                  )}
                </div>

                <div className="filter-section mb-3">
                  <label className="smaller fw-bold text-secondary mb-1 d-block">
                    Board
                  </label>
                  <select className="form-select form-select-sm bg-dark border-secondary text-light">
                    <option>Select board...</option>
                  </select>
                </div>

                <div className="filter-section">
                  <label className="smaller fw-bold text-secondary mb-2 d-block">
                    Activity
                  </label>
                  {["activeDay", "activeWeek", "activeMonth", "activeLast"].map(
                    (item, idx) => (
                      <div className="form-check mb-1" key={item}>
                        <input
                          className="form-check-input bg-transparent border-secondary"
                          type="checkbox"
                          checked={filters[item]}
                          onChange={() => handleCheck(item)}
                          id={`a${idx}`}
                        />
                        <label
                          className="form-check-label smaller"
                          htmlFor={`a${idx}`}
                        >
                          Active in the{" "}
                          {item.replace("active", "").toLowerCase()}
                        </label>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <section className="mb-5">
          <div className="d-flex align-items-center mb-3">
            <i className="bi bi-people me-2 fs-4"></i>
            <h5 className="mb-0 fw-bold">Workspaces</h5>
          </div>
          <div className="ps-4 ms-2 border-bottom border-secondary pb-3">
            <div className="d-flex align-items-center text-secondary">
              <span>Animate Workspace</span>
              <i className="bi bi-archive ms-2"></i>
            </div>
          </div>
        </section>

        <section>
          <div className="d-flex align-items-center mb-4">
            <i className="bi bi-list-ul me-2 fs-4"></i>
            <h5 className="mb-0 fw-bold">Activity</h5>
          </div>
          <div className="d-flex align-items-start gap-3 ps-2">
            <div
              className="rounded-circle bg-primary d-flex align-items-center justify-content-center fw-bold"
              style={{ width: "40px", height: "40px", flexShrink: 0 }}
            >
              AW
            </div>
            <div className="activity-details">
              <p className="mb-0">
                <span className="fw-bold">User123</span> added Jira to
                <a
                  href="#"
                  className="text-primary text-decoration-underline ms-1"
                >
                  Manage your team's projects
                </a>
              </p>
              <small className="text-secondary">
                Jan 16, 2026, 3:27 PM <span className="mx-1">on board</span>
                <a
                  href="#"
                  className="text-secondary text-decoration-underline"
                >
                  My animate board
                </a>{" "}
                👥
              </small>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Activity;
