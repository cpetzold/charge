import _ from "lodash";
import Phaser from "phaser";

export default class ResizableTilemap extends Phaser.Tilemaps.Tilemap {
  constructor(scene: Phaser.Scene, mapData: Phaser.Tilemaps.MapData) {
    super(scene, mapData);
  }

  setWidth(width: number) {
    this.setSize(width, this.height);
  }

  setHeight(height: number) {
    this.setSize(this.width, height);
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.widthInPixels = width * this.tileWidth;
    this.heightInPixels = height * this.tileHeight;

    // Update the layers
    this.layers.forEach((layer: Phaser.Tilemaps.LayerData) => {
      layer.width = width;
      layer.height = height;
      layer.widthInPixels = width * layer.tileWidth;
      layer.heightInPixels = height * layer.tileHeight;

      const newTile = (x, y) => {
        return new Phaser.Tilemaps.Tile(
          layer,
          -1,
          x,
          y,
          layer.tileWidth,
          layer.tileHeight,
          layer.tileWidth,
          layer.tileHeight
        );
      };

      if (layer.data.length >= height) {
        layer.data = _.drop(layer.data, layer.data.length - height);
        layer.data.forEach((row, y) =>
          row.forEach((tile: Phaser.Tilemaps.Tile) => {
            tile.y = y + (height - layer.data.length);
            tile.updatePixelXY();
          })
        );
      } else {
        layer.data = [
          ..._.times(height - layer.data.length, y => {
            return _.times(width, x => newTile(x, y));
          }),
          ...layer.data.map((row, y) =>
            row.map((tile: Phaser.Tilemaps.Tile) => {
              tile.y = y + (height - layer.data.length);
              tile.updatePixelXY();
              return tile;
            })
          )
        ];
      }

      layer.data = layer.data.map((row: Phaser.Tilemaps.Tile[], y) => {
        if (row.length >= width) {
          return _.slice(row, 0, width);
        } else {
          return [
            ...row,
            ..._.times(width - row.length, x => newTile(row.length + x, y))
          ];
        }
      });
    });
  }
}
