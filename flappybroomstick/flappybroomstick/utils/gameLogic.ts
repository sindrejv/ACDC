import { GameState, GAME_CONFIG, Obstacle } from "../types/gameTypes";

export const updateGameState = (prevState: GameState): GameState => {
  if (!prevState) return prevState;

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
      newObstacles[newObstacles.length - 1].x < GAME_CONFIG.GAME_WIDTH - 300)
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
      height: GAME_CONFIG.GAME_HEIGHT,
      isTop: true,
    });
  }

  const newPosition = {
    x: prevState.wizardPosition.x,
    y: prevState.wizardPosition.y + prevState.wizardVelocity,
  };

  const hasCollision = checkCollision(newPosition, newObstacles);
  const outOfBounds = checkOutOfBounds(newPosition);

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
};

const checkCollision = (
  position: { x: number; y: number },
  obstacles: Obstacle[]
) => {
  return obstacles.some((obs) => {
    const inXRange =
      position.x + GAME_CONFIG.WIZARD_SIZE > obs.x &&
      position.x < obs.x + GAME_CONFIG.OBSTACLE_WIDTH;
    const inYRange =
      position.y < obs.topHeight ||
      position.y + GAME_CONFIG.WIZARD_SIZE > obs.topHeight + obs.gap;
    return inXRange && inYRange;
  });
};

const checkOutOfBounds = (position: { x: number; y: number }) => {
  return (
    position.y < 0 ||
    position.y + GAME_CONFIG.WIZARD_SIZE > GAME_CONFIG.GAME_HEIGHT
  );
};
