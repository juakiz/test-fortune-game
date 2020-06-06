import RLC from '../services/responsive-layout-calculator';
import { FONT_FAMILY, FONT_COLOR, FONT_STROKE_COLOR, INITIAL_MONEY } from '../services/game-settings';
import Counter from '../utils/counter-txt';
import Timer from '../utils/timer';import { createText } from '../utils/general-utils';
import GradientText from './ui/gradient-text';

export default class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene');
  }

  create(data) {
    this.mainCam = this.cameras.main;
    this.mainCam.fadeIn(200);

    this.playScene = data.playScene;
    // Inside view GO

    // Score
    this.moneyTxt = new Counter(this, INITIAL_MONEY, {
      duration: 5,
      durationPerUnit: true,
      suffix: ' kr',
      style: {
        fontSize: '46px',
        fontFamily: FONT_FAMILY,
        color: FONT_COLOR,
        stroke: FONT_STROKE_COLOR,
        strokeThickness: 8,
      },
    })
      .setOrigin(1, 0.5);
    // this.moneyTxt.modCounter(2500);

    this.moneyTxt.setStyle({ fontFamily: 'OSWALDblack', fontSize: '86px' });
    this.moneyTxt.setStroke();
    this.moneyTxt.setShadow(0, 3, '#808080', 11, false, true);
    this.moneyTxt.setPadding({ x: 6, y: 6 });

    var gradient = this.moneyTxt.context.createLinearGradient(0, 0, 0, this.moneyTxt.displayHeight);

    // Gold
    gradient.addColorStop(0.1, '#feec4e');
    gradient.addColorStop(0.4, '#fde301');
    gradient.addColorStop(0.8, '#f0b809');

    // Metal
    // gradient.addColorStop(0, '#111111');
    // gradient.addColorStop(.5, '#ffffff');
    // gradient.addColorStop(.5, '#aaaaaa');
    // gradient.addColorStop(1, '#111111');

    this.moneyTxt.setFill(gradient);

    this.moneyTxt.resize = () => {
      this.moneyTxt.x = RLC.CENTER_X + 205;
      this.moneyTxt.y = 132;
    };

    this.nagTxt = this.tapToPlay();

    // Events
    this.events.on('add-points', this.setScore, this);

    // Resize issue
    this.scale.on('resize', this.onResize, this);
    this.onResize();
  }

  tapToPlay() {
    // const txt = createText(this, {
    //   // fontFamily: 'OSWALDblack',
    //   text: /* '0123456789',// */'PUSH BUTTON!',
    //   size: '94px',
    //   strokeColor: '#dddddd',
    //   // strokeThickness: 12,
    // });

    // var gradient = txt.context.createLinearGradient(0, 0, 0, txt.displayHeight);
    // gradient.addColorStop(0, '#111111');
    // gradient.addColorStop(.5, '#ffffff');
    // gradient.addColorStop(.5, '#aaaaaa');
    // gradient.addColorStop(1, '#111111');
    // txt.setFill(gradient);

    const txt = new GradientText(this, RLC.CENTER_X, RLC.CENTER_Y + 25, {
        // fontFamily: 'OSWALDblack',
        text: /* '0123456789',// */'PUSH BUTTON!',
        size: '84px',
    });

    this.events.on('hideNag', () => { txt.alpha = 0; }, this);
    this.events.on('showNag', () => { if (!this.disableShooting) txt.alpha = 1; }, this);

    // (txt.resize = () => {
    //   txt.x = RLC.CENTER_X;
    //   txt.y = RLC.CENTER_Y + 25;
    // })();

    return txt;
  }

  setScore() {
    const points = 10 + Math.floor(this.playScene.RWM.player.y / 10);
    this.moneyTxt.modCounter(points);
  }

  removeListeners() {
    this.events.off('add-points');
  }

  onResize(gameSize, baseSize, displaySize, resolution) {
    // this.mainCam.setSize(this.scale.gameSize.width, this.scale.gameSize.height);
    this.children.list.forEach(children => { if (children.resize) children.resize(); });
    this.mainCam.setZoom(RLC.SCALE);
    this.mainCam.centerOn(RLC.CENTER_X, RLC.CENTER_Y);
  }

  update(time, delta) {
    this.children.list.forEach(children => { if (children.update) children.update(); });
  }
}
