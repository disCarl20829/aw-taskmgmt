import React, { useState, useEffect, useRef } from "react";

import "bootstrap/dist/css/bootstrap.min.css";

const Settings = () => {
  const bgColor = "#323130";
  const sidebarBg = "#222120";
  const tradianBlue = "#5773ff";

  const [activeOverlay, setActiveOverlay] = useState(null);
  const overlayRef = useRef(null);

  // Workspace Edit State
  const [isEditingWorkspace, setIsEditingWorkspace] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("Animate Workspace");
  const [tempName, setTempName] = useState("Animate Workspace");

  // Selection States
  const [creationVisible, setCreationVisible] = useState(
    "Any Workspace member",
  );
  const [creationPrivate, setCreationPrivate] = useState(
    "Any Workspace member",
  );
  const [deletionVisible, setDeletionVisible] = useState(
    "Any Workspace member",
  );
  const [deletionPrivate, setDeletionPrivate] = useState(
    "Only Workspace admins",
  );
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
        <h6
          className="sidebar-heading text-secondary fw-bold text-uppercase mb-3"
          style={{ fontSize: "11px" }}
        > 
          Personal Settings
        </h6>
        <div className="d-flex flex-column gap-1 mt-3 mb-5">
          <button className="sidebar-btn-link text-start btn btn-link text-light text-decoration-none p-2 opacity-75 d-flex align-items-center">
            <ProfileIcon /> <span className="ms-2">Profile and Visibilty</span>
          </button>
          <button className="sidebar-btn-link text-start btn btn-link text-light text-decoration-none p-2 opacity-75 d-flex align-items-center">
            <ActivityIcon /> <span className="ms-2">Activity</span>
          </button>
          <button className="sidebar-btn-link text-start btn btn-link text-light text-decoration-none p-2 opacity-75 d-flex align-items-center">
            <CardIcon /> <span className="ms-2">Card</span>
          </button>

          <button className="sidebar-btn-link text-start btn btn-link text-light text-decoration-none p-2 opacity-75 d-flex align-items-center">
            <GearIcon size={16} /> <span className="ms-2">Settings</span>
          </button>
        </div>
        <h6
          className="sidebar-heading text-secondary fw-bold text-uppercase mb-3"
          style={{ fontSize: "11px" }}
        >
          Workspaces
        </h6>
        <button className="sidebar-workspace-btn d-flex align-items-center mb-2 w-100 btn btn-link text-light text-decoration-none p-1">
          <span
            className="workspace-icon me-2 rounded d-flex align-items-center justify-content-center fw-bold text-dark"
            style={{
              width: "24px",
              height: "24px",
              background: "#f5cd47",
              fontSize: "12px",
            }}
          >
            {workspaceName.charAt(0)}
          </span>
          <span className="fw-bold" style={{ fontSize: "14px" }}>
            {workspaceName}
          </span>
        </button>
        <div className="d-flex flex-column gap-1 ps-4">
          <button className="sidebar-btn-link text-start btn btn-link text-light text-decoration-none p-2 opacity-75">
            Boards
          </button>
          <button className="sidebar-btn-link text-start btn btn-link text-light text-decoration-none p-2 opacity-75">
            Members
          </button>
          <button
            className="sidebar-btn-link text-start btn btn-link text-white text-decoration-none p-2 rounded"
            style={{ backgroundColor: tradianBlue }}
          >
            Settings
          </button>
        </div>
      </nav>

      <div className="flex-grow-1 p-5 position-relative overflow-auto">
        <h2 className="h5 fw-bold mb-4">Workspace settings</h2>

        {/* Workspace Info / Edit Form */}
        {!isEditingWorkspace ? (
          <div className="d-flex align-items-center gap-3 mb-5">
            <div
              className="rounded d-flex align-items-center justify-content-center fw-bold text-dark"
              style={{
                width: "60px",
                height: "60px",
                background: "#f5cd47",
                fontSize: "28px",
              }}
            >
              {workspaceName.charAt(0)}
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <h3 className="h5 mb-0 fw-bold">{workspaceName}</h3>
                <span
                  onClick={() => setIsEditingWorkspace(true)}
                  style={{ cursor: "pointer" }}
                >
                  <PencilIcon />
                </span>
              </div>
              <div className="text-secondary" style={{ fontSize: "13px" }}>
                Premium <LockIcon size="12" color="#888" /> Private
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-5" style={{ maxWidth: "400px" }}>
            <div className="mb-3">
              <label
                className="form-label fw-bold text-secondary"
                style={{ fontSize: "12px" }}
              >
                Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control form-control-sm text-white border-secondary"
                style={{ backgroundColor: "#222120", outline: "none" }}
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label
                className="form-label fw-bold text-secondary"
                style={{ fontSize: "12px" }}
              >
                Email <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                className="form-control form-control-sm text-white border-secondary"
                style={{ backgroundColor: "#222120" }}
                placeholder="example@work.com"
              />
            </div>
            <div className="mb-3">
              <label
                className="form-label fw-bold text-secondary"
                style={{ fontSize: "12px" }}
              >
                Description (optional)
              </label>
              <textarea
                className="form-control form-control-sm text-white border-secondary"
                style={{ backgroundColor: "#222120" }}
                rows="2"
              ></textarea>
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm px-3"
                style={{ backgroundColor: tradianBlue, color: "white" }}
                onClick={handleSaveWorkspace}
              >
                Save
              </button>
              <button
                className="btn btn-sm px-3 btn-secondary"
                onClick={() => setIsEditingWorkspace(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Rows - Same as before */}
        <div className="w-100 position-relative">
          <SettingRow
            title="Workspace visibility"
            content={
              <div>
                <LockIcon size="14" color="#ff5c5c" />{" "}
                <span style={{ color: "#ff5c5c" }}>Private</span> – This
                Workspace is private.
              </div>
            }
          />

          <SettingRow
            title="Board creation restrictions"
            icon={<BriefcaseIcon />}
            hasChange
            onChangeClick={(e) => {
              e.stopPropagation();
              setActiveOverlay("creation");
            }}
            content={
              <div className="text-secondary">
                <p className="mb-1">
                  {creationVisible} can create <PeopleIcon size={14} />{" "}
                  Workspace visible boards.
                </p>
                <p className="mb-0">
                  {creationPrivate} can create <LockIcon size={14} /> private
                  boards.
                </p>
              </div>
            }
          />

          {activeOverlay === "creation" && (
            <div
              ref={overlayRef}
              className="position-absolute shadow-lg border border-secondary p-3"
              style={{
                backgroundColor: "#444342",
                width: "320px",
                right: "0",
                top: "120px",
                zIndex: 100,
                borderRadius: "8px",
              }}
            >
              <OverlayHeader
                title="Board creation restrictions"
                onClose={() => setActiveOverlay(null)}
              />
              <div style={{ fontSize: "13px" }}>
                <p className="fw-bold mb-2">
                  Who can create <PeopleIcon size={12} /> Workspace visible
                  boards?
                </p>
                {[
                  "Any Workspace member",
                  "Only Workspace admins",
                  "Nobody",
                ].map((opt) => (
                  <OptionItem
                    key={opt}
                    text={opt}
                    isSelected={creationVisible === opt}
                    onClick={() => setCreationVisible(opt)}
                    blue={tradianBlue}
                  />
                ))}
                <hr className="bg-secondary my-2" />
                <p className="fw-bold mb-2">
                  Who can create <LockIcon size={12} /> private boards?
                </p>
                {[
                  "Any Workspace member",
                  "Only Workspace admins",
                  "Nobody",
                ].map((opt) => (
                  <OptionItem
                    key={opt}
                    text={opt}
                    isSelected={creationPrivate === opt}
                    onClick={() => setCreationPrivate(opt)}
                    blue={tradianBlue}
                  />
                ))}
              </div>
            </div>
          )}

          <SettingRow
            title="Board deletion restrictions"
            icon={<BriefcaseIcon />}
            hasChange
            onChangeClick={(e) => {
              e.stopPropagation();
              setActiveOverlay("deletion");
            }}
            content={
              <div className="text-secondary">
                <p className="mb-1">
                  {deletionVisible} can delete <PeopleIcon size={14} />{" "}
                  Workspace visible boards.
                </p>
                <p className="mb-0">
                  {deletionPrivate} can delete <LockIcon size={14} /> private
                  boards.
                </p>
              </div>
            }
          />

          {activeOverlay === "deletion" && (
            <div
              ref={overlayRef}
              className="position-absolute shadow-lg border border-secondary p-3"
              style={{
                backgroundColor: "#444342",
                width: "320px",
                right: "0",
                top: "250px",
                zIndex: 100,
                borderRadius: "8px",
              }}
            >
              <OverlayHeader
                title="Board deletion restrictions"
                onClose={() => setActiveOverlay(null)}
              />
              <div style={{ fontSize: "13px" }}>
                <p className="fw-bold mb-2">
                  Who can delete <PeopleIcon size={12} /> Workspace visible
                  boards?
                </p>
                {[
                  "Any Workspace member",
                  "Only Workspace admins",
                  "Nobody",
                ].map((opt) => (
                  <OptionItem
                    key={opt}
                    text={opt}
                    isSelected={deletionVisible === opt}
                    onClick={() => setDeletionVisible(opt)}
                    blue={tradianBlue}
                  />
                ))}
                <hr className="bg-secondary my-2" />
                <p className="fw-bold mb-2">
                  Who can delete <LockIcon size={12} /> private boards?
                </p>
                {[
                  "Any Workspace member",
                  "Only Workspace admins",
                  "Nobody",
                ].map((opt) => (
                  <OptionItem
                    key={opt}
                    text={opt}
                    isSelected={deletionPrivate === opt}
                    onClick={() => setDeletionPrivate(opt)}
                    blue={tradianBlue}
                  />
                ))}
              </div>
            </div>
          )}

          <SettingRow
            title="Sharing boards with guests"
            icon={<BriefcaseIcon />}
            hasChange
            onChangeClick={(e) => {
              e.stopPropagation();
              setActiveOverlay("guests");
            }}
            content={
              guestSelection === "Anybody"
                ? "Anybody can send or receive invitations to boards in this Workspace."
                : "Workspace boards can only be shared with members of this Workspace."
            }
          />

          {activeOverlay === "guests" && (
            <div
              ref={overlayRef}
              className="position-absolute shadow-lg border border-secondary p-3"
              style={{
                backgroundColor: "#444342",
                width: "350px",
                right: "0",
                top: "250px",
                zIndex: 100,
                borderRadius: "8px",
              }}
            >
              <OverlayHeader
                title="Inviting guests"
                onClose={() => setActiveOverlay(null)}
              />
              <div style={{ fontSize: "13px" }}>
                <p className="fw-bold mb-3">
                  Who can Workspace boards be shared with?
                </p>
                <OptionItem
                  text="Anybody"
                  isSelected={guestSelection === "Anybody"}
                  onClick={() => setGuestSelection("Anybody")}
                  blue={tradianBlue}
                  subtext="Workspace boards can be shared with anybody."
                />
                <OptionItem
                  text="Only Workspace members"
                  isSelected={guestSelection === "Only Workspace members"}
                  onClick={() => setGuestSelection("Only Workspace members")}
                  blue={tradianBlue}
                  subtext="Workspace boards can only be shared with members of this Workspace."
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .option-hover:hover { background: rgba(255,255,255,0.05); }
        input:focus, textarea:focus { border-color: ${tradianBlue} !important; box-shadow: 0 0 0 2px rgba(87, 115, 255, 0.2) !important; }
      `}</style>
    </div>
  );
};

// Helper Components
const OptionItem = ({ text, isSelected, onClick, blue, subtext }) => (
  <div
    className="mb-2 p-2 rounded option-hover"
    onClick={onClick}
    style={{ cursor: "pointer", color: isSelected ? blue : "white" }}
  >
    <div className="d-flex justify-content-between align-items-center">
      <span className="fw-bold">{text}</span>
      {isSelected && <CheckIcon color={blue} />}
    </div>
    {subtext && (
      <p
        className="mb-0"
        style={{
          fontSize: "11px",
          opacity: 0.7,
          color: isSelected ? blue : "#b6c2cf",
        }}
      >
        {subtext}
      </p>
    )}
  </div>
);

const OverlayHeader = ({ title, onClose }) => (
  <div className="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary pb-2">
    <span
      className="fw-bold mx-auto"
      style={{ fontSize: "14px", color: "#b6c2cf" }}
    >
      {title}
    </span>
    <div onClick={onClose} style={{ cursor: "pointer", opacity: 0.7 }}>
      <CloseIcon size={16} />
    </div>
  </div>
);

const SettingRow = ({ title, icon, content, hasChange, onChangeClick }) => (
  <div className="mb-4 w-100">
    <div className="border-bottom border-secondary pb-2 mb-2">
      <div
        className="fw-bold d-flex align-items-center"
        style={{ fontSize: "14px" }}
      >
        {title} {icon}
      </div>
    </div>
    <div className="d-flex justify-content-between align-items-start">
      <div style={{ fontSize: "14px", color: "#b6c2cf", flex: "1" }}>
        {content}
      </div>
      {hasChange && (
        <button
          onClick={onChangeClick}
          className="btn btn-sm px-3 ms-3"
          style={{
            backgroundColor: "#41403e",
            color: "#fff",
            fontSize: "12px",
            border: "1px solid #555",
          }}
        >
          Change
        </button>
      )}
    </div>
  </div>
);

// Icons
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
const LockIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} fill={color} viewBox="0 0 16 16">
    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2" />
  </svg>
);
const PeopleIcon = ({ size = 14 }) => (
  <svg width={size} height={size} fill="currentColor" viewBox="0 0 16 16">
    <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
  </svg>
);
const PencilIcon = () => (
  <svg width="14" height="14" fill="#888" viewBox="0 0 16 16">
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
