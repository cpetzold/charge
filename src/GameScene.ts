import _ from "lodash";
import Phaser from "phaser";

import tiles from "../resources/tiles.png";
import DraggableCameraControl from "./DraggableCameraControl";

export default class GameScene extends Phaser.Scene {
  map: Phaser.Tilemaps.Tilemap;
  tileOutline: Phaser.GameObjects.Graphics;

  constructor() {
    super({
      key: "GameScene"
    });
  }

  preload() {
    this.load.image("tiles", tiles);
  }

  create() {
    this.map = this.make.tilemap({
      key: "map",
      tileWidth: 64,
      tileHeight: 64,
      width: 1000,
      height: 100
    });

    const tileset = this.map.addTilesetImage("tiles");
    this.map.createBlankDynamicLayer("tiles", tileset);

    console.log(this.map.width);

    const grid = this.add.grid(
      this.map.widthInPixels / 2,
      this.map.heightInPixels / 2,
      this.map.widthInPixels,
      this.map.heightInPixels,
      this.map.tileWidth,
      this.map.tileHeight,
      null,
      null,
      0x111111
    );

    grid.depth = -10;

    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
    this.cameras.main.scrollY = Infinity;

    new DraggableCameraControl({
      camera: this.cameras.main,
      input: this.input
    });

    this.tileOutline = this.add.graphics({
      lineStyle: { width: 1, color: 0xffffff }
    });

    const rect = new Phaser.Geom.Rectangle(
      0,
      0,
      this.map.tileWidth,
      this.map.tileHeight
    );
    this.tileOutline.strokeRectShape(rect);
  }

  update() {
    const pointerWorldX = this.input.mousePointer.x + this.cameras.main.scrollX;
    const pointerWorldY = this.input.mousePointer.y + this.cameras.main.scrollY;
    const overTilePos = this.map.worldToTileXY(pointerWorldX, pointerWorldY);
    const { x, y } = this.map.tileToWorldXY(overTilePos.x, overTilePos.y);

    this.tileOutline.x = x;
    this.tileOutline.y = y;

    if (this.input.mousePointer.isDown) {
      this.map.putTileAt(0, overTilePos.x, overTilePos.y);
    }
  }
}
