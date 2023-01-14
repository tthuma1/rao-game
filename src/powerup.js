export default class Powerup {
  constructor(game) {
    this.images = [
      document.getElementById("speeddown"),
      document.getElementById("speedup"),
    ];

    this.game = game;
    this.type = Math.floor(Math.random() * 2);
    this.screenWidth = game.screenWidth;
    this.screenHeight = game.screenHeight;

    this.width = 50;
    this.height = 60;

    this.position = {
      x: Math.random() * (this.screenWidth - this.width),
      y: this.screenHeight - 80,
    };

    this.visible = true; //false;
    this.visibleTimestamp = 0;
    this.applied = false;
    this.appliedTimestamp = 0;
  }

  draw(ctx) {
    if (this.visible)
      ctx.drawImage(
        this.images[this.type],
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
  }

  update(timestamp) {
    if (this.visible) {
      let col1 = this.detectCollision(this.game.player);
      let col2 = undefined;
      if (this.game.mode == "multi") {
        col2 = this.detectCollision(this.game.player2);
      }

      if (col1 || col2) {
        // apply powerup
        if (this.type == 0) {
          this.game.ball.slowed = true;
          if (this.game.mode == "multi") this.game.ball2.slowed = true;
        } else if (this.type == 1) {
          this.game.ball.sped = true;
          if (this.game.mode == "multi") this.game.ball2.sped = true;
        }

        this.visible = false;
        this.applied = true;
        this.appliedTimestamp = timestamp;
      }
    }

    // 6s invisible, 3s visible
    if (this.visibleTimestamp == 0) this.visibleTimestamp = timestamp;

    if (
      timestamp - this.visibleTimestamp - 3000 >= 2000 &&
      this.visible == false &&
      this.applied == false
    ) {
      this.visible = true;
      this.visibleTimestamp = timestamp;
      this.type = Math.floor(Math.random() * 2);
      this.position.x = Math.random() * (this.screenWidth - this.width);
    }

    if (timestamp - this.visibleTimestamp >= 3000) {
      this.visible = false;
    }

    // apply for 3s
    if (timestamp - this.appliedTimestamp >= 3000 && this.applied == true) {
      this.applied = false;

      if (this.type == 0) {
        this.game.ball.slowed = false;
        if (this.game.mode == "multi") this.game.ball2.slowed = false;
      } else if (this.type == 1) {
        this.game.ball.sped = false;
        if (this.game.mode == "multi") this.game.ball2.sped = false;
      }
    }
  }

  reset() {}

  detectCollision(player) {
    let bottomOfPU = this.position.y + this.height;
    let topOfPU = this.position.y;
    let leftOfPU = this.position.x;
    let rightOfPU = this.position.x + this.width;

    let topOfPlayer = player.position.y;
    let leftOfPlayer = player.position.x;
    let rightOfPlayer = player.position.x + player.width;
    let bottomOfPlayer = player.position.y + player.height;

    if (
      bottomOfPU >= topOfPlayer &&
      topOfPU <= bottomOfPlayer &&
      rightOfPU >= leftOfPlayer &&
      leftOfPU <= rightOfPlayer
    ) {
      return 1;
    }

    return 0;
  }
}
