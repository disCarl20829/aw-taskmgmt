import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/dashboard.css";

const Members = () => {
  const [activeTab, setActiveTab] = useState("members");

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

      {/* Main Content Area */}
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

                <div className="mb-5">
                  <h6 className="fw-bold">Invite members to join you</h6>
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
                  className="form-control bg-dark-input border-secondary text-light w-50 mb-4"
                  placeholder="Filter by name"
                />

                <div className="member-row d-flex align-items-center justify-content-between py-2 border-top border-bottom border-secondary">
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
                    <button className="btn btn-secondary-custom btn-sm">
                      View boards (2)
                    </button>
                    <button className="btn btn-secondary-custom btn-sm dropdown-toggle">
                      Admin
                    </button>
                    <button className="btn btn-secondary-custom btn-sm">
                      Leave... ✕
                    </button>
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
