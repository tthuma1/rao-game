import { GAMESTATE } from "./game";

export default class InputHandler {
  constructor(player, game) {
    this.keys = game.keys;
    this.mode = game.mode;
    this.game = game;

    document.addEventListener("keydown", e => {
      // console.log(e.key);
      switch (e.key) {
        case "a":
        case "A":
          if (this.keys == 0 || this.mode == "multi") player.moveLeft();
          break;
        case "d":
        case "D":
          if (this.keys == 0 || this.mode == "multi") player.moveRight();
          break;
        case "ArrowLeft":
          if (this.keys == 1) player.moveLeft();
          if (this.mode == "multi") this.game.player2.moveLeft();
          break;
        case "ArrowRight":
          if (this.keys == 1) player.moveRight();
          if (this.mode == "multi") this.game.player2.moveRight();
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
          else if (game.gameState === GAMESTATE.NAMEINPUT) game.start();
          break;
        case "s":
        case "S":
          if (game.gameState === GAMESTATE.MENU)
            game.gameState = GAMESTATE.SETTINGS;
          break;
        case "l":
        case "L":
          game.gameState = GAMESTATE.LEADERBOARD;
          break;
        case "m":
        case "M":
          game.mode = "multi";
          this.mode = "multi";
          game.start();
          break;
        case "Escape":
          if (game.gameState === GAMESTATE.RUNNING)
            game.gameState = GAMESTATE.PAUSED;
          break;
      }
    });

    document.addEventListener("keyup", e => {
      switch (e.key) {
        case "a":
        case "d":
        case "A":
        case "D":
          player.stop();
        case "ArrowLeft":
        case "ArrowRight":
          if (this.mode == "single") player.stop();
          if (this.mode == "multi") this.game.player2.stop();
          break;
      }
    });

    document.addEventListener("click", e => {
      // console.log(e);
      let c = document.getElementById("gameScreen");
      let rect = c.getBoundingClientRect();
      // console.log(e.x - rect.left);
      game.handleClick(e.x - rect.left, e.y - rect.top);
    });
  }

  changeKeys(newKeys) {
    this.keys = newKeys;
  }
}
