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
                  className="form-control bg-dark-input border-secondary w-50 mb-4"
                  placeholder="Filter by name"
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

                    <button
                      className="btn btn-secondary-custom btn-sm dropdown-toggle"
                      onClick={() => setShowAdminPopover(!showAdminPopover)}
                    >
                      Admin
                    </button>

                    <button
                      className="btn btn-secondary-custom btn-sm"
                      onClick={() => setShowLeavePopover(!showLeavePopover)}
                    >
                      Leave... ✕
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "guests" && (
              <div className="fade-in">
                <h5 className="fw-bold mb-3">Guests (0)</h5>
                <p className="text-secondary small">
                  There are no guests in this Workspace.
                </p>
              </div>
            )}

            {activeTab === "requests" && (
              <div className="fade-in">
                <h5 className="fw-bold mb-3">Join requests (0)</h5>
                <p className="text-secondary small">
                  There are no join requests.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Members;