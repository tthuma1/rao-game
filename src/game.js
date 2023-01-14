import Player from "./player";
import InputHandler from "./input";
import Ball from "./ball";
import { buildLevel, levels } from "./levels";
import Settings from "./settings";

export const GAMESTATE = {
  MENU: 0,
  RUNNING: 1,
  PAUSED: 2,
  GAMEOVER: 3,
  YOUWIN: 4,
  LEADERBOARD: 5,
  SETTINGS: 6,
  NAMEINPUT: 7,
};

export default class Game {
  constructor(screenWidth, screenHeight) {
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.gameState = GAMESTATE.MENU;
    this.imgball = document.getElementById("img_ball");

    this.volume = localStorage.getItem("volume");
    if (this.volume == null) this.volume = 3;

    // let song = document.getElementById("song");
    // song.volume = this.volume / 10;
    // song.muted = false;

    this.difficulty = localStorage.getItem("difficulty");
    if (this.difficulty == null) this.difficulty = 1;
    this.setLives(this.difficulty);

    this.keys = localStorage.getItem("keys");
    if (this.keys == null) this.keys = 0;

    this.leaderboard = localStorage.getItem("leaderboard");
    if (this.leaderboard == null) this.leaderboard = [];
    else {
      // create leaderboard array
      let temp = this.leaderboard.split(",");
      this.leaderboard = [];
      let temp2 = [];
      let i = 0;
      for (const x of temp) {
        if (i == 0) temp2 = [x];
        else {
          temp2.push(x);
          this.leaderboard.push(temp2);
          temp2 = [];
        }
        i = (i + 1) % 2;
      }
    }
    // console.log(this.leaderboard);

    this.player = new Player(this);
    this.ball = new Ball(this);
    this.settings = new Settings(this);

    this.gameObjects = [];
    this.bricks = [];

    this.levels = levels;
    this.currentLevel = 0;

    this.score = 0;

    this.mode = "single";

    this.player2 = new Player(this, 1);
    this.ball2 = new Ball(this, 1);

    this.inputHandler = new InputHandler(this.player, this);
    this.hasInput = false;
    this.playerName = "";
  }

  init() {
    this.currentLevel = 0;
    this.score = 0;
  }

  start() {
    this.bricks = buildLevel(this, this.levels[this.currentLevel]);
    this.gameObjects = [this.player, this.ball];
    if (this.mode == "multi") this.gameObjects.push(this.player2, this.ball2);

    // this.ball.reset();
    // this.ball2.reset();
    this.ball.init();
    this.ball2.init();
    this.player.reset();
    this.player2.reset();

    this.lives = 5 - this.difficulty;
    // this.lives = 1;
    if (this.currentLevel == 0) this.score = 0;

    try {
      this.playerName = document.getElementById("nameinput").value;
      if (this.playerName == "") this.playerName = "anon";
      document.body.removeChild(document.getElementById("nameinput"));
    } catch {
      console.log("No input element on screen.");
    }
    this.hasInput = false;

    this.gameState = GAMESTATE.RUNNING;
  }

  update(timestamp) {
    if (
      this.gameState === GAMESTATE.MENU ||
      this.gameState === GAMESTATE.SETTINGS ||
      this.gameState === GAMESTATE.GAMEOVER ||
      this.gameState === GAMESTATE.PAUSED ||
      this.gameState === GAMESTATE.NAMEINPUT ||
      this.gameState === GAMESTATE.LEADERBOARD ||
      this.gameState === GAMESTATE.YOUWIN
    )
      return;

    if (this.lives === 0) {
      if (this.gameState !== GAMESTATE.GAMEOVER) this.updateLeaderboard();
      this.gameState = GAMESTATE.GAMEOVER;
      this.currentLevel = 0;
      this.score = 0;
    }

    [...this.gameObjects].forEach(object => object.update());

    [...this.bricks].every(brick => {
      let hit = brick.update(timestamp);
      if (!hit) return true; // to prevent multiple hits at once
    });

    this.bricks = this.bricks.filter(brick => !brick.markedForDeletion);

    if (this.bricks.length === 0) {
      this.currentLevel++;
      if (this.currentLevel >= this.levels.length) {
        this.gameState = GAMESTATE.YOUWIN;
        this.currentLevel = 0;
        this.score = 0;
      } else {
        this.start();
      }
      // }
    }

    this.inputHandler.update();
  }

