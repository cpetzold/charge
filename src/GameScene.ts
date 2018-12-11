// import _ from "lodash";
// import Phaser from "phaser";
// import * as dat from "dat.gui";

// import tiles from "../resources/tiles.png";
// import tilesExtruded from "../resources/tiles.extruded.png";
// import DraggableCameraControl from "./DraggableCameraControl";
// import ResizableTilemap from "./ResizableTilemap";
// import Player from "./Player";

// const MIN_MAP_WIDTH = 30;
// const MAX_MAP_WIDTH = 100;
// const MIN_MAP_HEIGHT = 16;
// const MAX_MAP_HEIGHT = 100;

// export default class GameScene extends Phaser.Scene {
//   map: ResizableTilemap;
//   grid: Phaser.GameObjects.Grid;
//   tileOutline: Phaser.GameObjects.Graphics;
//   cameraControl: DraggableCameraControl;
//   gui: dat.GUI;

//   debug: boolean = true;
//   mapDebugGraphics: Phaser.GameObjects.Graphics;

//   mapWidth: number = MIN_MAP_WIDTH;
//   mapHeight: number = MIN_MAP_HEIGHT;

//   player: Player;

//   shift: Phaser.Input.Keyboard.Key;

//   constructor() {
//     super({
//       key: "GameScene"
//     });

//     this.gui = new dat.GUI();
//     this.gui.add(this, "debug", true);
//     this.gui
//       .add(this, "mapWidth", MIN_MAP_WIDTH, MAX_MAP_WIDTH, 1)
//       .onChange(this.onMapWidthChange);
//     this.gui
//       .add(this, "mapHeight", MIN_MAP_HEIGHT, MAX_MAP_HEIGHT, 1)
//       .onChange(this.onMapHeightChange);
//   }

//   onMapWidthChange = width => {
//     this.map.setWidth(width);
//     this.updateSizes();
//   };

//   onMapHeightChange = height => {
//     const originalScrollY = this.cameras.main.scrollY;
//     const diff = height * this.map.tileHeight - this.map.heightInPixels;
//     this.map.setHeight(height);
//     this.updateSizes();
//     if (diff > 0) {
//       this.cameras.main.scrollY += diff;
//     } else {
//       this.cameras.main.scrollY = originalScrollY;
//     }
//   };

//   updateSizes() {
//     this.grid.width = this.map.widthInPixels;
//     this.grid.height = this.map.heightInPixels;
//     this.cameras.main.setBounds(
//       0,
//       0,
//       this.map.widthInPixels,
//       this.map.heightInPixels
//     );
//   }

//   preload() {
//     this.load.image("tiles", tiles);
//     this.load.image("tiles.extruded", tilesExtruded);
//   }

//   create() {
//     this.player = new Player(this, 100, 100);
//     this.children.add(this.player);

//     this.map = new ResizableTilemap(
//       this,
//       new Phaser.Tilemaps.MapData({
//         tileWidth: 64,
//         tileHeight: 64,
//         width: this.mapWidth,
//         height: this.mapHeight
//       })
//     );

//     const tileset = this.map.addTilesetImage(
//       "tiles",
//       "tiles.extruded",
//       64,
//       64,
//       1,
//       2
//     );
//     this.map.createBlankDynamicLayer("tiles", tileset);
//     this.map.putTilesAt(_.times(10, () => 1), 0, this.map.height - 1);

//     this.map.setCollision(1, true);

//     this.mapDebugGraphics = this.add.graphics();

//     const tileData = JSON.parse(localStorage.getItem("map"));
//     tileData &&
//       tileData.forEach((row, y) =>
//         row.forEach((tileIndex, x) => this.map.putTileAt(tileIndex, x, y))
//       );

//     setInterval(() => {
//       const map = this.map.layer.data.map(row => row.map(tile => tile.index));
//       localStorage.setItem("map", JSON.stringify(map));
//     }, 1000);

//     this.grid = this.add.grid(
//       this.map.widthInPixels / 2,
//       this.map.heightInPixels / 2,
//       this.map.widthInPixels,
//       this.map.heightInPixels,
//       this.map.tileWidth,
//       this.map.tileHeight,
//       null,
//       null,
//       0x000000,
//       0.2
//     );

//     this.grid.depth = -10;

//     this.cameras.main.setBounds(
//       0,
//       0,
//       this.map.widthInPixels,
//       this.map.heightInPixels
//     );
//     this.cameras.main.scrollY = Infinity;
//     this.cameras.main.setBackgroundColor(0xb8d0f7);

//     this.cameraControl = new DraggableCameraControl({
//       camera: this.cameras.main,
//       input: this.input
//     });

//     this.tileOutline = this.add.graphics({
//       lineStyle: { width: 1, color: 0x000000 }
//     });

//     const rect = new Phaser.Geom.Rectangle(
//       0,
//       0,
//       this.map.tileWidth,
//       this.map.tileHeight
//     );
//     this.tileOutline.strokeRectShape(rect);

//     this.events.on("resize", this.onResize);
//     this.onResize(this.game.canvas.width, this.game.canvas.height);

//     this.physics.add.collider(this.player, this.map.layer.tilemapLayer);

//     this.shift = this.input.keyboard.addKey("SHIFT");
//   }

//   onResize = (width, height) => {
//     const desiredWidth = this.map.tileWidth * 30;
//     const desiredHeight = this.map.tileHeight * 16;
//     const cameraHeight = Math.floor(width / (desiredWidth / desiredHeight));
//     this.cameras.resize(width, cameraHeight);
//     this.cameras.main.zoom = width / desiredWidth;
//   };

//   update() {
//     this.player.update();

//     const pointerWorld = this.cameras.main.getWorldPoint(
//       this.input.mousePointer.x,
//       this.input.mousePointer.y
//     );
//     const overTilePos = this.map.worldToTileXY(pointerWorld.x, pointerWorld.y);
//     const { x, y } = this.map.tileToWorldXY(overTilePos.x, overTilePos.y);

//     this.tileOutline.x = x;
//     this.tileOutline.y = y;

//     if (this.input.mousePointer.isDown && !this.cameraControl.dragging) {
//       if (this.shift.isDown) {
//         this.map.removeTileAt(overTilePos.x, overTilePos.y);
//       } else {
//         this.map.putTileAt(1, overTilePos.x, overTilePos.y);
//       }
//     }

//     this.mapDebugGraphics.clear();
//     if (this.debug) {
//       this.map.renderDebug(this.mapDebugGraphics, { faceColor: null });
//     }
//   }
// }
