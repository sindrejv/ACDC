export type Position = {
  x: number;
  y: number;
};

export type GameState = {
  wizardPosition: Position;
  wizardVelocity: number;
  obstacles: Obstacle[];
  gameOver: boolean;
  score: number;
};

export type Obstacle = {
  x: number;
  topHeight: number;
  gap: number;
  height: number;
  isTop: boolean;
};

export const GAME_CONFIG = {
  GRAVITY: 0.15,
  JUMP_FORCE: -4,
  WIZARD_SIZE: 40,
  GAME_WIDTH: 800,
  GAME_HEIGHT: 800,
  OBSTACLE_WIDTH: 80,
  OBSTACLE_GAP: 200,
  OBSTACLE_SPEED: 3,
  MIN_OBSTACLE_HEIGHT: 50,
};
