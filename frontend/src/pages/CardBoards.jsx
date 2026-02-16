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
import { NavLink, Link } from "react-router-dom";

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
  const [showOverlay, setShowOverlay] = useState(false);
  const target = useRef(null);

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

  const handleLogout = () => {
    console.log("Logging out...");
  };

  const notificationPopover = (
    <Popover id="popover-notifications" className="trello-popover">
      <Popover.Header
        as="h3"
        className="d-flex justify-content-between align-items-center"
      >
        Notifications
        <Form.Check
          type="switch"
          id="notif-switch"
          className="custom-switch"
          defaultChecked
        />
      </Popover.Header>
      <Popover.Body className="text-center">
        No unread notification
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
        <ListGroup variant="flush" className="account-list">
          <ListGroup.Item
            action
            as={Link}
            to="/profile"
            className="bg-dark text-light border-secondary"
          >
            Profile and visibility
          </ListGroup.Item>
          <ListGroup.Item
            action
            as={Link}
            to="/activity"
            className="bg-dark text-light border-secondary"
          >
            Activity
          </ListGroup.Item>
          <ListGroup.Item
            action
            as={Link}
            to="/cards"
            className="bg-dark text-light border-secondary"
          >
            Card
          </ListGroup.Item>
          <ListGroup.Item
            action
            as={Link}
            to="/settings"
            className="bg-dark text-light border-secondary"
          >
            Settings
          </ListGroup.Item>
          <ListGroup.Item
            action
            onClick={handleLogout}
            className="bg-dark text-light border-secondary"
          >
            Log out
          </ListGroup.Item>
        </ListGroup>
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      <style>{`
        .board-wrapper {
          background: linear-gradient(135deg, #8b2f7b 0%, #4B0082 100%);
          min-height: 100vh;
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .trello-nav {
          background: linear-gradient(135deg, #22272b 100%);
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .custom-board-header { 
          background: linear-gradient(135deg, #58224f 0%, #3e1a58 100%);
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
        .filter-section-title {
          font-size: 12px;
          font-weight: 600;
          color: #44546f;
          margin-top: 16px;
          margin-bottom: 8px;
        }
        .filter-option {
          padding: 6px 0;
          font-size: 14px;
          color: #172b4d;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .label-bar {
          height: 8px;
          width: 40px;
          border-radius: 3px;
        }
        .visibility-option:hover {
          background-color: #f0f2f5 !important;
        }
        .pointer {
          cursor: pointer;
        }
        .hover-bg-light:hover {
          background-color: #f0f2f5;
        }
        
        /* Dashboard Navbar Styles */
        .custom-board-icon {
          width: 25px;
          height: 25px;
          background-color: #ffcc00;
          border-radius: 5px;
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .custom-board-icon:hover {
          opacity: 0.9;
        }
        .avatar-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
        }
        .apps-dropdown {
          background-color: #282e33;
          border: 1px solid #454f59;
          border-radius: 8px;
          min-width: 300px;
          box-shadow: 0 8px 16px rgba(0,0,0,0.3);
        }
        .trello-popover {
          background-color: #282e33;
          border: 1px solid #454f59;
          color: #dee2e6;
        }
        .trello-popover .popover-header {
          background-color: #22272b;
          border-bottom: 1px solid #454f59;
          color: #dee2e6;
        }
        .trello-popover .popover-body {
          background-color: #282e33;
          color: #dee2e6;
        }
        .account-width {
          min-width: 280px;
        }
        
        /* Custom Search Input Styles */
        .custom-search .input-group {
          display: flex;
          align-items: center;
          height: 31px;
          width: 100%;
          border-radius: 6px;
          transition: all 0.2s ease;
          overflow: hidden;
        }
        .custom-search .input-group-text {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none !important;
          padding: 0 10px;
          background-color: #22272b;
        }
        .custom-search .input-group .form-control {
          height: 100%;
          border: none !important;
          background: transparent;
          font-size: 0.85rem;
          box-shadow: none !important;
          background-color: #22272b;
          color: #dee2e6;
        }
        .custom-search .input-group .form-control::placeholder {
          color: #6c757d;
          opacity: 1;
        }
        .custom-search .input-group .form-control:focus {
          background-color: #22272b;
          border-color: #579dff;
          color: #dee2e6;
          box-shadow: none !important;
        }
      `}</style>

      <div className="board-wrapper">
        {/* --- Top Navbar (Dashboard Style) --- */}
        <Navbar
          variant="dark"
          className="trello-nav border-bottom border-secondary px-3 d-flex justify-content-between"
        >
          <div className="d-flex align-items-center gap-1">
            <Button
              variant="link"
              ref={target}
              onClick={() => setShowOverlay(!showOverlay)}
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

            <NavLink
              to="/boards"
              className="nav-icon-link custom-board-icon d-flex align-items-center justify-content-center"
            >
              <i
                className="bi bi-columns-gap"
                style={{ fontSize: "18px", color: "#1d2125" }}
              ></i>
            </NavLink>
          </div>

          {/* CENTER SECTION: Search + Create Button */}
          <div className="d-flex align-items-center gap-2 flex-grow-1 justify-content-center">
            <Form.Group 
              className="mb-0 custom-search"
              style={{ maxWidth: "865px", width: "100%" }}
              >
              <div className="input-group">
                <span className="input-group-text">
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
                />
              </div>
            </Form.Group>

            {/* DIRECT CREATE BUTTON */}
            <Button
              variant="primary"
              size="sm"
              className="fw-bold px-3 shadow-none border-0"
            >
              Create
            </Button>
          </div>

          {/* RIGHT SECTION: Notifications + Avatar */}
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
                          {shareRole}
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
                            >
                              <div
                                className="text-muted"
                                style={{ fontSize: "11px" }}
                              >
                                Add people with limited permissions.
                              </div>
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
                                      2000
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
                          1
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
                              AW
                            </div>
                            <div>
                              <div className="fw-bold small">Admin User</div>
                              <div
                                className="text-muted"
                                style={{ fontSize: "11px" }}
                              >
                                admin@example.com
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
                  <h6 className="mb-0 fw-bold">Admin User</h6>
                  <div className="text-muted small">@adminuser</div>
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
                      className="form-control form-control-sm mb-1"
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
                    <select className="form-select form-select-sm mt-2 small">
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
                    <select className="form-select form-select-sm w-50 small">
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
                        <span style={{ color: "#ae2a19" }}>🔒</span>
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
                        <span style={{ color: "#172b4d" }}>🏢</span>
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
                        <span style={{ color: "#216e4e" }}>🌐</span>
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
        </div>

        {/* --- Board Content --- */}
        <BoardCards colors={colors} />

        {/* --- Bottom Navigation --- */}
        <div className="position-fixed bottom-0 start-50 translate-middle-x mb-3">
          <div className="d-flex gap-2">
            <button
              className="btn btn-primary btn-sm px-3 py-2 d-flex align-items-center gap-2 shadow"
              style={{ borderRadius: "20px", fontSize: "14px" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="18px"
                viewBox="0 -960 960 960"
                width="18px"
                fill="white"
              >
                <path d="M160-200q-33 0-56.5-23.5T80-280v-400q0-33 23.5-56.5T160-760h640q33 0 56.5 23.5T880-680v400q0 33-23.5 56.5T800-200H160Zm0-80h200v-400H160v400Zm280 0h200v-400H440v400Zm280 0h80v-400h-80v400Z" />
              </svg>
              <span className="fw-bold">Board</span>
            </button>
            <button
              className="btn btn-dark btn-sm px-3 py-2 d-flex align-items-center gap-2 shadow"
              style={{ 
                borderRadius: "20px", 
                fontSize: "14px",
                backgroundColor: "#1d1d1d",
                border: "none"
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="18px"
                viewBox="0 -960 960 960"
                width="18px"
                fill="white"
              >
                <path d="M160-200q-33 0-56.5-23.5T80-280v-400q0-33 23.5-56.5T160-760h640q33 0 56.5 23.5T880-680v400q0 33-23.5 56.5T800-200H160Zm0-80h200v-400H160v400Zm280 0h200v-400H440v400Zm280 0h80v-400h-80v400Z" />
              </svg>
              <span>Switch boards</span>
            </button>
          </div>
        </div>
      </div>

      {/* Apps Overlay Dropdown */}
      <Overlay
        target={target.current}
        show={showOverlay}
        placement="bottom-start"
        rootClose={true}
        onHide={() => setShowOverlay(false)}
      >
        {({ placement, arrowProps, show: _show, popper, ...props }) => (
          <div {...props} className="apps-dropdown p-4 text-light">
            <div className="d-grid gap-2">
              <Button
                variant="dark"
                className="text-start d-flex align-items-center gap-2 border-secondary"
              >
                <i className="bi bi-house-door-fill"></i> Home
              </Button>
              <Button
                variant="dark"
                className="text-start d-flex align-items-center gap-2 border-secondary"
              >
                <i className="bi bi-person-badge-fill"></i> Admin Panel
              </Button>
              <Button
                variant="dark"
                className="text-start d-flex align-items-center gap-2 border-secondary"
              >
                <i className="bi bi-columns-gap"></i> Boards
              </Button>
            </div>
          </div>
        )}
      </Overlay>
    </>
  );
};

export default CardBoards;