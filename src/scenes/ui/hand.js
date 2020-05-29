import RLC from "../../services/responsive-layout-calculator";

export default class Hand extends Phaser.GameObjects.Image {
  constructor(scene, delay = 0) {
    super(scene, 0, 0, 'atlas', 'finger.png');
    scene.add.existing(this);

    this.alpha = 0;

    this.resize();
    this.nag(delay);

    this.showTimer = this.scene.time.delayedCall(200, this.show, [], this);
    this.program();
  }

  nag(delay) {
    this.nagTwn = this.scene.tweens.add({
      targets: this,
      scaleX: 1.2,
      scaleY: 1.2,
      delay,
      ease: 'Sine.easeInOut',
      duration: 600,
      repeat: -1,
      yoyo: true,
    });
  }

  hide() {
    this.scene.events.emit('hideNag');
    this.hideTwn = this.scene.tweens.add({
      targets: this,
      alpha: 0,
      ease: 'Sine.easeInOut',
      duration: 100,
    });
  }

  show() {
    this.scene.events.emit('showNag');
    this.showTwn = this.scene.tweens.add({
      targets: this,
      alpha: 1,
      ease: 'Sine.easeInOut',
      duration: 1200,
    });

    const stopNag = () => {
      this.showTwn.stop();
      this.hide();
    };
    this.scene.input.once('pointerdown', stopNag, this);
    this.scene.input.keyboard.once('keydown', stopNag, this);
  }

  program() {
    const program = () => {
      this.showTimer.remove();
      this.showTimer = this.scene.time.delayedCall(1600, this.show, [], this);
    };
    this.scene.input.on('pointerdown', program, this);
    this.scene.input.keyboard.on('keydown', program, this);
  }

  resize() {
    this.x = RLC.CENTER_X;
    this.y = RLC.BOT - (this.displayHeight / 1.8);
  }
}
