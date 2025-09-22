import React, { useState } from "react";

type WasteItem = {
  id: number;
  emoji: string;
  type: "organic" | "recyclable" | "hazardous";
};

const initialItems: WasteItem[] = [
  { id: 1, emoji: "🍎", type: "organic" },
  { id: 2, emoji: "🥤", type: "recyclable" },
  { id: 3, emoji: "💡", type: "hazardous" },
  { id: 4, emoji: "🍌", type: "organic" },
  { id: 5, emoji: "📦", type: "recyclable" },
];

const categories = [
  { id: "organic", label: "Organic ♻", color: "#66bb6a" },
  { id: "recyclable", label: "Recyclable 🔄", color: "#42a5f5" },
  { id: "hazardous", label: "Hazardous ☣", color: "#e57373" },
];

const WasteSortingGame: React.FC = () => {
  const [items, setItems] = useState<WasteItem[]>(initialItems);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    e.dataTransfer.setData("text/plain", id.toString());
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>, category: string) => {
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData("text/plain"), 10);
    const item = items.find((i) => i.id === id);
    if (!item) return;

    if (item.type === category) {
      setScore((prev) => prev + 1);
      setFeedback(`✅ Correct! ${item.emoji} goes into ${category}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setFeedback(`❌ Wrong! ${item.emoji} does NOT belong to ${category}`);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 20, textAlign: "center" }}>
      <h1 style={{ color: "#2e7d32" }}>Waste Sorting Game</h1>
      <p>Drag the items into the correct bin!</p>

      <p style={{ fontWeight: "bold" }}>Score: {score}</p>
      {feedback && <p>{feedback}</p>}

      {/* Items */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 15,
          flexWrap: "wrap",
          margin: "20px 0",
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => onDragStart(e, item.id)}
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "#f9f9f9",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 30,
              cursor: "grab",
              border: "2px solid #ddd",
            }}
          >
            {item.emoji}
          </div>
        ))}
      </div>

      {/* Bins */}
      <div style={{ display: "flex", justifyContent: "space-around", marginTop: 20 }}>
        {categories.map((cat) => (
          <div
            key={cat.id}
            onDrop={(e) => onDrop(e, cat.id)}
            onDragOver={(e) => e.preventDefault()}
            style={{
              width: 150,
              height: 120,
              background: cat.color,
              borderRadius: 15,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              color: "#fff",
              flexDirection: "column",
            }}
          >
            <span>{cat.label}</span>
            <span style={{ fontSize: 12 }}>Drop items here</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          setItems(initialItems);
          setScore(0);
          setFeedback("");
        }}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          background: "#43cea2",
          color: "#fff",
          border: "none",
          borderRadius: 10,
          cursor: "pointer",
        }}
      >
        Restart
      </button>
    </div>
  );
};

export default WasteSortingGame;
