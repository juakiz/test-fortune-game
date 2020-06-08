export default class Counter extends Phaser.GameObjects.Text {
  constructor(scene, initialAmount, cfg = {}) {
    super(scene, cfg.x || 0, cfg.y || 0, '', cfg.style || {});
    scene.add.existing(this);

    this.amount = this.displayAmount = initialAmount;
    this.prefix = cfg.prefix || '';
    this.suffix = cfg.suffix || '';
    this.ease = cfg.ease || 'Sine';
    this.duration = cfg.duration;
    this.durationPerUnit = cfg.durationPerUnit;

    this.setText(this.prefix + initialAmount + this.suffix);
    this.setOrigin(0.5);
  }

  setCounter(value) {
    const difference = value - this.amount;
    this.modCounter(difference);
  }

  modCounter(value) {
    this.amount = Math.max(this.amount + value, 0);
    const duration = this.durationPerUnit ?
      Math.abs(value * this.duration) :
      this.duration;
    this.displayTween(duration);
  }

  displayTween(duration) {
    const { prefix, suffix, amount } = this;

    if (this.modCounterTwn) {
      this.modCounterTwn.stop();
      if (this.resize) this.resize();
    }

    // const scaleMod = 1.08;
    // const originOffset = {
    // 	x0: this.x,
    // 	y0: this.y,
    // 	x: this.x + (this.originX - 0.5) * (this.displayWidth / 2) * (scaleMod - 1),
    // 	y: this.y + (this.originY - 0.5) * (this.displayHeight / 2) * (scaleMod - 1),
    // };


    // let lastValue;
    this.modCounterTwn = this.scene.tweens.add({
      targets: this,
      displayAmount: amount,
      ease: this.ease,
      duration,
      onUpdate: ((tween, targets) => {
        const rounded = Math.round(this.displayAmount);
        this.setText(prefix + rounded + suffix);
        // if (lastValue !== rounded) {
        // 	this.smallScaleTween(scaleMod, originOffset);
        // 	lastValue = rounded;
        // 	if (this.onChange) this.onChange();
        // }
      }).bind(this),
      onComplete: ((tween, targets) => {
        if (this.onComplete) this.onComplete();
      }).bind(this),
    });
  }

  smallScaleTween(scaleMod, originOffset) {
    if (this.scaleTwn) this.scaleTwn.stop();
    this.scaleTwn = this.scene.tweens.add({
      targets: this,
      scaleX: { from: scaleMod, to: 1 },
      scaleY: { from: scaleMod, to: 1 },
      x: { from: originOffset.x, to: originOffset.x0 },
      y: { from: originOffset.y, to: originOffset.y0 },
      duration: this.durationPerUnit / 2,
    });
  }
}
