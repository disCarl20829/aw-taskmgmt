import React, { useState, useEffect, useRef, useCallback } from "react";
import api from "../../config/api";
import "bootstrap/dist/css/bootstrap.min.css";

// ─── Drag state refs (module-level, no re-render on change) ───────────────────
let dragType = null; // 'card' | 'list'
let dragCardId = null;
let dragListId = null;
let dragSourceListId = null;

const LIST_COLORS = [
  "#4a7c59",
  "#a07c1e",
  "#c05c2a",
  "#b83232",
  "#7b4f9e",
  "#2a6db5",
  "#2a8a8a",
  "#5a7a2a",
  "#b84f8a",
  "#7a7a7a",
];
const LABEL_COLORS = [
  "#61bd4f",
  "#f2d600",
  "#ff9f1a",
  "#eb5a46",
  "#c377e0",
  "#0079bf",
  "#00c2e0",
  "#51e898",
  "#ff78cb",
  "#344563",
  "#b6bbbf",
  "#dfe1e6",
  "#fce4d6",
  "#fdf3c0",
  "#e4f9ec",
  "#fce0dc",
  "#e6f0ff",
  "#e6fcef",
  "#e3fcef",
  "#f4e0ff",
  "#ffece6",
  "#e6fcff",
  "#fff7cc",
  "#ffdde6",
  "#f0f0f0",
  "#292f33",
];

function getTextColor(hex) {
  if (!hex) return "#f5c518";
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16),
    g = parseInt(c.substring(2, 4), 16),
    b = parseInt(c.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.45
    ? "#1d2125"
    : "#f5c518";
}

