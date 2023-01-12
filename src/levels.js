import Brick from "./brick";

export function buildLevel(game, level) {
  let bricks = [];

  level.forEach((row, rowIndex) => {
    row.forEach((brick, brickIndex) => {
      position = {
        x: 80 * brickIndex,
        y: 75 + 24 * rowIndex,
      };

      if (brick != 0) {
        bricks.push(new Brick(game, position, brick));
      }
    });
  });

  return bricks;
}

const level1 = [
  // [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
  // [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
  // [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  // [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  // [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  // [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
];

const level2 = [
  [3, 0, 0, 2, 2, 2, 2, 0, 0, 3],
  [1, 3, 0, 0, 2, 2, 0, 0, 3, 1],
  [1, 1, 3, 0, 0, 0, 0, 3, 1, 1],
  [1, 1, 1, 3, 0, 0, 3, 1, 1, 1],
  [1, 1, 1, 3, 0, 0, 3, 1, 1, 1],
  [1, 1, 1, 3, 0, 0, 3, 1, 1, 1],
  [1, 1, 3, 0, 0, 0, 0, 3, 1, 1],
  [1, 3, 0, 0, 2, 2, 0, 0, 3, 1],
  [3, 0, 0, 2, 2, 2, 2, 0, 0, 3],
  // [0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
];

export const levels = [level1, level2];
