import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Dropdown, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import api from "../config/api";
import BoardTemplate from "../components/BoardTemplate";

const BoardButton = () => {
  const navigate = useNavigate();

  // ─── State ─────────────────────────────────────────────────────────────────
  const [showModal, setShowModal]         = useState(false);
  const [selectedColor, setSelectedColor] = useState("#0079bf");
  const [boardTitle, setBoardTitle]       = useState("");
  const [boards, setBoards]               = useState([]);
  const [searchQuery, setSearchQuery]     = useState("");
  const [visibility, setVisibility]       = useState({
    title: "Public",
    icon: "bi-globe",
    desc: "Anyone on the workspace can see this board. Only board members can edit.",
  });

  // ─── Modal helpers ──────────────────────────────────────────────────────────
  const handleCloseModal = () => {
    setShowModal(false);
    setBoardTitle("");
    setSelectedColor("#0079bf");
    setVisibility({
      title: "Public",
      icon: "bi-globe",
      desc: "Anyone on the workspace can see this board. Only board members can edit.",
    });
  };
  const handleShowModal = () => setShowModal(true);

  // ─── Fetch boards on mount ──────────────────────────────────────────────────
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const res = await api.get("/tasks/boards");
        setBoards(res.data.boards);
      } catch (err) {
        console.error("Failed to fetch boards:", err);
      }
    };
    fetchBoards();
  }, []);

  // ─── Create board ───────────────────────────────────────────────────────────
  const handleCreateBoard = async () => {
    if (!boardTitle.trim()) return;
    try {
      const res = await api.post("/tasks/boards", {
        board_title:      boardTitle,
        board_background: selectedColor,
        board_visibility: visibility.title.toLowerCase(),
      });
      setBoards((prev) => [...prev, res.data.board]);
      handleCloseModal();
      navigate(`/cardboards/${res.data.board.board_id}`, { replace: true });
    } catch (err) {
      console.error("Create board failed:", err);
    }
  };

  // ─── Filter + split by ownership (isOwner: 1 = owner, 0 = shared) ──────────
  const q            = searchQuery.toLowerCase();
  const filtered     = boards.filter((b) => b.board_title.toLowerCase().includes(q));
  const myBoards     = filtered.filter((b) => b.isOwner === 1);
  const sharedBoards = filtered.filter((b) => b.isOwner === 0);

  // ─── Section heading ─────────────────────────────────────────────────────────
  const SectionHeading = ({ icon, label, count }) => (
    <div className="boards-section-heading">
      <i className={`bi ${icon}`}></i>
      <span>{label}</span>
      <span className="boards-count-pill">{count}</span>
    </div>
  );

  return (
    <>
      <style>{`
        /* ── Base ── */
        .bg-dark-main { background-color: #1d2125; }

        /* ── Sidebar ── */
        .sidebar { width: 260px; background-color: #1d2125; flex-shrink: 0; }
        .sidebar-heading { color: #a8b4c1; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
        .sidebar-btn-link {
          background: none; border: none; color: #9fadbc; padding: 6px 12px;
          border-radius: 4px; font-size: 0.9rem; transition: 0.2s;
          width: 100%; text-align: left; display: block; text-decoration: none;
        }
        .sidebar-btn-link:hover  { background-color: #333c44; color: #fff; }
        .sidebar-btn-link.active { background-color: #579dff29; color: #579dff; font-weight: 600; }
        .workspace-icon {
          width: 24px; height: 24px; background: linear-gradient(#e2b203, #ff9f1a);
          color: #1d2125; display: inline-flex; align-items: center; justify-content: center;
          border-radius: 3px; font-weight: bold;
        }

        /* ── Search bar ── */
        .boards-search-group {
          display: flex; align-items: center; height: 31px; border-radius: 6px;
          overflow: hidden; background-color: #282e33; border: 1px solid #444c56; max-width: 300px;
        }
        .boards-search-icon { height: 100%; display: flex; align-items: center; padding: 0 10px; }
        .boards-search-input {
          height: 100%; border: none; background: transparent;
          font-size: 0.85rem; color: #c9d1d9; outline: none; flex: 1; padding-right: 10px;
        }
        .boards-search-input::placeholder { color: #6c757d; }

        /* ── Section headings ── */
        .boards-section-heading {
          display: flex; align-items: center; gap: 8px;
          color: #9fadbc; font-size: 0.78rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 14px;
        }
        .boards-count-pill {
          background: #2e3540; color: #9fadbc; border-radius: 20px;
          padding: 1px 8px; font-size: 0.7rem; font-weight: 600;
        }

        /* ── Divider between sections ── */
        .boards-divider {
          border: none; border-top: 1px solid #2a3140; margin: 26px 0 22px 0;
        }

        /* ── Create new board tile ── */
        .create-tile {
          width: 180px; height: 100px; border-radius: 10px; flex-shrink: 0;
          background-color: #282e33; color: #9fadbc;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.85rem; cursor: pointer; transition: background-color 0.2s, transform 0.2s;
          border: none;
        }
        .create-tile:hover { background-color: #333c44; transform: translateY(-2px); }

        /* ── Visibility dropdown ── */
        .visibility-dropdown .dropdown-toggle {
          width: 100%; text-align: left; display: flex;
          justify-content: space-between; align-items: center;
          background-color: #22272b !important; border: 1px solid #444c56 !important;
          padding: 10px 12px; color: #dee2e6 !important;
        }
        .visibility-dropdown .dropdown-menu {
          background-color: #282e33; border: 1px solid #454f59;
          width: 100%; min-width: 300px; padding: 8px 0;
          box-shadow: 0 12px 24px rgba(0,0,0,0.5);
        }
        .visibility-item {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 12px 16px; color: #b6c2cf; white-space: normal; cursor: pointer;
        }
        .visibility-item:hover { background-color: #333c44 !important; color: #fff !important; }
        .visibility-text .vis-title { display: block; font-weight: 600; font-size: 0.95rem; color: #deebff; margin-bottom: 2px; }
        .visibility-text .vis-desc  { display: block; font-size: 0.8rem; color: #9fadbc; line-height: 1.4; }

        /* ── Modal ── */
        .create-board-modal                { background-color: #282e33 !important; border: 1px solid #454f59; }
        .create-board-modal .modal-header  { background-color: #282e33; border-bottom: 1px solid #454f59; }
        .create-board-modal .modal-body    { background-color: #282e33; }
      `}</style>

      <div className="bg-dark-main text-light d-flex p-0" style={{ height: "100vh", overflow: "hidden" }}>

        {/* ── Sidebar ── */}
        <nav className="sidebar p-3 border-end border-secondary border-opacity-25">
          <section className="mb-4">
            <h6 className="sidebar-heading px-2">Personal Settings</h6>
            <div className="d-flex flex-column gap-1 mt-3">
              <Link to="/activity"    className="sidebar-btn-link"><i className="bi bi-list-task me-2"></i>Activity</Link>
              <Link to="/cards"       className="sidebar-btn-link"><i className="bi bi-card-text me-2"></i>Card</Link>
              <Link to="/settingpage" className="sidebar-btn-link"><i className="bi bi-gear me-2"></i>Settings</Link>
            </div>
          </section>

          <section>
            <h6 className="sidebar-heading px-2">Workspaces</h6>
            <div className="d-flex align-items-center mt-3 mb-2 w-100 text-start px-2">
              <span className="workspace-icon me-2">A</span>
              <span className="fw-bold" style={{ color: "#9fadbc" }}>Animate Workspace</span>
            </div>
            <div className="d-flex flex-column gap-1 ps-4">
              <Link to="/boards"   className="sidebar-btn-link active"><i className="bi bi-kanban me-2"></i>Boards</Link>
              <Link to="/members"  className="sidebar-btn-link"><i className="bi bi-people me-2"></i>Members</Link>
              <Link to="/settings" className="sidebar-btn-link"><i className="bi bi-gear me-2"></i>Settings</Link>
            </div>
          </section>
        </nav>

        {/* ── Right column ── */}
        <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>

          {/* Top-right close button */}
          <div style={{ flexShrink: 0, display: "flex", justifyContent: "flex-end", padding: "12px 16px", backgroundColor: "#1d2125" }}>
            <button style={{ width: "32px", height: "32px", backgroundColor: "#282e33", border: "none", color: "#9fadbc", padding: 0, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <i className="bi bi-x-lg" style={{ fontSize: "14px", lineHeight: 1 }}></i>
            </button>
          </div>

          {/* Scrollable main area */}
          <main style={{ flexGrow: 1, overflowY: "auto", padding: "0 24px 24px 24px" }}>

            {/* Header row */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0" style={{ fontSize: "1.1rem" }}>Boards</h5>

              {/* Search bar */}
              <div className="boards-search-group">
                <div className="boards-search-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#9ea3ac" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85zm-5.242.656a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
                  </svg>
                </div>
                <input
                  type="search"
                  className="boards-search-input"
                  placeholder="Search boards"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* ══ YOUR BOARDS ══ */}
            <section>
              <SectionHeading icon="bi-person-fill" label="Your Boards" count={myBoards.length} />
              <Row className="g-2">
                {/* Create new board tile — always first */}
                <Col xs="auto">
                  <button className="create-tile" onClick={handleShowModal}>
                    + Create new board
                  </button>
                </Col>
                {/* Board tiles via BoardTemplate */}
                <BoardTemplate boards={myBoards} />
              </Row>
            </section>

            {/* ══ DIVIDER — only when shared boards exist ══ */}
            {sharedBoards.length > 0 && <hr className="boards-divider" />}

            {/* ══ SHARED WITH YOU ══ */}
            {sharedBoards.length > 0 && (
              <section>
                <SectionHeading icon="bi-people-fill" label="Shared with You" count={sharedBoards.length} />
                <Row className="g-2">
                  <BoardTemplate boards={sharedBoards} />
                </Row>
              </section>
            )}

          </main>
        </div>
      </div>

      {/* ══ Create Board Modal ══ */}
      <Modal show={showModal} onHide={handleCloseModal} centered contentClassName="create-board-modal">
        <Modal.Header closeButton closeVariant="white" className="border-0 pb-2">
          <Modal.Title className="fs-6 w-100 text-center text-light">Create board</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">

          {/* Color preview banner */}
          <div
            className="position-relative mb-4 overflow-hidden"
            style={{
              backgroundColor: selectedColor, minHeight: "120px", borderRadius: "8px",
              backgroundImage: `linear-gradient(135deg, ${selectedColor} 0%, ${selectedColor}dd 100%)`,
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)", transition: "all 0.3s ease",
            }}
          >
            <div className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="rgba(255,255,255,0.3)" viewBox="0 0 16 16">
                <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5z" />
              </svg>
            </div>
          </div>

          <Form>
            {/* Background */}
            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold text-light mb-2">Background</Form.Label>
              <div className="d-flex gap-2 flex-wrap align-items-center mb-3">
                {[
                  { color: "#0079bf" }, { color: "#d29034" }, { color: "#519839" }, { color: "#b04632" },
                  { color: "#89609e" }, { color: "#cd5a91" }, { color: "#00aacc" }, { color: "#ff6b6b" },
                ].map(({ color }) => (
                  <div key={color} className="position-relative" style={{ width: "48px" }}>
                    <div
                      style={{
                        backgroundColor: color, width: "48px", height: "36px", borderRadius: "6px", cursor: "pointer",
                        border: selectedColor === color ? "3px solid white" : "2px solid rgba(255,255,255,0.1)",
                        transform: selectedColor === color ? "scale(1.1)" : "scale(1)",
                        transition: "all 0.2s ease",
                        boxShadow: selectedColor === color ? "0 4px 12px rgba(0,0,0,0.4)" : "0 2px 4px rgba(0,0,0,0.2)",
                      }}
                      onClick={() => setSelectedColor(color)}
                    >
                      {selectedColor === color && (
                        <div className="position-absolute top-50 start-50 translate-middle">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" viewBox="0 0 16 16">
                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Custom color picker */}
                <div className="position-relative">
                  <label
                    htmlFor="customColor"
                    style={{
                      width: "48px", height: "36px", borderRadius: "6px", cursor: "pointer", display: "block",
                      border: "2px solid rgba(255,255,255,0.2)", overflow: "hidden", position: "relative",
                      background: "linear-gradient(135deg, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                  >
                    <div className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 16 16">
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                      </svg>
                    </div>
                  </label>
                  <input type="color" id="customColor" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} />
                </div>
              </div>

              {/* Selected color display */}
              <div className="d-flex align-items-center gap-2 p-2 rounded" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ width: "24px", height: "24px", backgroundColor: selectedColor, borderRadius: "4px", border: "2px solid rgba(255,255,255,0.2)" }}></div>
                <span className="text-light small">Selected: <span className="text-secondary">{selectedColor.toUpperCase()}</span></span>
              </div>
            </Form.Group>

            {/* Board title */}
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-light">Board title *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter board title..."
                value={boardTitle}
                onChange={(e) => setBoardTitle(e.target.value)}
                className="bg-dark text-light border-secondary"
                style={{ fontSize: "14px", padding: "10px 12px" }}
              />
              <Form.Text className="text-muted small">👆 Board title is required</Form.Text>
            </Form.Group>

            {/* Visibility */}
            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold text-light">Visibility</Form.Label>
              <Dropdown className="visibility-dropdown">
                <Dropdown.Toggle variant="dark" id="dropdown-visibility">
                  <span><i className={`bi ${visibility.icon} me-2`}></i>{visibility.title}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as="div" className="visibility-item" onClick={() => setVisibility({ title: "Private", icon: "bi-lock", desc: "Board members and Workspace admin can see and edit this board." })}>
                    <i className="bi bi-lock fs-5 mt-1"></i>
                    <div className="visibility-text">
                      <span className="vis-title">Private</span>
                      <span className="vis-desc">Board members and Workspace admin can see and edit this board.</span>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item as="div" className="visibility-item" onClick={() => setVisibility({ title: "Workspace", icon: "bi-people", desc: "All members of the Workspace can see and edit this board." })}>
                    <i className="bi bi-people fs-5 mt-1"></i>
                    <div className="visibility-text">
                      <span className="vis-title">Workspace</span>
                      <span className="vis-desc">All members of the Workspace can see and edit this board.</span>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item as="div" className="visibility-item" onClick={() => setVisibility({ title: "Public", icon: "bi-globe", desc: "Anyone on the workspace can see this board. Only board members can edit." })}>
                    <i className="bi bi-globe fs-5 mt-1"></i>
                    <div className="visibility-text">
                      <span className="vis-title">Public</span>
                      <span className="vis-desc">Anyone on the workspace can see this board. Only board members can edit.</span>
                    </div>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>

            <Button
              onClick={handleCreateBoard}
              variant="primary"
              className="w-100 fw-bold py-2"
              style={{ fontSize: "14px", borderRadius: "6px", transition: "all 0.2s ease" }}
              disabled={!boardTitle.trim()}
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