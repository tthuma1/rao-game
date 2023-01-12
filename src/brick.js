import { detectCollision } from "./collisionDetectionBrick";

export default class Brick {
  constructor(game, position, type) {
    this.images = [
      document.getElementById("img_brick1"),
      document.getElementById("img_brick2"),
      document.getElementById("img_brick3"),
    ];

    this.game = game;
    this.position = position;
    this.balls = [game.ball];
    if (this.game.mode == "multi") this.balls.push(game.ball2);

    this.width = 80;
    this.height = 24;

    this.type = type;
    this.markedForDeletion = false;

    this.hitTimestamp = 0;
    this.destroyed = false;
  }

  draw(ctx) {
    ctx.drawImage(
      this.images[this.type - 1],
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );

    // if (this.hitTimestamp && this.type == 1) {
    //   this.height -= 3;
    //   console.log(this.height);
    // }
    // if (this.height < 10) this.markedForDeletion = true;
  }

  update(timestamp) {
    let prevState = this.type;

    this.balls.forEach(ball => {
      if (!this.hitTimestamp) {
        let hit = detectCollision(ball, this);
        switch (hit) {
          case 1: // hit top or bottom
            ball.speed.y = -ball.speed.y;
            // this.type--;
            // if (this.type < 1) {
            //   this.height += 10;
            //   this.width += 10;
            //   // this.markedForDeletion = true;
            // }
            break;
          case 2: // hit left or right
            ball.speed.x = -ball.speed.x;
            // this.type--;
            // if (this.type < 1) {
            //   this.markedForDeletion = true;
            // }
            break;
        }

        if (hit != -1) {
          this.type--;
          this.hitTimestamp = timestamp;
          this.height += 5;
          this.width += 5;
          this.position.x -= 2;
          this.position.y -= 2;
          if (this.type < 1) {
            this.type = 1; // prevent error
            this.destroyed = true;
            // this.markedForDeletion = true;
          }
        }
      }
    });

    if (prevState != this.type) {
      // hit
      this.game.score++;
      return 1;
    }

    if (this.hitTimestamp != 0 && timestamp > this.hitTimestamp + 30) {
      this.height -= 5;
      this.width -= 5;
      this.position.x += 2;
      this.position.y += 2;

      // console.log(this.type);

      if (this.destroyed == true) this.markedForDeletion = true;
      else this.hitTimestamp = 0;
    }

    return 0; // no hit
  }
}
