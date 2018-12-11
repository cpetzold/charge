// import Phaser from "phaser";

// export default class Player extends Phaser.GameObjects.Container {
//   cursors: Phaser.Input.Keyboard.CursorKeys;

//   constructor(scene: Phaser.Scene, x?: number, y?: number) {
//     super(scene, x, y);

//     const rect = scene.add.rectangle(24, 30, 48, 60, 0xffffff);
//     this.add(rect);

//     scene.physics.add.existing(this);

//     this.arcadeBody.width = 48;
//     this.arcadeBody.height = 60;
//     this.arcadeBody.useDamping = true;
//     this.arcadeBody.setDragX(0.95);

//     this.arcadeBody.setMaxVelocity(800);

//     this.cursors = scene.input.keyboard.createCursorKeys();
//   }

//   get arcadeBody() {
//     return this.body as Phaser.Physics.Arcade.Body;
//   }

//   jump() {
//     this.arcadeBody.setVelocityY(-500);
//   }

//   update() {
//     super.update();

//     const speed = this.cursors.shift.isDown ? 800 : 500;

//     this.arcadeBody.setMaxVelocity(speed);

//     let accX = 0;
//     if (this.cursors.right.isDown) {
//       accX = speed;
//     } else if (this.cursors.left.isDown) {
//       accX = -speed;
//     }
//     this.arcadeBody.setAccelerationX(accX);

//     if (this.cursors.space.isDown && this.arcadeBody.onFloor()) {
//       this.jump();
//     }
//   }
// }
