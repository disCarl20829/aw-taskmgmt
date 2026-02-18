import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Navbar,
  Nav,
  Button,
  Form,
  OverlayTrigger,
  Popover,
  ListGroup,
  Overlay,
  Dropdown,
  Modal,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink, Link } from "react-router-dom";
import BoardCards from "../components/auth/BoardCards";
import api from "../config/api";

const GRADIENTS = [
  {
    id: "purple",
    bg: "linear-gradient(135deg, #8b2f7b 0%, #4B0082 100%)",
    emoji: "🌈",
  },
  {
    id: "orange",
    bg: "linear-gradient(135deg, #f97316 0%, #ef4444 100%)",
    emoji: "🍑",
  },
  {
    id: "pink",
    bg: "linear-gradient(135deg, #ec4899 0%, #f87171 100%)",
    emoji: "🌸",
  },
  {
    id: "teal",
    bg: "linear-gradient(135deg, #14b8a6 0%, #059669 100%)",
    emoji: "🌍",
  },
  {
    id: "navy",
    bg: "linear-gradient(135deg, #1e3a5f 0%, #2d3748 100%)",
    emoji: "👽",
  },
  {
    id: "rust",
    bg: "linear-gradient(135deg, #7f1d1d 0%, #b45309 100%)",
    emoji: "🧑‍🎨",
  },
  {
    id: "darknavy",
    bg: "linear-gradient(135deg, #0d1b2a 0%, #1a1a2e 100%)",
    emoji: "🫧",
  },
  {
    id: "cyanteal",
    bg: "linear-gradient(135deg, #00b4db 0%, #0083b0 100%)",
    emoji: "❄️",
  },
  {
    id: "royalblue",
    bg: "linear-gradient(135deg, #1a237e 0%, #3949ab 100%)",
    emoji: "🌊",
  },
  {
    id: "purplepink",
    bg: "linear-gradient(135deg, #6a3093 0%, #c05c8a 100%)",
    emoji: "🧙",
  },
];
const SOLID_COLORS = [
  "#2563eb",
  "#d97706",
  "#16a34a",
  "#dc2626",
  "#7c3aed",
  "#db2777",
  "#059669",
  "#0ea5e9",
  "#9ca3af",
];
const LABEL_COLORS = [
  "#4bce97",
  "#f5cd47",
  "#fea362",
  "#f87168",
  "#9f8fef",
  "#579dff",
  "#60c6d2",
  "#94c748",
  "#e774bb",
  "#8590a2",
  "#1f845a",
  "#946f00",
  "#c25100",
  "#ae2e24",
  "#5e4db2",
  "#0055cc",
  "#206a83",
  "#4c6b1f",
  "#943d73",
  "#596773",
  "#cce0ff",
  "#d3f1a7",
  "#ffe2bd",
  "#ffd5d2",
  "#dfd8fd",
  "#baf3db",
  "#f8e6a0",
  "#fedec8",
  "#ffd2cc",
  "#dfe1e6",
];
const DEFAULT_LABELS = [
  { id: 1, title: "", color: "#4bce97" },
  { id: 2, title: "", color: "#946f00" },
  { id: 3, title: "", color: "#c25100" },
  { id: 4, title: "", color: "#ae2e24" },
  { id: 5, title: "", color: "#5e4db2" },
  { id: 6, title: "", color: "#0055cc" },
];
const SAMPLE_ACTIVITIES = [
  {
    id: 1,
    user: "SL",
    name: "Shikaina Lobre",
    action: "added",
    link: "qwer",
    linkSuffix: "to Later",
    date: "Feb 17, 2026, 2:38 PM",
  },
  {
    id: 2,
    user: "SL",
    name: "Shikaina Lobre",
    action: "re-opened this board",
    link: null,
    linkSuffix: "",
    date: "Feb 17, 2026, 1:34 PM",
  },
];

