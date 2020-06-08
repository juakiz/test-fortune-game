import { createText } from "../../utils/general-utils";
import { SYMBOLS } from "../../services/assets-data";
import { SYMBOL_DATA } from "../../services/fake-server-call";

const SYMBOL_POS = {
  x: [
    -290,
    -240,
    20,
    70,
    120,
  ],
  y: [
    300,
    200,
    100,
    0,
    -100,
    -200,
    -300,
    // 400,
  ],
};

export default class PrizesList extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);
    scene.add.existing(this);

    this.scroll = this.scene.add.image(0, 0, 'atlas', 'note.png');
    this.add(this.scroll);

    this.title = createText(this.scene, {
      x: 10,
      y: -440,
      size: '64px',
      text: 'Prizes',
    })
      .setStroke('#333333', 8);
    this.add(this.title);

    this.createPrizes();
  }

  createPrizes() {
    const texts = this.texts = [];
    const gems = SYMBOL_POS.y.map((y, i) => {
      const textRow = [];
      const row = SYMBOL_POS.x.map((x, j) => {
        const key = `symbols/${SYMBOLS[i + 1]}`;
        const gem = this.scene.add.image(x, y, 'atlas', key)
          .setScale(0.6);
        this.add(gem);

        if (j === 1) {
          textRow.push(this.amountText(x, y, i, j));
        } else if (j === 4) {
          textRow.push(this.amountText(x, y, i, j));
        }

        return gem;
      });
      texts.push(textRow);
      return row;
    });

    const JackpotRow = [20-120, 70-120, 120-120].map((x) => {
        const gem = this.scene.add.image(x, 400, 'atlas', `symbols/${SYMBOLS[0]}`)
          .setScale(0.6);
        this.add(gem);
        return gem;
      });
    let prize = SYMBOL_DATA.VALUES[0] * this.scene.playScene.bid * 6;
    this.jackpotText = this.amountText(0, 400, 0).setText(`= ${prize}`);
  }

  amountText(x, y, i, j) {
    let prize = SYMBOL_DATA.VALUES[i + 1] * this.scene.playScene.bid;
    if (j === 4) prize *= 6;
    const txt = createText(this.scene, {
      x: x + 35,
      y,
      size: '46px',
      text: `= ${prize}`,
    })
      .setStroke('#333333', 8)
      .setOrigin(0, 0.5);
    this.add(txt);
    return txt;
  }

  modPrizes() {
    this.texts.forEach((el, i) => {
      const prize = SYMBOL_DATA.VALUES[i + 1] * this.scene.playScene.bid;
      el[0].setText(`= ${prize}`);
      el[1].setText(`= ${prize * 6}`);
    });
    const prize = SYMBOL_DATA.VALUES[0] * this.scene.playScene.bid * 6;
    this.jackpotText.setText(`= ${prize}`);
  }

  show() {
    this.modPrizes();
    this.alpha = 1;
    this.scene.playScene.input.enabled = false;
  }

  hide() {
    this.alpha = 0;
    this.scene.playScene.prizesText.once('pointerdown', this.scene.onShowPrizes, this.scene);
    setTimeout(() => this.scene.playScene.input.enabled = true, 50);
  }
}
