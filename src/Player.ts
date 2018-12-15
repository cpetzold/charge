import {
  Actor,
  CollisionType,
  Color,
  Engine,
  PreCollisionEvent,
  Side,
  Input,
  Vector
} from "cpetzold-excalibur";

import { playerTexture } from "./resources";

interface PlayerOptions {
  x: number;
  y: number;
}

export default class Player extends Actor {
  constructor({ x, y }: PlayerOptions) {
    super({
      x,
      y,
      width: 48,
      height: 60,
      color: Color.Red.clone(),
      collisionType: CollisionType.Active
    });
  }

  onInitialize(engine: Engine) {
    this.addDrawing(playerTexture);

    engine.input.keyboard.on("press", this.onKeyPress);
    this.on("precollision", this.onCollisionStart);
  }

  onKeyPress = (e: Input.KeyEvent) => {
    if (e.key === Input.Keys.Space) {
      this.jump();
    }
  };

  onCollisionStart = (e: PreCollisionEvent) => {
    // Landed on tilemap
    if (e.side === Side.Bottom && !e.other) {
      this.vel.y = 0;
    }
  };

  jump() {
    this.vel.y = -600;
  }

  update(engine: Engine, delta: number) {
    super.update(engine, delta);
    this.acc = Vector.Zero.clone();

    const { keyboard } = engine.input;

    const speed = 1000;
    if (keyboard.isHeld(Input.Keys.Left)) {
      this.acc.x = -speed;
    } else if (keyboard.isHeld(Input.Keys.Right)) {
      this.acc.x = speed;
    }

    this.vel.x *= 0.95;
  }
}
