import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/dashboard.css";

const Cards = () => {
  const [showSortOverlay, setShowSortOverlay] = useState(false);
  const [showFilterOverlay, setShowFilterOverlay] = useState(false);
  const [currentSort, setCurrentSort] = useState("Sort by due date");

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
    <>
      <style>{`
        .bg-dark-main { background-color: #1d2125; }
        .sidebar { width: 260px; background-color: #1d2125; }
        .sidebar-heading { color: #a8b4c1; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
        
        .sidebar-btn-link { 
          background: none; border: none; color: #9fadbc; padding: 6px 12px; 
          border-radius: 4px; font-size: 0.9rem; transition: 0.2s;
        }
        .sidebar-btn-link:hover { background-color: #333c44; color: #fff; }
        .sidebar-btn-link.active { background-color: #579dff29; color: #579dff; font-weight: 600; }
        
        .workspace-icon { 
          width: 24px; height: 24px; background: linear-gradient(#e2b203, #ff9f1a); 
          color: #1d2125; display: inline-flex; align-items: center; 
          justify-content: center; border-radius: 3px; font-weight: bold; 
        }
        
        .sidebar-workspace-btn { background: none; border: none; color: #9fadbc; padding: 4px 8px; }
        
        .settings-header-bar { background-color: #2c333a; color: #9fadbc; font-size: 0.85rem; }
        .info-box-disabled { border: 1px solid #333c44; background-color: rgba(0,0,0,0.1); }
        .text-muted-custom { color: #9fadbc; }
        .link-blue { color: #579dff; text-decoration: none; cursor: pointer; font-size: 0.85rem; }
        .link-blue:hover { text-decoration: underline; }
        
        /* Custom Checkbox Styling */
        .checkbox-item { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px; }
        .custom-check { 
            width: 16px; height: 16px; border: 2px solid #444; border-radius: 2px; 
            background: transparent; cursor: pointer; margin-top: 3px;
        }
      `}</style>

      <div className="container-fluid vh-100 bg-dark-main text-light d-flex p-0">
        {/* SIDEBAR */}
        <nav className="sidebar p-3 border-end border-secondary border-opacity-25">
          <section className="mb-4">
            <h6 className="sidebar-heading px-2">Personal Settings</h6>
            <div className="d-flex flex-column gap-1 mt-3">
              <button className="sidebar-btn-link text-start">
                <i className="bi bi-person me-2"></i> Profile and Visibility
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
            <h6 className="sidebar-heading px-2">Workspaces</h6>
            <button className="sidebar-workspace-btn d-flex align-items-center mt-3 mb-2 w-100 text-start">
              <span className="workspace-icon me-2">A</span>
              <span className="fw-bold">Animate Workspace</span>
            </button>
            <div className="d-flex flex-column gap-1 ps-4">
              <button className="sidebar-btn-link text-start">
                <i className="bi bi-kanban me-2"></i> Boards</button>
              <button className="sidebar-btn-link text-start">
                <i className="bi bi-people me-2"></i> Members</button>
              <button className="sidebar-btn-link text-start">
                <i className="bi bi-gear me-2"></i> Settings</button>
            </div>
          </section>
        </nav>

        {/* MAIN CONTENT */}
        <main className="flex-grow-1 p-4 content-area position-relative">

          <div className="mb-4">
            <h5 className="fw-bold" style={{ fontSize: "1.1rem" }}>Cards</h5>
              <button
               className="btn d-flex align-items-center justify-content-center rounded-circle position-absolute"
            style={{
              width: "32px",
              height: "32px",
              backgroundColor: "#282e33",
              border: "none",
              color: "#9fadbc",
              padding: 0,
              top: "20px",
              right: "20px"
            }}
            >
              <i className="bi bi-x-lg" style={{ fontSize: "14px" }}></i>
            </button>
          </div>
        
          <div className="d-flex justify-content-end gap-2 mb-4 position-relative">

            {/* Sort Dropdown */}
            <div className="dropdown" ref={dropdownRef}>
              <button
                className="btn btn-sm dropdown-toggle text-light"
                type="button"
                onClick={() => setShowSortOverlay(!showSortOverlay)}
                style={{ backgroundColor: "#282e33", border: "1px solid #3d444d", fontSize: "0.85rem" }}
              >
                {currentSort}
              </button>

              {showSortOverlay && (
                <div
                  className="position-absolute rounded shadow-lg border border-secondary"
                  style={{
                    backgroundColor: "#282e33",
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
                          backgroundColor: currentSort === option ? "rgba(255,255,255,0.05)" : "transparent",
                        }}
                      >
                        {currentSort === option && (
                          <div style={{ width: "3px", height: "30px", backgroundColor: "#579dff" }}></div>
                        )}
                        <button
                          className="btn btn-sm text-start py-2 px-3 border-0 rounded-0 flex-grow-1"
                          style={{
                            backgroundColor: "transparent",
                            color: currentSort === option ? "#579dff" : "#9fadbc",
                            fontSize: "0.85rem",
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
                className="btn btn-sm"
                onClick={() => setShowFilterOverlay(!showFilterOverlay)}
                style={{ backgroundColor: "#282e33", border: "1px solid #3d444d", color: "#9fadbc", fontSize: "0.85rem" }}
              >
                <i className="bi bi-filter me-1"></i> Filter cards
              </button>

              {showFilterOverlay && (
                <div
                  className="position-absolute rounded shadow-lg border border-secondary p-3"
                  style={{
                    backgroundColor: "#282e33",
                    width: "280px",
                    top: "100%",
                    right: "0",
                    zIndex: 1050,
                    marginTop: "8px",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="small fw-bold w-100 text-center" style={{ color: "#9fadbc" }}>
                      Filter cards
                    </span>
                    <button
                      className="btn btn-sm p-0 border-0"
                      style={{ color: "#9fadbc" }}
                      onClick={() => setShowFilterOverlay(false)}
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mb-3">
                    <label className="fw-bold d-block mb-1" style={{ fontSize: "0.7rem", color: "#9fadbc" }}>Card</label>
                    <input
                      type="text"
                      className="form-control form-control-sm border-secondary text-light mb-1"
                      placeholder="Filter by card name..."
                      style={{ backgroundColor: "#1d2125", fontSize: "0.85rem" }}
                    />
                    <span style={{ fontSize: "0.7rem", color: "#9fadbc" }}>Filter by card name keyword.</span>
                  </div>

                  <div className="mb-3">
                    <label className="fw-bold d-block mb-2" style={{ fontSize: "0.7rem", color: "#9fadbc" }}>Card status</label>
                    {["markedComplete", "notMarkedComplete"].map((item, i) => (
                      <div className="form-check" key={item}>
                        <input
                          className="form-check-input bg-transparent border-secondary"
                          type="checkbox"
                          checked={filters[item]}
                          onChange={() => handleCheck(item)}
                          id={`c${i}`}
                        />
                        <label className="form-check-label" style={{ fontSize: "0.85rem", color: "#9fadbc" }} htmlFor={`c${i}`}>
                          {item === "markedComplete" ? "Marked as complete" : "Not marked as complete"}
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="mb-3">
                    <label className="fw-bold d-block mb-2" style={{ fontSize: "0.7rem", color: "#9fadbc" }}>Due date</label>
                    {["noDates", "overdue", "nextSevenDays", "nextMonth"].map((item, i) => (
                      <div className="form-check" key={item}>
                        <input
                          className="form-check-input bg-transparent border-secondary"
                          type="checkbox"
                          checked={filters[item]}
                          onChange={() => handleCheck(item)}
                          id={`d${i}`}
                        />
                        <label className="form-check-label" style={{ fontSize: "0.85rem", color: "#9fadbc" }} htmlFor={`d${i}`}>
                          {item.replace(/([A-Z])/g, " $1")}
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="mb-3">
                    <label className="fw-bold d-block mb-1" style={{ fontSize: "0.7rem", color: "#9fadbc" }}>Board</label>
                    <select
                      className="form-select form-select-sm border-secondary text-light"
                      style={{ backgroundColor: "#1d2125", fontSize: "0.85rem" }}
                    >
                      <option>Filters by boards</option>
                    </select>
                  </div>

                  <div>
                    <label className="fw-bold d-block mb-2" style={{ fontSize: "0.7rem", color: "#9fadbc" }}>Activity</label>
                    {["activeDay", "activeWeek", "activeMonth", "activeLast"].map((item, i) => (
                      <div className="form-check" key={item}>
                        <input
                          className="form-check-input bg-transparent border-secondary"
                          type="checkbox"
                          checked={filters[item]}
                          onChange={() => handleCheck(item)}
                          id={`a${i}`}
                        />
                        <label className="form-check-label" style={{ fontSize: "0.85rem", color: "#9fadbc" }} htmlFor={`a${i}`}>
                          Active in the {item.replace("active", "").toLowerCase()}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              className="btn btn-sm"
              onClick={() => setCurrentSort("Sort by due date")}
              style={{ backgroundColor: "#282e33", border: "1px solid #3d444d", color: "#9fadbc", fontSize: "0.85rem" }}
            >
              Clear filters
            </button>
          </div>

          <div className="row justify-content-center mt-5">
            <div className="col-md-10">
              <div
                className="text-center p-5 rounded"
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  minHeight: "150px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <p className="mb-0" style={{ color: "#9fadbc", fontSize: "0.9rem" }}>
                  No visible cards. You must be added to a card for it to appear here.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Cards;