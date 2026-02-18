import React, { useState, useEffect, useRef } from "react";
import api from "../../config/api";

const BoardCards = ({ colors, board_id }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingListId, setEditingListId] = useState(null);
  const [editingListName, setEditingListName] = useState("");
  const editingListNameRef = useRef("");
  const saveInProgress = useRef(false);
  const escapePressed = useRef(false);

  // ── Card Detail Modal ────────────────────────────────────────
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedListName, setSelectedListName] = useState("");
  const [cardDescription, setCardDescription] = useState("");
  const [editingDescription, setEditingDescription] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

  // ── Add Card Modal ───────────────────────────────────────────
  const [addCardModal, setAddCardModal] = useState(null); // holds { list_id, list_name }
  const [newCard, setNewCard] = useState({
    card_name: "",
    card_description: "",
    due_date: "",
    due_time: "",
  });

  const theme = colors || {
    listGrey: "#4a5b81",
    accentGreen: "#10b981",
    dangerRed: "#bbb8e6",
    textRed: "#991b1b",
  };

  // ── List name update ─────────────────────────────────────────
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
      console.error("Failed to update list name:", err);
    } finally {
      saveInProgress.current = false;
    }
  };

  const deleteList = async (list_id) => {
    try {
      await api.delete(`/tasks/lists/${list_id}`);
      setData((prev) => prev.filter((l) => l.list_id !== list_id));
    } catch (err) {
      console.error("Failed to delete list:", err);
    }
  };

  const deleteCard = async (listIdx, card_id) => {
    try {
      await api.delete(`/tasks/cards/${card_id}`);
      setData((prev) =>
        prev.map((l, i) =>
          i === listIdx
            ? { ...l, cards: l.cards.filter((c) => c.card_id !== card_id) }
            : l,
        ),
      );
    } catch (err) {
      console.error("Failed to delete card:", err);
    }
  };

  // ── Add Card via Modal → POST to DB ─────────────────────────
  const handleAddCard = async () => {
    if (!newCard.card_name.trim() || !addCardModal) return;
    const { list_id } = addCardModal;
    try {
      const list = data.find((l) => l.list_id === list_id);
      const card_position = (list?.cards?.length || 0) + 1;

      const payload = {
        list_id,
        card_name: newCard.card_name.trim(),
        card_description: newCard.card_description.trim() || null,
        due_date: newCard.due_date || null,
        due_time: newCard.due_time || null,
        card_position,
        completed: 0,
        is_archived: 0,
      };

      const res = await api.post(`/tasks/cards`, payload);
      const createdCard = res.data.card || { ...payload, card_id: Date.now() };

      setData((prev) =>
        prev.map((l) =>
          l.list_id === list_id
            ? { ...l, cards: [...(l.cards || []), createdCard] }
            : l,
        ),
      );
      closeAddCardModal();
    } catch (err) {
      console.error("Failed to add card:", err);
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

  // ── Save description to DB ───────────────────────────────────
  const handleSaveDescription = async () => {
    if (!selectedCard) return;
    try {
      await api.patch(`/tasks/cards/${selectedCard.card_id}`, {
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
      console.error("Failed to save description:", err);
    }
  };

  // ── Toggle completed ─────────────────────────────────────────
  const handleToggleComplete = async (card) => {
    const newVal = card.completed ? 0 : 1;
    try {
      await api.patch(`/tasks/cards/${card.card_id}`, { completed: newVal });
      setData((prev) =>
        prev.map((l) => ({
          ...l,
          cards: l.cards.map((c) =>
            c.card_id === card.card_id ? { ...c, completed: newVal } : c,
          ),
        })),
      );
      if (selectedCard?.card_id === card.card_id) {
        setSelectedCard((prev) => ({ ...prev, completed: newVal }));
      }
    } catch (err) {
      console.error("Failed to toggle completed:", err);
    }
  };

  // ── Fetch ────────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`tasks/lists/${board_id}`);
        setData(
          res.data.lists.map((list) => ({ ...list, cards: list.cards || [] })),
        );
      } catch (err) {
        console.error("Error loading board:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [board_id]);

  // ── Open / Close card detail modal ───────────────────────────
  const openCard = (card, listName) => {
    setSelectedCard(card);
    setSelectedListName(listName);
    setCardDescription(card.card_description || "");
    setEditingDescription(false);
    setComments([]);
    setNewComment("");
  };

  const closeCard = () => {
    setSelectedCard(null);
    setEditingDescription(false);
  };

  // ── List template ────────────────────────────────────────────
  function listTemplate(list, listIdx) {
    const isEditing = editingListId === list.list_id;

    return (
      <div
        key={list.list_id}
        className="kanban-list p-2 rounded shadow-sm"
        style={{
          backgroundColor: list.list_color || theme.listGrey,
          minWidth: "280px",
        }}
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-2 px-1">
          {isEditing ? (
            <input
              autoFocus
              type="text"
              className="form-control form-control-sm fw-bold"
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
              style={{ fontSize: "14px" }}
            />
          ) : (
            <span
              className="fw-bold small"
              title="Click to rename"
              style={{ cursor: "pointer", flex: 1, color: "#fff" }}
              onClick={() => {
                saveInProgress.current = false;
                escapePressed.current = false;
                editingListNameRef.current = list.list_name;
                setEditingListName(list.list_name);
                setEditingListId(list.list_id);
              }}
            >
              {list.list_name}
            </span>
          )}
          <button
            onClick={() => deleteList(list.list_id)}
            className="btn btn-sm border-0 text-secondary"
            title="Delete List"
          >
            &times;
          </button>
        </div>

        {/* Cards */}
        {(list.cards || []).map((card) => (
          <div
            key={card.card_id}
            className="rounded p-2 mb-2 shadow-sm"
            style={{
              backgroundColor: "#22272b",
              cursor: "pointer",
              border: "1px solid rgba(255,255,255,0.08)",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#2c3540")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#22272b")
            }
            onClick={() => openCard(card, list.list_name)}
          >
            <div className="d-flex justify-content-between align-items-start">
              <div style={{ flex: 1 }}>
                <span className="small text-light d-block">
                  {card.card_name}
                </span>
                {card.due_date && (
                  <span
                    className="badge mt-1"
                    style={{
                      backgroundColor: card.completed ? "#4bce97" : "#f87462",
                      color: "#1d2125",
                      fontSize: "11px",
                    }}
                  >
                    📅 {card.due_date}
                    {card.due_time ? ` ${card.due_time}` : ""}
                  </span>
                )}
                {card.completed ? (
                  <span
                    className="badge ms-1 mt-1"
                    style={{
                      backgroundColor: "#4bce97",
                      color: "#1d2125",
                      fontSize: "11px",
                    }}
                  >
                    ✓ Done
                  </span>
                ) : null}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteCard(listIdx, card.card_id);
                }}
                className="btn btn-sm p-0 border-0 text-secondary opacity-50 ms-1"
                style={{ fontSize: "14px", lineHeight: 1 }}
              >
                &times;
              </button>
            </div>
          </div>
        ))}

        {/* + Add a card button */}
        <button
          className="btn btn-sm w-100 text-start p-1 border-0 text-secondary mt-1"
          onClick={() => openAddCardModal(list.list_id, list.list_name)}
        >
          + Add a card
        </button>
      </div>
    );
  }

  if (loading)
    return <div className="p-5 text-center text-light">Loading Board...</div>;

  return (
    <>
      {/* ── Kanban Board ── */}
      <div
        className="kanban-scroll-container d-flex gap-3 p-3"
        style={{ overflowX: "auto" }}
      >
        {data.map((list, listIdx) => listTemplate(list, listIdx))}
        <button
          className="kanban-list p-3 rounded border-0 text-center shadow-sm"
          style={{
            backgroundColor: "rgba(255,255,255,0.15)",
            minWidth: "280px",
            color: "#fff",
          }}
          onClick={() => console.log("Add list clicked.")}
        >
          <span className="fw-bold small">+ Add list</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════
          ADD CARD MODAL
      ══════════════════════════════════════════════════════════ */}
      {addCardModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ zIndex: 4000, backgroundColor: "rgba(0,0,0,0.65)" }}
          onClick={closeAddCardModal}
        >
          <div
            className="rounded-3 p-4 shadow-lg"
            style={{
              width: "460px",
              backgroundColor: "#282e33",
              color: "#b6c2cf",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0" style={{ color: "#b6c2cf" }}>
                Add card to{" "}
                <span style={{ color: "#579dff" }}>
                  {addCardModal.list_name}
                </span>
              </h6>
              <button
                className="btn btn-sm border-0 text-secondary"
                style={{ fontSize: "20px", lineHeight: 1 }}
                onClick={closeAddCardModal}
              >
                &times;
              </button>
            </div>

            {/* Card Name */}
            <div className="mb-3">
              <label
                className="small fw-bold mb-1"
                style={{ color: "#9fadbc" }}
              >
                Card Title <span style={{ color: "#f87462" }}>*</span>
              </label>
              <input
                autoFocus
                type="text"
                className="form-control"
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
                  backgroundColor: "#22272b",
                  color: "#b6c2cf",
                  border: "1px solid #454f59",
                }}
              />
            </div>

            {/* Description */}
            <div className="mb-3">
              <label
                className="small fw-bold mb-1"
                style={{ color: "#9fadbc" }}
              >
                Description
              </label>
              <textarea
                className="form-control"
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
                  backgroundColor: "#22272b",
                  color: "#b6c2cf",
                  border: "1px solid #454f59",
                  resize: "vertical",
                }}
              />
            </div>

            {/* Due Date & Time */}
            <div className="d-flex gap-3 mb-4">
              <div style={{ flex: 1 }}>
                <label
                  className="small fw-bold mb-1"
                  style={{ color: "#9fadbc" }}
                >
                  Due Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={newCard.due_date}
                  onChange={(e) =>
                    setNewCard((p) => ({ ...p, due_date: e.target.value }))
                  }
                  style={{
                    backgroundColor: "#22272b",
                    color: "#b6c2cf",
                    border: "1px solid #454f59",
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label
                  className="small fw-bold mb-1"
                  style={{ color: "#9fadbc" }}
                >
                  Due Time
                </label>
                <input
                  type="time"
                  className="form-control"
                  value={newCard.due_time}
                  onChange={(e) =>
                    setNewCard((p) => ({ ...p, due_time: e.target.value }))
                  }
                  style={{
                    backgroundColor: "#22272b",
                    color: "#b6c2cf",
                    border: "1px solid #454f59",
                  }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="d-flex gap-2">
              <button
                className="btn btn-primary fw-bold px-4"
                onClick={handleAddCard}
                disabled={!newCard.card_name.trim()}
              >
                Add Card
              </button>
              <button
                className="btn btn-sm border-0 text-secondary px-3"
                style={{ backgroundColor: "#374048" }}
                onClick={closeAddCardModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          CARD DETAIL MODAL
      ══════════════════════════════════════════════════════════ */}
      {selectedCard && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{
            zIndex: 3000,
            backgroundColor: "rgba(0,0,0,0.65)",
            overflowY: "auto",
          }}
          onClick={closeCard}
        >
          <div
            className="mx-auto my-5 rounded-3 p-4"
            style={{
              maxWidth: "700px",
              backgroundColor: "#282e33",
              color: "#b6c2cf",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn btn-sm border-0 position-absolute top-0 end-0 m-3 text-secondary"
              style={{ fontSize: "22px", lineHeight: 1 }}
              onClick={closeCard}
            >
              &times;
            </button>

            {/* Title */}
            <div className="d-flex align-items-start gap-3 mb-1">
              <span style={{ fontSize: "20px", marginTop: "3px" }}>📋</span>
              <div className="w-100 pe-4">
                <div
                  className="fw-bold mb-1"
                  style={{ color: "#b6c2cf", fontSize: "18px" }}
                >
                  {selectedCard.card_name}
                </div>
                <div style={{ fontSize: "13px", color: "#7a8a99" }}>
                  in list{" "}
                  <span
                    className="text-decoration-underline"
                    style={{ color: "#9fadbc", cursor: "pointer" }}
                  >
                    {selectedListName}
                  </span>
                </div>
              </div>
            </div>

            <div className="row mt-3 g-3">
              {/* LEFT */}
              <div className="col-12 col-md-8">
                {/* Due Date */}
                {(selectedCard.due_date || selectedCard.due_time) && (
                  <div className="mb-3">
                    <div
                      className="small fw-bold mb-1"
                      style={{ color: "#9fadbc" }}
                    >
                      Due Date
                    </div>
                    <div
                      className="d-inline-flex align-items-center gap-2 rounded px-2 py-1"
                      style={{
                        backgroundColor: selectedCard.completed
                          ? "#4bce97"
                          : "#f87462",
                        color: "#1d2125",
                        fontSize: "13px",
                        fontWeight: 600,
                      }}
                    >
                      📅 {selectedCard.due_date}
                      {selectedCard.due_time && ` at ${selectedCard.due_time}`}
                    </div>
                  </div>
                )}

                {/* Complete toggle */}
                <div className="mb-3 d-flex align-items-center gap-2">
                  <input
                    type="checkbox"
                    id="card-complete"
                    checked={!!selectedCard.completed}
                    onChange={() => handleToggleComplete(selectedCard)}
                    style={{ width: 16, height: 16, cursor: "pointer" }}
                  />
                  <label
                    htmlFor="card-complete"
                    className="small mb-0"
                    style={{ color: "#9fadbc", cursor: "pointer" }}
                  >
                    Mark as complete
                  </label>
                  {selectedCard.completed ? (
                    <span
                      className="badge"
                      style={{
                        backgroundColor: "#4bce97",
                        color: "#1d2125",
                        fontSize: "11px",
                      }}
                    >
                      ✓ Done
                    </span>
                  ) : null}
                </div>

                {/* Members & Labels */}
                <div className="d-flex gap-4 mb-3 flex-wrap">
                  <div>
                    <div
                      className="small fw-bold mb-1"
                      style={{ color: "#9fadbc" }}
                    >
                      Members
                    </div>
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: 32,
                        height: 32,
                        backgroundColor: "#579dff",
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      +
                    </div>
                  </div>
                  <div>
                    <div
                      className="small fw-bold mb-1"
                      style={{ color: "#9fadbc" }}
                    >
                      Labels
                    </div>
                    <span
                      className="badge rounded-pill px-3 py-1"
                      style={{
                        backgroundColor: "#4bce97",
                        color: "#1d2125",
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      {selectedCard.label || "Task"}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-3">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span>≡</span>
                    <span className="fw-bold" style={{ color: "#b6c2cf" }}>
                      Description
                    </span>
                    {!editingDescription && (
                      <button
                        className="btn btn-sm py-0 px-2"
                        style={{
                          backgroundColor: "#374048",
                          color: "#b6c2cf",
                          fontSize: "12px",
                          border: "none",
                        }}
                        onClick={() => setEditingDescription(true)}
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  {editingDescription ? (
                    <div>
                      <textarea
                        autoFocus
                        className="form-control mb-2"
                        rows={4}
                        value={cardDescription}
                        onChange={(e) => setCardDescription(e.target.value)}
                        placeholder="Add a more detailed description..."
                        style={{
                          backgroundColor: "#22272b",
                          color: "#b6c2cf",
                          border: "1px solid #579dff",
                          resize: "vertical",
                        }}
                      />
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={handleSaveDescription}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-sm border-0 text-secondary"
                          onClick={() => setEditingDescription(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="rounded p-2"
                      style={{
                        minHeight: "60px",
                        backgroundColor: "#374048",
                        color: cardDescription ? "#b6c2cf" : "#7a8a99",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                      onClick={() => setEditingDescription(true)}
                    >
                      {cardDescription || "Add a more detailed description..."}
                    </div>
                  )}
                </div>

                {/* Activity */}
                <div className="mb-2">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span>💬</span>
                    <span className="fw-bold" style={{ color: "#b6c2cf" }}>
                      Activity
                    </span>
                  </div>
                  <div className="d-flex gap-2 mb-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: 32,
                        height: 32,
                        backgroundColor: "#579dff",
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: "bold",
                      }}
                    >
                      U
                    </div>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      style={{
                        backgroundColor: "#22272b",
                        color: "#b6c2cf",
                        border: "1px solid #454f59",
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newComment.trim()) {
                          setComments((prev) => [
                            ...prev,
                            {
                              text: newComment.trim(),
                              time: new Date().toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              }),
                            },
                          ]);
                          setNewComment("");
                        }
                      }}
                    />
                  </div>
                  {comments.map((c, i) => (
                    <div key={i} className="d-flex gap-2 mb-2">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                          width: 32,
                          height: 32,
                          backgroundColor: "#579dff",
                          color: "#fff",
                          fontSize: 13,
                          fontWeight: "bold",
                        }}
                      >
                        U
                      </div>
                      <div>
                        <div
                          className="small fw-bold"
                          style={{ color: "#b6c2cf" }}
                        >
                          You{" "}
                          <span className="fw-normal text-secondary ms-1">
                            {c.time}
                          </span>
                        </div>
                        <div
                          className="rounded p-2 mt-1 small"
                          style={{
                            backgroundColor: "#374048",
                            color: "#b6c2cf",
                          }}
                        >
                          {c.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT */}
              <div className="col-12 col-md-4">
                <div
                  className="small fw-bold mb-2"
                  style={{ color: "#9fadbc" }}
                >
                  Add to card
                </div>
                {[
                  { icon: "👤", label: "Members" },
                  { icon: "🏷️", label: "Labels" },
                  { icon: "✅", label: "Checklist" },
                  { icon: "📅", label: "Dates" },
                  { icon: "📎", label: "Attachment" },
                ].map(({ icon, label }) => (
                  <button
                    key={label}
                    className="btn btn-sm w-100 text-start mb-1 d-flex align-items-center gap-2"
                    style={{
                      backgroundColor: "#374048",
                      color: "#b6c2cf",
                      border: "none",
                      fontSize: "13px",
                    }}
                  >
                    <span>{icon}</span> {label}
                  </button>
                ))}
                <div
                  className="small fw-bold mt-3 mb-2"
                  style={{ color: "#9fadbc" }}
                >
                  Actions
                </div>
                {[
                  { icon: "➡️", label: "Move" },
                  { icon: "📋", label: "Copy" },
                  { icon: "🗄️", label: "Archive" },
                ].map(({ icon, label }) => (
                  <button
                    key={label}
                    className="btn btn-sm w-100 text-start mb-1 d-flex align-items-center gap-2"
                    style={{
                      backgroundColor: "#374048",
                      color: "#b6c2cf",
                      border: "none",
                      fontSize: "13px",
                    }}
                  >
                    <span>{icon}</span> {label}
                  </button>
                ))}
                {selectedCard.card_created && (
                  <div className="mt-3">
                    <div
                      className="small fw-bold mb-1"
                      style={{ color: "#9fadbc" }}
                    >
                      Created
                    </div>
                    <div className="small text-secondary">
                      {new Date(selectedCard.card_created).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BoardCards;
