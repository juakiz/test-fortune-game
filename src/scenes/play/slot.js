import { SYMBOLS, SLOT_LIGHTS } from "../../services/assets-data";
import { rndArrayItem } from "../../utils/general-utils";

export default class Slot extends Phaser.GameObjects.Image {
  constructor(scene, x, y) {
    super(scene, x, y, 'atlas', 'slot_frame.png');
    scene.add.existing(this);

    this.light = this.scene.add.image(this.x, this.y, 'atlas', 'slot_light_yellow.png');
    this.symbol = this.scene.add.image(this.x, this.y, 'atlas', 'symbols/rainbow.png');

    // this.scene.time.addEvent({
    //   delay: 10,
    // });
  }

  setSymbol(index) {
    if (typeof SYMBOLS[index] !== 'undefined')
      this.symbol.setTexture('atlas', `symbols/${SYMBOLS[index]}`);
    else
      console.warn('Slot.js: Tried to set an outranged symbol.')
  }

  setRandomSymbol() {
    this.symbol.setTexture('atlas', `symbols/${rndArrayItem(SYMBOLS)}`);
  }

  setLight(index) {
    if (typeof SLOT_LIGHTS[index] !== 'undefined')
      this.symbol.setTexture('atlas', `symbols/${SLOT_LIGHTS[index]}`);
    else
      console.warn('Slot.js: Not valid light index.')
  }
}
