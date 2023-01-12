export default class Settings {
  constructor(game) {
    this.arrows = [
      document.getElementById("arrow_l"),
      document.getElementById("arrow_r"),
    ];

    this.rects = [
      { x: 470, y: 130, w: 27, h: 27, direction: 0, type: 0 }, // left, volume
      { x: 630, y: 130, w: 27, h: 27, direction: 1, type: 0 }, // right, volume
      { x: 470, y: 200, w: 27, h: 27, direction: 0, type: 1 }, // left, difficulty
      { x: 630, y: 200, w: 27, h: 27, direction: 1, type: 1 }, // right, difficulty
      { x: 470, y: 270, w: 27, h: 27, direction: 0, type: 2 }, // left, keys
      { x: 630, y: 270, w: 27, h: 27, direction: 1, type: 2 }, // right, keys
    ];

    this.volume = game.volume;
    this.difficulty = game.difficulty;
    this.keys = game.keys;
    this.game = game;
  }

  draw(ctx) {
    ctx.font = "25px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText("Volume", 100, 150);

    this.rects.forEach(rect =>
      ctx.drawImage(this.arrows[rect.direction], rect.x, rect.y, rect.w, rect.h)
    );
    ctx.fillText(this.volume.toString(), 550, 150);

    ctx.fillText("Difficulty", 100, 220);

    let dif_text;
    if (this.difficulty == 0) dif_text = "Easy";
    else if (this.difficulty == 1) dif_text = "Normal";
    else if (this.difficulty == 2) dif_text = "Hard";

    // console.log(this.difficulty == 2);
    // console.log(this.difficulty);

    // dif_text = this.difficulty.toString();

    ctx.textAlign = "center";
    ctx.fillText(dif_text, 560, 220);
    ctx.textAlign = "left";

    ctx.fillText("Keys", 100, 290);

    let keys_text;
    if (this.keys == 0) keys_text = "wasd";
    else if (this.keys == 1) keys_text = "arrows";

    ctx.textAlign = "center";
    ctx.fillText(keys_text, 560, 290);
    // ctx.textAlign = "left";

    // ctx.fillText("Press Enter to play", 300, 500);
    ctx.textAlign = "center";

    ctx.fillText(
      "Press Enter to play",
      this.game.screenWidth / 2,
      this.game.screenHeight / 2 + 100
    );
    this.game.drawInputOptions(ctx, this.game.screenHeight / 2 + 150, 50);
  }

  handleClick(x, y) {
    this.rects.forEach(rect => {
      if (
        x >= rect.x &&
        x <= rect.x + rect.w &&
        y >= rect.y &&
        y <= rect.y + rect.h
      ) {
        if (rect.type === 0) {
          // volume
          if (rect.direction === 0) this.volume--;
          else this.volume++;

          if (this.volume > 10) this.volume = 10;
          else if (this.volume < 0) this.volume = 0;

          let song = document.getElementById("song");
          song.volume = this.volume / 10;
          song.muted = false;
          localStorage.setItem("volume", this.volume);
        } else if (rect.type === 1) {
          // difficulty
          if (rect.direction === 0) this.difficulty--;
          else this.difficulty++;

          if (this.difficulty > 2) this.difficulty = 2;
          else if (this.difficulty < 0) this.difficulty = 0;

          this.game.setLives(this.difficulty);
          localStorage.setItem("difficulty", this.difficulty);
        } else if (rect.type === 2) {
          // keys
          if (rect.direction === 0) this.keys--;
          else this.keys++;

          if (this.keys > 1) this.keys = 1;
          else if (this.keys < 0) this.keys = 0;

          // console.log(this.keys);
          this.game.inputHandler.changeKeys(this.keys);
          localStorage.setItem("keys", this.keys);
        }
      }
    });
  }
}
