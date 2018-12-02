import _ from "lodash";
import Phaser from "phaser";

import GameScene from "./GameScene";

export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}

const game = new Game({
  width: window.innerWidth,
  height: window.innerHeight,
  canvasStyle: "position: fixed; top: 0; left: 0;",
  type: Phaser.AUTO,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 }
    }
  },
  scene: GameScene
});

window.addEventListener(
  "resize",
  _.debounce(() => game.resize(window.innerWidth, window.innerHeight), 250)
);
