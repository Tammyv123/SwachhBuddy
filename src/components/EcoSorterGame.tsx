import React, { useState } from "react";

const EcoSorterGame: React.FC = () => {
  const itemsData = [
    { name: "🍌 Peel", type: "wet" },
    { name: "🥤 Plastic", type: "dry" },
    { name: "📰 Paper", type: "dry" },
    { name: "🍎 Core", type: "wet" },
    { name: "💊 Medicine", type: "haz" },
    { name: "🔋 Battery", type: "haz" },
    { name: "🥗 Leftovers", type: "wet" },
    { name: "📦 Cardboard", type: "dry" },
  ];

  const [score, setScore] = useState(0);
  const [sortedItems, setSortedItems] = useState(0);
  const [started, setStarted] = useState(false);

  const totalItems = itemsData.length;

  const allowDrop = (ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
  };

  const drag = (ev: React.DragEvent<HTMLDivElement>, id: string) => {
    ev.dataTransfer.setData("text", id);
  };

  const drop = (ev: React.DragEvent<HTMLDivElement>, binType: string) => {
    ev.preventDefault();
    const id = ev.dataTransfer.getData("text");
    const element = document.getElementById(id);

    if (element && element.dataset.type) {
      if (element.dataset.type === binType) {
        setScore((prev) => prev + 1);
      } else {
        setScore((prev) => prev - 1);
      }
      element.remove();
      setSortedItems((prev) => prev + 1);
    }
  };

  const resetGame = () => {
    setScore(0);
    setSortedItems(0);
    setStarted(false);
  };

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "24px",
        padding: "35px",
        textAlign: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        width: "95%",
        maxWidth: "850px",
        margin: "auto",
        animation: "fadeIn 1s ease",
      }}
    >
      {/* Start Screen */}
      {!started && sortedItems === 0 && (
        <div>
          <h1
            style={{
              fontSize: "2.2rem",
              marginBottom: "10px",
              color: "#2e7d32",
            }}
          >
            ♻ Eco Sorter Training
          </h1>
          <p style={{ fontSize: "1rem", color: "#555" }}>
            Instructions:<br />
            👉 Drag and drop items into the correct bins.<br />
            ✅ Correct drop = +1 point.<br />
            ❌ Wrong drop = –1 point.<br />
            🏆 Complete all items to finish and see your score!
          </p>
          <button
            style={{
              padding: "14px 28px",
              marginTop: "25px",
              background: "linear-gradient(135deg, #43cea2, #185a9d)",
              border: "none",
              borderRadius: "14px",
              color: "white",
              fontSize: "17px",
              cursor: "pointer",
              boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
            }}
            onClick={() => setStarted(true)}
          >
            Start Game
          </button>
        </div>
      )}

      {/* Game Screen */}
      {started && sortedItems < totalItems && (
        <div>
          <h2 style={{ color: "#388e3c", marginBottom: "15px" }}>
            Drag items into bins
          </h2>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              flexWrap: "wrap",
              margin: "25px 0",
            }}
          >
            {itemsData.map((item, index) => {
              const itemId = `item-${index}`;
              return (
                <div
                  key={index}
                  id={itemId}
                  data-type={item.type}
                  draggable
                  onDragStart={(e) => drag(e, itemId)}
                  style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: "16px",
                    background: "#f9f9f9",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "grab",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    color: "#333",
                    border: "2px solid #ddd",
                  }}
                >
                  {item.name}
                </div>
              );
            })}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              gap: "20px",
              flexWrap: "wrap",
              marginTop: "35px",
            }}
          >
            <div
              onDrop={(e) => drop(e, "wet")}
              onDragOver={allowDrop}
              style={{
                width: "150px",
                height: "160px",
                borderRadius: "16px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #66bb6a, #2e7d32)",
                color: "white",
                fontWeight: "bold",
                fontSize: "16px",
                boxShadow: "0 6px 12px rgba(0,0,0,0.25)",
              }}
            >
              🌿 Wet Waste
            </div>
            <div
              onDrop={(e) => drop(e, "dry")}
              onDragOver={allowDrop}
              style={{
                width: "150px",
                height: "160px",
                borderRadius: "16px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #ffb74d, #f57c00)",
                color: "white",
                fontWeight: "bold",
                fontSize: "16px",
                boxShadow: "0 6px 12px rgba(0,0,0,0.25)",
              }}
            >
              📦 Dry Waste
            </div>
            <div
              onDrop={(e) => drop(e, "haz")}
              onDragOver={allowDrop}
              style={{
                width: "150px",
                height: "160px",
                borderRadius: "16px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #e57373, #c62828)",
                color: "white",
                fontWeight: "bold",
                fontSize: "16px",
                boxShadow: "0 6px 12px rgba(0,0,0,0.25)",
              }}
            >
              ☠ Hazardous
            </div>
          </div>

          <p
            style={{
              fontSize: "1.2rem",
              marginTop: "20px",
              fontWeight: "bold",
              color: "#2e7d32",
            }}
          >
            ⭐ Score: {score}
          </p>
        </div>
      )}

      {/* End Screen */}
      {started && sortedItems === totalItems && (
        <div>
          <h2 style={{ color: "#388e3c", marginBottom: "15px" }}>
            🎉 Sorting Complete!
          </h2>
          <p style={{ fontSize: "1rem", color: "#555" }}>
            Your final score: {score}/{totalItems}
          </p>
          <button
            style={{
              padding: "14px 28px",
              marginTop: "25px",
              background: "linear-gradient(135deg, #43cea2, #185a9d)",
              border: "none",
              borderRadius: "14px",
              color: "white",
              fontSize: "17px",
              cursor: "pointer",
              boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
            }}
            onClick={resetGame}
          >
            🔄 Play Again
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default EcoSorterGame;
