import { BaseCamera, Engine } from "excalibur";

export default class Camera extends BaseCamera {
  onInitialize(engine: Engine) {
    const { primary } = engine.input.pointers;
    primary.on("wheel", this.onMouseWheel);
    primary.on("down", this.onMouseDown);
  }

  onMouseWheel = e => {
    this.x += e.deltaX;
    this.y += e.deltaY;
  };

  onMouseDown = e => {
    console.log(e);
  };
}
