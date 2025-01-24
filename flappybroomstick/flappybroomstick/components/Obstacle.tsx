import * as React from "react";
import { Obstacle as ObstacleType, GAME_CONFIG } from "../types/gameTypes";

type ObstacleProps = {
  obstacle: ObstacleType;
};

export const Obstacle: React.FC<ObstacleProps> = ({ obstacle }) => {
  return (
    <>
      {/* Top spike */}
      <div
        style={{
          position: "absolute",
          width: "60px",
          height: `${obstacle.topHeight}px`,
          left: `${obstacle.x}px`,
          top: 0,
          backgroundColor: "#D3D3D3",
          clipPath: "polygon(50% 100%, 0% 0%, 100% 0%)",
        }}
      />

      {/* Bottom spike */}
      <div
        style={{
          position: "absolute",
          width: "60px",
          height: `${
            GAME_CONFIG.GAME_HEIGHT - (obstacle.topHeight + obstacle.gap)
          }px`,
          left: `${obstacle.x}px`,
          top: `${obstacle.topHeight + obstacle.gap}px`,
          backgroundColor: "#D3D3D3",
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
        }}
      />
    </>
  );
};
