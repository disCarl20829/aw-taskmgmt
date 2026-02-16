import React, { useState } from "react";
import { Modal, Form, Button, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const BoardButton = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#0079bf");
  const [selectedVisibility, setSelectedVisibility] = useState({
    title: "Workspace",
    icon: "bi-people",
    desc: "All members of the Animatewell Workspace can see and edit this board."
  });

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  return (
    <>
      <style>{`
        .bg-dark-main { background-color: #1d2125; }
        
        /* Sidebar */
        .sidebar { width: 260px; background-color: #1d2125; }
        .sidebar-heading { color: #a8b4c1; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
        .sidebar-btn-link { background: none; border: none; color: #9fadbc; padding: 6px 12px; border-radius: 4px; font-size: 0.9rem; transition: 0.2s; width: 100%; text-align: left; }
        .sidebar-btn-link:hover { background-color: #333c44; color: #fff; }
        .sidebar-btn-link.active { background-color: #579dff29; color: #579dff; font-weight: 600; }
        .workspace-icon { width: 24px; height: 24px; background: linear-gradient(#e2b203, #ff9f1a); color: #1d2125; display: inline-flex; align-items: center; justify-content: center; border-radius: 3px; font-weight: bold; }
        .sidebar-workspace-btn { background: none; border: none; color: #9fadbc; padding: 4px 8px; }
        
        /* Search input */
        .input-group { display: flex; align-items: center; height: 31px; border-radius: 6px; overflow: hidden; }
        .input-group-text { height: 100%; display: flex; align-items: center; justify-content: center; border: none !important; padding: 0 10px; }
        .input-group .form-control { height: 100%; border: none !important; background: transparent; font-size: 0.85rem; box-shadow: none !important; }
        .input-group .form-control::placeholder { color: #6c757d; opacity: 1; }

        /* Custom Visibility Dropdown Styling */
        .visibility-dropdown .dropdown-toggle {
          width: 100%;
          text-align: left;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #22272b !important;
          border: 1px solid #444c56 !important;
          padding: 10px 12px;
          color: #dee2e6 !important;
        }

        .visibility-dropdown .dropdown-menu {
          background-color: #282e33;
          border: 1px solid #454f59;
          width: 100%;
          min-width: 300px;
          padding: 8px 0;
          box-shadow: 0 12px 24px rgba(0,0,0,0.5);
        }

        .visibility-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 16px;
          color: #b6c2cf;
          white-space: normal;
          cursor: pointer;
        }

        .visibility-item:hover {
          background-color: #333c44 !important;
          color: #fff !important;
        }

        .visibility-text .title {
          display: block;
          font-weight: 600;
          font-size: 0.95rem;
          color: #deebff;
          margin-bottom: 2px;
        }

        .visibility-text .desc {
          display: block;
          font-size: 0.8rem;
          color: #9fadbc;
          line-height: 1.4;
        }

        /* Modal styling */
        .create-board-modal {
          background-color: #282e33 !important;
          border: 1px solid #454f59;
        }

        .create-board-modal .modal-header {
          background-color: #282e33;
          border-bottom: 1px solid #454f59;
        }

        .create-board-modal .modal-body {
          background-color: #282e33;
        }
      `}</style>

      <div
        className="bg-dark-main text-light d-flex p-0"
        style={{ height: "100vh", overflow: "hidden" }}
      >
        {/* Sidebar Section */}
        <nav className="sidebar p-3 border-end border-secondary border-opacity-25">
          <section className="mb-4">
            <h6 className="sidebar-heading px-2">
              Personal Settings
            </h6>
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
              <span className="fw-bold" style={{ color: "#9fadbc" }}>
                Animate Workspace
              </span>
            </div>
            <div className="d-flex flex-column gap-1 ps-4">
              <Link to="/boards" className="sidebar-btn-link active text-decoration-none">
                <i className="bi bi-kanban me-2"></i> Boards
              </Link>
              <Link to="/members" className="sidebar-btn-link text-decoration-none">
                <i className="bi bi-people me-2"></i> Members
              </Link>
              <Link to="/settings" className="sidebar-btn-link text-decoration-none">
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
              backgroundColor: "#1d2125",
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
          <main
            style={{
              flexGrow: 1,
              overflowY: "auto",
              padding: "0 24px 24px 24px",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0" style={{ fontSize: "1.1rem" }}>
                Boards
              </h5>
              
              <div className="input-group" style={{ maxWidth: "300px" }}>
                <span
                  className="input-group-text border-secondary"
                  style={{ backgroundColor: "#282e33" }}
                >
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
                <input
                  type="search"
                  className="form-control border-secondary text-light"
                  placeholder="Search boards"
                  style={{ backgroundColor: "#282e33" }}
                />
              </div>
            </div>

            <div className="d-flex gap-3 align-items-start">
            {/* Create New Board Card */}
            <div
              className="d-flex align-items-center justify-content-center"
              onClick={handleShowModal}
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
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#333c44";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#282e33";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <span>Create new board</span>
            </div>

            {/* Existing Board Card */}
            <div className="position-relative" style={{ width: "180px" }}>
              <div
                style={{
                  width: "180px",
                  height: "100px",
                  background: "linear-gradient(180deg, #a855f7 0%, #7c3aed 100%)",
                  borderRadius: "10px",
                  position: "relative",
                  cursor: "pointer",
                  overflow: "hidden",
                  transition: "transform 0.2s, box-shadow 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
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
            </div>
          </div>
          </main>
        </div>
      </div>

      {/* Create Board Modal */}
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
                    <i className={`bi ${selectedVisibility.icon} me-2`}></i>
                    {selectedVisibility.title}
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    as="div"
                    className="visibility-item"
                    onClick={() =>
                      setSelectedVisibility({
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

                  <Dropdown.Item
                    as="div"
                    className="visibility-item"
                    onClick={() =>
                      setSelectedVisibility({
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

                  <Dropdown.Item
                    as="div"
                    className="visibility-item"
                    onClick={() =>
                      setSelectedVisibility({
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
                </Dropdown.Menu>``
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
    </>
  );
};

export default BoardButton;