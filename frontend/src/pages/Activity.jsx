import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "../css/dashboard.css";

import api from "../config/api";

const Activity = () => {
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await api.get("/tasks/userActivity");
        setActivity(
          Array.isArray(res?.data?.activities) ? res.data.activities : [],
        );
      } catch (err) {
        console.error("Failed to fetch activities:", err);
      }
    };

    fetchActivity();
  }, []);

  const ActivityLogs = ({ activity }) => {
    return (
      <div className="d-flex align-items-start gap-3 ps-2">
        {/* Avatar */}
        <div
          className="rounded-circle overflow-hidden"
          style={{
            width: "40px",
            height: "40px",
            flexShrink: 0,
          }}
        >
          <img
            src={activity.user_img_path}
            alt={activity.user_name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Activity details */}
        <div className="activity-details">
          <p className="mb-1" style={{ fontSize: "0.9rem" }}>
            <span className="fw-bold">{activity.user_name}</span>{" "}
            {activity.message}
          </p>

          <small style={{ color: "#9fadbc", fontSize: "0.8rem" }}>
            {activity.created_at}
            <span className="mx-1">on board</span>
            <Link
              to={`/tasks/boards/${activity.board_id}`}
              className="text-decoration-underline"
              style={{ color: "#9fadbc" }}
            >
              {activity.board_title}
            </Link>
            👥
          </small>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        .bg-dark-main { background-color: #1d2125; }
        
        .sidebar {
          width: 260px;
          min-width: 260px;
          background-color: #1d2125;
          height: 100vh;
          flex-shrink: 0;
        }
        
        .sidebar-heading {
          color: #a8b4c1;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
        }
        
        .sidebar-btn-link {
          background: none;
          border: none;
          color: #9fadbc;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 0.9rem;
          transition: 0.2s;
          width: 100%;
          text-align: left;
        }
        
        .sidebar-btn-link:hover { background-color: #333c44; color: #fff; }
        .sidebar-btn-link.active { background-color: #579dff29; color: #579dff; font-weight: 600; }
        
        .workspace-icon {
          width: 24px;
          height: 24px;
          background: linear-gradient(#e2b203, #ff9f1a);
          color: #1d2125;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 3px;
          font-weight: bold;
        }
        
        .sidebar-workspace-btn { background: none; border: none; color: #9fadbc; padding: 4px 8px; }
        .btn-secondary-custom { background-color: #282e33; border: 1px solid #3d444d; color: #9fadbc; font-size: 0.85rem; }
        .btn-secondary-custom:hover { background-color: #333c44; color: #fff; }
        .smaller { font-size: 0.75rem; }
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
                className="sidebar-btn-link active text-decoration-none"
              >
                <i className="bi bi-list-task me-2"></i> Activity
              </Link>
              <Link
                to="/cards"
                className="sidebar-btn-link text-decoration-none"
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
            <h5 className="fw-bold mb-4" style={{ fontSize: "1.1rem" }}>
              Activity
            </h5>

            <section className="mb-4">
              <div className="d-flex align-items-center mb-3">
                <i
                  className="bi bi-people me-2"
                  style={{ fontSize: "1.2rem" }}
                ></i>
                <h6 className="mb-0 fw-bold" style={{ fontSize: "0.95rem" }}>
                  Workspaces
                </h6>
              </div>
              <div className="ps-4 border-bottom border-secondary pb-3">
                <div
                  className="d-flex align-items-center"
                  style={{ color: "#9fadbc", fontSize: "0.9rem" }}
                >
                  <span>Animate Workspace</span>
                  <i className="bi bi-archive ms-2"></i>
                </div>
              </div>
            </section>

            <section>
              <div className="d-flex align-items-center mb-4">
                <i
                  className="bi bi-list-ul me-2"
                  style={{ fontSize: "1.2rem" }}
                ></i>
                <h6 className="mb-0 fw-bold" style={{ fontSize: "0.95rem" }}>
                  Activity
                </h6>
              </div>
              {activity.length === 0 ? (
                <div className="d-flex align-items-start gap-3 ps-2">
                  User has no activities yet.
                </div>
              ) : (
                activity.map((act) => (
                  <ActivityLogs key={act.activity_id} activity={act} />
                ))
              )}
            </section>
          </main>
        </div>
      </div>
    </>
  );
};

export default Activity;
