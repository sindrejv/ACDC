import * as React from "react";
import { IInputs } from "./generated/ManifestTypes";
import { GAME_CONFIG } from "./types/gameTypes";
import { Wizard } from "./components/Wizard";
import { Obstacle } from "./components/Obstacle";
import { useGameState } from "./hooks/useGameState";
import { updateGameState } from "./utils/gameLogic";
import { GameOverModal } from "./components/GameOverModal";
import { GilderoyHealModal } from "./components/GilderoyHealModal";

export type CrmParams = {
  context: ComponentFramework.Context<IInputs>;
  setStage: (stage: number) => void;
};

export const App: React.FC<CrmParams> = ({ context, setStage }) => {
  const { gameStarted, setGameStarted, gameState, setGameState, resetGame } =
    useGameState();
  const [lives, setLives] = React.useState(3);
  const [bestScore, setBestScore] = React.useState(0);
  const [currentSessionBestScore, setCurrentSessionBestScore] =
    React.useState(0);

  const handleGameOver = React.useCallback(() => {
    const currentScore = Math.floor(gameState.score / 10);

    // Update current session best score
    setCurrentSessionBestScore((prev) => Math.max(prev, currentScore));

    if (lives > 1) {
      setLives((prev) => prev - 1);
      setGameState((prev) => ({
        ...prev,
        gameOver: true,
      }));
    } else {
      // Final game over - no more lives left
      setLives(0);
      // Update all-time best score if current session's best score is higher
      setBestScore((prev) =>
        Math.max(prev, currentSessionBestScore, currentScore)
      );
      setGameState((prev) => ({
        ...prev,
        gameOver: true,
      }));
      updateBestScore(bestScore);
    }
  }, [lives, gameState.score, setGameState, currentSessionBestScore]);

  const gameLoop = React.useCallback(() => {
    if (!gameStarted || gameState.gameOver) return;
    setGameState((prevState) => {
      const newState = updateGameState(prevState);
      if (newState.gameOver) {
        handleGameOver();
      }
      return newState;
    });
  }, [gameStarted, gameState.gameOver, setGameState, handleGameOver]);

  const handleKeyPress = React.useCallback(
    (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
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
    [gameStarted, gameState.gameOver, resetGame, setGameState, setGameStarted]
  );

  const handleClick = React.useCallback(() => {
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
  }, [
    gameStarted,
    gameState.gameOver,
    resetGame,
    setGameState,
    setGameStarted,
  ]);

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    const gameInterval = setInterval(gameLoop, 16);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      clearInterval(gameInterval);
    };
  }, [gameLoop, handleKeyPress]);

  const styles = {
    container: {
      height: "100%",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    gameArea: {
      width: "1200px",
      height: "600px",
      position: "relative" as const,
      backgroundColor: "#000000",
      overflow: "hidden",
    },
  };

  async function updateBestScore(bestScore: number) {
    const entityId = context.parameters.entityId.raw;
    let finalScore = bestScore;
    if (!entityId) {
      throw new Error("Entity ID is required");
    }
    if (bestScore >= 100) {
      finalScore = 100;
    }

    const data: ComponentFramework.WebApi.Entity = {
      new_pointsbroomstickexam: finalScore,
    };
    await context.webAPI.updateRecord(entityId, "new_challenge", data);
    setStage(100000003);
  }

  return (
    <div style={styles.container}>
      <div style={styles.gameArea} onClick={handleClick}>
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
            Press SPACE or Click to Start
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
              <div>Score: {Math.floor(gameState.score / 10)}</div>
              <div>Lives: {lives}</div>
            </div>
            {gameState.gameOver && (
              <>
                {lives === 2 ? (
                  <GilderoyHealModal
                    onContinue={() => {
                      resetGame();
                    }}
                    livesRemaining={lives}
                    bestScore={currentSessionBestScore}
                  />
                ) : (
                  <GameOverModal
                    score={gameState.score}
                    bestScore={
                      lives === 0 ? bestScore : currentSessionBestScore
                    }
                    onRestart={() => {
                      resetGame();
                    }}
                    attemptsLeft={lives}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
