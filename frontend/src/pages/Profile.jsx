import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/dashboard.css";
import { Link } from "react-router-dom";

const Profile = () => {
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
        
        .custom-input-sm {
          background-color: #282e33;
          border: 1px solid #3d444d;
          color: #9fadbc;
          font-size: 0.9rem;
          padding: 8px 12px;
        }
        
        .custom-input-sm:focus {
          background-color: #282e33;
          border-color: #579dff;
          color: #fff;
          outline: none;
          box-shadow: none;
        }
        
        .custom-input-sm::placeholder {
          color: #6b7280;
        }
        
        .tiny-label {
          font-size: 0.75rem;
          color: #9fadbc;
        }
        
        .tiny-text {
          font-size: 0.7rem;
        }
        
        .text-dim {
          color: #6b7280;
        }
        
        .smaller {
          font-size: 0.85rem;
          color: #9fadbc;
        }
      `}</style>

      <div className="container-fluid p-0 d-flex bg-dark-main text-light vh-100">
        {/* Sidebar Section */}
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

        {/* Main Content Section */}
        <div
          className="flex-grow-1 position-relative"
          style={{
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
            <div className="d-flex justify-content-center">
              <div style={{ maxWidth: "600px", width: "100%" }}>
                {/* Header with Title */}
                <div className="mb-4">
                  <h5 className="fw-bold mb-0" style={{ fontSize: "1.1rem" }}>
                    Profile and Visibility
                  </h5>
                </div>

                <div className="home-main-content">
                  <h6
                    className="text-white mb-2"
                    style={{ fontSize: "0.95rem" }}
                  >
                    About
                  </h6>
                  <p className="smaller mb-4">
                    Required fields are marked with an asterisk{" "}
                    <span className="text-danger">*</span>
                  </p>

                  {/* Username Field */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="tiny-label fw-bold">
                        Username <span className="text-danger">*</span>
                      </label>
                      <span className="tiny-text text-dim">Always public</span>
                    </div>
                    <input
                      type="text"
                      className="form-control custom-input-sm w-100"
                      placeholder="Enter your username"
                    />
                  </div>

                  {/* Bio Field */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="tiny-label fw-bold">Bio</label>
                      <span className="tiny-text text-dim">Always public</span>
                    </div>
                    <textarea
                      className="form-control custom-input-sm w-100"
                      rows="4"
                      style={{ resize: "none" }}
                      placeholder="Tell us about yourself..."
                    ></textarea>
                  </div>

                  {/* Save Button */}
                  <div className="d-flex justify-content-end mt-4">
                    <button
                      className="btn btn-primary px-4 fw-bold"
                      style={{ fontSize: "0.9rem" }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Profile;
