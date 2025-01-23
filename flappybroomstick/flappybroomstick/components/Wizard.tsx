import * as React from "react";
import { Position } from "../types/gameTypes";

type WizardProps = {
  position: Position;
  velocity: number;
};

export const Wizard: React.FC<WizardProps> = ({
  position,
  velocity,
}: WizardProps) => {
  return (
    <div
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        transform: `rotate(${velocity * 3}deg) scaleX(-1)`,
        transition: "transform 0.1s",
      }}
    >
      {/* Hat */}
      <div
        style={{
          position: "absolute",
          top: "-15px",
          left: "5px",
          width: "30px",
          height: "30px",
          background: "#34495e",
          clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
        }}
      />
      {/* Body */}
      <div
        style={{
          width: "40px",
          height: "30px",
          background: "#9b59b6",
          borderRadius: "20px 20px 10px 10px",
        }}
      />
      {/* Broomstick */}
      <div
        style={{
          position: "absolute",
          bottom: "-5px",
          left: "-20px",
          width: "80px",
          height: "8px",
          background: "#8e44ad",
          borderRadius: "4px",
        }}
      />
      {/* Broom bristles */}
      <div
        style={{
          position: "absolute",
          bottom: "-8px",
          right: "-25px",
          width: "30px",
          height: "15px",
          background: "#95a5a6",
          borderRadius: "0 15px 15px 0",
        }}
      />
    </div>
  );
};
