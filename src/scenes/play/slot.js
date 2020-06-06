import { SYMBOLS, SLOT_LIGHTS } from "../../services/assets-data";
import { rndArrayItem } from "../../utils/general-utils";

export default class Slot extends Phaser.GameObjects.Image {
  constructor(scene, x, y) {
    super(scene, x, y, 'atlas', 'slot_frame.png');
    scene.add.existing(this);

    this.nextSymbol = this.getRandomSymbolKey();
    this.spinDelay = 50;

    this.bg_black = this.scene.add.image(this.x, this.y, 'slot_bg_black');
    this.bg_white = this.scene.add.image(this.x, this.y, 'slot_bg_white');
    this.bg_white.alpha = 0;
    this.light = this.scene.add.image(this.x, this.y, 'atlas', 'slot_light_yellow.png');
    this.symbol = this.scene.add.image(this.x, this.y, 'atlas', this.getRandomSymbolKey());

    // this.scene.time.addEvent({
    //   delay: 10,
    // });

    // this.spin();
    // setTimeout(900, this.stopSpin.bind(this));

  }

  spin() {
    this.spinning = true;

    setTimeout(
      (() => {
        this.symbol.setTexture('atlas', this.nextSymbol);
        this.nextSymbol = this.getRandomSymbolKey(this.nextSymbol);
        if (this.spinning) {
          this.spin();
        } else {
          this.result();
        }
      }).bind(this),
      this.spinDelay,
    );
  }

  stopSpin(symbolindex) {
    this.spinning = false;
    if (typeof symbolindex !== 'undefined')
      this.nextSymbol = `symbols/${SYMBOLS[symbolindex]}`;
  }

  getRandomSymbolKey(previousKey) {
    let randomKey;
    do
      randomKey = `symbols/${rndArrayItem(SYMBOLS)}`;
    while (randomKey === previousKey)
    return randomKey;
  }

  setLight(index) {
    if (typeof SLOT_LIGHTS[index] !== 'undefined')
      this.light.setTexture('atlas', SLOT_LIGHTS[index]);
    else
      console.warn('Slot.js: Not valid light index.')
  }

  flash() {
    // if (typeof this.flashTwn !== 'undefined' && this.flashTwn.isPlaying) this.flashTwn.stop();

    this.flashTwn = this.scene.tweens.add({
      targets: this.bg_white,
      alpha: { from: 1, to: 0 },
      duration: 200,
    });

    this.scaleTwn = this.scene.tweens.add({
      targets: this.symbol,
      scaleX: { from: 1.1, to: 1 },
      scaleY: { from: 1.1, to: 1 },
      duration: 300,
    });
  }

  result() {
    // this.flash();
  }

  update() {

  }
}
