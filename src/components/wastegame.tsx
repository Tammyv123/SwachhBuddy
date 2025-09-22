import { useState } from "react";

interface Cell {
  letter?: string;       // correct letter
  userInput?: string;    // what user types
  isBlack?: boolean;     // black cell
  visible?: boolean;     // prefilled letter
}

const initialGrid: Cell[][] = [
  [
    { letter: "P", userInput: "", visible: true },
    { letter: "L", userInput: "" },
    { letter: "A", userInput: "" },
    { letter: "S", userInput: "" },
    { letter: "T", userInput: "", visible: true },
  ],
  [
    { isBlack: true },
    { letter: "O", userInput: "", visible: true },
    { letter: "R", userInput: "" },
    { letter: "G", userInput: "" },
    { letter: "A", userInput: "" },
  ],
  [
    { letter: "C", userInput: "", visible: true },
    { letter: "O", userInput: "" },
    { letter: "M", userInput: "" },
    { letter: "P", userInput: "" },
    { letter: "O", userInput: "" },
  ],
  [
    { letter: "G", userInput: "" },
    { letter: "L", userInput: "" },
    { letter: "A", userInput: "", visible: true },
    { letter: "S", userInput: "" },
    { letter: "S", userInput: "" },
  ],
  [
    { letter: "B", userInput: "", visible: true },
    { letter: "I", userInput: "" },
    { letter: "N", userInput: "" },
    { isBlack: true },
    { isBlack: true },
  ],
];

const clues = [
  { word: "PLAST", direction: "across", row: 0, col: 0, clue: "Material to recycle" },
  { word: "ORGA", direction: "across", row: 1, col: 1, clue: "Organic waste turns into?" },
  { word: "COMPO", direction: "across", row: 2, col: 0, clue: "Organic soil enrichment" },
  { word: "GLASS", direction: "across", row: 3, col: 0, clue: "Recyclable bottles" },
  { word: "BIN", direction: "across", row: 4, col: 0, clue: "Where to throw waste" },
];

const WasteGame = () => {
  const [grid, setGrid] = useState(initialGrid);

  const handleChange = (row: number, col: number, value: string) => {
    const newGrid = [...grid];
    newGrid[row][col].userInput = value.toUpperCase().slice(0, 1);
    setGrid(newGrid);
  };

  const checkAnswers = () => {
    let score = 0;
    grid.forEach((row) =>
      row.forEach((cell) => {
        if (!cell.isBlack && cell.userInput === cell.letter) score += 1;
      })
    );
    alert(`You got ${score} correct letters!`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-green-50">
      <h1 className="text-3xl font-bold text-green-900 mb-6">Eco Crossword ♻</h1>

      {/* Grid */}
      <div className="grid gap-1">
        {grid.map((row, rIndex) => (
          <div className="flex" key={rIndex}>
            {row.map((cell, cIndex) =>
              cell.isBlack ? (
                <div
                  key={cIndex}
                  className="w-10 h-10 bg-green-800 border border-green-400"
                />
              ) : (
                <input
                  key={cIndex}
                  className="w-10 h-10 border border-green-400 text-center font-bold text-green-900 uppercase bg-white"
                  value={cell.visible ? cell.letter : cell.userInput}
                  onChange={(e) => handleChange(rIndex, cIndex, e.target.value)}
                  disabled={cell.visible}
                />
              )
            )}
          </div>
        ))}
      </div>

      {/* Clues */}
      <div className="mt-8 max-w-lg w-full">
        <h2 className="text-xl font-semibold text-green-800 mb-4">Clues</h2>
        <ul className="list-disc list-inside text-green-700">
          {clues.map((clue, i) => (
            <li key={i}>
              {clue.clue} ({clue.direction})
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={checkAnswers}
        className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-700"
      >
        Check Answers
      </button>
    </div>
  );
};

export default WasteGame;
