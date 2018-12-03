import _ from "lodash";
import Phaser from "phaser";

import GameScene from "./GameScene";

export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);

    window.addEventListener("resize", _.debounce(this.onWindowResize, 250));
  }

  onWindowResize = () => {
    this.resize(window.innerWidth, window.innerHeight);
  };
}

new Game({
  width: window.innerWidth,
  height: window.innerHeight,
  canvasStyle: "position: fixed; top: 0; left: 0;",
  type: Phaser.WEBGL,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 }
    }
  },
  scene: GameScene
});
