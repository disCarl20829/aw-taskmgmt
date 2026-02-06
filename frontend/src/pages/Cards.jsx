import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/dashboard.css";

const Cards = () => {
  // State for overlays
  const [showSortOverlay, setShowSortOverlay] = useState(false);
  const [showFilterOverlay, setShowFilterOverlay] = useState(false);
  const [currentSort, setCurrentSort] = useState("Sort by due date");

  // State for filter checklists
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

  // Refs for click-outside logic
  const dropdownRef = useRef(null);
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSortOverlay(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterOverlay(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSortSelect = (sortType) => {
    setCurrentSort(sortType);
    setShowSortOverlay(false);
  };

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
            <button className="sidebar-btn-link text-start">
              <i className="bi bi-list-task me-2"></i> Activity
            </button>
            <button className="sidebar-btn-link text-start active">
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
        <button className="btn-close-custom">✕</button>

        <div className="mb-4">
          <h2 className="fw-bold h4">Cards</h2>
        </div>

        <div className="d-flex justify-content-end gap-2 mb-4 position-relative">
          {/* Sort Dropdown */}
          <div className="dropdown" ref={dropdownRef}>
            <button
              className="btn btn-secondary-custom btn-sm dropdown-toggle text-light"
              type="button"
              onClick={() => setShowSortOverlay(!showSortOverlay)}
            >
              {currentSort}
            </button>

            {showSortOverlay && (
              <div
                className="position-absolute rounded shadow-lg border border-secondary"
                style={{
                  backgroundColor: "#1a1a1a",
                  width: "220px",
                  top: "100%",
                  right: "0",
                  zIndex: 1050,
                  marginTop: "8px",
                  overflow: "hidden",
                }}
              >
                <div className="d-flex flex-column">
                  {["Sort by board", "Sort by due date"].map((option) => (
                    <div
                      key={option}
                      className="d-flex align-items-center"
                      style={{
                        backgroundColor:
                          currentSort === option
                            ? "rgba(255, 255, 255, 0.05)"
                            : "transparent",
                      }}
                    >
                      {currentSort === option && (
                        <div
                          style={{
                            width: "3px",
                            height: "30px",
                            backgroundColor: "#0d6efd",
                          }}
                        ></div>
                      )}
                      <button
                        className="btn btn-sm text-start py-2 px-3 border-0 rounded-0 flex-grow-1"
                        style={{
                          backgroundColor: "transparent",
                          color: currentSort === option ? "#4dabff" : "#fff",
                        }}
                        onClick={() => handleSortSelect(option)}
                      >
                        {option}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Filter Dropdown */}
          <div className="position-relative" ref={filterRef}>
            <button
              className="btn btn-secondary-custom btn-sm text-secondary"
              onClick={() => setShowFilterOverlay(!showFilterOverlay)}
            >
              <i className="bi bi-filter me-1"></i> Filter cards
            </button>

            {showFilterOverlay && (
              <div
                className="position-absolute rounded shadow-lg border border-secondary p-3"
                style={{
                  backgroundColor: "#1a1a1a",
                  width: "280px",
                  top: "100%",
                  right: "0",
                  zIndex: 1050,
                  marginTop: "8px",
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="small fw-bold text-secondary w-100 text-center">
                    Filter cards
                  </span>
                  <button
                    className="btn btn-sm text-secondary p-0 border-0"
                    onClick={() => setShowFilterOverlay(false)}
                  >
                    ✕
                  </button>
                </div>

                <div className="mb-3">
                  <label className="smaller fw-bold text-secondary mb-1 d-block">
                    Card
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm bg-dark border-secondary text-light mb-1"
                    placeholder="Filter by card name..."
                  />
                  <span style={{ fontSize: "11px" }} className="text-secondary">
                    Filter by card name keyword.
                  </span>
                </div>

                <div className="mb-3">
                  <label className="smaller fw-bold text-secondary mb-2 d-block">
                    Card status
                  </label>
                  <div className="form-check">
                    <input
                      className="form-check-input bg-transparent border-secondary"
                      type="checkbox"
                      checked={filters.markedComplete}
                      onChange={() => handleCheck("markedComplete")}
                      id="c1"
                    />
                    <label className="form-check-label smaller" htmlFor="c1">
                      Marked as complete
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input bg-transparent border-secondary"
                      type="checkbox"
                      checked={filters.notMarkedComplete}
                      onChange={() => handleCheck("notMarkedComplete")}
                      id="c2"
                    />
                    <label className="form-check-label smaller" htmlFor="c2">
                      Not marked as complete
                    </label>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="smaller fw-bold text-secondary mb-2 d-block">
                    Due date
                  </label>
                  {["noDates", "overdue", "nextSevenDays", "nextMonth"].map(
                    (item, i) => (
                      <div className="form-check" key={item}>
                        <input
                          className="form-check-input bg-transparent border-secondary"
                          type="checkbox"
                          checked={filters[item]}
                          onChange={() => handleCheck(item)}
                          id={`d${i}`}
                        />
                        <label
                          className="form-check-label smaller text-capitalize"
                          htmlFor={`d${i}`}
                        >
                          {item.replace(/([A-Z])/g, " $1")}
                        </label>
                      </div>
                    ),
                  )}
                </div>

                <div className="mb-3">
                  <label className="smaller fw-bold text-secondary mb-1 d-block">
                    Board
                  </label>
                  <select className="form-select form-select-sm bg-dark border-secondary text-light">
                    <option>Filters by boards</option>
                  </select>
                </div>

                <div>
                  <label className="smaller fw-bold text-secondary mb-2 d-block">
                    Activity
                  </label>
                  {["activeDay", "activeWeek", "activeMonth", "activeLast"].map(
                    (item, i) => (
                      <div className="form-check" key={item}>
                        <input
                          className="form-check-input bg-transparent border-secondary"
                          type="checkbox"
                          checked={filters[item]}
                          onChange={() => handleCheck(item)}
                          id={`a${i}`}
                        />
                        <label
                          className="form-check-label smaller"
                          htmlFor={`a${i}`}
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

          <button
            className="btn btn-secondary-custom btn-sm text-secondary"
            onClick={() => setCurrentSort("Sort by due date")}
          >
            Clears filters
          </button>
        </div>

        <div className="row justify-content-center mt-5">
          <div className="col-md-10">
            <div
              className="card-empty-state text-center p-5 rounded"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                minHeight: "150px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p className="text-secondary mb-0">
                No visible cards. You must be added to a card for it to appear
                here.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cards;