// ── Rich Description Editor ───────────────────────────────────
function RichDescriptionEditor({ value, onChange, onSave, onCancel }) {
  const editorRef = useRef(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const savedRangeRef = useRef(null);
  const exec = (cmd, val = null) => {
    editorRef.current.focus();
    document.execCommand(cmd, false, val);
    onChange(editorRef.current.innerHTML);
  };
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) savedRangeRef.current = sel.getRangeAt(0);
  };
  const restoreSelection = () => {
    const sel = window.getSelection();
    if (sel && savedRangeRef.current) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }
  };
  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = value || "";
  }, []);
  const btnBase = {
    background: "none",
    border: "none",
    color: "#b6c2cf",
    cursor: "pointer",
    padding: "4px 7px",
    borderRadius: "4px",
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
  };
  return (
    <div
      style={{
        border: "2px solid #579dff",
        borderRadius: "8px",
        backgroundColor: "#22272b",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2px",
          padding: "5px 8px",
          backgroundColor: "#1a1f23",
          borderBottom: "1px solid #3d444d",
          flexWrap: "wrap",
          borderRadius: "6px 6px 0 0",
        }}
      >
        <button
          style={{
            ...btnBase,
            fontWeight: "900",
            fontSize: "14px",
            fontFamily: "Georgia,serif",
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            exec("bold");
          }}
        >
          B
        </button>
        <button
          style={{ ...btnBase, fontStyle: "italic", fontSize: "15px" }}
          onMouseDown={(e) => {
            e.preventDefault();
            exec("italic");
          }}
        >
          I
        </button>
        <button
          style={{ ...btnBase, fontSize: "13px", textDecoration: "underline" }}
          onMouseDown={(e) => {
            e.preventDefault();
            exec("underline");
          }}
        >
          U
        </button>
        <div
          style={{
            width: "1px",
            backgroundColor: "#3d444d",
            alignSelf: "stretch",
            margin: "0 3px",
          }}
        />
        <button
          style={btnBase}
          onMouseDown={(e) => {
            e.preventDefault();
            exec("insertUnorderedList");
          }}
          title="Bullet list"
        >
          • List
        </button>
        <button
          style={btnBase}
          onMouseDown={(e) => {
            e.preventDefault();
            exec("insertOrderedList");
          }}
          title="Numbered list"
        >
          1. List
        </button>
        <div
          style={{
            width: "1px",
            backgroundColor: "#3d444d",
            alignSelf: "stretch",
            margin: "0 3px",
          }}
        />
        <button
          style={btnBase}
          onMouseDown={(e) => {
            e.preventDefault();
            saveSelection();
            setShowLinkModal(true);
          }}
          title="Link"
        >
          🔗
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange(editorRef.current.innerHTML)}
        style={{
          minHeight: "100px",
          padding: "12px 14px",
          color: "#b6c2cf",
          fontSize: "14px",
          lineHeight: 1.6,
          outline: "none",
          overflowY: "auto",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 12px",
          borderTop: "1px solid #3d444d",
        }}
      >
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={onSave}
            style={{
              backgroundColor: "#579dff",
              border: "none",
              borderRadius: "6px",
              color: "#fff",
              padding: "7px 18px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Save
          </button>
          <button
            onClick={onCancel}
            style={{
              background: "none",
              border: "none",
              color: "#9fadbc",
              padding: "7px 12px",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Discard changes
          </button>
        </div>
      </div>
      {showLinkModal && (
        <LinkInsertModal
          onInsert={(url, display) => {
            restoreSelection();
            editorRef.current.focus();
            if (display) {
              const sel = window.getSelection();
              if (sel && sel.rangeCount > 0) {
                const range = sel.getRangeAt(0);
                range.deleteContents();
                const a = document.createElement("a");
                a.href = url;
                a.textContent = display;
                a.style.color = "#579dff";
                range.insertNode(a);
              }
            } else {
              document.execCommand("createLink", false, url);
            }
            onChange(editorRef.current.innerHTML);
            setShowLinkModal(false);
          }}
          onCancel={() => setShowLinkModal(false)}
        />
      )}
    </div>
  );
}

function LinkInsertModal({ onInsert, onCancel }) {
  const [url, setUrl] = useState("");
  const [display, setDisplay] = useState("");
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9000,
        backgroundColor: "rgba(0,0,0,0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: "#282e33",
          borderRadius: "10px",
          padding: "24px",
          width: "360px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <label
          style={{
            fontSize: "13px",
            fontWeight: "700",
            color: "#dee2e6",
            display: "block",
            marginBottom: "6px",
          }}
        >
          Link
        </label>
        <input
          autoFocus
          type="url"
          placeholder="Paste a link"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && url.trim())
              onInsert(url.trim(), display.trim());
            if (e.key === "Escape") onCancel();
          }}
          style={{
            width: "100%",
            backgroundColor: "#22272b",
            color: "#b6c2cf",
            border: "2px solid #579dff",
            borderRadius: "6px",
            padding: "10px 12px",
            fontSize: "14px",
            outline: "none",
            boxSizing: "border-box",
            marginBottom: "12px",
          }}
        />
        <label
          style={{
            fontSize: "13px",
            fontWeight: "700",
            color: "#dee2e6",
            display: "block",
            marginBottom: "6px",
          }}
        >
          Display text (optional)
        </label>
        <input
          type="text"
          placeholder="Text to display"
          value={display}
          onChange={(e) => setDisplay(e.target.value)}
          style={{
            width: "100%",
            backgroundColor: "#22272b",
            color: "#b6c2cf",
            border: "1px solid #3d444d",
            borderRadius: "6px",
            padding: "10px 12px",
            fontSize: "14px",
            outline: "none",
            boxSizing: "border-box",
            marginBottom: "16px",
          }}
        />
        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}
        >
          <button
            onClick={onCancel}
            style={{
              background: "none",
              border: "none",
              color: "#9fadbc",
              padding: "8px 16px",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (url.trim()) onInsert(url.trim(), display.trim());
            }}
            disabled={!url.trim()}
            style={{
              backgroundColor: url.trim() ? "#579dff" : "#3a4a5a",
              border: "none",
              borderRadius: "6px",
              color: "#fff",
              padding: "8px 20px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: url.trim() ? "pointer" : "not-allowed",
            }}
          >
            Insert
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Labels Modal ──────────────────────────────────────────────
function CreateLabelView({ onBack, onClose, onCreated, editLabel }) {
  const [title, setTitle] = useState(editLabel?.label_name || "");
  const [selectedColor, setSelectedColor] = useState(
    editLabel?.label_color || "#61bd4f",
  );
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9500,
        backgroundColor: "rgba(0,0,0,0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#282e33",
          borderRadius: "10px",
          width: "340px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            borderBottom: "1px solid #3d444d",
            position: "relative",
          }}
        >
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              color: "#9fadbc",
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: "4px",
            }}
          >
            ←
          </button>
          <span
            style={{
              fontSize: "14px",
              fontWeight: "700",
              color: "#dee2e6",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {editLabel ? "Edit label" : "Create label"}
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#9fadbc",
              cursor: "pointer",
              fontSize: "20px",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
        <div style={{ padding: "16px" }}>
          <div
            style={{
              height: "48px",
              borderRadius: "6px",
              backgroundColor: selectedColor || "#dfe1e6",
              marginBottom: "16px",
            }}
          />
          <label
            style={{
              fontSize: "11px",
              fontWeight: "700",
              color: "#9fadbc",
              display: "block",
              marginBottom: "6px",
              textTransform: "uppercase",
            }}
          >
            TITLE
          </label>
          <input
            type="text"
            placeholder="Label title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              backgroundColor: "#22272b",
              color: "#b6c2cf",
              border: "1px solid #3d444d",
              borderRadius: "6px",
              padding: "9px 12px",
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box",
              marginBottom: "14px",
            }}
          />
          <label
            style={{
              fontSize: "11px",
              fontWeight: "700",
              color: "#9fadbc",
              display: "block",
              marginBottom: "10px",
              textTransform: "uppercase",
            }}
          >
            SELECT A COLOR
          </label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "6px",
              marginBottom: "12px",
            }}
          >
            {LABEL_COLORS.map((color) => (
              <div
                key={color}
                onClick={() => setSelectedColor(color)}
                style={{
                  height: "32px",
                  borderRadius: "6px",
                  backgroundColor: color,
                  cursor: "pointer",
                  border:
                    selectedColor === color
                      ? "2.5px solid #fff"
                      : "2.5px solid transparent",
                  boxSizing: "border-box",
                }}
              />
            ))}
          </div>
          <button
            onClick={() =>
              onCreated({
                label_name: title.trim(),
                label_color: selectedColor || "#dfe1e6",
                label_id: editLabel?.label_id || null,
              })
            }
            style={{
              width: "100%",
              backgroundColor: "#579dff",
              border: "none",
              borderRadius: "6px",
              color: "#fff",
              padding: "10px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {editLabel ? "Save" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

function LabelsModal({ onClose, board_id, card_id }) {
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editLabel, setEditLabel] = useState(null);
  const [labels, setLabels] = useState([]);
  const [checked, setChecked] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/customize/list/${board_id}/${card_id}`);
        const cardLabels = res.data?.labels || [];
        setChecked(cardLabels.map((l) => l.label_id));
        setLabels(cardLabels);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [board_id, card_id]);

  const filtered = labels.filter(
    (l) =>
      !search.trim() ||
      (l.label_name &&
        l.label_name.toLowerCase().includes(search.toLowerCase())),
  );

  const handleCreated = async ({ label_name, label_color, label_id }) => {
    try {
      if (label_id) {
        await api.patch(`/customize/label/${board_id}/${label_id}`, {
          label_name,
          label_color,
        });
        setLabels((prev) =>
          prev.map((l) =>
            l.label_id === label_id ? { ...l, label_name, label_color } : l,
          ),
        );
      }
    } catch (err) {
      console.error(err);
    }
    setShowCreate(false);
    setEditLabel(null);
  };

  const toggleCheck = async (label_id) => {
    const isChecked = checked.includes(label_id);
    try {
      if (isChecked) {
        await api.delete(`/customize/listLabel/${board_id}/${card_id}`, {
          data: { label_id },
        });
        setChecked((prev) => prev.filter((x) => x !== label_id));
      } else {
        await api.post(`/customize/listLabel/${board_id}/${card_id}`, {
          label_id,
        });
        setChecked((prev) => [...prev, label_id]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (showCreate || editLabel)
    return (
      <CreateLabelView
        onBack={() => {
          setShowCreate(false);
          setEditLabel(null);
        }}
        onClose={onClose}
        onCreated={handleCreated}
        editLabel={editLabel}
      />
    );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9500,
        backgroundColor: "rgba(0,0,0,0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#282e33",
          borderRadius: "10px",
          width: "320px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            borderBottom: "1px solid #3d444d",
          }}
        >
          <div style={{ width: "28px" }} />
          <span
            style={{ fontSize: "14px", fontWeight: "700", color: "#dee2e6" }}
          >
            Labels
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#9fadbc",
              cursor: "pointer",
              fontSize: "20px",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
        <div style={{ padding: "12px 14px" }}>
          <input
            type="text"
            placeholder="Search labels..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              backgroundColor: "#22272b",
              color: "#b6c2cf",
              border: "1px solid #3d444d",
              borderRadius: "6px",
              padding: "9px 12px",
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box",
              marginBottom: "14px",
            }}
          />
          {loading ? (
            <div
              style={{ color: "#9fadbc", textAlign: "center", padding: "12px" }}
            >
              Loading...
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                marginBottom: "14px",
              }}
            >
              {filtered.map((label) => (
                <div
                  key={label.label_id}
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div
                    onClick={() => toggleCheck(label.label_id)}
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "3px",
                      border: checked.includes(label.label_id)
                        ? "none"
                        : "2px solid #6b7280",
                      backgroundColor: checked.includes(label.label_id)
                        ? "#579dff"
                        : "transparent",
                      flexShrink: 0,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {checked.includes(label.label_id) && (
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <div
                    onClick={() => toggleCheck(label.label_id)}
                    style={{
                      flex: 1,
                      height: "36px",
                      borderRadius: "6px",
                      backgroundColor: label.label_color,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      paddingLeft: "10px",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.filter = "brightness(1.15)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.filter = "brightness(1)")
                    }
                  >
                    {label.label_name && (
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: "600",
                          color: getTextColor(label.label_color),
                        }}
                      >
                        {label.label_name}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setEditLabel(label)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#9fadbc",
                      cursor: "pointer",
                      padding: "6px",
                      borderRadius: "4px",
                    }}
                  >
                    ✏️
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => setShowCreate(true)}
            style={{
              width: "100%",
              backgroundColor: "#3d444d",
              border: "none",
              borderRadius: "6px",
              color: "#dee2e6",
              padding: "9px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#474f59")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#3d444d")
            }
          >
            + Create a new label
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Add List Modal ────────────────────────────────────────────
function AddListModal({ board_id, onClose, onCreated }) {
  const [listName, setListName] = useState("");
  const [saving, setSaving] = useState(false);
  const handleCreate = async () => {
    if (!listName.trim() || saving) return;
    setSaving(true);
    try {
      const res = await api.post(`/tasks/lists/${board_id}`, {
        list_name: listName.trim(),
        list_position: 9999,
      });
      onCreated(res.data.list);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 4000,
        backgroundColor: "rgba(0,0,0,0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "360px",
          backgroundColor: "#282e33",
          color: "#b6c2cf",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h6
            style={{
              fontWeight: "700",
              margin: 0,
              color: "#b6c2cf",
              fontSize: "15px",
            }}
          >
            Add a new list
          </h6>
          <button
            style={{
              background: "none",
              border: "none",
              color: "#9fadbc",
              fontSize: "22px",
              lineHeight: 1,
              cursor: "pointer",
            }}
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <label
          style={{
            fontSize: "12px",
            fontWeight: "600",
            color: "#9fadbc",
            display: "block",
            marginBottom: "6px",
          }}
        >
          List Name <span style={{ color: "#f87462" }}>*</span>
        </label>
        <input
          autoFocus
          type="text"
          placeholder="Enter list name..."
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleCreate();
            if (e.key === "Escape") onClose();
          }}
          style={{
            width: "100%",
            backgroundColor: "#22272b",
            color: "#b6c2cf",
            border: "1px solid #454f59",
            borderRadius: "6px",
            padding: "9px 12px",
            fontSize: "14px",
            outline: "none",
            boxSizing: "border-box",
            marginBottom: "16px",
          }}
        />
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={handleCreate}
            disabled={!listName.trim() || saving}
            style={{
              backgroundColor: "#579dff",
              border: "none",
              borderRadius: "6px",
              color: "#fff",
              padding: "9px 20px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: listName.trim() && !saving ? "pointer" : "not-allowed",
              opacity: listName.trim() && !saving ? 1 : 0.5,
            }}
          >
            {saving ? "Creating..." : "Add List"}
          </button>
          <button
            onClick={onClose}
            style={{
              backgroundColor: "#374048",
              border: "none",
              borderRadius: "6px",
              color: "#9fadbc",
              padding: "9px 16px",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Card Quick-Edit ───────────────────────────────────────────
function CardQuickEdit({
  card,
  listName,
  anchorRect,
  onClose,
  onSave,
  onOpen,
  onEditLabels,
}) {
  const [name, setName] = useState(card.card_name);
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);
  const top = Math.max(
    8,
    Math.min(anchorRect.top - 8, window.innerHeight - 440),
  );
  const left = Math.max(8, Math.min(anchorRect.left, window.innerWidth - 480));
  const iconBtn = (path) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      {path}
    </svg>
  );
  const actions = [
    {
      label: "Open card",
      icon: iconBtn(
        <>
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </>,
      ),
      action: () => {
        onOpen();
        onClose();
      },
    },
    {
      label: "Edit labels",
      icon: iconBtn(
        <>
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </>,
      ),
      action: () => {
        onEditLabels();
        onClose();
      },
    },
    {
      label: "Change members",
      icon: iconBtn(
        <>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </>,
      ),
      action: onClose,
    },
    {
      label: "Edit dates",
      icon: iconBtn(
        <>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </>,
      ),
      action: onClose,
    },
    {
      label: "Move",
      icon: iconBtn(
        <>
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </>,
      ),
      action: onClose,
    },
    {
      label: "Copy card",
      icon: iconBtn(
        <>
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </>,
      ),
      action: onClose,
    },
    {
      label: "Archive",
      icon: iconBtn(
        <>
          <polyline points="21 8 21 21 3 21 3 8" />
          <rect x="1" y="3" width="22" height="5" />
          <line x1="10" y1="12" x2="14" y2="12" />
        </>,
      ),
      action: onClose,
    },
  ];
  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 6000,
          backgroundColor: "rgba(0,0,0,0.55)",
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: "fixed",
          top,
          left,
          zIndex: 6001,
          display: "flex",
          gap: "8px",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: Math.max(240, anchorRect.width || 260),
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div
            style={{
              backgroundColor: "#2c2c2c",
              borderRadius: "8px",
              padding: "9px 10px",
              border: "2px solid rgba(255,255,255,0.08)",
            }}
          >
            <textarea
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              rows={3}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                color: "#e0e0e0",
                fontSize: "13px",
                resize: "none",
                outline: "none",
                fontFamily: "inherit",
                lineHeight: 1.5,
                boxSizing: "border-box",
              }}
            />
          </div>
          <button
            onClick={() => {
              onSave(name);
              onClose();
            }}
            style={{
              backgroundColor: "#579dff",
              border: "none",
              borderRadius: "6px",
              color: "#fff",
              padding: "8px 18px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              alignSelf: "flex-start",
            }}
          >
            Save
          </button>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            minWidth: "185px",
          }}
        >
          {actions.map(({ label, icon, action }) => (
            <button
              key={label}
              onClick={action}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                backgroundColor: "#2c3338",
                border: "none",
                borderRadius: "8px",
                color: "#dee2e6",
                fontSize: "13px",
                fontWeight: "500",
                padding: "9px 14px",
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#374048")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#2c3338")
              }
            >
              <span
                style={{
                  color: "#9fadbc",
                  display: "flex",
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                {icon}
              </span>
              {label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
const BoardCards = ({ colors, board_id }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Drag state (highlight only, no re-render for perf) ──
  const [overListId, setOverListId] = useState(null);
  const [overCardId, setOverCardId] = useState(null);
  const [overListDrag, setOverListDrag] = useState(null);

  // ── List editing ──
  const [editingListId, setEditingListId] = useState(null);
  const [editingListName, setEditingListName] = useState("");
  const editingListNameRef = useRef("");
  const saveInProgress = useRef(false);
  const escapePressed = useRef(false);

  // ── Card detail ──
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedListName, setSelectedListName] = useState("");
  const [cardDescription, setCardDescription] = useState("");
  const [editingDescription, setEditingDescription] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [cardDetail, setCardDetail] = useState(null);

  // ── Card/list modals ──
  const [addCardModal, setAddCardModal] = useState(null);
  const [newCard, setNewCard] = useState({
    card_name: "",
    card_description: "",
    due_date: "",
    due_time: "",
  });
  const [showAddListModal, setShowAddListModal] = useState(false);
  const [collapsedLists, setCollapsedLists] = useState({});
  const [openListMenu, setOpenListMenu] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(null);
  const [cardQuickEdit, setCardQuickEdit] = useState(null);
  const [showLabelsModal, setShowLabelsModal] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    try {
      const res = await api.get(`tasks/lists/${board_id}`);
      setData(
        res.data.lists.map((list) => ({ ...list, cards: list.cards || [] })),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [board_id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ─────────────────────────────────────────────────────────────
  // DRAG HANDLERS
  // ─────────────────────────────────────────────────────────────

  const handleCardDragStart = (e, cardId, listId) => {
    dragType = "card";
    dragCardId = cardId;
    dragSourceListId = listId;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleCardDragOver = (e, cardId, listId) => {
    if (dragType !== "card") return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setOverListId(listId);
    setOverCardId(cardId);
  };

  const handleListBodyDragOver = (e, listId) => {
    if (dragType !== "card") return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setOverListId(listId);
    if (overListId !== listId) setOverCardId(null);
  };

  const handleCardDrop = async (e, targetCardId, targetListId) => {
    e.preventDefault();
    if (dragType !== "card" || dragCardId === targetCardId) {
      resetDragState();
      return;
    }
    const sourceListId = dragSourceListId;
    const movingCardId = dragCardId;
    resetDragState();

    setData((prev) => {
      const next = prev.map((l) => ({ ...l, cards: [...(l.cards || [])] }));
      const srcList = next.find((l) => l.list_id === sourceListId);
      const cardIdx = srcList?.cards.findIndex(
        (c) => c.card_id === movingCardId,
      );
      if (cardIdx === undefined || cardIdx === -1) return prev;
      const [movedCard] = srcList.cards.splice(cardIdx, 1);
      const tgtList = next.find((l) => l.list_id === targetListId);
      if (!tgtList) return prev;
      const tgtIdx = tgtList.cards.findIndex((c) => c.card_id === targetCardId);
      const insertAt = tgtIdx === -1 ? tgtList.cards.length : tgtIdx;
      movedCard.list_id = targetListId;
      tgtList.cards.splice(insertAt, 0, movedCard);
      tgtList.cards.forEach((c, i) => {
        c.card_position = i + 1;
      });
      if (sourceListId !== targetListId)
        srcList.cards.forEach((c, i) => {
          c.card_position = i + 1;
        });
      return next;
    });

    try {
      const tgtList = data.find((l) => l.list_id === targetListId);
      const tgtIdx = (tgtList?.cards || []).findIndex(
        (c) => c.card_id === targetCardId,
      );
      const newPosition =
        tgtIdx === -1 ? (tgtList?.cards?.length || 0) + 1 : tgtIdx + 1;
      await api.patch(`/tasks/moveCard/${board_id}/${movingCardId}`, {
        new_list_id: targetListId,
        new_position: newPosition,
      });
    } catch (err) {
      console.error("moveCard failed:", err);
      fetchData();
    }
  };

  const handleListBodyDrop = async (e, targetListId) => {
    e.preventDefault();
    if (dragType !== "card") {
      resetDragState();
      return;
    }
    const sourceListId = dragSourceListId;
    const movingCardId = dragCardId;
    resetDragState();

    setData((prev) => {
      const next = prev.map((l) => ({ ...l, cards: [...(l.cards || [])] }));
      const srcList = next.find((l) => l.list_id === sourceListId);
      const cardIdx = srcList?.cards.findIndex(
        (c) => c.card_id === movingCardId,
      );
      if (cardIdx === undefined || cardIdx === -1) return prev;
      const [movedCard] = srcList.cards.splice(cardIdx, 1);
      const tgtList = next.find((l) => l.list_id === targetListId);
      if (!tgtList) return prev;
      movedCard.list_id = targetListId;
      tgtList.cards.push(movedCard);
      tgtList.cards.forEach((c, i) => {
        c.card_position = i + 1;
      });
      srcList.cards.forEach((c, i) => {
        c.card_position = i + 1;
      });
      return next;
    });

    try {
      const tgtList = data.find((l) => l.list_id === targetListId);
      const newPosition = (tgtList?.cards?.length || 0) + 1;
      await api.patch(`/tasks/moveCard/${board_id}/${movingCardId}`, {
        new_list_id: targetListId,
        new_position: newPosition,
      });
    } catch (err) {
      console.error("moveCard failed:", err);
      fetchData();
    }
  };

  const handleListDragStart = (e, listId) => {
    dragType = "list";
    dragListId = listId;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleListDragOver = (e, listId) => {
    if (dragType !== "list" || dragListId === listId) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setOverListDrag(listId);
  };

  const handleListDrop = async (e, targetListId) => {
    e.preventDefault();
    if (dragType !== "list" || dragListId === targetListId) {
      resetDragState();
      return;
    }
    const movingListId = dragListId;
    resetDragState();

    setData((prev) => {
      const next = [...prev];
      const fromIdx = next.findIndex((l) => l.list_id === movingListId);
      const toIdx = next.findIndex((l) => l.list_id === targetListId);
      if (fromIdx === -1 || toIdx === -1) return prev;
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next.map((l, i) => ({ ...l, list_position: i + 1 }));
    });

    try {
      const targetList = data.find((l) => l.list_id === targetListId);
      await api.patch(`/tasks/lists/${movingListId}`, {
        list_position: targetList?.list_position ?? 1,
      });
    } catch (err) {
      console.error("reorder list failed:", err);
      fetchData();
    }
  };

  const resetDragState = () => {
    dragType = null;
    dragCardId = null;
    dragListId = null;
    dragSourceListId = null;
    setOverListId(null);
    setOverCardId(null);
    setOverListDrag(null);
  };
  const handleDragEnd = () => resetDragState();

  // ─────────────────────────────────────────────────────────────
  // LIST OPS
  // ─────────────────────────────────────────────────────────────

  const handleUpdateListName = async (list_id) => {
    if (saveInProgress.current || escapePressed.current) return;
    saveInProgress.current = true;
    const trimmed = editingListNameRef.current.trim();
    if (!trimmed) {
      setEditingListId(null);
      saveInProgress.current = false;
      return;
    }
    setData((prev) =>
      prev.map((l) =>
        l.list_id === list_id ? { ...l, list_name: trimmed } : l,
      ),
    );
    setEditingListId(null);
    try {
      await api.patch(`/tasks/lists/${list_id}`, { list_name: trimmed });
    } catch (err) {
      console.error(err);
    } finally {
      saveInProgress.current = false;
    }
  };

  const deleteList = async (list_id) => {
    try {
      await api.delete(`/tasks/lists/${list_id}`);
      setData((prev) => prev.filter((l) => l.list_id !== list_id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleListColor = (list_id, color) => {
    setData((prev) =>
      prev.map((l) =>
        l.list_id === list_id ? { ...l, list_color: color } : l,
      ),
    );
    setShowColorPicker(null);
    setOpenListMenu(null);
    api
      .patch(`/tasks/lists/${list_id}`, { list_color: color || null })
      .catch(console.error);
  };

  const handleListCreated = (list) =>
    setData((prev) => [...prev, { ...list, cards: [] }]);

  const handleCopyList = async (list) => {
    try {
      await api.post(`/tasks/duplicateList/${board_id}/${list.list_id}`);
      const res = await api.get(`tasks/lists/${board_id}`);
      setData(res.data.lists.map((l) => ({ ...l, cards: l.cards || [] })));
    } catch (err) {
      console.error(err);
    }
    setOpenListMenu(null);
  };

  const handleArchiveList = async (list_id) => {
    try {
      await api.patch(`/tasks/archiveList/${board_id}/${list_id}`, {
        is_archived: 1,
      });
      setData((prev) => prev.filter((l) => l.list_id !== list_id));
    } catch (err) {
      console.error(err);
    }
    setOpenListMenu(null);
  };

  // ─────────────────────────────────────────────────────────────
  // CARD OPS
  // ─────────────────────────────────────────────────────────────

  const handleAddCard = async () => {
    if (!newCard.card_name.trim() || !addCardModal) return;
    const { list_id } = addCardModal;
    const list = data.find((l) => l.list_id === list_id);
    const payload = {
      list_id,
      card_name: newCard.card_name.trim(),
      card_description: newCard.card_description.trim() || null,
      due_date: newCard.due_date || null,
      due_time: newCard.due_time || null,
      card_position: (list?.cards?.length || 0) + 1,
      completed: 0,
      is_archived: 0,
    };
    const tempId = `temp-${Date.now()}`;
    setData((prev) =>
      prev.map((l) =>
        l.list_id === list_id
          ? {
              ...l,
              cards: [...(l.cards || []), { ...payload, card_id: tempId }],
            }
          : l,
      ),
    );
    closeAddCardModal();
    try {
      const res = await api.post(`/tasks/cards`, payload);
      const createdCard = res.data?.card;
      if (createdCard)
        setData((prev) =>
          prev.map((l) =>
            l.list_id === list_id
              ? {
                  ...l,
                  cards: l.cards.map((c) =>
                    c.card_id === tempId ? createdCard : c,
                  ),
                }
              : l,
          ),
        );
    } catch (err) {
      console.error(err);
      setData((prev) =>
        prev.map((l) =>
          l.list_id === list_id
            ? { ...l, cards: l.cards.filter((c) => c.card_id !== tempId) }
            : l,
        ),
      );
    }
  };

  const openAddCardModal = (list_id, list_name) => {
    setAddCardModal({ list_id, list_name });
    setNewCard({
      card_name: "",
      card_description: "",
      due_date: "",
      due_time: "",
    });
  };
  const closeAddCardModal = () => {
    setAddCardModal(null);
    setNewCard({
      card_name: "",
      card_description: "",
      due_date: "",
      due_time: "",
    });
  };

  const handleSaveDescription = async () => {
    if (!selectedCard) return;
    try {
      await api.patch(`/tasks/cards/${board_id}/${selectedCard.card_id}`, {
        card_description: cardDescription,
      });
      setSelectedCard((prev) => ({
        ...prev,
        card_description: cardDescription,
      }));
      setData((prev) =>
        prev.map((l) => ({
          ...l,
          cards: l.cards.map((c) =>
            c.card_id === selectedCard.card_id
              ? { ...c, card_description: cardDescription }
              : c,
          ),
        })),
      );
      setEditingDescription(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleComplete = async (card) => {
    const newVal = !!card.completed ? 0 : 1;
    try {
      await api.patch(`/tasks/cards/${board_id}/${card.card_id}`, {
        completed: newVal,
      });
      setData((prev) =>
        prev.map((l) => ({
          ...l,
          cards: l.cards.map((c) =>
            c.card_id === card.card_id ? { ...c, completed: newVal } : c,
          ),
        })),
      );
      if (selectedCard?.card_id === card.card_id)
        setSelectedCard((prev) => ({ ...prev, completed: newVal }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickEditSave = (card_id, newName) => {
    if (!newName.trim()) return;
    setData((prev) =>
      prev.map((l) => ({
        ...l,
        cards: l.cards.map((c) =>
          c.card_id === card_id ? { ...c, card_name: newName.trim() } : c,
        ),
      })),
    );
    api
      .patch(`/tasks/cards/${board_id}/${card_id}`, {
        card_name: newName.trim(),
      })
      .catch(console.error);
  };

  const handleArchiveCard = async (card_id) => {
    try {
      await api.patch(`/tasks/archiveCard/${board_id}/${card_id}`, {
        is_archived: 1,
      });
      setData((prev) =>
        prev.map((l) => ({
          ...l,
          cards: l.cards.filter((c) => c.card_id !== card_id),
        })),
      );
      closeCard();
    } catch (err) {
      console.error(err);
    }
  };

  const openCard = async (card, listName) => {
    setSelectedCard(card);
    setSelectedListName(listName);
    setCardDescription(card.card_description || "");
    setEditingDescription(false);
    setComments([]);
    setNewComment("");
    setCardQuickEdit(null);
    setCardDetail(null);
    try {
      const res = await api.get(`/tasks/cards/${card.card_id}`);
      const full = res.data?.card;
      if (full) {
        setCardDetail(full);
        setCardDescription(full.card_description || "");
        setComments(full.comments || []);
        setSelectedCard((prev) => ({ ...prev, ...full }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const closeCard = () => {
    setSelectedCard(null);
    setEditingDescription(false);
    setCardDetail(null);
  };
  const toggleCollapse = (list_id) =>
    setCollapsedLists((prev) => ({ ...prev, [list_id]: !prev[list_id] }));

  const handlePublishComment = async () => {
    if (!newComment.trim() || !selectedCard) return;
    const text = newComment.trim();
    setNewComment("");
    setComments((prev) => [
      ...prev,
      {
        content: text,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: "comment",
        isUser: true,
      },
    ]);
    try {
      await api.post(`/users/comment/`, {
        card_id: selectedCard.card_id,
        board_id,
        comment: text,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────

  if (loading)
    return <div className="p-5 text-center text-light">Loading Board...</div>;

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .kanban-card-drag-over { border-color: #579dff !important; box-shadow: 0 0 0 2px rgba(87,157,255,0.35) !important; }
        .kanban-list-drag-over { outline: 2px solid #579dff; outline-offset: 2px; }
        .drop-zone-line { height: 3px; border-radius: 2px; background: #579dff; margin-bottom: 6px; opacity: 0; transition: opacity 0.15s; }
        .drop-zone-line.active { opacity: 1; }
      `}</style>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "12px",
          padding: "16px",
          overflowX: "auto",
          alignItems: "flex-start",
          minHeight: "calc(100vh - 110px)",
        }}
      >
        {data.map((list, listIdx) => {
          const isEditing = editingListId === list.list_id;
          const isCollapsed = collapsedLists[list.list_id];
          const isMenuOpen = openListMenu === list.list_id;
          const isColorOpen = showColorPicker === list.list_id;
          const listColor = list.list_color || "#a07c1e";
          const textColor = getTextColor(listColor);
          const isListDragOver = overListDrag === list.list_id;
          const isDraggingThisList =
            dragType === "list" && dragListId === list.list_id;
          const isCardDropTarget =
            overListId === list.list_id && dragType === "card";

          return (
            <div
              key={list.list_id}
              draggable
              onDragStart={(e) => {
                // Only start list drag from header, not from card area
                if (dragType === "card") return;
                handleListDragStart(e, list.list_id);
              }}
              onDragOver={(e) => {
                handleListDragOver(e, list.list_id);
                handleListBodyDragOver(e, list.list_id);
              }}
              onDrop={(e) => {
                if (dragType === "list") handleListDrop(e, list.list_id);
                else handleListBodyDrop(e, list.list_id);
              }}
              onDragEnd={handleDragEnd}
              style={{
                minWidth: isCollapsed ? "56px" : "272px",
                width: isCollapsed ? "56px" : "272px",
                backgroundColor: listColor,
                borderRadius: "12px",
                padding: isCollapsed ? "12px 8px" : "10px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                flexShrink: 0,
                transition:
                  "width 0.2s ease, min-width 0.2s ease, opacity 0.15s",
                position: "relative",
                opacity: isDraggingThisList ? 0.4 : 1,
                outline: isListDragOver ? "2px solid #579dff" : "none",
                outlineOffset: "2px",
              }}
            >
              {/* List Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: isCollapsed ? 0 : "4px",
                  minHeight: "28px",
                }}
              >
                {isCollapsed ? (
                  <button
                    onClick={() => toggleCollapse(list.list_id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: textColor,
                      fontSize: "14px",
                      cursor: "pointer",
                      padding: "2px 4px",
                      transform: "rotate(90deg)",
                    }}
                  >
                    ⇄
                  </button>
                ) : (
                  <>
                    {isEditing ? (
                      <input
                        autoFocus
                        type="text"
                        value={editingListName}
                        onChange={(e) => {
                          setEditingListName(e.target.value);
                          editingListNameRef.current = e.target.value;
                        }}
                        onBlur={() => handleUpdateListName(list.list_id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleUpdateListName(list.list_id);
                          }
                          if (e.key === "Escape") {
                            escapePressed.current = true;
                            setEditingListId(null);
                            setTimeout(() => {
                              escapePressed.current = false;
                            }, 100);
                          }
                        }}
                        style={{
                          flex: 1,
                          background: "rgba(0,0,0,0.2)",
                          border: `1px solid ${textColor}60`,
                          borderRadius: "6px",
                          color: textColor,
                          fontWeight: "700",
                          fontSize: "15px",
                          padding: "2px 6px",
                          outline: "none",
                        }}
                      />
                    ) : (
                      <span
                        onClick={() => {
                          saveInProgress.current = false;
                          escapePressed.current = false;
                          editingListNameRef.current = list.list_name;
                          setEditingListName(list.list_name);
                          setEditingListId(list.list_id);
                        }}
                        title="Click to rename"
                        style={{
                          flex: 1,
                          color: textColor,
                          fontWeight: "700",
                          fontSize: "15px",
                          cursor: "pointer",
                          userSelect: "none",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {list.list_name}
                      </span>
                    )}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        marginLeft: "6px",
                        flexShrink: 0,
                      }}
                    >
                      <button
                        onClick={() => toggleCollapse(list.list_id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: textColor,
                          fontSize: "14px",
                          cursor: "pointer",
                          padding: "2px 4px",
                          lineHeight: 1,
                          opacity: 0.85,
                        }}
                      >
                        ⇄
                      </button>
                      <div style={{ position: "relative" }}>
                        <button
                          onClick={() => {
                            setOpenListMenu(isMenuOpen ? null : list.list_id);
                            if (isMenuOpen) setShowColorPicker(null);
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            color: textColor,
                            fontSize: "18px",
                            cursor: "pointer",
                            padding: "0 4px",
                            lineHeight: 1,
                            opacity: 0.85,
                            letterSpacing: "1px",
                          }}
                        >
                          ···
                        </button>
                        {isMenuOpen && (
                          <>
                            <div
                              style={{
                                position: "fixed",
                                inset: 0,
                                zIndex: 999,
                              }}
                              onClick={() => {
                                setOpenListMenu(null);
                                setShowColorPicker(null);
                              }}
                            />
                            <div
                              style={{
                                position: "absolute",
                                top: "calc(100% + 4px)",
                                right: 0,
                                zIndex: 1000,
                                backgroundColor: "#22272b",
                                border: "1px solid #3d444d",
                                borderRadius: "8px",
                                minWidth: "200px",
                                boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                                overflow: "hidden",
                              }}
                            >
                              {[
                                {
                                  label: "Add a card",
                                  action: () => {
                                    openAddCardModal(
                                      list.list_id,
                                      list.list_name,
                                    );
                                    setOpenListMenu(null);
                                  },
                                },
                                {
                                  label: "Copy list",
                                  action: () => handleCopyList(list),
                                },
                                {
                                  label: "Archive this list",
                                  action: () => handleArchiveList(list.list_id),
                                },
                              ].map(({ label, action }) => (
                                <div
                                  key={label}
                                  onClick={action}
                                  style={{
                                    padding: "9px 14px",
                                    fontSize: "13px",
                                    color: "#dee2e6",
                                    cursor: "pointer",
                                  }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.background =
                                      "#2c3338")
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.background =
                                      "transparent")
                                  }
                                >
                                  {label}
                                </div>
                              ))}
                              <div
                                onClick={() =>
                                  setShowColorPicker(
                                    isColorOpen ? null : list.list_id,
                                  )
                                }
                                style={{
                                  padding: "9px 14px",
                                  fontSize: "13px",
                                  color: "#dee2e6",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  backgroundColor: isColorOpen
                                    ? "#2c3338"
                                    : "transparent",
                                }}
                                onMouseEnter={(e) => {
                                  if (!isColorOpen)
                                    e.currentTarget.style.background =
                                      "#2c3338";
                                }}
                                onMouseLeave={(e) => {
                                  if (!isColorOpen)
                                    e.currentTarget.style.background =
                                      "transparent";
                                }}
                              >
                                Change list color{" "}
                                <span
                                  style={{ color: "#9fadbc", fontSize: "12px" }}
                                >
                                  {isColorOpen ? "∧" : "∨"}
                                </span>
                              </div>
                              {isColorOpen && (
                                <div
                                  style={{
                                    padding: "8px 12px",
                                    borderTop: "1px solid #3d444d",
                                    borderBottom: "1px solid #3d444d",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "grid",
                                      gridTemplateColumns: "repeat(5, 1fr)",
                                      gap: "5px",
                                      marginBottom: "8px",
                                    }}
                                  >
                                    {LIST_COLORS.map((color) => (
                                      <div
                                        key={color}
                                        onClick={() =>
                                          handleListColor(list.list_id, color)
                                        }
                                        style={{
                                          height: "28px",
                                          borderRadius: "5px",
                                          backgroundColor: color,
                                          cursor: "pointer",
                                          border:
                                            listColor === color
                                              ? "2.5px solid #fff"
                                              : "2px solid transparent",
                                          transition: "transform 0.1s",
                                        }}
                                        onMouseEnter={(e) =>
                                          (e.currentTarget.style.transform =
                                            "scale(1.1)")
                                        }
                                        onMouseLeave={(e) =>
                                          (e.currentTarget.style.transform =
                                            "scale(1)")
                                        }
                                      />
                                    ))}
                                  </div>
                                  <div
                                    onClick={() =>
                                      handleListColor(list.list_id, null)
                                    }
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      gap: "6px",
                                      padding: "6px 0",
                                      color: "#b6c2cf",
                                      fontSize: "12px",
                                      cursor: "pointer",
                                      borderTop: "1px solid #3d444d",
                                    }}
                                    onMouseEnter={(e) =>
                                      (e.currentTarget.style.color = "#fff")
                                    }
                                    onMouseLeave={(e) =>
                                      (e.currentTarget.style.color = "#b6c2cf")
                                    }
                                  >
                                    ✕ Remove color
                                  </div>
                                </div>
                              )}
                              <div
                                onClick={() => {
                                  deleteList(list.list_id);
                                  setOpenListMenu(null);
                                }}
                                style={{
                                  padding: "9px 14px",
                                  fontSize: "13px",
                                  color: "#f87171",
                                  cursor: "pointer",
                                }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.background = "#2c3338")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.background =
                                    "transparent")
                                }
                              >
                                Delete list
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Cards area */}
              {!isCollapsed && (
                <>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0px",
                      minHeight: "8px",
                    }}
                    onDragOver={(e) => handleListBodyDragOver(e, list.list_id)}
                    onDrop={(e) => {
                      if (dragType === "card")
                        handleListBodyDrop(e, list.list_id);
                    }}
                  >
                    {(list.cards || []).length === 0 ? (
                      <div
                        style={{
                          minHeight: "48px",
                          borderRadius: "6px",
                          border: isCardDropTarget
                            ? "2px dashed #579dff"
                            : "2px dashed transparent",
                          backgroundColor: isCardDropTarget
                            ? "rgba(87,157,255,0.06)"
                            : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: isCardDropTarget ? "#579dff" : "transparent",
                          fontSize: "12px",
                          transition: "all 0.15s",
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setOverListId(list.list_id);
                        }}
                        onDrop={(e) => handleListBodyDrop(e, list.list_id)}
                      >
                        Drop cards here
                      </div>
                    ) : (
                      (list.cards || []).map((card) => {
                        const isOver =
                          overCardId === card.card_id && dragType === "card";
                        const isDraggingCard =
                          dragType === "card" && dragCardId === card.card_id;
                        return (
                          <React.Fragment key={card.card_id}>
                            {/* Drop indicator line */}
                            <div
                              className={`drop-zone-line${isOver ? " active" : ""}`}
                            />
                            <div
                              draggable
                              onDragStart={(e) => {
                                e.stopPropagation();
                                handleCardDragStart(
                                  e,
                                  card.card_id,
                                  list.list_id,
                                );
                              }}
                              onDragOver={(e) => {
                                e.stopPropagation();
                                handleCardDragOver(
                                  e,
                                  card.card_id,
                                  list.list_id,
                                );
                              }}
                              onDrop={(e) => {
                                e.stopPropagation();
                                handleCardDrop(e, card.card_id, list.list_id);
                              }}
                              onDragEnd={(e) => {
                                e.stopPropagation();
                                handleDragEnd();
                              }}
                              onClick={() => openCard(card, list.list_name)}
                              style={{
                                backgroundColor: "#2c2c2c",
                                borderRadius: "8px",
                                padding: "9px 10px",
                                cursor: "pointer",
                                border: isOver
                                  ? "2px solid #579dff"
                                  : "2px solid transparent",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                transition:
                                  "border-color 0.15s, background 0.15s",
                                opacity: isDraggingCard
                                  ? 0.35
                                  : String(card.card_id).startsWith("temp-")
                                    ? 0.7
                                    : 1,
                                marginBottom: "6px",
                                userSelect: "none",
                              }}
                              onMouseEnter={(e) => {
                                if (!isDraggingCard) {
                                  e.currentTarget.style.borderColor =
                                    "rgba(255,255,255,0.7)";
                                  e.currentTarget.style.backgroundColor =
                                    "#353535";
                                }
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = isOver
                                  ? "#579dff"
                                  : "transparent";
                                e.currentTarget.style.backgroundColor =
                                  "#2c2c2c";
                              }}
                            >
                              {/* Complete toggle */}
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleComplete(card);
                                }}
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  borderRadius: "50%",
                                  border: !!card.completed
                                    ? "2px solid #4bce97"
                                    : "2px solid #888",
                                  backgroundColor: !!card.completed
                                    ? "#4bce97"
                                    : "transparent",
                                  flexShrink: 0,
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {!!card.completed && (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="9"
                                    height="9"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                    stroke="#1d2125"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <polyline points="2,6 5,9 10,3" />
                                  </svg>
                                )}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                {card.labels?.length > 0 && (
                                  <div
                                    style={{
                                      display: "flex",
                                      gap: "3px",
                                      flexWrap: "wrap",
                                      marginBottom: "4px",
                                    }}
                                  >
                                    {card.labels.map((lbl) => (
                                      <span
                                        key={lbl.label_id}
                                        style={{
                                          backgroundColor: lbl.label_color,
                                          borderRadius: "3px",
                                          padding: "2px 6px",
                                          fontSize: "10px",
                                          fontWeight: "600",
                                          color: getTextColor(lbl.label_color),
                                        }}
                                      >
                                        {lbl.label_name || ""}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                <span
                                  style={{
                                    fontSize: "13px",
                                    color: !!card.completed
                                      ? "#888"
                                      : "#e0e0e0",
                                    display: "block",
                                    textDecoration: !!card.completed
                                      ? "line-through"
                                      : "none",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {card.card_name}
                                </span>
                                {card.due_date && (
                                  <span
                                    style={{
                                      display: "inline-block",
                                      marginTop: "3px",
                                      backgroundColor: !!card.completed
                                        ? "#4bce97"
                                        : "#f87462",
                                      color: "#1d2125",
                                      fontSize: "10px",
                                      borderRadius: "4px",
                                      padding: "1px 5px",
                                      fontWeight: 600,
                                    }}
                                  >
                                    📅 {card.due_date}
                                    {card.due_time ? ` ${card.due_time}` : ""}
                                  </span>
                                )}
                                {(card.attachmentCount > 0 ||
                                  card.checklistItemCount > 0) && (
                                  <div
                                    style={{
                                      display: "flex",
                                      gap: "8px",
                                      marginTop: "4px",
                                    }}
                                  >
                                    {card.attachmentCount > 0 && (
                                      <span
                                        style={{
                                          fontSize: "11px",
                                          color: "#9fadbc",
                                        }}
                                      >
                                        📎 {card.attachmentCount}
                                      </span>
                                    )}
                                    {card.checklistItemCount > 0 && (
                                      <span
                                        style={{
                                          fontSize: "11px",
                                          color: "#9fadbc",
                                        }}
                                      >
                                        ☑ {card.checklistItemCount}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                              {/* Quick edit */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const rect = (
                                    e.currentTarget.parentElement ||
                                    e.currentTarget
                                  ).getBoundingClientRect();
                                  setCardQuickEdit({
                                    card,
                                    listName: list.list_name,
                                    listIdx,
                                    rect,
                                  });
                                }}
                                title="Quick edit"
                                style={{
                                  background: "none",
                                  border: "none",
                                  color: "#aaa",
                                  cursor: "pointer",
                                  padding: "2px",
                                  flexShrink: 0,
                                  display: "flex",
                                  alignItems: "center",
                                  borderRadius: "4px",
                                }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.color = "#fff")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.color = "#aaa")
                                }
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                              </button>
                            </div>
                          </React.Fragment>
                        );
                      })
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "2px",
                      padding: "2px 0",
                    }}
                  >
                    <button
                      onClick={() =>
                        openAddCardModal(list.list_id, list.list_name)
                      }
                      style={{
                        background: "none",
                        border: "none",
                        color: textColor,
                        fontSize: "13px",
                        fontWeight: "500",
                        cursor: "pointer",
                        padding: "4px 2px",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        opacity: 0.9,
                      }}
                    >
                      <span style={{ fontSize: "16px", lineHeight: 1 }}>+</span>{" "}
                      Add a card
                    </button>
                    <button
                      style={{
                        background: "none",
                        border: `1px solid ${textColor}60`,
                        borderRadius: "6px",
                        color: textColor,
                        fontSize: "14px",
                        cursor: "pointer",
                        padding: "3px 6px",
                        lineHeight: 1,
                        opacity: 0.8,
                      }}
                      title="Card templates"
                    >
                      ⊞
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}

        <button
          onClick={() => setShowAddListModal(true)}
          style={{
            minWidth: "272px",
            width: "272px",
            backgroundColor: "rgba(255,255,255,0.15)",
            border: "none",
            borderRadius: "12px",
            padding: "10px 14px",
            color: "#fff",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            textAlign: "left",
            flexShrink: 0,
            alignSelf: "flex-start",
          }}
        >
          + Add list
        </button>
      </div>

      {/* Add List Modal */}
      {showAddListModal && (
        <AddListModal
          board_id={board_id}
          onClose={() => setShowAddListModal(false)}
          onCreated={handleListCreated}
        />
      )}

      {/* Card Quick-Edit */}
      {cardQuickEdit && (
        <CardQuickEdit
          card={cardQuickEdit.card}
          listName={cardQuickEdit.listName}
          anchorRect={cardQuickEdit.rect}
          onClose={() => setCardQuickEdit(null)}
          onSave={(newName) =>
            handleQuickEditSave(cardQuickEdit.card.card_id, newName)
          }
          onOpen={() => openCard(cardQuickEdit.card, cardQuickEdit.listName)}
          onEditLabels={() => setShowLabelsModal(true)}
        />
      )}

      {/* Add Card Modal */}
      {addCardModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 4000,
            backgroundColor: "rgba(0,0,0,0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={closeAddCardModal}
        >
          <div
            style={{
              width: "460px",
              backgroundColor: "#282e33",
              color: "#b6c2cf",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h6
                style={{
                  fontWeight: "700",
                  margin: 0,
                  color: "#b6c2cf",
                  fontSize: "15px",
                }}
              >
                Add card to{" "}
                <span style={{ color: "#579dff" }}>
                  {addCardModal.list_name}
                </span>
              </h6>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#9fadbc",
                  fontSize: "22px",
                  lineHeight: 1,
                  cursor: "pointer",
                }}
                onClick={closeAddCardModal}
              >
                ×
              </button>
            </div>
            <div style={{ marginBottom: "14px" }}>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#9fadbc",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Card Title <span style={{ color: "#f87462" }}>*</span>
              </label>
              <input
                autoFocus
                type="text"
                placeholder="Enter a title for this card..."
                value={newCard.card_name}
                onChange={(e) =>
                  setNewCard((p) => ({ ...p, card_name: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddCard();
                  if (e.key === "Escape") closeAddCardModal();
                }}
                style={{
                  width: "100%",
                  backgroundColor: "#22272b",
                  color: "#b6c2cf",
                  border: "1px solid #454f59",
                  borderRadius: "6px",
                  padding: "9px 12px",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ marginBottom: "14px" }}>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#9fadbc",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Description
              </label>
              <textarea
                placeholder="Add a more detailed description (optional)..."
                rows={3}
                value={newCard.card_description}
                onChange={(e) =>
                  setNewCard((p) => ({
                    ...p,
                    card_description: e.target.value,
                  }))
                }
                style={{
                  width: "100%",
                  backgroundColor: "#22272b",
                  color: "#b6c2cf",
                  border: "1px solid #454f59",
                  borderRadius: "6px",
                  padding: "9px 12px",
                  fontSize: "14px",
                  resize: "vertical",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#9fadbc",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Due Date
                </label>
                <input
                  type="date"
                  value={newCard.due_date}
                  onChange={(e) =>
                    setNewCard((p) => ({ ...p, due_date: e.target.value }))
                  }
                  style={{
                    width: "100%",
                    backgroundColor: "#22272b",
                    color: "#b6c2cf",
                    border: "1px solid #454f59",
                    borderRadius: "6px",
                    padding: "9px 12px",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#9fadbc",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Due Time
                </label>
                <input
                  type="time"
                  value={newCard.due_time}
                  onChange={(e) =>
                    setNewCard((p) => ({ ...p, due_time: e.target.value }))
                  }
                  style={{
                    width: "100%",
                    backgroundColor: "#22272b",
                    color: "#b6c2cf",
                    border: "1px solid #454f59",
                    borderRadius: "6px",
                    padding: "9px 12px",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={handleAddCard}
                disabled={!newCard.card_name.trim()}
                style={{
                  backgroundColor: "#579dff",
                  border: "none",
                  borderRadius: "6px",
                  color: "#fff",
                  padding: "9px 20px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: newCard.card_name.trim() ? "pointer" : "not-allowed",
                  opacity: newCard.card_name.trim() ? 1 : 0.5,
                }}
              >
                Add Card
              </button>
              <button
                onClick={closeAddCardModal}
                style={{
                  backgroundColor: "#374048",
                  border: "none",
                  borderRadius: "6px",
                  color: "#9fadbc",
                  padding: "9px 16px",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Card Detail Modal */}
      {selectedCard && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 3000,
            backgroundColor: "rgba(0,0,0,0.72)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={closeCard}
        >
          <div
            style={{
              width: "900px",
              maxWidth: "95vw",
              maxHeight: "90vh",
              backgroundColor: "#1d2125",
              borderRadius: "12px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 20px",
                backgroundColor: "#1d2125",
                borderBottom: "1px solid #2d3540",
                flexShrink: 0,
              }}
            >
              <button
                style={{
                  backgroundColor: "#a07c1e",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "5px 14px",
                  fontWeight: "700",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                {selectedListName}
              </button>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <button
                  onClick={() => handleArchiveCard(selectedCard.card_id)}
                  style={{
                    background: "none",
                    border: "1px solid #3d444d",
                    color: "#9fadbc",
                    cursor: "pointer",
                    borderRadius: "6px",
                    padding: "5px 12px",
                    fontSize: "13px",
                  }}
                >
                  Archive
                </button>
                <button
                  onClick={closeCard}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#9fadbc",
                    cursor: "pointer",
                    padding: "4px",
                    fontSize: "22px",
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
              {/* Left */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "28px 32px",
                  borderRight: "1px solid #2d3540",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "16px",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    onClick={() => handleToggleComplete(selectedCard)}
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      border: !!selectedCard.completed
                        ? "2px solid #4bce97"
                        : "2px solid #6b7280",
                      backgroundColor: !!selectedCard.completed
                        ? "#4bce97"
                        : "transparent",
                      flexShrink: 0,
                      marginTop: "4px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {!!selectedCard.completed && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="#1d2125"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="2,6 5,9 10,3" />
                      </svg>
                    )}
                  </div>
                  <h2
                    style={{
                      color: "#e0e6ed",
                      fontSize: "22px",
                      fontWeight: "700",
                      margin: 0,
                      lineHeight: 1.3,
                    }}
                  >
                    {selectedCard.card_name}
                  </h2>
                </div>

                {(cardDetail?.labels || selectedCard.labels)?.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                      flexWrap: "wrap",
                      marginBottom: "16px",
                    }}
                  >
                    {(cardDetail?.labels || selectedCard.labels).map((lbl) => (
                      <span
                        key={lbl.label_id}
                        style={{
                          backgroundColor: lbl.label_color,
                          borderRadius: "4px",
                          padding: "4px 10px",
                          fontSize: "12px",
                          fontWeight: "600",
                          color: getTextColor(lbl.label_color),
                        }}
                      >
                        {lbl.label_name || ""}
                      </span>
                    ))}
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                    marginBottom: "28px",
                  }}
                >
                  {["Dates", "Checklist", "Members"].map((label) => (
                    <button
                      key={label}
                      style={{
                        backgroundColor: "#2c3338",
                        border: "1px solid #3d444d",
                        borderRadius: "6px",
                        color: "#b6c2cf",
                        fontSize: "13px",
                        padding: "6px 14px",
                        cursor: "pointer",
                      }}
                    >
                      {label}
                    </button>
                  ))}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowLabelsModal(true);
                    }}
                    style={{
                      backgroundColor: "#2c3338",
                      border: "1px solid #3d444d",
                      borderRadius: "6px",
                      color: "#b6c2cf",
                      fontSize: "13px",
                      padding: "6px 14px",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#374048")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#2c3338")
                    }
                  >
                    Labels
                  </button>
                </div>

                {(selectedCard.due_date || selectedCard.due_time) && (
                  <div style={{ marginBottom: "20px" }}>
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#9fadbc",
                        marginBottom: "6px",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Due Date
                    </div>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        backgroundColor: !!selectedCard.completed
                          ? "#4bce97"
                          : "#f87462",
                        color: "#1d2125",
                        fontSize: "13px",
                        fontWeight: 600,
                        borderRadius: "6px",
                        padding: "4px 10px",
                      }}
                    >
                      📅 {selectedCard.due_date}
                      {selectedCard.due_time && ` at ${selectedCard.due_time}`}
                    </div>
                  </div>
                )}

                <div style={{ marginBottom: "24px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "700",
                        color: "#e0e6ed",
                        fontSize: "15px",
                      }}
                    >
                      📝 Description
                    </span>
                  </div>
                  {editingDescription ? (
                    <RichDescriptionEditor
                      value={cardDescription}
                      onChange={setCardDescription}
                      onSave={handleSaveDescription}
                      onCancel={() => setEditingDescription(false)}
                    />
                  ) : cardDescription ? (
                    <div
                      onClick={() => setEditingDescription(true)}
                      style={{
                        minHeight: "80px",
                        backgroundColor: "#22272b",
                        border: "1px solid #3d444d",
                        borderRadius: "8px",
                        padding: "12px 14px",
                        color: "#b6c2cf",
                        fontSize: "14px",
                        cursor: "pointer",
                        lineHeight: 1.6,
                      }}
                      dangerouslySetInnerHTML={{ __html: cardDescription }}
                    />
                  ) : (
                    <div
                      onClick={() => setEditingDescription(true)}
                      style={{
                        minHeight: "80px",
                        backgroundColor: "#22272b",
                        border: "1px solid #3d444d",
                        borderRadius: "8px",
                        padding: "12px 14px",
                        color: "#6b7280",
                        fontSize: "14px",
                        cursor: "pointer",
                        lineHeight: 1.6,
                      }}
                    >
                      Add a more detailed description...
                    </div>
                  )}
                </div>

                {cardDetail?.checklists?.map((checklist) => (
                  <div
                    key={checklist.checklist_id}
                    style={{ marginBottom: "20px" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "700",
                          color: "#e0e6ed",
                          fontSize: "15px",
                        }}
                      >
                        ☑ {checklist.checklist_title}
                      </span>
                      <span style={{ fontSize: "12px", color: "#9fadbc" }}>
                        {checklist.items?.filter((i) => i.is_completed)
                          .length || 0}
                        /{checklist.items?.length || 0}
                      </span>
                    </div>
                    <div
                      style={{
                        height: "4px",
                        backgroundColor: "#3d444d",
                        borderRadius: "2px",
                        marginBottom: "10px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          backgroundColor: "#4bce97",
                          width: `${checklist.items?.length ? (checklist.items.filter((i) => i.is_completed).length / checklist.items.length) * 100 : 0}%`,
                          transition: "width 0.3s",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                      }}
                    >
                      {checklist.items?.map((item) => (
                        <div
                          key={item.item_id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <div
                            style={{
                              width: "14px",
                              height: "14px",
                              borderRadius: "3px",
                              border: item.is_completed
                                ? "none"
                                : "2px solid #6b7280",
                              backgroundColor: item.is_completed
                                ? "#579dff"
                                : "transparent",
                              flexShrink: 0,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {item.is_completed && (
                              <svg
                                width="9"
                                height="9"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#fff"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </div>
                          <span
                            style={{
                              fontSize: "13px",
                              color: item.is_completed ? "#6b7280" : "#b6c2cf",
                              textDecoration: item.is_completed
                                ? "line-through"
                                : "none",
                            }}
                          >
                            {item.item_text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {cardDetail?.attachments?.length > 0 && (
                  <div style={{ marginBottom: "20px" }}>
                    <span
                      style={{
                        fontWeight: "700",
                        color: "#e0e6ed",
                        fontSize: "15px",
                        display: "block",
                        marginBottom: "10px",
                      }}
                    >
                      📎 Attachments
                    </span>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      {cardDetail.attachments.map((att) => (
                        <div
                          key={att.attachment_id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            backgroundColor: "#22272b",
                            borderRadius: "6px",
                            padding: "8px 12px",
                          }}
                        >
                          <span style={{ fontSize: "20px" }}>
                            {att.attachment_type === "link" ? "🔗" : "📄"}
                          </span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            {att.attachment_type === "link" ? (
                              <a
                                href={att.external_url}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  color: "#579dff",
                                  fontSize: "13px",
                                  textDecoration: "none",
                                }}
                              >
                                {att.attachment_name}
                              </a>
                            ) : (
                              <span
                                style={{ color: "#b6c2cf", fontSize: "13px" }}
                              >
                                {att.attachment_name}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: comments */}
              <div
                style={{
                  width: "340px",
                  flexShrink: 0,
                  overflowY: "auto",
                  padding: "20px",
                  backgroundColor: "#1d2125",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "700",
                      color: "#e0e6ed",
                      fontSize: "15px",
                    }}
                  >
                    💬 Comments
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newComment.trim())
                      handlePublishComment();
                  }}
                  style={{
                    width: "100%",
                    backgroundColor: "#22272b",
                    border: "1px solid #3d444d",
                    borderRadius: "8px",
                    color: "#b6c2cf",
                    padding: "10px 14px",
                    fontSize: "14px",
                    outline: "none",
                    marginBottom: "8px",
                    boxSizing: "border-box",
                  }}
                />
                {newComment.trim() && (
                  <button
                    onClick={handlePublishComment}
                    style={{
                      alignSelf: "flex-start",
                      backgroundColor: "#579dff",
                      border: "none",
                      borderRadius: "6px",
                      color: "#fff",
                      padding: "6px 16px",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                      marginBottom: "12px",
                    }}
                  >
                    Save
                  </button>
                )}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  {selectedCard.card_created && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: "50%",
                          backgroundColor: "#e07b3f",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "700",
                          fontSize: "12px",
                          color: "#fff",
                          flexShrink: 0,
                        }}
                      >
                        U
                      </div>
                      <div>
                        <div style={{ fontSize: "13px", color: "#dee2e6" }}>
                          <span style={{ fontWeight: "600" }}>You</span> added
                          this card to{" "}
                          <span style={{ color: "#579dff", fontWeight: "500" }}>
                            {selectedListName}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#579dff",
                            marginTop: "2px",
                          }}
                        >
                          {new Date(selectedCard.card_created).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}
                  {comments.map((c, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: "50%",
                          backgroundColor: c.isUser ? "#579dff" : "#6b7280",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "700",
                          fontSize: "12px",
                          color: "#fff",
                          flexShrink: 0,
                        }}
                      >
                        U
                      </div>
                      <div>
                        <div style={{ fontSize: "13px", color: "#dee2e6" }}>
                          <span style={{ fontWeight: "600" }}>You</span>
                          {c.time && (
                            <span
                              style={{ color: "#9fadbc", fontSize: "11px" }}
                            >
                              {" "}
                              {c.time}
                            </span>
                          )}
                        </div>
                        <div
                          style={{
                            backgroundColor: "#2c3338",
                            borderRadius: "6px",
                            padding: "8px 10px",
                            fontSize: "13px",
                            color: "#b6c2cf",
                            marginTop: "4px",
                          }}
                        >
                          {c.content || c.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Labels Modal */}
      {showLabelsModal && selectedCard && (
        <LabelsModal
          onClose={() => setShowLabelsModal(false)}
          board_id={board_id}
          card_id={selectedCard.card_id}
        />
      )}
    </>
  );
};

export default BoardCards;
