import React, { useState, useRef } from "react";
import {
  Navbar,
  Nav,
  Button,
  Form,
  OverlayTrigger,
  Popover,
  ListGroup,
  Container,
  Row,
  Col,
  Overlay,
  Modal,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/dashboard.css";
import { NavLink, Link } from "react-router-dom";

const Dashboard = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showClosedModal, setShowClosedModal] = useState(false);
  const target = useRef(null);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleCloseClosedModal = () => setShowClosedModal(false);
  const handleShowClosedModal = () => setShowClosedModal(true);

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

  // Board tile inline styles
  const boardTileStyle = {
    width: "180px",
    height: "100px",
    borderRadius: "10px",
    position: "relative",
    cursor: "pointer",
    overflow: "hidden",
    transition: "transform 0.2s, box-shadow 0.2s",
  };

  const boardTileGradientStyle = {
    ...boardTileStyle,
    background: "linear-gradient(180deg, #a855f7 0%, #7c3aed 100%)",
  };

  const boardTitleOverlayStyle = {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    background: "rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(4px)",
    padding: "10px 12px",
    color: "#fff",
    fontWeight: "600",
    fontSize: "0.9rem",
  };

  const createNewBoardStyle = {
    ...boardTileStyle,
    backgroundColor: "#282e33",
    color: "#9fadbc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.85rem",
  };

  // Workspace action button styles
  const workspaceButtonStyle = {
    backgroundColor: "#282e33",
    border: "1px solid #3d444d",
    color: "#9fadbc",
    fontSize: "0.8rem",
    padding: "6px 14px",
    borderRadius: "4px",
    fontWeight: "500",
    transition: "all 0.2s",
  };

  return (
    <>
      <style>{`
        .bg-dark-main { background-color: #1d2125; }

        .sidebar {
          width: 260px;
          background-color: #1d2125;
        }

        .sidebar-heading {
          color: #a8b4c1;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .sidebar-btn-link {
          background: none;
          border: none;
          color: #9fadbc;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 0.9rem;
          transition: 0.2s;
          width: 100%;
          text-align: left;
        }

        .sidebar-btn-link:hover {
          background-color: #333c44;
          color: #fff;
        }

        .sidebar-btn-link.active {
          background-color: #579dff29;
          color: #579dff;
          font-weight: 600;
        }

        .workspace-icon {
          width: 24px;
          height: 24px;
          background: linear-gradient(#e2b203, #ff9f1a);
          color: #1d2125;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 3px;
          font-weight: bold;
        }

        .workspace-icon-lg {
          width: 36px;
          height: 36px;
          background: linear-gradient(#e2b203, #ff9f1a);
          color: #1d2125;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 5px;
          font-weight: bold;
          font-size: 1.1rem;
        }

        .sidebar-workspace-btn {
          background: none;
          border: none;
          color: #9fadbc;
          padding: 4px 8px;
        }

        .section-heading {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #9fadbc;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .content-area {
          overflow-y: auto;
          max-height: calc(100vh - 60px);
        }

        .board-tile-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
        }

        .create-new-hover:hover {
          background-color: #333c44 !important;
          transform: translateY(-2px);
        }

        .workspace-action-btn {
          background-color: #282e33;
          border: 1px solid #3d444d;
          color: #9fadbc;
          font-size: 0.8rem;
          padding: 6px 14px;
          border-radius: 4px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .workspace-action-btn:hover {
          background-color: #333c44;
          border-color: #4a5159;
          color: #fff;
        }

        .workspace-action-btn:active {
          background-color: #3d444d;
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
          {/* SIDEBAR */}
          <nav className="sidebar p-3 border-end border-secondary border-opacity-25">
            <section className="mb-4">
              <div className="d-flex flex-column gap-1 mt-3">
                <button className="sidebar-btn-link text-start">
                  <i className="bi bi-columns-gap me-2"></i>Boards
                </button>
                <button className="sidebar-btn-link text-start">
                  <i className="bi bi-activity me-2"></i>Home
                </button>
              </div>
            </section>

            <section>
              <h6 className="sidebar-heading px-2">Workspaces</h6>
              <button className="sidebar-workspace-btn d-flex align-items-center mt-3 mb-2 w-100 text-start">
                <span className="workspace-icon me-2">A</span>
                <span className="fw-bold">Animate Workspace</span>
              </button>
              <div className="d-flex flex-column gap-1 ps-4">
                <button className="sidebar-btn-link text-start">
                  <i className="bi bi-kanban me-2"></i> Boards
                </button>
                <button className="sidebar-btn-link text-start">
                  <i className="bi bi-people me-2"></i> Members
                </button>
                <button className="sidebar-btn-link text-start">
                  <i className="bi bi-gear me-2"></i> Settings
                </button>
              </div>
            </section>
          </nav>

          <Container fluid className="content-area p-4" style={{ maxWidth: "1200px" }}>
            {/* Recently Viewed Section */}
            <section className="mb-4">
              <div className="section-heading"style={{ fontSize: "1rem" }}>
                <i className="bi bi-clock-history"></i>
                <span>Recently viewed</span>
              </div>

              <Row className="g-2">
                <Col xs="auto">
                  <div style={boardTileGradientStyle} className="board-tile-hover">
                    <div style={boardTitleOverlayStyle}>My board</div>
                  </div>
                </Col>
              </Row>
            </section>

            {/* Workspace Section */}
            <section>
              <div className="d-flex align-items-center mb-3">
                <div className="workspace-icon-lg me-3">A</div>
                <h5 className="mb-0 text-light fw-bold" style={{ fontSize: "1.1rem" }}>
                  Animate Workspace
                </h5>
                <div className="ms-auto d-flex gap-2">
                  <button className="workspace-action-btn">
                    <i className="bi bi-kanban me-1" style={{ fontSize: "0.75rem" }}></i>
                    Boards
                  </button>
                  <button className="workspace-action-btn">
                    <i className="bi bi-people me-1" style={{ fontSize: "0.75rem" }}></i>
                    Members
                  </button>
                  <button className="workspace-action-btn">
                    <i className="bi bi-gear me-1" style={{ fontSize: "0.75rem" }}></i>
                    Settings
                  </button>
                </div>
              </div>

              <Row className="g-2">
                <Col xs="auto">
                  <div style={boardTileGradientStyle} className="board-tile-hover">
                    <div style={boardTitleOverlayStyle}>My board</div>
                  </div>
                </Col>
                <Col xs="auto">
                  <div
                    style={createNewBoardStyle}
                    className="create-new-hover"
                    onClick={handleShowModal}
                  >
                    Create new board
                  </div>
                </Col>
              </Row>

              <div className="mt-5">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-dark border-secondary text-secondary"
                  style={{ fontSize: "0.8rem" }}
                  onClick={handleShowClosedModal}
                >
                  View all closed boards
                </Button>
              </div>
            </section>
          </Container>
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        contentClassName="create-board-modal"
      >
        <Modal.Header closeButton closeVariant="white" className="border-0">
          <Modal.Title className="fs-6 w-100 text-center text-light">
            Create board
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          <div className="modal-preview-img mb-3">
            <div className="preview-skeleton"></div>
          </div>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-light">
                Background
              </Form.Label>
              <div className="d-flex gap-2 flex-wrap">
                {["#0079bf", "#d29034", "#519839", "#b04632", "#89609e"].map(
                  (color) => (
                    <div
                      key={color}
                      className="color-swatch"
                      style={{ backgroundColor: color }}
                    ></div>
                  )
                )}
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-light">
                Board title *
              </Form.Label>
              <Form.Control
                type="text"
                className="bg-dark text-light border-secondary"
              />
              <Form.Text className="text-muted small">
                Board title is required
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold text-light">
                Visibility
              </Form.Label>
              <Form.Select className="bg-dark text-light border-secondary">
                <option>Workspace</option>
                <option>Private</option>
                <option>Public</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" className="w-100 fw-bold py-2" disabled>
              Create
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal
        show={showClosedModal}
        onHide={handleCloseClosedModal}
        centered
        size="lg"
        contentClassName="closed-boards-modal bg-dark text-light border-secondary"
      >
        <Modal.Header
          closeButton
          closeVariant="white"
          className="border-secondary"
        >
          <Modal.Title className="fs-6 d-flex align-items-center w-100">
            <span className="d-flex align-items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM5 4h6v9H5z" />
              </svg>
              Closed boards
            </span>
            <Form.Select
              size="sm"
              className="ms-3 bg-dark text-light border-secondary w-auto"
            >
              <option>All boards</option>
            </Form.Select>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div
            className="closed-boards-placeholder text-center py-4 rounded"
            style={{ backgroundColor: "#9ea3ac", color: "#1d2125" }}
          >
            No boards have been closed
          </div>
        </Modal.Body>
      </Modal>

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
                variant="primary"
                className="text-start d-flex align-items-center gap-2"
              >
                <i className="bi bi-house-door-fill"></i>
                Home
              </Button>

              <Button
                variant="dark"
                className="text-start d-flex align-items-center gap-2"
              >
                <i className="bi bi-person-badge-fill"></i>
                Admin Panel
              </Button>

              <Button
                variant="dark"
                className="text-start d-flex align-items-center gap-2 border-secondary"
              >
                <i className="bi bi-columns-gap"></i>
                Boards
              </Button>
            </div>
          </div>
        )}
      </Overlay>
    </>
  );
};

export default Dashboard;