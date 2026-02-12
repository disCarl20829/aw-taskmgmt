import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import BoardCards from "../components/auth/BoardCards";

const CardBoards = () => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeShareTab, setActiveShareTab] = useState("members");
  const [visibility, setVisibility] = useState("workspace");
  const [isConfirmingPublic, setIsConfirmingPublic] = useState(false);
  const [showDeleteLinkConfirm, setShowDeleteLinkConfirm] = useState(false);
  const [hasLink, setHasLink] = useState(true);
  const [shareRole, setShareRole] = useState("Member");
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const colors = {
    topNav: "#1d4e89",
    bg: "#5a8fb8",
    boardHeader: "#4a7089",
    listYellow: "#c9a857",
    listGreen: "#4a7c59",
    listBlue: "#5a7c8f",
    listGrey: "#b8c5d0",
    cardBg: "#2e3c4d",
    accentGreen: "#10b981",
    dangerRed: "#fee2e2",
    textRed: "#991b1b",
  };

  // 1. FETCH DATA FROM DATABASE ON LOAD
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/kanban"); // Replace with your URL
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Error loading board:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. DELETE CARD
  const deleteCard = async (listIdx, cardId) => {
    try {
      await fetch(`/api/cards/${cardId}`, { method: "DELETE" });
      const newData = [...data];
      newData[listIdx].cards = newData[listIdx].cards.filter(
        (c) => c.id !== cardId,
      );
      setData(newData);
    } catch (err) {
      alert("Failed to delete card");
    }
  };

  // 3. DELETE LIST
  const deleteList = async (listId) => {
    if (!window.confirm("Delete this entire list?")) return;
    try {
      await fetch(`/api/lists/${listId}`, { method: "DELETE" });
      setData(data.filter((list) => list.id !== listId));
    } catch (err) {
      alert("Failed to delete list");
    }
  };

  if (loading)
    return <div className="p-5 text-center text-white">Loading Board...</div>;

  return (
    <>
      <style>{`
        .board-wrapper {
          background-color: ${colors.bg};
          min-height: 100vh;
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .custom-navbar { background-color: ${colors.topNav}; }
        .custom-board-header { background-color: ${colors.boardHeader}; }
        /* Rest of your styles from the document remain here... */
      `}</style>

      <div className="board-wrapper">
        <div className="custom-navbar d-flex justify-content-between align-items-center px-3 py-2"></div>

        <div className="custom-board-header d-flex justify-content-between align-items-center px-3 py-2"></div>

        <div
          className="kanban-scroll-container d-flex gap-3 p-3"
          style={{ overflowX: "auto" }}
        >
          {data.map((list, listIdx) => (
            <div
              key={list.id}
              className="kanban-list p-2 rounded shadow-sm"
              style={{
                backgroundColor: list.color || colors.listGrey,
                minWidth: "280px",
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-2 px-1 text-dark">
                <input
                  className="fw-bold small border-0 bg-transparent w-75"
                  value={list.title}
                  readOnly
                />
                <button
                  onClick={() => deleteList(list.id)}
                  className="btn btn-sm border-0 text-secondary"
                >
                  &times;
                </button>
              </div>

              {list.cards.map((card) => (
                <div
                  key={card.id}
                  className="bg-white rounded p-2 mb-2 shadow-sm d-flex justify-content-between align-items-center"
                >
                  <div className="d-flex align-items-center gap-2">
                    <input type="checkbox" checked={card.completed} readOnly />
                    <span className="small text-dark">{card.text}</span>
                  </div>
                  <button
                    onClick={() => deleteCard(listIdx, card.id)}
                    className="btn btn-sm p-0 border-0 text-danger opacity-50"
                  >
                    &minus;
                  </button>
                </div>
              ))}

              <button className="btn btn-sm w-100 text-start p-1 border-0 text-secondary">
                + Add card
              </button>
            </div>
          ))}

          <button
            onClick={() => {}}
            className="kanban-list p-3 rounded border-0 text-center shadow-sm"
            style={{ backgroundColor: colors.listGrey, minWidth: "280px" }}
          >
            <span className="fw-bold small text-dark">+ Add list</span>
          </button>
        </div>
      </div>

      <style>{`
        .board-wrapper {
          background-color: ${colors.bg};
          min-height: 100vh;
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .custom-navbar { background-color: ${colors.topNav}; }
        .custom-board-header { background-color: ${colors.boardHeader}; }
        .search-input {
          max-width: 500px;
          background-color: rgba(255,255,255,0.95);
          border: none;
          font-size: 14px;
        }
        .kanban-list {
          width: 270px;
          min-width: 270px;
          border-radius: 4px;
        }
        .popover-menu {
          top: 45px;
          right: 0;
          background-color: white;
          border-radius: 8px;
          z-index: 1000;
          color: black;
          overflow: hidden;
        }
        .scrollable-filter {
          max-height: 500px;
          overflow-y: auto;
          scrollbar-width: thin;
          padding-right: 4px;
        }
        .bottom-pill-nav {
          background-color: ${colors.cardBg};
          border-radius: 50px;
        }
        .kanban-scroll-container {
          overflow-x: auto;
          display: flex;
          padding: 16px;
          gap: 16px;
          align-items: flex-start;
        }
        .label-pill-large {
            height: 32px;
            border-radius: 4px;
            width: 100%;
            display: flex;
            align-items: center;
            padding: 0 12px;
            color: white;
            font-size: 12px;
            font-weight: 500;
        }
      `}</style>

      <div className="board-wrapper">
        {/* --- Top Navbar --- */}
        <div className="custom-navbar d-flex justify-content-between align-items-center px-3 py-2">
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-sm p-1 border-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="28px"
                viewBox="0 -960 960 960"
                width="28px"
                fill="white"
              >
                <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" />
              </svg>
            </button>
            <button className="btn btn-sm p-1 border-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="28px"
                viewBox="0 -960 960 960"
                width="28px"
                fill="#f4d03f"
              >
                <path d="M160-200q-33 0-56.5-23.5T80-280v-400q0-33 23.5-56.5T160-760h640q33 0 56.5 23.5T880-680v400q0 33-23.5 56.5T800-200H160Zm0-80h200v-400H160v400Zm280 0h200v-400H440v400Zm280 0h80v-400h-80v400Z" />
              </svg>
            </button>
            <span className="fw-bold" style={{ fontSize: "15px" }}>
              My board
            </span>
          </div>

          <input
            type="text"
            placeholder="Search"
            className="form-control form-control-sm search-input"
          />

          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-primary btn-sm px-3"
              style={{ fontSize: "14px" }}
            >
              Create
            </button>
            <button className="btn btn-sm p-1 border-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="white"
              >
                <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
              </svg>
            </button>
            <div
              className="rounded-circle bg-primary d-flex align-items-center justify-content-center fw-bold"
              style={{
                width: "36px",
                height: "36px",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              AW
            </div>
          </div>
        </div>

        {/* --- Board Sub-Header --- */}
        <div className="custom-board-header d-flex justify-content-between align-items-center px-3 py-2">
          <div className="d-flex align-items-center gap-2">
            <h6 className="mb-0 fw-bold" style={{ fontSize: "16px" }}>
              My board
            </h6>
            <button className="btn btn-sm p-0 border-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="22px"
                viewBox="0 -960 960 960"
                width="22px"
                fill="white"
              >
                <path d="M160-200q-33 0-56.5-23.5T80-280v-400q0-33 23.5-56.5T160-760h640q33 0 56.5 23.5T880-680v400q0 33-23.5 56.5T800-200H160Zm0-80h200v-400H160v400Zm280 0h200v-400H440v400Zm280 0h80v-400h-80v400Z" />
              </svg>
            </button>
          </div>

          <div className="d-flex align-items-center gap-2 position-relative">
            <button
              className="btn btn-sm p-1 border-0"
              onClick={() =>
                setActiveMenu(activeMenu === "profile" ? null : "profile")
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="22px"
                viewBox="0 -960 960 960"
                width="22px"
                fill="white"
              >
                <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
              </svg>
            </button>

            <button
              className="btn btn-sm p-1 border-0"
              onClick={() =>
                setActiveMenu(activeMenu === "filter" ? null : "filter")
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="22px"
                viewBox="0 -960 960 960"
                width="22px"
                fill="white"
              >
                <path d="M440-160q-17 0-28.5-11.5T400-200v-240L161-745q-14-17-4-36t31-19h584q21 0 31 19t-4 36L560-440v240q0 17-11.5 28.5T520-160h-80Zm40-308 198-252H282l198 252Zm0 0Z" />
              </svg>
            </button>

            <button
              className="btn btn-sm p-1 border-0"
              onClick={() =>
                setActiveMenu(activeMenu === "auto" ? null : "auto")
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="22px"
                viewBox="0 -960 960 960"
                width="22px"
                fill="white"
              >
                <path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" />
              </svg>
            </button>

            <button
              className="btn btn-primary btn-sm px-3 d-flex align-items-center gap-1"
              style={{ fontSize: "13px" }}
              onClick={() => setIsShareOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="18px"
                viewBox="0 -960 960 960"
                width="18px"
                fill="white"
              >
                <path d="M720-80q-50 0-85-35t-35-85q0-7 1-14.5t3-13.5L322-392q-17 15-38 23.5t-44 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q23 0 44 8.5t38 23.5l282-164q-2-6-3-13.5t-1-14.5q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-23 0-44-8.5T638-672L356-508q2 6 3 13.5t1 14.5q0 7-1 14.5t-3 13.5l282 164q17-15 38-23.5t44-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-640q17 0 28.5-11.5T760-760q0-17-11.5-28.5T720-800q-17 0-28.5 11.5T680-760q0 17 11.5 28.5T720-720ZM240-440q17 0 28.5-11.5T280-480q0-17-11.5-28.5T240-520q-17 0-28.5 11.5T200-480q0 17 11.5 28.5T240-440Zm480 280q17 0 28.5-11.5T760-200q0-17-11.5-28.5T720-240q-17 0-28.5 11.5T680-200q0 17 11.5 28.5T720-160Zm0-600ZM240-480Zm480 280Z" />
              </svg>
              <span>Share</span>
            </button>
            {/* --- SHARE MODAL/OVERLAY --- */}
            {isShareOpen && (
              <div
                className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                style={{ zIndex: 2000, backgroundColor: "rgba(0,0,0,0.4)" }}
                onClick={() => {
                  setIsShareOpen(false);
                  setShowRoleDropdown(false);
                }}
              >
                <div
                  className="bg-white rounded-3 shadow-lg position-relative"
                  style={{
                    width: "550px",
                    minHeight: "450px",
                    color: "#172b4d",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowRoleDropdown(false);
                  }}
                >
                  {/* SUCCESS TOAST FOR COPY LINK */}
                  {showCopyToast && (
                    <div
                      className="position-absolute top-0 start-50 translate-middle-x mt-2 bg-success text-white px-3 py-1 rounded shadow-sm d-flex align-items-center gap-2"
                      style={{ zIndex: 2200, fontSize: "13px" }}
                    >
                      <span>✔️</span> Link copied to clipboard
                    </div>
                  )}

                  {/* HEADER */}
                  <div className="d-flex justify-content-between align-items-center p-3">
                    <h5 className="mb-0 fw-bold" style={{ fontSize: "20px" }}>
                      Share board
                    </h5>
                    <button
                      className="btn border-0 p-0 fs-3"
                      onClick={() => setIsShareOpen(false)}
                    >
                      &times;
                    </button>
                  </div>

                  <div className="px-4 pb-4">
                    {/* INPUT AND DYNAMIC DROPDOWN */}
                    <div className="d-flex gap-2 mb-3 position-relative">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Email address or name"
                        style={{ fontSize: "14px" }}
                      />

                      {/* Custom Role Dropdown */}
                      <div className="position-relative">
                        <button
                          className="btn btn-light border d-flex align-items-center gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowRoleDropdown(!showRoleDropdown);
                          }}
                          style={{ fontSize: "14px", minWidth: "110px" }}
                        >
                          {shareRole} <small></small>
                        </button>

                        {showRoleDropdown && (
                          <div
                            className="position-absolute mt-1 bg-white border shadow-sm rounded-2 py-2"
                            style={{ zIndex: 2000, width: "250px", right: 0 }}
                          >
                            <div
                              className="px-3 py-1 pointer hover-bg-light"
                              onClick={() => {
                                setShareRole("Member");
                                setShowRoleDropdown(false);
                              }}
                            >
                              <div className="fw-bold small">Member</div>
                              <div
                                className="text-muted"
                                style={{ fontSize: "11px" }}
                              >
                                Can edit and join cards.
                              </div>
                            </div>
                            <div
                              className="px-3 py-1 pointer mt-1 opacity-50"
                              style={{ cursor: "not-allowed" }}
                            ></div>
                            <div
                              className="text-muted"
                              style={{ fontSize: "11px" }}
                            >
                              Add people with limited permissions.
                            </div>
                          </div>
                        )}
                      </div>

                      <button className="btn btn-primary px-4 fw-bold shadow-sm">
                        Share
                      </button>
                    </div>

                    {/* LINK SECTION WITH TOAST LOGIC */}
                    <div className="mb-4">
                      {hasLink ? (
                        <div
                          className="d-flex align-items-center justify-content-between p-3 rounded"
                          style={{ backgroundColor: "#f7f8f9" }}
                        >
                          <div className="d-flex align-items-center gap-3">
                            <span className="fs-4">🔗</span>
                            <div>
                              <div className="fw-bold small">
                                Anyone with the link can join as a member
                              </div>
                              <div
                                className="d-flex gap-3 mt-1"
                                style={{ fontSize: "12px" }}
                              >
                                <span
                                  className="text-primary text-decoration-underline pointer fw-bold"
                                  onClick={() => {
                                    setShowCopyToast(true);
                                    setTimeout(
                                      () => setShowCopyToast(false),
                                      2000,
                                    );
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  Copy link
                                </span>
                                <span
                                  className="text-danger text-decoration-underline pointer"
                                  onClick={() => setShowDeleteLinkConfirm(true)}
                                  style={{ cursor: "pointer" }}
                                >
                                  Delete link
                                </span>
                              </div>
                            </div>
                          </div>
                          <button className="btn btn-sm btn-outline-secondary border-0 text-dark small">
                            Change permissions
                          </button>
                        </div>
                      ) : (
                        <div className="p-3 border rounded border-dashed text-center">
                          <span className="text-muted small">
                            This board has no share link.{" "}
                          </span>
                          <span
                            className="text-primary text-decoration-underline pointer small fw-bold"
                            onClick={() => setHasLink(true)}
                            style={{ cursor: "pointer" }}
                          >
                            Create link
                          </span>
                        </div>
                      )}
                    </div>

                    {/* TABS SECTION */}
                    <div
                      className="d-flex border-bottom mb-3"
                      style={{ fontSize: "14px" }}
                    >
                      <div
                        className={`pb-2 px-1 me-4 pointer transition ${activeShareTab === "members" ? "border-bottom border-primary border-3 fw-bold text-primary" : "text-muted"}`}
                        onClick={() => setActiveShareTab("members")}
                        style={{ cursor: "pointer" }}
                      >
                        Board members{" "}
                        <span className="badge bg-light text-dark border ms-1">
                          Database
                        </span>
                      </div>
                      <div
                        className={`pb-2 px-1 pointer transition ${activeShareTab === "requests" ? "border-bottom border-primary border-3 fw-bold text-primary" : "text-muted"}`}
                        onClick={() => setActiveShareTab("requests")}
                        style={{ cursor: "pointer" }}
                      >
                        Join requests
                      </div>
                    </div>

                    {/* TAB CONTENT */}
                    <div style={{ minHeight: "80px" }}>
                      {activeShareTab === "members" ? (
                        <div className="member-item d-flex align-items-center justify-content-between py-2">
                          <div className="d-flex align-items-center gap-3">
                            <div
                              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm"
                              style={{
                                width: "36px",
                                height: "36px",
                                fontSize: "13px",
                              }}
                            >
                              Database
                            </div>
                            <div>
                              <div className="fw-bold small">Database</div>
                              <div
                                className="text-muted"
                                style={{ fontSize: "11px" }}
                              >
                                Database
                              </div>
                            </div>
                          </div>
                          <select
                            className="form-select form-select-sm w-auto border-0 bg-transparent fw-bold"
                            style={{ fontSize: "13px" }}
                          >
                            <option>Admin</option>
                            <option>Member</option>
                          </select>
                        </div>
                      ) : (
                        <div className="text-center py-4 text-muted small">
                          <div className="mb-2 fs-2">👤</div>
                          No pending join requests at the moment.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* DELETE CONFIRMATION POPUP */}
                  {showDeleteLinkConfirm && (
                    <div
                      className="position-absolute shadow-lg border rounded-3 p-3 bg-white"
                      style={{
                        width: "320px",
                        top: "110px",
                        left: "115px",
                        zIndex: 2150,
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold small text-muted text-center w-100">
                          Delete share link?
                        </span>
                        <span
                          className="pointer fs-5"
                          onClick={() => setShowDeleteLinkConfirm(false)}
                        >
                          &times;
                        </span>
                      </div>
                      <hr className="my-2" />
                      <p
                        className="text-muted"
                        style={{ fontSize: "13px", lineHeight: "1.4" }}
                      >
                        The existing board share link will no longer work.
                        Anyone who has it won't be able to join.
                      </p>
                      <button
                        className="btn btn-danger w-100 btn-sm fw-bold py-2 shadow-sm"
                        onClick={() => {
                          setHasLink(false);
                          setShowDeleteLinkConfirm(false);
                        }}
                      >
                        Delete link
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
            <button className="btn btn-sm p-1 border-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="22px"
                viewBox="0 -960 960 960"
                width="22px"
                fill="white"
              >
                <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" />
              </svg>
            </button>

            {/* --- Modals/Menus --- */}
            {activeMenu === "profile" && (
              <div
                className="position-absolute shadow-lg popover-menu"
                style={{ width: "280px" }}
              >
                <div
                  style={{
                    backgroundColor: "#e9f0f8",
                    color: "black",
                    padding: "20px",
                    textAlign: "center",
                    position: "relative",
                  }}
                >
                  <div
                    className="position-absolute top-0 end-0 p-2"
                    style={{
                      cursor: "pointer",
                      fontSize: "24px",
                      fontWeight: "bold",
                    }}
                    onClick={() => setActiveMenu(null)}
                  >
                    ×
                  </div>
                  <div
                    className="rounded-circle mx-auto mb-2"
                    style={{
                      width: "70px",
                      height: "70px",
                      backgroundColor: "#ccc",
                      border: "3px solid white",
                    }}
                  ></div>
                  <h6 className="mb-0 fw-bold"></h6>
                  <div className="text-muted small"></div>
                </div>
                <div className="p-2">
                  <div
                    className="p-2 small text-dark"
                    style={{ cursor: "pointer" }}
                  >
                    Edit profile info
                  </div>
                  <hr className="my-1 opacity-25" />
                  <div
                    className="p-2 small text-dark"
                    style={{ cursor: "pointer" }}
                  >
                    View member's board activity
                  </div>
                </div>
              </div>
            )}

            {activeMenu === "filter" && (
              <div
                className="position-absolute shadow-lg popover-menu"
                style={{ width: "320px", border: "1px solid #ddd" }}
              >
                <div className="p-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="flex-grow-1 text-center small fw-bold text-muted">
                      Filter
                    </div>
                    <div
                      style={{
                        cursor: "pointer",
                        fontSize: "20px",
                        color: "#666",
                      }}
                      onClick={() => setActiveMenu(null)}
                    >
                      ×
                    </div>
                  </div>

                  <div className="scrollable-filter">
                    <div className="filter-section-title">Keyword</div>
                    <input
                      type="text"
                      className="form-control form-control-sm mb-1 bg-dark text-white border-secondary"
                      placeholder="Enter a keyword..."
                    />
                    <div
                      style={{ fontSize: "11px", color: "#8c9bab" }}
                      className="mb-3"
                    >
                      Search cards, members, labels, and more.
                    </div>

                    <div className="filter-section-title">Members</div>
                    <div className="filter-option">
                      <input type="checkbox" /> <span>No members</span>
                    </div>
                    <div className="filter-option">
                      <input type="checkbox" />{" "}
                      <span>Cards assigned to me</span>
                    </div>

                    <div className="filter-section-title">Card status</div>
                    <div className="filter-option">
                      <input type="checkbox" /> <span>Marked as complete</span>
                    </div>
                    <div className="filter-option">
                      <input type="checkbox" />{" "}
                      <span>Not marked as complete</span>
                    </div>

                    <div className="filter-section-title">Due date</div>
                    <div className="filter-option">
                      <input type="checkbox" />{" "}
                      <span style={{ color: "#ff78cb" }}>📅</span> No dates
                    </div>
                    <div className="filter-option">
                      <input type="checkbox" />{" "}
                      <span style={{ color: "#bf86ff" }}>🕒</span> Overdue
                    </div>
                    <div className="filter-option">
                      <input type="checkbox" />{" "}
                      <span style={{ color: "#579dff" }}>🕒</span> Due in the
                      next day
                    </div>
                    <div className="filter-option">
                      <input type="checkbox" />{" "}
                      <span style={{ color: "#4bce97" }}>🕒</span> Due in the
                      next week
                    </div>
                    <div className="filter-option">
                      <input type="checkbox" />{" "}
                      <span style={{ color: "#8590a2" }}>🕒</span> Due in the
                      next month
                    </div>

                    <div className="filter-section-title">Labels</div>
                    <div className="filter-option">
                      <input type="checkbox" /> <span>No labels</span>
                    </div>
                    <div className="filter-option">
                      <input type="checkbox" />{" "}
                      <div
                        className="label-bar"
                        style={{ backgroundColor: "#4bce97" }}
                      ></div>
                    </div>
                    <div className="filter-option">
                      <input type="checkbox" />{" "}
                      <div
                        className="label-bar"
                        style={{ backgroundColor: "#f5cd47" }}
                      ></div>
                    </div>
                    <select className="form-select form-select-sm mt-2 bg-dark text-white border-secondary small">
                      <option>1 label selected</option>
                    </select>

                    <div className="filter-section-title">Activity</div>
                    <div className="filter-option">
                      <input type="checkbox" />{" "}
                      <span>Active in the last week</span>
                    </div>
                    <div className="filter-option">
                      <input type="checkbox" />{" "}
                      <span>Active in the last two weeks</span>
                    </div>
                    <div className="filter-option">
                      <input type="checkbox" />{" "}
                      <span>Active in the last four weeks</span>
                    </div>
                    <div className="filter-option">
                      <input type="checkbox" />{" "}
                      <span>Without activity in the last four weeks</span>
                    </div>
                  </div>

                  <hr className="border-secondary" />
                  <div className="d-flex justify-content-between align-items-center py-2">
                    <span className="small">Match Type</span>
                    <select className="form-select form-select-sm w-50 bg-dark text-white border-secondary small">
                      <option>Any match</option>
                      <option>Exact match</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeMenu === "auto" && (
              <div
                className="position-absolute shadow-lg popover-menu"
                style={{ width: "320px", right: 0, border: "1px solid #ddd" }}
              >
                {!isConfirmingPublic ? (
                  /* --- STEP 1: CHANGE VISIBILITY MENU --- */
                  <div className="p-3">
                    <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                      <span className="small fw-bold text-muted w-100 text-center">
                        Change visibility
                      </span>
                      <div
                        style={{ cursor: "pointer", fontSize: "20px" }}
                        onClick={() => setActiveMenu(null)}
                      >
                        ×
                      </div>
                    </div>

                    {/* Private Option */}
                    <div
                      className="visibility-option p-2 rounded mb-1"
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          visibility === "private" ? "#f0f2f5" : "transparent",
                      }}
                      onClick={() => {
                        setVisibility("private");
                        setActiveMenu(null);
                      }}
                    >
                      <div className="d-flex gap-2">
                        <span style={{ color: "#ae2a19" }}>icons</span>
                        <div>
                          <div className="fw-bold small">Private</div>
                          <div style={{ fontSize: "11px", color: "#666" }}>
                            Only board members can see this board.
                          </div>
                        </div>
                        {visibility === "private" && (
                          <span className="ms-auto">✔️</span>
                        )}
                      </div>
                    </div>

                    {/* Workspace Option */}
                    <div
                      className="visibility-option p-2 rounded mb-1"
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          visibility === "workspace"
                            ? "#f0f2f5"
                            : "transparent",
                      }}
                      onClick={() => {
                        setVisibility("workspace");
                        setActiveMenu(null);
                      }}
                    >
                      <div className="d-flex gap-2">
                        <span style={{ color: "#172b4d" }}>icons</span>
                        <div>
                          <div className="fw-bold small">Workspace</div>
                          <div style={{ fontSize: "11px", color: "#666" }}>
                            All members of the Workspace can see and edit this
                            board.
                          </div>
                        </div>
                        {visibility === "workspace" && (
                          <span className="ms-auto">✔️</span>
                        )}
                      </div>
                    </div>

                    {/* Public Option - Trigger Confirmation */}
                    <div
                      className="visibility-option p-2 rounded mb-1"
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          visibility === "public" ? "#f0f2f5" : "transparent",
                      }}
                      onClick={() => setIsConfirmingPublic(true)}
                    >
                      <div className="d-flex gap-2">
                        <span style={{ color: "#216e4e" }}>icons</span>
                        <div>
                          <div className="fw-bold small">Public</div>
                          <div style={{ fontSize: "11px", color: "#666" }}>
                            Anyone on the internet can see this board.
                          </div>
                        </div>
                        {visibility === "public" && (
                          <span className="ms-auto">✔️</span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* --- STEP 2: CONFIRM PUBLIC SCREEN --- */
                  <div className="p-3">
                    <div className="d-flex align-items-center mb-3 border-bottom pb-2">
                      <span
                        style={{ cursor: "pointer", fontSize: "18px" }}
                        onClick={() => setIsConfirmingPublic(false)}
                      >
                        ←
                      </span>
                      <span className="small fw-bold text-muted w-100 text-center">
                        Make board public?
                      </span>
                      <div
                        style={{ cursor: "pointer", fontSize: "20px" }}
                        onClick={() => setActiveMenu(null)}
                      >
                        ×
                      </div>
                    </div>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#44546f",
                        lineHeight: "1.4",
                      }}
                    >
                      Public boards are visible to anyone on the internet and
                      will appear in search engines like Google. Only board
                      members can edit.
                    </p>
                    <button
                      className="btn btn-primary w-100 mt-2"
                      style={{ fontSize: "14px", fontWeight: "500" }}
                      onClick={() => {
                        setVisibility("public");
                        setIsConfirmingPublic(false);
                        setActiveMenu(null);
                      }}
                    >
                      Yes, make board public
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* --- Bottom Navigation --- */}
          <div className="position-fixed bottom-0 start-50 translate-middle-x mb-3">
            <div className="d-flex gap-0 bottom-pill-nav overflow-hidden shadow">
              <button
                className="btn btn-sm px-4 py-2 d-flex align-items-center gap-2 border-0"
                style={{ backgroundColor: "transparent", color: "white" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="18px"
                  viewBox="0 -960 960 960"
                  width="18px"
                  fill="white"
                >
                  <path d="M160-160v-640l480 320-480 320Zm80-320Zm0 134 230-154-230-154v308Z" />
                </svg>
                <span className="small">Inbox</span>
              </button>
              <button className="btn btn-primary btn-sm px-4 py-2 d-flex align-items-center gap-2 rounded-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="18px"
                  viewBox="0 -960 960 960"
                  width="18px"
                  fill="white"
                >
                  <path d="M160-200q-33 0-56.5-23.5T80-280v-400q0-33 23.5-56.5T160-760h640q33 0 56.5 23.5T880-680v400q0 33-23.5 56.5T800-200H160Zm0-80h200v-400H160v400Zm280 0h200v-400H440v400Zm280 0h80v-400h-80v400Z" />
                </svg>
                <span className="small fw-bold">Board</span>
              </button>
              <button
                className="btn btn-sm px-4 py-2 d-flex align-items-center gap-2 border-0"
                style={{ backgroundColor: "transparent", color: "white" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="18px"
                  viewBox="0 -960 960 960"
                  width="18px"
                  fill="white"
                >
                  <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5-23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
                </svg>
                <span className="small">Switch board</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardBoards;
