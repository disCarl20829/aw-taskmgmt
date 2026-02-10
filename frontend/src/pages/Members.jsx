import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/dashboard.css";

const Members = () => {
  const [activeTab, setActiveTab] = useState("members");
  const [showBoardsPopover, setShowBoardsPopover] = useState(false);
  const [showAdminPopover, setShowAdminPopover] = useState(false);

  const [showLeavePopover, setShowLeavePopover] = useState(false);

  return (
    <div className="container-fluid vh-100 bg-dark-main text-light d-flex p-0">
      <nav className="sidebar p-3 border-end border-secondary border-opacity-25">
        <section className="mb-4">
          <h6 className="sidebar-heading px-2">Personal Settings</h6>
          <div className="d-flex flex-column gap-1 mt-3">
            <button className="sidebar-btn-link text-start">
              <i className="bi bi-person me-2"></i> Profile and Visibilty
            </button>
            <button className="sidebar-btn-link text-start">
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
              <i className="bi bi-kanban me-2"></i> Boards</button>
            <button className="sidebar-btn-link text-start active">
              <i className="bi bi-people me-2"></i> Members</button>
            <button className="sidebar-btn-link text-start">
              <i className="bi bi-gear me-2"></i> Settings</button>
          </div>
        </section>
      </nav>

      <main className="flex-grow-1 p-5 position-relative">
        <button
          className="btn position-absolute top-0 end-0 m-3 p-1"
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "#fff",
            fontSize: "16px",
            cursor: "pointer",
            lineHeight: "1"
          }}
        >
          ✕
        </button>

        <div className="d-flex justify-content-between align-items-start mb-4">
          <h2 className="fw-bold h4">Collaborators (1)</h2>
          <button
            className="btn btn-primary px-3 py-1"
            style={{
              backgroundColor: "#7c8ce8",
              border: "none",
              fontSize: "13px",
              fontWeight: "500"
            }}
          >
            Invite Workspace members
          </button>
        </div>

        <div className="row">
          <div className="col-md-3 border-end border-secondary pe-4">
            <div className="d-flex flex-column gap-2">
              <button
                className={`tab-item text-start border-0 ${activeTab === "members" ? "active" : ""}`}
                onClick={() => setActiveTab("members")}
              >
                Workspace members (1)
              </button>
              <button
                className={`tab-item text-start border-0 ${activeTab === "guests" ? "active" : ""}`}
                onClick={() => setActiveTab("guests")}
              >
                Guests (0)
              </button>
              <button
                className={`tab-item text-start border-0 border-top border-secondary pt-2 rounded-0 ${activeTab === "requests" ? "active" : ""}`}
                onClick={() => setActiveTab("requests")}
              >
                Join requests (0)
              </button>
            </div>
          </div>

          <div className="col-md-9 ps-4">
            {activeTab === "members" && (
              <div className="fade-in">
                <h5 className="fw-bold mb-3">Workspace members (1)</h5>
                <p className="text-secondary small mb-4">
                  Workspace members can view and join all Workspace visible
                  boards and create new boards in the Workspace.
                </p>
                <hr className="border-secondary mb-4" />

                <div className="mb-5">
                  <h5 className="fw-bold">Invite members to join you</h5>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <p className="text-secondary small mb-0 w-75">
                      Anyone with an invite link can join this paid Workspace.
                    </p>
                    <button className="btn btn-secondary-custom btn-sm">
                      Invite with link
                    </button>
                  </div>
                </div>

                <hr className="border-secondary mb-4" />

                <input
                  type="text"
                  className="form-control mb-4"
                  placeholder="Filter by name"
                  style={{
                    backgroundColor: "#2d2d2d",
                    border: "1px solid #444",
                    color: "#fff",
                    fontSize: "14px",
                    padding: "8px 12px",
                    maxWidth: "250px"
                  }}
                />

                <div className="member-row d-flex align-items-center justify-content-between py-2 border-top border-bottom border-secondary position-relative">
                  <div className="d-flex align-items-center">
                    <div className="avatar me-3">AW</div>
                    <div>
                      <div className="fw-bold">bwajdsdjxuvjsdiv</div>
                      <div className="text-secondary smaller">
                        @User123 • Last active January 2026
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn btn-secondary-custom btn-sm"
                      onClick={() => setShowBoardsPopover(!showBoardsPopover)}
                    >
                      View boards (2)
                    </button>

                    {showBoardsPopover && (
                      <div
                        className="position-absolute bg-dark p-3 rounded shadow-lg border border-secondary"
                        style={{
                          width: "300px",
                          zIndex: 1000,
                          right: "170px",
                          top: "-160px",
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="fw-bold small text-secondary">
                            Workspace boards
                          </span>
                          <span
                            role="button"
                            onClick={() => setShowBoardsPopover(false)}
                            className="text-secondary"
                          >
                            ✕
                          </span>
                        </div>
                        <p className="small mb-3">
                          rawr is a member of the following Workspace boards:
                        </p>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            style={{
                              width: "40px",
                              height: "32px",
                              background:
                                "linear-gradient(135deg, #a855f7 0%, #d946ef 100%)",
                              borderRadius: "4px",
                            }}
                          ></div>
                          <span className="fw-bold">My board</span>
                        </div>
                      </div>
                    )}

                    <button
                      className="btn btn-secondary-custom btn-sm dropdown-toggle"
                      onClick={() => setShowAdminPopover(!showAdminPopover)}
                    >
                      Admin
                    </button>

                    {showAdminPopover && (
                      <div
                        className="position-absolute bg-dark rounded shadow-lg border border-secondary"
                        style={{
                          width: "320px",
                          zIndex: 1001,
                          right: "87px",
                          top: "-128px",
                          overflow: "hidden",
                        }}
                      >
                        <div className="p-3 d-flex justify-content-between align-items-center border-bottom border-secondary">
                          <span className="fw-bold text-secondary text-center w-100">
                            Change permissions
                          </span>
                          <span
                            role="button"
                            onClick={() => setShowAdminPopover(false)}
                            className="text-secondary"
                          >
                            ✕
                          </span>
                        </div>
                        <div
                          className="p-3"
                          style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                        >
                          <p className="small mb-0 text-secondary">
                            You can't change roles because there must be at
                            least one admin.
                          </p>
                        </div>
                      </div>
                    )}

                    <button
                      className="btn btn-secondary-custom btn-sm"
                      onClick={() => setShowLeavePopover(!showLeavePopover)}
                    >
                      Leave... ✕
                    </button>

                    {showLeavePopover && (
                      <div
                        className="position-absolute bg-dark rounded shadow-lg border border-secondary p-3"
                        style={{
                          width: "320px",
                          zIndex: 1002,
                          right: "0px",
                          top: "-0px",
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="fw-bold text-secondary text-center w-100">
                            Leave Workspace
                          </span>
                          <span
                            role="button"
                            onClick={() => setShowLeavePopover(false)}
                            className="text-secondary"
                          >
                            ✕
                          </span>
                        </div>
                        <p className="small mb-4 text-light fw-bold">
                          You will become a guest of this Workspace and will
                          only be able to access boards you are currently a
                          member of.
                        </p>
                        <button
                          className="btn btn-danger w-100 fw-bold"
                          style={{ backgroundColor: "#ec6d6d", border: "none" }}
                        >
                          Leave Workspace
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "guests" && (
              <div className="fade-in">
                <h5 className="fw-bold mb-3">Guests (0)</h5>
                <p className="mb-4" style={{ color: "#b0b0b0", fontSize: "14px", lineHeight: "1.6" }}>
                  Guests can only view and edit the boards to which they've been added.
                </p>
                <hr style={{ borderColor: "#333", opacity: 1, margin: "20px 0" }} />
                <p
                  className="text-center mt-5 pt-5"
                  style={{
                    color: "#666",
                    fontSize: "14px",
                    fontStyle: "italic"
                  }}
                >
                  There are no guests in this Workspace.
                </p>
              </div>
            )}

            {activeTab === "requests" && (
              <div className="fade-in">
                <h5 className="fw-bold mb-3">Join requests (0)</h5>
                <p className="mb-4" style={{ color: "#b0b0b0", fontSize: "14px", lineHeight: "1.6" }}>
                  These people have requested to join this Workspace. Adding new Workspace members will automatically update your bill.
                </p>

                {/* Horizontal divider line */}
                <hr style={{ borderColor: "#333", opacity: 1, margin: "20px 0" }} />

                <p
                  className="text-center mt-4 mb-4"
                  style={{
                    color: "#666",
                    fontSize: "14px"
                  }}
                >
                  There are no join request
                </p>

                {/* Filter input */}
                <input
                  type="text"
                  className="form-control mb-4"
                  placeholder="Filter by name"
                  style={{
                    backgroundColor: "#2d2d2d",
                    border: "1px solid #444",
                    color: "#fff",
                    fontSize: "14px",
                    padding: "8px 12px",
                    maxWidth: "250px"
                  }}
                />

                {/* Action buttons row */}
                <div className="d-flex align-items-center gap-3 mt-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="selectAll"
                      style={{
                        backgroundColor: "#2d2d2d",
                        borderColor: "#666"
                      }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="selectAll"
                      style={{ color: "#b0b0b0", fontSize: "14px" }}
                    >
                      Select all (0)
                    </label>
                  </div>

                  <button
                    className="btn btn-sm px-3"
                    style={{
                      backgroundColor: "#2d2d2d",
                      color: "#b0b0b0",
                      border: "none",
                      fontSize: "13px"
                    }}
                  >
                    Add selected to Workspace
                  </button>

                  <button
                    className="btn btn-sm px-3"
                    style={{
                      backgroundColor: "#2d2d2d",
                      color: "#b0b0b0",
                      border: "none",
                      fontSize: "13px"
                    }}
                  >
                    Delete selected requests
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Members;