  draw(ctx) {
    let bg2 = document.getElementById("bg2");
    ctx.drawImage(bg2, 0, 0, this.screenWidth, this.screenHeight);

    if (this.gameState === GAMESTATE.MENU) {
      this.drawMenu(ctx);
    } else if (this.gameState === GAMESTATE.SETTINGS) {
      this.settings.draw(ctx);
    } else if (this.gameState === GAMESTATE.GAMEOVER) {
      this.drawGameOver(ctx);
    } else if (this.gameState === GAMESTATE.PAUSED) {
      this.drawPaused(ctx);
    } else if (this.gameState === GAMESTATE.NAMEINPUT) {
      this.drawNameInput(ctx);
    } else if (this.gameState === GAMESTATE.LEADERBOARD) {
      this.drawLeaderboard(ctx);
      ctx.textAlign = "center";
      ctx.fillText(
        "Press Enter to play",
        this.screenWidth / 2,
        this.screenHeight / 2 + 150
      );
      this.drawInputOptions(ctx, this.screenHeight / 2 + 190, 40);
    } else if (this.gameState === GAMESTATE.YOUWIN) {
      this.drawYouWin(ctx);
    } else {
      [...this.gameObjects].forEach(object => object.draw(ctx));
      [...this.bricks].forEach(brick => brick.draw(ctx));

      ctx.font = "25px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "left";
      let livesText = "Lives: ";
      ctx.fillText(livesText, 10, 30);
      for (let i = 0; i < this.lives; i++) {
        ctx.drawImage(
          this.imgball,
          i * 20 + ctx.measureText(livesText).width + 10,
          15,
          16,
          16
        );
      }

      ctx.textAlign = "right";
      ctx.fillText("Level: " + (this.currentLevel + 1), 790, 30);

      ctx.textAlign = "left";
      ctx.fillText("Score: " + this.score, this.screenWidth / 2 - 50, 30);
    }
  }

  // changeState(newState) {
  //   this.gameState = newState;
  // }

  drawMenu(ctx) {
    ctx.font = "40px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Brick Breaker", this.screenWidth / 2, 150);

    ctx.font = "25px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      "Press Enter to start",
      this.screenWidth / 2,
      this.screenHeight / 2
    );

    this.drawInputOptions(ctx, this.screenHeight / 2 + 50, 50);
  }

  drawInputOptions(ctx, starty, spacing) {
    ctx.font = "25px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    ctx.fillText("Press S for settings", this.screenWidth / 2, starty);

    ctx.fillText(
      "Press L for leaderboard",
      this.screenWidth / 2,
      starty + spacing
    );

    ctx.fillText(
      "Press M for multiplayer",
      this.screenWidth / 2,
      starty + 2 * spacing
    );

    // ctx.textAlign = "left";
  }

  drawGameOver(ctx) {
    ctx.font = "40px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", this.screenWidth / 2, 100);

    ctx.font = "25px Arial";

    this.drawLeaderboard(ctx);

    ctx.textAlign = "center";
    ctx.fillText(
      "Press Enter to play again",
      this.screenWidth / 2,
      this.screenHeight / 2 + 150
    );

    this.drawInputOptions(ctx, this.screenHeight / 2 + 190, 40);
  }

  drawYouWin(ctx) {
    ctx.font = "40px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("You Win!", this.screenWidth / 2, 100);

    ctx.font = "25px Arial";

    this.drawLeaderboard(ctx);

    ctx.textAlign = "center";
    ctx.fillText(
      "Press Enter to play again",
      this.screenWidth / 2,
      this.screenHeight / 2 + 150
    );

    this.drawInputOptions(ctx, this.screenHeight / 2 + 190, 40);
  }

  drawLeaderboard(ctx) {
    ctx.textAlign = "center";
    ctx.fillText("Leaderboard", this.screenWidth / 2, 200);
    let x = 240;
    this.leaderboard.forEach(data => {
      const [name, score] = data;
      ctx.textAlign = "right";
      ctx.fillText(name, this.screenWidth / 2 - 50, x);

      ctx.textAlign = "left";
      ctx.fillText(score, this.screenWidth / 2 + 50, x);

      x += 40;
    });
  }

  updateLeaderboard() {
    this.leaderboard.push([this.playerName, this.score]);
    // console.log(this.leaderboard);

    this.leaderboard.sort(function (a, b) {
      return b[1] - a[1];
    });

    if (this.leaderboard.length > 5) this.leaderboard.pop();

    localStorage.setItem("leaderboard", this.leaderboard);
  }

  drawPaused(ctx) {
    ctx.font = "25px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Paused", this.screenWidth / 2, this.screenHeight / 2);

    ctx.fillText(
      "Press Enter to continue",
      this.screenWidth / 2,
      this.screenHeight / 2 + 150
    );
    this.drawInputOptions(ctx, this.screenHeight / 2 + 190, 40);
  }

  handleClick(x, y) {
    if (this.gameState === GAMESTATE.SETTINGS) {
      this.settings.handleClick(x, y);
    }
  }

  setLives(difficulty) {
    this.lives = 5 - difficulty;
    this.difficulty = difficulty;
  }

  // changeKeys() {
  //   this.inputHandler.keys = this.keys;
  // }

  drawNameInput(ctx) {
    ctx.font = "25px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    ctx.fillText(
      "Input your name: ",
      this.screenWidth / 2,
      this.screenHeight / 2 - 100
    );

    if (!this.hasInput) {
      let input = document.createElement("input");

      let c = document.getElementById("gameScreen");
      let rect = c.getBoundingClientRect();

      input.type = "text";
      input.id = "nameinput";
      input.maxLength = "20";
      input.style.position = "fixed";
      input.style.left = rect.left + 300 + "px";
      input.style.top = rect.top + 300 + "px";

      document.body.appendChild(input);

      input.focus();

      this.hasInput = true;
    }

    ctx.fillText(
      "Press Enter to start",
      this.screenWidth / 2,
      this.screenHeight / 2 + 100
    );
  }
}
