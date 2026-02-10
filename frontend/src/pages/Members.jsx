import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/dashboard.css";

const Members = () => {
  const [activeTab, setActiveTab] = useState("members");
  const [showBoardsPopover, setShowBoardsPopover] = useState(false);
  const [showAdminPopover, setShowAdminPopover] = useState(false);

  const [showLeavePopover, setShowLeavePopover] = useState(false);
  const [showBoardsPopover, setShowBoardsPopover] = useState(false);
  const [showAdminPopover, setShowAdminPopover] = useState(false);

  const [showLeavePopover, setShowLeavePopover] = useState(false);

  return (
    <div className="container-fluid vh-100 bg-dark-main text-light d-flex p-0">
      <nav className="sidebar p-3 border-end border-secondary">
        <section className="flex-column mb-4">
          <h6 className="sidebar-heading">Personal Settings</h6>
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
          <h6 className="sidebar-heading">Workspaces</h6>
          <button className="sidebar-workspace-btn d-flex align-items-center mt-3 mb-2 w-100 text-start">
            <span className="workspace-icon me-2">A</span>
            <span className="fw-bold">Animate Workplace</span>
          </button>
                  <div className="d-flex flex-column gap-1 ps-4">
          <button className="sidebar-btn-link text-start">
            <i className="bi bi-kanban me-2"></i> Boards
          </button>

          <button className="sidebar-btn-link text-start active">
            <i className="bi bi-people me-2"></i> Members
          </button>

          <button className="sidebar-btn-link text-start">
            <i className="bi bi-gear me-2"></i> Settings
          </button>
        </div>
        </section>
      </nav>

      <main className="flex-grow-1 p-5 position-relative">
        <button className="btn-close-custom">✕</button>

        <div className="d-flex justify-content-between align-items-start mb-4">
          <h2 className="fw-bold h4">Collaborators (1)</h2>
          <button className="btn btn-primary btn-sm px-3 rounded-1 fw-bold">
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
                  boards and create new boards in the Workspace. Adding new
                  members will automatically update your billing.
                </p>
                <hr className="border-secondary mb-4" />
                <hr className="border-secondary mb-4" />

                <div className="mb-5">
                  <h5 className="fw-bold">Invite members to join you</h5>
                  <h5 className="fw-bold">Invite members to join you</h5>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <p className="text-secondary small mb-0 w-75">
                      Anyone with an invite link can join this paid Workspace.
                      You'll be billed for each member that joins. You can also
                      disable and create a new invite link for this Workspace at
                      any time.
                    </p>
                    <button className="btn btn-secondary-custom btn-sm">
                      Invite with link
                    </button>
                  </div>
                </div>
                <hr className="border-secondary mb-4" />
                <input
                  type="text"
                  className="form-control bg-dark-input border-secondary w-50 mb-4"
                  className="form-control bg-dark-input border-secondary w-50 mb-4"
                  placeholder="Filter by name"
                />

                <div className="member-row d-flex align-items-center justify-content-between py-2 border-top border-bottom border-secondary position-relative">
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
                          right: "240px",
                          top: "-50px",
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
                          right: "120px",
                          top: "-100px",
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
                          top: "-120px",
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
                <p className="text-secondary small mb-4">
                  Guests can only view and edit the boards to which they've been
                  added.
                </p>
                <hr className="border-secondary mb-4" />
                <div className="text-center py-5">
                  <p className="text-secondary">
                    There are no guests in this Workspace.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "requests" && (
              <div className="fade-in">
                <h5 className="fw-bold mb-3">Join requests (0)</h5>
                <p className="text-secondary small mb-4">
                  These people have requested to join this Workspace. Adding new
                  Workspace members will automatically update your bill.
                </p>
                <hr className="border-secondary mb-4" />
                <div className="d-flex align-items-center gap-2 mb-4">
                  <input
                    type="text"
                    className="form-control bg-dark-input border-secondary text-light w-50"
                    placeholder="Filter by name"
                  />
                  <div className="ms-auto d-flex gap-2">
                    <button className="btn btn-secondary-custom btn-sm disabled text-dim">
                      Add selected to Workspace
                    </button>
                    <button className="btn btn-secondary-custom btn-sm disabled text-dim">
                      Delete selected requests
                    </button>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input bg-dark border-secondary"
                    disabled
                  />
                  <span className="text-secondary small">Select all (0)</span>
                </div>
                <div className="text-center py-5 border-top border-secondary">
                  <p className="text-secondary">There are no join request</p>
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