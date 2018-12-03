import _ from "lodash";
import Phaser from "phaser";

import tiles from "../resources/tiles.png";
import tilesExtruded from "../resources/tiles.extruded.png";
import DraggableCameraControl from "./DraggableCameraControl";

export default class GameScene extends Phaser.Scene {
  map: Phaser.Tilemaps.Tilemap;
  tileOutline: Phaser.GameObjects.Graphics;
  cameraControl: DraggableCameraControl;

  constructor() {
    super({
      key: "GameScene"
    });
  }

  preload() {
    this.load.image("tiles", tiles);
    this.load.image("tiles.extruded", tilesExtruded);
  }

  create() {
    this.map = this.make.tilemap({
      tileWidth: 64,
      tileHeight: 64,
      width: 100,
      height: 100
    });

    const tileset = this.map.addTilesetImage(
      "tiles",
      "tiles.extruded",
      64,
      64,
      1,
      2
    );
    this.map.createBlankDynamicLayer("tiles", tileset);

    const tileData = JSON.parse(localStorage.getItem("map"));
    tileData &&
      tileData.forEach((row, y) =>
        row.forEach((tileIndex, x) => this.map.putTileAt(tileIndex, x, y))
      );

    setInterval(() => {
      const map = this.map.layer.data.map(row => row.map(tile => tile.index));
      localStorage.setItem("map", JSON.stringify(map));
    }, 1000);

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

    this.cameraControl = new DraggableCameraControl({
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

    this.events.on("resize", this.onResize);
    this.onResize(this.game.canvas.width, this.game.canvas.height);
  }

  onResize = (width, height) => {
    const desiredWidth = this.map.tileWidth * 30;
    const desiredHeight = this.map.tileHeight * 16;
    const cameraHeight = Math.floor(width / (desiredWidth / desiredHeight));
    this.cameras.resize(width, cameraHeight);
    console.log({ desiredWidth, desiredHeight, width, height, cameraHeight });
    this.cameras.main.zoom = width / desiredWidth;
  };

  update() {
    const pointerWorld = this.cameras.main.getWorldPoint(
      this.input.mousePointer.x,
      this.input.mousePointer.y
    );
    const overTilePos = this.map.worldToTileXY(pointerWorld.x, pointerWorld.y);
    const { x, y } = this.map.tileToWorldXY(overTilePos.x, overTilePos.y);

    this.tileOutline.x = x;
    this.tileOutline.y = y;

    if (this.input.mousePointer.isDown && !this.cameraControl.dragging) {
      this.map.putTileAt(1, overTilePos.x, overTilePos.y);
    }
  }
}
