import * as React from "react";
import { GameState, GAME_CONFIG } from "../types/gameTypes";

export const useGameState = () => {
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

  return {
    gameStarted,
    setGameStarted,
    gameState,
    setGameState,
    resetGame,
  };
};
