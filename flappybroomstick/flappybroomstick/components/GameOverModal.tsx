import * as React from "react";

type GameOverModalProps = {
  score: number;
  bestScore: number;
  onRestart: () => void;
  attemptsLeft: number;
};

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  bestScore,
  onRestart,
  attemptsLeft,
}) => {
  const getMessage = () => {
    if (attemptsLeft === 0) {
      return "Game Over! That's your best score out of three attempts!";
    }
    return "Try again! You can do better!";
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: "20px",
        borderRadius: "10px",
        color: "white",
        textAlign: "center",
      }}
    >
      <h2>{getMessage()}</h2>
      <p>Current Score: {Math.floor(score / 10)}</p>
      <p>Best Score: {bestScore}</p>
      {attemptsLeft > 0 && (
        <p>Attempts remaining: {attemptsLeft}</p>
      )}
      <button
        onClick={onRestart}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        {attemptsLeft === 0 ? "Start New Game" : "Continue"}
      </button>
    </div>
  );
};
