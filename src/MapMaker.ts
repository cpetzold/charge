import * as dat from "dat.gui";
import {
  BoundingBox,
  Engine,
  Scene,
  SpriteSheet,
  TileSprite,
  Vector
} from "cpetzold-excalibur";
import Camera from "./Camera";
import EditableTileMap from "./EditableTileMap";
import { tilesTexture } from "./resources";
import Player from "./Player";

const TILE_SIZE = 64;
const MIN_COLS = 30;
const MAX_COLS = 100;
const MIN_ROWS = 16;
const MAX_ROWS = 100;

export default class MapMaker extends Scene {
  tilemap: EditableTileMap;
  dui: dat.GUI;

  cols: number = MIN_COLS;
  rows: number = MIN_ROWS;

  player: Player;

  constructor(dui: dat.GUI) {
    super();

    this.tilemap = new EditableTileMap({
      x: 0,
      y: 0,
      cellWidth: TILE_SIZE,
      cellHeight: TILE_SIZE,
      cols: this.cols,
      rows: this.rows
    });

    this.dui = dui;
    this.dui
      .add(this, "cols", MIN_COLS, MAX_COLS, 1)
      .onChange(this.onColsChange);
    this.dui
      .add(this, "rows", MIN_ROWS, MAX_ROWS, 1)
      .onChange(this.onRowsChange);
  }

  onInitialize(engine: Engine) {
    this.camera = new Camera();
    this.camera.pos = this.cameraSize.scale(0.5);
    this.updateCameraBounds();

    const tileSpriteSheet = new SpriteSheet({
      image: tilesTexture,
      spWidth: TILE_SIZE,
      spHeight: TILE_SIZE,
      rows: 1,
      columns: 2
    });
    this.tilemap.registerSpriteSheet("tiles", tileSpriteSheet);
    this.addTileMap(this.tilemap);

    this.updateCanvasSize(engine);
    this.updateCameraZoom(engine);

    window.addEventListener("resize", () => {
      this.updateCanvasSize(engine);
      this.updateCameraZoom(engine);
    });

    this.player = new Player({ x: 100, y: 100 });
    this.add(this.player);
  }

  onColsChange = newCols => {
    this.cols = newCols;
    this.tilemap.setCols(this.cols);
    this.updateCameraBounds();
  };

  onRowsChange = newRows => {
    this.rows = newRows;
    this.tilemap.setRows(this.rows);
    this.updateCameraBounds();
  };

  updateCameraBounds() {
    const halfCameraSize = this.cameraSize.scale(0.5);
    const camera: Camera = this.camera as Camera;
    camera.bounds = new BoundingBox(
      halfCameraSize.x,
      -this.tilemap.cellHeight * this.tilemap.rows + halfCameraSize.y * 3,
      this.tilemap.cellWidth * this.tilemap.cols - halfCameraSize.x,
      halfCameraSize.y
    );
  }

  updateCanvasSize(engine: Engine) {
    const desiredAspectRatio = this.cameraSize.x / this.cameraSize.y;
    const windowAspectRatio = window.innerWidth / window.innerHeight;

    if (windowAspectRatio < desiredAspectRatio) {
      engine.canvasWidth = window.innerWidth;
      engine.canvasHeight = window.innerWidth / desiredAspectRatio;
    } else {
      engine.canvasWidth = window.innerHeight * desiredAspectRatio;
      engine.canvasHeight = window.innerHeight;
    }
  }

  get cameraSize() {
    return new Vector(
      this.tilemap.cellWidth * MIN_COLS,
      this.tilemap.cellHeight * MIN_ROWS
    );
  }

  updateCameraZoom(engine: Engine) {
    this.camera.zoom(
      engine.canvasWidth / engine.pixelRatio / this.cameraSize.x
    );
  }

  update(engine: Engine, delta: number) {
    super.update(engine, delta);

    const { primary } = engine.input.pointers;
    if (primary.isDragging && !(this.camera as Camera).isDragging) {
      const { x, y } = primary.lastWorldPos;
      const cell = this.tilemap.getCellByPoint(x, y);
      if (cell) {
        cell.pushSprite(new TileSprite("tiles", 1));
        cell.solid = true;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, delta: number) {
    super.draw(ctx, delta);
  }
}
