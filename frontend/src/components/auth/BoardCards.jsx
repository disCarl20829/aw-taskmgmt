import React, { useState, useEffect } from "react";

const BoardCards = ({ colors }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const theme = colors || {
    listGrey: "#f3f4f6",
    accentGreen: "#10b981",
    dangerRed: "#fee2e2",
    textRed: "#991b1b",
  };

  // 1. FETCH DATA FROM DATABASE ON LOAD
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/kanban"); // Replace with your URL
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Error loading board:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. DELETE CARD
  const deleteCard = async (listIdx, cardId) => {
    try {
      await fetch(`/api/cards/${cardId}`, { method: "DELETE" });

      const newData = [...data];
      newData[listIdx].cards = newData[listIdx].cards.filter(
        (c) => c.id !== cardId,
      );
      setData(newData);
    } catch (err) {
      alert("Failed to delete card");
    }
  };

  // 3. DELETE LIST
  const deleteList = async (listId) => {
    if (!window.confirm("Delete this entire list?")) return;

    try {
      await fetch(`/api/lists/${listId}`, { method: "DELETE" });
      setData(data.filter((list) => list.id !== listId));
    } catch (err) {
      alert("Failed to delete list");
    }
  };

  if (loading) return <div className="p-5 text-center">Loading Board...</div>;

  return (
    <div
      className="kanban-scroll-container d-flex gap-3 p-3"
      style={{ overflowX: "auto" }}
    >
      {data.map((list, listIdx) => (
        <div
          key={list.id}
          className="kanban-list p-2 rounded shadow-sm"
          style={{
            backgroundColor: list.color || theme.listGrey,
            minWidth: "280px",
          }}
        >
          {/* List Header with Delete List Option */}
          <div className="d-flex justify-content-between align-items-center mb-2 px-1">
            <input
              className="fw-bold small border-0 bg-transparent w-75"
              value={list.title}
              readOnly // Change to handleTitleChange if you have a PATCH route
            />
            <button
              onClick={() => deleteList(list.id)}
              className="btn btn-sm border-0 text-secondary"
              title="Delete List"
            >
              &times;
            </button>
          </div>

          {/* Cards */}
          {list.cards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded p-2 mb-2 shadow-sm d-flex justify-content-between align-items-center group"
            >
              <div className="d-flex align-items-center gap-2">
                <input type="checkbox" checked={card.completed} readOnly />
                <span className="small text-dark">{card.text}</span>
              </div>

              {/* Delete Card Button */}
              <button
                onClick={() => deleteCard(listIdx, card.id)}
                className="btn btn-sm p-0 border-0 text-danger opacity-50"
                style={{ fontSize: "16px" }}
              >
                &minus;
              </button>
            </div>
          ))}

          <button className="btn btn-sm w-100 text-start p-1 border-0 text-secondary">
            + Add card
          </button>
        </div>
      ))}

      <button
        onClick={() => {
          /* logic to POST new list */
        }}
        className="kanban-list p-3 rounded border-0 text-center shadow-sm"
        style={{ backgroundColor: theme.listGrey, minWidth: "280px" }}
      >
        <span className="fw-bold small">+ Add list</span>
      </button>
    </div>
  );
};

export default BoardCards;
