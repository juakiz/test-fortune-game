const FONT_COLOR = '#000000';

export default class Timer extends Phaser.GameObjects.Text {
  constructor(scene, initialSeconds, cfg = {}) {
    super(scene, 0, 0, '', cfg.style || {});
    scene.add.existing(this);

    this.time = initialSeconds;
    this.ease = cfg.ease || 'Sine';

    this.alertTreshold = cfg.alertTreshold || 0;

    this.setText(this.convertSeconds(initialSeconds));
    // this.setOrigin(0.5, 0.5);
  }

  convertSeconds(sec_num) {
    var minutes = Math.floor((sec_num) / 60);
    var seconds = sec_num - (minutes * 60);

    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return minutes + ':' + seconds;
  }

  setTimer(value) {
    const difference = value - this.time;
    this.modTimer(difference);
  }

  modTimer(value) {
    this.time = Math.max(this.time + value, 0);
    this.setText(this.convertSeconds(this.time));
  }

  smallScaleTween() {
    if (this.scaleTwn) this.scaleTwn.stop();
    this.scaleTwn = this.scene.tweens.add({
      targets: this,
      scaleX: { from: 1.08, to: 1 },
      scaleY: { from: 1.08, to: 1 },
      duration: 300,
    });
  }

  start() {
    this.count = this.scene.time.addEvent({
      delay: 1000,
      callback: (() => {
        this.scene.events.emit('timer-update');
        this.modTimer(-1);
        this.blink();
        if (this.time <= 0 && this.onComplete) {
          this.onComplete();
        }
      }).bind(this),
      loop: true
    });
  }

  pause(bool) {
    this.count.paused = bool;
    if (this.blinkEvent) this.blinkEvent = bool;
  }

  stop() {
    this.count.remove();
    this.style.setColor(FONT_COLOR);
    this.setNormalStyle();
  }

  blink() {
    if (this.time <= this.alertTreshold && this.time !== 0) {
      this.style.setColor('#B33A3A');
      if (!this.blinkEvent)
        this.blinkEvent = this.scene.time.addEvent({
          delay: 500,
          callback: (() => {
            this.visible = !this.visible;
          }).bind(this),
          loop: true
        });
    } else {
      this.setNormalStyle();
    }
  }

  setNormalStyle() {
    if (this.blinkEvent) {
      this.blinkEvent.remove();
      delete this.blinkEvent;
      this.visible = true;
    }
    this.style.setColor(FONT_COLOR);
  }
}
