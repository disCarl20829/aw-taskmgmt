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
    <Popover id="popover-notifications" className="custom-popover">
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
    <Popover id="popover-account" className="custom-popover account-width">
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
    <div className="app-container">
      <Navbar
        variant="dark"
        className="app-nav border-bottom border-secondary px-3 d-flex justify-content-between"
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
              style={{ fontSize: "18px", color: "#000000" }}
            ></i>
          </NavLink>
        </div>

        <div className="d-flex align-items-center gap-2 flex-grow-1 justify-content-center">
          <Form.Group
            className="mb-0 custom-search"
            style={{ maxWidth: "865px", width: "100%" }}
          >
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
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

      <div className="main-wrapper d-flex">
        <div className="sidebar p-3 border-end border-secondary">
          <Nav className="flex-column mb-4">
            <Nav.Link className="sidebar-link active-link text-light">
              Boards
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/home"
              className="sidebar-link text-secondary"
            >
              Home
            </Nav.Link>
          </Nav>
          <div className="sidebar-label text-secondary small fw-bold mb-2">
            Workspaces
          </div>
          <Nav className="flex-column">
            <Nav.Link className="sidebar-link d-flex align-items-center gap-2 text-light">
              <div className="workspace-icon bg-warning text-dark">A</div>
              Animate Workspace
            </Nav.Link>

            <div className="d-flex flex-column gap-1 ps-4">
              <Nav.Link className="sidebar-link text-secondary py-1">
                <i className="bi bi-kanban me-2"></i>
                Boards
              </Nav.Link>

              <Nav.Link className="sidebar-link text-secondary py-1">
                <i className="bi bi-people me-2"></i>
                Members
              </Nav.Link>

              <Nav.Link className="sidebar-link text-secondary py-1">
                <i className="bi bi-gear me-2"></i>
                Settings
              </Nav.Link>
            </div>
          </Nav>
        </div>

        <Container fluid className="content-area p-4">
          <section className="mb-5">
            <h6 className="text-secondary mb-3">Recently viewed</h6>
            <div className="board-tile gradient-purple">
              <span className="fw-bold">My board</span>
            </div>
          </section>

          <section>
            <div className="d-flex align-items-center mb-4">
              <div className="workspace-icon-lg bg-warning text-dark me-3">
                A
              </div>
              <h5 className="section-title mb-0 text-light">
                Animate Workspace
              </h5>
              <div className="ms-auto d-flex gap-2">
                <Button variant="secondary" size="sm">
                  Boards
                </Button>
                <Button variant="secondary" size="sm">
                  Members
                </Button>
                <Button variant="secondary" size="sm">
                  Settings
                </Button>
              </div>
            </div>

            <Row className="g-3">
              <Col xs="auto">
                <div className="board-tile gradient-purple">
                  <span className="fw-bold">My board</span>
                </div>
              </Col>
              <Col xs="auto">
                <div
                  className="board-tile create-new"
                  onClick={handleShowModal}
                >
                  Create new board
                </div>
              </Col>
            </Row>

            <div className="mt-4">
              <Button
                variant="secondary"
                size="sm"
                className="bg-dark border-secondary text-secondary"
                onClick={handleShowClosedModal}
              >
                View all closed boards
              </Button>
            </div>
          </section>
        </Container>
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
                  ),
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
    </div>
  );
};

export default Dashboard;
