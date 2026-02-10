import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Settings = () => {
  const bgColor = "#1d2125";
  const sidebarBg = "#161a1d";
  const tradianBlue = "#579dff";
  const activeBlueBg = "#38456d";
  const activeTextColor = "#CECFD2";

  const [activeOverlay, setActiveOverlay] = useState(null);
  const overlayRef = useRef(null);

  const [isEditingWorkspace, setIsEditingWorkspace] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("Animate Workspace");
  const [tempName, setTempName] = useState("Animate Workspace");

  const [creationVisible, setCreationVisible] = useState("Any Workspace member");
  const [creationPrivate, setCreationPrivate] = useState("Any Workspace member");
  const [deletionVisible, setDeletionVisible] = useState("Any Workspace member");
  const [deletionPrivate, setDeletionPrivate] = useState("Only Workspace admins");
  const [guestSelection, setGuestSelection] = useState("Anybody");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target)) {
        setActiveOverlay(null);
      }
    };

    if (activeOverlay) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeOverlay]);

  const handleSaveWorkspace = () => {
    setWorkspaceName(tempName);
    setIsEditingWorkspace(false);
  };

  return (
    <div
      className="container-fluid vh-100 text-light d-flex p-0 position-relative"
      style={{ backgroundColor: bgColor, fontFamily: "Segoe UI, sans-serif" }}
    >
      {/* Sidebar */}
      <nav
        className="sidebar p-4 border-end border-secondary"
        style={{ width: "280px", backgroundColor: sidebarBg }}
      >
        <h6 className="sidebar-heading text-secondary fw-bold text-uppercase mb-3" style={{ fontSize: "11px" }}>
          Personal Settings
        </h6>

        <div className="d-flex flex-column gap-1 mt-3 mb-5">
          <button className="btn btn-link text-light text-start opacity-75 d-flex align-items-center">
            <ProfileIcon /> <span className="ms-2">Profile and Visibility</span>
          </button>
          <button className="btn btn-link text-light text-start opacity-75 d-flex align-items-center">
            <ActivityIcon /> <span className="ms-2">Activity</span>
          </button>
          <button className="btn btn-link text-light text-start opacity-75 d-flex align-items-center">
            <CardIcon /> <span className="ms-2">Card</span>
          </button>
          <button className="btn btn-link text-light text-start opacity-75 d-flex align-items-center">
            <GearIcon size={16} /> <span className="ms-2">Settings</span>
          </button>
        </div>

        <h6 className="sidebar-heading text-secondary fw-bold text-uppercase mb-3" style={{ fontSize: "11px" }}>
          Workspaces
        </h6>

        <button className="d-flex align-items-center mb-2 w-100 btn btn-link text-light text-decoration-none p-1">
          <span
            className="me-2 rounded d-flex align-items-center justify-content-center fw-bold text-dark"
            style={{ width: "24px", height: "24px", background: "#f5cd47", fontSize: "12px" }}
          >
            {workspaceName.charAt(0)}
          </span>
          <span className="fw-bold">{workspaceName}</span>
        </button>

        <div className="d-flex flex-column gap-1 ps-4">
          <button className="btn btn-link text-light text-start opacity-75">Boards</button>
          <button className="btn btn-link text-light text-start opacity-75">Members</button>
          <button
            className="btn btn-link text-white text-start rounded"
            style={{ backgroundColor: tradianBlue }}
          >
            Settings
          </button>
        </div>
      </nav>

      {/* Main */}
      <div className="flex-grow-1 p-5 overflow-auto">
        <h2 className="h5 fw-bold mb-4">Workspace settings</h2>

        {!isEditingWorkspace ? (
          <div className="d-flex align-items-center gap-3 mb-5">
            <div
              className="rounded d-flex align-items-center justify-content-center fw-bold text-dark"
              style={{ width: "60px", height: "60px", background: "#f5cd47", fontSize: "28px" }}
            >
              {workspaceName.charAt(0)}
            </div>

            <div>
              <div className="d-flex align-items-center gap-2">
                <h3 className="h5 mb-0 fw-bold">{workspaceName}</h3>
                <span onClick={() => setIsEditingWorkspace(true)} style={{ cursor: "pointer" }}>
                  <PencilIcon />
                </span>
              </div>
              <div className="text-secondary" style={{ fontSize: "13px" }}>
                Premium <LockIcon size="12" /> Private
              </div>
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: "400px" }}>
            <input
              className="form-control mb-3 text-white"
              style={{ backgroundColor: "#222120" }}
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
            />
            <button className="btn btn-sm me-2" style={{ backgroundColor: tradianBlue }} onClick={handleSaveWorkspace}>
              Save
            </button>
            <button className="btn btn-sm btn-secondary" onClick={() => setIsEditingWorkspace(false)}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const CheckIcon = ({ color }) => (
  <svg width="14" height="14" fill={color} viewBox="0 0 16 16">
    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.42-6.447a.015.015 0 0 1 .015-.015Z" />
  </svg>
);
const ProfileIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4" />
  </svg>
);
const ActivityIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5" />
  </svg>
);
const CardIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1z" />
  </svg>
);
const GearIcon = ({ size = 18 }) => (
  <svg width={size} height={size} fill="currentColor" viewBox="0 0 16 16">
    <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
  </svg>
);
const LockIcon = ({ size = 14, color = "#ff5c5c" }) => (
  <svg width={size} height={size} fill={color} viewBox="0 0 16 16">
    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2" />
  </svg>
);
const PeopleIcon = ({ size = 14 }) => (
  <svg width={size} height={size} fill="#fcf809" viewBox="0 0 16 16">
    <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
  </svg>
);
const PencilIcon = () => (
  <svg width="16" height="16" fill="#8d8588f5" viewBox="0 0 16 16">
    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.707-6.707z" />
  </svg>
);
const BriefcaseIcon = () => (
  <svg
    width="14"
    height="14"
    fill="#9f8fef"
    viewBox="0 0 16 16"
    className="ms-2"
  >
    <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5" />
  </svg>
);
const CloseIcon = ({ size = 24 }) => (
  <svg width={size} height={size} fill="currentColor" viewBox="0 0 16 16">
    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
  </svg>
);

export default Settings;
