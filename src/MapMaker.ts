import * as dat from "dat.gui";
import {
  Engine,
  Loader,
  Scene,
  SpriteSheet,
  Texture,
  TileSprite,
  Vector,
  BoundingBox
} from "excalibur";
import tilesPNG from "../resources/tiles.png";
import EditableTileMap from "./EditableTileMap";
import Camera from "./Camera";

const TILE_SIZE = 64;
const MIN_COLS = 30;
const MAX_COLS = 100;
const MIN_ROWS = 16;
const MAX_ROWS = 100;

export default class MapMaker extends Scene {
  loader: Loader;
  tilemap: EditableTileMap;
  dui: dat.GUI;

  cols: number = MIN_COLS;
  rows: number = MIN_ROWS;

  constructor(dui: dat.GUI, loader: Loader) {
    super();

    this.loader = loader;

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

    const tileTexture = new Texture(tilesPNG);
    this.loader.addResource(tileTexture);

    const tileSpriteSheet = new SpriteSheet({
      image: tileTexture,
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

  updateCanvasSize(engine) {
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
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, delta: number) {
    super.draw(ctx, delta);
  }
}