const CardBoards = () => {
  const { board_id } = useParams();
  const navigate = useNavigate();

  // ── Board / User state ──
  const [board, setBoard] = useState(null);
  const [boardLoading, setBoardLoading] = useState(true);
  const [user, setUser] = useState(null);

  // ── Share modal state ──
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [activeShareTab, setActiveShareTab] = useState("members");
  const [showDeleteLinkConfirm, setShowDeleteLinkConfirm] = useState(false);
  const [hasLink, setHasLink] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [shareRole, setShareRole] = useState("Member");
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  // ── Menu / panel state ──
  const [activeMenu, setActiveMenu] = useState(null);
  const [isConfirmingPublic, setIsConfirmingPublic] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  // ── Background state ──
  const [boardBg, setBoardBg] = useState(
    "linear-gradient(135deg, #8b2f7b 0%, #4B0082 100%)",
  );
  const [selectedBgId, setSelectedBgId] = useState("purple");
  const [bgSubPanel, setBgSubPanel] = useState(false);

  // ── Labels state ──
  const [labelsSubPanel, setLabelsSubPanel] = useState(false);
  const [labelView, setLabelView] = useState("list");
  const [labels, setLabels] = useState(DEFAULT_LABELS);
  const [labelSearch, setLabelSearch] = useState("");
  const [editingLabel, setEditingLabel] = useState(null);
  const [labelFormTitle, setLabelFormTitle] = useState("");
  const [labelFormColor, setLabelFormColor] = useState(LABEL_COLORS[0]);

  // ── Activity state ──
  const [activitySubPanel, setActivitySubPanel] = useState(false);
  const [activityTab, setActivityTab] = useState("all");

  // ── Archived state ──
  const [archivedSubPanel, setArchivedSubPanel] = useState(false);
  const [archivedTab, setArchivedTab] = useState("cards");
  const [archivedSearch, setArchivedSearch] = useState("");

  // ── Views dropdown ──
  const [viewsOpen, setViewsOpen] = useState(false);

  // ── Switch Boards panel ──
  const [showSwitchBoards, setShowSwitchBoards] = useState(false);
  const [boardSearch, setBoardSearch] = useState("");
  const [showDotsDropdown, setShowDotsDropdown] = useState(false);

  // ── Create Board modal ──
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [createBoardTitle, setCreateBoardTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState("#0079bf");

  // ── Visibility ──
  const [visibility, setVisibility] = useState({
    title: "Private",
    icon: "bi-lock",
    desc: "Board members and Workspace admin can see and edit this board.",
  });

  const target = useRef(null);

  const MY_BOARDS = [
    {
      id: 1,
      name: "My board",
      bg: "linear-gradient(135deg, #8b2f7b 0%, #ec4899 100%)",
    },
  ];

  // ── API: fetch logged-in user ──
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await api.get("/auth/check");
        setUser(res.data.user);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/signin", { replace: true });
        }
      }
    };
    getUser();
  }, [navigate]);

  // ── API: fetch board details ──
  useEffect(() => {
    const fetchBoard = async () => {
      if (!board_id) {
        setBoardLoading(false);
        return;
      }
      try {
        setBoardLoading(true);
        const res = await api.get(`/tasks/lists/${board_id}`);
        setBoard(res.data.board || res.data.lists);
        if (res.data.board?.board_visibility) {
          const vis = res.data.board.board_visibility;
          setVisibility(
            vis === "public"
              ? {
                  title: "Public",
                  icon: "bi-globe",
                  desc: "Anyone on the internet can see this board.",
                }
              : vis === "workspace"
                ? {
                    title: "Workspace",
                    icon: "bi-building",
                    desc: "All workspace members can see and edit this board.",
                  }
                : {
                    title: "Private",
                    icon: "bi-lock",
                    desc: "Only board members can see this board.",
                  },
          );
        }
        if (res.data.board?.board_background) {
          setBoardBg(res.data.board.board_background);
        }
      } catch (err) {
        console.error("Failed to fetch board:", err);
      } finally {
        setBoardLoading(false);
      }
    };
    fetchBoard();
  }, [board_id]);

  // ── API: update board visibility ──
  const updateBoardVisibility = async (newVisibilityId) => {
    try {
      if (board_id) {
        await api.patch(`/tasks/boards/${board_id}`, {
          board_visibility: newVisibilityId,
        });
      }
      setBoard((prev) =>
        prev ? { ...prev, board_visibility: newVisibilityId } : prev,
      );
    } catch (err) {
      console.error("Failed to update visibility:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/signout");
      navigate("/signin", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // ── Background handlers ──
  const handleSelectBg = (item) => {
    setBoardBg(item.bg);
    setSelectedBgId(item.id);
    setActiveMenu(null);
    setBgSubPanel(false);
  };
  const handleSelectSolid = (color) => {
    setBoardBg(color);
    setSelectedBgId(color);
    setActiveMenu(null);
    setBgSubPanel(false);
  };

  // ── Label handlers ──
  const openCreateLabel = () => {
    setLabelFormTitle("");
    setLabelFormColor(LABEL_COLORS[0]);
    setEditingLabel(null);
    setLabelView("create");
  };
  const openEditLabel = (lbl) => {
    setEditingLabel(lbl);
    setLabelFormTitle(lbl.title);
    setLabelFormColor(lbl.color);
    setLabelView("edit");
  };
  const saveLabel = () => {
    if (labelView === "create") {
      setLabels((prev) => [
        ...prev,
        { id: Date.now(), title: labelFormTitle, color: labelFormColor },
      ]);
    } else {
      setLabels((prev) =>
        prev.map((l) =>
          l.id === editingLabel.id
            ? { ...l, title: labelFormTitle, color: labelFormColor }
            : l,
        ),
      );
    }
    setLabelView("list");
  };
  const deleteLabel = (id) => {
    setLabels((prev) => prev.filter((l) => l.id !== id));
    setLabelView("list");
  };
  const filteredLabels = labels.filter((l) =>
    l.title.toLowerCase().includes(labelSearch.toLowerCase()),
  );

  // ── Sub-panel header component ──
  const SubPanelHeader = ({ title, onBack, onClose }) => (
    <div
      className="d-flex align-items-center px-3 py-2"
      style={{ borderBottom: "1px solid #3d444d" }}
    >
      {onBack ? (
        <button
          className="btn p-0 border-0 d-flex align-items-center"
          style={{ background: "none" }}
          onClick={onBack}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="#9fadbc"
          >
            <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
          </svg>
        </button>
      ) : (
        <div style={{ width: "20px" }} />
      )}
      <span className="small fw-bold text-light text-center flex-grow-1">
        {title}
      </span>
      <button className="menu-close-btn" onClick={onClose}>
        ×
      </button>
    </div>
  );

  // ── Popovers ──
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
          <div className="avatar-circle bg-info">
            {user ? (user.username?.[0]?.toUpperCase() ?? "U") : "U"}
          </div>
          <div>
            <div className="fw-bold text-light">
              {user?.username || "User123"}
            </div>
            <div className="text-secondary small">
              @{user?.username?.toLowerCase() || "user123"}
            </div>
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

  // ── Loading state ──
  if (boardLoading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          minHeight: "100vh",
          backgroundColor: "#1d2125",
          color: "#fff",
        }}
      >
        <div className="spinner-border text-primary me-2" role="status" />
        <span>Loading board...</span>
      </div>
    );
  }

  const boardTitle = board?.board_title || "My board";

  return (
    <>
      <style>{`
        .board-wrapper { background: ${boardBg}; min-height:100vh; height:100vh; overflow:hidden; color:white; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; transition:background 0.4s ease; }
        ::-webkit-scrollbar { width:6px; height:6px; }
        ::-webkit-scrollbar-track { background:#1a1d21; border-radius:3px; }
        ::-webkit-scrollbar-thumb { background:#3d444d; border-radius:3px; }
        ::-webkit-scrollbar-thumb:hover { background:#4a5159; }
        * { scrollbar-width:thin; scrollbar-color:#3d444d #1a1d21; }
        .trello-nav { background:linear-gradient(135deg,#22272b 100%); border-bottom:1px solid rgba(255,255,255,0.1); }
        .custom-board-header { background:rgba(0,0,0,0.25); backdrop-filter:blur(4px); }
        .kanban-list { width:270px; min-width:270px; border-radius:4px; }
        .popover-menu { top:45px; right:0; background-color:#22272b; border-radius:8px; z-index:1000; color:#dee2e6; overflow:hidden; border:1px solid #3d444d; }
        .board-menu-item { display:flex; align-items:center; gap:14px; padding:11px 16px; cursor:pointer; transition:background-color 0.15s ease; }
        .board-menu-item:hover { background-color:#2c3338; }
        .board-menu-item span { font-size:13px; color:#dee2e6; }
        .board-menu-item.danger span { color:#f87171; }
        .board-title-text { font-size:16px; font-weight:700; color:white; white-space:nowrap; letter-spacing:-0.01em; }
        .views-toggle-pill { display:flex; align-items:center; gap:6px; background:rgba(255,255,255,0.18); border:1px solid rgba(255,255,255,0.25); border-radius:8px; padding:5px 10px; cursor:pointer; transition:background 0.15s; color:white; font-size:13px; font-weight:500; user-select:none; }
        .views-toggle-pill:hover { background:rgba(255,255,255,0.28); }
        .views-dropdown-menu { position:absolute; top:calc(100% + 6px); left:0; background:#22272b; color:#dee2e6; border:1px solid #3d444d; border-radius:12px; width:260px; z-index:1100; box-shadow:0 8px 24px rgba(0,0,0,0.4); overflow:hidden; }
        .views-dropdown-header { display:flex; align-items:center; justify-content:space-between; padding:9px 12px; border-bottom:1px solid #3d444d; }
        .views-dropdown-label { font-size:11px; font-weight:600; color:#9fadbc; text-transform:uppercase; letter-spacing:0.05em; }
        .views-dropdown-item { display:flex; align-items:center; gap:10px; padding:9px 14px; font-size:13px; color:#dee2e6; cursor:pointer; transition:background-color 0.15s; }
        .views-dropdown-item:hover { background-color:#2c3338; color:#fff; }
        .menu-close-btn { background:none; border:none; color:#9fadbc; font-size:18px; line-height:1; cursor:pointer; padding:0; display:flex; align-items:center; justify-content:center; width:24px; height:24px; border-radius:4px; transition:background-color 0.15s,color 0.15s; flex-shrink:0; }
        .menu-close-btn:hover { background-color:#3d444d; color:#dee2e6; }
        .bg-picker-header { display:flex; justify-content:space-between; align-items:center; padding:10px 16px; border-bottom:1px solid #3d444d; flex-shrink:0; position:relative; }
        .bg-picker-scroll { max-height:340px; overflow-y:auto; overflow-x:hidden; }
        .bg-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; padding:12px 16px; }
        .bg-tile { height:90px; border-radius:10px; cursor:pointer; position:relative; overflow:hidden; border:2px solid transparent; transition:border-color 0.2s,transform 0.15s; display:flex; align-items:flex-end; padding:8px 10px; }
        .bg-tile:hover { transform:scale(1.03); }
        .bg-tile.selected { border-color:#579dff; }
        .bg-tile .tile-check { position:absolute; top:6px; right:8px; font-size:16px; color:white; font-weight:bold; text-shadow:0 1px 3px rgba(0,0,0,0.6); }
        .bg-tile .tile-emoji { font-size:20px; line-height:1; }
        .solid-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:8px; padding:4px 16px 14px; }
        .solid-swatch { height:42px; border-radius:8px; cursor:pointer; border:2px solid transparent; transition:border-color 0.2s,transform 0.15s; }
        .solid-swatch:hover { transform:scale(1.08); }
        .solid-swatch.selected { border-color:#579dff; }
        .bg-section-label { font-size:11px; font-weight:600; color:#9fadbc; padding:10px 16px 4px; text-transform:uppercase; letter-spacing:0.05em; }
        .labels-search-input { width:100%; padding:8px 12px; font-size:13px; border:1px solid #3d444d; border-radius:6px; outline:none; background-color:#1a1d21; color:#dee2e6; box-sizing:border-box; transition:border-color 0.2s; }
        .labels-search-input:focus { border-color:#579dff; box-shadow:0 0 0 1px #579dff; }
        .labels-search-input::placeholder { color:#6c757d; }
        .label-row { display:flex; align-items:center; gap:10px; padding:5px 12px; cursor:pointer; }
        .label-row:hover { background-color:#2c3338; }
        .label-pill { flex:1; height:32px; border-radius:4px; display:flex; align-items:center; padding:0 10px; font-size:12px; font-weight:500; color:white; cursor:pointer; transition:filter 0.15s; overflow:hidden; white-space:nowrap; }
        .label-pill:hover { filter:brightness(1.1); }
        .label-edit-btn { background:none; border:1px solid transparent; border-radius:6px; padding:4px 7px; color:#9fadbc; cursor:pointer; transition:background-color 0.15s,border-color 0.15s; display:flex; align-items:center; }
        .label-edit-btn:hover { background-color:#3d444d; border-color:#4a5159; color:#dee2e6; }
        .create-label-btn { margin:8px 12px 4px; padding:8px 14px; border-radius:6px; background-color:#2c3338; border:1px solid #3d444d; color:#dee2e6; font-size:13px; font-weight:500; cursor:pointer; width:calc(100% - 24px); transition:background-color 0.15s; text-align:center; }
        .create-label-btn:hover { background-color:#3d444d; }
        .label-preview { height:40px; border-radius:4px; display:flex; align-items:center; padding:0 14px; font-size:13px; font-weight:500; color:white; margin:8px 12px; }
        .label-form-input { width:calc(100% - 24px); margin:0 12px; padding:8px 10px; font-size:13px; border:2px solid #3d444d; border-radius:6px; background-color:#1a1d21; color:#dee2e6; box-sizing:border-box; outline:none; transition:border-color 0.2s; }
        .label-form-input:focus { border-color:#579dff; }
        .label-form-input::placeholder { color:#6c757d; }
        .color-palette-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:6px; padding:6px 12px; }
        .color-swatch-sm { height:28px; border-radius:4px; cursor:pointer; border:2px solid transparent; transition:transform 0.12s,border-color 0.15s; }
        .color-swatch-sm:hover { transform:scale(1.12); }
        .color-swatch-sm.selected { border-color:white; box-shadow:0 0 0 1px #579dff; }
        .remove-color-btn { margin:2px 12px 6px; padding:7px; background:none; border:1px solid #3d444d; border-radius:6px; color:#9fadbc; font-size:12px; cursor:pointer; width:calc(100% - 24px); text-align:center; transition:background-color 0.15s; }
        .remove-color-btn:hover { background-color:#2c3338; color:#dee2e6; }
        .label-action-row { display:flex; gap:8px; padding:8px 12px; }
        .label-save-btn { flex:1; padding:8px; border-radius:6px; background-color:#579dff; border:none; color:white; font-size:13px; font-weight:600; cursor:pointer; transition:background-color 0.15s; }
        .label-save-btn:hover { background-color:#4c8fe8; }
        .label-delete-btn { padding:8px 14px; border-radius:6px; background-color:#2c3338; border:1px solid #3d444d; color:#f87171; font-size:13px; font-weight:500; cursor:pointer; transition:background-color 0.15s; }
        .label-delete-btn:hover { background-color:#3d444d; }
        .activity-tab-btn { flex:1; padding:8px 12px; border-radius:8px; border:none; font-size:14px; font-weight:500; cursor:pointer; transition:background-color 0.15s,color 0.15s; background:none; color:#9fadbc; }
        .activity-tab-btn.active { background-color:#2c4a7c; color:#579dff; }
        .activity-tab-btn:hover:not(.active) { background-color:#2c3338; color:#dee2e6; }
        .activity-item { display:flex; align-items:flex-start; gap:10px; padding:10px 12px; }
        .activity-item:hover { background-color:#2c3338; }
        .activity-avatar { width:32px; height:32px; border-radius:50%; background-color:#e07b3f; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:12px; color:white; flex-shrink:0; margin-top:2px; }
        .activity-text { font-size:13px; color:#dee2e6; line-height:1.4; }
        .activity-link { color:#579dff; text-decoration:underline; cursor:pointer; }
        .activity-date { font-size:11px; color:#9fadbc; margin-top:2px; }
        .archived-search-input { flex:1; padding:8px 12px; font-size:13px; border:1px solid #3d444d; border-radius:6px; outline:none; background-color:#1a1d21; color:#dee2e6; box-sizing:border-box; transition:border-color 0.2s; }
        .archived-search-input:focus { border-color:#579dff; }
        .archived-search-input::placeholder { color:#6c757d; }
        .archived-toggle-btn { padding:8px 14px; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer; border:none; transition:background-color 0.15s; white-space:nowrap; background-color:#2c3338; color:#dee2e6; }
        .archived-toggle-btn:hover { background-color:#3d444d; }
        .archived-empty { margin:8px 12px; padding:20px 16px; background-color:#2c3338; border-radius:6px; text-align:center; font-size:13px; color:#9fadbc; }
        .scrollable-filter { max-height:100%; overflow-y:auto; overflow-x:hidden; scrollbar-width:thin; padding-right:5px; }
        .kanban-scroll-container { overflow-x:auto; display:flex; padding:16px; gap:16px; align-items:flex-start; }
        .filter-section-title { font-size:12px; font-weight:600; color:#9fadbc; margin-top:16px; margin-bottom:8px; }
        .filter-option { padding:6px 0; font-size:14px; color:#dee2e6; display:flex; align-items:center; gap:8px; }
        .label-bar { height:8px; width:40px; border-radius:3px; }
        .visibility-option { cursor:pointer; border:1px solid transparent; border-radius:8px; transition:all 0.2s ease; }
        .visibility-option:hover { background-color:#2a2f35; border-color:#3d444d; }
        .visibility-option.active { background-color:#2c3338; border-color:#4a5159; }
        .custom-board-icon { width:25px; height:25px; background-color:#ffcc00; border-radius:5px; text-decoration:none; transition:opacity 0.2s; }
        .custom-board-icon:hover { opacity:0.9; }
        .avatar-circle { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:14px; }
        .apps-dropdown { background-color:#22272b; border:1px solid #3d444d; border-radius:8px; min-width:300px; max-width:90vw; box-shadow:0 8px 16px rgba(0,0,0,0.3); }
        @media(max-width:576px){ .apps-dropdown { min-width:200px; max-width:calc(100vw - 20px); margin:0 10px; } }
        .trello-popover { background-color:#22272b; border:1px solid #3d444d; color:#dee2e6; }
        .trello-popover .popover-header { background-color:#22272b; border-bottom:1px solid #3d444d; color:#dee2e6; }
        .trello-popover .popover-body { background-color:#22272b; color:#dee2e6; }
        .account-width { min-width:280px; }
        .custom-search .input-group { display:flex; align-items:center; height:31px; width:100%; border-radius:6px; overflow:hidden; }
        .custom-search .input-group-text { height:100%; display:flex; align-items:center; justify-content:center; border:none!important; padding:0 10px; background-color:#22272b; }
        .custom-search .input-group .form-control { height:100%; border:none!important; background:transparent; font-size:0.85rem; box-shadow:none!important; background-color:#22272b; color:#dee2e6; }
        .custom-search .input-group .form-control::placeholder { color:#6c757d; opacity:1; }
        .custom-search .input-group .form-control:focus { background-color:#22272b; border-color:#579dff; color:#dee2e6; box-shadow:none!important; }
        .profile-menu-item { color:#dee2e6; border-radius:6px; }
        .profile-menu-item:hover { background-color:#2c3338; }
        .visibility-description { color:#9fadbc; }
        .filter-menu-responsive { width:320px; max-width:90vw; max-height:85vh; overflow:hidden; display:flex; flex-direction:column; background-color:#22272b; color:#dee2e6; }
        @media(max-width:768px){ .filter-menu-responsive { width:260px; max-width:calc(100vw - 40px); max-height:70vh; } }
        @media(max-width:576px){ .filter-menu-responsive { width:240px; max-width:calc(100vw - 30px); max-height:65vh; } }
        .filter-menu-header { flex-shrink:0; padding:12px 16px; border-bottom:1px solid #3d444d; background-color:#22272b; }
        .filter-menu-content { flex:1; overflow-y:auto; overflow-x:hidden; padding:0 16px; background-color:#22272b; }
        .filter-menu-footer { flex-shrink:0; border-top:1px solid #3d444d; padding:12px 16px; background-color:#22272b; }
        .filter-search-input { width:100%; padding:8px 12px; font-size:14px; border:1px solid #3d444d; border-radius:4px; outline:none; transition:border-color 0.2s; box-sizing:border-box; background-color:#1a1d21; color:#dee2e6; }
        .filter-search-input:focus { border-color:#579dff; box-shadow:0 0 0 1px #579dff; }
        .filter-search-input::placeholder { color:#6c757d; }
        .filter-select { width:100%; padding:6px 10px; font-size:13px; border:1px solid #3d444d; border-radius:4px; background-color:#1a1d21; color:#dee2e6; cursor:pointer; outline:none; box-sizing:border-box; }
        .filter-select:focus { border-color:#579dff; }
        .filter-helper-text { font-size:11px; color:#6c757d; margin-top:4px; margin-bottom:0; }
        .filter-icon { font-size:14px; width:16px; height:16px; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; }
        input[type="checkbox"] { appearance:none; -webkit-appearance:none; width:16px; height:16px; border:2px solid #4a5159; border-radius:3px; background-color:#1a1d21; cursor:pointer; position:relative; flex-shrink:0; transition:all 0.2s ease; }
        input[type="checkbox"]:checked { background-color:#2c3338; border-color:#4a5159; }
        input[type="checkbox"]:checked::after { content:"✓"; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#9fadbc; font-size:12px; font-weight:bold; }
        input[type="checkbox"]:hover { border-color:#6c757d; }
        .visibility-icon { font-size:18px; width:24px; height:24px; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; }
        .share-modal-input { background-color:#2c3338!important; border:1px solid #3d444d!important; color:#dee2e6!important; border-radius:6px; font-size:14px; padding:10px 14px; }
        .share-modal-input:focus { border-color:#579dff!important; box-shadow:0 0 0 1px #579dff!important; outline:none; }
        .share-modal-input::placeholder { color:#6c757d; }
        .share-link-section { background-color:#2c3338; border-radius:8px; padding:14px; display:flex; align-items:center; gap:12px; }
        .share-link-icon { width:36px; height:36px; background-color:#3d444d; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:16px; }
        .share-tab-active { color:#579dff; border-bottom:2px solid #579dff; font-weight:600; }
        .share-tab-inactive { color:#9fadbc; border-bottom:2px solid transparent; }
        .share-tab-inactive:hover { color:#dee2e6; }
        .share-member-avatar { width:38px; height:38px; border-radius:50%; background-color:#e07b3f; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:13px; color:white; flex-shrink:0; }
        .share-admin-btn { background-color:#2c3338; border:1px solid #3d444d; color:#dee2e6; border-radius:6px; font-size:13px; padding:6px 12px; display:flex; align-items:center; gap:6px; cursor:pointer; white-space:nowrap; transition:background-color 0.15s; }
        .share-admin-btn:hover { background-color:#3d444d; }
        .share-divider { border:none; border-top:1px solid #3d444d; margin:0; }
        .share-admin-btn.dropdown-toggle::after { display:none; }
        .dropdown-menu { background-color:#22272b; border:1px solid #3d444d; }
        .dropdown-item { color:#dee2e6; font-size:13px; }
        .dropdown-item:hover { background-color:#2c3338; color:#fff; }
        .switch-boards-backdrop { position:fixed; inset:0; z-index:2999; background:rgba(0,0,0,0.25); backdrop-filter:blur(2px); display:flex; align-items:center; justify-content:center; }
        .switch-boards-panel { width:820px; max-width:calc(100vw - 40px); background-color:#2c2c2c; border-radius:16px; border:1px solid #3d444d; box-shadow:0 16px 48px rgba(0,0,0,0.6); padding:24px; position:relative; }
        .switch-boards-search { width:100%; padding:10px 14px 10px 38px; font-size:14px; border:1px solid #4a4a4a; border-radius:8px; outline:none; background-color:#1a1a1a; color:#dee2e6; box-sizing:border-box; transition:border-color 0.2s; }
        .switch-boards-search:focus { border-color:#579dff; }
        .switch-boards-search::placeholder { color:#6c757d; }
        .switch-boards-search-wrap { position:relative; }
        .switch-boards-search-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#6c757d; pointer-events:none; }
        .switch-boards-three-dots { background:none; border:none; color:#9fadbc; cursor:pointer; padding:6px; border-radius:6px; display:flex; flex-direction:column; gap:3px; transition:background 0.15s; }
        .switch-boards-three-dots span { display:block; width:4px; height:4px; background:#9fadbc; border-radius:50%; }
        .switch-boards-three-dots:hover { background:#3d444d; }
        .switch-boards-three-dots:hover span { background:#dee2e6; }
        .workspace-pill { display:inline-flex; align-items:center; gap:6px; padding:5px 12px; border-radius:20px; border:1px solid #579dff; color:#579dff; font-size:13px; font-weight:500; cursor:pointer; background:none; transition:background-color 0.15s; }
        .workspace-pill:hover { background-color:rgba(87,157,255,0.1); }
        .board-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(140px, 1fr)); gap:12px; margin-top:14px; }
        .board-thumb { height:90px; border-radius:10px; cursor:pointer; position:relative; overflow:hidden; border:1px solid rgba(255,255,255,0.08); transition:transform 0.15s,box-shadow 0.15s; }
        .board-thumb:hover { transform:scale(1.03); box-shadow:0 4px 16px rgba(0,0,0,0.4); }
        .board-thumb-label { position:absolute; bottom:0; left:0; right:0; padding:6px 8px; font-size:13px; font-weight:600; color:white; text-shadow:0 1px 3px rgba(0,0,0,0.6); background:linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 100%); }
        .create-board-thumb { height:90px; border-radius:10px; cursor:pointer; background-color:#3a3a3a; border:1px solid #4a4a4a; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:4px; transition:background-color 0.15s; }
        .create-board-thumb:hover { background-color:#444; }
        .create-board-thumb span { font-size:13px; color:#9fadbc; font-weight:500; text-align:center; }
        .bottom-nav-btn { border-radius:20px; font-size:14px; border:none; padding:8px 16px; display:flex; align-items:center; gap:8px; cursor:pointer; transition:background-color 0.2s, color 0.2s; }
        .bottom-nav-btn.board-active { background-color:#0052cc; color:white; }
        .bottom-nav-btn.switch-active { background-color:#0052cc; color:white; }
        .bottom-nav-btn.board-inactive { background-color:#1d1d1d; color:white; }
        .bottom-nav-btn.switch-inactive { background-color:#1d1d1d; color:white; }
        .ws-dots-wrap { position:relative; }
        .ws-dropdown { position:absolute; top:calc(100% + 6px); right:0; width:220px; background:#22272b; border:1px solid #3d444d; border-radius:10px; box-shadow:0 8px 24px rgba(0,0,0,0.5); z-index:3200; overflow:hidden; }
        .ws-dropdown-item { display:flex; align-items:center; gap:10px; padding:9px 14px; font-size:13px; color:#dee2e6; cursor:pointer; transition:background 0.15s; }
        .ws-dropdown-item:hover { background:#2c3338; color:#fff; }
        a.ws-dropdown-item { text-decoration:none; color:#dee2e6; }
        a.ws-dropdown-item:hover { color:#fff; }
        .trello-dark-modal .modal-content { background-color: #2c3338; border: 1px solid #3d444d; }
        .trello-dark-modal .btn-close { filter: invert(1) grayscale(100%) brightness(200%); }
        .trello-dark-modal .form-control:focus, .trello-dark-modal .form-select:focus { background-color: #1a1d21; color: white; border-color: #579dff; }
        .trello-dark-modal { z-index: 9999 !important; }
        .modal-backdrop { z-index: 9998 !important; }
        .visibility-dropdown .dropdown-toggle { width: 100%; text-align: left; display: flex; justify-content: space-between; align-items: center; background-color: #22272b !important; border: 1px solid #444c56 !important; padding: 10px 12px; color: #dee2e6 !important; }
        .visibility-dropdown .dropdown-menu { background-color: #282e33; border: 1px solid #454f59; width: 100%; min-width: 300px; padding: 8px 0; box-shadow: 0 12px 24px rgba(0,0,0,0.5); }
        .visibility-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 16px; color: #b6c2cf; white-space: normal; cursor: pointer; }
        .visibility-item:hover { background-color: #333c44 !important; color: #fff !important; }
        .visibility-text .title { display: block; font-weight: 600; font-size: 0.95rem; color: #deebff; margin-bottom: 2px; }
        .visibility-text .desc { display: block; font-size: 0.8rem; color: #9fadbc; line-height: 1.4; }
      `}</style>

      <div className="board-wrapper">
        {/* ── Top Navbar ── */}
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
                <Form.Control type="search" placeholder="Search" />
              </div>
            </Form.Group>
            <Button
              variant="primary"
              size="sm"
              className="fw-bold px-3 shadow-none border-0"
              onClick={() => {
                setShowCreateBoard(true);
                setCreateBoardTitle("");
                setSelectedColor("#00798F");
              }}
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
                {user ? (user.username?.[0]?.toUpperCase() ?? "U") : "U"}
              </div>
            </OverlayTrigger>
          </Nav>
        </Navbar>

        {/* ── Board Sub-Header ── */}
        <div className="custom-board-header d-flex justify-content-between align-items-center px-3 py-2">
          <div className="d-flex align-items-center gap-2">
            <span className="board-title-text">{boardTitle}</span>

            {/* Views dropdown */}
            <div className="position-relative">
              <div
                className="views-toggle-pill"
                onClick={() => setViewsOpen((o) => !o)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="16px"
                  viewBox="0 -960 960 960"
                  width="16px"
                  fill="white"
                >
                  <path d="M160-200q-33 0-56.5-23.5T80-280v-400q0-33 23.5-56.5T160-760h640q33 0 56.5 23.5T880-680v400q0 33-23.5 56.5T800-200H160Zm0-80h200v-400H160v400Zm280 0h200v-400H440v400Zm280 0h80v-400h-80v400Z" />
                </svg>
                <span>Board</span>
              </div>
              {viewsOpen && (
                <div className="views-dropdown-menu">
                  <div className="views-dropdown-header">
                    <span className="views-dropdown-label">Views</span>
                    <button
                      className="menu-close-btn"
                      onClick={() => setViewsOpen(false)}
                    >
                      ×
                    </button>
                  </div>
                  <div
                    className="views-dropdown-item"
                    onClick={() => setViewsOpen(false)}
                  >
                    <i className="bi bi-columns-gap"></i> Board
                  </div>
                  <div
                    className="views-dropdown-item"
                    onClick={() => setViewsOpen(false)}
                  >
                    <i className="bi bi-table"></i> Table
                  </div>
                  <div
                    className="views-dropdown-item"
                    onClick={() => setViewsOpen(false)}
                  >
                    <i className="bi bi-calendar"></i> Calendar
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 position-relative">
            {/* Profile button */}
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

            {/* Filter button */}
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

            {/* Visibility button */}
            <button
              className="btn btn-sm p-1 border-0"
              onClick={() => {
                setActiveMenu(activeMenu === "auto" ? null : "auto");
                setIsConfirmingPublic(false);
              }}
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

            {/* Share button */}
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

            {/* Three-dots board menu */}
            <button
              className="btn btn-sm p-1 border-0"
              onClick={() => {
                setActiveMenu(activeMenu === "boardMenu" ? null : "boardMenu");
                setBgSubPanel(false);
                setLabelsSubPanel(false);
                setLabelView("list");
                setActivitySubPanel(false);
                setArchivedSubPanel(false);
              }}
            >
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

            {/* ── Profile Menu ── */}
            {activeMenu === "profile" && (
              <div
                className="position-absolute shadow-lg popover-menu"
                style={{ width: "280px" }}
              >
                <div
                  className="d-flex align-items-center px-3 py-2"
                  style={{ borderBottom: "1px solid #3d444d" }}
                >
                  <div style={{ width: "24px" }} />
                  <span className="small fw-bold text-light text-center flex-grow-1">
                    Member
                  </span>
                  <button
                    className="menu-close-btn"
                    onClick={() => setActiveMenu(null)}
                  >
                    ×
                  </button>
                </div>
                <div style={{ padding: "20px", textAlign: "center" }}>
                  <div
                    className="rounded-circle mx-auto mb-2"
                    style={{
                      width: "70px",
                      height: "70px",
                      backgroundColor: "#1a1d21",
                      border: "3px solid #3d444d",
                    }}
                  />
                  <h6 className="mb-0 fw-bold text-light">
                    {user?.username || "Admin User"}
                  </h6>
                  <div className="text-secondary small">
                    @{user?.username?.toLowerCase() || "adminuser"}
                  </div>
                </div>
                <div className="p-2">
                  <div
                    className="px-2 py-2 small profile-menu-item"
                    style={{ cursor: "pointer" }}
                  >
                    Edit profile info
                  </div>
                  <hr
                    className="my-1"
                    style={{ borderColor: "#3d444d", opacity: 0.5 }}
                  />
                  <div
                    className="px-2 py-2 small profile-menu-item"
                    style={{ cursor: "pointer" }}
                  >
                    View member's board activity
                  </div>
                </div>
              </div>
            )}

            {/* ── Filter Menu ── */}
            {activeMenu === "filter" && (
              <div className="position-absolute shadow-lg popover-menu filter-menu-responsive">
                <div className="filter-menu-header">
                  <div className="d-flex align-items-center">
                    <div style={{ width: "24px" }} />
                    <div className="flex-grow-1 text-center small fw-bold text-light">
                      Filter
                    </div>
                    <button
                      className="menu-close-btn"
                      onClick={() => setActiveMenu(null)}
                    >
                      ×
                    </button>
                  </div>
                </div>
                <div className="filter-menu-content">
                  <div className="scrollable-filter">
                    <div className="filter-section-title">Keyword</div>
                    <input
                      type="text"
                      className="filter-search-input"
                      placeholder="Enter a keyword..."
                    />
                    <p className="filter-helper-text">
                      Search cards, members, labels, and more.
                    </p>
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
                      <span style={{ color: "#ff78cb" }}>
                        <i className="bi bi-calendar-x filter-icon"></i> No
                        dates
                      </span>
                    </div>
                    <div className="filter-option">
                      <input type="checkbox" />{" "}
                      <span style={{ color: "#bf86ff" }}>
                        <i className="bi bi-clock-history filter-icon"></i>{" "}
                        Overdue
                      </span>
                    </div>
                    <div className="filter-option">
                      <input type="checkbox" />{" "}
                      <span style={{ color: "#579dff" }}>
                        <i className="bi bi-clock filter-icon"></i> Due in the
                        next day
                      </span>
                    </div>
                    <div className="filter-option">
                      <input type="checkbox" />{" "}
                      <span style={{ color: "#4bce97" }}>
                        <i className="bi bi-calendar-week filter-icon"></i> Due
                        in the next week
                      </span>
                    </div>
                    <div className="filter-option">
                      <input type="checkbox" />{" "}
                      <span style={{ color: "#8590a2" }}>
                        <i className="bi bi-calendar-month filter-icon"></i> Due
                        in the next month
                      </span>
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
                    <select className="filter-select mt-2">
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
                </div>
                <div className="filter-menu-footer">
                  <div className="d-flex justify-content-between align-items-center">
                    <span
                      className="small"
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                        color: "#9fadbc",
                      }}
                    >
                      Match Type
                    </span>
                    <select
                      className="filter-select"
                      style={{
                        width: "auto",
                        minWidth: "120px",
                        fontSize: "13px",
                      }}
                    >
                      <option>Any match</option>
                      <option>Exact match</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ── Visibility Menu ── */}
            {activeMenu === "auto" && (
              <div
                className="position-absolute shadow-lg popover-menu"
                style={{ width: "300px", right: 0 }}
              >
                {!isConfirmingPublic ? (
                  <>
                    <div
                      className="d-flex align-items-center px-3 py-2"
                      style={{ borderBottom: "1px solid #3d444d" }}
                    >
                      <div style={{ width: "24px" }} />
                      <span className="small fw-bold text-light text-center flex-grow-1">
                        Change visibility
                      </span>
                      <button
                        className="menu-close-btn"
                        onClick={() => setActiveMenu(null)}
                      >
                        ×
                      </button>
                    </div>
                    <div className="p-2">
                      {[
                        {
                          id: "private",
                          icon: "lock-fill",
                          color: "#f87171",
                          label: "Private",
                          desc: "Only board members can see this board.",
                        },
                        {
                          id: "workspace",
                          icon: "building",
                          color: "#60a5fa",
                          label: "Workspace",
                          desc: "All members of the Workspace can see and edit this board.",
                        },
                        {
                          id: "public",
                          icon: "globe",
                          color: "#4ade80",
                          label: "Public",
                          desc: "Anyone on the internet can see this board.",
                        },
                      ].map((v) => (
                        <div
                          key={v.id}
                          className={`visibility-option p-2 mb-1 ${visibility.title?.toLowerCase() === v.id ? "active" : ""}`}
                          onClick={() => {
                            if (v.id === "public") {
                              setIsConfirmingPublic(true);
                            } else {
                              updateBoardVisibility(v.id);
                              setVisibility({
                                title: v.label,
                                icon: `bi-${v.icon}`,
                                desc: v.desc,
                              });
                              setActiveMenu(null);
                            }
                          }}
                        >
                          <div className="d-flex gap-2 align-items-start">
                            <i
                              className={`bi bi-${v.icon} visibility-icon`}
                              style={{ color: v.color, marginTop: "2px" }}
                            />
                            <div className="flex-grow-1">
                              <div
                                className="fw-semibold text-light"
                                style={{ fontSize: "13px" }}
                              >
                                {v.label}
                              </div>
                              <div
                                className="visibility-description"
                                style={{ fontSize: "12px" }}
                              >
                                {v.desc}
                              </div>
                            </div>
                            {visibility.title?.toLowerCase() === v.id && (
                              <i
                                className="bi bi-check-lg text-success"
                                style={{ fontSize: "16px", marginTop: "2px" }}
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="d-flex align-items-center px-3 py-2"
                      style={{ borderBottom: "1px solid #3d444d" }}
                    >
                      <button
                        className="btn p-0 border-0 d-flex align-items-center me-1"
                        style={{ background: "none" }}
                        onClick={() => setIsConfirmingPublic(false)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="20px"
                          viewBox="0 -960 960 960"
                          width="20px"
                          fill="#9fadbc"
                        >
                          <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
                        </svg>
                      </button>
                      <span className="small fw-bold text-light text-center flex-grow-1">
                        Make board public?
                      </span>
                      <button
                        className="menu-close-btn"
                        onClick={() => {
                          setActiveMenu(null);
                          setIsConfirmingPublic(false);
                        }}
                      >
                        ×
                      </button>
                    </div>
                    <div className="p-3">
                      <p
                        style={{
                          fontSize: "13px",
                          color: "#9fadbc",
                          lineHeight: "1.4",
                        }}
                      >
                        Public boards are visible to anyone on the internet and
                        will appear in search engines like Google. Only board
                        members can edit.
                      </p>
                      <button
                        className="btn btn-primary w-100 mt-1"
                        style={{ fontSize: "13px", fontWeight: "500" }}
                        onClick={() => {
                          updateBoardVisibility("public");
                          setVisibility({
                            title: "Public",
                            icon: "bi-globe",
                            desc: "Anyone on the internet can see this board.",
                          });
                          setIsConfirmingPublic(false);
                          setActiveMenu(null);
                        }}
                      >
                        Yes, make board public
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── Board Menu Dropdown ── */}
            {activeMenu === "boardMenu" && (
              <div
                className="position-absolute shadow-lg popover-menu"
                style={{ width: "300px", right: 0, top: "45px" }}
              >
                {bgSubPanel ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      maxHeight: "420px",
                    }}
                  >
                    <div className="bg-picker-header">
                      <button
                        className="btn p-0 border-0 d-flex align-items-center"
                        style={{ background: "none" }}
                        onClick={() => setBgSubPanel(false)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="20px"
                          viewBox="0 -960 960 960"
                          width="20px"
                          fill="#9fadbc"
                        >
                          <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
                        </svg>
                      </button>
                      <span
                        className="small fw-bold text-light"
                        style={{
                          position: "absolute",
                          left: "50%",
                          transform: "translateX(-50%)",
                        }}
                      >
                        Colors
                      </span>
                      <button
                        className="menu-close-btn"
                        style={{ marginLeft: "auto" }}
                        onClick={() => {
                          setActiveMenu(null);
                          setBgSubPanel(false);
                        }}
                      >
                        ×
                      </button>
                    </div>
                    <div className="bg-picker-scroll">
                      <div className="bg-grid">
                        {GRADIENTS.map((item) => (
                          <div
                            key={item.id}
                            className={`bg-tile ${selectedBgId === item.id ? "selected" : ""}`}
                            style={{ background: item.bg }}
                            onClick={() => handleSelectBg(item)}
                          >
                            {selectedBgId === item.id && (
                              <span className="tile-check">✓</span>
                            )}
                            <span className="tile-emoji">{item.emoji}</span>
                          </div>
                        ))}
                      </div>
                      <div
                        style={{
                          height: "1px",
                          backgroundColor: "#3d444d",
                          margin: "0 16px",
                        }}
                      />
                      <div className="bg-section-label">Colors</div>
                      <div className="solid-grid">
                        {SOLID_COLORS.map((color) => (
                          <div
                            key={color}
                            className={`solid-swatch ${selectedBgId === color ? "selected" : ""}`}
                            style={{ backgroundColor: color }}
                            onClick={() => handleSelectSolid(color)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : labelsSubPanel ? (
                  <>
                    {labelView === "list" && (
                      <>
                        <SubPanelHeader
                          title="Labels"
                          onBack={() => setLabelsSubPanel(false)}
                          onClose={() => {
                            setActiveMenu(null);
                            setLabelsSubPanel(false);
                          }}
                        />
                        <div style={{ padding: "10px 12px 4px" }}>
                          <input
                            type="text"
                            className="labels-search-input"
                            placeholder="Search labels..."
                            value={labelSearch}
                            onChange={(e) => setLabelSearch(e.target.value)}
                          />
                        </div>
                        <div
                          style={{
                            padding: "6px 0 0",
                            fontSize: "11px",
                            fontWeight: "600",
                            color: "#9fadbc",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            paddingLeft: "12px",
                          }}
                        >
                          Labels
                        </div>
                        <div style={{ maxHeight: "280px", overflowY: "auto" }}>
                          {filteredLabels.map((lbl) => (
                            <div key={lbl.id} className="label-row">
                              <div
                                className="label-pill"
                                style={{ backgroundColor: lbl.color }}
                              >
                                {lbl.title}
                              </div>
                              <button
                                className="label-edit-btn"
                                onClick={() => openEditLabel(lbl)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  height="15px"
                                  viewBox="0 -960 960 960"
                                  width="15px"
                                  fill="currentColor"
                                >
                                  <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                                </svg>
                              </button>
                            </div>
                          ))}
                          {filteredLabels.length === 0 && (
                            <div
                              style={{
                                padding: "12px",
                                fontSize: "13px",
                                color: "#9fadbc",
                                textAlign: "center",
                              }}
                            >
                              No labels found
                            </div>
                          )}
                        </div>
                        <button
                          className="create-label-btn"
                          onClick={openCreateLabel}
                        >
                          + Create a new label
                        </button>
                        <div style={{ height: "8px" }} />
                      </>
                    )}
                    {(labelView === "create" || labelView === "edit") && (
                      <>
                        <SubPanelHeader
                          title={
                            labelView === "create"
                              ? "Create a new label"
                              : "Edit label"
                          }
                          onBack={() => setLabelView("list")}
                          onClose={() => {
                            setActiveMenu(null);
                            setLabelsSubPanel(false);
                            setLabelView("list");
                          }}
                        />
                        <div
                          className="label-preview"
                          style={{
                            backgroundColor: labelFormColor || "#2c3338",
                          }}
                        >
                          {labelFormTitle}
                        </div>
                        <div
                          style={{
                            padding: "4px 0 8px",
                            fontSize: "11px",
                            fontWeight: "600",
                            color: "#9fadbc",
                            paddingLeft: "12px",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          Title
                        </div>
                        <input
                          type="text"
                          className="label-form-input"
                          placeholder="Label title..."
                          value={labelFormTitle}
                          onChange={(e) => setLabelFormTitle(e.target.value)}
                        />
                        <div
                          style={{
                            padding: "10px 0 4px",
                            fontSize: "11px",
                            fontWeight: "600",
                            color: "#9fadbc",
                            paddingLeft: "12px",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          Select a color
                        </div>
                        <div className="color-palette-grid">
                          {LABEL_COLORS.map((c) => (
                            <div
                              key={c}
                              className={`color-swatch-sm ${labelFormColor === c ? "selected" : ""}`}
                              style={{ backgroundColor: c }}
                              onClick={() => setLabelFormColor(c)}
                            >
                              {labelFormColor === c && (
                                <div
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="14px"
                                    viewBox="0 -960 960 960"
                                    width="14px"
                                    fill="white"
                                  >
                                    <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <button
                          className="remove-color-btn"
                          onClick={() => setLabelFormColor("")}
                        >
                          ✕ &nbsp; Remove color
                        </button>
                        <hr
                          style={{ borderColor: "#3d444d", margin: "0 12px" }}
                        />
                        <div className="label-action-row">
                          <button
                            className="label-save-btn"
                            onClick={saveLabel}
                          >
                            {labelView === "create" ? "Create" : "Save"}
                          </button>
                          {labelView === "edit" && (
                            <button
                              className="label-delete-btn"
                              onClick={() => deleteLabel(editingLabel.id)}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                        <div style={{ height: "6px" }} />
                      </>
                    )}
                  </>
                ) : archivedSubPanel ? (
                  <>
                    <SubPanelHeader
                      title="Archived items"
                      onBack={() => setArchivedSubPanel(false)}
                      onClose={() => {
                        setActiveMenu(null);
                        setArchivedSubPanel(false);
                      }}
                    />
                    <div className="d-flex gap-2 px-3 py-2">
                      <input
                        type="text"
                        className="archived-search-input"
                        placeholder="Search"
                        value={archivedSearch}
                        onChange={(e) => setArchivedSearch(e.target.value)}
                      />
                      <button
                        className="archived-toggle-btn"
                        onClick={() =>
                          setArchivedTab(
                            archivedTab === "cards" ? "lists" : "cards",
                          )
                        }
                      >
                        {archivedTab === "cards" ? "Lists" : "Cards"}
                      </button>
                    </div>
                    <div className="archived-empty">
                      {archivedTab === "cards"
                        ? "No archived cards"
                        : "No archived lists"}
                    </div>
                    <div style={{ height: "8px" }} />
                  </>
                ) : activitySubPanel ? (
                  <>
                    <SubPanelHeader
                      title="Activity"
                      onBack={() => setActivitySubPanel(false)}
                      onClose={() => {
                        setActiveMenu(null);
                        setActivitySubPanel(false);
                      }}
                    />
                    <div className="d-flex gap-2 px-3 py-2">
                      <button
                        className={`activity-tab-btn ${activityTab === "all" ? "active" : ""}`}
                        onClick={() => setActivityTab("all")}
                      >
                        All
                      </button>
                      <button
                        className={`activity-tab-btn ${activityTab === "comments" ? "active" : ""}`}
                        onClick={() => setActivityTab("comments")}
                      >
                        Comments
                      </button>
                    </div>
                    <hr style={{ borderColor: "#3d444d", margin: "0" }} />
                    <div style={{ maxHeight: "320px", overflowY: "auto" }}>
                      {activityTab === "all" ? (
                        SAMPLE_ACTIVITIES.map((item) => (
                          <div key={item.id} className="activity-item">
                            <div className="activity-avatar">{item.user}</div>
                            <div>
                              <div className="activity-text">
                                <span style={{ fontWeight: 600 }}>
                                  {item.name}
                                </span>{" "}
                                {item.action}{" "}
                                {item.link && (
                                  <span className="activity-link">
                                    {item.link}
                                  </span>
                                )}{" "}
                                {item.linkSuffix}
                              </div>
                              <div className="activity-date">{item.date}</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div
                          style={{
                            padding: "32px 16px",
                            textAlign: "center",
                            fontSize: "13px",
                            color: "#9fadbc",
                          }}
                        >
                          No comments
                        </div>
                      )}
                    </div>
                    <div style={{ height: "8px" }} />
                  </>
                ) : (
                  /* Board Menu Main */
                  <>
                    <div
                      className="d-flex align-items-center px-3 py-2"
                      style={{ borderBottom: "1px solid #3d444d" }}
                    >
                      <div style={{ width: "24px" }} />
                      <span className="small fw-bold text-light text-center flex-grow-1">
                        Board menu
                      </span>
                      <button
                        className="menu-close-btn"
                        onClick={() => setActiveMenu(null)}
                      >
                        ×
                      </button>
                    </div>
                    <div
                      className="board-menu-item"
                      onClick={() => setBgSubPanel(true)}
                    >
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "6px",
                          background: boardBg,
                          flexShrink: 0,
                          border: "1px solid rgba(255,255,255,0.15)",
                        }}
                      />
                      <span>Change background</span>
                    </div>
                    <div
                      className="board-menu-item"
                      onClick={() => {
                        setLabelsSubPanel(true);
                        setLabelView("list");
                        setLabelSearch("");
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        fill="#dee2e6"
                        style={{ flexShrink: 0 }}
                      >
                        <path d="M840-480 666-234q-16 22-40.5 33t-50.5 11H240q-33 0-56.5-23.5T160-270v-420q0-33 23.5-56.5T240-770h335q26 0 50.5 11t40.5 33l174 246Zm-98 0L584-690H240v420h344l174-210Zm-502 0v210-420 210Z" />
                      </svg>
                      <span>Labels</span>
                    </div>
                    <div
                      className="board-menu-item"
                      onClick={() => {
                        setArchivedSubPanel(true);
                        setArchivedTab("cards");
                        setArchivedSearch("");
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        fill="#dee2e6"
                        style={{ flexShrink: 0 }}
                      >
                        <path d="M160-760v-80h640v80H160Zm0 560v-400h-40v-80h720v80h-40v400H160Zm80-80h480v-320H240v320Zm160-80v-80h160v80H400Zm-240 80v-320 320Z" />
                      </svg>
                      <span>Archived items</span>
                    </div>
                    <div
                      className="board-menu-item"
                      onClick={() => {
                        setActivitySubPanel(true);
                        setActivityTab("all");
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        fill="#dee2e6"
                        style={{ flexShrink: 0 }}
                      >
                        <path d="M120-240v-80h240v80H120Zm0-200v-80h480v80H120Zm0-200v-80h720v80H120Z" />
                      </svg>
                      <span>Activity</span>
                    </div>
                    <div className="board-menu-item danger">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        fill="#f87171"
                        style={{ flexShrink: 0 }}
                      >
                        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                      </svg>
                      <span>Delete board</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Board Content ── */}
        <BoardCards board_id={board_id} />

        {/* ── Bottom Navigation ── */}
        <div
          className="position-fixed bottom-0 start-50 translate-middle-x mb-3"
          style={{ zIndex: 100 }}
        >
          <div className="d-flex gap-2">
            <button
              className={`bottom-nav-btn ${showSwitchBoards ? "board-inactive" : "board-active"}`}
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
              className={`bottom-nav-btn ${showSwitchBoards ? "switch-active" : "switch-inactive"}`}
              onClick={() => setShowSwitchBoards((o) => !o)}
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

      {/* ── Switch Boards Panel ── */}
      {showSwitchBoards && (
        <div
          className="switch-boards-backdrop"
          onClick={() => setShowSwitchBoards(false)}
        >
          <div
            className="switch-boards-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="switch-boards-search-wrap flex-grow-1">
                <span className="switch-boards-search-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85zm-5.242.656a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
                  </svg>
                </span>
                <input
                  type="text"
                  className="switch-boards-search"
                  placeholder="Search your boards"
                  value={boardSearch}
                  onChange={(e) => setBoardSearch(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="ws-dots-wrap">
                <button
                  className="switch-boards-three-dots"
                  onClick={() => setShowDotsDropdown((o) => !o)}
                >
                  <span />
                  <span />
                  <span />
                </button>
                {showDotsDropdown && (
                  <>
                    <div
                      style={{ position: "fixed", inset: 0, zIndex: 3199 }}
                      onClick={() => setShowDotsDropdown(false)}
                    />
                    <div className="ws-dropdown">
                      <Link
                        to="/boardbutton"
                        className="ws-dropdown-item"
                        onClick={() => setShowDotsDropdown(false)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="17px"
                          viewBox="0 -960 960 960"
                          width="17px"
                          fill="#9fadbc"
                        >
                          <path d="M160-200q-33 0-56.5-23.5T80-280v-400q0-33 23.5-56.5T160-760h640q33 0 56.5 23.5T880-680v400q0 33-23.5 56.5T800-200H160Zm0-80h200v-400H160v400Zm280 0h200v-400H440v400Zm280 0h80v-400h-80v400Z" />
                        </svg>
                        Boards
                      </Link>
                      <Link
                        to="/members"
                        className="ws-dropdown-item"
                        onClick={() => setShowDotsDropdown(false)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="17px"
                          viewBox="0 -960 960 960"
                          width="17px"
                          fill="#9fadbc"
                        >
                          <path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" />
                        </svg>
                        Members
                      </Link>
                      <Link
                        to="/settings"
                        className="ws-dropdown-item"
                        onClick={() => setShowDotsDropdown(false)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="17px"
                          viewBox="0 -960 960 960"
                          width="17px"
                          fill="#9fadbc"
                        >
                          <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-66q5-14 7-29.5t2-30.5q0-15-2-30.5T691-550l86-66-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 66q-5 14-7 29.5t-2 30.5q0 15 2 30.5t7 29.5l-86 66 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-540q0 58 40.5 99t99.5 41Zm-2-140Z" />
                        </svg>
                        Settings
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
            <button className="workspace-pill mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="14px"
                viewBox="0 -960 960 960"
                width="14px"
                fill="#579dff"
              >
                <path d="M160-120q-33 0-56.5-23.5T80-200v-560q0-33 23.5-56.5T160-840h640q33 0 56.5 23.5T880-760v560q0 33-23.5 56.5T800-120H160Zm0-80h640v-480H160v480Z" />
              </svg>
              Animatewell board
            </button>
            <div
              style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "#dee2e6",
                marginBottom: "10px",
              }}
            >
              Your boards
            </div>
            <div className="board-grid">
              {MY_BOARDS.filter((b) =>
                b.name.toLowerCase().includes(boardSearch.toLowerCase()),
              ).map((b) => (
                <div
                  key={b.id}
                  className="board-thumb"
                  style={{ background: b.bg }}
                  onClick={() => setShowSwitchBoards(false)}
                >
                  <div className="board-thumb-label">{b.name}</div>
                </div>
              ))}
              <div
                className="create-board-thumb"
                onClick={() => {
                  setShowCreateBoard(true);
                  setCreateBoardTitle("");
                  setSelectedColor("#00798F");
                }}
              >
                <span>
                  Create new
                  <br />
                  board
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Create Board Modal ── */}
      <Modal
        show={showCreateBoard}
        onHide={() => setShowCreateBoard(false)}
        centered
        className="trello-dark-modal"
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
                ].map(({ color }) => (
                  <div key={color} style={{ width: "48px" }}>
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
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onClick={() => setSelectedColor(color)}
                    >
                      {selectedColor === color && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          fill="white"
                          viewBox="0 0 16 16"
                        >
                          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
                <div className="position-relative">
                  <label
                    htmlFor="customColorModal"
                    style={{
                      width: "48px",
                      height: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "linear-gradient(135deg, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
                      border: "2px solid rgba(255,255,255,0.2)",
                      borderRadius: "6px",
                      cursor: "pointer",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "rgba(0,0,0,0.4)",
                        backdropFilter: "blur(2px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
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
                    id="customColorModal"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    style={{
                      position: "absolute",
                      opacity: 0,
                      width: 0,
                      height: 0,
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
                style={{ fontSize: "14px", padding: "10px 12px" }}
                value={createBoardTitle}
                onChange={(e) => setCreateBoardTitle(e.target.value)}
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
                <Dropdown.Toggle variant="dark" id="dropdown-visibility-modal">
                  <span>
                    <i className={`bi ${visibility.icon} me-2`}></i>
                    {visibility.title}
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    as="div"
                    className="visibility-item"
                    onClick={() =>
                      setVisibility({
                        title: "Private",
                        icon: "bi-lock",
                        desc: "Board members and Workspace admin can see and edit this board.",
                      })
                    }
                  >
                    <i className="bi bi-lock fs-5 mt-1"></i>
                    <div className="visibility-text">
                      <span className="title">Private</span>
                      <span className="desc">
                        Board members and workspace admins can see and edit this
                        board.
                      </span>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item
                    as="div"
                    className="visibility-item"
                    onClick={() =>
                      setVisibility({
                        title: "Public",
                        icon: "bi-globe",
                        desc: "Anyone on the internet can see this board.",
                      })
                    }
                  >
                    <i className="bi bi-globe fs-5 mt-1"></i>
                    <div className="visibility-text">
                      <span className="title">Public</span>
                      <span className="desc">
                        Anyone on the internet can see this board.
                      </span>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item
                    as="div"
                    className="visibility-item"
                    onClick={() =>
                      setVisibility({
                        title: "Workspace",
                        icon: "bi-building",
                        desc: "All workspace members can see and edit this board.",
                      })
                    }
                  >
                    <i className="bi bi-building fs-5 mt-1"></i>
                    <div className="visibility-text">
                      <span className="title">Workspace</span>
                      <span className="desc">
                        All members of the workspace can see and edit this
                        board.
                      </span>
                    </div>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>
            <Button
              variant="primary"
              className="w-100 fw-bold py-2"
              style={{ fontSize: "14px", borderRadius: "6px" }}
              disabled={!createBoardTitle.trim()}
            >
              Create Board
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* ── Share Modal ── */}
      {isShareOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2000,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setIsShareOpen(false)}
        >
          <div
            className="rounded-3 shadow-lg position-relative"
            style={{
              width: "560px",
              maxWidth: "calc(100vw - 40px)",
              backgroundColor: "#1d2125",
              color: "#dee2e6",
              border: "1px solid #3d444d",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {showCopyToast && (
              <div
                className="position-absolute top-0 start-50 translate-middle-x mt-2 bg-success text-white px-3 py-1 rounded shadow-sm d-flex align-items-center gap-2"
                style={{ zIndex: 2200, fontSize: "13px" }}
              >
                <span>✔️</span> Link copied to clipboard
              </div>
            )}
            <div className="d-flex justify-content-between align-items-center px-4 pt-4 pb-3">
              <h5
                className="mb-0 fw-bold text-light"
                style={{ fontSize: "20px" }}
              >
                Share board
              </h5>
              <button
                className="btn border-0 p-0 text-light"
                style={{ fontSize: "22px", lineHeight: 1, background: "none" }}
                onClick={() => setIsShareOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="px-4 pb-4">
              <div className="d-flex gap-2 mb-4">
                <input
                  type="text"
                  className="share-modal-input flex-grow-1"
                  placeholder="Email address or name"
                />
                <button className="btn btn-primary fw-semibold px-4">
                  Share
                </button>
              </div>
              <div className="mb-4">
                {hasLink ? (
                  <div className="share-link-section">
                    <div className="share-link-icon">🔗</div>
                    <div className="flex-grow-1">
                      <div className="fw-semibold small text-light mb-1">
                        Anyone with the link can join as a member
                      </div>
                      <div
                        className="d-flex gap-3"
                        style={{ fontSize: "12px" }}
                      >
                        <span
                          className="text-primary text-decoration-underline fw-semibold"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setShowCopyToast(true);
                            setTimeout(() => setShowCopyToast(false), 2000);
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
                    <button
                      className="btn btn-sm text-light"
                      style={{
                        fontSize: "12px",
                        backgroundColor: "#3d444d",
                        border: "none",
                        borderRadius: "6px",
                      }}
                    >
                      Change permissions
                    </button>
                  </div>
                ) : (
                  <div className="share-link-section">
                    <div className="share-link-icon">🔗</div>
                    <div>
                      <div className="fw-semibold small text-light mb-1">
                        Share this board with a link
                      </div>
                      <span
                        className="text-primary text-decoration-underline small fw-semibold"
                        style={{ cursor: "pointer", fontSize: "13px" }}
                        onClick={() => setHasLink(true)}
                      >
                        Create link
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <hr className="share-divider mb-0" />
              <div className="d-flex gap-4 pt-1 mb-3">
                <button
                  className={`btn p-0 pb-2 border-0 share-tab-${activeShareTab === "members" ? "active" : "inactive"}`}
                  style={{
                    fontSize: "14px",
                    background: "none",
                    borderRadius: 0,
                  }}
                  onClick={() => setActiveShareTab("members")}
                >
                  Board members{" "}
                  <span
                    className="ms-1 px-2 py-0 rounded"
                    style={{
                      fontSize: "12px",
                      backgroundColor: "#2c3338",
                      color: "#dee2e6",
                      border: "1px solid #3d444d",
                    }}
                  >
                    1
                  </span>
                </button>
                <button
                  className={`btn p-0 pb-2 border-0 share-tab-${activeShareTab === "requests" ? "active" : "inactive"}`}
                  style={{
                    fontSize: "14px",
                    background: "none",
                    borderRadius: 0,
                  }}
                  onClick={() => setActiveShareTab("requests")}
                >
                  Join requests
                </button>
              </div>
              <div style={{ minHeight: "70px" }}>
                {activeShareTab === "members" ? (
                  <div className="d-flex align-items-center justify-content-between py-2">
                    <div className="d-flex align-items-center gap-3">
                      <div className="share-member-avatar">
                        {user
                          ? (user.username?.[0]?.toUpperCase() ?? "U")
                          : "SL"}
                      </div>
                      <div>
                        <div
                          className="fw-semibold text-light"
                          style={{ fontSize: "14px" }}
                        >
                          {user?.username || "Shikaina Lobre"} (you)
                        </div>
                        <div style={{ fontSize: "12px", color: "#9fadbc" }}>
                          @{user?.username?.toLowerCase() || "shikainalobre"} ·
                          Workspace admin
                        </div>
                      </div>
                    </div>
                    <Dropdown>
                      <Dropdown.Toggle
                        as="button"
                        className="share-admin-btn"
                        id="role-dropdown"
                      >
                        Admin{" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="11"
                          height="11"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                        </svg>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item>Admin</Dropdown.Item>
                        <Dropdown.Item>Member</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                ) : (
                  <div
                    className="text-center py-4 small"
                    style={{ color: "#9fadbc" }}
                  >
                    <div className="mb-2 fs-2">👤</div>
                    No pending join requests at the moment.
                  </div>
                )}
              </div>
            </div>
            {showDeleteLinkConfirm && (
              <div
                className="position-absolute shadow-lg border rounded-3 p-3"
                style={{
                  width: "320px",
                  top: "110px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 2150,
                  backgroundColor: "#22272b",
                  borderColor: "#3d444d",
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span
                    className="fw-bold small text-center w-100"
                    style={{ color: "#dee2e6" }}
                  >
                    Delete share link?
                  </span>
                  <span
                    className="fs-5 text-light"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowDeleteLinkConfirm(false)}
                  >
                    &times;
                  </span>
                </div>
                <hr className="my-2" style={{ borderColor: "#3d444d" }} />
                <p
                  style={{
                    fontSize: "13px",
                    lineHeight: "1.4",
                    color: "#9fadbc",
                  }}
                >
                  The existing board share link will no longer work. Anyone who
                  has it won't be able to join.
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

      {/* ── Apps Overlay Dropdown ── */}
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
