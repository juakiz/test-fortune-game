import RLC from '../services/responsive-layout-calculator';
import { FONT_FAMILY, FONT_COLOR, FONT_STROKE_COLOR, INITIAL_MONEY } from '../services/game-settings';
import Counter from '../utils/counter-txt';
import { setTextGradient } from '../utils/general-utils';
import InfoText from './ui/info-text';
import CoinsParticle from '../utils/animated-particle.js'
import BigWinChest from './ui/big-win-chest';

export default class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene');
  }

  create(data) {
    this.mainCam = this.cameras.main;
    this.mainCam.fadeIn(200);

    this.playScene = data.playScene;
    // Inside view GO

    // Money counter
    this.moneyTxt = new Counter(this, INITIAL_MONEY, {
      x: RLC.CENTER_X + 205,
      y: 132,
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
      .setOrigin(1, 0.5)
      .setStyle({ fontFamily: 'OSWALDblack', fontSize: '86px' })
      .setShadow(0, 3, '#808080', 11, false, true)
      .setPadding({ x: 6, y: 6 });

    this.moneyTxt.alpha = 0;

    setTextGradient(this.moneyTxt, [
      { percent: 0.1, color: '#feec4e' },
      { percent: 0.4, color: '#fde301' },
      { percent: 0.8, color: '#f0b809' },
    ]);

    this.infoTxt = new InfoText(this, RLC.CENTER_X, RLC.CENTER_Y + 25);

    this.chest = new BigWinChest(this, RLC.CENTER_X, RLC.CENTER_Y);

    this.createParticles();

    // Events
    this.events.on('add-points', this.setScore, this);

    // Resize issue
    this.scale.on('resize', this.onResize, this);
    this.onResize();
  }

  setScore() {
    const points = 10 + Math.floor(this.playScene.RWM.player.y / 10);
    this.moneyTxt.modCounter(points);
  }

  createParticles() {
    CoinsParticle.anim = this.anims.create({
      key: 'coin',
      frameRate: 15,
      frames: this.anims.generateFrameNames('atlas', {
        prefix: 'coins_big/coin-spinning',
        suffix: '.png',
        start: 0,
        end: 4,
        zeroPad: 1,
        outputArray: ['coins_big/coin-spinning0.png'],
      }),
      repeat: -1,
    });

    this.particles = this.add.particles();
    this.particles.defaultFrame = CoinsParticle.anim.frames[0].frame;
    this.emitter = this.particles.createEmitter({
      x: RLC.CENTER_X,
      y: RLC.CENTER_Y,
      particleClass: CoinsParticle,
      angle: { min: -150, max: -30 },
      speed: { min: 800, max: 1200 },
      quantity: 9,
      lifespan: 2000,
      gravityY: 2000,
      rotate: { min: -360, max: 360 },
      emitZone: {
        type: 'random',
        source: new Phaser.Geom.Rectangle(-400, -200, 800, 400),
      },
      on: false
    });
  }

  bigWinAnimation() {

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
