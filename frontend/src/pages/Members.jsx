import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Members = () => {
  const [activeTab, setActiveTab] = useState("members");
  const [showBoardsPopover, setShowBoardsPopover] = useState(false);
  const [showAdminPopover, setShowAdminPopover] = useState(false);
  const [showLeavePopover, setShowLeavePopover] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  return (
    <>
      <style>{`
        .mbr-root { background-color: #1d2125; height: 100vh; display: flex; color: #fff; overflow: hidden; }
        .sidebar { width: 260px; min-width: 260px; background-color: #1d2125; height: 100vh; flex-shrink: 0; }
        .sidebar-heading { color: #a8b4c1; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
        .sidebar-btn-link { background: none; border: none; color: #9fadbc; padding: 6px 12px; border-radius: 4px; font-size: 0.9rem; transition: 0.2s; width: 100%; }
        .sidebar-btn-link:hover { background-color: #333c44; color: #fff; }
        .sidebar-btn-link.active { background-color: #579dff29; color: #579dff; font-weight: 600; }
        .workspace-icon { width: 24px; height: 24px; background: linear-gradient(#e2b203, #ff9f1a); color: #1d2125; display: inline-flex; align-items: center; justify-content: center; border-radius: 3px; font-weight: bold; }
        .tab-item { background: none; border: none; color: #9fadbc; padding: 8px 12px; border-radius: 4px; font-size: 0.9rem; width: 100%; text-align: left; cursor: pointer; }
        .tab-item:hover { background-color: #333c44; color: #fff; }
        .tab-item.active { background-color: rgba(87,157,255,0.16); color: #579dff; font-weight: 600; }
        .avatar { width: 36px; height: 36px; background: linear-gradient(#e2b203, #ff9f1a); color: #1d2125; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: bold; font-size: 0.75rem; flex-shrink: 0; }
        .btn-secondary-custom { background-color: #282e33; border: 1px solid #3d444d; color: #9fadbc; font-size: 0.8rem; padding: 5px 10px; border-radius: 4px; cursor: pointer; }
        .btn-secondary-custom:hover { background-color: #333c44; color: #fff; }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }
        
        .modal-content {
          background-color: #282e33;
          border-radius: 12px;
          width: 90%;
          max-width: 600px;
          padding: 0;
          position: relative;
        }
        
        .modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid #3d444d;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .modal-body {
          padding: 24px;
        }
        
        .invite-input {
          width: 100%;
          background-color: #1d2125;
          border: 2px solid #579dff;
          color: #9fadbc;
          font-size: 0.9rem;
          padding: 12px 16px;
          border-radius: 4px;
          outline: none;
        }
        
        .invite-input::placeholder {
          color: #6b7280;
        }
        
        .close-btn {
          background: none;
          border: none;
          color: #9fadbc;
          font-size: 24px;
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .close-btn:hover {
          color: #fff;
        }
      `}</style>

      <div className="mbr-root">
        {/* ── SIDEBAR — never moves ── */}
        <nav className="sidebar p-3 border-end border-secondary border-opacity-25">
          <section className="mb-4">
            <h6 className="sidebar-heading px-2">Personal Settings</h6>
        <div className="d-flex flex-column gap-1 mt-3">
                     <Link to="/profile" className="sidebar-btn-link text-decoration-none">
                       <i className="bi bi-person me-2"></i> Profile and Visibility
                     </Link>
                     <Link to="/activity" className="sidebar-btn-link text-decoration-none">
                       <i className="bi bi-list-task me-2"></i> Activity
                     </Link>
                     <Link to="/cards" className="sidebar-btn-link text-decoration-none">
                       <i className="bi bi-card-text me-2"></i> Card
                     </Link>
                     <Link to="/settingpage" className="sidebar-btn-link text-decoration-none">
                       <i className="bi bi-gear me-2"></i> Settings
                     </Link>
                   </div>
          </section>

          <section>
            <h6 className="sidebar-heading px-2">Workspaces</h6>
            <div className="d-flex align-items-center mt-3 mb-2 w-100 text-start px-2">
              <span className="workspace-icon me-2">A</span>
              <span className="fw-bold" style={{ color: "#9fadbc" }}>Animate Workspace</span>
            </div>
            <div className="d-flex flex-column gap-1 ps-4">
             <Link to="/boardButton" className="sidebar-btn-link text-decoration-none">
                            <i className="bi bi-kanban me-2"></i> Boards
                          </Link>
              <button className="sidebar-btn-link text-start active"><i className="bi bi-people me-2"></i> Members</button>
            <Link to="/settings" className="sidebar-btn-link text-decoration-none">
                            <i className="bi bi-gear me-2"></i> Settings
                          </Link>
                        </div>
          </section>
        </nav>

        {/* ── RIGHT COLUMN ── */}
        <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>

          {/* X button row — stays pinned at top, never scrolls */}
          <div style={{
            flexShrink: 0,
            display: "flex",
            justifyContent: "flex-end",
            padding: "12px 16px",
            backgroundColor: "#1d2125",
          }}>
            <button
              className="btn d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: "32px",
                height: "32px",
                backgroundColor: "#282e33",
                border: "none",
                color: "#9fadbc",
                padding: 0,
              }}
            >
              <i className="bi bi-x-lg" style={{ fontSize: "14px" }}></i>
            </button>
          </div>

          {/* Scrollable content area */}
          <main style={{ flexGrow: 1, overflowY: "auto", padding: "0 24px 24px 24px" }}>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h5 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", margin: 0 }}>Collaborators (1)</h5>
              <button 
                onClick={() => setShowInviteModal(true)}
                style={{
                  backgroundColor: "#579dff", border: "none", color: "#fff",
                  fontSize: "0.85rem", fontWeight: 500, padding: "6px 14px", borderRadius: "4px", cursor: "pointer",
                }}
              >
                Invite Workspace members
              </button>
            </div>

            <div style={{ display: "flex", gap: "24px" }}>
              {/* Tab navigation */}
              <div style={{ width: "220px", minWidth: "220px", borderRight: "1px solid rgba(108,117,125,0.25)", paddingRight: "16px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <button className={`tab-item ${activeTab === "members" ? "active" : ""}`} onClick={() => setActiveTab("members")}>Workspace members (1)</button>
                  <button className={`tab-item ${activeTab === "guests" ? "active" : ""}`} onClick={() => setActiveTab("guests")}>Guests (0)</button>
                  <button className={`tab-item ${activeTab === "requests" ? "active" : ""}`} onClick={() => setActiveTab("requests")}>Join requests (0)</button>
                </div>
              </div>

              {/* Tab content */}
              <div style={{ flexGrow: 1 }}>
                {activeTab === "members" && (
                  <div>
                    <h5 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "8px" }}>Workspace members (1)</h5>
                    <p style={{ color: "#9fadbc", fontSize: "0.85rem", marginBottom: "20px" }}>
                      Workspace members can view and join all Workspace visible boards and create new boards in the Workspace.
                    </p>
                    <hr style={{ borderColor: "rgba(108,117,125,0.25)", marginBottom: "20px" }} />
                    <div style={{ marginBottom: "24px" }}>
                      <h5 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "8px" }}>Invite members to join you</h5>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <p style={{ color: "#9fadbc", fontSize: "0.85rem", margin: 0, maxWidth: "70%" }}>
                          Anyone with an invite link can join this paid Workspace.
                        </p>
                        <button className="btn-secondary-custom">Invite with link</button>
                      </div>
                    </div>
                    <hr style={{ borderColor: "rgba(108,117,125,0.25)", marginBottom: "20px" }} />
                    <input type="text" placeholder="Filter by name" style={{
                      backgroundColor: "#282e33", border: "1px solid #3d444d", color: "#9fadbc",
                      fontSize: "0.85rem", padding: "6px 12px", borderRadius: "4px",
                      maxWidth: "250px", marginBottom: "20px", display: "block",
                    }} />

                    {/* Member row */}
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "12px 0",
                      borderTop: "1px solid rgba(108,117,125,0.25)",
                      borderBottom: "1px solid rgba(108,117,125,0.25)",
                      position: "relative",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div className="avatar">AW</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>bwajdsdjxuvjsdiv</div>
                          <div style={{ color: "#9fadbc", fontSize: "0.8rem" }}>@User123 • Last active January 2026</div>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "8px", position: "relative" }}>
                        <button className="btn-secondary-custom" onClick={() => setShowBoardsPopover(!showBoardsPopover)}>View boards (2)</button>
                        {showBoardsPopover && (
                          <div style={{ position: "absolute", backgroundColor: "#282e33", border: "1px solid #3d444d", borderRadius: "8px", width: "300px", zIndex: 1000, right: "200px", top: "-160px", padding: "16px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                              <span style={{ fontWeight: 700, fontSize: "0.8rem", color: "#9fadbc" }}>Workspace boards</span>
                              <span style={{ cursor: "pointer", color: "#9fadbc" }} onClick={() => setShowBoardsPopover(false)}>✕</span>
                            </div>
                            <p style={{ fontSize: "0.85rem", color: "#9fadbc", marginBottom: "12px" }}>rawr is a member of the following Workspace boards:</p>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <div style={{ width: "40px", height: "32px", background: "linear-gradient(135deg, #a855f7 0%, #d946ef 100%)", borderRadius: "4px" }}></div>
                              <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>My board</span>
                            </div>
                          </div>
                        )}

                        <button className="btn-secondary-custom" onClick={() => setShowAdminPopover(!showAdminPopover)}>Admin ▾</button>
                        {showAdminPopover && (
                          <div style={{ position: "absolute", backgroundColor: "#282e33", border: "1px solid #3d444d", borderRadius: "8px", width: "300px", zIndex: 1001, right: "100px", top: "-120px", overflow: "hidden" }}>
                            <div style={{ padding: "12px 16px", borderBottom: "1px solid #3d444d", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#9fadbc", flex: 1, textAlign: "center" }}>Change permissions</span>
                              <span style={{ cursor: "pointer", color: "#9fadbc" }} onClick={() => setShowAdminPopover(false)}>✕</span>
                            </div>
                            <div style={{ padding: "12px 16px", backgroundColor: "rgba(255,255,255,0.04)" }}>
                              <p style={{ fontSize: "0.85rem", color: "#9fadbc", margin: 0 }}>You can't change roles because there must be at least one admin.</p>
                            </div>
                          </div>
                        )}

                        <button className="btn-secondary-custom" onClick={() => setShowLeavePopover(!showLeavePopover)}>Leave... ✕</button>
                        {showLeavePopover && (
                          <div style={{ position: "absolute", backgroundColor: "#282e33", border: "1px solid #3d444d", borderRadius: "8px", width: "300px", zIndex: 1002, right: "0px", top: "40px", padding: "16px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                              <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#9fadbc", flex: 1, textAlign: "center" }}>Leave Workspace</span>
                              <span style={{ cursor: "pointer", color: "#9fadbc" }} onClick={() => setShowLeavePopover(false)}>✕</span>
                            </div>
                            <p style={{ fontSize: "0.85rem", color: "#fff", fontWeight: 600, marginBottom: "16px" }}>
                              You will become a guest of this Workspace and will only be able to access boards you are currently a member of.
                            </p>
                            <button style={{ backgroundColor: "#e5534b", border: "none", color: "#fff", fontWeight: 700, width: "100%", padding: "8px", borderRadius: "4px", cursor: "pointer", fontSize: "0.9rem" }}>
                              Leave Workspace
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "guests" && (
                  <div>
                    <h5 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "8px" }}>Guests (0)</h5>
                    <p style={{ color: "#9fadbc", fontSize: "0.85rem", marginBottom: "20px" }}>Guests can only view and edit the boards to which they've been added.</p>
                    <hr style={{ borderColor: "rgba(108,117,125,0.25)", marginBottom: "20px" }} />
                    <p style={{ color: "#9fadbc", fontSize: "0.85rem", textAlign: "center", marginTop: "48px", fontStyle: "italic" }}>There are no guests in this Workspace.</p>
                  </div>
                )}

                {activeTab === "requests" && (
                  <div>
                    <h5 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "8px" }}>Join requests (0)</h5>
                    <p style={{ color: "#9fadbc", fontSize: "0.85rem", marginBottom: "20px" }}>
                      These people have requested to join this Workspace. Adding new Workspace members will automatically update your bill.
                    </p>
                    <hr style={{ borderColor: "rgba(108,117,125,0.25)", marginBottom: "20px" }} />
                    <p style={{ color: "#9fadbc", fontSize: "0.85rem", textAlign: "center", marginBottom: "20px" }}>There are no join requests</p>
                    <input type="text" placeholder="Filter by name" style={{
                      backgroundColor: "#282e33", border: "1px solid #3d444d", color: "#9fadbc",
                      fontSize: "0.85rem", padding: "6px 12px", borderRadius: "4px",
                      maxWidth: "250px", marginBottom: "16px", display: "block",
                    }} />
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "6px", color: "#9fadbc", fontSize: "0.85rem", cursor: "pointer" }}>
                        <input type="checkbox" style={{ accentColor: "#579dff" }} />
                        Select all (0)
                      </label>
                      <button className="btn-secondary-custom">Add selected to Workspace</button>
                      <button className="btn-secondary-custom">Delete selected requests</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="modal-overlay" onClick={() => setShowInviteModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h5 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", margin: 0 }}>
                  Invite to Workspace
                </h5>
                <button className="close-btn" onClick={() => setShowInviteModal(false)}>
                  ✕
                </button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="invite-input"
                  placeholder="Email address or name"
                  autoFocus
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Members;