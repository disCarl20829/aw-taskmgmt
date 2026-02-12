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
  Dropdown,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/dashboard.css";
import { NavLink, Link } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#0079bf");
  const [visibility, setVisibility] = useState({
    title: "Workspace",
    icon: "bi-people",
    desc: "All members of the Animatewell Workspace can see and edit this board.",
  });
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
              <h6 className="sidebar-heading px-2">Workspaces</h6>
              <div className="d-flex align-items-center mt-3 mb-2 w-100 text-start px-2">
                <span className="workspace-icon me-2">A</span>
                <span className="fw-bold" style={{ color: "#9fadbc" }}>
                  Animate Workspace
                </span>
              </div>
              <div className="d-flex flex-column gap-1 ps-4">
                <Link
                  to="/boards"
                  className="sidebar-btn-link text-start text-decoration-none"
                >
                  <i className="bi bi-kanban me-2"></i> Boards
                </Link>
                <Link
                  to="/members"
                  className="sidebar-btn-link text-start text-decoration-none"
                >
                  <i className="bi bi-people me-2"></i> Members
                </Link>
                <Link
                  to="/settings"
                  className="sidebar-btn-link text-start text-decoration-none"
                >
                  <i className="bi bi-gear me-2"></i> Settings
                </Link>
              </div>
            </section>
          </nav>

          <Container
            fluid
            className="content-area p-4"
            style={{ maxWidth: "1200px" }}
          >
            {/* Recently Viewed Section */}
            <section className="mb-4">
              <div className="section-heading" style={{ fontSize: "1rem" }}>
                <i className="bi bi-clock-history"></i>
                <span>Recently viewed</span>
              </div>

              <Row className="g-2">
                <Col xs="auto">
                  <div
                    style={boardTileGradientStyle}
                    className="board-tile-hover"
                  >
                    <div style={boardTitleOverlayStyle}>My board</div>
                  </div>
                </Col>
              </Row>
            </section>

            {/* Workspace Section */}
            <section>
              <div className="d-flex align-items-center mb-3">
                <div className="workspace-icon-lg me-3">A</div>
                <h5
                  className="mb-0 text-light fw-bold"
                  style={{ fontSize: "1.1rem" }}
                >
                  Animate Workspace
                </h5>
                <div className="ms-auto d-flex gap-2">
                  <button
                    className="workspace-action-btn"
                    onClick={() => navigate("/boardbutton")}
                  >
                    <i
                      className="bi bi-kanban me-1"
                      style={{ fontSize: "0.75rem" }}
                    ></i>
                    Boards
                  </button>
                  <button
                    className="workspace-action-btn"
                    onClick={() => navigate("/members")}
                  >
                    <i
                      className="bi bi-people me-1"
                      style={{ fontSize: "0.75rem" }}
                    ></i>
                    Members
                  </button>
                  <button
                    className="workspace-action-btn"
                    onClick={() => navigate("/settings")}
                  >
                    <i
                      className="bi bi-gear me-1"
                      style={{ fontSize: "0.75rem" }}
                    ></i>
                    Settings
                  </button>
                </div>
              </div>

              <Row className="g-2">
                <Col xs="auto">
                  <div
                    style={boardTileGradientStyle}
                    className="board-tile-hover"
                  >
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
        <Modal.Header
          closeButton
          closeVariant="white"
          className="border-0 pb-2"
        >
          <Modal.Title className="fs-6 w-100 text-center text-light">
            Create board
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          {/* Enhanced Preview with Image Overlay */}
          <div
            className="position-relative mb-4 overflow-hidden"
            style={{
              backgroundColor: selectedColor,
              minHeight: "120px",
              borderRadius: "8px",
              backgroundImage: `linear-gradient(135deg, ${selectedColor} 0%, ${selectedColor}dd 100%)`,
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              transition: "all 0.3s ease",
            }}
          >
            <div className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                fill="rgba(255,255,255,0.3)"
                viewBox="0 0 16 16"
              >
                <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5z" />
              </svg>
            </div>
          </div>

          <Form>
            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold text-light mb-2">
                Background
              </Form.Label>

              {/* Premium Color Grid */}
              <div className="d-flex gap-2 flex-wrap align-items-center mb-3">
                {[
                  { color: "#0079bf", name: "Ocean Blue" },
                  { color: "#d29034", name: "Golden" },
                  { color: "#519839", name: "Forest Green" },
                  { color: "#b04632", name: "Ruby Red" },
                  { color: "#89609e", name: "Royal Purple" },
                  { color: "#cd5a91", name: "Pink Rose" },
                  { color: "#00aacc", name: "Cyan" },
                  { color: "#ff6b6b", name: "Coral" },
                ].map(({ color, name }) => (
                  <div
                    key={color}
                    className="position-relative"
                    style={{ width: "48px" }}
                  >
                    <div
                      className="color-swatch-enhanced"
                      style={{
                        backgroundColor: color,
                        width: "48px",
                        height: "36px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        border:
                          selectedColor === color
                            ? "3px solid white"
                            : "2px solid rgba(255,255,255,0.1)",
                        transform:
                          selectedColor === color ? "scale(1.1)" : "scale(1)",
                        transition: "all 0.2s ease",
                        boxShadow:
                          selectedColor === color
                            ? "0 4px 12px rgba(0,0,0,0.4)"
                            : "0 2px 4px rgba(0,0,0,0.2)",
                      }}
                      onClick={() => setSelectedColor(color)}
                      onMouseEnter={(e) => {
                        if (selectedColor !== color) {
                          e.target.style.transform = "scale(1.05)";
                          e.target.style.boxShadow =
                            "0 3px 8px rgba(0,0,0,0.3)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedColor !== color) {
                          e.target.style.transform = "scale(1)";
                          e.target.style.boxShadow =
                            "0 2px 4px rgba(0,0,0,0.2)";
                        }
                      }}
                    >
                      {selectedColor === color && (
                        <div className="position-absolute top-50 start-50 translate-middle">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            fill="white"
                            viewBox="0 0 16 16"
                          >
                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Enhanced Custom Color Picker */}
                <div className="position-relative">
                  <label
                    htmlFor="customColor"
                    className="d-flex flex-column align-items-center justify-content-center"
                    style={{
                      width: "48px",
                      height: "36px",
                      background: `linear-gradient(135deg, 
                  #ff0000 0%, 
                  #ffff00 17%, 
                  #00ff00 33%, 
                  #00ffff 50%, 
                  #0000ff 67%, 
                  #ff00ff 83%, 
                  #ff0000 100%)`,
                      border: "2px solid rgba(255,255,255,0.2)",
                      borderRadius: "6px",
                      cursor: "pointer",
                      position: "relative",
                      overflow: "hidden",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.boxShadow =
                        "0 3px 8px rgba(0,0,0,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div
                      className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center"
                      style={{
                        backgroundColor: "rgba(0,0,0,0.4)",
                        backdropFilter: "blur(2px)",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="white"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                      </svg>
                    </div>
                  </label>
                  <input
                    type="color"
                    id="customColor"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    style={{
                      position: "absolute",
                      opacity: 0,
                      width: "0",
                      height: "0",
                    }}
                  />
                </div>
              </div>

              {/* Current Color Display */}
              <div
                className="d-flex align-items-center gap-2 p-2 rounded"
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    backgroundColor: selectedColor,
                    borderRadius: "4px",
                    border: "2px solid rgba(255,255,255,0.2)",
                  }}
                ></div>
                <span className="text-light small">
                  Selected:{" "}
                  <span className="text-secondary">
                    {selectedColor.toUpperCase()}
                  </span>
                </span>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-light">
                Board title *
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter board title..."
                className="bg-dark text-light border-secondary"
                style={{
                  fontSize: "14px",
                  padding: "10px 12px",
                }}
              />
              <Form.Text className="text-muted small">
                👆 Board title is required
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold text-light">
                Visibility
              </Form.Label>
              <Dropdown className="visibility-dropdown">
                <Dropdown.Toggle variant="dark" id="dropdown-visibility">
                  <span>
                    <i className={`bi ${visibility.icon} me-2`}></i>
                    {visibility.title}
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {/* Private Option */}
                  <Dropdown.Item
                    as="div"
                    className="visibility-item"
                    onClick={() =>
                      setVisibility({
                        title: "Private",
                        icon: "bi-lock",
                        desc: "Board members and Animatewell Workspace admin can see and edit this board.",
                      })
                    }
                  >
                    <i className="bi bi-lock fs-5 mt-1"></i>
                    <div className="visibility-text">
                      <span className="title">Private</span>
                      <span className="desc">
                        Board members and Animatewell Workspace admin can see
                        and edit this board.
                      </span>
                    </div>
                  </Dropdown.Item>

                  {/* Workspace Option */}
                  <Dropdown.Item
                    as="div"
                    className="visibility-item"
                    onClick={() =>
                      setVisibility({
                        title: "Workspace",
                        icon: "bi-people",
                        desc: "All members of the Animatewell Workspace can see and edit this board.",
                      })
                    }
                  >
                    <i className="bi bi-people fs-5 mt-1"></i>
                    <div className="visibility-text">
                      <span className="title">Workspace</span>
                      <span className="desc">
                        All members of the Animatewell Workspace can see and
                        edit this board.
                      </span>
                    </div>
                  </Dropdown.Item>

                  {/* Public Option */}
                  <Dropdown.Item
                    as="div"
                    className="visibility-item"
                    onClick={() =>
                      setVisibility({
                        title: "Public",
                        icon: "bi-globe",
                        desc: "Anyone on the internet can see this board. Only board members can edit.",
                      })
                    }
                  >
                    <i className="bi bi-globe fs-5 mt-1"></i>
                    <div className="visibility-text">
                      <span className="title">Public</span>
                      <span className="desc">
                        Anyone on the internet can see this board. Only board
                        members can edit.
                      </span>
                    </div>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>

            <Button
              variant="primary"
              className="w-100 fw-bold py-2"
              style={{
                fontSize: "14px",
                borderRadius: "6px",
                transition: "all 0.2s ease",
              }}
              disabled
            >
              Create Board
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Closed Boards Modal */}
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

      {/* Apps Overlay */}
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
                onClick={() => navigate('/home')}
              >
                <i className="bi bi-house-door-fill"></i>
                Home
              </Button>
              <Button
                variant="dark"
                className="text-start d-flex align-items-center gap-2 border-secondary"
              >
                <i className="bi bi-person-badge-fill"></i>
                Admin Panel
              </Button>
              <Button
                variant="dark"
                className="text-start d-flex align-items-center gap-2 border-secondary"
                onClick={() => navigate('/boards')}
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