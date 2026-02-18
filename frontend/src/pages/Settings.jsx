import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const Settings = () => {
  const bgColor = "#1d2125";
  const tradianBlue = "#579dff";

  const [activeOverlay, setActiveOverlay] = useState(null);
  const overlayRef = useRef(null);

  const [isEditingWorkspace, setIsEditingWorkspace] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("Animate Workspace");
  const [tempName, setTempName] = useState("Animate Workspace");

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
      className="text-light d-flex p-0"
      style={{
        backgroundColor: bgColor,
        fontFamily: "Segoe UI, sans-serif",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <style>{`
        .option-hover:hover { background: rgba(255,255,255,0.05); }
        input:focus, textarea:focus { border-color: ${tradianBlue} !important; box-shadow: 0 0 0 2px rgba(87,115,255,0.2) !important; }
        .sidebar { width: 260px; min-width: 260px; background-color: #1d2125; height: 100vh; flex-shrink: 0; }
        .sidebar-heading { color: #a8b4c1; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
        .sidebar-btn-link { background: none; border: none; color: #9fadbc; padding: 6px 12px; border-radius: 4px; font-size: 0.9rem; transition: 0.2s; width: 100%; text-align: left; }
        .sidebar-btn-link:hover { background-color: #333c44; color: #fff; }
        .sidebar-btn-link.active { background-color: #579dff29; color: #579dff; font-weight: 600; }
        .workspace-icon { width: 24px; height: 24px; background: linear-gradient(#e2b203, #ff9f1a); color: #1d2125; display: inline-flex; align-items: center; justify-content: center; border-radius: 3px; font-weight: bold; }
        .sidebar-workspace-btn { background: none; border: none; color: #9fadbc; padding: 4px 8px; }
      `}</style>

      {/* SIDEBAR — never moves */}
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
            <Link to="/cards" className="sidebar-btn-link text-decoration-none">
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
              className="sidebar-btn-link active text-decoration-none"
            >
              <i className="bi bi-gear me-2"></i> Settings
            </Link>
          </div>
        </section>
      </nav>

      {/* RIGHT COLUMN */}
      <div
        style={{
          flexGrow: 1,
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
            backgroundColor: bgColor,
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
        <div
          style={{
            flexGrow: 1,
            overflowY: "auto",
            padding: "0 24px 24px 24px",
          }}
        >
          <div style={{ maxWidth: "800px" }}>
            <h5 className="fw-bold mb-4" style={{ fontSize: "1.1rem" }}>
              Workspace settings
            </h5>

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

            <div className="w-100 position-relative">
              <SettingRow
                title="Board creation restrictions"
                icon={<BriefcaseIcon />}
                hasChange
                onChangeClick={(e) => {
                  e.stopPropagation();
                  setActiveOverlay("creation");
                }}
                content={
                  <div style={{ color: "#b6c2cf" }}>
                    <p className="mb-1">
                      {creationVisible} can create <PeopleIcon size={14} />{" "}
                      Workspace visible boards.
                    </p>
                    <p className="mb-0">
                      {creationPrivate} can create <LockIcon size={14} />{" "}
                      private boards.
                    </p>
                  </div>
                }
              />
              {activeOverlay === "creation" && (
                <div
                  ref={overlayRef}
                  className="position-absolute shadow-lg p-3"
                  style={{
                    backgroundColor: "#282e33",
                    width: "320px",
                    right: "-40px",
                    top: "-80px",
                    zIndex: 100,
                    borderRadius: "8px",
                    border: "1px solid #444c54",
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
                  <div style={{ color: "#b6c2cf" }}>
                    <p className="mb-1">
                      {deletionVisible} can delete <PeopleIcon size={14} />{" "}
                      Workspace visible boards.
                    </p>
                    <p className="mb-0">
                      {deletionPrivate} can delete <LockIcon size={14} />{" "}
                      private boards.
                    </p>
                  </div>
                }
              />
              {activeOverlay === "deletion" && (
                <div
                  ref={overlayRef}
                  className="position-absolute shadow-lg p-3"
                  style={{
                    backgroundColor: "#282e33",
                    width: "320px",
                    right: "-40px",
                    top: "-80px",
                    zIndex: 100,
                    borderRadius: "8px",
                    border: "1px solid #444c54",
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
                  className="position-absolute shadow-lg p-3"
                  style={{
                    backgroundColor: "#282e33",
                    width: "320px",
                    right: "-40px",
                    top: "75px",
                    zIndex: 100,
                    borderRadius: "8px",
                    border: "1px solid #444c54",
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
                      onClick={() =>
                        setGuestSelection("Only Workspace members")
                      }
                      blue={tradianBlue}
                      subtext="Workspace boards can only be shared with members of this Workspace."
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
            backgroundColor: "#2c333a",
            color: "#dee2e6",
            fontSize: "12px",
            border: "none",
            borderRadius: "3px",
          }}
        >
          Change
        </button>
      )}
    </div>
  </div>
);

const CheckIcon = ({ color }) => (
  <svg width="14" height="14" fill={color} viewBox="0 0 16 16">
    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.42-6.447a.015.015 0 0 1 .015-.015Z" />
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
