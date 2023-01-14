import { GAMESTATE } from "./game";

export default class InputHandler {
  constructor(player, game) {
    this.keys = game.keys;
    // this.mode = game.mode;
    this.game = game;
    this.volume = localStorage.getItem("volume");
    if (this.volume == null) this.volume = 5;

    this.moveLeft = false;
    this.moveRight = false;
    this.moveLeft2 = false;
    this.moveRight2 = false;

    this.player = player;
    this.player2 = game.player2;

    document.addEventListener("keydown", e => {
      // console.log(e.key);

      switch (e.key) {
        case "a":
        case "A":
          if (this.keys == 0 || this.mode == "multi") this.moveLeft = true; //player.moveLeft();
          break;
        case "d":
        case "D":
          if (this.keys == 0 || this.mode == "multi") this.moveRight = true; //player.moveRight();
          break;
        case "ArrowLeft":
          if (this.keys == 1) this.moveLeft = true; // player.moveLeft();
          if (this.mode == "multi") this.moveLeft2 = true; //game.player2.moveLeft();
          break;
        case "ArrowRight":
          if (this.keys == 1) this.moveRight = true; //player.moveRight();
          if (this.mode == "multi") this.moveRight2 = true; //game.player2.moveRight();
          break;
        case " ":
          game.ball.go();
          if (this.mode == "multi") game.ball2.go();
          break;
        case "Enter":
          // console.log(game.gameState);
          if (
            game.gameState === GAMESTATE.MENU ||
            game.gameState === GAMESTATE.SETTINGS ||
            game.gameState === GAMESTATE.GAMEOVER ||
            game.gameState === GAMESTATE.LEADERBOARD ||
            game.gameState === GAMESTATE.YOUWIN
          ) {
            // game.start();
            game.mode = "single";
            this.mode = "single";
            game.gameState = GAMESTATE.NAMEINPUT;
          } else if (game.gameState === GAMESTATE.PAUSED)
            game.gameState = GAMESTATE.RUNNING;
          else if (game.gameState === GAMESTATE.NAMEINPUT) {
            game.init();
            game.start();
          }
          break;
        case "s":
        case "S":
          // if (game.gameState === GAMESTATE.MENU)
          if (
            game.gameState !== GAMESTATE.RUNNING &&
            // game.gameState !== GAMESTATE.PAUSED &&
            game.gameState !== GAMESTATE.NAMEINPUT
          )
            game.gameState = GAMESTATE.SETTINGS;
          break;
        case "l":
        case "L":
          if (
            game.gameState !== GAMESTATE.RUNNING &&
            // game.gameState !== GAMESTATE.PAUSED &&
            game.gameState !== GAMESTATE.NAMEINPUT
          )
            game.gameState = GAMESTATE.LEADERBOARD;
          break;
        case "m":
        case "M":
          if (
            game.gameState !== GAMESTATE.RUNNING &&
            // game.gameState !== GAMESTATE.PAUSED &&
            game.gameState !== GAMESTATE.NAMEINPUT
          ) {
            game.mode = "multi";
            this.mode = "multi";
            game.init();
            game.start();
          }
          break;
        case "Escape":
          if (game.gameState === GAMESTATE.RUNNING)
            game.gameState = GAMESTATE.PAUSED;
          break;
      }

      this.setMusic();
    });

    document.addEventListener("keyup", e => {
      switch (e.key) {
        case "a":
        case "A":
          this.moveLeft = false;
          break;
        case "d":
        case "D":
          this.moveRight = false;
          //player.stop();
          break;
        case "ArrowLeft":
          if (this.mode == "single") this.moveLeft = false; //player.stop();
          if (this.mode == "multi") this.moveLeft2 = false; //game.player2.stop();
          break;
        case "ArrowRight":
          if (this.mode == "single") this.moveRight = false; //player.stop();
          if (this.mode == "multi") this.moveRight2 = false; //game.player2.stop();
          break;
      }
    });

    document.addEventListener("click", e => {
      // console.log(e);
      let c = document.getElementById("gameScreen");
      let rect = c.getBoundingClientRect();
      // console.log(e.x - rect.left);
      game.handleClick(e.x - rect.left, e.y - rect.top);

      this.setMusic();
    });
  }

  update() {
    if (this.moveRight) this.player.moveRight();
    else if (this.moveLeft) this.player.moveLeft();
    else this.player.stop();

    if (this.moveRight2) this.player2.moveRight();
    else if (this.moveLeft2) this.player2.moveLeft();
    else this.player2.stop();
  }

  changeKeys(newKeys) {
    this.keys = newKeys;
  }

  setMusic() {
    // ker se ne synca z this.game.volume
    this.volume = localStorage.getItem("volume");
    if (this.volume == null) this.volume = 3;
    let song = document.getElementById("song");
    song.volume = this.volume / 10;
    song.muted = false;
  }
}
