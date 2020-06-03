import RLC from "../../services/responsive-layout-calculator";

export default class Slot extends Phaser.GameObjects.Image {
  constructor(scene, x, y) {
    super(scene, x, y, 'atlas', 'slot_frame.png');
    scene.add.existing(this);

    this.light = this.scene.add.image(this.x, this.y, 'atlas', 'slot_light_yellow.png');
    this.symbol = this.scene.add.image(this.x, this.y, 'atlas', 'symbols/rainbow.png');
  }
}
