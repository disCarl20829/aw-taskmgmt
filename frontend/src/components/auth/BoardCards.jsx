import React, { useState, useEffect, useRef } from "react";
import api from "../../config/api";
import {
  Navbar, Nav, Button, Form, OverlayTrigger, Popover, ListGroup,
  Container, Row, Col, Overlay, Modal, Dropdown,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// ── Colour palette for lists ──────────────────────────────────
const LIST_COLORS = [
  "#4a7c59", "#a07c1e", "#c05c2a", "#b83232", "#7b4f9e",
  "#2a6db5", "#2a8a8a", "#5a7a2a", "#b84f8a", "#7a7a7a",
];

// ── Label Colors palette ──────────────────────────────────────
const LABEL_COLORS = [
  "#61bd4f", "#f2d600", "#ff9f1a", "#eb5a46", "#c377e0",
  "#0079bf", "#00c2e0", "#51e898", "#ff78cb", "#344563",
  "#b6bbbf", "#dfe1e6", "#fce4d6", "#fdf3c0", "#e4f9ec",
  "#fce0dc", "#e6f0ff", "#e6fcef", "#e3fcef", "#f4e0ff",
  "#ffece6", "#e6fcff", "#fff7cc", "#ffdde6", "#f0f0f0",
  "#292f33",
];

// ── Contrast helper ───────────────────────────────────────────
function getTextColor(hex) {
  if (!hex) return "#f5c518";
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.45 ? "#1d2125" : "#f5c518";
}

// ── Link Insert Modal ─────────────────────────────────────────
function LinkModal({ onInsert, onCancel }) {
  const [url, setUrl] = useState("");
  const [display, setDisplay] = useState("");
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9000, backgroundColor: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onCancel}>
      <div style={{ backgroundColor: "#282e33", borderRadius: "10px", padding: "24px", width: "360px", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "13px", fontWeight: "700", color: "#dee2e6", display: "block", marginBottom: "6px" }}>Link <span style={{ color: "#f87462" }}>*</span></label>
          <input autoFocus type="url" placeholder="Paste a link" value={url} onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && url.trim()) onInsert(url.trim(), display.trim()); if (e.key === "Escape") onCancel(); }}
            style={{ width: "100%", backgroundColor: "#22272b", color: "#b6c2cf", border: "2px solid #579dff", borderRadius: "6px", padding: "10px 12px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "13px", fontWeight: "700", color: "#dee2e6", display: "block", marginBottom: "6px" }}>Display text (optional)</label>
          <input type="text" placeholder="Text to display" value={display} onChange={(e) => setDisplay(e.target.value)}
            style={{ width: "100%", backgroundColor: "#22272b", color: "#b6c2cf", border: "1px solid #3d444d", borderRadius: "6px", padding: "10px 12px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
          <p style={{ fontSize: "12px", color: "#9fadbc", margin: "6px 0 0" }}>Give this link a title or description</p>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <button onClick={onCancel} style={{ background: "none", border: "none", color: "#9fadbc", padding: "8px 16px", fontSize: "14px", cursor: "pointer", borderRadius: "6px" }}>Cancel</button>
          <button onClick={() => { if (url.trim()) onInsert(url.trim(), display.trim()); }} disabled={!url.trim()}
            style={{ backgroundColor: url.trim() ? "#579dff" : "#3a4a5a", border: "none", borderRadius: "6px", color: "#fff", padding: "8px 20px", fontSize: "14px", fontWeight: "600", cursor: url.trim() ? "pointer" : "not-allowed" }}>
            Insert
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Image Insert Modal ────────────────────────────────────────
function ImageModal({ onInsert, onCancel }) {
  const [url, setUrl] = useState("");
  const fileRef = useRef(null);
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onInsert(ev.target.result);
    reader.readAsDataURL(file);
  };
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9000, backgroundColor: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onCancel}>
      <div style={{ backgroundColor: "#282e33", borderRadius: "12px", padding: "28px 28px 20px", width: "420px", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <span style={{ fontSize: "16px", fontWeight: "700", color: "#dee2e6" }}>Select image</span>
          <button onClick={onCancel} style={{ background: "none", border: "none", color: "#9fadbc", cursor: "pointer", fontSize: "22px", lineHeight: 1 }}>×</button>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "13px", fontWeight: "600", color: "#9fadbc", display: "block", marginBottom: "8px" }}>Attach an image link</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input autoFocus type="url" placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && url.trim()) onInsert(url.trim()); if (e.key === "Escape") onCancel(); }}
              style={{ flex: 1, backgroundColor: "#22272b", color: "#b6c2cf", border: "1px solid #3d444d", borderRadius: "6px", padding: "10px 12px", fontSize: "14px", outline: "none" }} />
            <button onClick={() => { if (url.trim()) onInsert(url.trim()); }}
              style={{ backgroundColor: "#3d444d", border: "none", borderRadius: "6px", color: "#dee2e6", padding: "10px 18px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>Submit</button>
          </div>
        </div>
        <div style={{ height: "1px", backgroundColor: "#3d444d", margin: "16px 0" }} />
        <button onClick={() => fileRef.current?.click()}
          style={{ width: "100%", backgroundColor: "#3d444d", border: "none", borderRadius: "8px", color: "#dee2e6", padding: "14px", fontSize: "14px", fontWeight: "500", cursor: "pointer" }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#474f59"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#3d444d"}>
          Upload from your computer
        </button>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
      </div>
    </div>
  );
}

// ── Rich-text toolbar for description ────────────────────────
function RichDescriptionEditor({ value, onChange, onSave, onCancel }) {
  const editorRef = useRef(null);
  const [showTtMenu, setShowTtMenu] = useState(false);
  const [showListMenu, setShowListMenu] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const savedRangeRef = useRef(null);

  const exec = (cmd, val = null) => { editorRef.current.focus(); document.execCommand(cmd, false, val); onChange(editorRef.current.innerHTML); };
  const saveSelection = () => { const sel = window.getSelection(); if (sel && sel.rangeCount > 0) savedRangeRef.current = sel.getRangeAt(0); };
  const restoreSelection = () => { const sel = window.getSelection(); if (sel && savedRangeRef.current) { sel.removeAllRanges(); sel.addRange(savedRangeRef.current); } };
  const handleInput = () => { onChange(editorRef.current.innerHTML); };

  useEffect(() => { if (editorRef.current) editorRef.current.innerHTML = value || ""; }, []); // eslint-disable-line

  const applyBlock = (tag) => { editorRef.current.focus(); document.execCommand("formatBlock", false, tag); onChange(editorRef.current.innerHTML); setShowTtMenu(false); };

  const handleInsertLink = (url, displayText) => {
    restoreSelection(); editorRef.current.focus();
    const sel = window.getSelection();
    if (displayText && sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0); range.deleteContents();
      const a = document.createElement("a"); a.href = url; a.textContent = displayText; a.style.color = "#579dff"; range.insertNode(a);
    } else { document.execCommand("createLink", false, url); }
    onChange(editorRef.current.innerHTML); setShowLinkModal(false);
  };

  const handleInsertImage = (src) => { restoreSelection(); editorRef.current.focus(); document.execCommand("insertImage", false, src); onChange(editorRef.current.innerHTML); setShowImageModal(false); };

  const btnBase = { background: "none", border: "none", color: "#b6c2cf", cursor: "pointer", padding: "4px 7px", borderRadius: "4px", lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center" };
  const sep = <div style={{ width: "1px", backgroundColor: "#3d444d", alignSelf: "stretch", margin: "0 3px" }} />;
  const chevron = (<svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>);

  return (
    <>
      <div style={{ border: "2px solid #579dff", borderRadius: "8px", overflow: "visible", backgroundColor: "#22272b", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1px", padding: "5px 8px", backgroundColor: "#1a1f23", borderBottom: "1px solid #3d444d", flexWrap: "wrap", borderRadius: "6px 6px 0 0" }}>
          <div style={{ position: "relative" }}>
            <button style={{ ...btnBase, gap: "3px", fontSize: "13px", fontWeight: "600", padding: "4px 6px" }} onMouseDown={(e) => { e.preventDefault(); setShowTtMenu((v) => !v); setShowListMenu(false); }} title="Text style">Tt {chevron}</button>
            {showTtMenu && (<><div style={{ position: "fixed", inset: 0, zIndex: 8000 }} onMouseDown={() => setShowTtMenu(false)} /><div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 8001, backgroundColor: "#22272b", border: "1px solid #3d444d", borderRadius: "8px", minWidth: "180px", boxShadow: "0 8px 24px rgba(0,0,0,0.5)", overflow: "hidden", padding: "6px 0" }}>{[{ label: "Normal text", tag: "p", style: { fontSize: "14px", color: "#dee2e6", fontWeight: "400" } }, { label: "Heading 1", tag: "h1", style: { fontSize: "26px", color: "#dee2e6", fontWeight: "700" } }, { label: "Heading 2", tag: "h2", style: { fontSize: "22px", color: "#dee2e6", fontWeight: "700" } }, { label: "Heading 3", tag: "h3", style: { fontSize: "18px", color: "#dee2e6", fontWeight: "700" } }, { label: "Heading 4", tag: "h4", style: { fontSize: "16px", color: "#dee2e6", fontWeight: "700" } }, { label: "Heading 5", tag: "h5", style: { fontSize: "14px", color: "#9fadbc", fontWeight: "700" } }, { label: "Heading 6", tag: "h6", style: { fontSize: "13px", color: "#6b7280", fontWeight: "700" } }].map(({ label, tag, style }) => (<div key={tag} onMouseDown={(e) => { e.preventDefault(); applyBlock(tag); }} style={{ padding: "8px 16px", cursor: "pointer", ...style }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#2c3338"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>{label}</div>))}</div></>)}
          </div>
          {sep}
          <button style={{ ...btnBase, fontSize: "14px", fontWeight: "900", fontFamily: "Georgia, serif" }} onMouseDown={(e) => { e.preventDefault(); exec("bold"); }} title="Bold">B</button>
          <button style={{ ...btnBase, fontStyle: "italic", fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "15px", fontWeight: "400", letterSpacing: "0.02em" }} onMouseDown={(e) => { e.preventDefault(); exec("italic"); }} title="Italic">I</button>
          <button style={{ ...btnBase, letterSpacing: "2px", fontSize: "12px", paddingBottom: "6px" }} onMouseDown={(e) => e.preventDefault()} title="More formatting">···</button>
          {sep}
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <button style={{ ...btnBase, gap: "2px", padding: "4px 6px" }} onMouseDown={(e) => { e.preventDefault(); setShowListMenu((v) => !v); setShowTtMenu(false); }} title="List">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><rect x="3" y="5" width="3" height="3" rx="1" fill="currentColor" stroke="none" /><line x1="9" y1="6.5" x2="21" y2="6.5" /><rect x="3" y="11" width="3" height="3" rx="1" fill="currentColor" stroke="none" /><line x1="9" y1="12.5" x2="21" y2="12.5" /><rect x="3" y="17" width="3" height="3" rx="1" fill="currentColor" stroke="none" /><line x1="9" y1="18.5" x2="21" y2="18.5" /></svg>
              {chevron}
            </button>
            {showListMenu && (<><div style={{ position: "fixed", inset: 0, zIndex: 8000 }} onMouseDown={() => setShowListMenu(false)} /><div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 8001, backgroundColor: "#22272b", border: "1px solid #3d444d", borderRadius: "8px", minWidth: "160px", boxShadow: "0 8px 24px rgba(0,0,0,0.5)", overflow: "hidden", padding: "6px 0" }}><div onMouseDown={(e) => { e.preventDefault(); exec("insertUnorderedList"); setShowListMenu(false); }} style={{ padding: "10px 18px", fontSize: "14px", color: "#dee2e6", cursor: "pointer" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#2c3338"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>Bullet list</div><div onMouseDown={(e) => { e.preventDefault(); exec("insertOrderedList"); setShowListMenu(false); }} style={{ padding: "10px 18px", fontSize: "14px", color: "#dee2e6", cursor: "pointer" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#2c3338"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>Numbered list</div></div></>)}
          </div>
          {sep}
          <button style={btnBase} onMouseDown={(e) => { e.preventDefault(); saveSelection(); setShowLinkModal(true); setShowTtMenu(false); setShowListMenu(false); }} title="Insert link">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
          </button>
          <button style={btnBase} onMouseDown={(e) => { e.preventDefault(); saveSelection(); setShowImageModal(true); setShowTtMenu(false); setShowListMenu(false); }} title="Insert image">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
          </button>
        </div>
        <div ref={editorRef} contentEditable suppressContentEditableWarning onInput={handleInput} style={{ minHeight: "100px", padding: "12px 14px", color: "#b6c2cf", fontSize: "14px", lineHeight: 1.6, outline: "none", overflowY: "auto" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderTop: "1px solid #3d444d" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={onSave} style={{ backgroundColor: "#579dff", border: "none", borderRadius: "6px", color: "#fff", padding: "7px 18px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Save</button>
            <button onClick={onCancel} style={{ background: "none", border: "none", color: "#9fadbc", padding: "7px 12px", fontSize: "13px", cursor: "pointer" }}>Discard changes</button>
          </div>
          <button style={{ background: "none", border: "none", color: "#9fadbc", fontSize: "13px", cursor: "pointer" }}>Formatting help</button>
        </div>
      </div>
      {showLinkModal && <LinkModal onInsert={handleInsertLink} onCancel={() => setShowLinkModal(false)} />}
      {showImageModal && <ImageModal onInsert={handleInsertImage} onCancel={() => setShowImageModal(false)} />}
    </>
  );
}

// ── Create Label Sub-View ─────────────────────────────────────
function CreateLabelView({ onBack, onClose, onCreated, editLabel }) {
  const [title, setTitle] = useState(editLabel?.title || "");
  const [selectedColor, setSelectedColor] = useState(editLabel?.color || "#61bd4f");

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9500, backgroundColor: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ backgroundColor: "#282e33", borderRadius: "10px", width: "340px", boxShadow: "0 20px 60px rgba(0,0,0,0.5)", overflow: "hidden" }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid #3d444d", position: "relative" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#9fadbc", cursor: "pointer", padding: "4px 8px", borderRadius: "4px", display: "flex", alignItems: "center" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#3d444d"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <span style={{ fontSize: "14px", fontWeight: "700", color: "#dee2e6", position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
            {editLabel ? "Edit label" : "Create a new label"}
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#9fadbc", cursor: "pointer", fontSize: "20px", lineHeight: 1, padding: "4px 8px", borderRadius: "4px" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#3d444d"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>×</button>
        </div>
        <div style={{ padding: "16px" }}>
          {/* Preview bar */}
          <div style={{ height: "48px", borderRadius: "6px", backgroundColor: selectedColor || "#dfe1e6", marginBottom: "16px", transition: "background-color 0.15s" }} />
          {/* Title */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "11px", fontWeight: "700", color: "#9fadbc", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>TITLE</label>
            <input type="text" placeholder="Label title..." value={title} onChange={(e) => setTitle(e.target.value)}
              style={{ width: "100%", backgroundColor: "#22272b", color: "#b6c2cf", border: "1px solid #3d444d", borderRadius: "6px", padding: "9px 12px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
              onFocus={(e) => e.target.style.borderColor = "#579dff"} onBlur={(e) => e.target.style.borderColor = "#3d444d"} />
          </div>
          {/* Color grid */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "11px", fontWeight: "700", color: "#9fadbc", display: "block", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>SELECT A COLOR</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "6px" }}>
              {LABEL_COLORS.map((color) => (
                <div key={color} onClick={() => setSelectedColor(color)}
                  style={{ height: "32px", borderRadius: "6px", backgroundColor: color, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", border: selectedColor === color ? "2.5px solid #fff" : "2.5px solid transparent", transition: "transform 0.1s", boxSizing: "border-box" }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.08)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
                  {selectedColor === color && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
              ))}
            </div>
          </div>
          {/* Remove color */}
          <div onClick={() => setSelectedColor(null)}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "9px", borderRadius: "6px", backgroundColor: "#3d444d", color: "#dee2e6", fontSize: "13px", cursor: "pointer", marginBottom: "14px" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#474f59"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#3d444d"}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Remove color
          </div>
          {/* Create / Save */}
          <button onClick={() => onCreated({ title: title.trim(), color: selectedColor || "#dfe1e6", id: editLabel?.id || Date.now() })}
            style={{ width: "100%", backgroundColor: "#579dff", border: "none", borderRadius: "6px", color: "#fff", padding: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#4a8fe3"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#579dff"}>
            {editLabel ? "Save" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Labels Modal ──────────────────────────────────────────────
function LabelsModal({ onClose }) {
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editLabel, setEditLabel] = useState(null);
  const [labels, setLabels] = useState([
    { id: 1, title: "", color: "#4bce97" },
    { id: 2, title: "", color: "#a07c1e" },
    { id: 3, title: "", color: "#c05c2a" },
    { id: 4, title: "", color: "#b83232" },
    { id: 5, title: "", color: "#7b4f9e" },
    { id: 6, title: "", color: "#2a6db5" },
  ]);
  const [checked, setChecked] = useState([]);

  const filtered = labels.filter((l) =>
    !search.trim() || (l.title && l.title.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreated = (newLabel) => {
    if (editLabel) {
      setLabels((prev) => prev.map((l) => l.id === newLabel.id ? newLabel : l));
    } else {
      setLabels((prev) => [...prev, newLabel]);
    }
    setShowCreate(false);
    setEditLabel(null);
  };

  const toggleCheck = (id) => setChecked((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  // Show Create or Edit sub-view
  if (showCreate || editLabel) {
    return <CreateLabelView onBack={() => { setShowCreate(false); setEditLabel(null); }} onClose={onClose} onCreated={handleCreated} editLabel={editLabel} />;
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9500, backgroundColor: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ backgroundColor: "#282e33", borderRadius: "10px", width: "320px", boxShadow: "0 20px 60px rgba(0,0,0,0.5)", overflow: "hidden" }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid #3d444d", position: "relative" }}>
          <div style={{ width: "28px" }} />
          <span style={{ fontSize: "14px", fontWeight: "700", color: "#dee2e6" }}>Labels</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#9fadbc", cursor: "pointer", fontSize: "20px", lineHeight: 1, padding: "4px 8px", borderRadius: "4px" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#3d444d"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>×</button>
        </div>
        <div style={{ padding: "12px 14px" }}>
          {/* Search */}
          <input type="text" placeholder="Search labels..." value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", backgroundColor: "#22272b", color: "#b6c2cf", border: "1px solid #3d444d", borderRadius: "6px", padding: "9px 12px", fontSize: "14px", outline: "none", boxSizing: "border-box", marginBottom: "14px" }}
            onFocus={(e) => e.target.style.borderColor = "#579dff"} onBlur={(e) => e.target.style.borderColor = "#3d444d"} />
          {/* LABELS heading */}
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#9fadbc", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Labels</div>
          {/* Label list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "14px" }}>
            {filtered.map((label) => (
              <div key={label.id} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {/* Checkbox */}
                <div onClick={() => toggleCheck(label.id)}
                  style={{ width: "16px", height: "16px", borderRadius: "3px", border: checked.includes(label.id) ? "none" : "2px solid #6b7280", backgroundColor: checked.includes(label.id) ? "#579dff" : "transparent", flexShrink: 0, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                  {checked.includes(label.id) && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
                {/* Color bar */}
                <div onClick={() => toggleCheck(label.id)}
                  style={{ flex: 1, height: "36px", borderRadius: "6px", backgroundColor: label.color, cursor: "pointer", display: "flex", alignItems: "center", paddingLeft: "10px", transition: "filter 0.15s" }}
                  onMouseEnter={(e) => e.currentTarget.style.filter = "brightness(1.15)"}
                  onMouseLeave={(e) => e.currentTarget.style.filter = "brightness(1)"}>
                  {label.title && <span style={{ fontSize: "13px", fontWeight: "600", color: getTextColor(label.color) }}>{label.title}</span>}
                </div>
                {/* Edit pencil */}
                <button onClick={() => setEditLabel(label)}
                  style={{ background: "none", border: "none", color: "#9fadbc", cursor: "pointer", padding: "6px", borderRadius: "4px", display: "flex", alignItems: "center" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#dee2e6"; e.currentTarget.style.backgroundColor = "#3d444d"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#9fadbc"; e.currentTarget.style.backgroundColor = "transparent"; }}
                  title="Edit label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
          {/* + Create a new label */}
          <button onClick={() => setShowCreate(true)}
            style={{ width: "100%", backgroundColor: "#3d444d", border: "none", borderRadius: "6px", color: "#dee2e6", padding: "9px", fontSize: "14px", fontWeight: "500", cursor: "pointer" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#474f59"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#3d444d"}>
            + Create a new label
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Card Quick-Edit Popover ───────────────────────────────────
function CardQuickEdit({ card, listName, anchorRect, onClose, onSave, onOpen, onEditLabels }) {
  const [name, setName] = useState(card.card_name);
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); inputRef.current?.select(); }, []);

  const top = Math.max(8, Math.min(anchorRect.top - 8, window.innerHeight - 440));
  const left = Math.max(8, Math.min(anchorRect.left, window.innerWidth - 480));

  const iconBtn = (path) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">{path}</svg>
  );

  const actions = [
    { label: "Open card", icon: iconBtn(<><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></>), action: () => { onOpen(); onClose(); } },
    // ── "Edit labels" opens LabelsModal ──
    { label: "Edit labels", icon: iconBtn(<><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></>), action: () => { onEditLabels(); onClose(); } },
    { label: "Change members", icon: iconBtn(<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>), action: onClose },
    { label: "Edit dates", icon: iconBtn(<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>), action: onClose },
    { label: "Move", icon: iconBtn(<><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>), action: onClose },
    { label: "Copy card", icon: iconBtn(<><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>), action: onClose },
    { label: "Copy link", icon: iconBtn(<><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>), action: onClose },
    { label: "Archive", icon: iconBtn(<><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></>), action: onClose },
  ];

  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 6000, backgroundColor: "rgba(0,0,0,0.55)" }} onClick={onClose} />
      <div style={{ position: "fixed", top, left, zIndex: 6001, display: "flex", gap: "8px", alignItems: "flex-start" }}>
        <div style={{ width: Math.max(240, anchorRect.width || 260), display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ backgroundColor: "#2c2c2c", borderRadius: "8px", padding: "9px 10px", border: "2px solid rgba(255,255,255,0.😎" }}>
            <textarea ref={inputRef} value={name} onChange={(e) => setName(e.target.value)} rows={3}
              style={{ width: "100%", background: "none", border: "none", color: "#e0e0e0", fontSize: "13px", resize: "none", outline: "none", fontFamily: "inherit", lineHeight: 1.5, boxSizing: "border-box" }} />
          </div>
          <button onClick={() => { onSave(name); onClose(); }}
            style={{ backgroundColor: "#579dff", border: "none", borderRadius: "6px", color: "#fff", padding: "8px 18px", fontSize: "14px", fontWeight: "600", cursor: "pointer", alignSelf: "flex-start" }}>
            Save
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "5px", minWidth: "185px" }}>
          {actions.map(({ label, icon, action }) => (
            <button key={label} onClick={action}
              style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#2c3338", border: "none", borderRadius: "8px", color: "#dee2e6", fontSize: "13px", fontWeight: "500", padding: "9px 14px", cursor: "pointer", textAlign: "left", width: "100%" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#374048"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#2c3338"}>
              <span style={{ color: "#9fadbc", display: "flex", alignItems: "center", flexShrink: 0 }}>{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
const BoardCards = ({ colors, board_id }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingListId, setEditingListId] = useState(null);
  const [editingListName, setEditingListName] = useState("");
  const editingListNameRef = useRef("");
  const saveInProgress = useRef(false);
  const escapePressed = useRef(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedListName, setSelectedListName] = useState("");
  const [cardDescription, setCardDescription] = useState("");
  const [editingDescription, setEditingDescription] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [addCardModal, setAddCardModal] = useState(null);
  const [newCard, setNewCard] = useState({ card_name: "", card_description: "", due_date: "", due_time: "" });
  const [collapsedLists, setCollapsedLists] = useState({});
  const [openListMenu, setOpenListMenu] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(null);
  const [cardQuickEdit, setCardQuickEdit] = useState(null);
  // ── Labels modal ──────────────────────────────────────────────
  const [showLabelsModal, setShowLabelsModal] = useState(false);

  // ── Handlers ─────────────────────────────────────────────────
  const handleUpdateListName = async (list_id) => {
    if (saveInProgress.current || escapePressed.current) return;
    saveInProgress.current = true;
    const trimmed = editingListNameRef.current.trim();
    if (!trimmed) { setEditingListId(null); saveInProgress.current = false; return; }
    setData((prev) => prev.map((l) => l.list_id === list_id ? { ...l, list_name: trimmed } : l));
    setEditingListId(null);
    try { await api.patch(/tasks/lists/${list_id}, { list_name: trimmed }); }
    catch (err) { console.error(err); }
    finally { saveInProgress.current = false; }
  };

  const deleteList = async (list_id) => {
    try { await api.delete(/tasks/lists/${list_id}); setData((prev) => prev.filter((l) => l.list_id !== list_id)); }
    catch (err) { console.error(err); }
  };

  const deleteCard = async (listIdx, card_id) => {
    try {
      await api.delete(/tasks/cards/${card_id});
      setData((prev) => prev.map((l, i) => i === listIdx ? { ...l, cards: l.cards.filter((c) => c.card_id !== card_id) } : l));
    } catch (err) { console.error(err); }
  };

  const handleListColor = (list_id, color) => {
    setData((prev) => prev.map((l) => l.list_id === list_id ? { ...l, list_color: color } : l));
    setShowColorPicker(null); setOpenListMenu(null);
    api.patch(/tasks/lists/${list_id}, { list_color: color }).catch(console.error);
  };

  const handleAddCard = async () => {
    if (!newCard.card_name.trim() || !addCardModal) return;
    const { list_id } = addCardModal;
    try {
      const list = data.find((l) => l.list_id === list_id);
      const payload = { list_id, card_name: newCard.card_name.trim(), card_description: newCard.card_description.trim() || null, due_date: newCard.due_date || null, due_time: newCard.due_time || null, card_position: (list?.cards?.length || 0) + 1, completed: 0, is_archived: 0 };
      const res = await api.post(/tasks/cards, payload);
      const createdCard = res.data.card || { ...payload, card_id: Date.now() };
      setData((prev) => prev.map((l) => l.list_id === list_id ? { ...l, cards: [...(l.cards || []), createdCard] } : l));
      closeAddCardModal();
    } catch (err) { console.error(err); }
  };

  const openAddCardModal = (list_id, list_name) => { setAddCardModal({ list_id, list_name }); setNewCard({ card_name: "", card_description: "", due_date: "", due_time: "" }); };
  const closeAddCardModal = () => { setAddCardModal(null); setNewCard({ card_name: "", card_description: "", due_date: "", due_time: "" }); };

  const handleSaveDescription = async () => {
    if (!selectedCard) return;
    try {
      await api.patch(/tasks/cards/${selectedCard.card_id}, { card_description: cardDescription });
      setSelectedCard((prev) => ({ ...prev, card_description: cardDescription }));
      setData((prev) => prev.map((l) => ({ ...l, cards: l.cards.map((c) => c.card_id === selectedCard.card_id ? { ...c, card_description: cardDescription } : c) })));
      setEditingDescription(false);
    } catch (err) { console.error(err); }
  };

  const handleToggleComplete = async (card) => {
    const newVal = !!card.completed ? 0 : 1;
    try {
      await api.patch(/tasks/cards/${card.card_id}, { completed: newVal });
      setData((prev) => prev.map((l) => ({ ...l, cards: l.cards.map((c) => c.card_id === card.card_id ? { ...c, completed: newVal } : c) })));
      if (selectedCard?.card_id === card.card_id) setSelectedCard((prev) => ({ ...prev, completed: newVal }));
    } catch (err) { console.error(err); }
  };

  const handleQuickEditSave = (card_id, newName) => {
    if (!newName.trim()) return;
    setData((prev) => prev.map((l) => ({ ...l, cards: l.cards.map((c) => c.card_id === card_id ? { ...c, card_name: newName.trim() } : c) })));
    api.patch(/tasks/cards/${card_id}, { card_name: newName.trim() }).catch(console.error);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(tasks/lists/${board_id});
        setData(res.data.lists.map((list) => ({ ...list, cards: list.cards || [] })));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [board_id]);

  const openCard = (card, listName) => { setSelectedCard(card); setSelectedListName(listName); setCardDescription(card.card_description || ""); setEditingDescription(false); setComments([]); setNewComment(""); setCardQuickEdit(null); };
  const closeCard = () => { setSelectedCard(null); setEditingDescription(false); };
  const toggleCollapse = (list_id) => setCollapsedLists((prev) => ({ ...prev, [list_id]: !prev[list_id] }));

  // ── List template ────────────────────────────────────────────
  function listTemplate(list, listIdx) {
    const isEditing = editingListId === list.list_id;
    const isCollapsed = collapsedLists[list.list_id];
    const isMenuOpen = openListMenu === list.list_id;
    const isColorOpen = showColorPicker === list.list_id;
    const listColor = list.list_color || "#a07c1e";
    const textColor = getTextColor(listColor);

    return (
      <div key={list.list_id} style={{ minWidth: isCollapsed ? "56px" : "272px", width: isCollapsed ? "56px" : "272px", backgroundColor: listColor, borderRadius: "12px", padding: isCollapsed ? "12px 8px" : "10px", display: "flex", flexDirection: "column", gap: "6px", flexShrink: 0, transition: "width 0.2s ease, min-width 0.2s ease, background-color 0.2s ease", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: isCollapsed ? 0 : "4px", minHeight: "28px" }}>
          {isCollapsed ? (
            <button onClick={() => toggleCollapse(list.list_id)} style={{ background: "none", border: "none", color: textColor, fontSize: "14px", cursor: "pointer", padding: "2px 4px", transform: "rotate(90deg)" }}>⇄</button>
          ) : (
            <>
              {isEditing ? (
                <input autoFocus type="text" value={editingListName}
                  onChange={(e) => { setEditingListName(e.target.value); editingListNameRef.current = e.target.value; }}
                  onBlur={() => handleUpdateListName(list.list_id)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleUpdateListName(list.list_id); } if (e.key === "Escape") { escapePressed.current = true; setEditingListId(null); setTimeout(() => { escapePressed.current = false; }, 100); } }}
                  style={{ flex: 1, background: "rgba(0,0,0,0.2)", border: 1px solid ${textColor}60, borderRadius: "6px", color: textColor, fontWeight: "700", fontSize: "15px", padding: "2px 6px", outline: "none" }} />
              ) : (
                <span onClick={() => { saveInProgress.current = false; escapePressed.current = false; editingListNameRef.current = list.list_name; setEditingListName(list.list_name); setEditingListId(list.list_id); }}
                  title="Click to rename"
                  style={{ flex: 1, color: textColor, fontWeight: "700", fontSize: "15px", cursor: "pointer", userSelect: "none", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {list.list_name}
                </span>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: "4px", marginLeft: "6px", flexShrink: 0 }}>
                <button onClick={() => toggleCollapse(list.list_id)} style={{ background: "none", border: "none", color: textColor, fontSize: "14px", cursor: "pointer", padding: "2px 4px", lineHeight: 1, opacity: 0.85 }}>⇄</button>
                <div style={{ position: "relative" }}>
                  <button onClick={() => { setOpenListMenu(isMenuOpen ? null : list.list_id); if (isMenuOpen) setShowColorPicker(null); }}
                    style={{ background: "none", border: "none", color: textColor, fontSize: "18px", cursor: "pointer", padding: "0 4px", lineHeight: 1, opacity: 0.85, letterSpacing: "1px" }}>···</button>
                  {isMenuOpen && (
                    <>
                      <div style={{ position: "fixed", inset: 0, zIndex: 999 }} onClick={() => { setOpenListMenu(null); setShowColorPicker(null); }} />
                      <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 1000, backgroundColor: "#22272b", border: "1px solid #3d444d", borderRadius: "8px", minWidth: "200px", boxShadow: "0 8px 24px rgba(0,0,0,0.5)", overflow: "hidden" }}>
                        {[
                          { label: "Add a card", action: () => { openAddCardModal(list.list_id, list.list_name); setOpenListMenu(null); } },
                          { label: "Copy list", action: () => setOpenListMenu(null) },
                          { label: "Move list", action: () => setOpenListMenu(null) },
                          { label: "Watch", action: () => setOpenListMenu(null) },
                        ].map(({ label, action }) => (
                          <div key={label} onClick={action} style={{ padding: "9px 14px", fontSize: "13px", color: "#dee2e6", cursor: "pointer" }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "#2c3338"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>{label}</div>
                        ))}
                        <div onClick={() => setShowColorPicker(isColorOpen ? null : list.list_id)}
                          style={{ padding: "9px 14px", fontSize: "13px", color: "#dee2e6", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: isColorOpen ? "#2c3338" : "transparent" }}
                          onMouseEnter={(e) => { if (!isColorOpen) e.currentTarget.style.background = "#2c3338"; }}
                          onMouseLeave={(e) => { if (!isColorOpen) e.currentTarget.style.background = "transparent"; }}>
                          Change list color
                          <span style={{ color: "#9fadbc", fontSize: "12px" }}>{isColorOpen ? "∧" : "∨"}</span>
                        </div>
                        {isColorOpen && (
                          <div style={{ padding: "8px 12px", borderTop: "1px solid #3d444d", borderBottom: "1px solid #3d444d" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "5px", marginBottom: "8px" }}>
                              {LIST_COLORS.map((color) => (
                                <div key={color} onClick={() => handleListColor(list.list_id, color)}
                                  style={{ height: "28px", borderRadius: "5px", backgroundColor: color, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", border: listColor === color ? "2.5px solid #fff" : "2px solid transparent", transition: "transform 0.1s" }}
                                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
                                  {listColor === color && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                                </div>
                              ))}
                            </div>
                            <div onClick={() => handleListColor(list.list_id, null)}
                              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "6px 0", color: "#b6c2cf", fontSize: "12px", cursor: "pointer", borderTop: "1px solid #3d444d" }}
                              onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
                              onMouseLeave={(e) => e.currentTarget.style.color = "#b6c2cf"}>
                              ✕ Remove color
                            </div>
                          </div>
                        )}
                        {[
                          { label: "Archive this list", action: () => setOpenListMenu(null) },
                          { label: "Delete list", action: () => { deleteList(list.list_id); setOpenListMenu(null); }, danger: true },
                        ].map(({ label, action, danger }) => (
                          <div key={label} onClick={action} style={{ padding: "9px 14px", fontSize: "13px", color: danger ? "#f87171" : "#dee2e6", cursor: "pointer" }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "#2c3338"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>{label}</div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {!isCollapsed && (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {(list.cards || []).map((card) => (
                <div key={card.card_id} onClick={() => openCard(card, list.list_name)}
                  style={{ backgroundColor: "#2c2c2c", borderRadius: "8px", padding: "9px 10px", cursor: "pointer", border: "2px solid transparent", display: "flex", alignItems: "center", gap: "8px", transition: "border-color 0.15s, background 0.15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.7)"; e.currentTarget.style.backgroundColor = "#353535"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.backgroundColor = "#2c2c2c"; }}>
                  <div onClick={(e) => { e.stopPropagation(); handleToggleComplete(card); }}
                    style={{ width: "16px", height: "16px", borderRadius: "50%", border: !!card.completed ? "2px solid #4bce97" : "2px solid #888", backgroundColor: !!card.completed ? "#4bce97" : "transparent", flexShrink: 0, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s ease" }}>
                    {!!card.completed && <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="#1d2125" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="2,6 5,9 10,3" /></svg>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: "13px", color: !!card.completed ? "#888" : "#e0e0e0", display: "block", textDecoration: !!card.completed ? "line-through" : "none", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{card.card_name}</span>
                    {card.due_date && (
                      <span style={{ display: "inline-block", marginTop: "3px", backgroundColor: !!card.completed ? "#4bce97" : "#f87462", color: "#1d2125", fontSize: "10px", borderRadius: "4px", padding: "1px 5px", fontWeight: 600 }}>
                        📅 {card.due_date}{card.due_time ?  ${card.due_time} : ""}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); const cardEl = e.currentTarget.parentElement; const rect = cardEl ? cardEl.getBoundingClientRect() : e.currentTarget.getBoundingClientRect(); setCardQuickEdit({ card, listName: list.list_name, listIdx, rect }); }}
                    title="Quick edit"
                    style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", padding: "2px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#aaa"}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                  </button>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "2px", padding: "2px 0" }}>
              <button onClick={() => openAddCardModal(list.list_id, list.list_name)}
                style={{ background: "none", border: "none", color: textColor, fontSize: "13px", fontWeight: "500", cursor: "pointer", padding: "4px 2px", display: "flex", alignItems: "center", gap: "5px", opacity: 0.9 }}>
                <span style={{ fontSize: "16px", lineHeight: 1 }}>+</span> Add a card
              </button>
              <button style={{ background: "none", border: 1px solid ${textColor}60, borderRadius: "6px", color: textColor, fontSize: "14px", cursor: "pointer", padding: "3px 6px", lineHeight: 1, opacity: 0.8 }} title="Card templates">⊞</button>
            </div>
          </>
        )}
      </div>
    );
  }

  if (loading) return <div className="p-5 text-center text-light">Loading Board...</div>;

  return (
    <>
      {/* Board */}
      <div style={{ display: "flex", flexDirection: "row", gap: "12px", padding: "16px", overflowX: "auto", alignItems: "flex-start", minHeight: "calc(100vh - 110px)" }}>
        {data.map((list, listIdx) => listTemplate(list, listIdx))}
        <button style={{ minWidth: "272px", width: "272px", backgroundColor: "rgba(255,255,255,0.15)", border: "none", borderRadius: "12px", padding: "10px 14px", color: "#fff", fontSize: "14px", fontWeight: "600", cursor: "pointer", textAlign: "left", flexShrink: 0 }}
          onClick={() => console.log("Add list clicked.")}>
          + Add list
        </button>
      </div>

      {/* Card Quick-Edit Popover — passes onEditLabels */}
      {cardQuickEdit && (
        <CardQuickEdit
          card={cardQuickEdit.card}
          listName={cardQuickEdit.listName}
          anchorRect={cardQuickEdit.rect}
          onClose={() => setCardQuickEdit(null)}
          onSave={(newName) => handleQuickEditSave(cardQuickEdit.card.card_id, newName)}
          onOpen={() => openCard(cardQuickEdit.card, cardQuickEdit.listName)}
          onEditLabels={() => setShowLabelsModal(true)}
        />
      )}

      {/* Add Card Modal */}
      {addCardModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 4000, backgroundColor: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={closeAddCardModal}>
          <div style={{ width: "460px", backgroundColor: "#282e33", color: "#b6c2cf", borderRadius: "12px", padding: "24px", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h6 style={{ fontWeight: "700", margin: 0, color: "#b6c2cf", fontSize: "15px" }}>Add card to <span style={{ color: "#579dff" }}>{addCardModal.list_name}</span></h6>
              <button style={{ background: "none", border: "none", color: "#9fadbc", fontSize: "22px", lineHeight: 1, cursor: "pointer" }} onClick={closeAddCardModal}>×</button>
            </div>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "#9fadbc", display: "block", marginBottom: "6px" }}>Card Title <span style={{ color: "#f87462" }}>*</span></label>
              <input autoFocus type="text" placeholder="Enter a title for this card..." value={newCard.card_name}
                onChange={(e) => setNewCard((p) => ({ ...p, card_name: e.target.value }))}
                onKeyDown={(e) => { if (e.key === "Enter") handleAddCard(); if (e.key === "Escape") closeAddCardModal(); }}
                style={{ width: "100%", backgroundColor: "#22272b", color: "#b6c2cf", border: "1px solid #454f59", borderRadius: "6px", padding: "9px 12px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "#9fadbc", display: "block", marginBottom: "6px" }}>Description</label>
              <textarea placeholder="Add a more detailed description (optional)..." rows={3} value={newCard.card_description}
                onChange={(e) => setNewCard((p) => ({ ...p, card_description: e.target.value }))}
                style={{ width: "100%", backgroundColor: "#22272b", color: "#b6c2cf", border: "1px solid #454f59", borderRadius: "6px", padding: "9px 12px", fontSize: "14px", resize: "vertical", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "#9fadbc", display: "block", marginBottom: "6px" }}>Due Date</label>
                <input type="date" value={newCard.due_date} onChange={(e) => setNewCard((p) => ({ ...p, due_date: e.target.value }))}
                  style={{ width: "100%", backgroundColor: "#22272b", color: "#b6c2cf", border: "1px solid #454f59", borderRadius: "6px", padding: "9px 12px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "#9fadbc", display: "block", marginBottom: "6px" }}>Due Time</label>
                <input type="time" value={newCard.due_time} onChange={(e) => setNewCard((p) => ({ ...p, due_time: e.target.value }))}
                  style={{ width: "100%", backgroundColor: "#22272b", color: "#b6c2cf", border: "1px solid #454f59", borderRadius: "6px", padding: "9px 12px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={handleAddCard} disabled={!newCard.card_name.trim()}
                style={{ backgroundColor: "#579dff", border: "none", borderRadius: "6px", color: "#fff", padding: "9px 20px", fontSize: "14px", fontWeight: "600", cursor: newCard.card_name.trim() ? "pointer" : "not-allowed", opacity: newCard.card_name.trim() ? 1 : 0.5 }}>
                Add Card
              </button>
              <button onClick={closeAddCardModal} style={{ backgroundColor: "#374048", border: "none", borderRadius: "6px", color: "#9fadbc", padding: "9px 16px", fontSize: "14px", cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Card Detail Modal */}
      {selectedCard && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 3000, backgroundColor: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={closeCard}>
          <div style={{ width: "900px", maxWidth: "95vw", maxHeight: "90vh", backgroundColor: "#1d2125", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", backgroundColor: "#1d2125", borderBottom: "1px solid #2d3540", flexShrink: 0 }}>
              <button style={{ backgroundColor: "#a07c1e", color: "#fff", border: "none", borderRadius: "6px", padding: "5px 14px", fontWeight: "700", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                {selectedListName}
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" /></svg>
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button style={{ background: "none", border: "none", color: "#9fadbc", cursor: "pointer", padding: "4px", borderRadius: "6px", display: "flex" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" /><path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z" /></svg>
                </button>
                <button style={{ background: "none", border: "1px solid #3d444d", color: "#9fadbc", cursor: "pointer", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" /></svg>
                </button>
                <button onClick={closeCard} style={{ background: "none", border: "none", color: "#9fadbc", cursor: "pointer", padding: "4px", fontSize: "22px", lineHeight: 1 }}>×</button>
              </div>
            </div>
            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
              <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px", borderRight: "1px solid #2d3540" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "20px" }}>
                  <div onClick={() => handleToggleComplete(selectedCard)}
                    style={{ width: "22px", height: "22px", borderRadius: "50%", border: !!selectedCard.completed ? "2px solid #4bce97" : "2px solid #6b7280", backgroundColor: !!selectedCard.completed ? "#4bce97" : "transparent", flexShrink: 0, marginTop: "4px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                    {!!selectedCard.completed && <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#1d2125" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="2,6 5,9 10,3" /></svg>}
                  </div>
                  <h2 style={{ color: "#e0e6ed", fontSize: "22px", fontWeight: "700", margin: 0, lineHeight: 1.3 }}>{selectedCard.card_name}</h2>
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
                  {["+ Add", "Dates", "Checklist", "Members"].map((label) => (
                    <button key={label} style={{ backgroundColor: "#2c3338", border: "1px solid #3d444d", borderRadius: "6px", color: "#b6c2cf", fontSize: "13px", padding: "6px 14px", cursor: "pointer", fontWeight: label === "+ Add" ? "600" : "400" }}>{label}</button>
                  ))}
                  {/* Labels button — opens LabelsModal */}
                  <button onClick={(e) => { e.stopPropagation(); setShowLabelsModal(true); }}
                    style={{ backgroundColor: "#2c3338", border: "1px solid #3d444d", borderRadius: "6px", color: "#b6c2cf", fontSize: "13px", padding: "6px 14px", cursor: "pointer", fontWeight: "400" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#374048"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#2c3338"}>
                    Labels
                  </button>
                </div>
                {(selectedCard.due_date || selectedCard.due_time) && (
                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ fontSize: "12px", fontWeight: "600", color: "#9fadbc", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Due Date</div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: !!selectedCard.completed ? "#4bce97" : "#f87462", color: "#1d2125", fontSize: "13px", fontWeight: 600, borderRadius: "6px", padding: "4px 10px" }}>
                      📅 {selectedCard.due_date}{selectedCard.due_time && ` at ${selectedCard.due_time}`}
                    </div>
                  </div>
                )}
                <div style={{ marginBottom: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#9fadbc" viewBox="0 0 16 16"><path fillRule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" /></svg>
                    <span style={{ fontWeight: "700", color: "#e0e6ed", fontSize: "15px" }}>Description</span>
                    {!editingDescription && cardDescription && (
                      <span style={{ fontSize: "11px", backgroundColor: "#3d444d", color: "#9fadbc", padding: "2px 8px", borderRadius: "4px", fontWeight: "600" }}>UNSAVED CHANGES</span>
                    )}
                  </div>
                  {editingDescription ? (
                    <RichDescriptionEditor value={cardDescription} onChange={setCardDescription} onSave={handleSaveDescription} onCancel={() => setEditingDescription(false)} />
                  ) : (
                    <div onClick={() => setEditingDescription(true)}
                      style={{ minHeight: "80px", backgroundColor: "#22272b", border: "1px solid #3d444d", borderRadius: "8px", padding: "12px 14px", color: cardDescription ? "#b6c2cf" : "#6b7280", fontSize: "14px", cursor: "pointer", lineHeight: 1.6 }}
                      dangerouslySetInnerHTML={cardDescription ? { __html: cardDescription } : undefined}>
                      {!cardDescription && "Add a more detailed description..."}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ width: "340px", flexShrink: 0, overflowY: "auto", padding: "20px", backgroundColor: "#1d2125", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#9fadbc" viewBox="0 0 16 16"><path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z" /></svg>
                    <span style={{ fontWeight: "700", color: "#e0e6ed", fontSize: "15px" }}>Comments and activity</span>
                  </div>
                  <button style={{ background: "none", border: "1px solid #3d444d", borderRadius: "6px", color: "#9fadbc", fontSize: "12px", padding: "4px 10px", cursor: "pointer" }}>Show details</button>
                </div>
                <input type="text" placeholder="Write a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && newComment.trim()) { setComments((prev) => [...prev, { text: newComment.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]); setNewComment(""); } }}
                  style={{ width: "100%", backgroundColor: "#22272b", border: "1px solid #3d444d", borderRadius: "8px", color: "#b6c2cf", padding: "10px 14px", fontSize: "14px", outline: "none", marginBottom: "16px", boxSizing: "border-box" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {selectedCard.card_created && (
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: "#e07b3f", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "12px", color: "#fff", flexShrink: 0 }}>U</div>
                      <div>
                        <div style={{ fontSize: "13px", color: "#dee2e6" }}><span style={{ fontWeight: "600" }}>You</span> added this card to <span style={{ color: "#579dff", fontWeight: "500" }}>{selectedListName}</span></div>
                        <div style={{ fontSize: "11px", color: "#579dff", marginTop: "2px" }}>{new Date(selectedCard.card_created).toLocaleString()}</div>
                      </div>
                    </div>
                  )}
                  {comments.map((c, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: "#579dff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "12px", color: "#fff", flexShrink: 0 }}>U</div>
                      <div>
                        <div style={{ fontSize: "13px", color: "#dee2e6" }}><span style={{ fontWeight: "600" }}>You</span> <span style={{ color: "#9fadbc", fontSize: "11px" }}>{c.time}</span></div>
                        <div style={{ backgroundColor: "#2c3338", borderRadius: "6px", padding: "8px 10px", fontSize: "13px", color: "#b6c2cf", marginTop: "4px" }}>{c.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Labels Modal — triggered by "Labels" button OR "Edit labels" quick action */}
      {showLabelsModal && <LabelsModal onClose={() => setShowLabelsModal(false)} />}
    </>
  );
};

export default BoardCards;