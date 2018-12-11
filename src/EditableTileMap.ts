import { Cell, TileMap, Color } from "excalibur";
import _ from "lodash";

export default class EditableTileMap extends TileMap {
  public setCols(cols: number) {
    this.setSize(cols, this.rows);
  }

  public setRows(rows: number) {
    this.setSize(this.cols, rows);
  }

  public setSize(cols: number, rows: number) {
    let cells = _.chunk(this.data, this.cols);

    this.y += (this.rows - rows) * this.cellHeight;

    this.cols = cols;
    this.rows = rows;

    const newCell = (colIndex, rowIndex) =>
      new Cell(
        colIndex * this.cellWidth + this.x,
        rowIndex * this.cellHeight + this.y,
        this.cellWidth,
        this.cellHeight,
        rowIndex + colIndex * cols
      );

    if (cells.length >= rows) {
      cells = _.drop(cells, cells.length - rows);
    } else {
      cells = [
        ..._.times(rows - cells.length, rowIndex => {
          return _.times(cols, colIndex => newCell(colIndex, rowIndex));
        }),
        ...cells
      ];
    }

    cells = cells.map((row: Cell[], rowIndex) => {
      if (row.length >= cols) {
        return _.slice(row, 0, cols);
      } else {
        return [
          ...row,
          ..._.times(cols - row.length, colIndexOffset =>
            newCell(row.length + colIndexOffset, rowIndex)
          )
        ];
      }
    });

    this.data = _.flatten(cells);
  }

  draw(ctx: CanvasRenderingContext2D, delta: number) {
    const width = this.cols * this.cellWidth;
    const height = this.rows * this.cellHeight;
    ctx.save();
    ctx.strokeStyle = new Color(255, 255, 255, 0.1).toString();
    for (let x = 0; x < this.cols + 1; x++) {
      ctx.beginPath();
      ctx.moveTo(this.x + x * this.cellWidth, this.y);
      ctx.lineTo(this.x + x * this.cellWidth, this.y + height);
      ctx.stroke();
    }
    for (let y = 0; y < this.rows + 1; y++) {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y + y * this.cellHeight);
      ctx.lineTo(this.x + width, this.y + y * this.cellHeight);
      ctx.stroke();
    }
    ctx.restore();

    super.draw(ctx, delta);
  }
}
