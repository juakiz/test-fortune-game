import { createText } from "../../utils/general-utils";

export default class GradientText extends Phaser.GameObjects.Container {
  constructor(scene, x, y, style, gradientData) {
    super(scene, x, y);
    scene.add.existing(this);

    const verticalPositions = [0, -50, 50];

    this.texts = verticalPositions.map(vPos => {
      const text = createText(scene, style);
      text.setStroke('#333333', 12);

      text.y = vPos;

      var gradient = text.context.createLinearGradient(0, 0, 0, text.displayHeight);
      gradient.addColorStop(0, '#111111');
      gradient.addColorStop(.5, '#ffffff');
      gradient.addColorStop(.5, '#aaaaaa');
      gradient.addColorStop(1, '#333333');
      text.setFill(gradient);

      this.add(text);

      return text;
    });

    this.threeDotsAnimStart();
    this.setText('Push the\nbutton to Spin!');
  }

  setText(text, isDots = false) {
    if(!isDots) this.threeDotsAnimStop();

    const splitText = text.split("\n");
    if (splitText.length === 1) {
      this.texts[0].setText(splitText[0]);
      this.texts[1].visible = this.texts[2].visible = false;
      this.texts[0].visible = true;
    } else if (splitText.length === 2) {
      splitText.forEach((string, index) => {
        this.texts[index + 1].setText(string);
      });
      this.texts[1].visible = this.texts[2].visible = true;
      this.texts[0].visible = false;
    } else {
      console.warn('Too long string');
    }
  }

  threeDotsAnimStart() {
    let dotCounter = 0;

    this.threeDotsTimer = this.scene.time.addEvent({
      delay: 400,
      loop: true,
      callback: (() => {
        let string = '';
        for (let i = 0; i <= dotCounter; i++) {
          string += ' .';
        }
        dotCounter = (dotCounter + 1) % 4;
        this.setText(string, true);
      }).bind(this),
    });
  }

  threeDotsAnimStop() {
    this.threeDotsTimer && this.threeDotsTimer.remove();
  }

  applyProp(prop, value) {
    this.texts.forEach(text => text[prop] = value);
  }

  applyFunc(func, ...args) {
    this.texts.forEach(text => {
      args.shift(text);
      func.apply(this, args);
    });
  }
}
