import { createText, setTextGradient } from "../../utils/general-utils";

export default class InfoText extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);
    scene.add.existing(this);

    const verticalPositions = [0, -50, 50];

    this.texts = verticalPositions.map(vPos => {
      const text = createText(scene, { size: '84px' });
      text.setStroke('#333333', 12);

      text.visible = false;

      text.y = vPos;

      setTextGradient(text, [
        { percent: 0, color: '#111111' },
        { percent: 0.5, color: '#ffffff' },
        { percent: 0.5, color: '#aaaaaa' },
        { percent: 1, color: '#333333' },
      ]);

      this.add(text);

      return text;
    });

    // this.readyText();
  }

  readyText() {
    this.setText('Push the\nbutton to Spin!');
  }

  setText(text, isDots = false) {
    if (!isDots) this.dotsAnimStop();
    if (this.scaleInTwn && this.scaleInTwn.isPlaying){
      this.scaleInTwn.stop();
      this.setScale(1);
    }

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

  dotsAnimStart() {
    let dotCounter = 0;
    let printDots;

    (printDots = () => {
      let string = '';
      for (let i = 0; i <= dotCounter; i++) {
        string += ' .';
      }
      dotCounter = (dotCounter + 1) % 4;
      this.setText(string, true);
    })();

    this.dotsTimer = this.scene.time.addEvent({
      delay: 600,
      loop: true,
      callback: printDots.bind(this),
    });
  }

  dotsAnimStop() {
    this.dotsTimer && this.dotsTimer.remove();
  }

  scaleIn(duration, delay = 0, repeat = 0) {
    this.setScale(0, 0);
    this.scaleInTwn = this.scene.tweens.add({
      targets: this,
      scaleX: 1,
      scaleY: 1,
      ease: 'back',
      duration,
      repeat,
      delay,
    });
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
