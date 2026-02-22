import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate

import { Row } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import api from "../config/api";
import BoardTemplate from "../components/BoardTemplate";

const Members = () => {
  const navigate = useNavigate(); // Initialize navigate hook
  const [activeTab, setActiveTab] = useState("members");
  const [showAdminPopover, setShowAdminPopover] = useState(null);
  const popoverRef = useRef(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [openBoardsPopoverId, setOpenBoardsPopoverId] = useState(null);
  const [userBoards, setUserBoards] = useState({});
  const [loadingBoards, setLoadingBoards] = useState(false);
  const [boardSearch, setBoardSearch] = useState("");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        !event.target.closest(".btn-secondary-custom")
      ) {
        setOpenBoardsPopoverId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const getMembers = async () => {
      try {
        const res = await api.get("/user/searchAll");
        setUsers(res.data.users);
      } catch (err) {
        console.error("Fetching members failed: ", err);
      }
    };
    getMembers();
  }, []);

  const handleViewBoards = (user_id) => {
    setShowAdminPopover(null);

    if (openBoardsPopoverId === user_id) {
      setOpenBoardsPopoverId(null);
      setBoardSearch("");
      return;
    }

    setOpenBoardsPopoverId(user_id);
    setBoardSearch("");

    if (!userBoards[user_id]) {
      setLoadingBoards(true);
      api
        .get(`/tasks/getUserBoards/${user_id}`)
        .then((res) => {
          setUserBoards((prev) => ({ ...prev, [user_id]: res.data.boards }));
        })
        .catch((err) => console.error("Fetching user's boards failed:", err))
        .finally(() => setLoadingBoards(false));
    }
  };

  const handleChangeAccess = async (user_id) => {
    try {
      await api.patch("/user/access/", { user_id });

      setUsers((prev) =>
        prev.map((u) =>
          u.user_id === user_id
            ? { ...u, user_access: u.user_access === 1 ? 0 : 1 }
            : u,
        ),
      );

      setShowAdminPopover(null);
    } catch (err) {
      console.error("Failed to change user access:", err);
      alert("Failed to update user access");
    }
  };

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

        /* ── Shared button style for both "View boards" and role button ── */
        .btn-secondary-custom {
          background-color: #282e33;
          border: 1px solid #3d444d;
          color: #9fadbc;
          font-size: 0.8rem;
          text-align: center;
          width: 100px;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }
        .btn-secondary-custom:hover { background-color: #333c44; color: #fff; }

        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 2000; }
        .modal-content { background-color: #282e33; border-radius: 12px; width: 90%; max-width: 600px; padding: 0; position: relative; }
        .modal-header { padding: 20px 24px; border-bottom: 1px solid #3d444d; display: flex; justify-content: space-between; align-items: center; }
        .modal-body { padding: 24px; }
        .invite-input { width: 100%; background-color: #1d2125; border: 2px solid #579dff; color: #9fadbc; font-size: 0.9rem; padding: 12px 16px; border-radius: 4px; outline: none; }
        .invite-input::placeholder { color: #6b7280; }
        .close-btn { background: none; border: none; color: #9fadbc; font-size: 24px; cursor: pointer; padding: 0; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; }
        .close-btn:hover { color: #fff; }
      `}</style>

      <div className="mbr-root">
        {/* ── SIDEBAR ── */}
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
              <Link
                to="/cards"
                className="sidebar-btn-link text-decoration-none"
              >
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
                to="/boardButton"
                className="sidebar-btn-link text-decoration-none"
              >
                <i className="bi bi-kanban me-2"></i> Boards
              </Link>
              <button className="sidebar-btn-link text-start active">
                <i className="bi bi-people me-2"></i> Members
              </button>
              <Link
                to="/settings"
                className="sidebar-btn-link text-decoration-none"
              >
                <i className="bi bi-gear me-2"></i> Settings
              </Link>
            </div>
          </section>
        </nav>

        {/* ── RIGHT COLUMN ── */}
        <div
          style={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              flexShrink: 0,
              display: "flex",
              justifyContent: "flex-end",
              padding: "12px 16px",
              backgroundColor: "#1d2125",
            }}
          >
            <button
              onClick={() => navigate("/cardboards/40")} // Action to connect to that board
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

          <main
            style={{
              flexGrow: 1,
              overflowY: "auto",
              padding: "0 24px 24px 24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <h5
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#fff",
                  margin: 0,
                }}
              >
                Collaborators ({users.length})
              </h5>
            </div>

            <div style={{ display: "flex", gap: "24px" }}>
              {/* Tab navigation */}
              <div
                style={{
                  width: "220px",
                  minWidth: "220px",
                  borderRight: "1px solid rgba(108,117,125,0.25)",
                  paddingRight: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <button
                    className={`tab-item ${activeTab === "members" ? "active" : ""}`}
                    onClick={() => setActiveTab("members")}
                  >
                    Workspace members ({users.length})
                  </button>
                  <button
                    className={`tab-item ${activeTab === "guests" ? "active" : ""}`}
                    onClick={() => setActiveTab("guests")}
                  >
                    Guests (0)
                  </button>
                  <button
                    className={`tab-item ${activeTab === "requests" ? "active" : ""}`}
                    onClick={() => setActiveTab("requests")}
                  >
                    Join requests (0)
                  </button>
                </div>
              </div>

              {/* Tab content */}
              <div style={{ flexGrow: 1 }}>
                {activeTab === "members" && (
                  <div>
                    <h5
                      style={{
                        fontSize: "1rem",
                        fontWeight: 700,
                        marginBottom: "8px",
                      }}
                    >
                      Workspace members ({users.length})
                    </h5>
                    <hr
                      style={{
                        borderColor: "rgba(108,117,125,0.25)",
                        marginBottom: "20px",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Filter by name"
                      style={{
                        backgroundColor: "#282e33",
                        border: "1px solid #3d444d",
                        color: "#9fadbc",
                        fontSize: "0.85rem",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        maxWidth: "250px",
                        marginBottom: "20px",
                        display: "block",
                      }}
                    />

                    {users.length > 0 ? (
                      users.map((user) => (
                        <div
                          key={user.user_id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "12px 0",
                            borderTop: "1px solid rgba(108,117,125,0.25)",
                            borderBottom: "1px solid rgba(108,117,125,0.25)",
                            position: "relative",
                          }}
                        >
                          {/* Left: avatar + name/email */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <div className="avatar">
                              {user.user_name?.charAt(0).toUpperCase() || "?"}
                            </div>
                            <div>
                              <div
                                style={{ fontWeight: 700, fontSize: "0.9rem" }}
                              >
                                {user.user_name}
                              </div>
                              <div
                                style={{ color: "#9fadbc", fontSize: "0.8rem" }}
                              >
                                {user.user_email}
                              </div>
                            </div>
                          </div>

                          {/* Right: view boards + role button — both same style */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              position: "relative",
                            }}
                          >
                            {/* View Boards button */}
                            <button
                              className="btn-secondary-custom"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewBoards(user.user_id);
                              }}
                            >
                              {openBoardsPopoverId === user.user_id
                                ? "Hide boards"
                                : "View boards"}
                            </button>

                            {/* Boards popover */}
                            {openBoardsPopoverId === user.user_id && (
                              <div
                                ref={popoverRef}
                                style={{
                                  position: "absolute",
                                  backgroundColor: "#282e33",
                                  border: "1px solid #3d444d",
                                  borderRadius: "8px",
                                  maxHeight: "300px",
                                  width: "425px",
                                  padding: "16px",
                                  paddingRight: "8px",
                                  top: "36px",
                                  right: "120px",
                                  zIndex: 1000,
                                  overflowY: "auto",
                                  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                                }}
                              >
                                <input
                                  type="text"
                                  placeholder="Search boards..."
                                  value={boardSearch}
                                  onChange={(e) =>
                                    setBoardSearch(e.target.value)
                                  }
                                  style={{
                                    backgroundColor: "#282e33",
                                    border: "1px solid #3d444d",
                                    color: "#9fadbc",
                                    fontSize: "0.85rem",
                                    padding: "6px 12px",
                                    borderRadius: "4px",
                                    width: "100%",
                                    marginBottom: "12px",
                                  }}
                                />
                                <Row className="g-3">
                                  {loadingBoards ? (
                                    <p
                                      style={{
                                        color: "#9fadbc",
                                        fontSize: "0.85rem",
                                        margin: 0,
                                      }}
                                    >
                                      Loading boards...
                                    </p>
                                  ) : userBoards[user.user_id]?.length > 0 ? (
                                    <BoardTemplate
                                      boards={userBoards[user.user_id].filter(
                                        (b) =>
                                          b.board_title
                                            .toLowerCase()
                                            .includes(
                                              boardSearch.toLowerCase(),
                                            ),
                                      )}
                                    />
                                  ) : (
                                    <p
                                      style={{
                                        color: "#9fadbc",
                                        fontSize: "0.85rem",
                                        margin: 0,
                                      }}
                                    >
                                      No boards found.
                                    </p>
                                  )}
                                </Row>
                              </div>
                            )}

                            {/* ── Role button — same style as "View boards" ── */}
                            <button
                              className="btn-secondary-custom"
                              disabled={user.user_access === 1}
                              onClick={(e) => {
                                if (user.user_access === 1) return;

                                e.stopPropagation();
                                setOpenBoardsPopoverId(null);
                                setShowAdminPopover(
                                  showAdminPopover === user.user_id
                                    ? null
                                    : user.user_id,
                                );
                              }}
                              title={
                                user.user_access === 1
                                  ? "Admins cannot change other admins' roles"
                                  : "Change permissions"
                              }
                              style={{
                                opacity: user.user_access === 1 ? 0.5 : 1,
                                cursor:
                                  user.user_access === 1
                                    ? "not-allowed"
                                    : "pointer",
                              }}
                            >
                              {user.user_access === 1 ? (
                                <>
                                  <i className="bi bi-shield-fill-check"></i>{" "}
                                  Admin
                                </>
                              ) : (
                                <>
                                  <i className="bi bi-person-fill"></i> User
                                </>
                              )}
                              <i
                                className="bi bi-chevron-down"
                                style={{ fontSize: "0.6rem", opacity: 0.6 }}
                              ></i>
                            </button>

                            {/* Permissions popover */}
                            {showAdminPopover === user.user_id &&
                              user.user_access === 0 && (
                                <div
                                  style={{
                                    position: "absolute",
                                    backgroundColor: "#282e33",
                                    border: "1px solid #3d444d",
                                    borderRadius: "8px",
                                    width: "175px",
                                    zIndex: 1001,
                                    right: "0",
                                    top: "36px",
                                    overflow: "hidden",
                                    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                                  }}
                                >
                                  <div
                                    style={{
                                      padding: "12px 16px",
                                      borderBottom: "1px solid #3d444d",
                                      fontWeight: 700,
                                      fontSize: "0.85rem",
                                      color: "#9fadbc",
                                      textAlign: "center",
                                    }}
                                  >
                                    Change permissions
                                  </div>

                                  <button
                                    style={{
                                      width: "100%",
                                      background: "none",
                                      border: "none",
                                      padding: "12px 16px",
                                      textAlign: "left",
                                      color: "#9fadbc",
                                      fontSize: "0.85rem",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      handleChangeAccess(user.user_id)
                                    }
                                  >
                                    {user.user_access === 1 ? (
                                      <>
                                        <i className="bi bi-person-fill me-2"></i>
                                        User
                                      </>
                                    ) : (
                                      <>
                                        <i className="bi bi-shield-fill-check me-2"></i>
                                        Admin
                                      </>
                                    )}
                                  </button>
                                </div>
                              )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <div className="avatar">?</div>
                        <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                          No users found in workspace.
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "guests" && (
                  <div>
                    <h5
                      style={{
                        fontSize: "1rem",
                        fontWeight: 700,
                        marginBottom: "8px",
                      }}
                    >
                      Guests (0)
                    </h5>
                    <p
                      style={{
                        color: "#9fadbc",
                        fontSize: "0.85rem",
                        marginBottom: "20px",
                      }}
                    >
                      Guests can only view and edit the boards to which they've
                      been added.
                    </p>
                    <hr
                      style={{
                        borderColor: "rgba(108,117,125,0.25)",
                        marginBottom: "20px",
                      }}
                    />
                    <p
                      style={{
                        color: "#9fadbc",
                        fontSize: "0.85rem",
                        textAlign: "center",
                        marginTop: "48px",
                        fontStyle: "italic",
                      }}
                    >
                      There are no guests in this Workspace.
                    </p>
                  </div>
                )}

                {activeTab === "requests" && (
                  <div>
                    <h5
                      style={{
                        fontSize: "1rem",
                        fontWeight: 700,
                        marginBottom: "8px",
                      }}
                    >
                      Join requests (0)
                    </h5>
                    <p
                      style={{
                        color: "#9fadbc",
                        fontSize: "0.85rem",
                        marginBottom: "20px",
                      }}
                    >
                      These people have requested to join this Workspace.
                    </p>
                    <hr
                      style={{
                        borderColor: "rgba(108,117,125,0.25)",
                        marginBottom: "20px",
                      }}
                    />
                    <p
                      style={{
                        color: "#9fadbc",
                        fontSize: "0.85rem",
                        textAlign: "center",
                        marginBottom: "20px",
                      }}
                    >
                      There are no join requests
                    </p>
                    <input
                      type="text"
                      placeholder="Filter by name"
                      style={{
                        backgroundColor: "#282e33",
                        border: "1px solid #3d444d",
                        color: "#9fadbc",
                        fontSize: "0.85rem",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        maxWidth: "250px",
                        marginBottom: "16px",
                        display: "block",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          color: "#9fadbc",
                          fontSize: "0.85rem",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          style={{ accentColor: "#579dff" }}
                        />
                        Select all (0)
                      </label>
                      <button className="btn-secondary-custom">
                        Add selected to Workspace
                      </button>
                      <button className="btn-secondary-custom">
                        Delete selected requests
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>

        {/* ── Invite Modal ── */}
        {showInviteModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowInviteModal(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h5
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "#fff",
                    margin: 0,
                  }}
                >
                  Invite to Workspace
                </h5>
                <button
                  className="close-btn"
                  onClick={() => setShowInviteModal(false)}
                >
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
