import * as React from "react";
import { IInputs } from "./generated/ManifestTypes";
import {
  GameState,
  GAME_CONFIG,
  Obstacle as ObstacleType,
  Position,
} from "./types/gameTypes";
import { Wizard } from "./components/Wizard";
import { Obstacle } from "./components/Obstacle";

export type CrmParams = {
  context: ComponentFramework.Context<IInputs>;
};

export const App: React.FC<CrmParams> = ({ context }) => {
  const [gameStarted, setGameStarted] = React.useState(false);
  const [gameState, setGameState] = React.useState<GameState>({
    wizardPosition: { x: 100, y: GAME_CONFIG.GAME_HEIGHT / 2 },
    wizardVelocity: 0,
    obstacles: [],
    gameOver: false,
    score: 0,
  });

  const resetGame = React.useCallback(() => {
    setGameState({
      wizardPosition: { x: 100, y: GAME_CONFIG.GAME_HEIGHT / 2 },
      wizardVelocity: 0,
      obstacles: [],
      gameOver: false,
      score: 0,
    });
    setGameStarted(false);
  }, []);

  const gameLoop = React.useCallback(() => {
    if (!gameStarted || gameState.gameOver) return;

    setGameState((prevState) => {
      const newVelocity = prevState.wizardVelocity + GAME_CONFIG.GRAVITY;

      const newObstacles = [];
      const needNewObstacle = prevState.obstacles.length === 0;

      for (const obs of prevState.obstacles) {
        const newX = obs.x - GAME_CONFIG.OBSTACLE_SPEED;
        if (newX + GAME_CONFIG.OBSTACLE_WIDTH > 0) {
          newObstacles.push({ ...obs, x: newX });
        }
      }

      if (
        needNewObstacle ||
        (newObstacles.length > 0 &&
          newObstacles[newObstacles.length - 1].x <
            GAME_CONFIG.GAME_WIDTH - 300)
      ) {
        newObstacles.push({
          x: GAME_CONFIG.GAME_WIDTH,
          topHeight:
            Math.random() *
              (GAME_CONFIG.GAME_HEIGHT -
                GAME_CONFIG.OBSTACLE_GAP -
                GAME_CONFIG.MIN_OBSTACLE_HEIGHT * 2) +
            GAME_CONFIG.MIN_OBSTACLE_HEIGHT,
          gap: GAME_CONFIG.OBSTACLE_GAP,
        });
      }

      const newPosition = {
        x: prevState.wizardPosition.x,
        y: prevState.wizardPosition.y + prevState.wizardVelocity,
      };

      const hasCollision = newObstacles.some((obs) => {
        const inXRange =
          newPosition.x + GAME_CONFIG.WIZARD_SIZE > obs.x &&
          newPosition.x < obs.x + GAME_CONFIG.OBSTACLE_WIDTH;
        const inYRange =
          newPosition.y < obs.topHeight ||
          newPosition.y + GAME_CONFIG.WIZARD_SIZE > obs.topHeight + obs.gap;
        return inXRange && inYRange;
      });

      const outOfBounds =
        newPosition.y < 0 ||
        newPosition.y + GAME_CONFIG.WIZARD_SIZE > GAME_CONFIG.GAME_HEIGHT;

      if (hasCollision || outOfBounds) {
        return { ...prevState, gameOver: true };
      }

      return {
        ...prevState,
        wizardPosition: newPosition,
        wizardVelocity: newVelocity,
        obstacles: newObstacles,
        score: prevState.score + 1,
      };
    });
  }, [gameStarted, gameState.gameOver]);

  const handleKeyPress = React.useCallback(
    (event: KeyboardEvent) => {
      if (event.code === "Space") {
        if (!gameStarted) {
          setGameStarted(true);
        } else if (gameState.gameOver) {
          resetGame();
        } else {
          setGameState((prev) => ({
            ...prev,
            wizardVelocity: GAME_CONFIG.JUMP_FORCE,
          }));
        }
      }
    },
    [gameStarted, gameState.gameOver, resetGame]
  );

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    const gameInterval = setInterval(gameLoop, 16);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      clearInterval(gameInterval);
    };
  }, [gameLoop, handleKeyPress]);

  return (
    <div
      style={{
        position: "relative",
        width: GAME_CONFIG.GAME_WIDTH,
        height: GAME_CONFIG.GAME_HEIGHT,
        background: "#87CEEB",
        overflow: "hidden",
      }}
    >
      {!gameStarted ? (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "24px",
            color: "white",
            textAlign: "center",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          Press SPACE to Start
        </div>
      ) : (
        <>
          <Wizard
            position={gameState.wizardPosition}
            velocity={gameState.wizardVelocity}
          />
          {gameState.obstacles.map((obstacle, index) => (
            <Obstacle key={index} obstacle={obstacle} />
          ))}
          <div
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              fontSize: "24px",
              color: "white",
            }}
          >
            Score: {Math.floor(gameState.score / 10)}
          </div>
          {gameState.gameOver && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "48px",
                color: "white",
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              Game Over!
              <br />
              <span style={{ fontSize: "24px" }}>Press SPACE to Restart</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
