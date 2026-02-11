import React, { useState, useRef } from "react";
import {
  Navbar,
  Nav,
  Button,
  Form,
  OverlayTrigger,
  Popover,
  ListGroup,
  Overlay,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const CardBoards = () => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
   const handleShowModal = () => setShowModal(true);
  const [activeShareTab, setActiveShareTab] = useState("members");
  const [visibility, setVisibility] = useState("workspace");
  const [isConfirmingPublic, setIsConfirmingPublic] = useState(false);
  const [showDeleteLinkConfirm, setShowDeleteLinkConfirm] = useState(false);
  const [hasLink, setHasLink] = useState(true);
  const [shareRole, setShareRole] = useState("Member");
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);

  // Navbar state — mirrors Dashboard
  const [showAppsOverlay, setShowAppsOverlay] = useState(false);
  const target = useRef(null);

  const notificationPopover = (
    <Popover id="popover-notifications" className="trello-popover">
      <Popover.Header
        as="h3"
        className="d-flex justify-content-between align-items-center"
      >
        Notifications
        <Form.Check type="switch" id="notif-switch" defaultChecked />
      </Popover.Header>
      <Popover.Body className="text-center">
        No unread notifications
      </Popover.Body>
    </Popover>
  );

  const accountPopover = (
    <Popover id="popover-account" className="trello-popover account-width">
      <Popover.Header className="text-secondary small bg-dark border-secondary">
        Account
      </Popover.Header>
      <Popover.Body className="p-0 bg-dark">
        <div className="d-flex align-items-center p-3 gap-2">
          <div className="avatar-circle bg-info">U</div>
          <div>
            <div className="fw-bold text-light">User123</div>
            <div className="text-secondary small">@user123</div>
          </div>
        </div>
        <ListGroup variant="flush">
          {[
            "Profile and visibility",
            "Activity",
            "Card",
            "Settings",
            "Log out",
          ].map((item) => (
            <ListGroup.Item
              key={item}
              action
              className="bg-dark text-light border-secondary"
              style={{ cursor: "pointer" }}
            >
              {item}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Popover.Body>
    </Popover>
  );

  const colors = {
    topNav: "#1d2125",
    bg: "#5a8fb8",
    boardHeader: "rgba(0,0,0,0.22)",
    listYellow: "#c9a857",
    listGreen: "#4a7c59",
    listBlue: "#5a7c8f",
    listGrey: "#b8c5d0",
    cardBg: "#2e3c4d",
  };

  return (
    <>
      <style>{`
        .board-wrapper {
          background-color: ${colors.bg};
          min-height: 100vh;
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        /* ── NAVBAR ── */
        .trello-nav {
          background-color: #1d2125 !important;
          height: 48px;
          border-bottom: 1px solid rgba(108,117,125,0.25);
          position: relative;
          z-index: 100;
        }
        .cb-nav-btn {
          background: none;
          border: none;
          color: #9fadbc;
          padding: 6px 8px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
        }
        .cb-nav-btn:hover { background-color: #333c44; color: #fff; }
        .nav-icon-link {
          background-color: #579dff;
          border-radius: 4px;
          width: 28px; height: 28px;
          text-decoration: none;
        }
        .nav-icon-link:hover { background-color: #4a90e2; }
        .custom-search .input-group {
          background-color: #282e33;
          border: 1px solid #3d444d;
          border-radius: 6px;
        }
        .custom-search .input-group:focus-within { border-color: #579dff; }
        .custom-search .input-group-text { background-color: transparent !important; border: none !important; }
        .custom-search .form-control {
          background-color: transparent !important;
          border: none !important;
          color: #9fadbc !important;
          box-shadow: none !important;
          font-size: 0.85rem;
          height: 31px;
        }
        .custom-search .form-control:focus { color: #fff !important; }
        .custom-search .form-control::placeholder { color: #6c757d; }
        .avatar-circle {
          width: 30px; height: 30px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 0.75rem; color: #fff;
          cursor: pointer;
        }
        .trello-popover {
          background-color: #282e33 !important;
          border: 1px solid #3d444d !important;
          color: #fff;
        }
        .trello-popover .popover-header {
          background-color: #282e33;
          border-bottom: 1px solid #3d444d;
          color: #9fadbc;
          font-size: 0.875rem;
        }
        .trello-popover .popover-body { background-color: #282e33; color: #9fadbc; font-size: 0.875rem; }
        /* Apps popover */
        .apps-dropdown {
          background-color: #282e33;
          border: 1px solid #3d444d;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.5);
          min-width: 220px;
        }
        .cb-popover {
          position: absolute;
          top: calc(100% + 8px);
          background-color: #282e33;
          border: 1px solid #3d444d;
          border-radius: 8px;
          z-index: 500;
          box-shadow: 0 8px 24px rgba(0,0,0,0.5);
          color: #fff;
        }
        .cb-popover-item {
          padding: 8px 16px;
          font-size: 0.875rem;
          color: #9fadbc;
          cursor: pointer;
          transition: background 0.1s;
        }
        .cb-popover-item:hover { background-color: #333c44; color: #fff; }
        .cb-avatar {
          width: 30px; height: 30px;
          background-color: #1AA7EC;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 0.75rem; color: #fff;
          cursor: pointer;
        }
        /* Apps grid */
        .apps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; padding: 8px; }
        .app-item {
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          padding: 8px 4px; border-radius: 6px; cursor: pointer;
          font-size: 0.7rem; color: #9fadbc; transition: background 0.1s;
        }
        .app-item:hover { background-color: #333c44; color: #fff; }
        .app-dot { width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; }
        .custom-board-header {
          background-color: ${colors.boardHeader};
          backdrop-filter: blur(4px);
        }

        /* ── KANBAN ── */
        .kanban-list { width: 270px; min-width: 270px; border-radius: 4px; }
        .kanban-scroll-container {
          overflow-x: auto; display: flex;
          padding: 16px; gap: 16px; align-items: flex-start;
        }
        .bottom-pill-nav { background-color: ${colors.cardBg}; border-radius: 50px; }
      `}</style>

      <div className="board-wrapper">
        {/* ══ NAVBAR ══ */}
        <Navbar
          variant="dark"
          className="trello-nav border-bottom border-secondary px-3 d-flex justify-content-between"
        >
          {/* LEFT */}
          <div className="d-flex align-items-center gap-1">
            <Button
              variant="link"
              ref={target}
              onClick={() => setShowAppsOverlay(!showAppsOverlay)}
              className="p-0 me-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="26px"
                viewBox="0 -960 960 960"
                width="26px"
                fill="#f1f1f1"
              >
                <path d="M336-552H216q-33 0-52.5-19.5T144-624v-120q0-33 19.5-52.5T216-816h120q33 0 52.5 19.5T408-744v120q0 33-19.5 52.5T336-552Zm-120-72h120v-120H216v120Zm120 480H216q-33 0-52.5-19.5T144-216v-120q0-33 19.5-52.5T216-408h120q33 0 52.5 19.5T408-336v120q0 33-19.5 52.5T336-144Zm-120-72h120v-120H216v120Zm528-336H624q-33 0-52.5-19.5T552-624v-120q0-33 19.5-52.5T624-816h120q33 0 52.5 19.5T816-744v120q0 33-19.5 52.5T744-552Zm-120-72h120v-120H624v120Zm120 480H624q-33 0-52.5-19.5T552-216v-120q0-33 19.5-52.5T624-408h120q33 0 52.5 19.5T816-336v120q0 33-19.5 52.5T744-144Zm-120-72h120v-120H624v120ZM336-624Zm0 288Zm288-288Zm0 288Z" />
              </svg>
            </Button>

            <div
              className="nav-icon-link d-flex align-items-center justify-content-center"
              style={{ cursor: "pointer" }}
            >
              <i
                className="bi bi-columns-gap"
                style={{ fontSize: "18px", color: "#1d2125" }}
              ></i>
            </div>
          </div>

          {/* CENTER — Search + Create */}
          <div className="d-flex align-items-center gap-2 flex-grow-1 justify-content-center">
            <Form.Group
              className="mb-0 custom-search"
              style={{ maxWidth: "865px", width: "100%" }}
            >
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    fill="#9ea3ac"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85zm-5.242.656a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
                  </svg>
                </span>
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="bg-dark text-light border-secondary"
                />
              </div>
            </Form.Group>

            {/* DIRECT CREATE BUTTON */}
            <Button
              variant="primary"
              size="sm"
              className="fw-bold px-3 shadow-none border-0"
              onClick={handleShowModal}
            >
              Create
            </Button>
          </div>

          {/* RIGHT — Notifications + Avatar */}
          <Nav className="ms-0 align-items-center gap-3">
            <OverlayTrigger
              trigger="click"
              placement="bottom"
              overlay={notificationPopover}
              rootClose
            >
              <Button variant="link" className="p-0 text-light">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="25px"
                  viewBox="0 -960 960 960"
                  width="25px"
                  fill="#f1f1f1"
                >
                  <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
                </svg>
              </Button>
            </OverlayTrigger>

            <OverlayTrigger
              trigger="click"
              placement="bottom"
              overlay={accountPopover}
              rootClose
            >
              <div
                className="avatar-circle bg-info"
                style={{ cursor: "pointer" }}
              >
                U
              </div>
            </OverlayTrigger>
          </Nav>
        </Navbar>

        {/* ══ BOARD SUB-HEADER ══ */}
        <div className="custom-board-header d-flex justify-content-between align-items-center px-3 py-2">
          <div className="d-flex align-items-center gap-2">
            <h6 className="mb-0 fw-bold" style={{ fontSize: "15px" }}>
              My board
            </h6>
            <button className="btn btn-sm p-1 border-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
                fill="white"
              >
                <path d="M160-200q-33 0-56.5-23.5T80-280v-400q0-33 23.5-56.5T160-760h640q33 0 56.5 23.5T880-680v400q0 33-23.5 56.5T800-200H160Zm0-80h200v-400H160v400Zm280 0h200v-400H440v400Zm280 0h80v-400h-80v400Z" />
              </svg>
            </button>
          </div>

          <div className="d-flex align-items-center gap-2 position-relative">
            {/* Members button */}
            <button
              className="btn btn-sm p-1 border-0 cb-nav-btn"
              onClick={() =>
                setActiveMenu(activeMenu === "profile" ? null : "profile")
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
                fill="white"
              >
                <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z" />
              </svg>
            </button>

            {/* Filter button */}
            <button
              className="btn btn-sm p-1 border-0 cb-nav-btn"
              onClick={() =>
                setActiveMenu(activeMenu === "filter" ? null : "filter")
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
                fill="white"
              >
                <path d="M440-160q-17 0-28.5-11.5T400-200v-240L161-745q-14-17-4-36t31-19h584q21 0 31 19t-4 36L560-440v240q0 17-11.5 28.5T520-160h-80Z" />
              </svg>
            </button>

            {/* Visibility button */}
            <button
              className="btn btn-sm p-1 border-0 cb-nav-btn"
              onClick={() =>
                setActiveMenu(activeMenu === "auto" ? null : "auto")
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
                fill="white"
              >
                <path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113Z" />
              </svg>
            </button>

            {/* Share button */}
            <button
              className="btn btn-primary btn-sm px-3 d-flex align-items-center gap-1"
              style={{ fontSize: "13px" }}
              onClick={() => setIsShareOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16px"
                viewBox="0 -960 960 960"
                width="16px"
                fill="white"
              >
                <path d="M720-80q-50 0-85-35t-35-85q0-7 1-14.5t3-13.5L322-392q-17 15-38 23.5t-44 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q23 0 44 8.5t38 23.5l282-164q-2-6-3-13.5t-1-14.5q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-23 0-44-8.5T638-672L356-508q2 6 3 13.5t1 14.5q0 7-1 14.5t-3 13.5l282 164q17-15 38-23.5t44-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Z" />
              </svg>
              <span>Share</span>
            </button>

            {/* More */}
            <button className="btn btn-sm p-1 border-0 cb-nav-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
                fill="white"
              >
                <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" />
              </svg>
            </button>

            {/* ── DROPDOWN MENUS ── */}

            {activeMenu === "profile" && (
              <div
                className="position-absolute cb-popover"
                style={{ right: 0, top: "calc(100% + 8px)", width: "260px" }}
              >
                <div
                  style={{
                    backgroundColor: "#1d2125",
                    padding: "20px",
                    textAlign: "center",
                    borderRadius: "8px 8px 0 0",
                    borderBottom: "1px solid #3d444d",
                    position: "relative",
                  }}
                >
                  <button
                    className="cb-nav-btn position-absolute"
                    style={{ top: 8, right: 8, padding: "4px" }}
                    onClick={() => setActiveMenu(null)}
                  >
                    ×
                  </button>
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      backgroundColor: "#1AA7EC",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "1.2rem",
                      margin: "0 auto 8px",
                    }}
                  >
                    AW
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                    User123
                  </div>
                  <div style={{ color: "#9fadbc", fontSize: "0.8rem" }}>
                    @user123
                  </div>
                </div>
                <div className="p-1">
                  <div
                    className="cb-popover-item"
                    style={{ borderRadius: "4px" }}
                  >
                    Edit profile info
                  </div>
                  <div
                    style={{ borderTop: "1px solid #3d444d", margin: "4px 0" }}
                  ></div>
                  <div
                    className="cb-popover-item"
                    style={{ borderRadius: "4px" }}
                  >
                    View member's board activity
                  </div>
                </div>
              </div>
            )}

            {activeMenu === "filter" && (
              <div
                className="position-absolute cb-popover"
                style={{
                  right: 0,
                  top: "calc(100% + 8px)",
                  width: "300px",
                  maxHeight: "520px",
                  overflowY: "auto",
                }}
              >
                <div
                  style={{
                    padding: "12px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #3d444d",
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#282e33",
                    zIndex: 1,
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: "0.875rem" }}>
                    Filter
                  </span>
                  <button
                    className="cb-nav-btn"
                    style={{ padding: "2px 6px" }}
                    onClick={() => setActiveMenu(null)}
                  >
                    ×
                  </button>
                </div>
                <div style={{ padding: "12px 16px" }}>
                  {[
                    { label: "Keyword", type: "input" },
                    {
                      label: "Members",
                      options: ["No members", "Cards assigned to me"],
                    },
                    {
                      label: "Card status",
                      options: ["Marked as complete", "Not marked as complete"],
                    },
                    {
                      label: "Due date",
                      options: [
                        "No dates",
                        "Overdue",
                        "Due in the next day",
                        "Due in the next week",
                        "Due in the next month",
                      ],
                    },
                    {
                      label: "Activity",
                      options: [
                        "Active in the last week",
                        "Active in the last two weeks",
                        "Active in the last four weeks",
                      ],
                    },
                  ].map((section) => (
                    <div key={section.label} style={{ marginBottom: "14px" }}>
                      <div
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          color: "#a8b4c1",
                          marginBottom: "6px",
                        }}
                      >
                        {section.label}
                      </div>
                      {section.type === "input" ? (
                        <div
                          className="input-group"
                          style={{
                            backgroundColor: "#1d2125",
                            border: "1px solid #3d444d",
                            borderRadius: 6,
                            marginBottom: "4px",
                          }}
                        >
                          <span
                            className="input-group-text"
                            style={{
                              backgroundColor: "transparent",
                              color: "#6c757d",
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                            >
                              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85zm-5.242.656a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
                            </svg>
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter a keyword..."
                          />
                        </div>
                      ) : (
                        section.options.map((opt) => (
                          <label
                            key={opt}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              marginBottom: "6px",
                              fontSize: "0.85rem",
                              color: "#9fadbc",
                              cursor: "pointer",
                            }}
                          >
                            <input
                              type="checkbox"
                              style={{ accentColor: "#579dff" }}
                            />{" "}
                            {opt}
                          </label>
                        ))
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeMenu === "auto" && (
              <div
                className="position-absolute cb-popover"
                style={{ right: 0, top: "calc(100% + 8px)", width: "280px" }}
              >
                {!isConfirmingPublic ? (
                  <div>
                    <div
                      style={{
                        padding: "12px 16px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid #3d444d",
                      }}
                    >
                      <span style={{ fontWeight: 700, fontSize: "0.875rem" }}>
                        Change visibility
                      </span>
                      <button
                        className="cb-nav-btn"
                        style={{ padding: "2px 6px" }}
                        onClick={() => setActiveMenu(null)}
                      >
                        ×
                      </button>
                    </div>
                    <div style={{ padding: "8px" }}>
                      {[
                        {
                          key: "private",
                          label: "Private",
                          desc: "Only board members can see this board.",
                          icon: "🔒",
                        },
                        {
                          key: "workspace",
                          label: "Workspace",
                          desc: "All members of the Workspace can see and edit this board.",
                          icon: "👥",
                        },
                        {
                          key: "public",
                          label: "Public",
                          desc: "Anyone on the internet can see this board.",
                          icon: "🌐",
                        },
                      ].map((opt) => (
                        <div
                          key={opt.key}
                          onClick={() =>
                            opt.key === "public"
                              ? setIsConfirmingPublic(true)
                              : (setVisibility(opt.key), setActiveMenu(null))
                          }
                          style={{
                            padding: "10px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            backgroundColor:
                              visibility === opt.key
                                ? "rgba(87,157,255,0.12)"
                                : "transparent",
                            marginBottom: "2px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                            }}
                          >
                            <div style={{ display: "flex", gap: "10px" }}>
                              <span>{opt.icon}</span>
                              <div>
                                <div
                                  style={{
                                    fontWeight: 700,
                                    fontSize: "0.875rem",
                                    color:
                                      visibility === opt.key
                                        ? "#579dff"
                                        : "#fff",
                                  }}
                                >
                                  {opt.label}
                                </div>
                                <div
                                  style={{
                                    fontSize: "0.75rem",
                                    color: "#9fadbc",
                                    marginTop: "2px",
                                  }}
                                >
                                  {opt.desc}
                                </div>
                              </div>
                            </div>
                            {visibility === opt.key && (
                              <span
                                style={{ color: "#579dff", fontSize: "0.8rem" }}
                              >
                                ✓
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div
                      style={{
                        padding: "12px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        borderBottom: "1px solid #3d444d",
                      }}
                    >
                      <button
                        className="cb-nav-btn"
                        style={{ padding: "2px 6px" }}
                        onClick={() => setIsConfirmingPublic(false)}
                      >
                        ←
                      </button>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: "0.875rem",
                          flex: 1,
                          textAlign: "center",
                        }}
                      >
                        Make board public?
                      </span>
                      <button
                        className="cb-nav-btn"
                        style={{ padding: "2px 6px" }}
                        onClick={() => setActiveMenu(null)}
                      >
                        ×
                      </button>
                    </div>
                    <div style={{ padding: "16px" }}>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          color: "#9fadbc",
                          lineHeight: "1.5",
                          marginBottom: "16px",
                        }}
                      >
                        Public boards are visible to anyone on the internet and
                        will appear in search engines like Google. Only board
                        members can edit.
                      </p>
                      <button
                        style={{
                          backgroundColor: "#579dff",
                          border: "none",
                          color: "#fff",
                          fontWeight: 700,
                          width: "100%",
                          padding: "8px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                        }}
                        onClick={() => {
                          setVisibility("public");
                          setIsConfirmingPublic(false);
                          setActiveMenu(null);
                        }}
                      >
                        Yes, make board public
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── SHARE MODAL ── */}
            {isShareOpen && (
              <div
                className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                style={{ zIndex: 2000, backgroundColor: "rgba(0,0,0,0.5)" }}
                onClick={() => {
                  setIsShareOpen(false);
                  setShowRoleDropdown(false);
                }}
              >
                <div
                  className="bg-white rounded-3 shadow-lg position-relative"
                  style={{ width: "550px", color: "#172b4d" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowRoleDropdown(false);
                  }}
                >
                  {showCopyToast && (
                    <div
                      className="position-absolute top-0 start-50 translate-middle-x mt-2 bg-success text-white px-3 py-1 rounded shadow-sm d-flex align-items-center gap-2"
                      style={{ zIndex: 2200, fontSize: "13px" }}
                    >
                      ✔️ Link copied to clipboard
                    </div>
                  )}
                  <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                    <h5 className="mb-0 fw-bold" style={{ fontSize: "18px" }}>
                      Share board
                    </h5>
                    <button
                      className="btn border-0 p-0 fs-4 text-muted"
                      onClick={() => setIsShareOpen(false)}
                    >
                      &times;
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="d-flex gap-2 mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Email address or name"
                        style={{ fontSize: "14px" }}
                      />
                      <div className="position-relative">
                        <button
                          className="btn btn-light border d-flex align-items-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowRoleDropdown(!showRoleDropdown);
                          }}
                          style={{ fontSize: "14px", minWidth: "100px" }}
                        >
                          {shareRole}{" "}
                          <i
                            className="bi bi-chevron-down"
                            style={{ fontSize: "10px" }}
                          ></i>
                        </button>
                        {showRoleDropdown && (
                          <div
                            className="position-absolute mt-1 bg-white border shadow-sm rounded-2 py-1"
                            style={{ zIndex: 2100, width: "220px", right: 0 }}
                          >
                            <div
                              className="px-3 py-2"
                              style={{ cursor: "pointer" }}
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
                          </div>
                        )}
                      </div>
                      <button className="btn btn-primary px-3 fw-bold">
                        Share
                      </button>
                    </div>
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
                                  className="text-primary text-decoration-underline"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    setShowCopyToast(true);
                                    setTimeout(
                                      () => setShowCopyToast(false),
                                      2000,
                                    );
                                  }}
                                >
                                  Copy link
                                </span>
                                <span
                                  className="text-danger text-decoration-underline"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => setShowDeleteLinkConfirm(true)}
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
                        <div className="p-3 border rounded text-center">
                          <span className="text-muted small">
                            This board has no share link.{" "}
                          </span>
                          <span
                            className="text-primary text-decoration-underline small fw-bold"
                            style={{ cursor: "pointer" }}
                            onClick={() => setHasLink(true)}
                          >
                            Create link
                          </span>
                        </div>
                      )}
                    </div>
                    <div
                      className="d-flex border-bottom mb-3"
                      style={{ fontSize: "14px" }}
                    >
                      {["members", "requests"].map((tab) => (
                        <div
                          key={tab}
                          className={`pb-2 px-1 me-4 ${activeShareTab === tab ? "border-bottom border-primary border-3 fw-bold text-primary" : "text-muted"}`}
                          style={{ cursor: "pointer" }}
                          onClick={() => setActiveShareTab(tab)}
                        >
                          {tab === "members"
                            ? "Board members"
                            : "Join requests"}
                        </div>
                      ))}
                    </div>
                    <div style={{ minHeight: "80px" }}>
                      {activeShareTab === "members" ? (
                        <div className="d-flex align-items-center justify-content-between py-2">
                          <div className="d-flex align-items-center gap-3">
                            <div
                              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                              style={{
                                width: "36px",
                                height: "36px",
                                fontSize: "13px",
                              }}
                            >
                              AW
                            </div>
                            <div>
                              <div className="fw-bold small">User123</div>
                              <div
                                className="text-muted"
                                style={{ fontSize: "11px" }}
                              >
                                @user123
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
                          <div className="mb-2 fs-2">👤</div>No pending join
                          requests at the moment.
                        </div>
                      )}
                    </div>
                  </div>
                  {showDeleteLinkConfirm && (
                    <div
                      className="position-absolute shadow-lg border rounded-3 p-3 bg-white"
                      style={{
                        width: "300px",
                        top: "120px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 2150,
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold small text-center flex-grow-1">
                          Delete share link?
                        </span>
                        <span
                          style={{ cursor: "pointer", fontSize: "18px" }}
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
                      </p>
                      <button
                        className="btn btn-danger w-100 btn-sm fw-bold py-2"
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
          </div>
        </div>

        {/* ══ KANBAN ══ */}
        <div className="kanban-scroll-container">
          <div
            className="kanban-list p-2"
            style={{ backgroundColor: colors.listYellow }}
          >
            <div className="d-flex justify-content-between align-items-center mb-2 px-1">
              <span className="fw-bold small">Today</span>
              <button
                className="btn btn-sm p-0 border-0"
                style={{ fontSize: "18px", color: "white" }}
              >
                ⋯
              </button>
            </div>
            <div className="bg-white rounded p-2 mb-2 shadow-sm">
              <div className="d-flex align-items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked
                  readOnly
                  style={{
                    accentColor: colors.listGreen,
                    width: "16px",
                    height: "16px",
                  }}
                />
                <span className="small" style={{ color: "#333" }}>
                  Wash
                </span>
              </div>
              <div
                style={{
                  height: "6px",
                  width: "40px",
                  backgroundColor: colors.listGreen,
                  borderRadius: "3px",
                }}
              ></div>
            </div>
            <button
              className="btn btn-sm w-100 text-start p-1 border-0 text-white"
              style={{ fontSize: "13px" }}
            >
              + Add a card
            </button>
          </div>

          <div
            className="kanban-list p-2"
            style={{ backgroundColor: colors.listGreen }}
          >
            <div className="d-flex justify-content-between align-items-center mb-2 px-1">
              <span className="fw-bold small">This week</span>
              <button
                className="btn btn-sm p-0 border-0"
                style={{ fontSize: "18px", color: "white" }}
              >
                ⋯
              </button>
            </div>
            <button
              className="btn btn-sm w-100 text-start p-1 border-0 text-white"
              style={{ fontSize: "13px" }}
            >
              + Add a card
            </button>
          </div>

          <div
            className="kanban-list p-2"
            style={{ backgroundColor: colors.listBlue }}
          >
            <div className="d-flex justify-content-between align-items-center mb-2 px-1">
              <span className="fw-bold small">Later</span>
              <button
                className="btn btn-sm p-0 border-0"
                style={{ fontSize: "18px", color: "white" }}
              >
                ⋯
              </button>
            </div>
            <button
              className="btn btn-sm w-100 text-start p-1 border-0 text-white"
              style={{ fontSize: "13px" }}
            >
              + Add a card
            </button>
          </div>

          <button
            className="kanban-list p-3 text-center border-0"
            style={{
              backgroundColor: colors.listGrey,
              cursor: "pointer",
              opacity: 0.8,
            }}
          >
            <span className="fw-bold small">+ Add another list</span>
          </button>
        </div>

        {/* ══ BOTTOM NAV ══ */}
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
                <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Z" />
              </svg>
              <span className="small">Switch board</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardBoards;
