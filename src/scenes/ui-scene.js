import RLC from '../services/responsive-layout-calculator';
import InfoText from './ui/info-text';
import CoinsParticle from '../utils/animated-particle.js'
import BigWinChest from './ui/big-win-chest';
import PrizesList from './ui/prizes-list';

export default class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene');
  }

  create(data) {
    this.mainCam = this.cameras.main;
    this.mainCam.fadeIn(600);

    this.playScene = data.playScene;
    // Inside view GO

    this.infoTxt = new InfoText(this, RLC.CENTER_X, RLC.CENTER_Y + 25);

    this.chest = new BigWinChest(this, RLC.CENTER_X, RLC.CENTER_Y);

    this.createParticles();

    this.prizeList = new PrizesList(this, RLC.CENTER_X, RLC.CENTER_Y);
    this.prizeList.alpha = 0;

    // Resize issue
    this.scale.on('resize', this.onResize, this);
    this.onResize();
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

  onShowPrizes() {
    this.prizeList.show();
    this.input.once('pointerdown', this.prizeList.hide, this.prizeList);
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
