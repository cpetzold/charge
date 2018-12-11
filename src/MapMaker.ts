import * as dat from "dat.gui";
import {
  Engine,
  Loader,
  Scene,
  SpriteSheet,
  Texture,
  TileSprite,
  Vector
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
    this.camera = new Camera();

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

  onColsChange = newCols => {
    this.cols = newCols;
    this.tilemap.setCols(this.cols);
  };

  onRowsChange = newRows => {
    this.rows = newRows;
    this.tilemap.setRows(this.rows);
  };

  onInitialize(engine: Engine) {
    this.updateCamera(engine);

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
  }

  updateCamera(engine: Engine) {
    const desiredWidth = this.tilemap.cellWidth * MIN_COLS;
    const desiredHeight = this.tilemap.cellHeight * MIN_ROWS;

    this.camera.zoom(engine.canvasWidth / engine.pixelRatio / desiredWidth);
    this.camera.pos = new Vector(desiredWidth / 2, desiredHeight / 2);
  }

  update(engine: Engine, delta: number) {
    super.update(engine, delta);

    const { primary } = engine.input.pointers;
    if (primary.isDragging) {
      const { x, y } = primary.lastWorldPos;
      const cell = this.tilemap.getCellByPoint(x, y);
      if (cell) {
        cell.pushSprite(new TileSprite("tiles", 1));
      }
    }

    // this.updateCamera(engine);
  }

  draw(ctx: CanvasRenderingContext2D, delta: number) {
    super.draw(ctx, delta);
  }
}
