export default class Player {
  constructor(game, num = 0) {
    this.image = document.getElementById("img_player");
    if (num == 1) this.image = document.getElementById("img_player2");
    this.screenWidth = game.screenWidth;
    this.screenHeight = game.screenHeight;
    this.width = 113;
    this.height = 27;

    this.maxSpeed = 10;
    this.speed = 0;

    this.position = {
      x: this.screenWidth / 2 - this.width / 2,
      y: this.screenHeight - this.height - 10,
    };

    this.game = game;

    this.num = num;
  }

  reset() {
    if (this.game.mode == "single") {
      this.position.x = this.screenWidth / 2 - this.width / 2;
    } else {
      if (this.num == 0) {
        this.position.x = this.screenWidth / 2 - this.width / 2 - this.width;
      } else {
        this.position.x = this.screenWidth / 2 - this.width / 2 + this.width;
      }
    }
  }

  moveLeft() {
    this.speed = -this.maxSpeed;
  }
  moveRight() {
    this.speed = this.maxSpeed;
  }
  stop() {
    this.speed = 0;
  }

  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.position.x += this.speed;
    if (this.position.x < 0) this.position.x = 0;
    if (this.position.x + this.width > this.screenWidth)
      this.position.x = this.screenWidth - this.width;
  }
}
