export function detectCollisionPlayer(ball, player) {
  let bottomOfBall = ball.position.y + ball.size;
  let leftOfBall = ball.position.x;
  let rightOfBall = ball.position.x + ball.size;
  let middleOfBall = (leftOfBall + rightOfBall) / 2;

  let topOfPlayer = player.position.y;
  let leftOfPlayer = player.position.x;
  let rightOfPlayer = player.position.x + player.width;

  let hitPosition = 0;
  // |--|--|--|--|--|--|
  //   1  2  3  4  5  6

  let division = player.width / 6;

  if (
    bottomOfBall >= topOfPlayer && // ball below top of player
    rightOfBall >= leftOfPlayer &&
    leftOfBall <= rightOfPlayer
  ) {
    hitPosition = middleOfBall - leftOfPlayer;
    // console.log(hitPosition);
    if (hitPosition < 0) hitPosition = 0;

    // console.log(Math.floor(hitPosition / division));
    return Math.floor(hitPosition / division);
  }

  // no hit
  return -1;
}
