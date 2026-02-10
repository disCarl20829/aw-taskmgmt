import React, { useState, useRef, useEffect } from "react";
import {
  Navbar,
  Nav,
  Button,
  Form,
  OverlayTrigger,
  Popover,
  ListGroup,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink, Link } from "react-router-dom";

const BoardButton = () => {
  const [showCollections, setShowCollections] = useState(false);
  const collectionsRef = useRef(null);

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
          <ListGroup.Item action className="bg-dark text-light border-secondary">
            Activity
          </ListGroup.Item>
          <ListGroup.Item action className="bg-dark text-light border-secondary">
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

  // Close overlay when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the overlay is open and the click is NOT inside the overlay, close it
      if (
        collectionsRef.current &&
        !collectionsRef.current.contains(event.target)
      ) {
        setShowCollections(false);
      }
    };

    if (showCollections) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCollections]);

  return (
    <>
      <style>{`
        .bg-dark-main { background-color: #1d2125; }
        
        .sidebar-btn-link:hover {
          background-color: #333c44 !important;
          color: #fff !important;
        }
      `}</style>
      
      <div className="app-container">
        {/* NAVBAR */}
        <Navbar
          variant="dark"
          className="trello-nav border-bottom border-secondary px-3 d-flex justify-content-between"
        >
          <div className="d-flex align-items-center gap-1">
            <Button
              variant="link"
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

            <Button variant="primary" size="sm" className="fw-bold px-3">
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

        <div className="container-fluid vh-100 bg-dark-main text-light d-flex p-0">
      
      <div
        className="container-fluid p-0 d-flex bg-dark-main text-light vh-100 position-relative"
        style={{ backgroundColor: "#1d2125" }}
      >
        {/* Sidebar Section */}
        <nav
          className="sidebar p-3 border-end border-secondary border-opacity-25"
          style={{ width: "260px", backgroundColor: "#1d2125" }}
        >
          <section className="mb-4">
            <h6
              className="sidebar-heading px-2"
              style={{ 
                color: "#a8b4c1",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase"
              }}
            >
              Personal Settings
            </h6>
            <div className="d-flex flex-column gap-1 mt-3">
              <button 
                className="sidebar-btn-link text-start"
                style={{
                  background: "none",
                  border: "none",
                  color: "#9fadbc",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  fontSize: "0.9rem",
                  transition: "0.2s",
                  width: "100%"
                }}
              >
                <i className="bi bi-person me-2"></i> Profile and Visibility
              </button>
              <button 
                className="sidebar-btn-link text-start"
                style={{
                  background: "none",
                  border: "none",
                  color: "#9fadbc",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  fontSize: "0.9rem",
                  transition: "0.2s",
                  width: "100%"
                }}
              >
                <i className="bi bi-activity me-2"></i> Activity
              </button>
              <button 
                className="sidebar-btn-link text-start"
                style={{
                  background: "none",
                  border: "none",
                  color: "#9fadbc",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  fontSize: "0.9rem",
                  transition: "0.2s",
                  width: "100%"
                }}
              >
                <i className="bi bi-card-text me-2"></i> Card
              </button>
              <button 
                className="sidebar-btn-link text-start"
                style={{
                  background: "none",
                  border: "none",
                  color: "#9fadbc",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  fontSize: "0.9rem",
                  transition: "0.2s",
                  width: "100%"
                }}
              >
                <i className="bi bi-gear me-2"></i> Settings
              </button>
            </div>
          </section>

          <section>
            <h6 
              className="sidebar-heading px-2"
              style={{ 
                color: "#a8b4c1",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase"
              }}
            >
              Workspaces
            </h6>
            <button 
              className="sidebar-workspace-btn d-flex align-items-center mt-3 mb-2 w-100 text-start"
              style={{
                background: "none",
                border: "none",
                color: "#9fadbc",
                padding: "4px 8px"
              }}
            >
              <span
                className="workspace-icon me-2 d-inline-flex align-items-center justify-content-center fw-bold rounded"
                style={{ 
                  width: "24px", 
                  height: "24px", 
                  background: "linear-gradient(#e2b203, #ff9f1a)",
                  color: "#1d2125",
                  borderRadius: "3px"
                }}
              >
                A
              </span>
              <span className="fw-bold">Animate Workspace</span>
            </button>
            <div className="d-flex flex-column gap-1 ps-4">
              <button
                className="sidebar-btn-link text-start active"
                style={{
                  background: "#579dff29",
                  border: "none",
                  color: "#579dff",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  transition: "0.2s",
                  width: "100%"
                }}
              >
                <i className="bi bi-kanban me-2"></i> Boards
              </button>
              <button 
                className="sidebar-btn-link text-start"
                style={{
                  background: "none",
                  border: "none",
                  color: "#9fadbc",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  fontSize: "0.9rem",
                  transition: "0.2s",
                  width: "100%"
                }}
              >
                <i className="bi bi-people me-2"></i> Members
              </button>
              <button 
                className="sidebar-btn-link text-start"
                style={{
                  background: "none",
                  border: "none",
                  color: "#9fadbc",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  fontSize: "0.9rem",
                  transition: "0.2s",
                  width: "100%"
                }}
              >
                <i className="bi bi-gear me-2"></i> Settings
              </button>
            </div>
          </section>
        </nav>

        {/* Main Content Area */}
        <main className="flex-grow-1 p-4" style={{ maxWidth: "1200px" }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold">Boards</h4>
          </div>

          <div className="d-flex gap-3 mb-4">
            <div style={{ width: "200px" }}>
              <label
                className="small mb-1"
                style={{ fontSize: "0.7rem", color: "#9fadbc" }}
              >
                Sort by
              </label>
              <select
                className="form-select bg-transparent border-secondary text-light shadow-none"
                style={{ fontSize: "0.85rem" }}
              >
                <option>Most recently active</option>
              </select>
            </div>
            <div style={{ width: "200px" }}>
              <label
                className="small mb-1"
                style={{ fontSize: "0.7rem", color: "#9fadbc" }}
              >
                Filter by
              </label>
              <select
                className="form-select bg-transparent border-secondary text-light shadow-none"
                style={{ fontSize: "0.85rem" }}
              >
                <option>Choose a collection</option>
              </select>
            </div>
          </div>

          <div className="d-flex gap-3 align-items-start">
            {/* Create New Board Card */}
            <div
              className="d-flex align-items-center justify-content-center rounded"
              style={{
                width: "180px",
                height: "100px",
                backgroundColor: "#282e33",
                color: "#9fadbc",
                cursor: "pointer",
                fontSize: "0.85rem",
                borderRadius: "10px",
                transition: "transform 0.2s, background-color 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#333c44"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#282e33"}
            >
              <span>Create new board</span>
            </div>

            {/* Existing Board Card */}
            <div className="position-relative">
              <div
                className="rounded overflow-hidden"
                style={{
                  width: "180px",
                  height: "100px",
                  background: "linear-gradient(180deg, #a855f7 0%, #7c3aed 100%)",
                  borderRadius: "10px",
                  position: "relative",
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s"
                }}
              >
                <div
                  className="position-absolute bottom-0 w-100 fw-bold"
                  style={{ 
                    background: "rgba(0, 0, 0, 0.4)",
                    backdropFilter: "blur(4px)",
                    padding: "10px 12px",
                    color: "#fff",
                    fontSize: "0.9rem"
                  }}
                >
                  My board
                </div>
              </div>

              {/* The Plus Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCollections(!showCollections);
                }}
                className="btn btn-sm position-absolute"
                style={{
                  width: "20px",
                  height: "20px",
                  padding: 0,
                  fontSize: "14px",
                  backgroundColor: "#5a5a5a",
                  border: "none",
                  borderRadius: "3px",
                  bottom: "-10px",
                  right: "8px",
                  color: "#fff"
                }}
              >
                +
              </button>

              {/* Collections Overlay Popover */}
              {showCollections && (
                <div
                  ref={collectionsRef}
                  className="position-absolute shadow-lg text-center"
                  style={{
                    width: "380px",
                    backgroundColor: "#282e33",
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 1000,
                    marginTop: "20px",
                    borderRadius: "10px",
                    padding: "32px"
                  }}
                >
                  <div className="d-flex justify-content-end mb-2" style={{ marginTop: "-8px", marginRight: "-8px" }}>
                    <button
                      onClick={() => setShowCollections(false)}
                      className="btn-close btn-close-white"
                      style={{ fontSize: "12px", opacity: 0.6 }}
                    ></button>
                  </div>
                  <p className="text-uppercase fw-bold mb-3" style={{ fontSize: "0.7rem", color: "#9fadbc", letterSpacing: "0.5px" }}>
                    Collections
                  </p>
                  <h4 className="fw-bold mb-3 text-light" style={{ fontSize: "1.5rem", lineHeight: "1.3" }}>
                    Organize your boards with collections
                  </h4>
                  <p className="mb-4" style={{ fontSize: "0.95rem", color: "#9fadbc", lineHeight: "1.5" }}>
                    Group your boards by department, topic, team, and more.
                  </p>
                  <button
                    className="btn btn-primary w-100 fw-bold"
                    style={{ 
                      backgroundColor: "#579dff", 
                      border: "none",
                      borderRadius: "10px",
                      padding: "12px 20px",
                      fontSize: "0.95rem"
                    }}
                  >
                    Create a collection
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Top Right Close Button */}
        <div className="position-absolute top-0 end-0 m-4" style={{ zIndex: 100 }}>
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#444",
              cursor: "pointer",
            }}
          >
            <i className="bi bi-x-lg text-secondary"></i>
          </div>
        </div>
      </div>
      </div>
    </div>
    </>
  );
};

export default BoardButton;