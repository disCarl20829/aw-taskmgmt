import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/dashboard.css";

const Activity = () => {
  return (
    <>
      <style>{`
        .bg-dark-main { background-color: #1d2125; }
        
        .sidebar {
          width: 260px;
          background-color: #1d2125;
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
        
        .sidebar-btn-link:hover {
          background-color: #333c44;
          color: #fff;
        }
        
        .sidebar-btn-link.active {
          background-color: #579dff29;
          color: #579dff;
          font-weight: 600;
        }
        
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
        
        .sidebar-workspace-btn {
          background: none;
          border: none;
          color: #9fadbc;
          padding: 4px 8px;
        }
        
        .content-area {
          overflow-y: auto;
          max-height: calc(100vh - 60px);
        }
        
        .btn-secondary-custom {
          background-color: #282e33;
          border: 1px solid #3d444d;
          color: #9fadbc;
          font-size: 0.85rem;
        }
        
        .btn-secondary-custom:hover {
          background-color: #333c44;
          color: #fff;
        }
        
        .smaller {
          font-size: 0.75rem;
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
            <h6 className="sidebar-heading px-2">Workspaces</h6>
            <button className="sidebar-workspace-btn d-flex align-items-center mt-3 mb-2 w-100 text-start">
              <span className="workspace-icon me-2">A</span>
              <span className="fw-bold">Animate Workspace</span>
            </button>
            <div className="d-flex flex-column gap-1 ps-4">
              <button className="sidebar-btn-link text-start">
                <i className="bi bi-kanban me-2"></i> Boards
              </button>
              <button className="sidebar-btn-link text-start">
                <i className="bi bi-people me-2"></i> Members
              </button>
              <button className="sidebar-btn-link text-start">
                <i className="bi bi-gear me-2"></i> Settings
              </button>
            </div>
          </section>
        </nav>

        {/* MAIN CONTENT */}
        <main className="flex-grow-1 p-4 content-area position-relative">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold mb-0" style={{ fontSize: "1.1rem" }}>Activity</h5>
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

          <section className="mb-4">
            <div className="d-flex align-items-center mb-3">
              <i className="bi bi-people me-2" style={{ fontSize: "1.2rem" }}></i>
              <h6 className="mb-0 fw-bold" style={{ fontSize: "0.95rem" }}>Workspaces</h6>
            </div>
            <div className="ps-4 border-bottom border-secondary pb-3">
              <div className="d-flex align-items-center" style={{ color: "#9fadbc", fontSize: "0.9rem" }}>
                <span>Animate Workspace</span>
                <i className="bi bi-archive ms-2"></i>
              </div>
            </div>
          </section>

          <section>
            <div className="d-flex align-items-center mb-4">
              <i className="bi bi-list-ul me-2" style={{ fontSize: "1.2rem" }}></i>
              <h6 className="mb-0 fw-bold" style={{ fontSize: "0.95rem" }}>Activity</h6>
            </div>
            <div className="d-flex align-items-start gap-3 ps-2">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-light"
                style={{ 
                  width: "40px", 
                  height: "40px", 
                  flexShrink: 0,
                  background: "linear-gradient(#e2b203, #ff9f1a)"
                }}
              >
                AW
              </div>
              <div className="activity-details">
                <p className="mb-1" style={{ fontSize: "0.9rem" }}>
                  <span className="fw-bold">User123</span> added Jira to
                  <a
                    href="#"
                    className="text-decoration-underline ms-1"
                    style={{ color: "#579dff" }}
                  >
                    Manage your team's projects
                  </a>
                </p>
                <small style={{ color: "#9fadbc", fontSize: "0.8rem" }}>
                  Jan 16, 2026, 3:27 PM <span className="mx-1">on board</span>
                  <a
                    href="#"
                    className="text-decoration-underline"
                    style={{ color: "#9fadbc" }}
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
    </>
  );
};

export default Activity;