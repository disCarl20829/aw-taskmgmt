import React, { useState } from "react";

const WorkspaceSettings = () => {
  const [showVisibilityMenu, setShowVisibilityMenu] = useState(false);
  const [currentVisibility, setCurrentVisibility] = useState("Private");

  return (
    <div className="container-fluid p-0 d-flex bg-dark-main text-light vh-100">
      {/* Sidebar Section */}
      <nav className="sidebar p-4 border-end border-secondary">
        <section className="mb-5">
          <h6 className="sidebar-heading">Personal Settings</h6>
          <div className="d-flex flex-column gap-1 mt-3">
            <button className="sidebar-btn-link text-start d-flex align-items-center">
              <i className="bi bi-person me-2"></i> Profile and Visibility
            </button>
            <button className="sidebar-btn-link text-start d-flex align-items-center">
              <i className="bi bi-list-task me-2"></i> Activity
            </button>
            <button className="sidebar-btn-link text-start d-flex align-items-center">
              <i className="bi bi-card-text me-2"></i> Card
            </button>
            <button className="sidebar-btn-link text-start d-flex align-items-center">
              <i className="bi bi-gear me-2"></i> Settings
            </button>
          </div>
        </section>

        <section>
          <h6 className="sidebar-heading mb-3">Workspaces</h6>
          <div className="d-flex align-items-center px-2 mb-3 cursor-pointer">
            <div className="workspace-icon me-2">A</div>
            <span className="fw-semibold small text-white">
              Animate Workplace
            </span>
          </div>
          <nav className="d-flex flex-column gap-1 ms-3">
            <button className="sidebar-btn-link text-start py-1 smaller">
              📋 Boards
            </button>
            <button className="sidebar-btn-link text-start py-1 smaller">
              👥 Members
            </button>
            <button className="sidebar-btn-link active-link text-start py-1 smaller">
              ⚙️ Settings
            </button>
          </nav>
        </section>
      </nav>

      {/* Main Content Area */}
      <div className="flex-grow-1 p-5 overflow-auto position-relative content-area fade-in">
        <button className="btn-close-custom">&times;</button>

        <h2 className="h4 fw-bold text-white mb-4">Workspace settings</h2>

        <div className="home-main-content">
          <div className="d-flex align-items-center mb-5">
            <div className="workspace-icon-lg me-3">A</div>
            <div>
              <div className="d-flex align-items-center">
                <h3 className="h5 fw-bold mb-0 me-2">Animate Workplace</h3>
                <i className="bi bi-pencil-fill tiny-text cursor-pointer text-dim"></i>
              </div>
              <div className="tiny-text text-dim">
                Premium <span className="mx-1">•</span>{" "}
                <i className="bi bi-lock-fill"></i> Private
              </div>
            </div>
          </div>

          <div className="settings-list">
            <div className="mb-4 position-relative">
              <h6 className="fw-bold mb-2 smaller text-white">
                Workspace visibility
              </h6>
              <div className="d-flex justify-content-between align-items-start border-top pt-3">
                <div className="smaller">
                  <span
                    className={
                      currentVisibility === "Private"
                        ? "text-danger-custom me-2"
                        : "text-success-custom me-2"
                    }
                  >
                    <i
                      className={
                        currentVisibility === "Private"
                          ? "bi bi-lock-fill"
                          : "bi bi-globe"
                      }
                    ></i>{" "}
                    {currentVisibility}
                  </span>
                  <span className="text-dim">
                    {currentVisibility === "Private"
                      ? "– This Workspace is private. It's not indexed or visible to those outside the Workspace."
                      : "– This Workspace is public. It's visible to anyone with the link."}
                  </span>
                </div>

                {/* Visibility Trigger Button */}
                <button
                  className="btn-secondary-custom"
                  onClick={() => setShowVisibilityMenu(!showVisibilityMenu)}
                >
                  Change
                </button>
              </div>

              {/* POPUP OVERLAY */}
              {showVisibilityMenu && (
                <div className="visibility-popover shadow-lg">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="tiny-label fw-bold text-dim w-100 text-center">
                      Select Workspace visibility
                    </span>
                    <i
                      className="bi bi-x cursor-pointer ms-auto"
                      onClick={() => setShowVisibilityMenu(false)}
                    ></i>
                  </div>

                  {/* Private Option */}
                  <div
                    className="popover-item d-flex align-items-start p-2 rounded mb-2 cursor-pointer"
                    onClick={() => {
                      setCurrentVisibility("Private");
                      setShowVisibilityMenu(false);
                    }}
                  >
                    <div className="me-2 mt-1 text-danger-custom">
                      <i className="bi bi-lock-fill"></i>
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-bold smaller text-white d-flex justify-content-between">
                        Private{" "}
                        {currentVisibility === "Private" && (
                          <i className="bi bi-check2"></i>
                        )}
                      </div>
                      <div className="tiny-text text-dim">
                        This Workspace is private. It's not indexed or visible
                        to those outside the Workspace.
                      </div>
                    </div>
                  </div>

                  {/* Public Option */}
                  <div
                    className="popover-item d-flex align-items-start p-2 rounded cursor-pointer"
                    onClick={() => {
                      setCurrentVisibility("Public");
                      setShowVisibilityMenu(false);
                    }}
                  >
                    <div className="me-2 mt-1 text-success-custom">
                      <i className="bi bi-globe"></i>
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-bold smaller text-white d-flex justify-content-between">
                        Public{" "}
                        {currentVisibility === "Public" && (
                          <i className="bi bi-check2"></i>
                        )}
                      </div>
                      <div className="tiny-text text-dim">
                        This Workspace is public. It's visible to anyone with
                        the link and will show up in search engines like Google.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Settings placeholders */}
            <div className="mb-4">
              <h6 className="fw-bold mb-2 smaller text-white">
                Board creation restrictions{" "}
                <i className="bi bi-briefcase smaller text-dim"></i>
              </h6>
              <div className="d-flex justify-content-between align-items-center border-top pt-3">
                <div className="smaller text-dim">
                  Any Workspace member can create boards.
                </div>
                <button className="btn-secondary-custom">Change</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSettings;
