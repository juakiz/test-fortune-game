import RLC from "../services/responsive-layout-calculator"

const COUNT = 10

export class Spinner extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene)

    this.radius = 72;
    this.pointRadius = 24;

    this.createPoints();
    this.run();
    this.updateDimensitons();

    scene.add.existing(this);
    this.once(Phaser.GameObjects.Events.DESTROY, this.stop);
  }

  createPoints() {
    for (let i = 0; i < COUNT; i++) {
      const point = this.scene.add.image(0, 0, 'spinner');
      this.add(point);
    }

    Phaser.Actions.SetAlpha(this.getAll(), 0, 1 / COUNT);
  }

  run() {
    this.rotationEvent = this.scene.time.addEvent({
      delay: 60,
      loop: true,
      callback: this.rotate,
      callbackScope: this,
    });
  }

  rotate() {
    this.rotation += Math.PI / COUNT * 2;
  }

  stop() {
    this.rotationEvent.destroy();
  }

  updateDimensitons() {
    this
      .setScale(RLC.SCALE)
      .setPosition(this.scene.scale.width / 2, this.scene.scale.height * 0.6);

    const points = this.getAll();
    points.forEach((point) => {
      const side = this.pointRadius * RLC.SCALE;
      point.setDisplaySize(side, side);
    })
    const circle = new Phaser.Geom.Circle(0, 0, this.radius * RLC.SCALE);
    Phaser.Actions.PlaceOnCircle(points, circle);
  }
}
