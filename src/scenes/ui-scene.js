import RLC from '../services/responsive-layout-calculator';
import { FONT_FAMILY, FONT_COLOR, FONT_STROKE_COLOR } from '../services/settings';
import Counter from '../utils/counter-txt';
import Timer from '../utils/timer';
import Hand from './ui/hand';
import { createText } from '../utils/general-utils';

export default class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene');
  }

  create(data) {
    this.mainCam = this.cameras.main;
    this.mainCam.fadeIn(200);

    this.playScene = data.playScene;
    // Inside view GO

    // Border anchored GO
    const cfg = {
      duration: 10,
      durationPerUnit: true,
      style: {
        fontSize: '62px',
        fontFamily: FONT_FAMILY,
        color: FONT_COLOR,
        stroke: FONT_STROKE_COLOR,
        strokeThickness: 8,
      },
    };

    // Score
    this.scoreTxt = new Counter(this, 0, cfg)
      .setOrigin(1, 0.5);

    this.scoreTxt.resize = () => {
      this.scoreTxt.x = RLC.RIGHT - 30;
      this.scoreTxt.y = RLC.TOP + 50;
    };

    this.nagTxt = this.tapToPlay();

    this.handR = new Hand(this);

    // Events
    this.events.on('add-points', this.setScore, this);

    // Resize issue
    this.scale.on('resize', this.onResize, this);
    this.onResize();
  }

  tapToPlay() {
    const txt = createText(this, {
      text: 'TAP TO PLAY',
      size: '94px',
      strokeThickness: 12,
    });

    this.events.on('hideNag', () => { txt.alpha = 0; }, this);
    this.events.on('showNag', () => { if (!this.disableShooting) txt.alpha = 1; }, this);

    (txt.resize = () => {
      txt.x = RLC.CENTER_X;
      txt.y = RLC.BOT - txt.displayHeight - 240;
    })();

    return txt;
  }

  setScore() {
    const points = 10 + Math.floor(this.playScene.RWM.player.y / 10);
    this.scoreTxt.modCounter(points);
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
