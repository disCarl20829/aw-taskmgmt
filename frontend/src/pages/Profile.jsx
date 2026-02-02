import React from "react";
import "../css/dashboard.css";

const Profile = () => {
  return (
    <div className="container-fluid p-0 d-flex bg-dark-main text-light vh-100">
      {/* Sidebar Section */}
      <nav className="sidebar p-4 border-end border-secondary">
        <section className="mb-5">
          <h6 className="sidebar-heading">Personal Settings</h6>
          <div className="d-flex flex-column gap-1 mt-3">
            <button className="sidebar-btn-link active text-start d-flex align-items-center">
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
          <h6 className="sidebar-heading">Workspaces</h6>
          <button className="sidebar-workspace-btn d-flex align-items-center mt-3 mb-2 w-100 text-start">
            <span className="workspace-icon me-2">A</span>
            <span className="fw-bold">Animate Workplace</span>
          </button>
          <div className="d-flex flex-column gap-1 ps-4">
            <button className="sidebar-btn-link text-start">Boards</button>
            <button className="sidebar-btn-link text-start active">
              Members
            </button>
            <button className="sidebar-btn-link text-start">Settings</button>
          </div>
        </section>
      </nav>

      {/* Main Content Section */}
      <div className="flex-grow-1 p-5 position-relative content-area fade-in">
        {/* Close Button */}
        <button className="btn-close-custom">&times;</button>

        <h2 className="h4 fw-bold text-white mb-5">Profile and Visibility</h2>

        <div className="home-main-content">
          <h5 className="text-white mb-2">About</h5>
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
              <span className="tiny-text text-dim"> Always public</span>
            </div>
            <input
              type="text"
              className="form-control shadow-none custom-input-sm w-100"
              placeholder="Enter your username"
            />
          </div>

          {/* Bio Field */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="tiny-label fw-bold">Bio</label>
              <span className="tiny-text text-dim"> Always public</span>
            </div>
            <textarea
              className="form-control shadow-none custom-input-sm w-100"
              rows="4"
              style={{ resize: "none" }}
              placeholder="Tell us about yourself..."
            ></textarea>
          </div>

          {/* Save Button */}
          <div className="d-flex justify-content-end mt-4">
            <button className="btn btn-primary px-4 fw-bold">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
