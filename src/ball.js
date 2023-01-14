import { detectCollisionPlayer } from "./collisionDetectionPlayer";

export default class Ball {
  constructor(game, num = 0) {
    this.image = document.getElementById("img_ball");

    // this.player = game.player;
    this.players = [game.player];
    if (game.mode == "multi") this.players.push(game.player2);
    // this.players = [];

    this.screenWidth = game.screenWidth;
    this.screenHeight = game.screenHeight;

    this.game = game;
    this.size = 20;
    this.reset();
    this.state = 0; // 0 = still, 1 = moving

    this.maxSpeed = 9;

    this.num = num;
    this.speed = { x: 0, y: 0 };

    this.slowed = false;
    this.sped = false;
  }

  init() {
    this.players = [this.game.player];
    if (this.game.mode == "multi") this.players.push(this.game.player2);

    this.reset();
  }

  reset() {
    this.position = {
      // this.ball.reset();
      // this.ball2.reset();
      x: this.screenWidth / 2 - this.size / 2,
      y: this.screenHeight - this.size - 10,
    };
    this.speed = { x: 0, y: 0 };
    this.state = 0;
  }

  go() {
    if (this.state === 1) return;
    this.speed = { x: 5, y: -6 };
    this.state = 1;
  }

  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.size,
      this.size
    );
  }

  update() {
    this.position.x += this.speed.x;
    this.position.y += this.speed.y;

    if (this.state === 0) {
      // at start of game
      let player;
      if (this.num == 0) player = this.players[0];
      else player = this.players[1];

      // console.log(player);

      this.position.x = player.position.x + player.width / 2 - this.size / 2;
      this.position.y = player.position.y - this.size;
    } else {
      if (this.position.x <= 0) {
        // wall collision on left
        this.speed.x = -this.speed.x;
        this.position.x = 0; // to prevent glitch in wall
      } else if (this.position.x + this.size >= this.screenWidth) {
        // wall collision on right
        this.speed.x = -this.speed.x;
        this.position.x = this.screenWidth - this.size - 1; // to prevent glitch in wall
      }

      // wall collision on top
      if (this.position.y <= 0) {
        this.speed.y = -this.speed.y;
      }

      // bottom of ball below players top
      if (this.position.y + this.size > this.screenHeight) {
        this.game.lives--;
        if (this.num == 0) this.players[0].reset();
        else this.players[1].reset();
        this.reset();
      }

      let collision = detectCollisionPlayer(this, this.players[0]);

      switch (collision) {
        case 0: // left corner
          this.speed.x -= 6;
          break;
        case 1: // left mid
          this.speed.x -= 3;
          break;
        // case 2: // mid
        // case 3:
        //   this.speed.x = this.speed.x;
        //   break;
        case 4: // right mid
          this.speed.x += 3;
          break;
        case 5: // right corner
        case 6:
          this.speed.x += 6;
          break;
      }

      if (this.speed.x > this.maxSpeed) this.speed.x = this.maxSpeed;
      else if (this.speed.x < -this.maxSpeed) this.speed.x = -this.maxSpeed;

      if (collision != -1) {
        // collision with player
        this.speed.y = -this.speed.y;
        this.position.y = this.players[0].position.y - this.size;
      }

      if (this.game.mode == "multi") {
        let collision2 = detectCollisionPlayer(this, this.players[1]);

        if (collision2 != -1 && collision == -1) {
          // collision with player2
          // can't collide with both players

          switch (collision2) {
            case 0: // left corner
              this.speed.x -= 6;
              break;
            case 1: // left mid
              this.speed.x -= 3;
              break;
            case 4: // right mid
              this.speed.x += 3;
              break;
            case 5: // right corner
            case 6:
              this.speed.x += 6;
              break;
          }

          this.speed.y = -this.speed.y;
          this.position.y = this.players[1].position.y - this.size;
        }
      }
    }

    if (this.slowed) {
      if (this.speed.y < 0) this.speed.y = -4;
      else if (this.speed.y > 0) this.speed.y = 4;
    } else if (this.sped) {
      if (this.speed.y < 0) this.speed.y = -8;
      else if (this.speed.y > 0) this.speed.y = 8;
    } else {
      if (this.speed.y < 0) this.speed.y = -6;
      else if (this.speed.y > 0) this.speed.y = 6;
    }
  }
}
