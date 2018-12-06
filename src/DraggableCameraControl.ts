import Phaser from "phaser";

export default class DraggableCameraControl {
  camera: Phaser.Cameras.Scene2D.Camera;
  input: Phaser.Input.InputPlugin;

  public dragging: boolean = false;
  downX: number;
  downY: number;
  initialScrollX: number;
  initialScrollY: number;

  constructor({ camera, input }) {
    this.camera = camera;
    this.input = input;

    this.input.on("pointerdown", this.onPointerDown);
    this.input.on("pointerup", this.onPointerUp);
    this.input.on("pointermove", this.onPointerMove);

    window.addEventListener("mousewheel", this.onMouseWheel);
  }

  onPointerDown = (pointer: Phaser.Input.Pointer) => {
    if (pointer.buttons === 2) {
      this.dragging = true;
      this.downX = pointer.x;
      this.downY = pointer.y;
      this.initialScrollX = this.camera.scrollX;
      this.initialScrollY = this.camera.scrollY;
    }
  };

  onPointerUp = (pointer: Phaser.Input.Pointer) => {
    if (pointer.buttons === 2) {
      this.dragging = false;
    }
  };

  onPointerMove = (pointer: Phaser.Input.Pointer) => {
    if (this.dragging) {
      this.camera.scrollX = this.camera.clampX(
        this.initialScrollX + (this.downX - pointer.x)
      );
      this.camera.scrollY = this.camera.clampY(
        this.initialScrollY + (this.downY - pointer.y)
      );
    }
  };

  onMouseWheel = (e: MouseWheelEvent) => {
    e.preventDefault();
    this.camera.setScroll(
      this.camera.clampX(this.camera.scrollX + e.deltaX),
      this.camera.clampY(this.camera.scrollY + e.deltaY)
    );
  };
}
