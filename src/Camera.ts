import {
  BaseCamera,
  Engine,
  Vector,
  Input,
  Util,
  BoundingBox
} from "cpetzold-excalibur";

function isDragButton(button: Input.PointerButton): boolean {
  return (
    button === Input.PointerButton.Right ||
    button === Input.PointerButton.Middle
  );
}

interface CameraDrag {
  initialCameraPos: Vector;
  mouseDownPos: Vector;
}

export default class Camera extends BaseCamera {
  drag: CameraDrag;
  public bounds: BoundingBox = new BoundingBox(
    -Infinity,
    Infinity,
    Infinity,
    -Infinity
  );

  onInitialize(engine: Engine) {
    const { primary } = engine.input.pointers;
    primary.on("wheel", this.onMouseWheel);
    primary.on("down", this.onMouseDown);
    primary.on("up", this.onMouseUp);
    primary.on("move", this.onMouseMove);
  }

  get isDragging(): boolean {
    return !!this.drag;
  }

  set boundedPos(pos: Vector) {
    this.pos = new Vector(
      Util.clamp(pos.x, this.bounds.left, this.bounds.right),
      Util.clamp(pos.y, this.bounds.top, this.bounds.bottom)
    );
  }

  onMouseWheel = (e: Input.WheelEvent) => {
    this.boundedPos = this.pos.add(new Vector(e.deltaX, e.deltaY));
  };

  onMouseDown = (e: Input.PointerDownEvent) => {
    if (isDragButton(e.button)) {
      this.drag = {
        initialCameraPos: this.pos.clone(),
        mouseDownPos: e.screenPos.clone()
      };
    }
  };

  onMouseUp = (e: Input.PointerUpEvent) => {
    if (isDragButton(e.button)) {
      this.drag = null;
    }
  };

  onMouseMove = (e: Input.PointerMoveEvent) => {
    if (this.drag) {
      const { initialCameraPos, mouseDownPos } = this.drag;
      this.boundedPos = initialCameraPos.add(
        mouseDownPos.sub(e.screenPos).scale(1 / this.z)
      );
    }
  };
}
