import * as React from "react";

type GameOverModalProps = {
  score: number;
  onRestart: () => void;
};

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  onRestart,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "#ffffff",
        padding: "2rem",
        borderRadius: "8px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
        textAlign: "left",
        minWidth: "420px",
        border: "1px solid rgba(225, 223, 221, 0.8)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            background: "#EFF6FC",
            padding: "8px",
            borderRadius: "6px",
            color: "#0078D4",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2
          style={{
            color: "#323130",
            fontSize: "1.4rem",
            margin: 0,
            fontWeight: "600",
            fontFamily: "Segoe UI, sans-serif",
          }}
        >
          Game Over
        </h2>
      </div>

      <div
        style={{
          padding: "0 0 1.5rem 0",
          color: "#323130",
          fontSize: "14px",
          fontFamily: "Segoe UI, sans-serif",
          lineHeight: "1.6",
        }}
      >
        <p style={{ margin: "0 0 1.5rem 0" }}>
          You fell off your broom, but don't worry, Gilderoy Lockhart performed
          a healing spell. Try again!
        </p>

        <div
          style={{
            background: "linear-gradient(to right, #EFF6FC, #F8FBFD)",
            padding: "1.2rem",
            marginBottom: "1.5rem",
            borderRadius: "6px",
            border: "1px solid #E1DFDD",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                color: "#605E5C",
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "4px",
              }}
            >
              FINAL SCORE
            </div>
            <div
              style={{
                color: "#0078D4",
                fontSize: "2rem",
                fontWeight: "600",
              }}
            >
              {Math.floor(score / 10)}
            </div>
          </div>
          <div
            style={{
              color: "#0078D4",
              opacity: 0.8,
            }}
          >
            <img
              src="https://acdcimages.blob.core.windows.net/images/gilderoy.svg"
              width="64"
              height="64"
              alt="Gilderoy Lockhart"
              style={{
                objectFit: "contain",
                filter: "grayscale(0.1) brightness(1.1)",
                transform: "scale(1.2)",
              }}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid #E1DFDD",
          paddingTop: "1.5rem",
          display: "flex",
          justifyContent: "flex-end",
          gap: "12px",
        }}
      >
        <button
          onClick={onRestart}
          style={{
            background: "#0078D4",
            border: "none",
            padding: "0 1.5rem",
            fontSize: "14px",
            cursor: "pointer",
            fontWeight: "500",
            color: "#ffffff",
            fontFamily: "Segoe UI, sans-serif",
            minWidth: "100px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "4px",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "#106EBE";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "#0078D4";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Try Again
        </button>
      </div>

      <div
        style={{
          color: "#605E5C",
          fontSize: "12px",
          marginTop: "1rem",
          textAlign: "center",
          fontFamily: "Segoe UI, sans-serif",
          opacity: 0.8,
        }}
      >
        Press SPACE or Click to restart
      </div>
    </div>
  );
};
