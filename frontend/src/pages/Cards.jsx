import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "../css/dashboard.css";

import api from "../config/api";

const Cards = () => {
  const [showSortOverlay, setShowSortOverlay] = useState(false);
  const [showFilterOverlay, setShowFilterOverlay] = useState(false);
  const [currentSort, setCurrentSort] = useState("Sort by due date");
  const [cards, setCards] = useState([]);

  const [filters, setFilters] = useState({
    cardStatus: null,
    dueDate: null,
    activity: null,
    board: null,
  });

  const dropdownRef = useRef(null);
  const filterRef = useRef(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await api.get("/tasks/userCard");
        setCards(Array.isArray(res?.data?.cards) ? res.data.cards : []);
      } catch (err) {
        console.error("Failed to fetch cards:", err);
      }
    };

    fetchCards();
  }, []);

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

  const handleCheck = (category, value) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category] === value ? null : value,
    }));
  };

  const CardItem = ({ card }) => {
    return (
      <div
        className="p-3 rounded mb-3"
        style={{
          backgroundColor: "#282e33",
          border: "1px solid #3d444d",
          cursor: "pointer",
          transition: "0.2s",
        }}
      >
        {/* Card Header */}
        <div className="d-flex justify-content-between align-items-start">
          <h6
            className="mb-1"
            style={{ fontSize: "0.95rem", color: "#ffffff" }}
          >
            {card.title}
          </h6>

          {card.completed && (
            <i
              className="bi bi-check-circle-fill"
              style={{ color: "#22c55e", fontSize: "14px" }}
            ></i>
          )}
        </div>

        {/* Description */}
        {card.description && (
          <p className="mb-2" style={{ fontSize: "0.8rem", color: "#9fadbc" }}>
            {card.description}
          </p>
        )}

        {/* Footer Info */}
        <div className="d-flex justify-content-between align-items-center mt-2">
          {/* Due Date */}
          {card.dueDate && (
            <span
              className="px-2 py-1 rounded"
              style={{
                fontSize: "0.7rem",
                backgroundColor: card.overdue
                  ? "rgba(248,113,104,0.2)"
                  : "rgba(87,157,255,0.2)",
                color: card.overdue ? "#f87168" : "#579dff",
              }}
            >
              <i className="bi bi-calendar me-1"></i>
              {card.dueDate}
            </span>
          )}

          {/* Board Name */}
          {card.board && (
            <span
              style={{
                fontSize: "0.7rem",
                color: "#9fadbc",
              }}
            >
              {card.board}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        .bg-dark-main { background-color: #1d2125; }
        .sidebar { width: 260px; min-width: 260px; background-color: #1d2125; height: 100vh; flex-shrink: 0; }
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
        
        .checkbox-item { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px; }
        .custom-check { 
            width: 16px; height: 16px; border: 2px solid #444; border-radius: 2px; 
            background: transparent; cursor: pointer; margin-top: 3px;
        }
      `}</style>

      <div
        className="bg-dark-main text-light d-flex p-0"
        style={{ height: "100vh", overflow: "hidden" }}
      >
        {/* SIDEBAR — never moves */}
        <nav className="sidebar p-3 border-end border-secondary border-opacity-25">
          <section className="mb-4">
            <h6 className="sidebar-heading px-2">Personal Settings</h6>
            <div className="d-flex flex-column gap-1 mt-3">
              <Link
                to="/activity"
                className="sidebar-btn-link text-decoration-none"
              >
                <i className="bi bi-list-task me-2"></i> Activity
              </Link>
              <Link
                to="/cards"
                className="sidebar-btn-link active text-decoration-none"
              >
                <i className="bi bi-card-text me-2"></i> Card
              </Link>
              <Link
                to="/settingpage"
                className="sidebar-btn-link text-decoration-none"
              >
                <i className="bi bi-gear me-2"></i> Settings
              </Link>
            </div>
          </section>

          <section>
            <h6 className="sidebar-heading px-2">Workspaces</h6>
            <div className="d-flex align-items-center mt-3 mb-2 w-100 text-start px-2">
              <span className="workspace-icon me-2">A</span>
              <span className="fw-bold" style={{ color: "#9fadbc" }}>
                Animate Workspace
              </span>
            </div>
            <div className="d-flex flex-column gap-1 ps-4">
              <Link
                to="/boardbutton"
                className="sidebar-btn-link text-decoration-none"
              >
                <i className="bi bi-kanban me-2"></i> Boards
              </Link>
              <Link
                to="/members"
                className="sidebar-btn-link text-decoration-none"
              >
                <i className="bi bi-people me-2"></i> Members
              </Link>
              <Link
                to="/settings"
                className="sidebar-btn-link text-decoration-none"
              >
                <i className="bi bi-gear me-2"></i> Settings
              </Link>
            </div>
          </section>
        </nav>

        {/* RIGHT COLUMN */}
        <div
          style={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          {/* X button row — pinned, never scrolls */}
          <div
            style={{
              flexShrink: 0,
              display: "flex",
              justifyContent: "flex-end",
              padding: "12px 16px",
              backgroundColor: "#1d2125",
            }}
          >
            <button
              style={{
                width: "32px",
                height: "32px",
                backgroundColor: "#282e33",
                border: "none",
                color: "#9fadbc",
                padding: 0,
                borderRadius: "50%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <i
                className="bi bi-x-lg"
                style={{ fontSize: "14px", lineHeight: 1 }}
              ></i>
            </button>
          </div>

          {/* Scrollable content */}
          <main
            style={{
              flexGrow: 1,
              overflowY: "auto",
              padding: "0 24px 24px 24px",
            }}
          >
            <div className="mb-4">
              <h5 className="fw-bold" style={{ fontSize: "1.1rem" }}>
                Cards
              </h5>
            </div>

            <div className="d-flex justify-content-end gap-2 mb-4 position-relative">
              {/* Sort Dropdown */}
              <div className="dropdown" ref={dropdownRef}>
                <button
                  className="btn btn-sm dropdown-toggle text-light"
                  type="button"
                  onClick={() => setShowSortOverlay(!showSortOverlay)}
                  style={{
                    backgroundColor: "#282e33",
                    border: "1px solid #3d444d",
                    fontSize: "0.85rem",
                  }}
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
                            backgroundColor:
                              currentSort === option
                                ? "rgba(255,255,255,0.05)"
                                : "transparent",
                          }}
                        >
                          {currentSort === option && (
                            <div
                              style={{
                                width: "3px",
                                height: "30px",
                                backgroundColor: "#579dff",
                              }}
                            ></div>
                          )}
                          <button
                            className="btn btn-sm text-start py-2 px-3 border-0 rounded-0 flex-grow-1"
                            style={{
                              backgroundColor: "transparent",
                              color:
                                currentSort === option ? "#579dff" : "#9fadbc",
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
                  style={{
                    backgroundColor: "#282e33",
                    border: "1px solid #3d444d",
                    color: "#9fadbc",
                    fontSize: "0.85rem",
                  }}
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
                      <span
                        className="small fw-bold w-100 text-center"
                        style={{ color: "#9fadbc" }}
                      >
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
                      <label
                        className="fw-bold d-block mb-1"
                        style={{ fontSize: "0.7rem", color: "#9fadbc" }}
                      >
                        Card
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm border-secondary text-light mb-1"
                        placeholder="Filter by card name..."
                        style={{
                          backgroundColor: "#1d2125",
                          fontSize: "0.85rem",
                        }}
                      />
                      <span style={{ fontSize: "0.7rem", color: "#9fadbc" }}>
                        Filter by card name keyword.
                      </span>
                    </div>

                    {/* Card Status */}
                    <div className="mb-3">
                      <label
                        className="fw-bold d-block mb-2"
                        style={{ fontSize: "0.7rem", color: "#9fadbc" }}
                      >
                        Card status
                      </label>
                      <div className="form-check">
                        <input
                          className="form-check-input bg-transparent border-secondary"
                          type="checkbox"
                          checked={filters.cardStatus === "markedComplete"}
                          onChange={() =>
                            handleCheck("cardStatus", "markedComplete")
                          }
                          id="c0"
                        />
                        <label
                          className="form-check-label"
                          style={{ fontSize: "0.85rem", color: "#9fadbc" }}
                          htmlFor="c0"
                        >
                          Marked as complete
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input bg-transparent border-secondary"
                          type="checkbox"
                          checked={filters.cardStatus === "notMarkedComplete"}
                          onChange={() =>
                            handleCheck("cardStatus", "notMarkedComplete")
                          }
                          id="c1"
                        />
                        <label
                          className="form-check-label"
                          style={{ fontSize: "0.85rem", color: "#9fadbc" }}
                          htmlFor="c1"
                        >
                          Not marked as complete
                        </label>
                      </div>
                    </div>

                    {/* Due Date */}
                    <div className="mb-3">
                      <label
                        className="fw-bold d-block mb-2"
                        style={{ fontSize: "0.7rem", color: "#9fadbc" }}
                      >
                        Due date
                      </label>
                      <div className="form-check">
                        <input
                          className="form-check-input bg-transparent border-secondary"
                          type="checkbox"
                          checked={filters.dueDate === "noDates"}
                          onChange={() => handleCheck("dueDate", "noDates")}
                          id="d0"
                        />
                        <label
                          className="form-check-label d-flex align-items-center gap-2"
                          style={{ fontSize: "0.85rem", color: "#9fadbc" }}
                          htmlFor="d0"
                        >
                          <i
                            className="bi bi-dash-circle"
                            style={{ fontSize: "14px" }}
                          ></i>{" "}
                          No dates
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input bg-transparent border-secondary"
                          type="checkbox"
                          checked={filters.dueDate === "overdue"}
                          onChange={() => handleCheck("dueDate", "overdue")}
                          id="d1"
                        />
                        <label
                          className="form-check-label d-flex align-items-center gap-2"
                          style={{ fontSize: "0.85rem", color: "#9fadbc" }}
                          htmlFor="d1"
                        >
                          <i
                            className="bi bi-exclamation-triangle"
                            style={{ fontSize: "14px", color: "#f87168" }}
                          ></i>{" "}
                          Overdue
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input bg-transparent border-secondary"
                          type="checkbox"
                          checked={filters.dueDate === "nextSevenDays"}
                          onChange={() =>
                            handleCheck("dueDate", "nextSevenDays")
                          }
                          id="d2"
                        />
                        <label
                          className="form-check-label d-flex align-items-center gap-2"
                          style={{ fontSize: "0.85rem", color: "#9fadbc" }}
                          htmlFor="d2"
                        >
                          <i
                            className="bi bi-calendar-week"
                            style={{ fontSize: "14px" }}
                          ></i>{" "}
                          Next seven days
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input bg-transparent border-secondary"
                          type="checkbox"
                          checked={filters.dueDate === "nextMonth"}
                          onChange={() => handleCheck("dueDate", "nextMonth")}
                          id="d3"
                        />
                        <label
                          className="form-check-label d-flex align-items-center gap-2"
                          style={{ fontSize: "0.85rem", color: "#9fadbc" }}
                          htmlFor="d3"
                        >
                          <i
                            className="bi bi-calendar-month"
                            style={{ fontSize: "14px" }}
                          ></i>{" "}
                          Next month
                        </label>
                      </div>
                    </div>

                    {/* Board */}
                    <div className="mb-3">
                      <label
                        className="fw-bold d-block mb-1"
                        style={{ fontSize: "0.7rem", color: "#9fadbc" }}
                      >
                        Board
                      </label>
                      <select
                        className="form-select form-select-sm border-secondary text-light"
                        style={{
                          backgroundColor: "#1d2125",
                          fontSize: "0.85rem",
                        }}
                      >
                        <option>Filters by boards</option>
                      </select>
                    </div>

                    {/* Activity */}
                    <div>
                      <label
                        className="fw-bold d-block mb-2"
                        style={{ fontSize: "0.7rem", color: "#9fadbc" }}
                      >
                        Activity
                      </label>
                      {[
                        {
                          id: "a0",
                          value: "activeDay",
                          label: "Active in the day",
                        },
                        {
                          id: "a1",
                          value: "activeWeek",
                          label: "Active in the week",
                        },
                        {
                          id: "a2",
                          value: "activeMonth",
                          label: "Active in the month",
                        },
                        {
                          id: "a3",
                          value: "activeLast",
                          label: "Active in the last",
                        },
                      ].map(({ id, value, label }) => (
                        <div className="form-check" key={id}>
                          <input
                            className="form-check-input bg-transparent border-secondary"
                            type="checkbox"
                            checked={filters.activity === value}
                            onChange={() => handleCheck("activity", value)}
                            id={id}
                          />
                          <label
                            className="form-check-label"
                            style={{ fontSize: "0.85rem", color: "#9fadbc" }}
                            htmlFor={id}
                          >
                            {label}
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
                style={{
                  backgroundColor: "#282e33",
                  border: "1px solid #3d444d",
                  color: "#9fadbc",
                  fontSize: "0.85rem",
                }}
              >
                Clear filters
              </button>
            </div>

            <div className="row mt-3">
              <div className="col-md-10 mx-auto">
                {cards.length === 0 ? (
                  <div
                    className="text-center p-5 rounded"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <p
                      className="mb-0"
                      style={{ color: "#9fadbc", fontSize: "0.9rem" }}
                    >
                      No visible cards. You must be added to a card for it to
                      appear here.
                    </p>
                  </div>
                ) : (
                  cards.map((card) => <CardItem key={card.id} card={card} />)
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Cards;
