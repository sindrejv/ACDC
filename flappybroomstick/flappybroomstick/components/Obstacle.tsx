import * as React from "react";
import { Obstacle as ObstacleType, GAME_CONFIG } from "../types/gameTypes";

type ObstacleProps = {
  obstacle: ObstacleType;
};

export const Obstacle: React.FC<ObstacleProps> = ({
  obstacle,
}: ObstacleProps) => {
  return (
    <>
      {/* Top Evil Wizard Tower */}
      <div
        style={{
          position: "absolute",
          left: obstacle.x,
          top: 0,
          width: GAME_CONFIG.OBSTACLE_WIDTH,
          height: obstacle.topHeight,
          background: "#2c3e50", // Dark tower color
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Evil Wizard Face */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: "60px",
            background: "#8e44ad",
            borderRadius: "0 0 10px 10px",
          }}
        >
          {/* Eyes */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "10px",
              width: "12px",
              height: "12px",
              background: "#e74c3c",
              borderRadius: "50%",
              boxShadow: "0 0 5px #e74c3c",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "20px",
              right: "10px",
              width: "12px",
              height: "12px",
              background: "#e74c3c",
              borderRadius: "50%",
              boxShadow: "0 0 5px #e74c3c",
            }}
          />
          {/* Evil Smile */}
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "30px",
              height: "10px",
              background: "#e74c3c",
              clipPath: "polygon(0 100%, 50% 0, 100% 100%)",
            }}
          />
        </div>
      </div>

      {/* Bottom Evil Wizard Tower */}
      <div
        style={{
          position: "absolute",
          left: obstacle.x,
          top: obstacle.topHeight + obstacle.gap,
          width: GAME_CONFIG.OBSTACLE_WIDTH,
          height: GAME_CONFIG.GAME_HEIGHT - (obstacle.topHeight + obstacle.gap),
          background: "#2c3e50",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Evil Wizard Face */}
        <div
          style={{
            position: "absolute",
            top: 0,
            width: "100%",
            height: "60px",
            background: "#8e44ad",
            borderRadius: "10px 10px 0 0",
          }}
        >
          {/* Eyes */}
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "10px",
              width: "12px",
              height: "12px",
              background: "#e74c3c",
              borderRadius: "50%",
              boxShadow: "0 0 5px #e74c3c",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              right: "10px",
              width: "12px",
              height: "12px",
              background: "#e74c3c",
              borderRadius: "50%",
              boxShadow: "0 0 5px #e74c3c",
            }}
          />
          {/* Evil Smile */}
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "50%",
              transform: "translateX(-50%) rotate(180deg)",
              width: "30px",
              height: "10px",
              background: "#e74c3c",
              clipPath: "polygon(0 100%, 50% 0, 100% 100%)",
            }}
          />
        </div>
      </div>
    </>
  );
};
