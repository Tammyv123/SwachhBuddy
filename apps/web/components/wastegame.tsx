import React, { useState, useRef } from "react";

// Word list for eco-friendly waste segregation
const words = [
  "GLASS",
  "PLASTIC",
  "COMPOST",
  "MANURE",
  "BIN",
  "PAPER",
  "EWASTE",
  "RECYCLING",
  "ORGANIC",
  "SEGREGATE",
];

const gridSize = 15;

// Generate empty grid with random letters
const generateEmptyGrid = (): string[][] => {
  return Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, () =>
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
    )
  );
};

// Place word horizontally or vertically
const placeWord = (grid: string[][], word: string) => {
  const direction = Math.random() > 0.5 ? "H" : "V";
  if (direction === "H") {
    const row = Math.floor(Math.random() * gridSize);
    const col = Math.floor(Math.random() * (gridSize - word.length));
    for (let i = 0; i < word.length; i++) grid[row][col + i] = word[i];
  } else {
    const row = Math.floor(Math.random() * (gridSize - word.length));
    const col = Math.floor(Math.random() * gridSize);
    for (let i = 0; i < word.length; i++) grid[row + i][col] = word[i];
  }
};

interface Position {
  row: number;
  col: number;
}

const WordSearch: React.FC = () => {
  const [grid] = useState(() => {
    const g = generateEmptyGrid();
    words.forEach((w) => placeWord(g, w.toUpperCase()));
    return g;
  });

  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selection, setSelection] = useState<Position[]>([]);
  const isSelecting = useRef(false);

  // Check if dark mode is active by looking at body class
  const isDarkMode = document.body.classList.contains("dark");

  // Mouse down starts selection
  const handleMouseDown = (row: number, col: number) => {
    isSelecting.current = true;
    setSelection([{ row, col }]);
  };

  // Mouse enter adds to selection while dragging
  const handleMouseEnter = (row: number, col: number) => {
    if (!isSelecting.current) return;
    setSelection((prev) => {
      const last = prev[prev.length - 1];
      if (!last || last.row !== row || last.col !== col) {
        return [...prev, { row, col }];
      }
      return prev;
    });
  };

  // Mouse up ends selection and checks word
  const handleMouseUp = () => {
    if (selection.length < 2) {
      setSelection([]);
      isSelecting.current = false;
      return;
    }

    // Construct the selected word
    const selectedWord = selection.map((pos) => grid[pos.row][pos.col]).join("");

    const reversedWord = selectedWord.split("").reverse().join("");

    if (words.includes(selectedWord) && !foundWords.includes(selectedWord)) {
      setFoundWords((prev) => [...prev, selectedWord]);
    } else if (words.includes(reversedWord) && !foundWords.includes(reversedWord)) {
      setFoundWords((prev) => [...prev, reversedWord]);
    }

    setSelection([]);
    isSelecting.current = false;
  };

  // Check if a cell is in current selection
  const isSelected = (row: number, col: number) =>
    selection.some((pos) => pos.row === row && pos.col === col);

  // Check if a cell is part of found word
  const isFound = (row: number, col: number) => {
    for (const word of foundWords) {
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          if (grid[r][c] === word[0]) {
            // Check horizontal
            if (
              c + word.length <= gridSize &&
              word === grid[r].slice(c, c + word.length).join("")
            )
              if (row === r && col >= c && col < c + word.length) return true;
            // Check vertical
            if (
              r + word.length <= gridSize &&
              word === Array.from({ length: word.length }, (_, i) => grid[r + i][c]).join("")
            )
              if (col === c && row >= r && row < r + word.length) return true;
          }
        }
      }
    }
    return false;
  };

  return (
    <div
      style={{
        ...styles.container,
        background: isDarkMode ? "#1a1a1a" : "#e6f2e6", // Dark theme bg
        color: isDarkMode ? "black" : "black", // Always black text
      }}
    >
      <h2>🌱 Waste Segregation Word Search 🌱</h2>
      <div
        style={styles.grid}
        onMouseLeave={() => {
          setSelection([]);
          isSelecting.current = false;
        }}
      >
        {grid.map((rowArr, rowIdx) => (
          <div key={rowIdx} style={styles.row}>
            {rowArr.map((letter, colIdx) => (
              <div
                key={colIdx}
                style={{
                  ...styles.cell,
                  backgroundColor: isFound(rowIdx, colIdx)
                    ? "#4caf50"
                    : isSelected(rowIdx, colIdx)
                    ? "#a5d6a7"
                    : "#f0fff0",
                  color: isFound(rowIdx, colIdx) ? "white" : "black", // ✅ always black (except found word)
                }}
                onMouseDown={() => handleMouseDown(rowIdx, colIdx)}
                onMouseEnter={() => handleMouseEnter(rowIdx, colIdx)}
                onMouseUp={handleMouseUp}
              >
                {letter}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={styles.wordsToFind}>
        <h3>Find these words:</h3>
        <ul style={{ padding: 0, listStyle: "none" }}>
          {words.map((word) => (
            <li
              key={word}
              style={{
                fontWeight: "bold",
                color: foundWords.includes(word)
                  ? "#4caf50"
                  : isDarkMode
                  ? "black"
                  : "#2e7d32",
                textDecoration: foundWords.includes(word) ? "line-through" : "none",
                margin: "4px 0",
              }}
            >
              {word}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Inline styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    padding: 25,
    borderRadius: 12,
    width: "fit-content",
    margin: "auto",
    boxShadow: "0 0 20px rgba(0, 128, 0, 0.3)",
    userSelect: "none",
  },
  grid: {
    display: "inline-block",
    marginTop: 20,
  },
  row: {
    display: "flex",
  },
  cell: {
    width: 35,
    height: 35,
    border: "1px solid #4caf50",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  wordsToFind: {
    marginTop: 25,
    textAlign: "left",
  },
};

export default WordSearch;
