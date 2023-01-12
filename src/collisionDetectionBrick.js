export function detectCollision(ball, brick) {
  let bottomOfBall = ball.position.y + ball.size;
  let topOfBall = ball.position.y;
  let leftOfBall = ball.position.x;
  let rightOfBall = ball.position.x + ball.size;

  let topOfBrick = brick.position.y;
  let leftOfBrick = brick.position.x;
  let rightOfBrick = brick.position.x + brick.width;
  let bottomOfBrick = brick.position.y + brick.height;

  if (
    bottomOfBall >= topOfBrick &&
    topOfBall <= bottomOfBrick &&
    rightOfBall >= leftOfBrick &&
    leftOfBall <= rightOfBrick
  ) {
    // hit
    if (
      ball.speed.x == 0 || // can only hit top or bottom
      (ball.speed.x > 0 && // going up and right - can hit bottom or left of brick
        ball.speed.y < 0 &&
        bottomOfBrick - topOfBall < rightOfBall - leftOfBrick) || // ball hit bottom of brick
      (ball.speed.x < 0 && // going up and left - can hit bottom or right of brick
        ball.speed.y < 0 &&
        bottomOfBrick - topOfBall < rightOfBrick - leftOfBall) || // ball hit bottom of brick
      (ball.speed.x > 0 &&
        ball.speed.y > 0 &&
        bottomOfBall - topOfBrick < rightOfBall - leftOfBrick) || // ball hit top of brick
      (ball.speed.x < 0 &&
        ball.speed.y > 0 &&
        bottomOfBall - topOfBrick < rightOfBrick - leftOfBall) // ball hit top of brick
    ) {
      // ball hit bottom or top of brick
      return 1;
    } else {
      // collision left or right
      return 2;
    }
  }

  // no hit
  return -1;
}
